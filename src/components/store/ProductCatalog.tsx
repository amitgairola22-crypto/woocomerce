'use client'

import { ProductCard } from './ProductCard'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  stock: number
  featured: boolean
  images: { url: string }[]
  _count?: { reviews: number }
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductCatalogProps {
  initialProducts: Product[]
  total: number
  page: number
  categories: Category[]
  currentCategory: string
  currentSort: string
  currentSearch: string
}

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export function ProductCatalog({
  initialProducts,
  total,
  page,
  categories,
  currentCategory,
  currentSort,
  currentSearch,
}: ProductCatalogProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`/products?${params.toString()}`)
    },
    [router, searchParams]
  )

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.push(`/products?${params.toString()}`)
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-56 flex-shrink-0 space-y-6">
          <div>
            <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <SlidersHorizontal size={16} />
              Filters
            </h3>

            {/* Categories */}
            <div className="space-y-1.5">
              <button
                onClick={() => updateFilter('category', '')}
                className={`block text-sm w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  !currentCategory ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`block text-sm w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    currentCategory === cat.slug ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {currentSearch ? `Results for "${currentSearch}"` : currentCategory ? categories.find(c => c.slug === currentCategory)?.name ?? 'Products' : 'All Products'}
              </h1>
              <p className="text-sm text-neutral-500 mt-0.5">{total} products</p>
            </div>
            <select
              value={currentSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="border border-neutral-200 rounded-md px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {initialProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-medium text-neutral-900">No products found</p>
              <p className="text-neutral-500 mt-2">Try adjusting your filters</p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => router.push('/products')}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {initialProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  comparePrice={product.comparePrice}
                  image={product.images[0]?.url}
                  stock={product.stock}
                  featured={product.featured}
                  reviewCount={product._count?.reviews}
                  index={i}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + 1
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === page ? 'bg-neutral-900 text-white' : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
