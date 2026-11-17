# Generate Simple Conventional Commit Message 🧠

![Status: Check (blue badge)](https://img.shields.io/badge/status-check-3A86FF.svg)

This one exists because the old commit generator was trying too hard. It walked Copilot through every diff like a nervous parent, while modern models were already doing the homework on their own.

This generator creates a Conventional Commit message from your repository changes and writes it to `./commit.tmp` for review.

## How to use 📝

- Stage the changes you want included (recommended). It reads the staged diff first, then the working tree, and falls back to chat memory only when no diff is available.
- Run the prompt in Copilot Chat. The message is written to `commit.tmp` and shown in chat so you can edit it before committing.
- Touched unrelated areas? It recommends a split instead of writing a catch-all subject.
- Still check the message against your commit linter before committing.

> Good commits tell the truth about what changed and who helped.

---

## RAI Attribution Explained 🖋️

Every commit that used AI to get there should say so. That’s not a disclaimer — it’s context about who contributed what.

Exactly one footer, based on the share of changed lines the AI wrote. Unsure between two brackets → it picks the higher one:

- **Generated-by**: 60% or more
- **Co-authored-by**: 25–59%
- **Assisted-by**: 1–24%
- **Commit-generated-by**: AI only wrote the message

Format: `<Trailer>: GitHub Copilot <copilot@github.com>` (the prompt carries signatures for other assistants too)

---

## Issue References 🔗

When your changes relate to a Jira ticket or issue, the generator will use the Jira key as the **scope** in the commit subject, not as a footer. This creates a direct link between your commit and the issue.

**Scope Examples:**

- `feat(PROJ-123): add new authentication feature`
- `fix(DEVOPS-456): resolve database connection timeout`
- `refactor(UI-789): simplify component structure`

If no Jira key is found, the scope falls back to a short area keyword (e.g., `feat(auth): add login validation`), or is omitted when nothing fits.

**Footer Relationships** (when explicitly needed):

- **`Fixes PROJ-123`** - This commit completely solves the issue
- **`Resolves DEVOPS-456`** - Same as Fixes, but some projects prefer this word
- **`Refs UI-789`** - This work is related but doesn't close the issue

---

## Output Example 📤

```text
feat(DEVOPS-2025): introduce incremental indexer with content dedupe

- Add `buildIncrementalIndex()` pipeline for batched documents
- Implement `getPendingDocs()` repository for staged fetches
- Remove legacy full-reindex job per YAGNI
- Add `dedupeByContentHash()` helper to prevent duplicate writes
- Enrich index entries with `ingestedAt` from the datastore
- Add comprehensive test coverage for indexer and repository layers
- Update design notes and runbook to reflect the streamlined flow

Co-authored-by: GitHub Copilot <copilot@github.com>
```

---

## Philosophy 🧭

This isn’t really about making better commit messages. It’s about leaving a paper trail that means something.

AI doesn’t erase authorship — it complicates it. So this little generator exists to keep that balance visible: you write code, Copilot helps, and both of you sign the work the same way anyone else would.

> Because if we’re going to build with AI, we should at least have the decency to leave our names on the door.

And if you want to go one better — use a **GPG key** to sign your commits and include your own `Signed-off-by` footer. That extra signature isn’t performative; it’s proof. It says, **this was reviewed, this was intentional, *and it is mine*.**

> 🦄 If you haven't read it yet, I wrote a post about [RAI and commit attribution](https://dev.to/anchildress1/did-ai-erase-attribution-your-git-history-is-missing-a-co-author-1m2l) that walks through why it matters—it's not about permission, *it's about provenance.*

---

<small>🛡️ Generated initially with the help of ChatGPT and GitHub Copilot as directed by Ashley Childress</small>
