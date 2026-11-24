import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Browse all our curated fashion collections',
}

export default async function CollectionsPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { products: { where: { status: 'active' } } } },
    },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-neutral-900">Collections</h1>
        <p className="text-neutral-500 mt-2 text-lg">Curated styles for every occasion</p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">No collections yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[4/3] flex items-end"
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
              )}
              <div className="relative z-10 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
                <h2 className="text-xl font-bold text-white">{cat.name}</h2>
                <p className="text-sm text-white/80 mt-1">
                  {cat._count.products} {cat._count.products === 1 ? 'product' : 'products'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
