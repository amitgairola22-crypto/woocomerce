# Changelog

All notable changes to this project will be documented in this file.

Format: `## [version] — YYYY-MM-DD` with sections `Added`, `Changed`, `Fixed`, `Removed`.

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
  - `CLAUDE.md` — development instructions and coding standards
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

### In Progress
- NextAuth.js configuration
- Prisma client + seed data
- Base layout components
- Homepage
