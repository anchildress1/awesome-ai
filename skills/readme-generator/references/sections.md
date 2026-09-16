Per-section rules. Read the section before drafting it or judging an existing one.

## Title and Introduction

- Include: project name as `# H1` · one- or two-sentence pitch (what + who for).
- Optional: logo · screenshot or short demo GIF · live demo / docs / video links · badges
  per SKILL.md "Badges".
- Avoid: marketing fluff · implementation detail · version history.

## Table of Contents

- Include: linked anchors to every `##` section.
- Keep it even though GitHub auto-generates one — IDEs, code search, and docs sites don't.
- Skip: fewer than ~5 sections.

## About

- Include: problem solved · audience · high-level approach. Two or three short paragraphs.
- Avoid: repeating the pitch · implementation · assuming the reader knows the project.
- Test: a stranger reading only this section can tell whether the project is relevant to
  them.

## Features

- Layout: table (name + one line) for 3–7 features; `### Feature` + 1–3 sentences when
  each needs context.
- The *what*, never the *how*. "Real-time collaborative editing" is a feature; "WebSockets
  with operational transforms over Redis pub/sub" belongs in Architecture.

## Tech Stack

- Include: language + version · framework · runtime · database · key libraries ·
  infra/hosting · build tooling.
- Format: bulleted list with bold labels; categorized table for large stacks.
- Avoid: transitive dependencies. Only what shapes the project.

## Architecture

- Mermaid diagram — type per `mermaid-guide.md`.
- Pair it with one short paragraph covering what the diagram can't: where state lives ·
  sync vs. async · hard dependency vs. fallback.
- Show *interactions*, not a box list. If the best available diagram is
  "Frontend → Backend → Database", skip the diagram.
- Skip: single binary, no external deps, no async.

## Project Structure

- ASCII tree, inline comment per meaningful entry. Directories and conventions, not every
  file.

```
src/
├── api/          # HTTP handlers; one file per resource
├── domain/       # Business logic, no I/O
└── infra/        # External integrations (DB, queue, third-party APIs)
```

- Avoid: full `tree` dumps. Trim to load-bearing directories.

## Getting Started

- Include: prerequisites with versions · clone · install · env setup (`.env` copy) · local
  services (Docker Compose, dev DB) · run command · URL to open · test command.
- Probe for: runtime version mismatches · undocumented system packages · missing
  migrations · port conflicts · secrets requested out-of-band.

## Configuration

- Table: variable · required · default · description · (valid values, when discrete).
- Include: env vars · config file paths · feature flags · external credentials (link to
  where to obtain, never the value).
- Pair with a `.env.example`. Both must exist.

## Security

- Include: auth model (one paragraph) · secrets-handling rules · threat model in broad
  strokes (defended vs. out of scope) · pointer to `SECURITY.md`.
- Actionable only. "We use HTTPS" says nothing; "All API routes require a valid session
  cookie; validation middleware in `src/api/middleware/auth.ts` runs before every handler"
  does.
- Skip: no auth, no secrets, no user data, no external integrations.

## How to Contribute

- Include: branching · PR process · commit conventions · lint/style expectations · where
  to ask · issue-first norms for large changes.
- Small project: 4–5 lines. Large project: link a separate `CONTRIBUTING.md`.

## What's Next

- Roughly prioritized checklist of upcoming items.
- Stale list, or the user can't say what's next → skip the section.
- Real issue tracker exists → one line: "See the [open issues]({{url}}) for current
  priorities."

## License

- Include: license name linked to LICENSE **plus** a one- or two-sentence plain-English
  summary of the constraints. The summary is mandatory.
- Never:
  - paste the full license text — LICENSE is canonical
  - ship the bare "licensed under X — see [LICENSE] for details" line
  - soften restrictions — if commercial use is restricted, say so plainly
- Tone matches the README. Under the changelog-writer voice
  (`~/.claude/skills/changelog-writer/SKILL.md`), write it like a doorman, not a EULA.
- License not named by the user → **ask**. Never default silently — not to MIT, not to
  Polyform Shield.

### Non-standard / source-available (this user's default)

Polyform Shield, BSL, SSPL, FSL, custom — anything not OSI-approved. Assume one of these
for this user's repos; confirm before writing an OSI license.

1. Name the license, linked to LICENSE.
2. One short clause saying it is **not** open-source / not OSI-approved.
3. Three bullets:
   - **You can:** everyday use — use, fork, internal work, client projects, education
   - **You can't:** bright-line restrictions — sell, paid SaaS, rebrand, monetize —
     without explicit permission
   - **Public forks:** attribution requirements, if any

Polyform Shield 1.0.0 example:

> Released under the [Polyform Shield License 1.0.0](LICENSE). Source-available, not open-source — read the license before you build a paid SaaS on top of it.
>
> - **You can:** use it, fork it, learn from it, ship it inside your day job, hand it to a client.
> - **You can't:** sell it, rebrand it, host it as paid SaaS, or otherwise monetize it without explicit written permission.
> - **Public forks:** include the LICENSE file and credit the original work.

### Standard OSI (MIT, Apache-2.0, BSD, GPL)

One line: `Released under the [MIT License](LICENSE).`

## Acknowledgements

- Include: notable OSS dependencies · contributors · design/technical inspirations ·
  shaping articles or talks.
- Skip: no meaningful external influences, or private code.

## Author

- Include: name · GitHub handle · optional website / email / social.
- Multiple authors → rename to "Authors" or "Maintainers" and list each.
- Never a phone number or anything unsafe to have scraped.
