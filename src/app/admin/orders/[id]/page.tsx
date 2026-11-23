'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

interface OrderItem {
  id: string
  name: string
  sku?: string | null
  image?: string | null
  price: number
  quantity: number
  total: number
  options?: string | null
  product: { name: string; images: { url: string }[] }
}

interface Order {
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
  shippingPhone?: string | null
  shippingAddress: string
  shippingCity: string
  shippingState?: string | null
  shippingZip: string
  shippingCountry: string
  trackingNumber?: string | null
  trackingUrl?: string | null
  notes?: string | null
  paymentMethod?: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user?: { name?: string | null; email: string } | null
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock size={16} />,
  processing: <Package size={16} />,
  shipped: <Truck size={16} />,
  delivered: <CheckCircle size={16} />,
  cancelled: <XCircle size={16} />,
  refunded: <XCircle size={16} />,
}

const statusColors: Record<string, 'warning' | 'info' | 'default' | 'success' | 'danger'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'danger',
  refunded: 'danger',
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [tracking, setTracking] = useState('')
  const [trackingUrl, setTrackingUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchOrder = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/orders/${id}`)
    if (res.ok) {
      const data = await res.json()
      setOrder(data)
      setStatus(data.status)
      setTracking(data.trackingNumber ?? '')
      setTrackingUrl(data.trackingUrl ?? '')
      setNotes(data.notes ?? '')
    }
    setLoading(false)
  }, [id])

  useEffect(() => { fetchOrder() }, [fetchOrder])

  async function handleUpdate() {
    setSaving(true)
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber: tracking || null, trackingUrl: trackingUrl || null, notes: notes || null }),
    })
    setSaving(false)
    if (res.ok) {
      toast('Order updated', 'success')
      fetchOrder()
    } else {
      toast('Failed to update order', 'error')
    }
  }

  if (loading) return <div className="p-12 text-center text-neutral-400">Loading...</div>
  if (!order) return <div className="p-12 text-center text-neutral-400">Order not found</div>

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/admin/orders')} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{order.orderNumber}</h1>
          <p className="text-sm text-neutral-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant={statusColors[order.status] ?? 'default'}>
            {statusIcons[order.status]}
            {order.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
            <div className="p-5 border-b border-neutral-50">
              <h2 className="font-semibold text-neutral-900">Order Items</h2>
            </div>
            <div className="divide-y divide-neutral-50">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  <div className="w-14 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product?.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900">{item.name}</p>
                    {item.options && (() => { try { const o = JSON.parse(item.options); return <p className="text-xs text-neutral-500">{Object.entries(o).map(([k,v]) => `${k}: ${v}`).join(', ')}</p> } catch { return null } })()}
                    <p className="text-sm text-neutral-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="font-semibold text-neutral-900">{formatPrice(item.total)}</span>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-neutral-50 space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount {order.couponCode && `(${order.couponCode})`}</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between text-neutral-600"><span>Shipping</span><span>{formatPrice(order.shipping)}</span></div>
              {order.tax > 0 && <div className="flex justify-between text-neutral-600"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>}
              <div className="flex justify-between font-bold text-neutral-900 text-base pt-2 border-t border-neutral-100"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-3">
            <h2 className="font-semibold text-neutral-900">Customer & Shipping</h2>
            <div className="text-sm space-y-1">
              <p className="font-medium text-neutral-900">{order.shippingName}</p>
              <p className="text-neutral-600">{order.shippingEmail}</p>
              {order.shippingPhone && <p className="text-neutral-600">{order.shippingPhone}</p>}
              <div className="pt-2">
                <p className="text-neutral-700">{order.shippingAddress}</p>
                <p className="text-neutral-700">{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                <p className="text-neutral-700">{order.shippingCountry}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Update panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-4">
            <h2 className="font-semibold text-neutral-900">Update Order</h2>
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900">
                {['pending','processing','shipped','delivered','cancelled','refunded'].map(s => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
            <Input label="Tracking Number" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. 1Z999AA10123456784" />
            <Input label="Tracking URL" value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} placeholder="https://..." />
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">Internal Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none" placeholder="Notes visible only to staff" />
            </div>
            <Button fullWidth onClick={handleUpdate} loading={saving}>Save Changes</Button>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-2 text-sm">
            <h2 className="font-semibold text-neutral-900 mb-3">Payment</h2>
            <div className="flex justify-between">
              <span className="text-neutral-600">Status</span>
              <Badge variant={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'failed' ? 'danger' : 'warning'}>
                {order.paymentStatus}
              </Badge>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Method</span>
              <span className="capitalize">{order.paymentMethod ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
