# Technology Stack

## Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16 | Full-stack React framework (App Router, SSR, API Routes) |
| React | 19 | UI library |
| TypeScript | 5 | Static typing |
| Tailwind CSS | 4 | Utility-first styling |
| Framer Motion | latest | Animations and transitions |
| Zustand | latest | Client-side state (cart, UI) |
| Lucide React | latest | Icon library |
| React Hook Form | latest | Form handling |
| Zod | latest | Schema validation (forms + API) |

## Backend

| Technology | Version | Purpose |
|---|---|---|
| Next.js Route Handlers | 16 | REST API endpoints |
| Prisma | 5 | ORM for database access |
| Neon PostgreSQL | serverless | Cloud database (via `@neondatabase/serverless`) |
| NextAuth.js | v5 beta | Authentication & sessions |
| bcryptjs | latest | Password hashing |
| Stripe | latest | Payment processing |
| Sharp | latest | Server-side image optimization |

## Database

**Neon PostgreSQL (serverless)** — used in all environments
- Prisma adapter: `@prisma/adapter-neon` with `@neondatabase/serverless`
- Connection pooling via pgbouncer (`DATABASE_URL` with `pgbouncer=true`)
- Direct connection for migrations (`DIRECT_URL`)
- Schema: `prisma/schema.prisma` with `provider = "postgresql"` and `driverAdapters` preview feature
- **Cloudflare Workers**: `Pool` (WebSocket) is per-request via React `cache()` — prevents the "Cannot perform I/O on behalf of a different request" error caused by WebSocket context binding

## Authentication

NextAuth.js v5 (Auth.js) with:
- **Credentials provider** — email + password (bcrypt hashed)
- **Session strategy** — JWT (stateless)
- **Role system** — `customer`, `manager`, `admin` stored in User.role
- **Prisma adapter** — sessions persisted to database

## Payments

Stripe:
- **Payment Intents API** — secure card collection via Stripe Elements
- **Webhooks** — order confirmation on `payment_intent.succeeded`
- **Test mode** by default; switch to live keys in production

## Image Handling

- **Dev:** uploaded images stored in `/public/uploads/` (gitignored)
- **Prod:** recommended to use Cloudinary or AWS S3 (add `CLOUDINARY_URL` to .env)
- **Optimization:** Next.js `<Image>` component with automatic WebP conversion

## Deployment

| Environment | Recommendation |
|---|---|
| Development | `npm run dev` on localhost:3000 |
| Preview | `npm run preview` — local Cloudflare edge preview |
| Production | Cloudflare Pages via `@opennextjs/cloudflare` |

## Key Design Decisions

1. **Neon serverless PostgreSQL** — same DB in dev and prod; Prisma adapter handles connection pooling via pgbouncer automatically.
2. **Per-request Prisma client in production** — Cloudflare Workers binds WebSocket connections to request contexts; React `cache()` + a Proxy creates a fresh client per request without changing any route handler.
3. **App Router** — enables React Server Components for fast initial loads and simplified data fetching.
4. **Zustand for cart** — persisted to localStorage; synced with DB when user is logged in.
5. **Route Groups** — `(store)` and `admin` share separate layouts without polluting the URL.
6. **Stripe webhooks** — order status updated from webhook, not from client redirect, for reliability.
