# Project Requirements

## Goal

Build a modern, premium, fully responsive e-commerce platform combining the best features of WooCommerce (flexibility) and Shopify (ease of use). The result must be fully functional — not a UI demo.

## Storefront Requirements

### Design & UX
- [x] Clean, premium, minimalist UI aesthetic
- [x] Mobile-first, fully responsive (320px → 1920px+)
- [x] Smooth animations and micro-interactions (Framer Motion)
- [x] Intuitive navigation with mega-menu support
- [x] Fast page loads (Next.js SSR + Image optimization)

### Pages
- [ ] **Homepage** — hero banner, featured products, categories, promotions, newsletter
- [ ] **Product Catalog** — filtering, sorting, pagination, grid/list view
- [ ] **Product Detail** — images gallery, variants, add-to-cart, reviews, related products
- [ ] **Category Pages** — breadcrumbs, filtering sidebar, sort controls
- [ ] **Search** — real-time search with filters
- [ ] **Cart** — quantity editing, remove items, coupon code, order summary
- [ ] **Checkout** — shipping address, shipping method, payment, order review
- [ ] **Order Confirmation** — order number, summary, estimated delivery
- [ ] **Customer Account** — profile, orders, addresses, wishlist
- [ ] **Order Tracking** — order status timeline

## Admin Dashboard Requirements

### Product Management
- [ ] Add / edit / delete products
- [ ] Product variants (size, color, etc.)
- [ ] Image gallery upload & reorder
- [ ] Stock tracking & low-stock alerts
- [ ] Bulk actions (activate, deactivate, delete)
- [ ] Import / export (CSV)

### Category & Collection Management
- [ ] Hierarchical categories (parent → child)
- [ ] Featured collections / shelves

### Order Management
- [ ] Order list with status filtering
- [ ] Order detail view with timeline
- [ ] Update order status & tracking
- [ ] Print order / invoice

### Customer Management
- [ ] Customer list with search
- [ ] Customer detail (orders, addresses)
- [ ] Block / suspend accounts

### Discounts
- [ ] Coupon codes (percentage, fixed, free shipping)
- [ ] Usage limits and expiry dates

### Shipping
- [ ] Shipping zones by country
- [ ] Multiple rate types (flat, weight-based, free)

### Content
- [ ] Homepage banners management
- [ ] Site settings (name, logo, currency, etc.)

### Analytics
- [ ] Revenue summary (today, week, month)
- [ ] Top products
- [ ] Recent orders
- [ ] Customer growth

## Technical Requirements

- [x] Next.js 15 App Router + TypeScript
- [x] Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- [x] NextAuth.js v5 — session-based auth, roles
- [x] Stripe — payment processing + webhooks
- [x] Zustand — client cart state (persisted)
- [x] Framer Motion — animations
- [x] Zod — runtime validation
- [ ] SEO: meta tags, Open Graph, sitemap, robots.txt
- [ ] Performance: image optimization, code splitting, lazy loading
- [ ] Accessibility: ARIA labels, keyboard navigation, contrast ratios

## Non-Functional Requirements

- Admin panel usable by non-technical staff
- All buttons, forms, filters, and features must work end-to-end
- Role-based access: `admin` (full), `manager` (products + orders), `customer` (self-service)
- Secure: input sanitization, auth guards on all admin routes, Stripe signature verification
