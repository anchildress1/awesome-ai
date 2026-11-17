---
status: check
name: gha-best-practices
description: >
  GitHub Actions workflow rules: triggers, draft guards, path filters, concurrency, permissions,
  secrets, action pinning, timeouts, caching, artifacts, checkout depth, installs, step naming,
  actionlint, Dependabot.

  Load BEFORE creating or editing any file under `.github/workflows/` or `.github/actions/`
  (ci.yml, codeql.yml, release-please.yml, reusable workflows, composite actions), including a
  one-line change.

  Trigger on: adding or changing a job, step, trigger, `permissions` block, matrix, or `env`;
  "add a workflow", "fix CI", "CI is failing", "add a job", "add a step", "pin this action",
  "add workflow_dispatch", "run it on PRs", "cache the install", "upload the artifact",
  "why did CI not run", "add dependabot"; scaffolding CI for a new repo; reviewing a diff that
  touches a workflow file, even when the user never says "Actions".
---

Apply every rule to each workflow file you create or modify. Fix existing violations in the same
edit, unasked.

## Triggers

Declare explicit `pull_request` types. Bare `pull_request:` (implicit `opened`, `synchronize`,
`reopened`) fires on drafts and never on `ready_for_review`, so a draft-skipped job never runs
when the PR is marked ready.

```yaml
on:
  pull_request:
    types: [opened, reopened, synchronize, ready_for_review]
```

Skip drafts on every `pull_request` job:

```yaml
jobs:
  build:
    if: github.event.pull_request.draft == false
```

Mixed-trigger workflow → add the escape clause, or the job never runs on `push`:

```yaml
    if: github.event.pull_request.draft == false || github.event_name != 'pull_request'
```

## Path filters

- Filter `push` and `pull_request` with `paths-ignore` for docs-only changes.
- `paths` and `paths-ignore` are mutually exclusive on one event.
- Never filter out a path the build reads: workflow files, lockfiles, build-time imports.
  `docs/**` and `**/*.md` are safe.
- Always pair path filters with `workflow_dispatch`; manual runs ignore filters.

```yaml
on:
  push: ...
  pull_request:
    types: [opened, reopened, synchronize, ready_for_review]
    paths-ignore:
      - "**/*.md"
      - "docs/**"
  workflow_dispatch:
```

**Never make a path-filtered workflow a required status check.** A filtered-out workflow never
reports, so the required check stays `Pending` and blocks merge. (A skipped *job* reports
Success; a skipped *workflow* reports nothing.) Pick one:

| Need | Do |
| - | - |
| Required check | No path filter on it |
| Path filter | Check stays optional |
| Both | One unfiltered workflow: a `changes` job detects paths, the required job gates on its output with `if:` and reports Success when skipped |

```yaml
jobs:
  changes:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: read
      pull-requests: read
    outputs:
      code: ${{ steps.filter.outputs.code }}
    steps:
      - name: Checkout
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - name: Detect changed paths
        id: filter
        uses: dorny/paths-filter@ceb8a2b8f2d89434be7ff52d3de7ec3738c5cc9d # v4.0.3
        with:
          predicate-quantifier: every
          filters: |
            code:
              - '**'
              - '!docs/**'
              - '!**/*.md'
  build:
    needs: changes
    if: needs.changes.outputs.code == 'true'
```

Never use a same-named second workflow with the inverse filter: a PR touching both paths runs
both, they share the concurrency group and cancel each other, and required checks match job
names, not workflow names.

## Concurrency

Every workflow:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## Permissions

- Job level, never workflow level. Only what the job uses.
- `pull-requests: write` only when the job posts comments or status checks.
- Never `write-all`. Never omit the block; omission inherits broad defaults.

```yaml
jobs:
  test:
    permissions:
      contents: read
```

## Secrets

Step-scoped only. Job- or workflow-level `env` exposes the secret to every step, third-party
actions included.

```yaml
# WRONG
jobs:
  deploy:
    env:
      API_KEY: ${{ secrets.API_KEY }}

# CORRECT
    steps:
      - name: Deploy
        env:
          API_KEY: ${{ secrets.API_KEY }}
        run: ./deploy.sh
```

- Use the default `GITHUB_TOKEN`. A PAT or GitHub App token only when the user asks for one.
- Never print a secret. Mask runtime-derived sensitive values: `echo "::add-mask::$TOKEN"`.
- Never guard with `if: env.SECRET != ''`. Let the step fail; skipping hides a config error
  behind a green run.

### `secrets: inherit`

Never by default. It passes the callee every repo/org secret, including ones added later.

```yaml
# WRONG
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
    secrets: inherit

# CORRECT
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
    secrets:
      GCP_SERVICE_ACCOUNT: ${{ secrets.GCP_SERVICE_ACCOUNT }}
      SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

- Callee declares each secret under `on.workflow_call.secrets` with `required:`, so a missing
  one fails at call time instead of arriving as an empty string.
- Never pass `GITHUB_TOKEN`; the callee gets its own, scoped by its `permissions`.
- Prefer OIDC where the provider supports it (Google Cloud, AWS, Azure).
- `inherit` allowed only when caller and callee share a repo **and** the needed set varies per
  caller. Justify it inline.

## Action pinning

Resolve every version at write time, never from memory or an example:

```bash
tag=$(gh api repos/<owner>/<repo>/releases/latest --jq .tag_name)
gh api repos/<owner>/<repo>/commits/$tag --jq .sha
```

Pin every action, `actions/*` included, to the full commit SHA plus a version comment. Never a
mutable tag (`@latest`, `@main`, `@v7`): a moved tag runs new code with the job's token and
secrets. Dependabot keeps the SHAs current.

```yaml
- uses: pnpm/action-setup@a7487c7e89a18df4991f7f222e4898a00d66ddda # v4.1.0
```

## Timeouts

`timeout-minutes` on every job; the default is 6 hours. CI tests 10–15 · deploys 10 · Sonar 10.

```yaml
jobs:
  test:
    timeout-minutes: 15
```

## Caching

Key off a lockfile hash, never a static string. uv, Playwright, and similar: built-in cache
option, or `actions/cache` with a lockfile-derived key.

```yaml
- uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0
  with:
    cache: 'pnpm'
    cache-dependency-path: web/pnpm-lock.yaml
```

## Artifacts

`if: always()` so reports survive failed tests. Explicit `retention-days` (default is 90).

```yaml
- uses: actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9 # v7.0.2
  if: always()
  with:
    name: test-report
    path: coverage/
    retention-days: 30
```

## Checkout depth

`fetch-depth: 0` only for jobs that read full history: Sonar, release-please, changelog
generation. Build and test jobs keep the shallow default.

## Dependency install

Disable lifecycle scripts; they run arbitrary package code on a runner holding secrets.

| Package manager | Command |
| - | - |
| npm | `npm ci --ignore-scripts` |
| pnpm | `pnpm install --frozen-lockfile --ignore-scripts` |
| yarn (Berry, v2+) | `yarn install --immutable --mode=skip-build` |
| yarn (Classic, v1) | `yarn install --frozen-lockfile --ignore-scripts` |
| bun | `bun install --frozen-lockfile --ignore-scripts` |

A package that needs its build script (native bindings) gets that one script as its own named
step. Never re-enable all scripts.

## Step naming

Every step gets a descriptive `name:`.

## Repo tooling

- Repo has workflows → add `actionlint` (brew) to the pre-commit hook and `make ai-checks`.
- `.github/dependabot.yml`: `github-actions` plus every package ecosystem in the repo, each with
  `open-pull-requests-limit: 2` unless the user sets another.
