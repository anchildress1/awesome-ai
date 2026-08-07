# Section-by-section guidance

Deeper notes on each of the 15 sections. Read this when drafting a section that needs care, or when auditing a README and judging whether an existing section is doing its job.

## Table of contents

1. [Title and Introduction](#title-and-introduction)
2. [Table of Contents](#table-of-contents)
3. [About](#about)
4. [Features](#features)
5. [Tech Stack](#tech-stack)
6. [Architecture](#architecture)
7. [Project Structure](#project-structure)
8. [Getting Started](#getting-started)
9. [Configuration](#configuration)
10. [Security](#security)
11. [How to Contribute](#how-to-contribute)
12. [What's Next](#whats-next)
13. [License](#license)
14. [Acknowledgements](#acknowledgements)
15. [Author](#author)

---

## Title and Introduction

**Purpose:** capture the reader's attention in 5 seconds.

**Include:** project name as `# H1`, a one- or two-sentence pitch (what it does + who it's for), and optionally: logo, badges (build status, license, version, package downloads), a screenshot or short demo GIF, links to a live demo / docs site / video walkthrough.

**Avoid:** marketing fluff ("revolutionary, cutting-edge…"), implementation details, version history.

**Common badge sources:** shields.io, badgen.net. Include only badges that signal something the reader cares about — a green "build passing" is useful, "100% TypeScript" usually isn't.

## Table of Contents

**Purpose:** orient the reader, let them jump to what they need.

**Include:** linked anchors to every `##` section.

**Skip when:** the README is shorter than ~5 sections. A TOC for 4 items is noise.

**GitHub note:** GitHub auto-generates a TOC dropdown from the headings, so the manual TOC is partially redundant on github.com — but it still serves people reading the file in IDEs, code search results, or rendered docs sites. Keep it.

## About

**Purpose:** explain what the project is and why it exists, in plain language.

**Include:** the problem the project solves, who the audience is, the high-level approach. Two or three short paragraphs is the sweet spot.

**Avoid:** repeating the one-line pitch from the intro; jumping into implementation; writing it for an audience that already knows the project.

**Test:** could a stranger tell, after reading this section alone, whether this project is relevant to them? If not, it's not doing its job.

## Features

**Purpose:** show what the project actually does, at a glance.

**Two layouts:**

- **Table** — feature name + one-line description. Best for 3-7 features.
- **Subheadings** — `### Feature Name` followed by 1-3 sentences. Best when each feature needs context.

**Stay at the *what*, not the *how*.** "Real-time collaborative editing" is a feature. "Uses WebSockets with operational transforms over a Redis-backed pub/sub" is implementation detail — that goes in Architecture or deeper docs.

## Tech Stack

**Purpose:** tell readers what the project is built with so they can decide if it fits their skills or stack.

**Include:** language + version, framework, runtime, database, key libraries, infra/hosting, build tooling.

**Format:** bulleted list with bold labels works well. A categorized table works for larger stacks.

**Avoid:** listing every transitive dependency. Stick to the things that meaningfully shape the project.

## Architecture

**Purpose:** show how the components of the system fit together at a glance.

**Default to a Mermaid diagram.** See `../assets/mermaid-examples.md` for type selection (flowchart vs. sequence vs. ER vs. state).

**Include with the diagram:** one short paragraph explaining what the diagram doesn't (e.g., where state lives, what's synchronous vs. async, what's a hard dependency vs. a fallback).

**Avoid:** diagrams that just restate the tech stack as boxes. The point is to show *interactions*, not *components*.

**Skip when:** the system is genuinely simple (single binary, no external deps, no async). Forcing a diagram on a 200-line CLI looks ridiculous.

## Project Structure

**Purpose:** orient a contributor to the codebase before they start opening files.

**Format:** ASCII directory tree with inline comments on each meaningful entry. Don't list every file — list the directories and the conventions.

**Example shape:**

```
src/
├── api/          # HTTP handlers; one file per resource
├── domain/       # Business logic, no I/O
└── infra/        # External integrations (DB, queue, third-party APIs)
```

**Avoid:** a full `tree` dump that's three pages long. Trim aggressively to the load-bearing directories.

## Getting Started

**Purpose:** get a new developer from `git clone` to a running app on their machine.

**Include:** prerequisites (with versions), clone command, install command, environment setup (`.env` file copy), any local services to start (Docker Compose, dev databases), the run command, the URL to open, and how to run the tests.

**Verify the steps yourself.** Open a fresh terminal, follow your own README, see if it works. Missing one detail here is the #1 reason contributors give up.

**Common gaps to watch for:** node version mismatches, undocumented system packages, missing migrations, ports already in use, secrets that need to be requested out-of-band.

## Configuration

**Purpose:** document every dial a deployer or contributor might need to turn.

**Format:** a table is almost always the right format. Columns: variable name, required (yes/no), default value, description. Optionally a fifth column for "valid values" if the set is discrete.

**Include:** environment variables, config file paths, feature flags, external service credentials (with link to where to obtain them, not the value).

**Pair with `.env.example`:** the README documents what each variable does; the `.env.example` file is the actual copy-pasteable template. Both should exist.

## Security

**Purpose:** make sure contributors don't accidentally introduce vulnerabilities.

**Include:** auth model in one paragraph, secrets handling rules, the threat model in broad strokes (what you're defending against and what's out of scope), and a pointer to a `SECURITY.md` for the formal disclosure policy.

**Avoid:** treating this as a checklist of buzzwords. "We use HTTPS" doesn't tell a contributor anything actionable. "All API routes require a valid session cookie; the validation middleware lives in `src/api/middleware/auth.ts` and runs before every handler" is actionable.

**Skip when:** the project has no auth, no secrets, no user data, and no external integrations.

## How to Contribute

**Purpose:** lower the friction for outside contributions.

**Include:** branching strategy (feature branches off `main`?), PR process, commit message conventions, code style / linting expectations, where to ask questions, and any larger-changes-need-an-issue-first norms.

**Length scaling:** for a small project, 4-5 lines is plenty. For a large open-source project, link to a separate `CONTRIBUTING.md`.

## What's Next

**Purpose:** signal the project is alive and give contributors hooks.

**Format:** a checklist of upcoming items. Roughly prioritized.

**Avoid:** a stale list. A "coming soon" section from two years ago is worse than no section. If you can't update it, don't include it.

**Alternative:** for projects with a real issue tracker, a sentence like "See the [open issues]({{url}}) for current priorities" is enough.

## License

**Purpose:** tell readers what they're allowed to do with the code — and, more importantly, what they're not.

**Include:** license name (linked to the LICENSE file) **plus a one- or two-sentence plain-English summary of the actual constraints.** The summary is the load-bearing part. A bare "Licensed under X — see [LICENSE] for details" is dead weight: the link already says that, and readers will pattern-match "repo on GitHub" → "MIT-shaped permissions" and assume things you never granted.

**Don't:**

- paste the full license text into the README — the LICENSE file is canonical
- ship the dry "This project is licensed under X — see [LICENSE] for details" line; the prose has to outwork the link
- soften the constraints to sound friendlier — if commercial use is restricted, say so plainly

**Tone:** match the rest of the README. For projects following the changelog-writer voice (cheeky, dry, narrative — see `~/.claude/skills/changelog-writer/SKILL.md`), the License section gets that same edge. It should read like a doorman, not a EULA.

### Non-standard / source-available licenses — the default for this user

Polyform Shield, BSL, SSPL, FSL, "custom" — anything that isn't OSI-approved. **Default assumption:** every repo this user ships uses one of these. Treat OSI licenses as the exception, not the rule, and confirm before writing one in.

Required structure for non-standard licenses:

1. Name the license, linked to LICENSE.
2. State, in one short clause, that it's **not** open-source / not OSI-approved. Readers need this said out loud.
3. Three bullets:
   - **You can:** the everyday use cases (use, fork, internal work, client projects, education)
   - **You can't:** the bright-line restrictions (sell, paid SaaS, rebrand, monetize) without explicit permission
   - **Public forks:** attribution requirements, if any

Example copy for Polyform Shield 1.0.0 (this user's default):

> Released under the [Polyform Shield License 1.0.0](LICENSE). Source-available, not open-source — read the license before you build a paid SaaS on top of it.
>
> - **You can:** use it, fork it, learn from it, ship it inside your day job, hand it to a client.
> - **You can't:** sell it, rebrand it, host it as paid SaaS, or otherwise monetize it without explicit written permission.
> - **Public forks:** include the LICENSE file and credit the original work.

### Standard OSI licenses (rare for this user)

MIT, Apache-2.0, BSD, GPL — constraints are well-known, a short blurb is enough.

Example: `Released under the [MIT License](LICENSE).`

**Choosing a license:** if the user hasn't named one, **ask**. Do not invent a license or silently default to MIT — and do not silently default to Polyform Shield either, even though it's the usual answer. Confirm.

## Acknowledgements

**Purpose:** credit the people, libraries, and prior art that made the project possible.

**Include:** notable open-source dependencies, contributors, design or technical inspirations, articles or talks that shaped the approach.

**Skip when:** the project doesn't have meaningful external influences (a solo experiment built on the framework's defaults), or when this is private code where the audience doesn't care.

## Author

**Purpose:** make it easy to reach the maintainer.

**Include:** name, GitHub handle, optionally website / email / social link.

**For multi-author projects:** rename to "Authors" or "Maintainers" and list each.

**Don't:** include a phone number or anything you'd regret being scraped.
