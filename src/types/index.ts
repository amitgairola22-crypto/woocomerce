export interface ProductWithDetails {
  id: string
  name: string
  slug: string
  description?: string | null
  content?: string | null
  price: number
  comparePrice?: number | null
  stock: number
  status: string
  featured: boolean
  tags?: string | null
  categoryId?: string | null
  createdAt: Date
  updatedAt: Date
  category?: CategoryBasic | null
  images: ProductImage[]
  variants: ProductVariant[]
  attributes: ProductAttribute[]
  reviews?: Review[]
  _count?: { reviews: number; orderItems: number }
}

export interface ProductBasic {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  stock: number
  status: string
  featured: boolean
  images: ProductImage[]
  category?: CategoryBasic | null
  _count?: { reviews: number }
}

export interface ProductImage {
  id: string
  url: string
  alt?: string | null
  sortOrder: number
}

export interface ProductVariant {
  id: string
  name: string
  sku?: string | null
  price: number
  comparePrice?: number | null
  stock: number
  image?: string | null
  options: string
  isActive: boolean
}

export interface ProductAttribute {
  id: string
  name: string
  values: string
}

export interface CategoryBasic {
  id: string
  name: string
  slug: string
  image?: string | null
}

export interface CategoryWithChildren extends CategoryBasic {
  description?: string | null
  children: CategoryBasic[]
  _count?: { products: number }
}

export interface Review {
  id: string
  rating: number
  title?: string | null
  content?: string | null
  createdAt: Date
  user: { name?: string | null }
}

export interface OrderWithItems {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  couponCode?: string | null
  shippingName: string
  shippingEmail: string
  shippingAddress: string
  shippingCity: string
  shippingZip: string
  shippingCountry: string
  trackingNumber?: string | null
  trackingUrl?: string | null
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  sku?: string | null
  image?: string | null
  price: number
  quantity: number
  total: number
  options?: string | null
}

export interface AdminStats {
  revenue: {
    today: number
    week: number
    month: number
    total: number
  }
  orders: {
    pending: number
    processing: number
    shipped: number
    total: number
  }
  customers: {
    total: number
    thisMonth: number
  }
  topProducts: Array<{
    id: string
    name: string
    slug: string
    image?: string
    totalSold: number
    revenue: number
  }>
  recentOrders: OrderWithItems[]
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'featured'

export interface FilterOptions {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  sort?: SortOption
  page?: number
  limit?: number
}
