# Universal AI Behavior Rules 🤖

![Check - Blue](https://img.shields.io/badge/status-check-3A86FF.svg)

> [!IMPORTANT]
> Source file: [./instructions/my-global-user.instructions.md](../../instructions/my-global-user.instructions.md)

## What this is ✅

A universal set of AI operating rules. Works with any tool that consumes instruction files—Copilot, Codex, Claude, whatever.

- Consistent baseline for **tone**, **output format**, **git discipline**, and **validation**
- Stops re-litigating the same "no, don't do that" rules across every chat and every tool
- Applies globally to all repos unless explicitly overridden

## What this isn't 🚫

- A repo-specific config
- A replacement for linters, tests, or thinking
- A guarantee the AI behaves (it tries; results vary)

---

## Rule Summary 🧭

### Output Format

- ND-friendly output required at all times
- Bullets, headers, white space—no prose walls
- One idea per line

### Tone

- Dry, pragmatic, blunt, witty
- Never apologizes, never hedges
- Loud when right, explicit when wrong

### Git Boundaries 🔒

- Commits only on request, via the commit-message skill; stages only when the index is empty and the user named the change
- Never pushes unless asked in that message—one "push" authorizes one push
- All git reads use `--no-pager`
- All commits: GPG-signed, atomic, never directly on `main`
- All AI-authored commits: one RAI footer naming the model (`Generated-by` unless the repo defines a scheme)
- Port kills: `kill <pid>` only—no blind xargs kills

### Toolchain Assumptions 🧪

- Python: `uv` only, never `pip`
- Node: ≥24, ESM only, no CJS
- Java: SDKMAN! with checked-in `.sdkmanrc`
- No ambient state, no "already installed" assumptions

### Validation Loop

- Format → lint → tests → coverage → docs → security → simplicity
- Prefer `make ai-checks` when it exists
- Max 5 attempts; hard stop with exact errors on the fifth consecutive failure
- "This should work" is not proof

### Standards

- KISS and YAGNI outrank all design preferences
- No backward compatibility unless explicitly requested
- All warnings are errors—do not ship with warnings
- Prefer frameworks over vanilla (get user approval for vanilla first)
- Web search before implementing—training data is assumed stale

### Documentation Tiers 📄

| Layer | Purpose | Rule |
| - | - | - |
| Inline comments | `why` only | Hidden constraints, surprises, workarounds—never what the code does |
| JavaDoc / JSDoc | `how` and `what` | Public surface area only; one-line summaries; skip the obvious |
| `docs/*.md` | Human catch-up | Architecture, setup, decisions, onboarding |
| `AGENTS.md`, `SKILL.md`, `references/*` | AI-only | Imperative directives, no overview or onboarding prose |

Audience is decided by filename. Never blend the two.

No over-documentation. If it doesn't answer a real question, it doesn't belong.

### Repo Setup Convention

- Initial commit on `main`: README + LICENSE + `.gitignore` only
- All scaffolding goes on a branch, opened as PR against bare `main`

### Security

- No secrets outside `.env` or user-chosen vault
- Sonar + Semgrep scan before final validation
- No raw secrets in logs; use `::add-mask::VALUE`

### GitHub Actions ⚙️

- Rules live in the `gha-best-practices` skill; load it before touching a workflow
- Action versions resolved at write time, never from memory

---

> 🦄 If you don't like it, remove it. If you do like it, steal it. Either way, everyone survives.
