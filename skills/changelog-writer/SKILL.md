---
status: draft
name: changelog-writer
description: Rewrites changelog entries with cheeky, narrative flair following project conventions. Use this when asked to rewrite or update CHANGELOG.md entries.
---

Read `CHANGELOG.md` first and match its established voice. The file's own precedent beats
every rule below.

Never neutralize the voice — it is the deliverable.

## Header

```markdown
## [X.Y.Z](compare-url) (YYYY-MM-DD) emoji
```

GitHub compare link and ISO date are mandatory. Emoji picked for *this* release — reach
for the obvious one only when nothing better fits. Repetition for emphasis (`📡📡📡`) is
allowed.

## Shape by release type

| Release | Body |
|---|---|
| Single-fix patch | Quote + one narrative paragraph. **No bullets.** |
| Multi-change | Quote + `### Highlights` + closing paragraph |
| Any, with breaking changes | Add the Breaking Changes block before Highlights |

Opening quote is always italicized inside a blockquote, and carries the mood.

### Single-fix patch

```markdown
## [0.1.4](https://github.com/ChecKMarKDevTools/rai-lint/compare/v0.1.3...v0.1.4) (2026-01-14) 🧹

> _Because even the tiniest version bump deserves a drumroll, or at least a polite cough._

A quick patch to fix the commitlint package version that was apparently auditioning for a game of hide-and-seek. No user-facing changes, just the machinery getting its act together.
```

### Multi-change

```markdown
## [0.1.3](https://github.com/ChecKMarKDevTools/rai-lint/compare/v0.1.2...v0.1.3) (2026-01-08) 📡📡📡

> _A boring release, in the best possible way:_ this one is about making CI/release automation less fragile and keeping dependencies current.

No user-facing rule behavior changes in either package. If you linted commits yesterday, you're linting commits today — just with fewer ways for the release machinery to hurt itself.

### Highlights

- **Release automation is harder to derail.** Release Please configuration and "single-tag" wiring were fixed so tags/versions line up cleanly across this monorepo instead of drifting into "wait, which package did we publish?" territory.
- **Security + supply chain posture got a tune-up.** The security audit workflow was improved, and the `astral-sh/setup-uv` action was bumped so the Python toolchain setup stays aligned with the ecosystem.
```

Highlights = bold claim, then plain-language impact. Never a bare verb phrase.

## Breaking changes

State what broke · why · what the reader must do. Structure is identical across both
tones; only the header changes.

- **Stable (≥ v1.0.0, non-prerelease)** — emphatic, visually unmissable:
  `**🚨 Breaking Changes (Yes, Really):**` · `**⚠️ The Part Where Things Break:**`
- **Pre-v1 or prerelease** — sardonic, because instability is the point:
  `**Breaking Changes (Shocking, I Know):**` ·
  `**Things That Changed Because v0.x Means 'Surprise Mechanics':**`

## Voice

Do:

- Dry and blunt — "The release workflow decided that 'working' was negotiable."
- Funny — "If this doesn't work, I'm learning pottery."
- Impact over mechanism — "Release automation is harder to derail," not "fixed release config."
- Own the failure — "prompting a debugging session I would describe as 'character-building'."

Never:

- Enumerate commits (`* commit abc123`).
- Corporate register — "We're excited to announce…"
- Implementation archaeology in place of user impact.
- Sanitize the personality out.

## Hard constraints

- No commit SHAs, PR numbers, or PR links below the version header.
- Never touch `CHANGELOG.md` content outside the section being rewritten.
- Breaking changes are never omitted, whatever the version.
