export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/store/HeroSection'
import { FeaturedProducts } from '@/components/store/FeaturedProducts'
import { CategoryGrid } from '@/components/store/CategoryGrid'
import { PromoSection } from '@/components/store/PromoSection'
import { NewsletterSection } from '@/components/store/NewsletterSection'

export default async function HomePage() {
  const [banners, featuredProducts, categories] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true, position: 'hero' },
      orderBy: { sortOrder: 'asc' },
      take: 3,
    }),
    prisma.product.findMany({
      where: { status: 'active', featured: true },
      include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    }),
  ])

  return (
    <>
      <HeroSection banners={banners} />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <PromoSection />
      <NewsletterSection />
    </>
  )
}
