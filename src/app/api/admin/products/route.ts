import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = req.nextUrl
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (category) where.categoryId = category
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { take: 1, orderBy: { sortOrder: 'asc' } },
          category: { select: { id: true, name: true } },
          _count: { select: { orderItems: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('Admin products GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const result = productSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Validation error' }, { status: 400 })
    }

    const data = result.data
    const slug = data.slug || slugify(data.name)

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        images: body.images?.length
          ? { create: body.images.map((img: { url: string; alt?: string }, i: number) => ({ url: img.url, alt: img.alt, sortOrder: i })) }
          : undefined,
        attributes: body.attributes?.length
          ? { create: body.attributes.map((attr: { name: string; values: string[] }) => ({ name: attr.name, values: JSON.stringify(attr.values) })) }
          : undefined,
      },
      include: { images: true, attributes: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Admin products POST error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
