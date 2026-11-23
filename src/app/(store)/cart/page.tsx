'use client'

import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'
import { useToastStore } from '@/components/ui/Toast'

export default function CartPage() {
  const { items, removeItem, updateQuantity, coupon, applyCoupon, removeCoupon, getSubtotal, getDiscount } = useCartStore()
  const addToast = useToastStore((s) => s.addToast)
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const total = subtotal - discount

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      })
      const data = await res.json()
      if (res.ok) {
        applyCoupon(data.code, data.discount, data.type)
        addToast(`Coupon applied! You save ${formatPrice(data.discount)}`, 'success')
        setCouponInput('')
      } else {
        addToast(data.error || 'Invalid coupon', 'error')
      }
    } finally {
      setCouponLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="text-neutral-200 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h1>
        <p className="text-neutral-500 mb-8">Add some products to get started</p>
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-neutral-100 rounded-2xl p-4 flex gap-4">
              <div className="relative w-24 h-28 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300">
                    <ShoppingBag size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-medium text-neutral-900 hover:text-neutral-600">
                      {item.name}
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-neutral-500 mt-0.5">{item.variant}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-neutral-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-medium min-w-[40px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-2 hover:bg-neutral-100 transition-colors disabled:opacity-30"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-4 space-y-3">
            <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
              <Tag size={16} />
              Discount Code
            </h3>
            {coupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-green-800">{coupon.code}</p>
                  <p className="text-xs text-green-600">-{formatPrice(discount)} saved</p>
                </div>
                <button onClick={removeCoupon} className="text-green-600 hover:text-green-800 text-xs font-medium">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  className="flex-1"
                />
                <Button variant="secondary" onClick={handleApplyCoupon} loading={couponLoading} size="sm">
                  Apply
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-neutral-900">Order Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-neutral-100 pt-2 flex justify-between font-semibold text-base text-neutral-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button fullWidth size="lg">Proceed to Checkout</Button>
            </Link>
            <Link href="/products" className="block">
              <Button fullWidth variant="ghost" size="sm">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
