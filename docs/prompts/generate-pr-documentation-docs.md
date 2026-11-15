# Generate PR Documentation Sync 🧩

![Status: Draft (pink badge)](https://img.shields.io/badge/status-draft-F72585.svg)

This prompt is your “docs autopilot” for pull requests.

It reads what changed, figures out what the documentation *should* say now, and updates only the Markdown files that need to change.

## What it’s for 🎯

Use this when you want your PR to ship with docs that:

- match the actual code/config reality
- avoid duplicated or contradictory guidance
- call out breaking changes (when real)
- include Mermaid diagrams (with accessibility labels) when diagrams help

It’s not trying to be a novelist. It’s trying to be correct.

## What to expect ✅

- It will **read broadly** (code/config/tests) to understand what really changed.
- It will **edit narrowly** (only `.md` files), focusing on the smallest set of updates that makes the docs accurate.
- It prefers **updating existing docs** over creating new files.
- It will delete or consolidate docs that now contradict reality.
- If Mermaid diagrams are added/edited, they’ll include:
  - `accTitle:`
  - `accDescr:`

## Safety rails & “don’t be weird” rules 🛡️

- **Markdown edits only**: It must not modify code, configs, tests, or build files.
- **No secrets**: If a change introduces env vars, it documents **name + purpose only**.
- **No TOCs**: It won’t generate table-of-contents sections.
- **No meta-docs**: It avoids “documentation about documentation.”

## How to use 🪄

1. Open a PR first — the prompt reads the diff with `gh pr diff`.
2. Open the prompt file: `prompts/generate-pr-documentation.prompt.md`.
3. Run it using your Copilot prompt workflow / runner.
4. Review the resulting doc edits (usually `README.md` and/or something under `docs/`).

If you want to narrow scope, be explicit (e.g., “Only update docs related to `scripts/` changes”).

---

<small>ChatGPT and GitHub Copilot helped me with clear ideas and straightforward solutions.</small>
