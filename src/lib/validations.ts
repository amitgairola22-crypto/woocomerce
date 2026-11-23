import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const checkoutSchema = z.object({
  shippingName: z.string().min(2, 'Name is required'),
  shippingEmail: z.string().email('Invalid email'),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().min(5, 'Address is required'),
  shippingCity: z.string().min(2, 'City is required'),
  shippingState: z.string().optional(),
  shippingZip: z.string().min(3, 'ZIP code is required'),
  shippingCountry: z.string().min(2, 'Country is required'),
  shippingRateId: z.string().optional(),
  couponCode: z.string().optional(),
  billingSameAsShipping: z.boolean().default(true),
})

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  content: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  comparePrice: z.number().min(0).optional().nullable(),
  costPrice: z.number().min(0).optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  trackStock: z.boolean().default(true),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
})

export const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  description: z.string().optional(),
  type: z.enum(['percentage', 'fixed', 'free_shipping']),
  value: z.number().min(0),
  minOrderValue: z.number().min(0).default(0),
  maxDiscount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CouponInput = z.infer<typeof couponSchema>
export type CategoryInput = z.infer<typeof categorySchema>
