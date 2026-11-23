import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || 'active'
    const featured = searchParams.get('featured') === 'true'
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

    const where: Prisma.ProductWhereInput = {}

    if (status) where.status = status
    if (featured) where.featured = true
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ]
    }
    if (category) {
      where.category = { slug: category }
    }
    if (minPrice > 0 || maxPrice < 999999) {
      where.price = { gte: minPrice, lte: maxPrice }
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'price_asc' ? { price: 'asc' }
      : sort === 'price_desc' ? { price: 'desc' }
      : sort === 'featured' ? { featured: 'desc' }
      : { createdAt: 'desc' }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 2 },
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
