# LuxeShop

A full-stack e-commerce platform built with Next.js, TypeScript, Prisma, NextAuth.js, and Stripe. Includes a customer-facing storefront, full admin dashboard, and REST API layer via Next.js Route Handlers. Deployed to Cloudflare via OpenNext.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| ORM | Prisma 5 (Neon PostgreSQL) |
| Auth | NextAuth.js v5 (Auth.js beta) |
| Payments | Stripe |
| State | Zustand |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Deployment | Cloudflare Pages via OpenNext |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in the values in `.env`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string (with `pgbouncer=true`) |
| `DIRECT_URL` | Neon direct connection string (for migrations) |
| `NEXTAUTH_URL` | Your site URL |
| `NEXTAUTH_SECRET` | Random secret — `openssl rand -base64 32` |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Your public site URL |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key (client-side) |

### 3. Set up the database

```bash
npm run db:migrate   # Apply migrations
npm run db:seed      # Seed sample data
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev          # Start dev server on :3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed the database
npm run db:studio    # Open Prisma Studio on :5555
npm run deploy       # Build and deploy to Cloudflare
npm run preview      # Build and preview on Cloudflare locally
```

## Project Structure

```
src/
├── app/
│   ├── (store)/            # Public storefront
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── product/[slug]/
│   │   ├── category/[slug]/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── account/
│   │   ├── search/
│   │   ├── about/
│   │   └── collections/
│   ├── admin/               # Admin dashboard (protected)
│   │   ├── products/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── discounts/
│   │   ├── shipping/
│   │   ├── banners/
│   │   └── settings/
│   └── api/                 # Route Handlers
│       ├── auth/
│       ├── products/
│       ├── categories/
│       ├── orders/
│       ├── cart/
│       ├── checkout/
│       ├── coupons/
│       ├── webhooks/stripe/
│       ├── account/
│       └── admin/
├── components/
│   ├── store/
│   ├── admin/
│   └── ui/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── stripe.ts
│   ├── utils.ts
│   └── validations.ts
└── store/
    ├── cart.ts
    └── ui.ts
```

## Deployment

The project deploys to **Cloudflare Pages** using [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).

```bash
npm run deploy    # Build and deploy
npm run preview   # Local Cloudflare preview
```
