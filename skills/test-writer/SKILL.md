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

Repo convention beats every preference below. Exception: the hard rules always win.

## Step 0 — orient

Complete all of these before the first line of test code. Parallelize the reads.

1. Read the source under test **completely**. Map every branch, early return, validation,
   and error path.
2. Detect the framework (table below).
3. Find the test command — `package.json` `scripts.test`, `Makefile`, `pyproject.toml`,
   or CI config. Required for the final verification step.
4. Read existing tests for the module. Extract mock patterns, fixture shapes, naming. New
   tests must match them. None exist → check for `tests/` or `__tests__/`; if neither,
   create one mirroring the source tree.
5. Read the test config (`vitest.config.ts`, `jest.config.ts`, `pytest.ini`,
   `pyproject.toml`). Note coverage thresholds and exclusions.
6. Read shared helpers and fixtures. Use what exists before inventing utilities.
7. Decide which test types apply — unit, integration, e2e, performance, LHCI. Each has a
   different mock boundary.
8. Read `CLAUDE.md` / `AGENTS.md` for project test conventions.

## Stack detection

| Signal | Framework |
| - | - |
| `vitest.config.ts` or `vitest` in `package.json` | Vitest |
| `jest.config.*` or `jest` in `package.json` | Jest |
| `bunfig.toml`, or `bun test` in `scripts.test` | `bun:test` |
| `pytest.ini`, `pyproject.toml [tool.pytest]` | pytest |
| `.mocharc.*` | Mocha |
| `cypress.config.*` | Cypress (e2e) |
| `playwright.config.*` | Playwright (e2e) |

Placement and naming follow the repo, always:

- Co-located (`src/foo.ts` → `src/foo.test.ts`) or separate tree (`tests/foo_test.py`) —
  whichever already exists.
- Bootstrapping from nothing: co-locate unit tests, put integration/e2e in `tests/`.
- TS/JS `<module>.test.ts` or `.spec.ts` · Python `test_<module>.py`. Never mix styles
  inside one project.

## Hard rules

- **No `.skip`.** Diagnose the real cause — source, mock, or test logic — and fix it.
- **Never lower a coverage threshold.** The config value is a floor. Coverage dropped →
  write more tests.
- **No copy-pasted bodies.** Shared setup → `beforeEach`. Tests differing only in
  input/output → parametric (`it.each`, `@pytest.mark.parametrize`).
- **Assert result shape AND mock interactions.** Return value alone misses wrong
  downstream calls; mock calls alone miss what the caller produced.
- **Self-contained.** No dependence on execution order or on state `beforeEach` does not
  reset. Passes alone, fails in-suite → broken test.
- **Fix the source, not the assertion.** A bug found while testing gets fixed first, then
  tested against correct behavior.

## Naming

`verb + subject + condition` — a reader who has never seen the source knows what is
verified and when, without opening the body.

```
it('returns 404 when the card does not exist')
it('normalizes whitespace-only url to undefined')
it('rejects signal above 5')
it('excludes soft-deleted cards from results by default')
it('handles partial batch failure without failing the whole run')
```

Never `it('works')`, `it('test 1')`, `it('should be correct')`.

`describe` blocks encode shared context: `describe('when the database returns an error')`.

## Structure — Arrange / Act / Assert

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

## Required coverage

Work every row for each function, handler, or route. Never skip a row as obvious.

| Path | Cover |
| - | - |
| **Happy** | Valid input, all required fields, dependencies succeed. Assert full response shape and every mock call argument. |
| **Negative / validation** | Each required field missing individually · wrong types · out-of-range · whitespace-only strings · empty and oversized collections · bad formats (UUID, URL, email, datetime). |
| **Dependency failure** | DB/API returns an error object · HTTP call fails · file absent. Assert the caller surfaces it — correct status, message, `isError`. |
| **Unexpected throw** | Dependency throws synchronously or rejects. Assert the outer handler catches and returns a safe structured response. |
| **Edge** | `null`/`undefined` optionals · empty arrays · boundaries (min, max, exactly at, one over) · whitespace normalization · timezone offsets · circular refs where serialized · state transitions (soft-delete on/off, flag on/off). |

Any input that takes a different code path gets a test.

**Schemas and validators** — per field: valid full input · each required field missing
(error names the field) · wrong type · preprocessing (trim, `''` → `undefined`, tz → UTC
ISO) · optional absent gives the default and present is accepted · boundaries · format
validation both directions · unknown-key rejection when the schema is strict.

## Parametric

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

## Mock boundaries

Mock at the process boundary, never inside the logic.

| Target | Rule |
| - | - |
| Network clients (HTTP, DB SDKs, queues) | Mock — no real I/O, controlled response shapes |
| `Date.now()`, `Math.random()`, clocks | Mock — determinism |
| External service SDKs | Mock — speed and isolation |
| Internal helpers in the same module | **Do not** — test through the real call chain |
| Logging side effects under assertion | Spy, never replace; restore after |

- **Unit** — mock the dependency, isolate the logic.
- **Integration** — real middleware, validation, routing, business logic. Mock only the
  true process boundary. Drive through the HTTP layer, not by calling handlers directly.
- **E2E** — no mocks. Real services, real data, real cleanup.

Match the repo's existing mock style (`vi.mock`, factory + `_mocks`, constructor
injection) — consistency beats preference.

Reset in `beforeEach`: Vitest `vi.clearAllMocks()` / `vi.resetAllMocks()` (reset also drops
return values and implementations) · Jest equivalents · pytest `monkeypatch` auto-resets,
and `unittest.mock` uses `patch` as a context manager or with `autospec`.

## Performance

For any path with a latency or throughput requirement — hot paths, data-heavy queries,
network-bound work.

- Assert against a **budget** (time, allocation, request count), never just "it ran".
- Use the framework's benchmark tooling: Vitest `bench`, pytest-benchmark, k6.
- Keep deterministic: isolated run, warm up before asserting, no shared load.

```typescript
bench('processes 1000 cards under 50ms', async () => {
  await processCards(generateCards(1000));
}, { time: 500 });
```

## Lighthouse CI

For user-facing pages. **Never wire LHCI into a GitHub Actions workflow** — local only.

- Assert against `lighthouserc.js` / `.json`.
- Cover Performance, Accessibility, Best Practices, SEO.
- Threshold from *current* scores — the goal is regression detection, not a day-one
  perfect score.
- Run against a local server or staging, never production.

```javascript
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

## Coverage

Branch coverage over line coverage. Required: branches in core business logic · every
error return · every validation rule triggered by at least one test.

Exclude from targets: entry/bootstrap files (`index.ts`, `main.py`) · pure type files ·
generated code · helpers and fixtures.

## Exit gate

Run the suite with the command from Step 0, then confirm:

- Zero failures, zero errors
- No stray `.only`, `xtest`, or `xit`
- No coverage threshold dropped
- Every source branch exercised — open the HTML coverage report when unsure
- Error paths assert the flag/status **and** the message content
