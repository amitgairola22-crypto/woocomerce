# CLAUDE.md — Development Instructions

This file defines rules, conventions, and guidelines for all development on this project.

## Project Overview

A full-stack e-commerce platform built with Next.js 16, TypeScript, Prisma/Neon PostgreSQL, NextAuth.js, and Stripe. It includes a customer-facing storefront, a full admin dashboard, and a REST-style API layer via Next.js Route Handlers. Deployed to Cloudflare Pages via OpenNext.

## Critical Rules

1. **Never commit `.env`** — use `.env.example` for reference only.
2. **Always run `npx prisma generate` after schema changes** before writing new Prisma queries.
3. **Run `npx prisma migrate dev` after schema changes** to apply them to the dev database.
4. **Never store raw passwords** — use `bcryptjs` with salt rounds ≥ 12.
5. **All admin routes must check `role === "admin"` or `role === "manager"`** in the route handler before processing.
6. **Input validation**: use Zod schemas at every API boundary.
7. **No `any` types** — fix TypeScript errors properly.

## Stack & Versions

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

## Folder Structure

```
src/
├── app/
│   ├── (store)/            # Public storefront (layout groups)
│   │   ├── page.tsx         # Homepage
│   │   ├── products/        # Product catalog
│   │   ├── product/[slug]/  # Product detail
│   │   ├── category/[slug]/ # Category pages
│   │   ├── cart/            # Cart page
│   │   ├── checkout/        # Checkout flow
│   │   ├── account/         # Customer account
│   │   └── search/          # Search results
│   ├── admin/               # Admin dashboard (protected)
│   │   ├── layout.tsx       # Admin layout + auth guard
│   │   ├── page.tsx         # Dashboard overview
│   │   ├── products/        # Product CRUD
│   │   ├── categories/      # Category management
│   │   ├── orders/          # Order management
│   │   ├── customers/       # Customer management
│   │   ├── discounts/       # Coupons & discounts
│   │   ├── shipping/        # Shipping zones & rates
│   │   ├── banners/         # Homepage banners
│   │   └── settings/        # Site settings
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth routes
│       ├── products/        # Product endpoints
│       ├── categories/      # Category endpoints
│       ├── orders/          # Order endpoints
│       ├── cart/            # Cart endpoints
│       ├── checkout/        # Checkout + Stripe
│       ├── coupons/         # Coupon validation
│       ├── webhooks/stripe/ # Stripe webhooks
│       └── admin/           # Protected admin endpoints
├── components/
│   ├── store/               # Customer-facing components
│   ├── admin/               # Admin-only components
│   └── ui/                  # Shared primitives (Button, Input, Modal...)
├── lib/
│   ├── prisma.ts            # Prisma client singleton
│   ├── auth.ts              # NextAuth config
│   ├── stripe.ts            # Stripe client
│   ├── utils.ts             # General utilities
│   └── validations.ts       # Zod schemas
└── store/
    ├── cart.ts              # Zustand cart store
    └── ui.ts                # Zustand UI store (modals, drawers)
```

## Coding Standards

- Use named exports for components, default exports for pages.
- Keep components under 300 lines; split large ones into sub-components.
- Colocate component-specific types in the same file; shared types go in `src/types/`.
- API route handlers must return proper HTTP status codes.
- Server Components by default; add `"use client"` only when needed (event handlers, hooks).
- Prisma queries belong in `src/lib/db/` server-only files, never in client components.
- All monetary values stored and computed in float (USD); display with `toFixed(2)`.

## Database Conventions

- IDs: `cuid()` via Prisma.
- Soft delete: set `isActive = false` rather than hard-deleting categories/products.
- Run migrations: `npx prisma migrate dev --name <description>`.
- Seed data: `npx prisma db seed` (runs `prisma/seed.ts`).

## Security Guidelines

- Sanitize all user-generated HTML content before rendering.
- CSRF is handled by NextAuth and Next.js built-in protections.
- Rate-limit sensitive endpoints (login, checkout).
- File uploads: validate MIME type and size server-side; store in `/public/uploads/` for dev.
- Stripe webhooks: always verify the signature with `stripe.webhooks.constructEvent`.
- Never log sensitive fields: passwords, card data, full Stripe keys.

## Git Conventions

- Branch: `feature/`, `fix/`, `chore/`
- Commits: `feat:`, `fix:`, `chore:`, `docs:`
- Never commit node_modules, .env, or /public/uploads/

## Running the Project

```bash
npm run dev          # Start dev server on :3000
npx prisma studio    # Visual DB browser on :5555
npx prisma db seed   # Seed sample data
```
