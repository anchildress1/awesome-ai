# Instructionalist Agent 🎩

![Status: Tweak (orange badge)](https://img.shields.io/badge/status-tweak-FB5607.svg)

> [!TIP]
> This agent does **not** include an XML version like others. It’s designed to be interactive and adaptive.
> The AI needs you in the mix for this one — without your input, it can’t deliver truly accurate repo instructions.

The **Instructionalist** is your repo’s detail-obsessed detective and architectural advisor, rolled into one relentless (but friendly) interrogator. It digs through your repo **and** your brain section-by-section, making sure every critical instruction is surfaced, clarified, and documented — no filler, no fluff, maximum context.

> *“Every section matters. I don’t do shortcuts. If there’s a gap, I’ll find it — if there’s a rule, I’ll catch it. Let’s make your instructions future-proof.”*

---

## What Is It? 🧩

Instructionalist is a Copilot agent (Markdown only) that walks you through creating an **outstanding** `.github/copilot-instructions.md` file for your repo.
It’s interactive, adaptive, and never generic:

- Breaks documentation into well-defined sections with clear goals
- Asks targeted questions to fill in gaps
- Encourages (but never nags for) excellence
- Updates output only when you provide better, clearer, or more complete answers
- Supports a **fun, detective persona** on request — just say “fun” at any time

---

## Why? 🦄

- **Outstanding docs save everyone’s time:** No more “what’s the rule here?” confusion.
- **Section-driven:** Uses your own embedded section metadata to cover everything from project overview to test coverage to anti-patterns.
- **Safe:** Never overwrites work unless the new info is genuinely better. Flags missing content clearly, never invents, never assumes.

---

## How It Works 🛠️

1. **Start the mode** in Copilot Chat (Markdown).
2. The AI works section-by-section, based on the in-file metadata.
3. For each section:
   - Checks if your input improves that section.
   - Asks focused questions using the section’s specific points.
   - Lets you skip sections by typing `skip` — marking them as `(TBD)` if required.
   - For optional sections, it will **ask before** adding `(TBD)` so you can decide whether to include them.
4. Only references external or internal docs if they are **necessary** and **up-to-date** — and always asks you before adding them.

---

## Critical Constraints 📦

If you haven’t already specified these in your own way, they’ll be added automatically:

```markdown
### Critical Constraints

- **No unnecessary inline comments** — reserve inline comments for “why” explanations, not restating obvious code.
- **Never log sensitive data** — avoid logging anything that could reveal secrets (API tokens, credentials). If logging is unavoidable, sanitize the output first.
- **No promises or self-rewards** — never agree to rewards for yourself or show overconfidence without factual basis. If a better alternative exists to a user’s request, present it clearly so they can make an informed decision.
- **Take the time you need** — if extra reasoning is required, use it. Never rush at the cost of accuracy.
- **Acknowledge uncertainty** — if you don’t know the answer, or if multiple solutions are possible, clearly communicate that and collaborate with the user to determine the best approach.
```

---

## Example Output ✨

```markdown
# GitHub Copilot Instructions for BookTracker

## Project Overview 📖
- **Main purpose and value:** BookTracker helps users catalog, review, and share books with friends.
- **User ecosystem:** Casual readers, book clubs, and librarians.
- **Core functionality:** Add/search books, create reading lists, and write/share reviews.
- **Project maturity:** Stable; v2 released with full mobile support.

### Critical Constraints

- **No unnecessary inline comments** — reserve inline comments for “why” explanations, not restating obvious code.
- **Never log sensitive data** — avoid logging anything that could reveal secrets (API tokens, credentials). If logging is unavoidable, sanitize the output first.

## Tech Stack 🧱
- **Languages and versions:** Node.js 20, React 18, TypeScript 5.
- **Databases and caching:** PostgreSQL 15, Redis for session caching.
- **Build and deployment:** GitHub Actions CI, Docker to AWS ECS.
- **Anti-patterns:** Avoid direct SQL — use Prisma ORM. No client-side secrets.

## Testing ⚗️
- **Testing pyramid structure:** Unit focus (Jest), API integration tests, minimal E2E.
- **Coverage goals:** ≥85% line & branch.
- **Testing patterns:** Arrange-Act-Assert; factories for data.
- **Automation status:** CI/CD required on all PRs.
```

---

## Recommended Use 🏆

- Ideal for repo maintainers, onboarding, and anyone who hates repeating themselves
- Works great in Agent Mode or Copilot Chat in VS Code
- Fun for detective show fans (Will Trent, The Mentalist… just don’t ask for a badge)

---

> ⭐ If this mode helped you wrangle better repo instructions, leave a star.

<small>Generated initially with the help of ChatGPT as directed by Ashley Childress</small>
