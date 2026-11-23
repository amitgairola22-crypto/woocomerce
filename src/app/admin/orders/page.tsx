'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, Eye } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPrice, formatDate } from '@/lib/utils'

interface Order {
  id: string
  orderNumber: string
  shippingName: string
  shippingEmail: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  items: { quantity: number }[]
}

const statusVariants: Record<string, 'warning' | 'info' | 'default' | 'success' | 'danger'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'danger',
  refunded: 'danger',
}

const paymentVariants: Record<string, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  paid: 'success',
  failed: 'danger',
  refunded: 'danger',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search) params.set('search', search)
      if (status) params.set('status', status)
      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      setOrders(data.orders || [])
      setTotal(data.total || 0)
    } finally {
      setLoading(false)
    }
  }, [page, search, status])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
        <p className="text-sm text-neutral-500 mt-1">{total} orders total</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by order number or email..."
            prefix={<Search size={16} />}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="flex-1"
          />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="border border-neutral-200 rounded-md px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100">
                <tr>
                  <th className="text-left p-4 font-medium text-neutral-500">Order</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Customer</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Items</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Total</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Payment</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Status</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Date</th>
                  <th className="text-right p-4 font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-neutral-900 hover:text-neutral-600">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="p-4">
                      <p className="text-neutral-900">{order.shippingName}</p>
                      <p className="text-xs text-neutral-500">{order.shippingEmail}</p>
                    </td>
                    <td className="p-4 text-neutral-600">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}
                    </td>
                    <td className="p-4 font-semibold text-neutral-900">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <Badge variant={paymentVariants[order.paymentStatus] ?? 'warning'}>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariants[order.status] ?? 'default'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-neutral-500 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="flex justify-end">
                        <button className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > 20 && (
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <p>Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
