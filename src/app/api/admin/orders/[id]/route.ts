import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateOrderSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { include: { images: { take: 1 } } },
            variant: true,
          },
        },
        user: { select: { name: true, email: true, phone: true } },
      },
    })

    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(order)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
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
    const result = updateOrderSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Validation error' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id },
      data: result.data,
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
