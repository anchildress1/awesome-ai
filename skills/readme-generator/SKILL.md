---
status: ready
name: readme-generator
description: Generate, audit, or improve a project README following a 15-section structure (Title, Table of Contents, About, Features, Tech Stack, Architecture, Project Structure, Getting Started, Configuration, Security, How to Contribute, What's Next, License, Acknowledgements, Author) with Mermaid diagrams for architecture and flows. Use this skill whenever the user asks to "write a README", "create a README", "draft a README", "generate README.md", "scaffold project docs", "document this repo", "improve my README", "audit my README", "what should go in my README", or starts a new repository and needs documentation. Also trigger on phrases like "the README is bare", "this project has no docs", "fill in my README sections", or any request that produces or reviews a top-level repository README. The skill defaults to Mermaid for diagrams because it renders natively on GitHub, GitLab, Bitbucket, and most modern Markdown viewers — no external image hosting required.
---

# README Generator

A README is a project's front door. The goal of this skill is to help produce a README that is structured, scannable, useful to a stranger reading it for the first time, and useful to the author six months later.

This skill follows the 15-section structure from Giorgi Kobaidze's "15 Essential Sections Every README Needs" (dev.to, 2026), adapted with two opinionated choices:

1. **Mermaid for diagrams**, not draw\.io / Lucidchart screenshots. Mermaid renders natively in GitHub/GitLab Markdown, lives in version control alongside the code, and is easy to update.
2. **Section selection is intent-driven, not checklist-driven**. A "hello world" demo doesn't need an Architecture diagram. A new private monorepo probably doesn't need an Acknowledgements section. Use judgment.

## When to use which sections

The 15 sections are a menu, not a mandate. Default to including all of them for a non-trivial project intended for collaborators or public consumption. Trim aggressively for solo experiments or private tooling.

| Project type | Always include | Usually skip |
| - | - | - |
| Public open-source (apps, libraries) | All 15 | — |
| Internal team service | Title, About, Tech Stack, Architecture, Getting Started, Configuration, Security, Author | Acknowledgements, What's Next (use the issue tracker) |
| CLI tool / library | Title, About, Features, Tech Stack, Getting Started, Configuration, How to Contribute, License, Author | Architecture, Project Structure |
| Solo experiment / sandbox | Title, About, Getting Started | Most others |
| Documentation-only / tutorial repo | Title, About, Table of Contents, Project Structure, License, Author | Getting Started, Configuration, Security |

If the user hasn't told you which type of project this is, **ask** before generating. A wrong-shape README wastes both their time and yours.

## The 15 sections

For deep guidance on each section — what to include, what to leave out, common mistakes — read `references/sections.md`. The summary below is enough to draft from when the user has given clear input.

1. **Title and Introduction** — Project name as `# H1`. One- or two-sentence pitch. Optional: logo, screenshot, demo link, and a *small* set of badges (see "Badges" below — never a long list).
2. **Table of Contents** — Linked anchors to each section. Skip for very short READMEs (under ~5 sections).
3. **About** — What the project is, what problem it solves, who it's for. High-level only. No implementation details.
4. **Features** — Major capabilities. Either a feature/description table or a subheading per feature with more detail. Stay at the *what*, not the *how*.
5. **Tech Stack** — Languages, frameworks, runtimes, key libraries, infra, third-party services. A simple bulleted list or a categorized table both work.
6. **Architecture** — Bird's-eye view of how the components fit together. **Use a Mermaid diagram.** See `references/mermaid-guide.md` for which diagram type to pick.
7. **Project Structure** — Annotated directory tree. Tedious to write, valuable for onboarding and for future-you.
8. **Getting Started** — How a new developer clones, installs, and runs the project locally. Test these steps yourself; missing details here are the #1 reason contributors bounce.
9. **Configuration** — Environment variables, config files, feature flags, external service credentials. Document what each setting does and what valid values look like.
10. **Security** — Key security considerations: auth model, secrets handling, threat model basics, things contributors must not break. Link to a `SECURITY.md` for a full disclosure policy if you have one.
11. **How to Contribute** — Branching/PR conventions, commit style, code-of-conduct link, where to ask questions. Keep simple for new projects.
12. **What's Next** — Roadmap items. Signals the project is alive and gives contributors hooks to grab.
13. **License** — License name (linked to LICENSE) **plus** a one- or two-sentence plain-English summary of what readers can and can't do. The bare "Licensed under X — see LICENSE for details" line is dead weight; the link already says that. Default assumption for this user's repos: **non-standard / source-available** (Polyform Shield, BSL, SSPL, FSL) — readers will pattern-match "GitHub repo" → "MIT-shaped permissions" unless the prose says otherwise. Match the changelog-writer voice (cheeky, dry, narrative) — see `references/sections.md` for required structure and example copy. Don't paste the full license text.
14. **Acknowledgements** — Contributors, libraries, inspirations, prior art.
15. **Author** — Who you are, how to reach you, links to portfolio / socials. Last but not least.

Separate sections with horizontal rules (`---`) to make them visually distinct on rendered Markdown.

## How to draft

The flow depends on what the user has given you.

### If the user is asking for a fresh README

1. **Gather context first.** You need at minimum: project name, one-sentence purpose, project type (from the table above), and primary tech stack. If the repo is accessible (file paths shared, or you can search it), pull what you can — `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, top-level directory listing — before asking the user.
2. **Identify what's missing.** Don't fabricate. If you don't know how to install the project, the Getting Started section needs the user's input, not your guess.
3. **Generate the draft.** Start from `assets/template.md`. Fill in every section you have signal for. For sections you can't responsibly fill, leave a clearly marked placeholder like `<!-- TODO: describe X -->` rather than inventing content.
4. **Pick the right Mermaid diagram for Architecture.** See `references/mermaid-guide.md`. Default to a `flowchart` for typical service architectures.
5. **Show the user the draft and call out gaps.** Don't pretend the README is complete when half of it is placeholders.

### If the user has an existing README and wants it improved

1. **Read what they have.** Map their existing content to the 15-section structure. Some sections may be present under different names ("Setup" instead of "Getting Started", "Stack" instead of "Tech Stack") — preserve the user's terminology if it's reasonable.
2. **List what's missing or weak** before rewriting. Don't silently restructure — surface the gaps so they can decide.
3. **Make targeted improvements.** Don't replace working content with generic boilerplate. The user's specific phrasing usually beats your generic version.

### If the user wants an audit only (no rewrite)

Score the README against the 15 sections. For each section: present (✓), partial (~), or missing (✗). For partial/missing, suggest one concrete improvement. Don't generate replacement content unless asked.

## Mermaid diagrams

Mermaid is the default for any diagram this skill produces. Why:

- Renders natively on GitHub, GitLab, Bitbucket Cloud, Gitea, and most modern Markdown viewers
- Lives as plain text in version control
- Diff-able and reviewable in pull requests
- No external image hosting, no broken links when someone moves the assets folder

For diagram-type selection (flowchart vs. sequence vs. C4 vs. ER, etc.), see `references/mermaid-guide.md`. For ready-to-adapt patterns, see `assets/mermaid-examples.md`.

If the rendering target doesn't support Mermaid (rare — npm and PyPI registries are the main holdouts), generate the Mermaid source anyway and tell the user to render it to SVG/PNG once and check the image into the repo.

## The template

`assets/template.md` is a fill-in-the-blanks version of all 15 sections with horizontal rules between them and a Mermaid example pre-wired into the Architecture section. Start from there for new READMEs.

## Badges

Badges are **load-bearing signals**, not decoration. Every badge must earn its row by communicating something the reader can't get faster from the prose underneath. A long stack of badges trains readers to skip them entirely — and dilutes the ones that actually matter.

### Hard rules

- **Default to zero.** Add badges only when there's a concrete reason. License is the only one that's almost always worth it on a public repo.
- **Cap at ~3, soft-cap at 5.** If you find yourself reaching for a 6th badge, you're decorating.
- **Never use a badge to restate the Tech Stack section.** "Built with React" / "Uses TypeScript" / "Powered by Postgres" tell the reader something they'll learn in the next paragraph. The Tech Stack table does this better.
- **Verify before adding.** A badge is a claim. If you can't verify the claim from repo state, do not add it.
- **Render horizontally.** Put all badges on a single line separated by spaces — never one per line. Markdown line breaks force vertical stacking, which looks like a checklist instead of a header. Use newlines only when grouping makes sense (e.g., a row of "status" badges above a row of "package metadata" badges) — not as default formatting.

### Skip when the number would embarrass you

Some badges render a live count. Never add them unless the count is non-trivial *today*:

| Badge | Skip if… |
| - | - |
| Stars | repo has < ~50 stars (or you can't check) |
| Forks | < ~10 forks |
| Contributors | solo project, or < ~3 contributors |
| Downloads / installs | unpublished package, or low/zero traffic |
| Open issues / PRs | brand-new repo with no triage history |
| Coverage % | no published coverage report URL |
| Build status | no public CI workflow at that path |

A "0 stars" badge actively hurts the project. A missing CI badge that 404s looks worse than no badge at all.

### What's usually worth it

For a typical open-source project, the strongest badges are:

- **License** — legal signal, always relevant
- **CI status** — only if the workflow exists and runs on `main`
- **Security scan status** (CodeQL, Snyk, etc.) — only if wired up
- **Latest release / version** — only for published packages where the version moves
- **Conventional Commits** — only if commitlint is actually enforced (otherwise it's a lie)

Everything else (logo-only "built with X" badges, framework badges, runtime version badges) belongs in the Tech Stack section, not the title.

### Workflow

1. List the candidate badges you're tempted to add.
2. For each, ask: *what does this tell the reader that the rest of the README doesn't?*
3. For each live-count badge, verify the count is non-embarrassing.
4. For each link target, verify the URL resolves.
5. Trim ruthlessly. Three good badges beat ten weak ones.

## Common failure modes to avoid

- **Generic filler.** "This is a powerful and modern application that leverages cutting-edge technologies" tells the reader nothing. If you don't have specifics, leave a placeholder.
- **Implementation details in About/Features.** The reader hasn't earned that detail yet. Keep those sections high-level.
- **Untested Getting Started.** If the user hasn't run the steps themselves, mark the section as needing verification. Don't claim it works.
- **Stale What's Next.** A "coming soon" list from two years ago is worse than no list. If the user can't say what's actually next, skip the section.
- **Diagrams that just restate the tech stack.** An architecture diagram should show *interactions* between components, not just box-list them. If all you can draw is "Frontend → Backend → Database", that's a sign the system is too simple to need a diagram.
