import { prisma } from '@/lib/prisma'
import { ProductCatalog } from '@/components/store/ProductCatalog'
import type { Metadata } from 'next'

interface Props {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return { title: q ? `Search: ${q}` : 'Search' }
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams
  const q = sp.q || ''
  const page = parseInt(sp.page || '1')
  const sort = sp.sort || 'newest'
  const limit = 20

  const orderBy =
    sort === 'price_asc' ? { price: 'asc' as const }
    : sort === 'price_desc' ? { price: 'desc' as const }
    : { createdAt: 'desc' as const }

  const where = {
    status: 'active' as const,
    ...(q ? {
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
      ],
    } : {}),
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { take: 1 }, _count: { select: { reviews: true } } },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      select: { id: true, name: true, slug: true },
    }),
  ])

  return (
    <ProductCatalog
      initialProducts={products}
      total={total}
      page={page}
      categories={categories}
      currentCategory=""
      currentSort={sort}
      currentSearch={q}
    />
  )
}
