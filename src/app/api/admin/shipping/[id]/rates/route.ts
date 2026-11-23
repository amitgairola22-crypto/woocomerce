import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id: zoneId } = await params
    const { name, type, price, minOrderValue, isActive } = await req.json()
    const rate = await prisma.shippingRate.create({
      data: { zoneId, name, type, price: price ?? 0, minOrderValue: minOrderValue ?? null, isActive: isActive ?? true },
    })
    return NextResponse.json(rate, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create rate' }, { status: 500 })
  }
}
