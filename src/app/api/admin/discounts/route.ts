import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'
import { couponSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(coupons)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const result = couponSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Validation error' }, { status: 400 })
    }

    const data = result.data
    const coupon = await prisma.coupon.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
  }
}
