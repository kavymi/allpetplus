# Architecture Flow Diagrams

**Last Updated:** October 23, 2025  
**Tool:** Mermaid (renders in GitHub, GitLab, VS Code)  
**Purpose:** Visual representation of system flows and architecture

---

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [Design Creation Flow](#design-creation-flow)
3. [Order Processing Flow](#order-processing-flow)
4. [Micro-Frontend Integration](#micro-frontend-integration)
5. [Service Communication](#service-communication)
6. [Database Schema](#database-schema)
7. [Deployment Pipeline](#deployment-pipeline)

---

## Authentication Flow

### User Login with Clerk

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Next.js)
    participant C as Clerk
    participant B as Backend
    participant DB as Database

    U->>F: Click "Sign In"
    F->>C: Redirect to Clerk
    C->>U: Show login form
    U->>C: Enter credentials
    C->>C: Validate credentials
    C->>F: Redirect with JWT
    F->>F: Store session cookie
    F->>B: API request with cookie
    B->>C: Validate JWT
    C->>B: JWT valid, return userId
    B->>DB: Get/Create UserProfile
    DB->>B: UserProfile data
    B->>F: Return user data
    F->>U: Show dashboard
```

---

### tRPC Authenticated Request

```mermaid
sequenceDiagram
    participant C as Component
    participant T as tRPC Client
    participant M as Middleware
    participant R as tRPC Router
    participant S as Service
    participant DB as Database

    C->>T: trpc.designs.list.useQuery()
    T->>M: HTTP POST /api/trpc/designs.list
    Note over M: Extract userId from<br/>Clerk session
    M->>R: Call procedure with context
    R->>R: Check protectedProcedure
    alt Not Authenticated
        R->>T: UNAUTHORIZED error
        T->>C: Show login prompt
    else Authenticated
        R->>S: Call BuilderService
        S->>DB: SELECT * FROM saved_design
        DB->>S: Return designs
        S->>R: Return data
        R->>T: Type-safe response
        T->>C: Update component state
    end
```

---

## Design Creation Flow

### Complete User Journey

```mermaid
flowchart TD
    Start([User visits /builder]) --> LoadBuilder[Load Builder UI]
    LoadBuilder --> SelectOptions[Select Size, Color, Hardware]
    SelectOptions --> Preview3D[Live 3D Preview Updates]
    Preview3D --> Customize[Add Custom Text]
    Customize --> Decision{Satisfied?}
    
    Decision -->|No| SelectOptions
    Decision -->|Yes| SaveDesign[Click Save]
    
    SaveDesign --> CheckAuth{Authenticated?}
    CheckAuth -->|No| SignIn[Redirect to Sign In]
    SignIn --> ReturnBuilder[Return to Builder]
    ReturnBuilder --> SaveDesign
    
    CheckAuth -->|Yes| CreateMutation[tRPC designs.create]
    CreateMutation --> Backend[Backend Service]
    Backend --> ValidateInput[Validate with Zod]
    ValidateInput --> CreateDB[Insert to Database]
    CreateDB --> GeneratePreview[Queue Preview Generation]
    GeneratePreview --> Return[Return Design ID]
    Return --> Navigate[Redirect to /dashboard]
    Navigate --> End([Design Saved!])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style SaveDesign fill:#fff3cd
    style CreateDB fill:#cfe2ff
```

---

### Backend Design Creation

```mermaid
sequenceDiagram
    participant F as Frontend
    participant TR as tRPC Router
    participant V as Validation
    participant S as BuilderService
    participant DB as Prisma/PostgreSQL
    participant Q as BullMQ Queue
    participant W as Worker

    F->>TR: designs.create({ name, configJson })
    TR->>V: Validate with Zod schema
    
    alt Validation Fails
        V->>TR: ValidationError
        TR->>F: 400 BAD_REQUEST
    else Validation Success
        V->>TR: Valid input ✓
        TR->>S: createDesign(userId, data)
        S->>DB: BEGIN TRANSACTION
        S->>DB: Get/Create UserProfile
        DB->>S: UserProfile
        S->>DB: INSERT SavedDesign
        DB->>S: Design created
        S->>DB: COMMIT
        S->>Q: Add preview generation job
        Q->>W: Process in background
        S->>TR: Return design
        TR->>F: 201 Created
        F->>F: Show success toast
        F->>F: Navigate to dashboard
    end
```

---

## Order Processing Flow

### Shopify Order Creation

```mermaid
flowchart TD
    User[User Completes Design] --> Checkout[Redirect to Shopify Checkout]
    Checkout --> Payment[User Pays]
    Payment --> ShopifyOrder[Shopify Creates Order]
    
    ShopifyOrder --> Webhook[Shopify Sends Webhook]
    Webhook --> Backend[Backend /webhooks/shopify/orders]
    
    Backend --> Verify{Verify HMAC?}
    Verify -->|Invalid| Reject[Return 401]
    Verify -->|Valid| Log[Log to WebhookLog]
    
    Log --> ParseData[Parse Order Data]
    ParseData --> FindDesign[Find SavedDesign by metafield]
    
    FindDesign --> Found{Design Found?}
    Found -->|No| CreateBasic[Create Basic OrderMeta]
    Found -->|Yes| CreateLinked[Create OrderMeta + Link Design]
    
    CreateBasic --> PublishEvent[Publish order.created Event]
    CreateLinked --> PublishEvent
    
    PublishEvent --> EmailQueue[Add to Email Queue]
    PublishEvent --> AnalyticsQueue[Add to Analytics Queue]
    
    EmailQueue --> SendEmail[Send Confirmation Email]
    AnalyticsQueue --> TrackConversion[Track Conversion]
    
    SendEmail --> Done([Order Processed])
    TrackConversion --> Done
    
    style User fill:#e1f5e1
    style Done fill:#e1f5e1
    style Verify fill:#fff3cd
    style Webhook fill:#cfe2ff
```

---

### Order Status Update Flow

```mermaid
stateDiagram-v2
    [*] --> PENDING: Order Created
    PENDING --> PROCESSING: Payment Confirmed
    PROCESSING --> PRODUCTION: Manufacturer Receives
    PRODUCTION --> QUALITY_CHECK: Production Complete
    QUALITY_CHECK --> SHIPPING: QC Passed
    QUALITY_CHECK --> PRODUCTION: QC Failed
    SHIPPING --> IN_TRANSIT: Shipped
    IN_TRANSIT --> DELIVERED: Delivery Confirmed
    DELIVERED --> [*]
    
    PENDING --> CANCELLED: Payment Failed
    PROCESSING --> CANCELLED: Inventory Issue
    CANCELLED --> [*]
    
    note right of PRODUCTION: Shopify webhook:<br/>fulfillment/create
    note right of SHIPPING: Shopify webhook:<br/>fulfillment/update
    note right of DELIVERED: Tracking API:<br/>delivery confirmed
```

---

## Micro-Frontend Integration

### Dashboard Tab Loading

```mermaid
sequenceDiagram
    participant U as User
    participant D as Dashboard (Port 3000)
    participant I as Iframe
    participant M as Micro-Frontend (Port 3001)
    participant A as Backend API

    U->>D: Click "Licensing" tab
    D->>D: Navigate to /dashboard/licensing
    D->>I: Create iframe element
    I->>M: Load http://localhost:3001/dashboard
    M->>M: Initialize React app
    M->>M: Check authentication
    
    alt Not Authenticated
        M->>A: GET /api/session
        A->>M: 401 Unauthorized
        M->>U: Show "Please log in"
    else Authenticated
        M->>A: GET /api/session
        A->>M: User data
        M->>A: tRPC licensing.list()
        A->>M: Licensing data
        M->>I: postMessage('READY')
        I->>D: Iframe loaded event
        D->>D: Hide loading spinner
        M->>U: Show licensing dashboard
    end
```

---

### PostMessage Communication

```mermaid
sequenceDiagram
    participant P as Parent (Dashboard)
    participant I as Iframe
    participant C as Child (Micro-Frontend)

    Note over P,C: Initial Setup
    P->>I: Create iframe with src
    I->>C: Load application
    C->>C: Add message listener
    C->>P: postMessage({ type: 'READY' })
    
    Note over P,C: Data Passing
    P->>C: postMessage({ type: 'UPDATE_USER', data })
    C->>C: Validate origin
    C->>C: Update state with data
    C->>P: postMessage({ type: 'ACK' })
    
    Note over P,C: Navigation Request
    C->>P: postMessage({ type: 'NAVIGATE', url: '/checkout' })
    P->>P: Validate request
    P->>P: window.location.href = url
    
    Note over P,C: Error Handling
    C->>P: postMessage({ type: 'ERROR', error: {...} })
    P->>P: Show toast notification
    P->>P: Log to monitoring
```

---

## Service Communication

### tRPC Request Flow

```mermaid
graph TB
    subgraph Frontend["Frontend (Next.js)"]
        Comp[React Component]
        TClient[tRPC Client]
    end
    
    subgraph API["API Layer (libs/api)"]
        Router[tRPC Router]
        Middleware[Auth Middleware]
    end
    
    subgraph Backend["Backend (Fastify)"]
        Module[Domain Module]
        Service[Service Class]
    end
    
    subgraph Data["Data Layer"]
        Prisma[Prisma ORM]
        DB[(PostgreSQL)]
    end
    
    Comp -->|useQuery/useMutation| TClient
    TClient -->|HTTP POST| Router
    Router --> Middleware
    Middleware -->|Verify Auth| Router
    Router -->|Call Procedure| Module
    Module --> Service
    Service --> Prisma
    Prisma --> DB
    DB --> Prisma
    Prisma --> Service
    Service --> Module
    Module --> Router
    Router -->|Type-Safe Response| TClient
    TClient -->|Update State| Comp
    
    style Comp fill:#e1f5e1
    style Router fill:#cfe2ff
    style DB fill:#f8d7da
```

---

### Event-Driven Communication

```mermaid
flowchart LR
    subgraph Services
        S1[Builder Service]
        S2[Order Service]
        S3[Email Service]
        S4[Analytics Service]
    end
    
    subgraph Event Bus
        Redis[(Redis<br/>Pub/Sub)]
    end
    
    S1 -->|Publish: design.created| Redis
    Redis -->|Subscribe| S4
    
    S2 -->|Publish: order.created| Redis
    Redis -->|Subscribe| S3
    Redis -->|Subscribe| S4
    
    S2 -->|Publish: order.shipped| Redis
    Redis -->|Subscribe| S3
    
    style Redis fill:#fff3cd
    style S1 fill:#cfe2ff
    style S2 fill:#cfe2ff
    style S3 fill:#d1ecf1
    style S4 fill:#d1ecf1
```

---

## Database Schema

### Core Entity Relationships

```mermaid
erDiagram
    UserProfile ||--o{ SavedDesign : owns
    UserProfile ||--o{ PetProfile : owns
    UserProfile ||--o{ OrderMeta : places
    PetProfile ||--o{ SavedDesign : "designed for"
    SavedDesign ||--o| OrderMeta : "included in"
    
    UserProfile {
        string id PK
        string clerkId UK
        string email
        string role
        datetime createdAt
    }
    
    PetProfile {
        string id PK
        string userId FK
        string name
        string species
        string breed
        date birthdate
        number weight
        boolean isPrimary
        datetime createdAt
    }
    
    SavedDesign {
        string id PK
        string userId FK
        string petId FK
        string name
        json configJson
        string status
        string previewUrl
        datetime createdAt
    }
    
    OrderMeta {
        string id PK
        string userId FK
        string shopifyOrderId UK
        string designId FK
        string status
        number totalPrice
        datetime createdAt
    }
```

---

### Data Flow for Design

```mermaid
graph LR
    subgraph User Data
        User[UserProfile]
        Pet[PetProfile]
    end
    
    subgraph Design Data
        Design[SavedDesign]
        Config[configJson]
        Preview[previewUrl]
    end
    
    subgraph Order Data
        Order[OrderMeta]
        Shopify[Shopify Order]
    end
    
    User -->|owns| Pet
    User -->|creates| Design
    Pet -->|linked to| Design
    Design -->|contains| Config
    Design -->|has| Preview
    Design -->|becomes| Order
    Order -->|syncs with| Shopify
    
    style User fill:#e1f5e1
    style Pet fill:#e1f5e1
    style Design fill:#cfe2ff
    style Order fill:#fff3cd
```

---

## Deployment Pipeline

### CI/CD Flow

```mermaid
flowchart TD
    Start([Push to GitHub]) --> CI{Branch?}
    
    CI -->|main| Staging[Deploy to Staging]
    CI -->|production| Prod[Deploy to Production]
    CI -->|other| Tests[Run Tests Only]
    
    Staging --> RunTests[Run Test Suite]
    RunTests --> Lint[Lint Code]
    Lint --> TypeCheck[Type Check]
    TypeCheck --> BuildStaging[Build for Staging]
    
    BuildStaging --> DeployVercel[Deploy Frontend to Vercel]
    BuildStaging --> DeployFly[Deploy Backend to Fly.io]
    
    DeployVercel --> SmokeTests[Run Smoke Tests]
    DeployFly --> SmokeTests
    
    SmokeTests --> Success{Tests Pass?}
    Success -->|No| Rollback[Auto Rollback]
    Success -->|Yes| Done([Staging Deployed ✓])
    
    Prod --> Manual{Manual Approval?}
    Manual -->|No| Stop([Deployment Blocked])
    Manual -->|Yes| ProdBuild[Build for Production]
    ProdBuild --> ProdDeploy[Deploy to Production]
    ProdDeploy --> ProdTests[Run Health Checks]
    ProdTests --> ProdDone([Production Deployed ✓])
    
    style Start fill:#e1f5e1
    style Done fill:#e1f5e1
    style ProdDone fill:#d4edda
    style Rollback fill:#f8d7da
```

---

### Multi-Environment Architecture

```mermaid
graph TB
    subgraph Production
        ProdWeb[Web App<br/>Vercel Edge]
        ProdBackend[Backend<br/>Fly.io US-East]
        ProdDB[(PostgreSQL<br/>Managed)]
        ProdRedis[(Redis<br/>Managed)]
        
        ProdWeb --> ProdBackend
        ProdBackend --> ProdDB
        ProdBackend --> ProdRedis
    end
    
    subgraph Staging
        StageWeb[Web App<br/>Vercel Preview]
        StageBackend[Backend<br/>Fly.io Staging]
        StageDB[(PostgreSQL<br/>Staging)]
        StageRedis[(Redis<br/>Staging)]
        
        StageWeb --> StageBackend
        StageBackend --> StageDB
        StageBackend --> StageRedis
    end
    
    subgraph Development
        DevWeb[Web App<br/>localhost:3000]
        DevBackend[Backend<br/>localhost:4000]
        DevDB[(PostgreSQL<br/>Docker)]
        DevRedis[(Redis<br/>Docker)]
        
        DevWeb --> DevBackend
        DevBackend --> DevDB
        DevBackend --> DevRedis
    end
    
    style Production fill:#d4edda
    style Staging fill:#fff3cd
    style Development fill:#cfe2ff
```

---

## Monorepo Structure

### Dependency Graph

```mermaid
graph TD
    subgraph Frontend Apps
        Web[apps/web]
        Licensing[apps/pet-licensing]
    end
    
    subgraph Backend Services
        Backend[services/backend]
        Builder[services/builder-service]
    end
    
    subgraph Shared Libraries
        API[libs/api]
        Domain[libs/domain]
        Messaging[libs/messaging]
        Shared[libs/shared]
    end
    
    Web --> API
    Web --> Domain
    Web --> Shared
    
    Licensing --> Domain
    Licensing --> Shared
    
    API --> Domain
    API --> Shared
    
    Backend --> Domain
    Backend --> Messaging
    Backend --> Shared
    
    Builder --> Domain
    Builder --> Messaging
    Builder --> Shared
    
    Domain --> Shared
    
    style Web fill:#e1f5e1
    style Licensing fill:#e1f5e1
    style API fill:#cfe2ff
    style Domain fill:#fff3cd
```

---

### Import Path Hierarchy

```mermaid
flowchart TB
    subgraph Component["React Component"]
        Code["component.tsx"]
    end
    
    subgraph App Local["App-Local (@/)"]
        UI["@/components/ui/button"]
        Lib["@/lib/config"]
    end
    
    subgraph Shared Monorepo["Shared (@pet/*)"]
        TRPC["@pet/api"]
        DomainLib["@pet/domain/builder"]
        Utils["@pet/shared"]
    end
    
    subgraph Relative["Same Directory (./)"]
        Helper["./helper"]
    end
    
    Code --> UI
    Code --> Lib
    Code --> TRPC
    Code --> DomainLib
    Code --> Utils
    Code --> Helper
    
    style Code fill:#e1f5e1
    style Shared Monorepo fill:#cfe2ff
```

---

## Service Extraction Process

### Modular Monolith to Microservice

```mermaid
flowchart TD
    Start([Identify Hot Module]) --> Metrics{Metrics Check}
    
    Metrics -->|Traffic >1000 req/min| Extract
    Metrics -->|CPU >70%| Extract
    Metrics -->|P95 >500ms| Extract
    Metrics -->|No Issues| Stay[Keep in Monolith]
    
    Extract[Extract to Microservice] --> CreateService[Create Service Template]
    CreateService --> MoveCode[Move Code from Module]
    MoveCode --> UpdateRouter[Update tRPC Router]
    UpdateRouter --> UpdateDocker[Add to Docker Compose]
    UpdateDocker --> Deploy[Deploy Both Services]
    
    Deploy --> Traffic{Shift Traffic}
    Traffic -->|10%| Monitor1[Monitor for Issues]
    Monitor1 -->|OK| Traffic
    Traffic -->|50%| Monitor2[Monitor Performance]
    Monitor2 -->|OK| Traffic
    Traffic -->|100%| Complete[Extraction Complete]
    
    Monitor1 -->|Issues| Rollback[Rollback to Monolith]
    Monitor2 -->|Issues| Rollback
    
    Complete --> Cleanup[Remove from Monolith]
    Cleanup --> Done([Microservice Running])
    
    Rollback --> Fix[Fix Issues]
    Fix --> Extract
    
    style Start fill:#e1f5e1
    style Done fill:#d4edda
    style Rollback fill:#f8d7da
```

---

## Error Handling Flow

### Frontend Error Boundary

```mermaid
flowchart TD
    Render[Component Renders] --> Error{Error Thrown?}
    
    Error -->|No| Success[Display Content]
    Error -->|Yes| Boundary[Error Boundary Catches]
    
    Boundary --> Type{Error Type?}
    
    Type -->|Network Error| Retry[Show Retry Button]
    Type -->|Not Found| NotFound[Show 404 Page]
    Type -->|Permission| Forbidden[Show 403 Message]
    Type -->|Unknown| Generic[Show Generic Error]
    
    Retry --> UserRetry{User Clicks Retry?}
    UserRetry -->|Yes| Render
    UserRetry -->|No| LogError
    
    NotFound --> LogError[Log to Monitoring]
    Forbidden --> LogError
    Generic --> LogError
    
    LogError --> ShowFallback[Display Fallback UI]
    ShowFallback --> End([User Sees Error State])
    
    style Success fill:#d4edda
    style Boundary fill:#fff3cd
    style End fill:#f8d7da
```

---

### API Error Handling

```mermaid
sequenceDiagram
    participant C as Component
    participant T as tRPC
    participant B as Backend
    participant DB as Database

    C->>T: trpc.designs.create(data)
    T->>B: POST /api/trpc/designs.create
    B->>B: Validate input
    
    alt Validation Error
        B->>T: 400 BAD_REQUEST
        T->>C: Show validation errors
        C->>C: Highlight invalid fields
    else Database Error
        B->>DB: INSERT design
        DB->>B: Connection error
        B->>T: 500 INTERNAL_SERVER_ERROR
        T->>C: Show generic error
        C->>C: Show retry button
    else Auth Error
        B->>B: Check authentication
        B->>T: 401 UNAUTHORIZED
        T->>C: Redirect to login
    else Success
        B->>DB: INSERT design
        DB->>B: Design created
        B->>T: 201 Created
        T->>C: Success with data
        C->>C: Show success toast
        C->>C: Navigate to dashboard
    end
```

---

## Caching Strategy

### Multi-Layer Caching

```mermaid
flowchart TD
    Request[API Request] --> CDN{CDN Cache?}
    
    CDN -->|HIT| ReturnCDN[Return from CDN]
    CDN -->|MISS| Browser{Browser Cache?}
    
    Browser -->|HIT| ReturnBrowser[Return from Browser]
    Browser -->|MISS| ReactQuery{React Query Cache?}
    
    ReactQuery -->|HIT| ReturnRQ[Return from React Query]
    ReactQuery -->|MISS| Redis{Redis Cache?}
    
    Redis -->|HIT| ReturnRedis[Return from Redis]
    Redis -->|MISS| DB[Query Database]
    
    DB --> Store[Store in Redis]
    Store --> Return[Return to Client]
    Return --> UpdateCaches[Update Browser/RQ Caches]
    
    style ReturnCDN fill:#d4edda
    style ReturnBrowser fill:#d4edda
    style ReturnRQ fill:#d4edda
    style ReturnRedis fill:#d4edda
    style DB fill:#f8d7da
```

---

## Development Workflow

### Feature Development Flow

```mermaid
flowchart TD
    Start([New Feature Required]) --> Plan[Create Task/Issue]
    Plan --> Branch[Create Feature Branch]
    Branch --> Code[Write Code]
    
    Code --> Local[Test Locally]
    Local --> Pass{Tests Pass?}
    Pass -->|No| Fix[Fix Issues]
    Fix --> Local
    
    Pass -->|Yes| Commit[Commit Changes]
    Commit --> Push[Push to GitHub]
    Push --> PR[Create Pull Request]
    
    PR --> CI[CI/CD Runs]
    CI --> Checks{All Checks Pass?}
    
    Checks -->|No| Review[Fix CI Issues]
    Review --> Commit
    
    Checks -->|Yes| CodeReview[Code Review]
    CodeReview --> Approved{Approved?}
    
    Approved -->|No| Changes[Request Changes]
    Changes --> Code
    
    Approved -->|Yes| Merge[Merge to Main]
    Merge --> DeployStaging[Auto-Deploy to Staging]
    DeployStaging --> SmokeTest[Run Smoke Tests]
    
    SmokeTest --> SmokePass{Pass?}
    SmokePass -->|No| Hotfix[Create Hotfix]
    Hotfix --> Commit
    
    SmokePass -->|Yes| ProdReady[Ready for Production]
    ProdReady --> ManualDeploy[Manual Deploy to Prod]
    ManualDeploy --> Done([Feature Deployed ✓])
    
    style Start fill:#e1f5e1
    style Done fill:#d4edda
    style Fix fill:#f8d7da
```

---

## Viewing These Diagrams

### In GitHub/GitLab
Mermaid diagrams render automatically when viewing markdown files.

### In VS Code
Install the "Markdown Preview Mermaid Support" extension.

### In Documentation Site
Use a Mermaid-compatible static site generator (Docusaurus, VitePress, etc.).

### Export as Images
```bash
# Install mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Generate PNG
mmdc -i flow-diagrams.md -o diagrams/
```

---

## Related Documentation

- [Architecture Overview](/docs/architecture/architecture.md)
- [Architecture Visual Diagrams](/docs/analysis/architecture-visual-diagrams.md) - Text-based diagrams
- [Microservices Architecture](/docs/architecture/microservices-architecture.md)
- [Micro-Frontend Architecture](/docs/architecture/microfrontend-architecture.md)

---

**Last Updated:** October 23, 2025  
**Format:** Mermaid.js v10.x  
**Total Diagrams:** 14

