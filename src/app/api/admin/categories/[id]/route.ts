import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validations'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const body = await req.json()
    const result = categorySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Validation error' }, { status: 400 })
    }

    const category = await prisma.category.update({
      where: { id },
      data: result.data,
    })
    return NextResponse.json(category)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
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

    const count = await prisma.product.count({ where: { categoryId: id } })
    if (count > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${count} products assigned to this category` },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
