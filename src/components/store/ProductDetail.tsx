'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Share2, Star, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useUIStore } from '@/store/ui'
import { useToastStore } from '@/components/ui/Toast'
import Link from 'next/link'

interface ProductAttribute {
  id: string
  name: string
  values: string
}

interface ProductVariant {
  id: string
  name: string
  price: number
  comparePrice?: number | null
  stock: number
  image?: string | null
  options: string
  isActive: boolean
}

interface Review {
  id: string
  rating: number
  title?: string | null
  content?: string | null
  createdAt: Date
  user: { name?: string | null }
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  content?: string | null
  price: number
  comparePrice?: number | null
  stock: number
  featured: boolean
  images: { id: string; url: string; alt?: string | null }[]
  variants: ProductVariant[]
  attributes: ProductAttribute[]
  category?: { name: string; slug: string } | null
  reviews: Review[]
  _count: { reviews: number }
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useUIStore((s) => s.openCart)
  const addToast = useToastStore((s) => s.addToast)

  const attributes = product.attributes.map((attr) => ({
    ...attr,
    parsedValues: JSON.parse(attr.values) as string[],
  }))

  const selectedVariant = product.variants.find((v) => {
    if (!Object.keys(selectedOptions).length) return false
    try {
      const options = JSON.parse(v.options) as Record<string, string>
      return Object.entries(selectedOptions).every(([k, val]) => options[k] === val)
    } catch {
      return false
    }
  })

  const currentPrice = selectedVariant?.price ?? product.price
  const currentComparePrice = selectedVariant?.comparePrice ?? product.comparePrice
  const currentStock = selectedVariant?.stock ?? product.stock
  const currentImage = selectedVariant?.image ?? product.images[selectedImage]?.url
  const inStock = currentStock > 0
  const discount = calculateDiscount(currentPrice, currentComparePrice ?? null)

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0

  function handleAddToCart() {
    if (!inStock) return
    if (product.variants.length > 0 && !selectedVariant) {
      addToast('Please select all options', 'warning')
      return
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      slug: product.slug,
      image: currentImage,
      price: currentPrice,
      quantity,
      stock: currentStock,
      variant: selectedVariant?.name,
    })
    openCart()
    addToast(`${product.name} added to cart`, 'success')
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <Link href="/" className="hover:text-neutral-700">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-neutral-700">Products</Link>
        {product.category && (
          <>
            <ChevronRight size={14} />
            <Link href={`/category/${product.category.slug}`} className="hover:text-neutral-700">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-neutral-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                <ShoppingBag size={64} />
              </div>
            )}
            {discount > 0 && (
              <div className="absolute top-4 left-4">
                <Badge variant="danger">-{discount}%</Badge>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square bg-neutral-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? 'border-neutral-900' : 'border-transparent hover:border-neutral-300'
                  }`}
                >
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Link href={`/category/${product.category.slug}`} className="text-sm text-neutral-500 hover:text-neutral-700">
                {product.category.name}
              </Link>
            )}
            <h1 className="text-3xl font-bold text-neutral-900 mt-1">{product.name}</h1>

            {/* Rating */}
            {product._count.reviews > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">
                  {avgRating.toFixed(1)} ({product._count.reviews} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-neutral-900">{formatPrice(currentPrice)}</span>
            {currentComparePrice && currentComparePrice > currentPrice && (
              <span className="text-lg text-neutral-400 line-through">{formatPrice(currentComparePrice)}</span>
            )}
            {discount > 0 && (
              <Badge variant="danger">Save {discount}%</Badge>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-neutral-600 leading-relaxed">{product.description}</p>
          )}

          {/* Variants */}
          {attributes.map((attr) => (
            <div key={attr.id}>
              <p className="text-sm font-medium text-neutral-900 mb-2">
                {attr.name}: <span className="font-normal text-neutral-600">{selectedOptions[attr.name] || 'Select'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {attr.parsedValues.map((val) => (
                  <button
                    key={val}
                    onClick={() => setSelectedOptions((prev) => ({ ...prev, [attr.name]: val }))}
                    className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                      selectedOptions[attr.name] === val
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-900'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Stock */}
          {!inStock ? (
            <Badge variant="danger" size="md">Out of Stock</Badge>
          ) : currentStock <= 5 ? (
            <Badge variant="warning" size="md">Only {currentStock} left</Badge>
          ) : null}

          {/* Quantity + Add to cart */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden w-fit">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-3 hover:bg-neutral-100 transition-colors font-medium"
              >
                −
              </button>
              <span className="px-5 py-3 font-medium min-w-[48px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(currentStock, q + 1))}
                disabled={quantity >= currentStock}
                className="px-4 py-3 hover:bg-neutral-100 transition-colors font-medium disabled:opacity-30"
              >
                +
              </button>
            </div>

            <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
              <Button
                fullWidth
                size="lg"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="gap-2"
              >
                <ShoppingBag size={20} />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </motion.div>

            <button className="p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
              <Heart size={20} className="text-neutral-600" />
            </button>
          </div>

          {/* Share */}
          <button className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700">
            <Share2 size={16} />
            Share this product
          </button>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-neutral-100 pb-6 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} size={14} className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'} />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-neutral-900">{review.user.name || 'Anonymous'}</span>
                </div>
                {review.title && <p className="font-medium text-neutral-900 mb-1">{review.title}</p>}
                {review.content && <p className="text-neutral-600 text-sm">{review.content}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
