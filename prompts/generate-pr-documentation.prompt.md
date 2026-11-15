---
status: "draft"
title: "Generate Documentation Sync for PRs"
description: "Generate comprehensive documentation updates for PR changes with AI attribution"
---

Update Markdown docs so they match what this PR actually changes. Correctness over completeness.

## Hard rules

- Edit only `.md` files (root `README.md` included). Read anything; modify nothing else.
- Never document secrets, credentials, PII, or env var values. Env vars: name + purpose only.
- Mermaid only, with `accTitle:` and `accDescr:` as the first lines; validate every diagram.
- Never add: tables of contents, meta-docs about docs, index READMEs that only list other docs,
  test-coverage metrics or test catalogs, implementation detail visible in code, per-feature spec
  files when behavioral specs (Gherkin) exist, duplicated content.

## Workflow

1. Read the full diff: `gh pr diff`. Classify changes (feature, fix, refactor, config, API,
   schema) and flag security-relevant changes, new env vars, external integrations, and breaking
   changes.
2. Read repo instructions (`.github/copilot-instructions.md`, `AGENTS.md`, `.github/agents/`) and
   map the existing doc structure (`README.md`, `docs/`, ADRs, API specs).
3. Update only where a change affects user understanding or onboarding — API, architecture,
   configuration, or significant flow changes.
4. Placement, in order of preference: edit existing doc → rename a misnamed doc → create a new
   file only when the topic has no home and adds real value.
5. Sweep all docs: delete content contradicting the code, merge duplicates into one source,
   remove orphans, propose renames for misaligned names.
6. Minimum viable corrections: fix inaccuracies; don't rewrite stable docs; keep historical
   context (ADRs).

## Exit gate

- Breaking changes called out explicitly
- Links to source files use workspace-relative paths
- Terminology matches the codebase
