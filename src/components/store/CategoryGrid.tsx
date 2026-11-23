'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
  _count?: { products: number }
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-neutral-900">Shop by Category</h2>
        <p className="text-neutral-500 mt-2">Find exactly what you&apos;re looking for</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Link href={`/category/${cat.slug}`} className="group block">
              <div className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-sm">{cat.name}</p>
                  {cat._count && (
                    <p className="text-white/70 text-xs mt-0.5">{cat._count.products} products</p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
