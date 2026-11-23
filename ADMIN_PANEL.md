# Admin Panel

## Access

URL: `/admin`
Auth: Requires session with `role === "admin"` or `role === "manager"`

Default credentials (seed data):
- Email: `admin@store.com`
- Password: `admin123`

## Sections

### Dashboard (`/admin`)

Displays:
- Revenue summary cards (today / this week / this month / all time)
- Orders count by status
- Recent orders table
- Top selling products
- Customer growth chart
- Low stock alerts

### Products (`/admin/products`)

**List view:**
- Search by name/SKU
- Filter by category, status (active/draft/archived)
- Sortable columns: name, price, stock, date
- Bulk actions: activate, deactivate, delete
- Pagination

**Create/Edit (`/admin/products/new`, `/admin/products/[id]`):**
- General: name, slug (auto-generated), description (rich text)
- Pricing: price, compare price, cost price
- Inventory: SKU, barcode, track stock, quantity, low stock threshold
- Images: drag-and-drop upload, reorder, set featured image
- Variants: attribute builder (Color, Size etc.), auto-generates variant matrix
- SEO: meta title, meta description
- Category: single category assignment
- Collections: multi-select
- Status: draft / active / archived

### Categories (`/admin/categories`)

- Hierarchical tree view
- Create parent + child categories
- Upload category image
- Drag to reorder
- Toggle active/inactive

### Orders (`/admin/orders`)

**List view:**
- Filter by status, date range, payment status
- Search by order number, customer email
- Quick status update from list

**Detail view (`/admin/orders/[id]`):**
- Full order timeline (placed → processing → shipped → delivered)
- Customer info + shipping address
- Items with thumbnails
- Financial breakdown
- Update status dropdown
- Add tracking number + URL
- Internal notes
- Print order button

### Customers (`/admin/customers`)

- Customer list with order count + total spent
- Search by name/email
- View customer detail: profile, all orders, saved addresses
- Suspend / unsuspend account

### Discounts (`/admin/discounts`)

- Coupon code list (active/inactive/expired)
- Create coupon:
  - Code (auto-generate or manual)
  - Type: percentage / fixed amount / free shipping
  - Value
  - Minimum order value
  - Maximum discount amount
  - Usage limit
  - Start date / expiry date
- Usage statistics per coupon

### Shipping (`/admin/shipping`)

- Create shipping zones (by country selection)
- Per zone: add multiple shipping rates
  - Flat rate (price)
  - Weight-based (price per kg, min/max weight)
  - Free shipping (above order value threshold)

### Banners (`/admin/banners`)

- Upload hero banners (image, title, subtitle, CTA button, link)
- Position: hero / promotional strip / category banner
- Reorder via drag-and-drop
- Toggle active/inactive

### Settings (`/admin/settings`)

**General:**
- Store name, tagline, logo, favicon
- Currency (code, symbol, position)
- Contact email, phone, address

**Email:**
- SMTP settings (placeholder for now)
- Order confirmation template preview

**Tax:**
- Create tax rates by country/state
- Apply tax to orders

**Payment:**
- Stripe key status (live/test mode indicator)

## Role Permissions

| Feature | Admin | Manager | Customer |
|---|---|---|---|
| Dashboard | ✓ | ✓ | ✗ |
| Products (CRUD) | ✓ | ✓ | ✗ |
| Categories (CRUD) | ✓ | ✗ | ✗ |
| Orders (view) | ✓ | ✓ | own only |
| Orders (edit) | ✓ | ✓ | ✗ |
| Customers | ✓ | read only | ✗ |
| Discounts | ✓ | ✓ | ✗ |
| Shipping | ✓ | ✗ | ✗ |
| Banners | ✓ | ✗ | ✗ |
| Settings | ✓ | ✗ | ✗ |

## Admin UI Design

- **Theme:** Dark sidebar (`#0F172A`) + white content area
- **Sidebar:** collapsible on mobile, icons + labels
- **Tables:** sortable headers, row hover, action column with kebab menu
- **Forms:** validation feedback inline (red border + message), save button with loading state
- **Toast notifications:** success/error feedback on mutations
- **Confirmation dialogs:** before destructive actions (delete, cancel order)
