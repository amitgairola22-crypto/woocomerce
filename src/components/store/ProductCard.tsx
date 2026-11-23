'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useCartStore } from '@/store/cart'
import { useToastStore } from '@/components/ui/Toast'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  image?: string
  stock: number
  featured?: boolean
  rating?: number
  reviewCount?: number
  categoryName?: string
  index?: number
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  image,
  stock,
  featured,
  rating,
  reviewCount,
  index = 0,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const addToast = useToastStore((s) => s.addToast)
  const discount = calculateDiscount(price, comparePrice ?? null)
  const inStock = stock > 0

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (!inStock) return
    addItem({
      productId: id,
      name,
      slug,
      image,
      price,
      quantity: 1,
      stock,
    })
    addToast(`${name} added to cart`, 'success')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/product/${slug}`} className="group block">
        <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden mb-3">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300">
              <ShoppingBag size={48} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <Badge variant="danger">-{discount}%</Badge>
            )}
            {featured && (
              <Badge variant="default">Featured</Badge>
            )}
            {!inStock && (
              <Badge variant="outline">Out of Stock</Badge>
            )}
            {inStock && stock <= 5 && (
              <Badge variant="warning">Low Stock</Badge>
            )}
          </div>

          {/* Quick Add overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full bg-neutral-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              {inStock ? 'Quick Add' : 'Out of Stock'}
            </button>
          </div>

          {/* Wishlist button */}
          <button
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
            onClick={(e) => e.preventDefault()}
          >
            <Heart size={16} className="text-neutral-600" />
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-neutral-900 line-clamp-2 group-hover:text-neutral-600 transition-colors">
            {name}
          </p>
          {rating !== undefined && reviewCount !== undefined && reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-xs text-neutral-500">{rating.toFixed(1)} ({reviewCount})</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">{formatPrice(price)}</span>
            {comparePrice && comparePrice > price && (
              <span className="text-sm text-neutral-400 line-through">{formatPrice(comparePrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
