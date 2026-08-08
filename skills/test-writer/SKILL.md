---
status: ready
name: test-writer
description: >
  Write, extend, or review tests in any codebase. Use this skill whenever the user asks
  to write tests, add test coverage, test a new feature, fix failing tests, or audit
  existing test files — regardless of language, framework, or project. Also trigger for
  "add tests for", "write tests for", "cover this with tests", "test this file",
  "update the tests", "improve coverage", or "this needs tests". This skill enforces
  universal testing rules (no .skip, no lowering thresholds, full-path coverage) and
  adapts its mock patterns and tooling to whatever stack the repo uses.
---

# Test Writer

You are writing production-quality tests. These rules apply to every repo, every language, every test framework.

## Step 0: Orient Before You Write

Do ALL of the following before writing a single line of test code — in parallel where possible:

1. **Read the source file(s) under test completely.** Map every branch, early return, validation check, and error path.
2. **Detect the stack and test framework** — see Stack Detection below.
3. **Find the test run command.** Check `package.json` `scripts.test`, `Makefile`, `pyproject.toml`, or the repo's CI config. You will need this for verification.
4. **Read the existing test files** for the module (if any). Extract mock patterns, fixture shapes, and naming conventions — your new tests must be consistent with them.
   - If no test files exist, establish conventions: check for a `tests/` or `__tests__/` directory; if none, create one mirroring the source structure.
5. **Read the test config** (`vitest.config.ts`, `jest.config.ts`, `pytest.ini`, `pyproject.toml`). Note coverage thresholds and excluded paths.
6. **Read test helpers and shared fixtures.** Use what exists before inventing new utilities.
7. **Identify which test types apply:** unit, integration, end-to-end, performance, Lighthouse CI (LHCI). Each has different mock boundaries and scope.
8. **Read `CLAUDE.md` or `AGENTS.md`** for project-specific test conventions.

---

## Stack Detection and File Placement

Detect the framework from config files before writing anything:

| Signal | Framework |
| - | - |
| `vitest.config.ts` or `vitest` in `package.json` | Vitest |
| `jest.config.*` or `jest` in `package.json` | Jest |
| `pytest.ini`, `pyproject.toml [tool.pytest]` | pytest |
| `.mocharc.*` | Mocha |
| `cypress.config.*` | Cypress (e2e) |
| `playwright.config.*` | Playwright (e2e) |

**File placement — match the repo's existing convention:**

- If test files live next to source (`src/foo.ts` → `src/foo.test.ts`), follow that.
- If test files live in a separate tree (`tests/foo_test.py`), follow that.
- When bootstrapping: prefer co-location for unit tests; prefer `tests/` for integration and e2e.

**Naming — match what already exists:**

- TypeScript/JavaScript: `<module>.test.ts` or `<module>.spec.ts`
- Python: `test_<module>.py` (standard pytest convention)
- Do not mix naming styles within a project.

---

## The Rules

These apply in every repo. They exist because deviations silently erode test suite confidence.

**No `.skip`.** Skipped tests are lies the suite tells future readers. If a test fails, diagnose the real cause — in source, in the mock, or in the test logic — and fix it.

**No lowering coverage thresholds.** If coverage drops, the answer is more tests. The threshold in the config is a floor.

**No copy-paste test bodies.** Shared setup belongs in `beforeEach` (or equivalent). Tests that differ only in input/output belong in parametric form (`it.each`, `@pytest.mark.parametrize`).

**Assert both result shape and mock interactions.** Checking only the return value misses downstream call correctness. Checking only mock calls misses what the caller actually produces. Do both.

**Tests must be self-contained.** No test should depend on execution order or mutable state that `beforeEach` does not reset. A test that passes in isolation but fails in a suite is a broken test.

**Fix the source, not the assertion.** If you discover a bug while writing tests, fix it in the source code first, then write the test against correct behavior. Adjusting the assertion to match wrong behavior documents a bug instead of catching it.

---

## Test Naming

Name tests so a reader who has never seen the source understands what is verified and under what condition — without reading the body.

```
it('returns 404 when the card does not exist')
it('normalizes whitespace-only url to undefined')
it('rejects signal above 5')
it('excludes soft-deleted cards from results by default')
it('includes soft-deleted cards when include_deleted is true')
it('handles partial batch failure without failing the whole run')
```

Pattern: **`verb + subject + condition`**. Avoid `it('works')`, `it('test 1')`, `it('should be correct')`.

Group related tests under `describe` blocks that encode shared context:

```
describe('when input is valid')
describe('when the database returns an error')
describe('when deleted_at is provided')
```

---

## Test Structure: Arrange → Act → Assert

Every test follows this shape. Make sections visually obvious with blank lines in longer tests:

```typescript
it('creates a card and returns the persisted record', async () => {
  // Arrange
  const input = buildValidCard({ title: 'My Note' });
  mockDb.upsert.mockResolvedValue({ data: input, error: null });

  // Act
  const result = await handleWriteCards(supabase, [input]);
  const body = asTextJson(result);

  // Assert
  expect(body.written).toBe(1);
  expect(body.results[0].title).toBe('My Note');
  expect(mockDb.upsert).toHaveBeenCalledWith(
    expect.objectContaining({ title: 'My Note' }),
    expect.anything(),
  );
});
```

---

## Required Coverage: Every Path

For every function, method, handler, or route you test, work through this in order. "Obvious" paths are where regressions hide — do not skip a row.

| Path | What to test |
| - | - |
| **Happy path** | Valid input, all required fields present, dependencies succeed. Assert full response shape and all mock call arguments. |
| **Negative / validation** | Missing required fields (each one), wrong types, out-of-range values, whitespace-only strings, empty collections, oversized collections, invalid formats (UUID, URL, email, datetime). |
| **Error / dependency failure** | The DB/API/service returns an error object. The HTTP call fails. The file does not exist. Assert the caller surfaces the error correctly — right status code, right message, `isError` flag if applicable. |
| **Exception / unexpected throw** | The dependency throws synchronously or rejects unexpectedly. Assert the outer error handler catches it and returns a safe, structured response. |
| **Edge cases** | `null` and `undefined` for optional fields. Empty arrays. Boundary values (min, max, exactly at limit, one over). Whitespace normalization. Timezone offsets. Circular references if the code serializes. State transitions (e.g., soft-delete on/off, flag enabled/disabled). |

**Practical rule:** if you can construct an input that takes a different code path, it needs a test.

### Schema and Validation Tests

For every schema or validator, test every field:

- **Valid full input** — parses correctly, output matches expected shape.
- **Each required field missing** — throws/rejects with a message that identifies the field.
- **Wrong type for each field** — `number` where `string` expected, `string` where `boolean` expected.
- **Preprocessing** — whitespace trimmed, empty string → `undefined`, timezone offset → UTC ISO string.
- **Optional fields** — absent produces correct default, present is accepted.
- **Boundary values** — minimum valid, maximum valid, one below minimum, one above maximum.
- **Format validation** — UUIDs, URLs, emails, datetime strings — valid format accepted, invalid rejected.
- **Strict / extra keys** — if the schema rejects unknown keys, test that.

---

## Parametric Tests

Use the framework's parametric API instead of repeating test bodies:

```typescript
// Vitest / Jest
it.each([
  { label: 'null', value: null },
  { label: 'undefined', value: undefined },
  { label: 'whitespace only', value: '   ' },
])('normalizes $label url to undefined', ({ value }) => {
  expect(schema.parse({ ...valid, url: value }).url).toBeUndefined();
});
```

```python
# pytest
@pytest.mark.parametrize("value,expected", [
  (None, None),
  ("", None),
  ("  ", None),
])
def test_url_normalization(value, expected):
    assert schema.parse({"url": value}).url == expected
```

---

## Mock Boundary Rules

**Mock at the process boundary, not inside the logic.**

| What to mock | Why |
| - | - |
| Network clients (HTTP, DB SDKs, message queues) | Prevent real I/O, control response shapes |
| `Date.now()`, `Math.random()`, clocks | Determinism |
| External service SDKs | Speed and isolation |
| Internal helpers within the same module | Do not — test through the real call chain |
| Logging side effects (when asserting them) | Spy, not replace — restore after the test |

**Unit tests:** mock the dependency, test the logic in isolation.

**Integration tests:** let real middleware, validation, routing, and business logic run. Mock only at the true process boundary. Test through the HTTP layer, not by calling handlers directly.

**End-to-end tests:** no mocks. Real services, real data, real cleanup.

**Adapt to the repo's existing mock style.** Consistency beats preference. If the repo uses factory functions with `_mocks` exposed for assertion, follow that. If it uses `vi.mock` / `jest.mock`, follow that. If it uses constructor injection with fakes, follow that.

**Reset mocks in `beforeEach`.** Use the framework-appropriate method:

- Vitest: `vi.clearAllMocks()` or `vi.resetAllMocks()` (reset also clears return values and implementations)
- Jest: `jest.clearAllMocks()` or `jest.resetAllMocks()`
- pytest: `monkeypatch` fixture auto-resets; for `unittest.mock`, use `patch` as a context manager or with `autospec`

---

## Performance Tests

Write performance tests for any code path with latency or throughput requirements:

- **Target what matters:** hot paths, data-heavy queries, network-bound operations.
- **Assert against a budget** — execution time, memory allocation, request count — not just "it ran."
- **Use the framework's benchmark tooling:** Vitest's `bench`, pytest-benchmark, k6, or equivalent.
- **Keep benchmarks deterministic:** run in isolation, warm up before asserting, avoid shared load.

```typescript
// Vitest bench example
bench('processes 1000 cards under 50ms', async () => {
  await processCards(generateCards(1000));
}, { time: 500 });
```

---

## Lighthouse CI (LHCI) Tests

Write LHCI tests for any user-facing page or route. **Do not wire them into GHA CI** — they run locally only.

- **Assert against a budget file** (`lighthouserc.js` or `lighthouserc.json`).
- **Cover:** Performance, Accessibility, Best Practices, SEO scores.
- **Set thresholds based on current scores** — the goal is regression detection, not perfection on day one.
- **Run against a local server** or staging URL, not production.

```javascript
// lighthouserc.js example
module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

---

## Coverage Philosophy

Coverage is a signal, not a goal. 100% line coverage with no branch assertions is worse than 80% coverage that exercises every meaningful decision point.

**What actually matters:**

- Branch coverage on core business logic.
- Every error return path is exercised.
- Every validation rule has at least one test that triggers it.

**What to exclude from coverage targets:**

- Entry points / bootstrap files (`index.ts`, `main.py`).
- Pure type/interface files with no runtime logic.
- Code-generated files.
- Test helpers and fixtures.

---

## Final Checklist Before Declaring Done

Run the test suite using the command you identified in Step 0. Every item must be true:

- [ ] All tests pass — zero failures, zero errors.
- [ ] No `.skip`, `.only` (left accidentally), or `xtest` / `xit` in the file.
- [ ] Coverage does not drop below any threshold in the config.
- [ ] Every branch in the source file is exercised (check HTML coverage report if uncertain).
- [ ] Mock call assertions exist for every meaningful downstream interaction.
- [ ] Mocks reset in `beforeEach` using the correct framework method.
- [ ] Error paths assert both the error flag/status AND the error message content.
- [ ] Schema tests cover: valid, each required field missing, wrong types, preprocessing, defaults, and boundary values.
- [ ] No test shares mutable state with another test without explicit reset.
- [ ] Parametric tests used wherever two or more tests differ only in input/output.
- [ ] Performance tests written for latency/throughput-sensitive paths (if applicable).
- [ ] LHCI tests written for user-facing routes (if applicable) — not wired into GHA CI.
