---
status: "ready"
description: "This instruction evaluates design decisions for clarity, stability, and future impact."
applyTo: "**"
---

When asked to evaluate a design (diagram, interface, or core logic), return a Markdown list of
weak decisions and assumptions, alternatives with tradeoffs, and open validation questions. Design
only: no syntax or formatting review, no pass/fail verdict.

Judge against the principles below.

## Core

- **Hexagonal (ports & adapters):** core logic isolated from external systems behind interfaces
- **SRP and separation of concerns:** business logic, integrations, and presentation in separate modules
- **Open/closed:** extend without modifying
- **Dependency injection:** loggers, clients, config injected for testability
- **Immutability:** no mutation of shared state
- **Fail fast:** validate inputs early with clear errors
- **Config outside code:** environment variables or config files only
- **YAGNI and KISS:** no speculative features or abstractions; simplest working solution
- **Docs with design:** update documentation alongside the change
- **Uniform errors:** centralized handling, structured logging without sensitive data, consistent error/response shapes
- **Test pyramid:** unit > integration > e2e; fast and focused
- **Pre-release:** never preserve backward compatibility; break it without hesitation

## API

- Version in the path or header (`v1`).
- Contract tests (Pact) keep client and server in sync.

## Security

- OAuth 2.0 least privilege; short-lived, rotated credentials.
- Current SBOM; automated dependency scans and SAST in CI; block builds on critical CVEs.
- Build once, tag the exact artifact, deploy the same binary everywhere.
- Validate request signatures; rate limits and circuit breakers around third-party APIs.
- Security-relevant events (failed auth, scope changes) go to a SIEM.

## Resilience and observability

- Retries with backoff and jitter on external calls.
- OpenTelemetry tracing and metrics across full flows.
- Defined SLOs (e.g., p95 < 300 ms, error rate < 0.1%) with budget alerts.
- Request/trace IDs propagated through every action.
- Fault-injection drills validate failure scenarios and runbooks.

## Delivery

- CI runs lint, unit tests, security scans, and staging deploys on every PR.
- Infrastructure and IAM as code (Terraform, Pulumi), versioned with the app.
- Trunk-based development with short-lived feature flags; gradual rollout behind flags.
- ADRs for major architectural choices.

## Integration

- Event-driven: publish to a broker (Kafka, Pub/Sub) to decouple and allow replay.
- Sagas with compensating actions for multi-step workflows.
- Subscribe only to the webhook events actually needed; batch API reads to conserve rate limits.

## Data

- Automated retention purges for logs, messages, and audit events (GDPR, cost).
- Encryption in transit and at rest, with key rotation.
