# PR Comment Review Skill 🔍

![Status: Polish (purple badge)](https://img.shields.io/badge/status-polish-9B5DE5.svg)

Audit and remediate an open pull request's review feedback until every thread has an outcome.

Skill source: [`skills/pr-comment-review/SKILL.md`](../../skills/pr-comment-review/SKILL.md)

> 🦄 **Why this exists:** bot threads rot. One sits unresolved, the PR merges anyway, and the
> "minor" finding was the one that mattered. This closes that gap by refusing to let anything
> exit without a fix or a reason someone else could verify.

---

## When It Triggers 🎯

- `have all PR comments been addressed`, `make sure nothing got missed on this PR`
- `did copilot and codex review this` (or just one of them)
- `reply to the PR comments`, `address the PR feedback`
- `is this PR ready to merge`, `clean up this PR before merging`
- Prepping a new PR for review, before any comments exist

**Not** for reviewing an unpushed working diff — that's `/code-review`. This skill assumes a PR.

---

## What It Does 🛠️

| Step | Outcome |
| - | - |
| Resolve PR | From argument, or the current branch. No PR → stops, doesn't guess. |
| Confirm bots | Copilot and Codex both reviewed — or a diagnosed reason why not. |
| Work threads | Every unresolved thread, any source, replied to in-thread. |
| Check drift | Title/description vs. the actual diff, corrected via `gh pr edit`. |
| Self-review | Once per PR, marker-gated. Delegates to `/code-review`. |
| Verify + commit | Repo's own check loop, atomic commits. **Never pushes** unless told. |

**The rule that matters:** every finding gets a fix or a specific reason it won't be fixed.
"Minor," "nitpick," and "follow-up" don't count — those are what gets written when no decision
was made.

---

## Required GitHub Setup ⚙️

The skill degrades loudly rather than silently, but it needs all of this to do its actual job.

### 1. GitHub CLI, authenticated

```bash
gh auth status
```

Token scopes must include **`repo`** and **`read:org`**. Without `read:org` the bot-installation
check in Step 2 returns nothing useful.

### 2. Copilot code review

Requires a Copilot license (Pro, Pro+, Business, or Enterprise). Reviews on demand work out of
the box; **automatic** reviews need a repository ruleset:

1. **Settings → Rules → Rulesets → New ruleset → New branch ruleset**
2. Set the ruleset **Active**, target your default branch
3. Check **Automatically request Copilot code review**
4. Optionally check **Review draft pull requests** — otherwise Copilot skips drafts, and the
   skill will correctly report it as absent

### 3. Codex code review

1. Install the [**ChatGPT Codex Connector**](https://github.com/apps/chatgpt-codex-connector)
   GitHub App on the repo
2. Set up Codex cloud for that repo
3. Codex settings → toggle **Code review** on
4. Toggle **Automatic reviews** on for every new PR — otherwise it only responds to an
   `@codex review` comment

Codex reads `AGENTS.md` for repo-specific review rules, and only flags P0/P1 issues.

### 4. GitHub MCP server (optional, preferred)

The skill prefers `pull_request_read` and `add_reply_to_pull_request_comment` from the GitHub MCP
server because they return thread structure directly. Every call has a `gh api` fallback inline,
so the skill works without MCP — just with more parsing.

---

## Bot Identities 🤖

The skill matches on exact login. These are what actually appear in the API:

| Bot | Login | App slug (for search) |
| - | - | - |
| Copilot | `copilot-pull-request-reviewer[bot]` | `copilot-pull-request-reviewer` |
| Codex | `chatgpt-codex-connector[bot]` | `chatgpt-codex-connector` |

---

## Verify Your Setup ✅

Has each bot *ever* reviewed anything in this repo?

```bash
gh api -X GET search/issues \
  -f q="repo:{owner}/{repo} commenter:app/copilot-pull-request-reviewer" --jq '.total_count'

gh api -X GET search/issues \
  -f q="repo:{owner}/{repo} commenter:app/chatgpt-codex-connector" --jq '.total_count'
```

> [!WARNING]
> `-X GET` is required. Passing `-f` without it makes `gh` send a POST, and the search endpoint
> answers with a bare `404` that looks like a missing repo.

> [!IMPORTANT]
> A `0` means **no prior comments**, not "not installed." A freshly installed app returns the same
> `0` until its first eligible PR — this repo returned `0` for Codex right up until Codex reviewed
> [#20](https://github.com/anchildress1/awesome-ai/pull/20). To check installation for
> real, use `gh api repos/{owner}/{repo}/installation` or the repo's settings.

---

## Practical Notes 🧰

- **Threads are never auto-resolved.** Replying is the skill's job; resolving is yours. That's a
  deliberate human checkpoint.
- **Self-review runs once per PR**, gated on a `<!-- pr-comment-review:self-reviewed -->` marker
  comment. Say `redo the self-review` to force a fresh pass.
- **Reply IDs are the numeric `#discussion_r<id>`**, not the GraphQL node ID. Mixing them up is
  the most common way replies land in the wrong place.
- **Drafts get skipped by both bots** unless you opted into draft review (Copilot ruleset). The
  skill reports this as a cause, not a mystery.
- **It commits but doesn't push.** Say `push` in the same turn if you want it published.

---

## Sources 📚

- [Configuring automatic code review by Copilot](https://docs.github.com/en/copilot/how-tos/agents/copilot-code-review/automatic-code-review)
- [About GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review)
- [Codex code review in GitHub](https://learn.chatgpt.com/docs/third-party/github)
