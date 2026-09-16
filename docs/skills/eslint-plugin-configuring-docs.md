# ESLint Plugin Configuring Skill 🔧

![Status: Draft (pink badge)](https://img.shields.io/badge/status-draft-F72585.svg)

This is the skill you point at when you need to build or refactor an ESLint plugin that doesn't confuse itself (or your users) about how to use its configs.

Skill source: [`skills/eslint-plugin-configuring/SKILL.md`](../../skills/eslint-plugin-configuring/SKILL.md)

> 🦄 **Why this exists:** ESLint v8 and v9 handle configs differently—v9 prefers flat config, v8 prefers legacy eslintrc. Building a plugin that supports both is surprisingly easy to get wrong. This skill ensures your plugin exports the right shape, registers correctly, and gives consumers unambiguous examples that actually work. No guessing. No collision headaches. Just solid, versioned plugin architecture.

> [!WARNING]
> The skill predates ESLint v10. v9 reached end-of-life on 2026-08-06, and v10 has been current since February 2026. The skill tells the agent to check the v10 plugin docs before relying on its v9 shapes, but expect rough edges until it's updated.

---

## What It Does 🛠️

Point your agent at this skill and it'll generate or fix an ESLint plugin that:

- Exports rules, configs, and metadata in the correct structure
- Supports both ESLint v8 (legacy) and v9 (flat config) simultaneously
- Uses a consistent naming strategy that prevents collisions
- Includes working consumer examples for both config styles
- Validates against ESLint version semantics explicitly

The skill is opinionated about avoiding ambiguity—it enforces strict naming rules, prevents self-reference bugs, and won't let you make false claims about plugin behavior.

## Key Principles the Skill Enforces 📏

**Namespace consistency** — All rules and configs must use the same prefix (namespace). No exceptions.

**Version-aware output** — ESLint v9 defaults to flat config; v8 defaults to legacy. The skill generates correct examples for both and states the behavior clearly.

**Config naming strategies** — Choose one and stick with it:

- **Strategy A (Recommended for new plugins):** Flat configs live under `flat/`, legacy configs under `legacy-`. Clean. No collisions.
- **Strategy B (Compatibility-first):** Preserve existing legacy config names; add flat variants as `flat/`. Use this if breaking existing configs is unacceptable.

**Consumer mapping** — Consumers *extend* configs without the strategy prefix. So `configs["flat/recommended"]` becomes `"namespace/recommended"` in a consumer's eslint.config.js.

**Hard constraints:**

- Never claim the plugin forces config usage.
- Never invent undocumented config logic.
- Never mix flat and legacy config shapes.
- Never use the plugin object before it exists (self-reference rules apply).

---

## Flat vs Legacy Config Shapes 🏗️

**Flat config** (ESLint v9):

- Exported as an array of config objects
- Plugin registered via object form: `plugins: { [namespace]: plugin }`
- Rules enabled using namespaced keys

**Legacy config** (ESLint v8):

- Exported as a plain eslintrc object
- Plugin registered via array: `plugins: ["namespace"]`
- Rules enabled using namespaced keys

The skill handles both and generates consumer examples for each.

---

## How to Use It 📝

Tell your agent to use this skill when you need to create a new ESLint plugin or update an existing one.

**Example prompts:**

- "Create an ESLint plugin called `eslint-plugin-myco` using `skills/eslint-plugin-configuring/SKILL.md`. Export rules for `prefer-async-await` and `no-magic-numbers`, with a `recommended` config that enables both."
- "Update the plugin to support ESLint v9 flat config. Use Strategy A (flat/ and legacy-) to avoid breaking the existing config API."
- "Generate flat and legacy consumer examples for the plugin. Make sure the examples match Strategy B (preserved naming)."

If your agent misses details, be explicit:

- "Don't export legacy and flat configs under the same key."
- "Both examples must show real, working consumer configurations."
- "Verify the namespace is consistent across all rule references."

---

## Practical Notes 🧰

- The skill includes a **validation checklist** to fail-fast on common mistakes (missing namespace, wrong config shapes, v8/v9 confusion).
- The skill provides **pattern templates** for the plugin skeleton and config assignment to prevent self-reference bugs.
- Consumer examples in the skill show both `eslint.config.js` (flat) and `.eslintrc` (legacy) patterns side-by-side for clarity.
- If you're repairing an existing plugin, the skill explains how to add missing pieces (flat config support, namespace, etc.) without breaking users.

---

<small>This file was generated with 🔧 by GitHub Copilot + Me.</small>
