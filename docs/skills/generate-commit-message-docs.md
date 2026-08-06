# Generate Commit Message Skill 🧠

![Status: Check (blue badge)](https://img.shields.io/badge/status-check-3A86FF.svg)

Derives a Conventional Commit message from your diff and makes the signed commit.

Skill source: [`skills/generate-commit-message/SKILL.md`](../../skills/generate-commit-message/SKILL.md)

> 🦄 **Why this exists:** writing commit messages is important and annoying — perfect job for
> automation. Automation still doesn't get to be sloppy: deterministic output, lint-friendly
> formatting, honest about AI involvement.

---

## What It Does 🛠️

1. Reads the staged diff — only the staged diff, since that's exactly what the commit will contain
2. Infers type, scope, and body strictly from hunks — not from chat history
3. Picks one AI-attribution trailer based on who actually did the work
4. Validates against commitlint rules *and* the repo's own config
5. Runs `git commit -S` on what's already staged

There's one mode: it commits. Earlier versions drafted to a `commit.tmp` file first — that step
is gone. If the commit can't happen, the message gets printed in chat instead of orphaned in an
untracked file you'll find three weeks later.

---

## How to Use It 📝

1. Make your changes
2. **Stage them yourself** — this is the important one
3. Say `commit this`, `go ahead and commit`, or `/generate-commit-message`

> [!WARNING]
> Don't reach for this one when you only want to *see* a message. It has no preview mode — every
> path ends in a commit. For the draft-to-file variant, use
> [`generate-commit-message.prompt.md`](../../prompts/generate-commit-message.prompt.md)
> ([docs](../prompts/generate-commit-message-docs.md)).

> [!IMPORTANT]
> The skill never runs `git add`. What you stage is what gets committed — that boundary is what
> lets it commit without asking you to review scope first. Nothing staged means it stops.

Optionally pass an issue key: `/generate-commit-message PROJ-123`.

---

## When It Refuses 🛑

- **Nothing staged.** It won't stage for you and won't guess what you meant to include.
- **You're on `main`/`master`.** Branch first, or say explicitly to commit there in the same
  message.
- **The diff changed mid-flight.** It re-reads the diff right before committing; if it moved, the
  message no longer describes reality, so it re-derives.
- **A hook or signature failed.** It prints the message, shows the raw failure, and stops. No
  retry loop, no `--amend`, no `--no-verify`.

---

## Output Rules 📏

Follows [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) and passes
`@commitlint/config-conventional` defaults.

| Part | Rules |
| - | - |
| **Header** | `type[(scope)][!]: subject` — subject ≤ 72 chars, no trailing period, not Title Case (identifiers like `OAuth2` keep their casing) |
| **Type** | `build` `chore` `ci` `docs` `feat` `fix` `perf` `refactor` `revert` `style` `test` |
| **Body** | One blank line after subject; single-line bullets ≤ 100 chars; *what* and *why*, never *how* |
| **Footers** | One blank line before; order is issue refs → `BREAKING CHANGE` → AI attribution |

Breaking changes take either form, or both: `feat(api)!:` when the break is self-evident,
`BREAKING CHANGE: <migration note>` when the user needs explicit steps.

> [!TIP]
> The skill reads your `commitlint.config.js` and your last few commits before composing, so
> repo-specific overrides and trailer habits (like `Signed-off-by`) get picked up automatically.
> Passing the generic spec but failing your hook still counts as a failure.

---

## Scope & Jira Keys 🎯

Set by precedence, never guessed from the diff:

1. Key you provided in the request
2. Key extracted from the branch name
3. Nothing — scope omitted

Jira keys are emitted uppercase (`feat(PROJ-123):`). commitlint's default `scope-case` is
lower-case, so add an override if you use them:

```js
rules: { 'scope-case': [0] }              // or: [2, 'always', 'upper-case']
```

The skill won't lowercase a Jira key to satisfy a lint rule — the key is an identifier, not prose.
And it won't invent a keyword scope like `core` or `api` when no issue key exists. An omitted
scope is correct; a fabricated one is noise.

---

## AI Attribution 🖋️

Exactly one tier, based on the diff:

| Trailer | Means |
| - | - |
| `Generated-by` | AI wrote the majority of changed lines |
| `Co-authored-by` | Roughly half-and-half |
| `Assisted-by` | Minor but real AI edits |
| `Commit-generated-by` | AI only wrote the commit message |

Ambiguous cases default to crediting the human more.

> [!NOTE]
> `Co-authored-by` is deliberate and matches the convention used across these repos. It's the one
> trailer GitHub parses and renders on the commit — the other three are custom trailers git carries
> verbatim. Don't let a tool "correct" it to a variant spelling; that silently drops the
> attribution GitHub would have shown.

---

## Example Output 📤

```text
fix: pin qs to 6.14.2 to address prototype-pollution vulnerability

- add npm override for qs across the dependency tree
- align instantsearch.js resolution to the pinned version

Assisted-by: Claude Haiku 4.5 <noreply@anthropic.com>
```

```text
feat(PROJ-123): add OAuth2 device-code flow to login

- support polling the token endpoint with backoff
- surface user_code and verification_uri in CLI output
- cover happy-path and timeout in unit tests

Refs: PROJ-123
Generated-by: Claude Opus 5 <noreply@anthropic.com>
```

```text
feat(api)!: drop deprecated /v1 endpoints

- remove /v1/users and /v1/sessions handlers
- migrate fixture suite to /v2 equivalents

BREAKING CHANGE: clients pinned to /v1 must upgrade to /v2 before this release.
Generated-by: Claude Opus 5 <noreply@anthropic.com>
```

---

## Practical Notes 🧰

- Commits are signed (`-S`) and hooks always run. No `--no-verify`, no `--no-gpg-sign`.
- The message is passed via `git commit -F -`, not `-m` — heredocs preserve blank lines and
  trailers that `-m` mangles.
- It never pushes. That's a separate decision, made by you.
- If you touched several unrelated areas, the right answer is usually "split your commits." The
  skill won't write a message that pretends they're one change.
