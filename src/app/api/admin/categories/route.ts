import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET() {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
        children: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const result = categorySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Validation error' }, { status: 400 })
    }

    const data = result.data
    const slug = data.slug || slugify(data.name)

    const category = await prisma.category.create({
      data: { ...data, slug },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
