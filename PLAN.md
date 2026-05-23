# Nector — Execution Plan (Infoware Assignment)

Version: 1.0
Author: Candidate
Date: 2026-05-23

Purpose
-------
This document is the single-source plan for evolving the existing Next.js ecommerce project `Nector` to satisfy the Infoware engineering assignment. It focuses on demonstrating high-quality, scalable frontend engineering across four problem areas: RBAC, frontend architecture for ecommerce, a reusable data-fetching layer, and a configurable dashboard builder. The plan favors representative, well-architected implementations achievable within a 2-day window.

Contents (quick links)
- High-level architecture overview
- Folder structure plan
- Database schema planning (Prisma examples)
- Phase-wise implementation plan
- Detailed subtasks for every phase
- Feature checklist
- Technical decision explanations
- Performance optimization checklist
- Testing checklist
- Deployment checklist
- README checklist
- Edge case checklist
- Time management breakdown for 2-day deadline
- Risks and fallback plans
- Minimal implementation strategy for oversized scope
- API design checklist
- RBAC design checklist (with evaluation algorithm)
- Dashboard widget system checklist
- TanStack Query integration checklist
- SEO checklist for Next.js ecommerce architecture
- Final delivery checklist
- Interview explanation preparation checklist
- GitHub repository polishing checklist
- Commit & branch strategy
- README structure

Notes about goals
------------------
- Deliver a working demo showing the architecture and selected flows.
- Prioritize clear separation of concerns, reproducible examples, and concise documentation.
- Keep scope minimal but realistic: representative implementations, not production hardening.
- Use SQLite for local demos if PostgreSQL is unavailable; Prisma abstracts DB differences.

High-Level Architecture Overview
--------------------------------
Goal
- Show clear server/client separation, scalable state management, and modular UI boundaries.

Tasks
- API layer: Next.js API routes (server) + Prisma for DB access.
- Server utilities: `server/prisma.ts` (singleton Prisma client), `server/rbac.ts` (RBAC evaluator), `server/middleware/withAuth.ts`.
- Client: Next.js App Router + React components in `components/`.
- State: TanStack Query (server-state), Redux Toolkit (local UI state like cart/wishlist), localStorage for persisted client preferences.
- Dashboard: modular widget system loaded dynamically to reduce initial bundle size.

Priority: High
Estimated time: 1.5 hours
Risks
- Boundary confusion (server vs client logic). Ensure server handles authoritative enforcement.

Validation
- Run demo flow: product listing (query) → add-to-cart (optimistic) → checkout (mock) with logs showing query caching and RBAC checks on protected endpoints.

Folder Structure Plan
---------------------
Goal
- Provide a clear, scalable file layout for features, utilities, and server-only code.

Proposed structure (implement in repo root)
```
app/                      # Next.js App Router pages (existing)
components/               # UI components, split by domain
  ui/                     # primitives (Button, Input, Select)
  layout/                 # Navbar, BottomNav, DesktopNav
  shop/                   # ProductCard, CategoryCard
  dashboard/              # WidgetShell, WidgetRegistry
lib/                      # client utilities (fetcher, api client)
providers/                # React providers (Query, Redux)
server/                   # server-only utilities (prisma, rbac, middleware)
prisma/                   # schema.prisma + migrations
scripts/                  # seed and dev helper scripts
store/                    # Redux Toolkit slices
data/                     # static/seeding data (products, categories)
tests/                    # unit & integration tests
docs/                     # design docs and API reference
public/                   # static assets
```

Priority: High
Estimated time: 0.5 hour to align existing files
Risks
- Import paths must be validated after restructuring.

Validation
- Lint and TypeScript type-check pass after moving/creating wrappers.

Database Schema Planning (Prisma)
--------------------------------
Goal
- Minimal but expressive schema to support users, roles & permissions, products, cart, orders, and dashboard widgets.

Notes
- Use Prisma for type-safe DB access. For the assignment, `sqlite` is permissible for demos; production target is PostgreSQL.

Key models (concise examples)
```prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "sqlite" // switch to postgresql in production
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  isActive  Boolean  @default(true)
  roles     UserRole[]
  createdAt DateTime @default(now())
}

model Role {
  id          Int            @id @default(autoincrement())
  name        String         @unique
  parentId    Int?
  parent      Role?          @relation("RoleParent", fields: [parentId], references: [id])
  children    Role[]         @relation("RoleParent")
  permissions RolePermission[]
}

model Permission {
  id        Int    @id @default(autoincrement())
  resource  String // e.g., "product"
  action    String // e.g., "read", "update", "delete"
  field     String? // nullable for field-level permissions
}

model RolePermission {
  id           Int        @id @default(autoincrement())
  role         Role       @relation(fields: [roleId], references: [id])
  roleId       Int
  permission   Permission @relation(fields: [permissionId], references: [id])
  permissionId Int
  effect       String     @default("allow") // allow | deny
}

model UserRole {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int
  role   Role @relation(fields: [roleId], references: [id])
  roleId Int
}

model Product {
  id        Int      @id @default(autoincrement())
  title     String
  slug      String   @unique
  price     Float
  stock     Int
  jsonMeta  Json?
  createdAt DateTime @default(now())
}

model Cart {
  id       Int      @id @default(autoincrement())
  userId   Int?
  user     User?    @relation(fields: [userId], references: [id])
  items    Json     // store simple array [{productId, qty, priceSnapshot}]
  updatedAt DateTime @updatedAt
}

model Dashboard {
  id        Int      @id @default(autoincrement())
  name      String
  ownerId   Int?
  owner     User?    @relation(fields: [ownerId], references: [id])
  layout    Json     // grid layout, widget placements
  widgets   Json     // widget configs by id
  createdAt DateTime @default(now())
}
```

Priority: High
Estimated time: 1 hour to draft schema + seed plan
Risks
- Evolving schema while coding requires migration discipline; use small iterative migrations.

Validation
- `prisma migrate dev --name init` succeeds locally and `scripts/seed.ts` creates demo data.

Phase-wise Implementation Plan
------------------------------
Overview
- Split work into phases with explicit demos and acceptance criteria, sized for two days.

Phase 0 — Prep & skeleton
- Goal: Branch + add core files and Prisma schema.
- Tasks: create branch `feature/infoware-assignment`, add `prisma/schema.prisma`, add `server/prisma.ts`, `server/rbac.ts` skeleton, `lib/apiClient.ts`, `providers/QueryProvider.tsx`, `scripts/seed.ts`.
- Priority: Critical
- Est. time: 1.5h
- Risks: merge conflicts with existing repo
- Validation: branch available; project typechecks

Phase 1 — RBAC core and route protection demo
- Goal: Dynamic RBAC with inheritance and field/action-level checks, enforced on server and mirrored in UI.
- Tasks:
  - Implement `server/rbac.ts` with `hasPermission(user, resource, action, field?)`.
  - Create `server/middleware/withAuth.ts` to parse JWT session and provide user context.
  - Seed roles & permissions (Admin, Merchant, Customer, Viewer) via `scripts/seed.ts`.
  - API route guard for product edits `pages/api/admin/products/*`.
  - UI demo page `/app/admin/products` showing field-level differences.
- Priority: High
- Est. time: 3.5h
- Risks: Field-level complexity; choose simple UX enforcement for demo
- Validation: Unit tests and UI demo verifying permission outcomes

Phase 2 — Reusable data fetching layer (TanStack Query)
- Goal: Provide caching, retries, deduplication, cancellation, optimistic updates, polling, infinite queries.
- Tasks:
  - Create `lib/apiClient.ts` wrapping fetch with AbortController and retry strategy.
  - Configure `QueryClient` with sensible defaults and offline retries.
  - Implement example hooks: `useProducts`, `useProduct`, `useCart` using `useQuery`, `useMutation`, and `useInfiniteQuery`.
  - Implement optimistic update on add-to-cart with rollback.
- Priority: High
- Est. time: 3h
- Risks: Race conditions on optimistic updates
- Validation: Demonstrate caching/dedupe via console logs and network traces

Phase 3 — Ecommerce flows (Product listing, Cart, Checkout minimal)
- Goal: Implement a polished product listing with filters and cart flow; checkout is mocked with server validation.
- Tasks:
  - Product listing page with server-backed filters and `useInfiniteQuery`.
  - Cart slice in Redux Toolkit for local UI state, synced to server via TanStack mutations.
  - Wishlist stored in `localStorage` with optional server sync hook.
  - Checkout: `POST /api/checkout` validates cart and creates `Order` record.
  - Coupon API `POST /api/coupons/validate`.
- Priority: High
- Est. time: 3h
- Risks: Real payments out of scope; keep checkout as simulated order creation
- Validation: End-to-end: list → add → apply coupon → checkout (DB order created)

Phase 4 — Configurable Dashboard Builder
- Goal: Demonstrate widget marketplace, drag/drop, resize, save & share.
- Tasks:
  - Implement `components/dashboard/WidgetShell.tsx` and a `WidgetRegistry` map
  - Use `react-grid-layout` or a minimal CSS-grid-based drag/resize implementation
  - Two sample widgets: `RecentOrdersWidget` (server query), `SalesSummaryWidget` (client/simulated)
  - Persist dashboards as `Dashboard` model with JSON layout and widget configs
  - Implement shareable view-only URL `GET /dashboards/:id`
- Priority: Medium
- Est. time: 2h
- Risks: Integrating a heavy drag-drop lib — fallback to simpler grid
- Validation: Save layout and reload; share URL loads read-only view

Phase 5 — Tests, SEO, performance & docs
- Goal: Add representative tests, SEO critical tags, and polish docs.
- Tasks:
  - Unit tests for RBAC (allow/deny/inheritance), apiClient cancellation
  - Unit tests for apiClient cancellation and retry
  - Integration test for product listing → add-to-cart using MSW
  - Add SEO metadata (title/description/Open Graph) for home and product pages
  - Add README & run instructions
- Priority: High
- Est. time: 2–3h
- Risks: Tests flaky; limit to deterministic cases
- Validation: `npm test` passes and SEO tags present on pages

Detailed Subtasks (executable checklists)
-------------------------------------
Below are compact, step-by-step tasks you can follow implementation-first. Each item is actionable and sized to be completed in short increments.

Phase 0 tasks (Prep)
- [ ] Create branch: `git checkout -b feature/infoware-assignment`
- [ ] Add `prisma/schema.prisma` (draft above)
- [ ] Add `scripts/seed.ts` to create demo users, roles, products
- [ ] Add `server/prisma.ts` (singleton Prisma client wrapper)
- [ ] Add `server/rbac.ts` skeleton (export `hasPermission` stub)
- [ ] Add `lib/apiClient.ts` (fetch wrapper with AbortController)
- [ ] Add `providers/QueryProvider.tsx` and wire to `app/layout.tsx`

Phase 1 tasks (RBAC)
- [ ] Implement `hasPermission(user, resource, action, field?)` with caching
- [ ] Implement `evaluateRolePermissions(roleId)` to flatten effective permissions
- [ ] Add middleware `withAuth` to resolve current user from cookies/JWT
- [ ] Protect API routes with `withAuth` + `hasPermission` checks
- [ ] Create admin demo page showing field visibility toggled by permission

Phase 2 tasks (Data layer)
- [ ] Implement `apiClient.fetcher(url, {signal, retries})`
- [ ] Add `QueryClient` defaults: `staleTime`, `cacheTime`, `retry`, `retryDelay`
- [ ] Add `useProducts(filters)` using `useInfiniteQuery`
- [ ] Add `useMutation` for cart with optimistic update and rollback
- [ ] Add logging to observe deduped queries

Phase 3 tasks (Ecommerce)
- [ ] Build `ProductList` UI using `useProducts`
- [ ] Add filter UI that maps to query key and network params
- [ ] Implement `cartSlice` in `store/cartSlice.ts` with persistence to localStorage
- [ ] Implement server cart endpoints for sync
- [ ] Implement `checkout` API route that validates stock & creates order

Phase 4 tasks (Dashboard)
- [ ] Create `WidgetRegistry` and `WidgetManifest` types
- [ ] Implement `DashboardEditor` with add/remove/resize
- [ ] Save & load dashboard JSON from DB via API endpoints

Phase 5 tasks (Testing & polish)
- [ ] Add unit tests and integration tests (Jest + React Testing Library)
- [ ] Add SEO metadata to `app/page.tsx` and product pages
- [ ] Compose README with demo instructions and architecture explanation

Feature Checklist (detailed)
----------------------------
Each feature below includes its goal, tasks, priority, estimate, risks and validation.

- RBAC System
  Goal: Dynamic permissions, route protection, field-level and action-level checks, inheritance
  Tasks: DB models, `hasPermission`, middleware, UI demo
  Priority: High
  Est.: 3–4h
  Risks: Complex UI enforcement; mitigate by focusing on server enforcement
  Validation: Unit tests and UI role switching demo

- Product Listing & Filters
  Goal: Fast listings, infinite paging, server-filtered
  Tasks: `useInfiniteQuery`, server cursor pagination, filter UI
  Priority: High
  Est.: 2h
  Validation: Network verification and UI behavior

- Cart & Checkout (mock)
  Goal: Add-to-cart, optimistic updates, coupon application, order creation
  Tasks: `cartSlice`, `useMutation` with optimistic updates, `POST /api/checkout`
  Priority: High
  Est.: 3h
  Validation: End-to-end flow with DB order creation

- Dashboard Builder
  Goal: Add widgets, drag/resize, save & share
  Tasks: WidgetRegistry, editor, persistence
  Priority: Medium
  Est.: 2h
  Validation: Layout persists and shareable link works

- Reusable Data Layer (TanStack Query)
  Goal: Centralized fetcher + query strategies
  Tasks: `apiClient`, `QueryClient` setup, optimistic updates
  Priority: High
  Est.: 3h
  Validation: Dedupe, cancellation, and retry behavior verified

Technical Decision Explanations
-------------------------------
Goal
- Record the reasoning for technology choices and trade-offs — useful for interview explanation.

Decisions
- Next.js App Router: consistent with existing project; provides file-based routing and SSR/SSG options.
- Prisma: type-safe DB client simplifying schema iteration and migrations.
- TanStack Query: first-class server-state library with caching, dedupe, retries, and mutation primitives enabling optimistic updates.
- Redux Toolkit: local UI state and predictable reducer patterns for cart/wishlist that need synchronous updates.
- RBAC server-first: never trust client; client mirrors for UX only.

Priority: High
Est. time: 0.5h to write explanations
Risks: Over-justifying; be concise in final README

Performance Optimization Checklist
-------------------------------
Goal
- Practical performance improvements ensuring demo feels fast.

Checklist
- SSG / ISR for product pages (for known top SKUs)
- `staleTime` tuning and `cacheTime` for queries
- Image optimization with Next/Image
- Code-splitting and dynamic `import()` for dashboard widgets
- Memoization for components (`React.memo` / `useMemo`) where render cost is high
- DB indices on `Product.slug` and `Category` fields

Priority: High
Est. time: integrated across phases
Risks: Premature optimization; prioritize obvious wins

Testing Checklist
-----------------
Goal
- Provide representative tests showing correctness of critical logic.

Checklist
- Unit tests using Jest for `hasPermission` covering allow/deny/Inheritance
- Unit tests for `apiClient` cancellation and retry
- Integration test for product list and add-to-cart using MSW (mocked network)
- Basic snapshot tests for `ProductCard`

Priority: High
Est. time: 1–2h

Deployment Checklist
--------------------
Goal
- Provide instructions and minimal configs to deploy a runnable demo.

Checklist
- `.env.example` with required keys
- `prisma` migrations and `scripts/seed.ts`
- `vercel.json` or `Dockerfile` + `docker-compose.yml` for local Postgres and app
- `npm run build` verification

Priority: Medium
Est. time: 0.5–1h

README Checklist
----------------
Goal
- Ensure reviewers can run the project and understand design decisions.

Checklist
- Quickstart steps (clone, env, seed, run)
- Architecture summary
- How to demo RBAC & dashboard workflows
- Testing & Linting
- Deployment notes
- Known limitations and next steps

Priority: High
Est. time: 30–60m

Edge Case Checklist
-------------------
Goal
- Ensure the demo tolerates common edge cases and documents remaining limitations.

Checklist
- Permission conflicts: explicit deny precedence
- Network timeouts: retries and user-facing error toasts
- Concurrency: server-side validation during checkout (stock checks)
- Missing widget type: placeholder UI and logged warning
- Corrupt dashboard JSON: fail gracefully and offer reset

Priority: High
Est. time: 30m

Time Management Breakdown (2-day plan)
------------------------------------
Day 1 (8 hours)
- 0.5h Branch + skeleton
- 2.0h RBAC core + prisma schema + seed
- 2.5h TanStack Query + apiClient
- 2.0h Product listing + filters UI
- 1.0h Quick README checkpoint & screenshots

Day 2 (8 hours)
- 2.5h Cart + optimistic updates + coupon
- 2.0h Dashboard widget builder minimal
- 1.0h Tests + SEO/meta tags
- 1.0h Perf polish + images
- 1.0h README finalization, commit cleanups, interview prep
- 0.5h Buffer

Risks and Fallback Plans
------------------------
Risk: DB setup or network issues
- Fallback: Switch Prisma datasource to SQLite for local demo and document steps.

Risk: Third-party libs integration cost
- Fallback: Use minimal custom implementations (CSS grid instead of heavy drag libs).

Risk: RBAC complexity
- Fallback: Implement server enforcement only, with simple UI toggles for demonstration.

Minimal Implementation Strategy
-----------------------------
Goal
- If time-constrained, deliver a minimal, polished set of features proving architecture.

Minimum deliverable subset
- RBAC: server `hasPermission` + one protected admin page
- Data layer: TanStack Query with `useProducts` + `useCart` optimistic updates
- UI: Product listing, add-to-cart, and cart drawer
- Dashboard: simple JSON-based add/remove widgets (no drag/resize)

Priority: Critical
Est. time: 8–10h

API Design Checklist
--------------------
Goal
- Use predictable, REST-style endpoints aligned with TanStack Query.

Checklist
- `GET /api/products?cursor=&limit=&filters=` — returns `{ items, nextCursor }`
- `GET /api/products/:id`
- `POST /api/cart` — add item
- `PATCH /api/cart/:id` — update qty
- `DELETE /api/cart/:id`
- `POST /api/checkout` — validate cart & create order
- `GET /api/dashboards/:id`, `POST /api/dashboards`
- `POST /api/auth/login`, `POST /api/auth/refresh`
- Errors: consistent `{ error: string, code?: string }`

Priority: High
Est. time: 1h

RBAC Design Checklist (Detailed)
--------------------------------
Goal
- Implement dynamic, inherited, field & action-level permission checks with clear precedence.

Data model recap
- `Role` with optional `parentId` for inheritance
- `Permission` with `resource`, `action`, `field?`
- `RolePermission` with `effect` = `allow|deny`

Evaluation algorithm (pseudocode)
```ts
async function hasPermission(userId, resource, action, field=null) {
  // 1. load user's roles
  const roles = await getRolesForUser(userId)

  // 2. flatten permissions for roles, including inherited parents
  const perms = await flattenPermissionsForRoles(roles)

  // 3. precedence: explicit deny (on exact field) -> explicit deny (resource/action) -> explicit allow (field) -> allow (resource/action) -> inherited allows
  // implement as ordered checks

  if (matchesAny(perms, {effect: 'deny', resource, action, field})) return false
  if (matchesAny(perms, {effect: 'deny', resource, action, field: null})) return false
  if (matchesAny(perms, {effect: 'allow', resource, action, field})) return true
  if (matchesAny(perms, {effect: 'allow', resource, action, field: null})) return true
  return false
}
```

Server enforcement
- All write endpoints must call `withAuth` + `hasPermission` before performing DB changes.

Client UX
- Mirror permission checks in UI by fetching a reduced permission set for the current user and hiding/disabling UI elements (but not relying on it for security).

Priority: High
Est. time: 3h

Dashboard Widget System Checklist
---------------------------------
Goal
- Provide a manifest-driven, extensible widget framework with runtime configs and persistence.

Checklist
- `WidgetManifest` type: `{ type, displayName, description, defaultConfig, configSchema }`
- `WidgetRegistry` maps `type` -> React component factory
- `WidgetShell` provides header, settings, remove, and edit handlers
- Editor supports add/remove and save layout (JSON)
- Viewer loads JSON and mounts widgets read-only

Priority: Medium
Est. time: 2h

TanStack Query Integration Checklist (Detailed)
----------------------------------------------
Goal
- Implement practical defaults and patterns for queries & mutations.

Checklist
- `QueryClient` defaults: `defaultOptions.queries = { staleTime: 10000, cacheTime: 5*60*1000, retry: 2, retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000) }`
- `apiClient` uses AbortController; pass signal into fetch
- Use `useInfiniteQuery` for product listing with `getNextPageParam`
- Use `useMutation` for add-to-cart with optimistic update:
  - onMutate: cancel queries, snapshot old cart, update cache
  - onError: rollback to snapshot
  - onSettled: invalidate cart queries
- Deduplication: TanStack Query handles duplicates by key; ensure consistent key usage

Priority: High
Est. time: 2–3h

SEO Checklist for Next.js Ecommerce
----------------------------------
Goal
- Ensure critical pages are indexable and have meaningful meta tags.

Checklist
- Product pages: `metadata` or `<Head>` with title, description, canonical URL, Open Graph (image, title, description)
- Use SSG (getStaticPaths/getStaticProps) for top products + ISR for updates
- Structured Data: JSON-LD Product schema embedded in product page
- Sitemap: generate simple `/sitemap.xml` for known product routes
- Robots: include default robots rules in `public/robots.txt`

Priority: High
Est. time: 1h

Final Delivery Checklist
------------------------
- Code on branch `feature/infoware-assignment`
- `PLAN.md` added (this file)
- `prisma/schema.prisma` + `scripts/seed.ts`
- `server/prisma.ts`, `server/rbac.ts`, `lib/apiClient.ts`, `providers/QueryProvider.tsx`
- Demo pages: product listing, admin product page, dashboard editor
- Minimal unit tests and integration test
- `README.md` with quickstart & demo instructions

Interview Explanation Preparation
--------------------------------
Prepare short answers for:
- Why TanStack Query and how it improves UX & performance
- RBAC trade-offs and why server-first enforcement is chosen
- Widget JSON model and how it supports shareable dashboards
- How optimistic updates work and rollback strategies

GitHub Polishing Checklist
-------------------------
- Clean commit history; use Conventional Commits
- `.env.example` present
- Add `CONTRIBUTING.md` and `LICENSE` if needed

Commit & Branch Strategy
------------------------
- Branch: `feature/infoware-assignment`
- Topic branches allowed off feature branch for large subtasks
- Commits: small, focused, Conventional Commit message
- Final: squash WIP commits into meaningful feature commits before PR

README Structure (recommended)
-----------------------------
1. Project title & quick elevator pitch
2. Demo screenshots / GIF
3. Quickstart (clone, env, seed, run)
4. Architecture overview (short) with diagram link
5. Features implemented & how to demo them (RBAC, Dashboard)
6. Testing & Linting
7. Deployment notes
8. Known limitations & next steps

Acceptance Criteria for the assignment
--------------------------------------
- RBAC: server-enforced checks; UI demonstrates field-level differences for at least one resource
- Data layer: TanStack Query hooks with caching, optimistic update and an infinite query demo
- Product listing & cart: add-to-cart and checkout (mock) flow working end-to-end
- Dashboard: create/save/load dashboard JSON and mount two sample widgets
- README: clear run steps and architecture rationale

How to run locally (quick)
-------------------------
1. Install dependencies
```bash
npm install
```
2. Create `.env` from `.env.example` and set `DATABASE_URL` (sqlite recommended for quick start)
3. Run migrations & seed
```bash
npx prisma migrate dev --name init
node scripts/seed.js
```
4. Start dev server
```bash
npm run dev
```

If PostgreSQL is not available, set `DATABASE_URL="file:./dev.db"` in `.env` and follow the same commands. The Prisma client will create a local SQLite DB.

Next steps (short term)
-----------------------
- Confirm if you want me to scaffold the files (Prisma, server wrappers, QueryProvider) and open a feature branch — I can apply these changes now.

---
End of Plan
