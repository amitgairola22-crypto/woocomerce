import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'
import { couponSchema } from '@/lib/validations'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const body = await req.json()
    const result = couponSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Validation error' }, { status: 400 })
    }

    const data = result.data
    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        code: data.code.toUpperCase(),
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    })
    return NextResponse.json(coupon)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 })
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
    await prisma.coupon.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 })
  }
}
