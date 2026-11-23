'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  slug: string
  image?: string
  price: number
  quantity: number
  variant?: string
  stock: number
}

interface CartStore {
  items: CartItem[]
  coupon: { code: string; discount: number; type: string } | null
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string, discount: number, type: string) => void
  removeCoupon: () => void
  getTotalItems: () => number
  getSubtotal: () => number
  getDiscount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (item) => {
        const id = `${item.productId}-${item.variantId ?? 'default'}`
        set((state) => {
          const existing = state.items.find((i) => i.id === id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, id }] }
        })
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        }))
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (code, discount, type) => set({ coupon: { code, discount, type } }),

      removeCoupon: () => set({ coupon: null }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getDiscount: () => {
        const { coupon } = get()
        if (!coupon) return 0
        const subtotal = get().getSubtotal()
        if (coupon.type === 'percentage') return (subtotal * coupon.discount) / 100
        if (coupon.type === 'fixed') return Math.min(coupon.discount, subtotal)
        return 0
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().getDiscount()
        return Math.max(0, subtotal - discount)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
