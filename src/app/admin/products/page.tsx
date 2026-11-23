'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  status: string
  featured: boolean
  images: { url: string }[]
  category: { name: string } | null
  _count: { orderItems: number }
}

const statusVariants: Record<string, 'success' | 'warning' | 'default'> = {
  active: 'success',
  draft: 'warning',
  archived: 'default',
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search) params.set('search', search)
      if (status) params.set('status', status)
      const res = await fetch(`/api/admin/products?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } finally {
      setLoading(false)
    }
  }, [page, search, status])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Archive "${name}"? It will be hidden from the store.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">{total} products total</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus size={18} />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search products..."
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
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="text-neutral-200 mx-auto mb-4" />
            <p className="font-medium text-neutral-900">No products found</p>
            <p className="text-sm text-neutral-500 mt-1">Try adjusting your search or add a new product</p>
            <Link href="/admin/products/new" className="mt-4 inline-block">
              <Button size="sm">Add Product</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100">
                <tr>
                  <th className="text-left p-4 font-medium text-neutral-500">Product</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Category</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Price</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Stock</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Status</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Sales</th>
                  <th className="text-right p-4 font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{product.name}</p>
                          {product.featured && (
                            <span className="text-xs text-amber-600">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-600">{product.category?.name ?? '—'}</td>
                    <td className="p-4 font-medium text-neutral-900">{formatPrice(product.price)}</td>
                    <td className="p-4">
                      <span className={product.stock === 0 ? 'text-red-500 font-medium' : product.stock <= 5 ? 'text-amber-500 font-medium' : 'text-neutral-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariants[product.status] ?? 'default'}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-neutral-600">{product._count.orderItems}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/product/${product.slug}`} target="_blank">
                          <button className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                        </Link>
                        <Link href={`/admin/products/${product.id}`}>
                          <button className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
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
