# README Generator Skill 📄

![Status: Ready (green badge)](https://img.shields.io/badge/status-ready-007F5F.svg)

Generate, audit, or improve a project README following a 15-section structure — with Mermaid diagrams, intent-driven section selection, and a badge discipline that won't embarrass you.

Skill source: [`skills/readme-generator/SKILL.md`](../../skills/readme-generator/SKILL.md)

> 📖 **Why this exists:** a README is a project's front door. Most of them leave visitors standing on the porch wondering if anyone's home. This skill follows the 15-section structure from [Giorgi Kobaidze's "15 Essential Sections Every README Needs"](https://dev.to/georgekobaidze/15-essential-sections-every-readme-needs-give-your-project-what-it-deserves-fie) (dev.to, 2026), with two opinionated additions: Mermaid for diagrams, and intent-driven section selection instead of a checklist.

---

## When It Triggers 🎯

Any of these phrases kick it off:

- `write a README`, `create a README`, `draft a README`, `generate README.md`
- `scaffold project docs`, `document this repo`
- `improve my README`, `audit my README`, `what should go in my README`
- `the README is bare`, `this project has no docs`, `fill in my README sections`
- Any request that produces or reviews a top-level repository README

---

## What It Does 🛠️

Three distinct modes depending on what you asked for.

**Fresh README:**

1. Gathers context — project name, purpose, type, tech stack (pulls from `package.json`, `pyproject.toml`, `Cargo.toml`, directory listing before asking)
2. Identifies which of the 15 sections apply based on project type
3. Generates from `assets/template.md`; marks gaps with `<!-- TODO: ... -->` rather than fabricating content
4. Picks the right Mermaid diagram type from `references/mermaid-guide.md`
5. Surfaces gaps before calling it done

**Existing README improvement:**

1. Maps current content to the 15-section structure
2. Lists missing or weak sections — surfaces gaps before touching anything
3. Makes targeted improvements; preserves the user's specific phrasing where it works

**Audit only:**

Scores each of the 15 sections: present (✓), partial (\~), or missing (✗). One concrete improvement suggestion per gap. No rewrite unless asked.

---

## The 15 Sections 📋

| # | Section | Purpose |
| - | - | - |
| 1 | Title & Introduction | Project name, one-to-two sentence pitch, small curated badge set |
| 2 | Table of Contents | Linked anchors; skip for short READMEs |
| 3 | About | What it is, what problem it solves, who it's for — high-level only |
| 4 | Features | Major capabilities; *what*, not *how* |
| 5 | Tech Stack | Languages, frameworks, runtimes, key services |
| 6 | Architecture | Bird's-eye component view — **Mermaid diagram required** |
| 7 | Project Structure | Annotated directory tree |
| 8 | Getting Started | Clone, install, run — tested steps only |
| 9 | Configuration | Env vars, config files, feature flags, valid values |
| 10 | Security | Auth model, secrets handling, things contributors must not break |
| 11 | How to Contribute | Branching, PR conventions, CoC link |
| 12 | What's Next | Live roadmap items; skip if stale |
| 13 | License | License name + plain-English summary of what readers can/can't do |
| 14 | Acknowledgements | Contributors, libraries, inspirations |
| 15 | Author | Who you are, how to reach you |

These are a menu, not a mandate. The skill matches section selection to project type before generating:

| Project type | Always include | Usually skip |
| - | - | - |
| Public open-source | All 15 | — |
| Internal team service | Title, About, Tech Stack, Architecture, Getting Started, Configuration, Security, Author | Acknowledgements, What's Next |
| CLI tool / library | Title, About, Features, Tech Stack, Getting Started, Configuration, How to Contribute, License, Author | Architecture, Project Structure |
| Solo experiment | Title, About, Getting Started | Most others |
| Docs / tutorial repo | Title, About, ToC, Project Structure, License, Author | Getting Started, Configuration, Security |

If project type is unclear, the skill asks before generating.

---

## Mermaid Diagrams 🗺️

Default for every diagram this skill produces. Why:

- Renders natively on GitHub, GitLab, Bitbucket Cloud, Gitea, and most modern Markdown viewers
- Plain text in version control — diff-able, reviewable in PRs
- No external image hosting, no broken links if someone moves the assets folder

Diagram-type selection (flowchart vs. sequence vs. state vs. ER) lives in `references/mermaid-guide.md`. Ready-to-adapt patterns are in `assets/mermaid-examples.md`. Default is `flowchart` for typical service architectures.

If the rendering target doesn't support Mermaid (npm/PyPI registries are the main holdouts), the skill generates the Mermaid source and tells you to render it to SVG/PNG once and check the image in.

---

## Badge Discipline 🎖️

Badges are load-bearing signals, not decoration. Hard rules:

- **Default to zero** — add only when there's a concrete reason; License is the only near-universal one
- **Cap at \~3, hard ceiling 5** — six badges trains readers to skip them
- **Never restate the Tech Stack section** — "Built with React" belongs in the Tech Stack table, not the header
- **Verify before adding** — a badge is a claim; unverifiable claims don't ship
- **Render horizontally** — one line, space-separated; a second line only to group (status above package metadata)

Live-count badges (stars, forks, downloads, coverage, issues) get skipped unless the number is non-embarrassing:

| Badge | Skip if... |
| - | - |
| Stars | < \~50 stars |
| Forks | < \~10 forks |
| Contributors | solo project or < \~3 contributors |
| Downloads / installs | unpublished or low traffic |
| Open issues / PRs | brand-new repo with no triage history |
| Coverage % | no published coverage report URL |
| Build status | no public CI workflow at that path |

A "0 stars" badge actively hurts the project. A 404-ing CI badge is worse than no badge.

---

## Failure Modes It Avoids ⛔

- **Generic filler** — "powerful and modern application leveraging cutting-edge technologies" lands a placeholder, not that sentence
- **Implementation details in About/Features** — stays high-level until the reader earns the depth
- **Untested Getting Started** — unverified steps get marked; the skill won't claim they work
- **Stale What's Next** — if the user can't say what's actually next, the section gets skipped
- **Architecture diagrams that restate the tech stack** — if all it can draw is "Frontend → Backend → Database", it skips the diagram

---

## Practical Notes 🧰

- Template lives at `assets/template.md` — all 15 sections pre-wired with a Mermaid Architecture placeholder
- Sections separated by horizontal rules (`---`) for scannable rendered Markdown
- License isn't guessed — if you don't name one, it asks
