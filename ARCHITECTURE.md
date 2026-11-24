# Architecture

## High-Level Architecture

```
Browser
  │
  ├── Next.js App (Cloudflare Pages / OpenNext)
  │     ├── React Server Components (SSR, data fetching)
  │     ├── Client Components (interactivity, cart, forms)
  │     └── Route Handlers (API endpoints)
  │           ├── Prisma ORM ──► Neon PostgreSQL (serverless)
  │           ├── NextAuth.js ──► Session management
  │           └── Stripe SDK ──► Payment processing
  │
  └── Stripe (external)
        └── Webhooks ──► /api/webhooks/stripe
```

## Request Flow

### Store Page (SSR)
```
User requests /product/blue-sneakers
  → Next.js Server Component
  → Prisma query: Product.findUnique({ where: { slug } })
  → Renders HTML with product data (SEO-friendly)
  → Client hydrates for interactivity (variants, cart)
```

### Add to Cart
```
User clicks "Add to Cart"
  → Client Component reads Zustand cart store
  → If guest: writes to localStorage
  → If logged in: also calls POST /api/cart
  → Cart drawer opens with animation
```

### Checkout
```
User submits checkout form
  → POST /api/checkout/create-intent
    → Validates cart items, prices, stock
    → Applies coupon if any
    → Creates Stripe PaymentIntent
    → Returns clientSecret
  → Stripe Elements collects card info (never touches our server)
  → Stripe confirms payment
  → User redirected to /checkout/success?payment_intent=...
  → Webhook POST /api/webhooks/stripe
    → Verifies Stripe signature
    → Creates Order record in database
    → Sends confirmation email (TODO)
    → Clears cart
```

### Admin Operations
```
Admin requests /admin/products
  → Server Component checks session role
  → Redirects to /login if not admin/manager
  → Renders admin product list (SSR)
  → Client-side mutations via /api/admin/* endpoints
    → Each endpoint: getServerSession() + role check
    → Zod validation of request body
    → Prisma mutation
    → Returns updated data
```

## State Management

| State | Where | Why |
|---|---|---|
| Cart items | Zustand + localStorage | Persists across page navigations and browser restarts |
| Auth session | NextAuth JWT | Secure, server-validated |
| Server data | React Query / fetch | Cached, revalidated |
| UI state (modals) | Zustand | Simple, no boilerplate |

## Security Architecture

```
Public routes:    /               → No auth required
                  /products/*     → No auth required
                  /api/products/* → No auth required (GET)

Customer routes:  /account/*      → Session required (any role)
                  /api/cart/*     → Session required (any role)
                  /api/orders/*   → Session required (own orders only)

Admin routes:     /admin/*        → Session required + role in [admin, manager]
                  /api/admin/*    → Session required + role in [admin, manager]

Webhook routes:   /api/webhooks/* → Stripe signature verification
```

## Component Architecture

```
app/
├── (store)/layout.tsx          ← StoreHeader + StoreFooter
│   └── page.tsx                ← Server Component, fetches banners + featured
│
└── admin/layout.tsx            ← AdminSidebar + AdminHeader
    └── page.tsx                ← Server Component, fetches analytics

components/
├── ui/                         ← Primitive components (no business logic)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Badge.tsx
│   └── ...
├── store/                      ← Storefront-specific
│   ├── ProductCard.tsx
│   ├── CartDrawer.tsx
│   ├── ProductGallery.tsx
│   └── ...
└── admin/                      ← Admin-specific
    ├── ProductForm.tsx
    ├── OrderTable.tsx
    ├── StatsCard.tsx
    └── ...
```

## File Upload Flow

```
Admin uploads product image
  → POST /api/admin/upload (multipart/form-data)
  → Server validates: MIME type (image/*), size (< 5MB)
  → sharp resizes to max 1200px width, converts to WebP
  → Saves to /public/uploads/{uuid}.webp
  → Returns { url: "/uploads/{uuid}.webp" }
  → Admin stores URL in product.images
```

## Cloudflare Workers Considerations

### Per-Request Prisma Client

Cloudflare Workers binds WebSocket connections to the request context that created them. The `Pool` from `@neondatabase/serverless` uses a native WebSocket, which means a module-level singleton Pool **cannot** be reused across concurrent requests — doing so throws:

```
Cannot perform I/O on behalf of a different request. (I/O type: Native)
```

**Solution** (`src/lib/prisma.ts`): React's `cache()` function creates a fresh `PrismaClient` (and therefore a fresh `Pool` + WebSocket) for each incoming request. A `Proxy` wraps it so all existing `import { prisma }` usages work without changes.

```
Request A arrives
  → cache(createPrismaClient) → new Pool + PrismaClient for A
Request B arrives concurrently
  → cache(createPrismaClient) → new Pool + PrismaClient for B  ← no context clash
```

In development a global singleton is used instead to avoid exhausting local connections.

### Neon Keep-Alive

Neon free tier suspends the database after 5 minutes of inactivity. A GitHub Actions cron (`.github/workflows/keep-alive.yml`) pings `GET /api/health` every 4 minutes to keep the DB warm and prevent cold-start errors.

## SEO Strategy

- All product/category pages rendered server-side (not CSR)
- `generateMetadata()` per page returns dynamic title, description, Open Graph
- Structured data (JSON-LD) on product pages for rich search results
- `sitemap.xml` auto-generated from active products and categories
- Canonical URLs set on all pages
