'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, Loader2 } from 'lucide-react'
import { useUIStore } from '@/store/ui'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  images: { url: string }[]
}

export function SearchModal() {
  const { searchOpen, closeSearch } = useUIStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(q)}&limit=6&status=active`)
      const data = await res.json()
      setResults(data.products || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  useEffect(() => {
    if (!searchOpen) {
      setQuery('')
      setResults([])
    }
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeSearch])

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative z-10 max-w-2xl mx-auto mt-20 px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 border-b border-neutral-100">
                <Search size={20} className="text-neutral-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
                {loading && <Loader2 size={18} className="animate-spin text-neutral-400" />}
                <button onClick={closeSearch} className="p-1.5 hover:bg-neutral-100 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              {results.length > 0 && (
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-xl transition-colors"
                    >
                      <div className="relative w-12 h-14 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images[0] && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{product.name}</p>
                        <p className="text-sm text-neutral-500">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/products?search=${encodeURIComponent(query)}`}
                    onClick={closeSearch}
                    className="block text-center text-sm font-medium text-neutral-900 hover:text-neutral-600 py-3 border-t border-neutral-100 mt-2"
                  >
                    View all results for &ldquo;{query}&rdquo; →
                  </Link>
                </div>
              )}

              {query && !loading && results.length === 0 && (
                <div className="p-8 text-center text-neutral-500">
                  <p className="font-medium">No results for &ldquo;{query}&rdquo;</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
