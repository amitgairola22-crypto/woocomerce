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
- [x] **Homepage** — hero banner, featured products, categories, promotions, newsletter
- [x] **Product Catalog** — filtering, sorting, pagination, grid/list view
- [x] **Product Detail** — images gallery, variants, add-to-cart, reviews, related products
- [x] **Category Pages** — breadcrumbs, filtering sidebar, sort controls
- [x] **Search** — real-time search with filters
- [x] **Cart** — quantity editing, remove items, coupon code, order summary
- [x] **Checkout** — shipping address, shipping method, payment, order review
- [x] **Order Confirmation** — order number, summary, estimated delivery
- [x] **Customer Account** — profile, orders, addresses, wishlist
- [x] **Order Tracking** — order status timeline
- [x] **Collections** — curated product collections
- [x] **About** — brand/story page

## Admin Dashboard Requirements

### Product Management
- [x] Add / edit / delete products
- [x] Product variants (size, color, etc.)
- [x] Image gallery upload & reorder
- [x] Stock tracking & low-stock alerts
- [x] Bulk actions (activate, deactivate, delete)
- [ ] Import / export (CSV)

### Category & Collection Management
- [x] Hierarchical categories (parent → child)
- [x] Featured collections / shelves

### Order Management
- [x] Order list with status filtering
- [x] Order detail view with timeline
- [x] Update order status & tracking
- [x] Print order / invoice

### Customer Management
- [x] Customer list with search
- [x] Customer detail (orders, addresses)
- [x] Block / suspend accounts

### Discounts
- [x] Coupon codes (percentage, fixed, free shipping)
- [x] Usage limits and expiry dates

### Shipping
- [x] Shipping zones by country
- [x] Multiple rate types (flat, weight-based, free)

### Content
- [x] Homepage banners management
- [x] Site settings (name, logo, currency, etc.)

### Analytics
- [x] Revenue summary (today, week, month)
- [x] Top products
- [x] Recent orders
- [x] Customer growth

## Technical Requirements

- [x] Next.js 16 App Router + TypeScript
- [x] Prisma ORM + Neon PostgreSQL (serverless)
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
