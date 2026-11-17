---
status: check
name: generate-commit-message
description: >
  Derive one Conventional Commits v1.0.0 message from the staged diff and create the signed commit
  directly. Trigger only on explicit intent to commit: "commit this", "commit these changes",
  "/commit", "go ahead and commit", "make the commit", "git commit", "make atomic commits", "split
  this into commits", or a confirmation like "yes, commit it". Enforces the type enum, 72-char
  subject, 100-char body/footer lines, and a required AI-attribution trailer, so the result passes
  commitlint on the first try. Do NOT trigger on
  message-only questions ("write a commit message", "what should the commit message be") — this
  skill's only output path is a real commit, and answering those with one records work the user
  merely asked to preview.
argument-hint: "optional: JIRA-123 or issue key/scope hint"
allowed-tools: Bash, Read
disable-model-invocation: false
user-invocable: true
---

Produce exactly one Conventional Commits v1.0.0 message from the diff, then commit it signed.
The commit is the deliverable — no draft file, no push.

## Boundaries

The only repo-mutating commands permitted are `git commit -S` and path-explicit `git add` under
[Staging](#staging). Everything else is off-limits:

| Never | Why |
| - | - |
| Add to a non-empty index | A staged diff is the user's scope decision; commit exactly it |
| `git add -A` / `.` / `-u` / globs | Sweeps unrelated edits into the commit |
| `git push`, `rebase`, `reset`, `commit --amend` | History mutation isn't this skill's job |
| `--no-verify`, `--no-gpg-sign` | Hooks and signing must run |
| Edit source, docs, or config | No formatters, lint fixes, refactors, or test runs. Sole exception: the temporary revert-and-restore in [Splitting](#splitting-one-working-tree-into-atomic-commits), which must end byte-identical to the saved copy |
| Commit on `main`/`master` | Unless the user directed it **this turn** |
| Omit the AI-attribution trailer | A message without it is a failed message |

## Abort conditions

Stop and report; do not work around:

- No staged diff and the request names no work to commit ("commit" alone, tree holds several
  changes) → `nothing staged`; ask which change.
- On `main`/`master` without explicit authorization this turn.
- Diff changed between derivation and commit (see step 5).

## Staging

Only when the index is empty.

- Stage by explicit path every file — tracked and untracked — that belongs to the change the user
  named this turn ("commit the fiji work", "commit this").
- Dirty paths outside that change, or a file mixing it with another concern → stop, list them, ask.
  A pre-commit hook that re-stages fixed files can sweep unstaged edits into the commit.
- Report the staged paths with the SHA.

## Splitting one working tree into atomic commits

Only on an explicit request this turn.

Run steps 1–7 once per group, deriving each message from that group's staged diff alone.

- One logical change per commit. A subject that needs "and" is two commits.
- Every commit stands alone: the tree builds and imports resolve at **each** SHA, not just at the
  tip. Verify before moving to the next group.
- Never hand-split hunks in a file carrying two concerns — that is where work silently disappears.
  Instead: copy the finished files outside the repo, revert the *other* concern out of the file and
  commit, restore the copy and commit the remainder, then diff the tree against the copy. A
  non-empty diff means the split dropped work.
- Report every SHA and subject, not just the last.

## 1. Resolve scope

Precedence, first match wins. Jira key regex `[A-Z][A-Z0-9]+-\d+`, matched case-insensitively,
emitted uppercase:

1. User-provided key (request or `argument-hint`)
2. Branch name — `git --no-pager rev-parse --abbrev-ref HEAD`
3. None — omit the scope

Never invent a keyword scope (`core`, `api`, `docs`) when no issue key exists. An absent scope is
correct; a made-up one is noise. The diff informs type and subject, never scope.

## 2. Acquire diff

```bash
git --no-pager diff --cached
```

Empty → run [Staging](#staging), then re-run this command. Never derive from `git diff` of the
working tree: `git commit` records the index, so unstaged edits are not in the commit.

Derive everything from hunks only: chat history, prior commits, and memory are not evidence of
what this diff changes.

## 3. Pick type

First match wins:

| Signal | Type |
| - | - |
| Public API removed, signature changed, config key dropped | breaking — add `!` and/or `BREAKING CHANGE:` |
| New user-visible capability | `feat` |
| Defect repair, no new surface | `fix` |
| Faster, same behavior | `perf` |
| Restructure, same behavior | `refactor` |
| Whitespace, formatting, semicolons | `style` |
| Tests only | `test` |
| Docs, comments, JSDoc/KDoc only | `docs` |
| `.github/workflows`, `.circleci`, CI config | `ci` |
| Build system, deps, packaging | `build` |
| Reverts a prior commit | `revert` |
| Maintenance, no production impact | `chore` |

## 4. Pick attribution tier

Exactly one, from diff hunks + this session:

| AI share of the work | Trailer |
| - | - |
| Majority | `Generated-by` |
| Roughly half | `Co-authored-by` |
| Minor assist | `Assisted-by` |
| Only wrote this message | `Commit-generated-by` |

Uncertain → pick the tier that credits the human more.

`Co-authored-by` is the one tier GitHub actually parses and renders on the commit, which is the
point of it — don't substitute a variant spelling. The other three are custom trailers that git
carries verbatim.

## 5. Compose and validate

```
<type>[(<scope>)][!]: <subject>

- <single-line bullet>
- <single-line bullet>

<footers>
```

Format constraints — every one maps to a commitlint rule, so a violation is a hook failure, not a
style opinion:

- Subject ≤ 72 chars, no trailing period, imperative present tense. Not Title Case, sentence-case,
  PascalCase, or UPPER — but real identifiers keep their casing (`OAuth2`, `JSDoc`, `API`)
- Type lowercase, from the enum in step 3
- Body and footer lines ≤ 100 chars; bullets never wrap
- Exactly one blank line after the subject, exactly one before the footers, none elsewhere
- Group changes and say *what* and *why*. File-by-file listings and *how* are wasted lines.
  Quantify where it helps ("add 3 fixtures", "drop 412 LOC").

Footer order, when present:

1. `Refs: PROJ-123` / `Closes #42`
2. `BREAKING CHANGE: <incompatibility and required action>` — only when the `!` alone doesn't
   tell the user what to do. Both forms together are valid.
3. AI attribution — required, exactly one, from step 4.

Trailers use `-` for spaces (`Reviewed-by`); `BREAKING CHANGE` is the spec's one exemption. A
footer too long to fit in 100 chars folds onto a continuation line with a leading space.

**Match the repo before emitting.** Read `commitlint.config.js` (or `.commitlintrc*`) if present
and honor overrides — `scope-case`, stricter lengths, a narrowed type enum. Then check
`git --no-pager log -3` for trailers this repo actually uses (`Signed-off-by`, `Refs`) and mirror
them. A message that passes the generic spec but trips this repo's hook is still a failure.

Then verify before committing:

- Header matches `^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([^)]+\))?!?: .+$`
- No line over its limit; exactly one attribution trailer present

Failing any check → regenerate. Never emit a non-conformant message.

## 6. Re-check the diff

Re-run the step 2 command immediately before committing. If it changed, the message describes
work that no longer matches — re-derive from step 2. If the diff can't be re-read, say the
message may be stale and proceed.

## 7. Commit

```bash
git commit -S -F - <<'EOF'
<full message including blank lines and footers>
EOF
```

`-F -` preserves blank lines and trailers exactly; `-m` with embedded newlines is where formatting
gets mangled. Report the short SHA and subject.

On failure — hook rejection, denied permission, signing error — do not retry blindly and do not
amend. Print the composed message in a fenced block so the work isn't lost, surface the exact
failure output, and state what the user likely needs to do. Then stop; the underlying problem is
theirs to resolve, not something to work around.

## Examples

```
fix: pin qs to 6.14.2 to address prototype-pollution vulnerability

- add npm override for qs across the dependency tree
- align instantsearch.js resolution to the pinned version

Assisted-by: Claude Haiku 4.5 <noreply@anthropic.com>
```

```
feat(PROJ-123): add OAuth2 device-code flow to login

- support polling the token endpoint with backoff
- surface user_code and verification_uri in CLI output
- cover happy-path and timeout in unit tests

Refs: PROJ-123
Generated-by: Claude Opus 5 <noreply@anthropic.com>
```

```
feat(PROJ-456)!: drop deprecated /v1 endpoints

- remove /v1/users and /v1/sessions handlers
- migrate fixture suite to /v2 equivalents

BREAKING CHANGE: clients pinned to /v1 must upgrade to /v2 before this release.
Generated-by: Claude Opus 5 <noreply@anthropic.com>
```
