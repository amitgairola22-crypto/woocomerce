import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const validateSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = validateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { code, subtotal } = result.data

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'Coupon is inactive' }, { status: 400 })
    }

    const now = new Date()
    if (coupon.startsAt && coupon.startsAt > now) {
      return NextResponse.json({ error: 'Coupon is not yet active' }, { status: 400 })
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 })
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 })
    }

    if (subtotal < coupon.minOrderValue) {
      return NextResponse.json(
        { error: `Minimum order value is $${coupon.minOrderValue.toFixed(2)}` },
        { status: 400 }
      )
    }

    let discountAmount = 0
    if (coupon.type === 'percentage') {
      discountAmount = (subtotal * coupon.value) / 100
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount)
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.min(coupon.value, subtotal)
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: discountAmount,
      description: coupon.description,
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 })
  }
}
