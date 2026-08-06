---
status: polish
name: pr-comment-review
description: >
  Audit and remediate an open GitHub PR's review feedback: verify Copilot and Codex actually
  reviewed, drive every unresolved thread to a fix-or-justify reply, correct PR title/description
  drift against the real diff, and run a one-time self-review pass. Trigger on "have all PR
  comments been addressed", "did copilot and codex review this", "reply to the PR comments",
  "address the PR feedback", "is this PR ready to merge", "clean up this PR before merging",
  "make sure nothing got missed on this PR" — and on generic "review comments" mentions, on
  single-bot mentions, and when prepping a new PR for review before comments exist. Not a fresh
  review of an unpushed working diff; that's `/code-review`.
argument-hint: "optional: PR number or URL (defaults to the PR for the current branch)"
allowed-tools: Bash, Read, Edit, Write, Grep, Glob, Agent
disable-model-invocation: false
user-invocable: true
---

Remediation workflow for an existing PR. Bot threads rot: unresolved thread, PR merges, the
"minor" finding was the real one. Every step below exists to close that gap.

GitHub MCP tools are preferred when loaded
(`ToolSearch("select:mcp__plugin_github_github__pull_request_read")`); `gh api` equivalents are
given inline.

## 1. Resolve the PR

Given a number/URL, use it. Otherwise:

```bash
gh pr view --json number,title,body,url,isDraft,baseRefName,headRefName
```

`owner`/`repo` come from whichever identified the PR. A supplied URL carries its own
`owner`/`repo` — parse them from it, because the PR may live in a repo the current checkout isn't
(same number, different repo, and every read and reply would land on a stranger's PR). Fall back
to `git remote -v` (origin) only for a bare number or the current-branch case.

No open PR for the branch → say so and stop. Don't guess.

## 2. Confirm both required bots reviewed

- Copilot: `copilot-pull-request-reviewer[bot]`
- Codex: `chatgpt-codex-connector[bot]`

```
pull_request_read(method="get_reviews" | "get_comments", owner, repo, pullNumber)
# gh api --paginate repos/{owner}/{repo}/pulls/{pr}/reviews  |  .../issues/{pr}/comments
```

Read every page before concluding anyone is absent. `gh api` returns one page by default, so a
bot that reviewed after 30 other events looks missing without `--paginate`; the MCP tool pages
via `perPage` + the `after` cursor from `pageInfo`.

A missing bot is a diagnosis, not a shrug. Diagnose per bot — they have independent
configurations, so one explanation rarely covers both:

- **Draft PR** — check `isDraft`. This only explains Copilot if the repo has *not* enabled
  **Review draft pull requests** in its ruleset; with that on, a draft is no explanation at all
  and you need a different cause.
- **Pending** — last push minutes ago; report the timestamp instead of "absent".
- **No prior review history** — check whether the bot has ever commented on any PR here:

  ```bash
  gh api -X GET search/issues -f q="repo:{owner}/{repo} commenter:app/{bot-slug}" --jq '.total_count'
  ```

  `-X GET` is required — `-f` alone makes `gh` POST, and search answers with a bare `404` that
  reads like a missing repo. `{bot-slug}` is the login without the `[bot]` suffix.

  Report a `0` as **"no prior comments in this repo"** — never as "not installed". A freshly
  installed app, or one enabled before its first eligible PR, returns exactly the same `0`, and
  calling that an installation problem sends the user to fix something that isn't broken.
  Upgrade to "not installed" only with direct evidence: the app absent from
  `gh api repos/{owner}/{repo}/installation` or from the repo's settings.
- **Other** — state the evidence. Never "reason unclear"; if inconclusive, say what you checked
  and what came back, so the user doesn't re-derive it.

## 3. Drive every unresolved thread to a conclusion

```
pull_request_read(method="get_review_comments", owner, repo, pullNumber)
```

Returns `review_threads[]`, each with `is_resolved` / `is_outdated` / `is_collapsed` and its
comments — snake\_case in the payload, even though the tool description spells them camelCase.
Page with `perPage` + `after` until `pageInfo.hasNextPage` is false; an unresolved thread on page
two counts exactly as much as one on page one.

The `gh api` fallback can't do this: REST `/pulls/{pr}/comments` returns flat comment records with
no thread resolution state. If you're on the fallback path, get it from GraphQL:

```bash
gh api graphql -f query='query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){
  pullRequest(number:$n){reviewThreads(first:100){nodes{id isResolved isOutdated
  comments(first:100){nodes{databaseId author{login} path line body}}}}}}}' \
  -f o={owner} -f r={repo} -F n={pr}
```

Covers all sources — both bots, humans, SonarQube, Dependabot. For each unresolved thread:

1. Read the finding against the **current** code at that location, not the quoted hunk — code
   moves.
2. Fix or justify per §6.
3. Fixing → implement under the `code-implementation` skill's loop (research, implement, verify).
4. Reply **in that thread**, never a new top-level comment. `commentId` is the numeric id from
   `#discussion_r<id>`, not the GraphQL node id:
   ```
   add_reply_to_pull_request_comment(owner, repo, pullNumber, commentId, body)
   # gh api repos/{owner}/{repo}/pulls/{pr}/comments/{comment_id}/replies -f body="..."
   ```
   State what changed (with commit ref once pushed) or exactly why nothing did. Leave threads
   unresolved unless the user says otherwise — resolution is a human checkpoint.

## 4. Check the PR's story against its diff

```
pull_request_read(method="get_diff" | "get_files", owner, repo, pullNumber)
```

Drift runs both ways: **undersold** (diff does things the body never mentions — drive-by fix,
dep bump, config change), **oversold** (body claims what the diff doesn't do, or describes a
superseded approach), **title scope mismatch** (title vs. what the diff actually touches).

Fix via `update_pull_request` / `gh pr edit`. Metadata correction — GitHub's edit history is the
trail, so no comment needed.

## 5. Self-review — once per PR, not per invocation

Only fixing what bots flagged outsources your judgment. But most invocations are a status check
or a follow-up on new comments, not the first pass.

Check for the marker `<!-- pr-comment-review:self-reviewed -->` in the PR's comments/reviews
first. Present → skip to §6 and say so ("self-review already done in <link>; say 'redo the
self-review' to force a fresh pass"). Run a fresh pass only if absent or explicitly requested.

Delegate the pass, scaled to risk:

- **Default**: `/code-review` at default effort — single pass, proportionate.
- **`high`+ only when warranted**: auth/security-sensitive code, unusually large diff, or the
  user asked for depth. Multi-agent review costs real time and tokens.

Findings follow §6. With no existing thread to reply to, post a fresh review comment at the
relevant line — the one case where a new comment is correct — so the reasoning is in-context,
not just in your report. Leave the marker comment in place afterward.

## 6. No deferrals

**Every finding — either bot, human, or §5 — gets a fix or a specific, substantive reason it
won't be fixed. Neither is skippable.**

"Minor", "nitpick", "irrelevant", "follow-up" are not reasons; they're what gets written when no
decision was made. A real reason is independently verifiable by another engineer: touches an
unrelated module, needs a design decision only the user can make, depends on unlanded work,
would break an API this PR doesn't own.

A finding that needs a genuine tradeoff decision → stop and ask. Never invent a justification to
keep moving.

## 7. Verify, commit, report

Run the repo's verification loop (`make ai-checks` if present, else build + lint + test +
secretlint) before committing. Atomic commits, one logical fix each, matching recent `git log`
conventions.

**Do not push** unless this turn's invocation authorizes it. Default is commit and report "ready
to push".

```
## Reviewer presence
- Copilot: [present | absent — reason]
- Codex: [present | absent — reason]
- Other reviewers: [list | none]

## Threads addressed (N)
- [topic]: fixed in <commit> — reply posted
- [topic]: not fixed — <specific reason> — reply posted

## Title/description
- [accurate | corrected: <what changed>]

## Self-review
- [finding]: fixed in <commit> — comment posted
- [finding]: not fixed — <specific reason> — comment posted
(or "skipped — already done in <link>" | "none found")

## Needs your input
- [findings blocked on a human decision]

## Status
- N commits, [pushed | not pushed — say "push" to publish]
```
