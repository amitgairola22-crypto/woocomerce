# Database Schema

All models are defined in `prisma/schema.prisma`. The database is SQLite in development.

## Entity Relationship Overview

```
User ──┬── Order ──── OrderItem ──┬── Product ──┬── ProductImage
       ├── Review                  │             ├── ProductVariant
       ├── Address                 └── ProductVariant  ├── ProductAttribute
       ├── WishlistItem                          ├── Category
       └── CartItem                              └── CollectionProduct ── Collection

Coupon (standalone)
ShippingZone ── ShippingRate
TaxRate (standalone)
Banner (standalone)
SiteSetting (standalone)
Newsletter (standalone)
```

## Models

### User
Stores customers and admin users.
- `role`: `"customer"` | `"admin"` | `"manager"`
- Password is bcrypt-hashed (nullable for OAuth users)

### Product
Core catalog entity.
- `status`: `"draft"` | `"active"` | `"archived"`
- `tags`: JSON array serialized as string
- `price` / `comparePrice` — selling price / original price (for strikethrough)
- `costPrice` — for margin calculation in admin
- Has `variants` for size/color options; if no variants, stock is tracked at product level

### ProductVariant
Specific SKU with its own price, stock, and image.
- `options`: JSON object e.g. `{"Color":"Red","Size":"L"}`

### Category
Hierarchical via `parentId` self-relation.
- `slug` used in URLs: `/category/mens-shoes`

### Order
One order per checkout. Guest orders have `userId = null`.
- `orderNumber`: human-readable (e.g. `ORD-20241123-001`)
- `status`: `pending` → `processing` → `shipped` → `delivered` | `cancelled` | `refunded`
- `paymentStatus`: `pending` → `paid` | `failed` | `refunded`

### Coupon
Discount codes.
- `type`: `"percentage"` | `"fixed"` | `"free_shipping"`
- `usageLimit`: null = unlimited

### CartItem
Persistent cart for logged-in users. Guest cart is Zustand (localStorage).
- Unique constraint on `[userId, productId, variantId]` prevents duplicates

### Banner
Homepage / promotional banners.
- `position`: `"hero"` | `"promo"` | `"category"`

### SiteSetting
Key-value store for configurable site settings (name, logo, currency, etc.).
- `group`: `"general"` | `"email"` | `"payment"` | `"shipping"`

## Indexes & Performance Notes

- `Product.slug` — unique index (URL lookups)
- `Product.status` — query filter for active products
- `Order.orderNumber` — unique index
- `Category.slug` — unique index
- `Coupon.code` — unique index

## Migrations

```bash
# Create a new migration
npx prisma migrate dev --name <description>

# Apply migrations in production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# View/edit data
npx prisma studio
```

## Seed Data

Run `npx prisma db seed` to populate:
- 1 admin user (`admin@store.com` / `admin123`)
- Sample categories (Men, Women, Electronics, etc.)
- 20 sample products with images and variants
- Sample banners and site settings
