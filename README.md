# awesome-github-copilot 🔭

[![wakatime](https://wakatime.com/badge/github/anchildress1/awesome-github-copilot.svg)](https://wakatime.com/badge/github/anchildress1/awesome-github-copilot) [![GitHub stars](https://img.shields.io/github/stars/anchildress1/awesome-github-copilot.svg?style=social\&label=Stars)](https://github.com/anchildress1/awesome-github-copilot/stargazers) [![Open Issues](https://img.shields.io/github/issues/anchildress1/awesome-github-copilot.svg)](https://github.com/anchildress1/awesome-github-copilot/issues) [![Last commit](https://img.shields.io/github/last-commit/anchildress1/awesome-github-copilot.svg)](https://github.com/anchildress1/awesome-github-copilot/commits/main) [![Node](https://img.shields.io/badge/node-24.x-green.svg)](https://nodejs.org/) [![License](https://img.shields.io/badge/license-MIT-yellow.svg)](./LICENSE) [![Made with GitHub Copilot](https://img.shields.io/badge/Made%20with-GitHub%20Copilot-blue?logo=github-copilot\&logoColor=white)](https://github.com/features/copilot) [![Made with ChatGPT](https://img.shields.io/badge/Made%20with-ChatGPT-239D7A?logo=github-copilot\&logoColor=white)](https://github.com/features/copilot)

> [!NOTE]
> So my original idea of making all this directly accessible through a Copilot Extension hit a wall — a few walls, actually.
> GitHub recently announced the **sunset of that functionality** in favor of **MCP**.
>
> The [github/awesome-copilot](https://github.com/github/awesome-copilot) repo already supports MCP (plus installs into VS Code and Visual Studio), so I’ve started moving some of the more stable pieces there.
>
> This repo will still get the newest experiments first, but the “official” ones will live upstream.
>
> Got questions or ideas? Feel free to reach out — socials are on my profile. 🦄

---

Welcome to my collection of **Custom Instructions, Prompts, and Agents (formerly Chat Modes)** — your one-stop shop for uniquely crafted, slightly over-caffeinated GitHub Copilot personalities. Built for creative chaos, workflow upgrades, and the occasional emergency refactor.

Each mode here is handcrafted by me, with ChatGPT running background triage and Copilot chiming in like a backseat developer who just learned linting. I borrow inspiration from others (and always credit), but every piece is reshaped with my own twist.

Each entry is labeled by **status**, so you’ll know if you’re deploying a seasoned attending or a rookie who still thinks “merge conflict” sounds medical. Badges tell you how stable something is; docs tell you how to use it.

Some of these are fresh ideas in beta-brainstorm mode, others are daily-use veterans. You’ll find their full lifecycle explained in [Status Lifecycle & Badges](./docs/status-badge-lifecycle.md).

> 🦄 If things start to feel a little wild, remember — it’s not quite *The Pitt*, but I do like to keep you on your toes.

---

## Sparked It. Shaped It. Shoutouts. 💥

> 🦄 This project sits somewhere between “I might be onto something” and “what if I made it do *this* too?”
> It only exists because a couple brilliant people let me ramble about it endlessly and encouraged the madness anyway.

### Giorgi 📖

[@georgekobaidze](https://github.com/georgekobaidze) wrote [“15 Essential Sections Every README Needs”](https://dev.to/georgekobaidze/15-essential-sections-every-readme-needs-give-your-project-what-it-deserves-fie) — the article that became the backbone of the `readme-generator` skill. Solid structure, clear rationale, zero fluff. The skill wouldn't exist without it.

### Courtney 🕹️

For fearlessly testing from day one, breaking *everything* (with love), and still telling others about it. Your feedback and curiosity shaped so much of this — thank you for jumping into the chaos and making it fun.

### Vijaya 🧨

You lit the fuse with a simple idea that I immediately overengineered into something unrecognizable.
Your clarity, sense of scale, and focus on what’s *useful* still anchor this entire thing. None of it would exist without that spark.

---

# The `.github/` Directory 📚

Welcome to the heart of the repo — automation, docs, and the creative wiring that powers every Copilot experiment. Inside you’ll find the core configuration files and templates that make collaboration (and a little mischief) possible.

Looking for reusable prompts, custom agent personas, or fabulous instructions? They all live here. For the deep library, check out the [`docs/`](./docs/) folder.

Each file follows the same badge lifecycle — so you’ll know exactly what you’re getting into before you summon the intern AI again.

> 🦄 This repo thrives on creative chaos and helpful automation. Start here, and everything else starts to make sense.

---

## Custom Instructions 🤹

This is where the magic lives — reusable, testable instructions that behave like little command-line utilities for your AI agent.

> [!TIP]
> The `applyTo` pattern for each of these should change to `'**/*'` if you want it to be picked up everywhere (or substitute for anything following the same syntax as your `.gitignore`). In VS Code, there's a setting named `copilot.customInstructions` that controls which files Copilot can access, but the `applyTo` determines when it should be considered.
> If you’re not using VS Code... you already know what you’re doing. 😉

| Name | Status | Purpose | Notes |
| - | :-: | - | - |
| [`Copilot Behavior Modification System`](./instructions/my-global-user.instructions.md) <br /> aka My Personal User Instructions | [![Check - Blue](https://img.shields.io/badge/status-check-3A86FF.svg)](./docs/instructions/my-global-user-docs.md) | My custom Copilot leash to help prevent unwarranted side quests | Bonus personality adjustment! |
| [`design-principles`](./instructions/design-principles.instructions.md) | [![Status: Ready (green badge)](https://img.shields.io/badge/status-ready-007F5F.svg)](./docs/instructions/design-principles-docs.md) | Evaluates design choices for clarity, stability, and scalability | Inspired by legacy code PTSD and midnight refactors |
| [`logging-best-practices`](./instructions/logging-best-practices.instructions.md) | [![Status: Draft (pink badge)](https://img.shields.io/badge/status-draft-F72585.svg)](./docs/instructions/logging-best-practices-docs.md) | Multi-language logging do’s and don’ts | Originally built for [`The Logfather`](./agents/logfather.agent.md); now semi-retired |
| `format-conventional-commit` | ![Removed - Dark Gray](https://img.shields.io/badge/status-removed-4B4B4B.svg) | | Modern Copilot models handle this natively |
| `analyze-git-diff` | ![Removed - Dark Gray](https://img.shields.io/badge/status-removed-4B4B4B.svg) | | No longer needed with newer agents |

> 🦄 If anything helps bring order to your chaos, leave a star!

---

## Prompts 🧑‍🚀

These are your spectral conductors — high-level prompts for Agent Mode. They don’t *do* the work — they call in the right specialists who do.

Each one knows which tools to summon (`#changes`, `#editFiles`, `#runInTerminal`) and how to orchestrate them. Think séance, but for build automation.

| Name | Status | Purpose | Notes |
| - | :-: | - | - |
| [`generate-commit-message`](./prompts/generate-commit-message.prompt.md) (v3) | [![Status: Polish (purple badge)](https://img.shields.io/badge/status-polish-9B5DE5.svg)](./docs/prompts/generate-commit-message-docs.md) | One-shot commit message generator with RAI footer — **drafts to `commit.tmp`** for review | Responsible automation, step one. Zero orchestration drama. <br />Want it to commit for you? Use the [skill](./skills/generate-commit-message/SKILL.md) instead. |
| `get-current-timestamp` | ![Removed - Dark Gray](https://img.shields.io/badge/status-removed-4B4B4B.svg) | Returns a standard timestamp | Newer Copilot models handle this automatically |
| `generate-commit-message` (v1) | ![Removed - Dark Gray](https://img.shields.io/badge/status-removed-4B4B4B.svg) | Too noisy for new models | Rewritten in v2 for sanity and silence |

---

## Agents (formerly Chat Modes) 👷‍♂️

Custom AI "personalities with a purpose" for Copilot Chat and MCP. They’re all designed for creative chaos, workflow clarity, and the occasional existential debugging crisis.

> 🦄 If it feels too wild, relax—it’s not exactly *The Pitt*. I'm just making sure you're awake.

| Name | Status | Purpose | Notes |
| - | :-: | - | - |
| [`hlbpa`](./agents/hlbpa.agent.md) (High-Level Big-Picture Architect) | [![Status: Polish (purple badge)](https://img.shields.io/badge/status-polish-9B5DE5.svg)](./docs/agents/hlbpa-docs.md) | Configure Copilot Chat (or any AI/MCP extension host) to act as a Principal Systems Architect focused on high-level, architectural **documentation and review**. | Not designed to write code or tests. <br>**Note:** This also lives in [awesome-copilot](https://github.com/github/awesome-copilot) repo. |
| [`logfather`](./agents/logfather.agent.md) | [![Status: Draft (pink badge)](https://img.shields.io/badge/status-draft-F72585.svg)](./docs/agents/logfather-docs.md) | Secure, structured log enforcement with swagger and severity | Works alone or paired with `logging-best-practices` |
| [`instructionalist`](./agents/instructionalist.agent.md) | [![Status: Tweak (orange badge)](https://img.shields.io/badge/status-tweak-FB5607.svg)](./docs/agents/instructionalist-docs.md) | Interactive, section-driven repo instructions wizard with a detective vibe | Section metadata built-in; fun mode available |
| [`Principal Pragmatist`](./agents/pragmatist.agent.md) | [![Status: Draft (pink badge)](https://img.shields.io/badge/status-draft-F72585.svg)](./docs/agents/pragmatist-docs.md) | Configure Copilot Chat to act as a senior-to-principal engineer 🧭: concise, pragmatic, humorous, and peer-level. Always considers all options 🔍, challenges when needed 🤝, and obeys instructions to the letter 🛠️. | This works for most everything *except* what I wrote it for. \[WIP] |

> 🦄 Request several artifacts in one go to maximize each run. It may use extra GitHub Actions minutes, but you'll save on premium requests by reducing the total number of prompts.

---

## Skills 🧰

Skills are small, reusable playbooks you can hand to an agent when you want consistent output without re-explaining your rules every time.

| Name | Status | Purpose | Notes |
| - | :-: | - | - |
| [`changelog-rewriter`](./skills/changelog-writer/SKILL.md) | [![Status: Draft (pink badge)](https://img.shields.io/badge/status-draft-F72585.svg)](./docs/skills/changelog-rewriter-docs.md) | Rewrite `CHANGELOG.md` entries into the repo’s dry, narrative style (with formatting guardrails) | No commit/PR archaeology. No corporate tone. Just readable history. |
| [`generate-commit-message`](./skills/generate-commit-message/SKILL.md) | [![Status: Check (blue badge)](https://img.shields.io/badge/status-check-3A86FF.svg)](./docs/skills/generate-commit-message-docs.md) | Generate a Conventional Commit message from diff evidence and **make the signed commit** | Deterministic formatting, commits only what you staged, never pushes, AI attribution included. |
| [`eslint-plugin-configuring`](./skills/eslint-plugin-configuring/SKILL.md) | [![Status: Draft (pink badge)](https://img.shields.io/badge/status-draft-F72585.svg)](./docs/skills/eslint-plugin-configuring-docs.md) | Generate or update ESLint plugins with dual config support (v8 legacy and v9 flat) | I needed to throw one together anyway, so why not do this first? |
| [`test-writer`](./skills/test-writer/SKILL.md) | [![Status: Ready (green badge)](https://img.shields.io/badge/status-ready-007F5F.svg)](./docs/skills/test-writer-docs.md) | Write, extend, or audit tests in any language, any framework, any repo | No `.skip`, no lowered thresholds, no copy-paste bodies. Every path, every time. |
| [`readme-generator`](./skills/readme-generator/SKILL.md) | [![Status: Ready (green badge)](https://img.shields.io/badge/status-ready-007F5F.svg)](./docs/skills/readme-generator-docs.md) | Generate, audit, or improve a project README following a 15-section structure with Mermaid diagrams | Intent-driven section selection. No generic filler. No badge decoration. |
| [`pr-comment-review`](./skills/pr-comment-review/SKILL.md) | [![Status: Polish (purple badge)](https://img.shields.io/badge/status-polish-9B5DE5.svg)](./docs/skills/pr-comment-review-docs.md) | Audit and remediate an open PR's review feedback until every thread has an outcome | Fix or a real reason. "Nitpick" isn't a reason. Never pushes on its own. |

> ⭐️ If one of these guys helped you, leave a star!
> If it failed spectacularly, tell me. Either way, I’ll learn something — and so will the bot.

<small>Generated with a highly suspicious amount of help from ChatGPT and Claude, directed by Ashley Childress.</small>
