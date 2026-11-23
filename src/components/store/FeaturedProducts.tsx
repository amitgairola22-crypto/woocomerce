'use client'

import { ProductCard } from './ProductCard'
import Link from 'next/link'
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

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Featured Products</h2>
            <p className="text-neutral-500 mt-2">Our most popular picks this season</p>
          </div>
          <Link href="/products?sort=featured">
            <Button variant="secondary" size="sm">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
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
      </div>
    </section>
  )
}
