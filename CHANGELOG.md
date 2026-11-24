# Changelog

All notable changes to this project will be documented in this file.

Format: `## [version] — YYYY-MM-DD` with sections `Added`, `Changed`, `Fixed`, `Removed`.

---

## [0.3.0] — 2026-11-24

### Fixed
- **Critical**: "Cannot perform I/O on behalf of a different request" HTTP 500 on Cloudflare Workers — caused by `Pool` (WebSocket) singleton being shared across concurrent requests. Fixed by using React `cache()` to create a fresh Prisma client per request, with a Proxy for backward-compatible `import { prisma }` usage across all route handlers.

---

## [0.2.0] — 2026-11-24

### Added
- `GET /api/health` — edge endpoint that pings the DB with `SELECT 1`; used by keep-alive cron
- `.github/workflows/keep-alive.yml` — GitHub Actions cron (every 4 min) that hits `/api/health` to prevent Neon auto-suspend cold starts

### Fixed
- Intermittent "server error" on first load after inactivity (Neon DB auto-suspend cold start)

### Removed
- `.claude/` skills directory, `CLAUDE.md`, and `AGENTS.md` from repository
- `.open-next/` build artifacts from git history (contained baked-in env vars)

---

## [0.1.0] — 2026-11-23

### Added
- Initial project scaffold (Next.js 16, TypeScript, Tailwind CSS)
- Prisma 5 schema with all models:
  - User, Account, Session, VerificationToken (NextAuth)
  - Category, Product, ProductImage, ProductAttribute, ProductVariant
  - Collection, CollectionProduct
  - Review
  - Order, OrderItem
  - Address
  - Coupon
  - ShippingZone, ShippingRate
  - TaxRate
  - WishlistItem, CartItem
  - Banner, SiteSetting, Newsletter
- Neon PostgreSQL database configuration (serverless, all environments)
- Environment variable configuration (`.env`, `.env.example`)
- Full documentation suite:
  - `PROJECT_REQUIREMENTS.md` — feature requirements and checklist
  - `TECH_STACK.md` — technology choices and rationale
  - `DATABASE_SCHEMA.md` — schema documentation
  - `ARCHITECTURE.md` — system architecture and request flows
  - `DESIGN_SYSTEM.md` — colors, typography, components
  - `ADMIN_PANEL.md` — admin dashboard specification
  - `ECOMMERCE_FEATURES.md` — e-commerce feature documentation
  - `SECURITY.md` — security guidelines and checklist
  - `DEPLOYMENT.md` — deployment instructions
  - `DEVELOPMENT_ROADMAP.md` — phased development plan
  - `API_DOCUMENTATION.md` — API endpoint reference
  - `CHANGELOG.md` — this file
- Core dependencies installed:
  - prisma, @prisma/client
  - next-auth (v5 beta), @auth/prisma-adapter
  - stripe, @stripe/stripe-js
  - zustand, framer-motion
  - lucide-react
  - react-hook-form, @hookform/resolvers, zod
  - bcryptjs, slugify, sharp

### Completed
- Full storefront, admin dashboard, API layer, Cloudflare deployment (see roadmap for details)
