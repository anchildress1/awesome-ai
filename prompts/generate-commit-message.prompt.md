---
status: "polish"
title: "Generate Conventional Commit Message v3"
description: "Generate a conventional commit message with AI attribution and saves to ./commit.tmp"
tools: [
  "execute",
  "read",
  "edit",
  "search"
]
---

## Goal

Produce a conventional commit message from the highest-priority diff evidence and write it to `commit.tmp` exactly once per run.

> [!NOTE]
> This is the **draft-to-file** variant, for Copilot Chat and any flow where you want to read the message before committing. The [`generate-commit-message` skill](../skills/generate-commit-message/SKILL.md) is the **commit-directly** variant. Same rules, different endpoint — pick one per workflow rather than running both.

---

## Evidence Priority (STRICT)

1. Repo-aware diff tools (staged first, then working tree)
2. CLI git diff (`--cached`, then working tree)
3. Chat memory only if no diff can be obtained by any method

If memory must be used, treat every conclusion as estimated and fallback to rules for attribution.

---

## Commit Structure

1. Format: `type(scope): Subject`
2. Scope selection priority:

- Use ticket/issue ID when present. The branch name check already handles this; reuse it.
- Otherwise use a short area/module keyword.
- If no scope applies, omit it.

Multi-area rule (strict):

- Do not encode ambiguity by writing a catch-all subject.
- Instead emit a split recommendation outside of `commit.tmp` when unrelated areas are touched.
- Keep `commit.tmp` clean; the subject/body must describe a single cohesive intent.

---

## Type Selection (Canonical)

Core policy: choose the lowest-impact valid type consistent with the diff. Standard types are: `fix`, `feat`, `refactor`, `chore`, `docs`, `test`, `ci`, `build`, `perf`, `style`, `revert`.

Semver impact is implicit:

- PATCH: default for fixes, refactors, chores, docs, tests, CI, build, style, perf

- MINOR: `feat` only when adding new user-facing capability

- MAJOR: only when breaking change criteria are met (see rule below)

- Prefer `PATCH` unless clear evidence of a finished feature truly exists.

---

## Breaking Change Rules

A change is breaking only if ALL are true:

- A prior non-draft, non-prerelease release exists (publicly consumable)
- AND upgrading requires users to modify code, config, or usage (explicit user action required)
- AND the change is not backward-compatible

If breaking:

- Add `!` to the subject (`type(scope)!: Subject`).
- Add footer: `BREAKING CHANGE: <required user action>`.

If no prior release exists, do not mark breaking and do not use `!`.

---

## Formatting Constraints

- Subject ≤ 72 chars
- Body lines ≤ 100 chars
- Body is optional:
  - If body exists: one blank line after subject, bullets are one per line, no wrapping
  - If no body: subject is followed by one blank line, then footers
- Footers:
  - Exactly one blank line before footers
  - No other blank lines

---

## AI Attribution Selection Rules (DETERMINISTIC)

Select exactly one attribution footer based primarily on evidence from the diff.

Primary signal: approximate share of modified/added lines authored by AI in this change.

1. Estimate attribution strictly from the diff and any metadata you can obtain.
2. Never change commit content based on chat memory; only use memory to resolve attribution when evidence is missing.

Quantitative brackets (apply top-down, first match wins):

1. **Generated-by**
   - AI authored ≥ 60% of modified/added lines

2. **Co-authored-by**
   - AI authored 25%–59% of modified/added lines

3. **Assisted-by**
   - AI authored 1%–24% of modified/added lines (minor but non-trivial)

4. **Commit-generated-by**
   - AI authored 0% of modified/added lines
   - OR no substantive change beyond message generation

Tie-breakers:

- If unsure between two adjacent brackets, choose the higher attribution.
- Do not downgrade attribution solely to minimize AI credit.
- Do not upgrade attribution without evidence.

Fallback (last resort):

- If no diff can be obtained at all, default to **Co-authored-by**.

---

## AI Attribution Signing

Use this guide when choosing the appropriate AI attribution signature:

| AI Name | Attribution Signature |
| - | - |
| GitHub Copilot | `GitHub Copilot <copilot@github.com>` |
| Verdent AI | `Verdent AI <noreply@verdent.ai>` |
| Claude | `Claude <claude@anthropic.com>` |
| Gemini | `Gemini <gemini@google.com>` |
| Codex | `Codex <codex@openai.com>` |
| ChatGPT | `ChatGPT <chatgpt@openai.com>` |

---

## Workflow

1. Determine evidence source using priority rules (staged preferred when available)
2. Analyze diff for intent and affected areas
3. Check branch name for ticket ID (e.g., PROJ-123) and use as scope if found
4. If multiple unrelated areas are detected:
   - Emit a recommendation to split the changes into multiple commits (outside the commit message)
5. Choose the minimal valid type and scope (scope may already be set via branch ID)
6. Apply breaking change rule if a prior non-draft release exists and user action is required.
7. Choose exactly one AI attribution footer based on the deterministic rules.
8. Write the final message to `commit.tmp`:
   - Subject line
   - Blank line
   - Bullets only (no prose paragraphs)
   - Blank line
   - Footers
9. Output the identical message in a code block without edits.

---

## Prohibited

- Never run git add/commit/push
- Never modify history
