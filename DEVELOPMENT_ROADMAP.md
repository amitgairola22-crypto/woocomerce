# Development Roadmap

## Phase 1 — Foundation ✓ In Progress

- [x] Project scaffold (Next.js 15 + TypeScript + Tailwind)
- [x] Prisma schema (all models)
- [x] Environment configuration
- [x] Documentation
- [ ] NextAuth.js setup (credentials + adapter)
- [ ] Prisma client singleton + seed data
- [ ] Base layout components (store + admin)
- [ ] Tailwind theme configuration

## Phase 2 — Core Store Pages

- [ ] Homepage (hero, featured products, categories, newsletter)
- [ ] Product catalog page (grid, filters, sorting, pagination)
- [ ] Product detail page (gallery, variants, reviews, related)
- [ ] Category pages
- [ ] Search results page
- [ ] Navigation (header + mobile menu + mega-menu)
- [ ] Footer

## Phase 3 — Cart & Checkout

- [ ] Zustand cart store (with localStorage persistence)
- [ ] Cart drawer (slide-out)
- [ ] Cart page
- [ ] Checkout form (address, shipping method selection)
- [ ] Stripe payment integration (Payment Element)
- [ ] Order confirmation page
- [ ] Coupon code application
- [ ] Tax + shipping calculation

## Phase 4 — Customer Account

- [ ] Registration page
- [ ] Login page
- [ ] Account dashboard
- [ ] Order history + order detail
- [ ] Address book
- [ ] Wishlist
- [ ] Profile settings

## Phase 5 — Admin Dashboard

- [ ] Admin layout (sidebar, header, breadcrumbs)
- [ ] Dashboard (analytics, recent orders, stats)
- [ ] Product management (list, create, edit, delete)
- [ ] Product variant builder
- [ ] Image upload with drag-and-drop
- [ ] Category management
- [ ] Order management (list, detail, status update)
- [ ] Customer management
- [ ] Coupon management
- [ ] Shipping zones & rates
- [ ] Banner management
- [ ] Site settings

## Phase 6 — API Layer

- [ ] Products API (CRUD + search + filters)
- [ ] Categories API
- [ ] Cart API
- [ ] Checkout API (create PaymentIntent, calculate totals)
- [ ] Orders API
- [ ] Stripe webhook handler
- [ ] Admin upload API
- [ ] Coupon validation API

## Phase 7 — Polish & Production

- [ ] SEO: meta tags, Open Graph, sitemap, robots.txt
- [ ] Performance: image lazy loading, code splitting
- [ ] Accessibility audit (ARIA, keyboard nav, contrast)
- [ ] Error boundaries and 404/500 pages
- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Email templates (order confirmation) — optional
- [ ] Rate limiting on auth/checkout endpoints
- [ ] Security headers
- [ ] Production deployment guide

## Phase 8 — Advanced Features (Future)

- [ ] Product reviews moderation
- [ ] Sales analytics charts
- [ ] CSV import/export for products
- [ ] Multi-language support
- [ ] Multi-currency support
- [ ] Abandoned cart recovery
- [ ] Product recommendations engine
- [ ] Gift cards
- [ ] Store credit
- [ ] Affiliate/referral system

## Current Status

**Phase 1** is in progress. Database schema is complete, documentation is complete.

Next steps:
1. Configure NextAuth.js
2. Create Prisma lib and seed script
3. Build the base layout and navigation
4. Build the homepage
