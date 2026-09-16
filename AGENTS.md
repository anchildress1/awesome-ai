# awesome-ai — Agent Instructions

## Repository purpose

Collection of custom instructions, prompts, agents, and skills for GitHub Copilot and other AI tools.

## File layout

| Artifact type | Location | File suffix/name |
| - | - | - |
| Instructions | `instructions/` | `.instructions.md` |
| Prompts | `prompts/` | `.prompt.md` |
| Agents (formerly Chat Modes) | `agents/` | `.agent.md` |
| Skills | `skills/<skill-name>/` | `SKILL.md` |

Skills may include:

- `skills/<skill-name>/references/` — reference docs consumed by the skill
- `skills/<skill-name>/assets/` — templates and examples consumed by the skill

## Status system

All artifact files (instructions, prompts, agents, skills) use a `status` field in YAML frontmatter. Documentation files in `docs/` do not require frontmatter. Status definitions: `docs/status-badge-lifecycle.md`.

## Content rules

### Emojis

Emojis in Markdown headers MUST appear after the header text, never before. Reason: screen readers announce emojis first when they lead, disrupting comprehension.

### Documentation (`docs/`)

- Audience: human readers (contributors, users)
- No frontmatter required
- Must contain a status badge
- Explains purpose, usage, and examples for the corresponding artifact
- Extend existing files; do not create new formats

### Artifact files (instructions, prompts, agents, skills)

- Audience: AI agents
- YAML frontmatter required with at minimum a `status` field
- Follow existing file patterns in each directory

## Toolchain

- **remark**: Markdown linting and formatting — `npm run check` / `npm run format`
- **commitlint**: Conventional Commits enforcement via custom plugin
- **lefthook**: Runs remark and commitlint as pre-commit and commit-msg hooks
