---
status: draft
name: eslint-plugin-configuring
description: Generate or update an ESLint plugin that exports rule configs compatible with ESLint v8 (eslintrc) and ESLint v9 (flat config).
---

> **Stale target.** Rules below cover ESLint **v8 and v9**. v9 reached end-of-life
> 2026-08-06; **v10** has been current since February 2026 and dropped Node < 20.19.
> Confirm the consumer's ESLint major and check
> <https://eslint.org/docs/latest/extend/plugins> for v10 plugin-shape changes before
> applying anything. Never assume the v9 shapes still hold.

Scope: author or modify an ESLint **plugin package** exporting `rules`, `configs`
(flat and/or legacy), optional `processors`, and `meta` (`name`, `version`, `namespace`).
Deliverable is plugin source **plus** working consumer examples.

| File | Use for |
| - | - |
| `references/eslint-plugin-configs.md` | Plugin skeleton and config-assignment code |
| `examples/consumers.md` | Flat and legacy consumer configs for each naming strategy |

## Version semantics — state these correctly or not at all

| Version | Default | Other mode |
| - | - | - |
| v9 | Flat config | `.eslintrc*` deprecated; applies only with `ESLINT_USE_FLAT_CONFIG=false` |
| v8 | `.eslintrc*` | Flat opt-in via `eslint.config.js` or `ESLINT_USE_FLAT_CONFIG=true` |

## Hard constraints

- Never claim a plugin can force its own config to be used. It cannot.
- Never invent config-resolution behavior that isn't documented.
- Never mix flat and legacy shapes: no flat object exported as legacy, no legacy config
  exported as an array.
- Never emit colliding or ambiguous config names.
- Never silently rename or remove a published config key — breaking for every consumer.

## Inputs (assume derivable)

`PACKAGE_NAME` · `NAMESPACE` (rule/config prefix) · `RULES` (`ruleId → implementation`) ·
desired config set (`recommended`, `strict`, …).

## Plugin shape

Single object, ESM default export:

- `meta` — `name`, `version`, `namespace`
- `rules`
- `configs`
- `processors` (optional)

`meta.namespace` is the canonical prefix for rules, configs, and registration. Rule IDs
inside the plugin never contain `/`. Every rule reference in a config is
`"<namespace>/<ruleId>"`.

## Naming strategy — pick one, apply throughout

| Strategy | When | Keys |
| - | - | - |
| **A** (default) | New plugin, or you own the public API | Flat `flat/<configName>` · Legacy `legacy-<configName>` |
| **B** | Legacy `<configName>` already published | Keep `<configName>` exactly; add `flat/<configName>` |

## Config requirements

**Flat (v9 primary)** — array of config objects · plugin registered in object form
`plugins: { [namespace]: plugin }` · namespaced rule keys · `languageOptions` optional.
`configs["flat/recommended"] → Array<FlatConfigObject>`

**Legacy (v8)** — plain eslintrc object · `plugins: ["<namespace>"]` · namespaced rule
keys · `globals`/`parserOptions` optional.
`configs["legacy-recommended"] → EslintrcObject`

## Self-reference

A config that references the plugin object must not read `plugin` before it exists:

1. Create `plugin` with `configs` empty.
2. Assign configs afterward (`Object.assign`).

## Consumer mapping

The `flat/` prefix is an **export key, never a consumer string**.

| Export key | Consumer extends |
| - | - |
| `configs["flat/recommended"]` | `"namespace/recommended"` |
| `configs["legacy-recommended"]` | `"namespace/legacy-recommended"` |
| `configs["recommended"]` (Strategy B) | `"namespace/recommended"` |

## Required output

Unless the user excludes them, emit both, matching the chosen naming strategy exactly:

1. **Flat** — `eslint.config.js`, using `defineConfig`, registering the plugin, using
   `extends`.
2. **Legacy** — `.eslintrc` (JSON/YAML/JS), using `plugins` + `extends`.

Plus plugin source or diffs, and the validation result below.

## Migration

- Legacy only, dual support wanted → add `flat/<name>`
- Flat only, v8 support wanted → add `legacy-<name>`
- `meta.namespace` missing → add it and realign every rule prefix
- Consumer examples disagree with config keys → regenerate the examples, not the keys

## Validation gate

All must hold before reporting done:

- `meta.name`, `meta.version`, `meta.namespace` present; namespace matches every rule prefix
- Flat configs are arrays and register via object form
- Legacy configs are eslintrc-shaped and register via array form
- One naming strategy applied throughout; no config key collisions
- Version behavior stated correctly per the table above
- No claim that the plugin forces config usage
