import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductCatalog } from '@/components/store/ProductCatalog'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) return {}
  return {
    title: category.name,
    description: category.description ?? `Shop ${category.name}`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const page = parseInt(sp.page || '1')
  const sort = sp.sort || 'newest'
  const limit = 20

  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
  })

  if (!category) notFound()

  const orderBy =
    sort === 'price_asc' ? { price: 'asc' as const }
    : sort === 'price_desc' ? { price: 'desc' as const }
    : sort === 'featured' ? { featured: 'desc' as const }
    : { createdAt: 'desc' as const }

  const where = { status: 'active' as const, categoryId: category.id }

  const [products, total, allCategories] = await Promise.all([
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
      categories={allCategories}
      currentCategory={slug}
      currentSort={sort}
      currentSearch=""
    />
  )
}
