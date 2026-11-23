'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useUIStore } from '@/store/ui'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export function CartDrawer() {
  const { cartOpen, closeCart } = useUIStore()
  const { items, removeItem, updateQuantity, getSubtotal, getDiscount, coupon } = useCartStore()

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const total = subtotal - discount

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <h2 className="text-lg font-semibold">Your Cart</h2>
                {items.length > 0 && (
                  <span className="text-sm text-neutral-500">({items.length} items)</span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-neutral-200" />
                  <div>
                    <p className="font-medium text-neutral-900">Your cart is empty</p>
                    <p className="text-sm text-neutral-500 mt-1">Add items to get started</p>
                  </div>
                  <Link href="/products" onClick={closeCart}>
                    <Button variant="secondary" size="sm">Continue Shopping</Button>
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-neutral-900 line-clamp-2">{item.name}</p>
                      {item.variant && (
                        <p className="text-xs text-neutral-500 mt-0.5">{item.variant}</p>
                      )}
                      <p className="text-sm font-semibold text-neutral-900 mt-1">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-neutral-100 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-medium min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="p-1.5 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-100 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({coupon?.code})</span>
                      <span>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-neutral-900 text-base pt-2 border-t border-neutral-100">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link href="/checkout" onClick={closeCart} className="block">
                    <Button fullWidth>Checkout</Button>
                  </Link>
                  <Link href="/cart" onClick={closeCart} className="block">
                    <Button fullWidth variant="ghost" size="sm">View Cart</Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
