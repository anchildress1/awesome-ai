---
status: "draft"
description: "A language-agnostic, Copilot-ready checklist for secure, structured, and scalable logging inside applications — not infrastructure."
applyTo: "**"
---

Scope: application logging, not infrastructure.

## Agent behavior

- Check for a centralized logger before inserting one.
- Insert logs only; never rewrite logic.
- Scoped changes, never global.
- Summarize changes grouped by intent (e.g., "3 trace logs added").

## Rules

- Structured JSON with `timestamp`, `severity`, `message`, and context (`requestId`, `userId`,
  `service`, module, function).
- Levels driven by environment or DI config (`LOG_LEVEL`), never hardcoded.
- Mask or omit PII, tokens, and secrets; scrub payloads before logging them.

| Level | Use for |
| - | - |
| TRACE | Step-by-step debugging; never in prod |
| DEBUG | Method entry/exit, variable values |
| INFO | Major events, milestones, API requests |
| WARN | Unusual but non-fatal conditions |
| ERROR | Failures that degrade service |
| FATAL | Crashes, unrecoverable errors |

Never:

- `print()`, `console.log`, or raw output functions
- Duplicate or excessive logging of one event
- Stack traces at `INFO` or lower

## Examples

```java
// SLF4J + Logback
logger.info("Order processed", kv("orderId", orderId), kv("status", "confirmed"));
```

```js
// Winston
logger.info({
  message: "User login",
  userId: req.user.id,
  requestId: req.headers['x-request-id']
});
```

```python
# structlog
logger.info("email_sent", request_id=request_id, recipient=email, duration_ms=123)
```
