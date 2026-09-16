# Development 🛠️💻

Quick setup for local hacking and validation before pushing anything upstream.

## Setup ⚙️

```bash
git clone https://github.com/anchildress1/awesome-ai.git
cd awesome-ai
npm install
```

## Scripts 🧩

```bash
npm run format      # Format markdown + fix GitHub alerts
npm run lint        # Lint markdown files
npm run commitlint  # Validate the commit message (used by the commit-msg hook)
```

## Plugin Marketplace 🧰

This repo is a Claude Code plugin marketplace. Two manifests drive it:

| File | Role |
| - | - |
| `.claude-plugin/marketplace.json` | Lists the marketplace and the plugins it offers |
| `.claude-plugin/plugin.json` | Describes the `awesome-ai` plugin and points at `./skills` |

Install it from a clone to test changes before pushing:

```bash
/plugin marketplace add ./path/to/awesome-ai
/plugin install awesome-ai@anchildress1
```

Adding a skill needs no manifest edit — `skills/` is scanned, so a new
`skills/<name>/SKILL.md` ships on the next `/plugin marketplace update anchildress1`.
Bump `version` in `plugin.json` when you want existing installs to pick the change up.

Every skill directory must contain a `SKILL.md` whose frontmatter `name` equals the
directory name, or the skill loads under a name nothing references.

## Hooks 🪝

Optional git hooks powered by **lefthook** (handy for pre-commit sanity checks):

```bash
npx lefthook install
```

## Background Reading 📚

If you’re curious about the logic or just want to dive deeper into Copilot’s ecosystem, here’s some context worth a read:

- [GitHub Copilot Instructions](https://dev.to/anchildress1/all-ive-learned-about-github-copilot-instructions-so-far-5bm7)
- [Reusable Prompts](https://dev.to/anchildress1/github-copilot-everything-you-wanted-to-know-about-reusable-and-experimental-prompts-part-1-iff)
- [~~Chat Modes~~ Agents Explained](https://dev.to/anchildress1/github-copilot-chat-modes-explained-with-personality-2f4c)
