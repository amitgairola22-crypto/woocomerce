import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        attributes: true,
        category: true,
      },
    })

    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const body = await req.json()
    const result = productSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Validation error' }, { status: 400 })
    }

    const data = result.data
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : null,
      },
      include: { images: true, variants: true, attributes: true },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    await prisma.product.update({
      where: { id },
      data: { status: 'archived' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
