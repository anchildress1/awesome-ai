# GitHub Actions Best Practices Skill ⚙️

![Status: Check (blue badge)](https://img.shields.io/badge/status-check-3A86FF.svg)

Rules for writing GitHub Actions workflows that don't leak secrets, burn runner minutes, or hang a PR on a check that never reports.

Skill source: [`skills/gha-best-practices/SKILL.md`](../../skills/gha-best-practices/SKILL.md)

> 🦄 **Why this exists:** every agent writes a workflow that *runs*. Almost none write one that's scoped, pinned, and
> time-boxed. I got tired of fixing the same `write-all`, `secrets: inherit`, and six-hour-timeout jobs in every repo, so
> now the rules load before the first line gets written.

---

## When It Triggers 🎯

Before any edit under `.github/workflows/` or `.github/actions/`, including one-line changes. Phrases like:

- `add a workflow`, `add a job`, `add a step`
- `fix CI`, `CI is failing`, `why did CI not run`
- `pin this action`, `cache the install`, `upload the artifact`
- `add dependabot`

---

## What It Enforces 🛠️

| Area | Rule |
| - | - |
| Triggers | Explicit `pull_request` types; every PR job skips drafts |
| Path filters | `paths-ignore` for docs, always paired with `workflow_dispatch`; never on a required check |
| Concurrency | Required on every workflow, cancel in progress |
| Permissions | Job level only, least privilege, never `write-all` |
| Secrets | Step-scoped, masked at runtime, never `secrets: inherit` by default |
| Pinning | Every action by full commit SHA, GitHub's own included; versions looked up at write time |
| Timeouts | Every job, scaled to the work |
| Caching | Keyed off the lockfile |
| Artifacts | Uploaded with `if: always()` and explicit retention |
| Installs | Lifecycle scripts disabled |
| Repo tooling | `actionlint` in hooks; Dependabot for actions and every ecosystem, max 2 open PRs |

Existing violations in a file it touches get fixed in the same edit.

---

## How to Use It 📝

1. Install it with your other skills (for Claude Code, `~/.claude/skills/gha-best-practices/`)
2. Ask for workflow work as usual: `add a CI workflow for this repo`, `CI is failing on the lint job`
3. Reviewing an existing workflow? Point at it: `check .github/workflows/ci.yml against the GHA skill`

---

## Practical Notes 🧰

- The path-filter rule is the one that bites: a workflow skipped by a path filter never reports, so a required check sits `Pending` forever.
- Expect a bigger diff than you asked for the first time it touches an old workflow—it fixes what it finds.
