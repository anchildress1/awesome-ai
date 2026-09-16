# Changelog Writer Skill 🧾

![Status: Draft (pink badge)](https://img.shields.io/badge/status-draft-F72585.svg)

This is the skill you point at when your changelog needs to stop sounding like it was written by a committee and start sounding like it was written by someone who actually ships software.

Skill source: [`skills/changelog-writer/SKILL.md`](../../skills/changelog-writer/SKILL.md)

> 🦄 **Why this exists:** [Release Please](https://github.com/googleapis/release-please) is a fantastic tool that automates changelog generation from commits. But it's designed for clarity and consistency, not... *personality*. This skill bridges the gap between "automated and accurate" and "actually worth reading." Think of it as the manual rewrite layer—turning release-please's respectful, mechanical output into something that sounds like a human wrote it during a particularly honest debugging session.
>
> One day I'll automate this too, but until then, I'm stuck rewriting changelogs by hand like some kind of artisan. If that sounds sad, you're not wrong!

---

## What It Does 🛠️

Point your agent at this skill and it'll rewrite changelog entries to match this repo's voice: dry, blunt, a little cheeky, and actually useful to humans. No commit archaeology. No corporate sanitization. Just honest summaries that explain *why* something changed instead of listing what changed.

It enforces the formatting rules (version headers, compare links, dates, emojis), keeps the tone consistent, and won't invent features. It also explicitly forbids commit SHAs and PR numbers in the entry body.

## Format Rules the Skill Enforces 📏

**Version headers** look like this:

```markdown
## [X.Y.Z](compare-url) (YYYY-MM-DD) emoji
```

- GitHub compare link included
- ISO date format
- Emoji(s) that match the release vibe (repeats allowed when funny)

**Opening quote** sets the tone — italicized, sarcastic/humorous, in a blockquote. Implies "yes, we suffered."

**Body structure** depends on the release type:

- **Single-fix patch:** quote + short narrative paragraph. No bullet lists.
- **Multi-change release:** quote + optional "Highlights" section (bold claims with explanations) + closing paragraph.

**What the skill won't do:**

- Enumerate commit SHAs or PR numbers in the body
- Use corporate tone or marketing speak
- Add "Breaking changes" sections (prerelease = no breaking changes)
- Invent features that don't exist

> [!TIP]
> 🦄 I created the skill based on my only consistent [CHANGELOG.md](https://github.com/ChecKMarKDevTools/rai-lint/blob/main/CHANGELOG.md), if you want an example.

## How to Use It 📝

Tell your agent (Copilot, Claude, whatever) to use the skill file when rewriting a changelog entry. Be specific about which version you're targeting and whether you want it to preserve surrounding content.

**Example prompts:**

- "Rewrite the `CHANGELOG.md` entry for version `0.1.4` using `skills/changelog-writer/SKILL.md`."
- "Use the changelog skill to clean up the latest release entry — keep the version and date, just fix the prose."
- "Don't add PR numbers, don't add commit SHAs, and definitely don't make it sound like marketing wrote it."

If your agent starts freelancing (adding sections you didn't ask for, changing version numbers, whatever), add explicit constraints:

- “Don’t change the version number or date.”
- “Only rewrite text; do not add new sections beyond what the skill allows.”
- “Keep the compare URL format as-is unless it’s broken.”

## Practical Notes 🧰

- The skill explicitly requires preserving existing `CHANGELOG.md` content *below* the section being rewritten.
- The skill requires a GitHub compare link in the version header. It doesn't mandate one canonical URL style—match whatever your changelog already uses.
- The skill is intentionally not an audit trail. It forbids commit/PR enumeration in the body; if you need forensics, use `git log`.

---

<small>This file was generated with 🌶️ by GitHub Copilot + Me.</small>
