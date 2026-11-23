# E-Commerce Features

## Product Catalog

### Product Types
- **Simple product** — single SKU, one price, one stock count
- **Variable product** — multiple variants (combinations of attributes like Color × Size), each with own price, stock, and optional image

### Variants
Attributes are defined per product (e.g. Color: Red, Blue; Size: S, M, L, XL).
Prisma generates a `ProductVariant` per unique combination.
Each variant has: `sku`, `price`, `comparePrice`, `stock`, `image`, `options` (JSON).

### Pricing
- `price` — the selling price
- `comparePrice` — struck-through original price (shows sale badge when set)
- `costPrice` — admin-only, used for margin calculation

### Inventory
- Stock tracked at variant level (or product level for simple products)
- `lowStockAt` threshold triggers admin alert
- Out-of-stock variants: add-to-cart button disabled, "Out of Stock" badge shown

### Product Status
- `draft` — visible only in admin
- `active` — visible in storefront
- `archived` — hidden, can be restored

## Shopping Cart

### Guest Cart (Zustand + localStorage)
- Stored in `localStorage` under key `cart`
- Persists across page navigation and browser restarts
- Merged with database cart on login

### Authenticated Cart (Database)
- Stored in `CartItem` table
- Synced via `/api/cart` endpoints
- Prevents overselling (server-side stock check at checkout)

### Cart Operations
- Add item (with variant)
- Update quantity
- Remove item
- Clear cart
- Apply coupon code (validated server-side)
- Display: item image, name, variant, price, quantity stepper, remove button, subtotal

## Checkout Flow

1. **Cart review** (`/cart`) — final item review, coupon entry
2. **Shipping info** (`/checkout`) — name, email, phone, address
3. **Shipping method** — rates fetched for delivery country
4. **Payment** — Stripe Elements (card number, expiry, CVC)
5. **Review & place order** — final total breakdown
6. **Confirmation** (`/checkout/success`) — order number, summary

### Coupon Validation
- `POST /api/coupons/validate` — checks: active, not expired, usage limit, minimum order
- Returns discount amount, type, description

### Tax Calculation
- Looks up `TaxRate` by shipping country (and state if applicable)
- Calculates tax on subtotal − discount
- Added to order total

### Shipping Calculation
- Finds applicable `ShippingZone` for shipping country
- Returns available `ShippingRate` options
- Customer selects preferred method

## Order Lifecycle

```
placed (pending, payment: pending)
  → payment confirmed via webhook (processing, payment: paid)
  → admin ships order (shipped, tracking added)
  → delivery confirmed (delivered)

or:

  → admin cancels (cancelled)
  → refund issued (refunded, payment: refunded)
```

## Customer Account

### Registration & Login
- Email + password registration
- Hashed with bcryptjs (salt 12)
- Login creates JWT session via NextAuth

### Account Pages
- **Profile** — edit name, email, phone, avatar
- **Orders** — list of all orders with status, link to detail
- **Order detail** — items, tracking info, status timeline
- **Addresses** — save multiple, set default
- **Wishlist** — saved products, add to cart from wishlist

## Discount System

### Coupon Types

| Type | Description | Example |
|---|---|---|
| `percentage` | % off subtotal | 20% off |
| `fixed` | Fixed amount off | $10 off |
| `free_shipping` | Waives shipping | Free shipping |

### Validation Rules
- Must be active (`isActive = true`)
- Within date range (startsAt ≤ now ≤ expiresAt)
- Under usage limit (`usedCount < usageLimit` or unlimited)
- Minimum order value met

### Application
- Applied in cart, persisted through checkout
- Stored on Order: `couponCode`, `couponDiscount`
- `usedCount` incremented on order creation

## Search & Filtering

### Search
- Server-side: Prisma `contains` on name, description, tags
- Debounced client-side input (300ms)
- Results include product image, name, price, category

### Filtering (Catalog)
- By category
- By price range (min/max slider)
- By availability (in stock only)
- By rating
- By attribute values (Color, Size — dynamic per category)

### Sorting
- Newest
- Price: low to high / high to low
- Popularity (most orders)
- Rating
- Featured first

## Reviews

- Rating 1–5 stars
- Optional title + content
- Requires purchase (checked via Order history) — TODO
- Moderation: `isApproved = false` by default; admin approves in dashboard
- Aggregate rating shown on product page (average + distribution bar)

## Wishlist

- Requires login
- Add/remove from product page and catalog
- Dedicated `/account/wishlist` page
- "Move to cart" action
