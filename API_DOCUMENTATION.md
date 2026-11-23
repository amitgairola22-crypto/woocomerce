# API Documentation

All API routes are Next.js Route Handlers under `src/app/api/`.

Base URL: `http://localhost:3000/api` (dev)

## Authentication

Most endpoints use session-based auth via NextAuth. Include cookies in requests (browser does this automatically).

Admin endpoints additionally require `role` to be `admin` or `manager`.

---

## Products

### `GET /api/products`
Fetch products with optional filtering.

**Query params:**
| Param | Type | Description |
|---|---|---|
| `search` | string | Search in name, description |
| `category` | string | Category slug |
| `status` | string | `active` \| `draft` \| `archived` |
| `featured` | boolean | Only featured products |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `sort` | string | `newest` \| `price_asc` \| `price_desc` \| `popular` |
| `page` | number | Page number (default 1) |
| `limit` | number | Per page (default 20) |

**Response:**
```json
{
  "products": [...],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

### `GET /api/products/[slug]`
Get single product by slug. Includes images, variants, attributes, category.

### `POST /api/admin/products` (Admin)
Create product. Body: product fields.

### `PUT /api/admin/products/[id]` (Admin)
Update product.

### `DELETE /api/admin/products/[id]` (Admin)
Soft-delete (sets `status = "archived"`).

---

## Categories

### `GET /api/categories`
All active categories with product count.

### `GET /api/categories/[slug]`
Single category with children.

### `POST /api/admin/categories` (Admin)
Create category.

### `PUT /api/admin/categories/[id]` (Admin)
Update category.

### `DELETE /api/admin/categories/[id]` (Admin)
Delete category (only if no products assigned).

---

## Cart

### `GET /api/cart`
Get current user's cart items (requires auth).

### `POST /api/cart`
Add item to cart.
```json
{ "productId": "...", "variantId": "...", "quantity": 1 }
```

### `PUT /api/cart/[id]`
Update cart item quantity.
```json
{ "quantity": 2 }
```

### `DELETE /api/cart/[id]`
Remove cart item.

### `DELETE /api/cart`
Clear entire cart.

---

## Checkout

### `POST /api/checkout/create-intent`
Create Stripe PaymentIntent and validate order.

**Body:**
```json
{
  "items": [{ "productId": "...", "variantId": "...", "quantity": 1 }],
  "shippingAddress": { "name": "...", "email": "...", "address": "...", "city": "...", "zip": "...", "country": "US" },
  "shippingRateId": "...",
  "couponCode": "SAVE10"
}
```

**Response:**
```json
{
  "clientSecret": "pi_..._secret_...",
  "orderId": "...",
  "total": 99.99,
  "breakdown": { "subtotal": 89.99, "shipping": 10, "tax": 0, "discount": 0 }
}
```

### `GET /api/checkout/shipping-rates`
Get available shipping rates for a country.

**Query:** `?country=US`

### `POST /api/coupons/validate`
Validate a coupon code.
```json
{ "code": "SAVE10", "subtotal": 100 }
```

---

## Orders

### `GET /api/orders`
Customer's own orders (requires auth).

### `GET /api/orders/[id]`
Order detail (own order or admin).

### `GET /api/admin/orders` (Admin)
All orders with filtering.

### `PUT /api/admin/orders/[id]` (Admin)
Update order status, tracking info.

---

## Auth

### `POST /api/auth/register`
Register new customer.
```json
{ "name": "...", "email": "...", "password": "..." }
```

### `POST /api/auth/[...nextauth]`
NextAuth handlers (login, logout, session).

---

## Webhooks

### `POST /api/webhooks/stripe`
Stripe webhook endpoint. Handles:
- `payment_intent.succeeded` — creates Order, clears cart
- `payment_intent.payment_failed` — updates order payment status

**Note:** Stripe signature verified on every request. Never call this endpoint directly.

---

## Admin

### `POST /api/admin/upload`
Upload product image. `multipart/form-data` with `file` field.

**Response:** `{ "url": "/uploads/abc123.webp" }`

### `GET /api/admin/analytics`
Dashboard statistics.

**Response:**
```json
{
  "revenue": { "today": 0, "week": 0, "month": 0, "total": 0 },
  "orders": { "pending": 0, "processing": 0, "shipped": 0 },
  "customers": { "total": 0, "thisMonth": 0 },
  "topProducts": [...],
  "recentOrders": [...]
}
```

---

## Error Format

All errors return:
```json
{ "error": "Human-readable message" }
```

HTTP status codes:
- `400` — Validation error
- `401` — Not authenticated
- `403` — Forbidden (insufficient role)
- `404` — Not found
- `409` — Conflict (e.g. duplicate email)
- `500` — Internal server error
