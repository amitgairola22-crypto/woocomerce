import { prisma } from '@/lib/prisma'
import { ProductCatalog } from '@/components/store/ProductCatalog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our full collection of premium products',
}

interface SearchParams {
  search?: string
  category?: string
  sort?: string
  page?: string
  minPrice?: string
  maxPrice?: string
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 20
  const search = params.search || ''
  const categorySlug = params.category || ''
  const sort = params.sort || 'newest'
  const minPrice = parseFloat(params.minPrice || '0')
  const maxPrice = parseFloat(params.maxPrice || '999999')

  const where: Record<string, unknown> = { status: 'active' }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ]
  }
  if (categorySlug) {
    where.category = { slug: categorySlug }
  }
  if (minPrice > 0 || maxPrice < 999999) {
    where.price = { gte: minPrice, lte: maxPrice }
  }

  const orderBy =
    sort === 'price_asc' ? { price: 'asc' as const }
    : sort === 'price_desc' ? { price: 'desc' as const }
    : sort === 'featured' ? { featured: 'desc' as const }
    : { createdAt: 'desc' as const }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        _count: { select: { reviews: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      select: { id: true, name: true, slug: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  return (
    <ProductCatalog
      initialProducts={products}
      total={total}
      page={page}
      categories={categories}
      currentCategory={categorySlug}
      currentSort={sort}
      currentSearch={search}
    />
  )
}
