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
