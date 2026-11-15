## File layout

| Artifact type | Location | File suffix/name |
| - | - | - |
| Instructions | `instructions/` | `.instructions.md` |
| Prompts | `prompts/` | `.prompt.md` |
| Agents | `agents/` | `.agent.md` |
| Skills | `skills/<skill-name>/` | `SKILL.md` |

Skill extras go in `references/` (docs the skill reads) and `assets/` (templates, examples).

Skills ship as the Claude Code plugin in `.claude-plugin/`. Adding or changing a skill → bump
`version` in `.claude-plugin/plugin.json`, or existing installs fetch nothing.

## Artifact files

- Audience: AI agents
- YAML frontmatter with at minimum `status`; values defined in `docs/status-badge-lifecycle.md`
- Follow existing file patterns in each directory

## Documentation (`docs/`)

- Audience: human readers
- No frontmatter; must carry a status badge matching the artifact's `status`
- Extend existing files; do not create new formats

## Emojis

Emojis in Markdown headers go after the header text, never before — screen readers announce a
leading emoji first.

## Validation

Run `npm run format` then `npm run lint` before committing.
