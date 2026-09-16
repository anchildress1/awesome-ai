---
status: ready
name: readme-generator
description: Generate, audit, or improve a project README following a 15-section structure (Title, Table of Contents, About, Features, Tech Stack, Architecture, Project Structure, Getting Started, Configuration, Security, How to Contribute, What's Next, License, Acknowledgements, Author) with Mermaid diagrams for architecture and flows. Use this skill whenever the user asks to "write a README", "create a README", "draft a README", "generate README.md", "scaffold project docs", "document this repo", "improve my README", "audit my README", "what should go in my README", or starts a new repository and needs documentation. Also trigger on phrases like "the README is bare", "this project has no docs", "fill in my README sections", or any request that produces or reviews a top-level repository README. The skill defaults to Mermaid for diagrams because it renders natively on GitHub, GitLab, Bitbucket, and most modern Markdown viewers — no external image hosting required.
---

Readers: a stranger opening the repo cold, and the author six months later. Write for
scanning, not reading.

| File | Use for |
| - | - |
| `assets/template.md` | Starting point for every new README |
| `references/sections.md` | Include / avoid / skip rules per section — read before drafting or judging any section |
| `references/mermaid-guide.md` | Diagram type, shapes, arrows, render-target fallback |
| `assets/mermaid-examples.md` | Diagram patterns to adapt |

## Section selection

Project type unknown → **ask** before generating. A wrong-shape README is wasted work.

| Project type | Always include | Usually skip |
| - | - | - |
| Public open-source (apps, libraries) | All 15 | — |
| Internal team service | Title, About, Tech Stack, Architecture, Getting Started, Configuration, Security, Author | Acknowledgements, What's Next (use the issue tracker) |
| CLI tool / library | Title, About, Features, Tech Stack, Getting Started, Configuration, How to Contribute, License, Author | Architecture, Project Structure |
| Solo experiment / sandbox | Title, About, Getting Started | Most others |
| Documentation-only / tutorial repo | Title, About, Table of Contents, Project Structure, License, Author | Getting Started, Configuration, Security |

Order is fixed: Title and Introduction · Table of Contents · About · Features · Tech Stack ·
Architecture · Project Structure · Getting Started · Configuration · Security · How to
Contribute · What's Next · License · Acknowledgements · Author.

Separate sections with `---`.

## Workflow

### Fresh README

1. Collect before asking: project name, one-sentence purpose, project type, primary stack.
   Pull from `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, and the top-level
   listing when the repo is readable.
2. Start from `assets/template.md`. Fill every section you have signal for.
3. No signal → `<!-- TODO: describe X -->`. Never fabricate install steps, config, or
   license.
4. Architecture diagram: Mermaid, type chosen from `references/mermaid-guide.md`.
5. Present the draft with every TODO listed. Never call a placeholder-heavy draft done.

### Improve existing

1. Map existing content onto the 15 sections. Keep the user's section names when reasonable
   ("Setup" stays "Setup").
2. List missing and weak sections **before** rewriting. Never restructure silently.
3. Targeted edits only. The user's specific phrasing beats generic replacement copy.

### Audit only

Per section: ✓ present · ~ partial · ✗ missing. One concrete fix for each ~ and ✗. No
replacement content unless asked.

## Diagrams

Mermaid for every diagram. Never draw\.io or Lucidchart screenshots.

## Badges

Every badge must say something the README body doesn't say faster.

- Default to zero. License is the only near-default on a public repo.
- Cap ~3, hard ceiling 5.
- Never restate Tech Stack ("Built with React", "Uses TypeScript").
- Verify every claim and every link target from repo state. Unverifiable → omit.
- One horizontal line, space-separated. Break lines only to group (status row above
  package-metadata row).

Live-count badges — omit unless the number is non-trivial today:

| Badge | Omit if |
| - | - |
| Stars | < ~50, or unverifiable |
| Forks | < ~10 |
| Contributors | solo, or < ~3 |
| Downloads / installs | unpublished, or low/zero traffic |
| Open issues / PRs | new repo, no triage history |
| Coverage % | no published coverage report URL |
| Build status | no public CI workflow at that path |

Candidates worth considering, each only when its condition holds:

| Badge | Condition |
| - | - |
| License | Always relevant |
| CI status | Workflow exists and runs on `main` |
| Security scan (CodeQL, Snyk) | Actually wired up |
| Latest release / version | Published package with a moving version |
| Conventional Commits | commitlint actually enforced |

Everything else (framework, runtime, "built with X") belongs in Tech Stack.

## Never

- Generic filler ("powerful, modern, cutting-edge"). No specifics → placeholder.
- Implementation detail in About or Features.
- Getting Started the user hasn't run — mark it **needs verification**.
