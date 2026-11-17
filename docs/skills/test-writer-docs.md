# Test Writer Skill 🧪

![Status: Ready (green badge)](https://img.shields.io/badge/status-ready-007F5F.svg)

Write, extend, or audit tests in any language, any framework, any repo—without relearning the rules every time.

Skill source: [`skills/test-writer/SKILL.md`](../../skills/test-writer/SKILL.md)

> 🦄 **Why this exists:** tests are non-negotiable. The rules around what counts as a test—coverage paths, mock boundaries,
> naming conventions—should be consistent even when the stack isn't.

---

## When It Triggers 🎯

Any of these phrases kick it off:

- `write tests for`, `add tests for`, `cover this with tests`
- `test this file`, `update the tests`, `improve coverage`
- `fix failing tests`, `audit existing test files`
- `this needs tests`

---

## What It Does 🛠️

Before writing a single line, it orients—in parallel:

1. Reads the source file(s) completely—every branch, return, and error path
2. Detects the test framework from config files (`vitest.config.ts`, `jest.config.*`, `pytest.ini`, etc.)
3. Finds the test run command from `package.json`, `Makefile`, or CI config
4. Reads existing test files for the module—extracts mock patterns, fixture shapes, naming conventions
5. Reads test config for coverage thresholds and excluded paths
6. Reads shared test helpers and fixtures—uses what exists before inventing anything
7. Identifies which test types apply: unit, integration, e2e, performance, LHCI

Then it writes. Then it runs. Then it verifies.

---

## The Hard Rules ⛔

No exceptions, no negotiation:

- **No `.skip`** — a skipped test is a lie. Diagnose and fix the real cause.
- **No lowering coverage thresholds** — coverage drops mean more tests, not a lower bar.
- **No copy-paste test bodies** — shared setup goes in `beforeEach`; repeated input/output patterns go parametric.
- **Assert both result shape and mock interactions** — checking only one misses half the contract.
- **Tests must be self-contained** — no shared mutable state, no order dependency.
- **Fix the source, not the assertion** — if a bug surfaces during testing, fix it in source first.

---

## Required Coverage Paths 📋

For every function or handler, every row is required:

| Path | What gets tested |
| - | - |
| **Happy path** | Valid input, all deps succeed, full response shape + mock args |
| **Negative / validation** | Each missing required field, wrong types, out-of-range values, empty/oversized collections |
| **Error / dependency failure** | DB/API returns error, HTTP call fails, file missing—assert correct status + message |
| **Exception / unexpected throw** | Dep throws synchronously or rejects—assert outer handler catches and returns structured response |
| **Edge cases** | `null`/`undefined` optionals, boundary values, whitespace normalization, state transitions |

Practical rule: if you can construct an input that takes a different code path, it needs a test.

---

## Mock Boundaries 🔬

| Mock this | Don't mock this |
| - | - |
| Network clients (HTTP, DB SDKs, queues) | Internal helpers within the same module |
| `Date.now()`, `Math.random()`, clocks | Business logic you're trying to test |
| External service SDKs | — |

- **Unit tests:** mock the dependency, test the logic in isolation
- **Integration tests:** let real middleware/routing/validation run; mock only at the true process boundary
- **End-to-end tests:** no mocks, real services, real cleanup

Always match the repo's existing mock style—consistency beats preference.

---

## Test Naming Convention ✍️

Pattern: **`verb + subject + condition`**

```
it('returns 404 when the card does not exist')
it('normalizes whitespace-only url to undefined')
it('excludes soft-deleted cards from results by default')
it('handles partial batch failure without failing the whole run')
```

Group related tests under `describe` blocks that encode shared context:

```
describe('when input is valid')
describe('when the database returns an error')
```

---

## Performance & LHCI 🏎️

- **Performance tests:** use `vitest bench`, `pytest-benchmark`, or equivalent; assert against a time/memory budget—not just "it ran"
- **LHCI tests:** written for user-facing routes, run locally only—never wired into GHA CI

---

## Final Checklist ✅

The skill won't declare done until:

- All tests pass—zero failures, zero errors
- No `.skip`, `.only`, `xtest`, or `xit` left in the file
- Coverage is at or above all configured thresholds
- Every meaningful branch in source is exercised
- Mock call assertions exist for every downstream interaction
- Mocks reset in `beforeEach` with the correct framework method
- Error paths assert both error flag/status AND message content
- Parametric tests used wherever tests differ only in input/output

---

## Practical Notes 🧰

- File placement and naming follow the repo's existing convention—it reads before placing
- When no test files exist, it bootstraps a structure mirroring the source tree
