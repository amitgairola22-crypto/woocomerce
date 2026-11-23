'use client'

import { useCartStore } from '@/store/cart'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, CheckoutInput } from '@/lib/validations'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { useToastStore } from '@/components/ui/Toast'

export default function CheckoutPage() {
  const { items, getSubtotal, getDiscount, coupon, clearCart } = useCartStore()
  const router = useRouter()
  const addToast = useToastStore((s) => s.addToast)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema) as unknown as never,
    defaultValues: { billingSameAsShipping: true },
  })

  const subtotal = getSubtotal()
  const discount = getDiscount()

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push('/cart')
    }
  }, [items, orderPlaced, router])

  async function onSubmit(data: CheckoutInput) {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
            name: i.name,
            image: i.image,
          })),
          ...data,
          couponCode: coupon?.code,
          couponDiscount: discount,
          subtotal,
          total: subtotal - discount,
        }),
      })

      const result = await res.json()
      if (!res.ok) {
        addToast(result.error || 'Checkout failed', 'error')
        return
      }

      clearCart()
      setOrderNumber(result.orderNumber)
      setOrderPlaced(true)
    } catch {
      addToast('Something went wrong', 'error')
    }
  }

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Order Placed!</h1>
        <p className="text-neutral-500 mb-2">Thank you for your purchase.</p>
        <p className="text-sm text-neutral-500 mb-8">
          Order number: <strong className="text-neutral-900">{orderNumber}</strong>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account">
            <Button variant="secondary">View Orders</Button>
          </Link>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/cart" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-6">
        <ArrowLeft size={16} />
        Back to cart
      </Link>

      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-neutral-900">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  {...register('shippingName')}
                  error={errors.shippingName?.message}
                  className="col-span-2"
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  {...register('shippingEmail')}
                  error={errors.shippingEmail?.message}
                />
                <Input
                  label="Phone"
                  type="tel"
                  {...register('shippingPhone')}
                />
              </div>
              <Input
                label="Address"
                required
                {...register('shippingAddress')}
                error={errors.shippingAddress?.message}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  required
                  {...register('shippingCity')}
                  error={errors.shippingCity?.message}
                />
                <Input
                  label="ZIP / Postal Code"
                  required
                  {...register('shippingZip')}
                  error={errors.shippingZip?.message}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="State / Province"
                  {...register('shippingState')}
                />
                <div>
                  <label className="text-sm font-medium text-neutral-700 block mb-1">Country <span className="text-red-500">*</span></label>
                  <select
                    {...register('shippingCountry')}
                    className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                  </select>
                  {errors.shippingCountry && (
                    <p className="text-xs text-red-500 mt-1">{errors.shippingCountry.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment placeholder */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-neutral-900">Payment</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <strong>Demo Mode:</strong> This is a demo checkout. No real payment will be processed. Click &quot;Place Order&quot; to simulate an order.
              </div>
              <p className="text-sm text-neutral-500">
                In production, Stripe Elements would appear here for secure card collection.
              </p>
            </div>

            <Button fullWidth size="lg" type="submit" loading={isSubmitting}>
              Place Order — {formatPrice(subtotal - discount)}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-neutral-100 rounded-2xl p-6 sticky top-24">
            <h2 className="font-semibold text-neutral-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <ShoppingBag size={20} className="text-neutral-300 absolute inset-0 m-auto" />
                    )}
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                    {item.variant && <p className="text-xs text-neutral-500">{item.variant}</p>}
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
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
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="flex justify-between font-bold text-base text-neutral-900 pt-2 border-t border-neutral-100">
                <span>Total</span>
                <span>{formatPrice(subtotal - discount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
