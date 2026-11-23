import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/store/ProductDetail'
import { ProductCard } from '@/components/store/ProductCard'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true, images: { take: 1 } },
  })
  if (!product) return {}
  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: { images: product.images[0] ? [product.images[0].url] : [] },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug, status: 'active' },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true }, orderBy: { price: 'asc' } },
      attributes: true,
      category: true,
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  })

  if (!product) notFound()

  const relatedProducts = await prisma.product.findMany({
    where: {
      status: 'active',
      categoryId: product.categoryId ?? undefined,
      id: { not: product.id },
    },
    include: { images: { take: 1 } },
    take: 4,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductDetail product={product} />

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p, i) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                price={p.price}
                comparePrice={p.comparePrice}
                image={p.images[0]?.url}
                stock={p.stock}
                featured={p.featured}
                index={i}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
