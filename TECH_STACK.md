# Technology Stack

## Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15 | Full-stack React framework (App Router, SSR, API Routes) |
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
| Next.js Route Handlers | 15 | REST API endpoints |
| Prisma | 5 | ORM for database access |
| SQLite | 3 | Development database |
| NextAuth.js | v5 beta | Authentication & sessions |
| bcryptjs | latest | Password hashing |
| Stripe | latest | Payment processing |
| Sharp | latest | Server-side image optimization |

## Database

**Development:** SQLite (`prisma/dev.db`)
- Zero-config, file-based, perfect for local development
- Full SQL support via Prisma

**Production:** PostgreSQL (recommended)
- Change `DATABASE_URL` and `provider = "postgresql"` in `prisma/schema.prisma`
- Run `npx prisma migrate deploy`

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
| Staging | Vercel preview deployments |
| Production | Vercel + PlanetScale/Supabase PostgreSQL |

## Key Design Decisions

1. **SQLite for dev** — zero friction for contributors; Prisma makes migration to PostgreSQL a one-line change.
2. **App Router** — enables React Server Components for fast initial loads and simplified data fetching.
3. **Zustand for cart** — persisted to localStorage; synced with DB when user is logged in.
4. **Route Groups** — `(store)` and `admin` share separate layouts without polluting the URL.
5. **Stripe webhooks** — order status updated from webhook, not from client redirect, for reliability.
