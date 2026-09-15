## 1. Web app architecture (flowchart)

Use when showing how a typical web/service architecture fits together.

```mermaid
flowchart LR
    User([User])
    CDN[CDN / Edge]
    Web[Web App<br/>Next.js]
    API[API Server<br/>Node.js]
    DB[(PostgreSQL)]
    Cache[(Redis)]
    Queue[Background Worker]
    External[Third-party API]

    User --> CDN --> Web
    Web --> API
    API --> DB
    API --> Cache
    API --> Queue
    Queue --> External
    Queue --> DB
```

## 2. Microservices / event-driven (flowchart with subgraphs)

Use when components group naturally into bounded contexts.

```mermaid
flowchart TB
    User([User])

    subgraph Edge
        LB[Load Balancer]
        Gateway[API Gateway]
    end

    subgraph Services
        Auth[Auth Service]
        Orders[Orders Service]
        Inventory[Inventory Service]
    end

    subgraph Data
        OrdersDB[(Orders DB)]
        InventoryDB[(Inventory DB)]
        Bus[[Event Bus]]
    end

    User --> LB --> Gateway
    Gateway --> Auth
    Gateway --> Orders
    Gateway --> Inventory
    Orders --> OrdersDB
    Inventory --> InventoryDB
    Orders --> Bus
    Inventory --> Bus
    Bus --> Orders
    Bus --> Inventory
```

## 3. Request lifecycle (sequence diagram)

Use when the *order of operations* matters more than the components.

```mermaid
sequenceDiagram
    participant U as User
    participant W as Web App
    participant A as API
    participant D as Database
    participant Q as Queue

    U->>W: Click "Submit Order"
    W->>A: POST /orders
    A->>D: INSERT order (pending)
    A->>Q: enqueue ProcessOrder
    A-->>W: 202 Accepted
    W-->>U: "Order received"
    Q->>D: UPDATE order (confirmed)
    Q->>U: Email confirmation
```

## 4. State machine (stateDiagram)

Use when the project's core entity has a non-trivial lifecycle.

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Submitted: submit()
    Submitted --> Approved: approve()
    Submitted --> Rejected: reject()
    Approved --> Published: publish()
    Rejected --> Draft: revise()
    Published --> Archived: archive()
    Archived --> [*]
```

## 5. Data model (ER diagram)

Use for libraries or apps where the schema is the story.

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "appears in"

    USER {
        uuid id PK
        string email
        string name
        timestamp created_at
    }
    ORDER {
        uuid id PK
        uuid user_id FK
        string status
        timestamp created_at
    }
    LINE_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        decimal unit_price
    }
    PRODUCT {
        uuid id PK
        string sku
        string name
        decimal price
    }
```

## 6. CLI / library data flow (flowchart, simpler)

Use for CLI tools, libraries, or build pipelines.

```mermaid
flowchart LR
    Input[Input file] --> Parser
    Parser --> AST[(AST)]
    AST --> Transform
    Transform --> Renderer
    Renderer --> Output[Output file]

    Config[Config file] -.-> Parser
    Config -.-> Transform
    Config -.-> Renderer
```

## 7. CI/CD pipeline (flowchart top-to-bottom)

Use when documenting how code gets to production.

```mermaid
flowchart TB
    Push([Push to main]) --> Lint
    Lint --> Test[Unit tests]
    Test --> Build[Build artifact]
    Build --> Stage[Deploy to staging]
    Stage --> E2E[E2E tests]
    E2E --> Approve{Manual approval}
    Approve -->|approved| Prod[Deploy to production]
    Approve -->|rejected| Rollback[Stop]
```
