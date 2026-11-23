'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatPrice, formatDate } from '@/lib/utils'

interface Customer {
  id: string
  name?: string | null
  email: string
  phone?: string | null
  createdAt: string
  totalSpent: number
  _count: { orders: number }
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)
    const res = await fetch(`/api/admin/customers?${params}`)
    const data = await res.json()
    setCustomers(data.customers || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [page, search])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Customers</h1>
        <p className="text-sm text-neutral-500 mt-1">{total} customers total</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 p-4">
        <Input
          placeholder="Search by name or email..."
          prefix={<Search size={16} />}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="max-w-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">No customers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100">
                <tr>
                  <th className="text-left p-4 font-medium text-neutral-500">Customer</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Orders</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Total Spent</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center font-medium text-neutral-600">
                          {(c.name || c.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{c.name || '—'}</p>
                          <p className="text-xs text-neutral-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-600">{c._count.orders}</td>
                    <td className="p-4 font-medium text-neutral-900">{formatPrice(c.totalSpent)}</td>
                    <td className="p-4 text-neutral-500">{formatDate(c.createdAt)}</td>
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
