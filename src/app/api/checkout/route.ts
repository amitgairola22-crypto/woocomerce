import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/authHelpers'
import { generateOrderNumber } from '@/lib/utils'
import { z } from 'zod'

const checkoutItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
  name: z.string(),
  image: z.string().optional(),
})

const checkoutBodySchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  shippingName: z.string().min(1),
  shippingEmail: z.string().email(),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().min(1),
  shippingCity: z.string().min(1),
  shippingState: z.string().optional(),
  shippingZip: z.string().min(1),
  shippingCountry: z.string().min(2),
  couponCode: z.string().optional(),
  couponDiscount: z.number().min(0).default(0),
  subtotal: z.number().min(0),
  total: z.number().min(0),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    const body = await req.json()

    const result = checkoutBodySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Validation error' }, { status: 400 })
    }

    const data = result.data

    for (const item of data.items) {
      if (item.variantId) {
        const variant = await prisma.productVariant.findUnique({ where: { id: item.variantId } })
        if (!variant || variant.stock < item.quantity) {
          return NextResponse.json({ error: `Insufficient stock for ${item.name}` }, { status: 400 })
        }
      } else {
        const product = await prisma.product.findUnique({ where: { id: item.productId } })
        if (!product || product.stock < item.quantity) {
          return NextResponse.json({ error: `Insufficient stock for ${item.name}` }, { status: 400 })
        }
      }
    }

    const orderNumber = generateOrderNumber()
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'demo',
        subtotal: data.subtotal,
        discount: data.couponDiscount,
        shipping: 0,
        tax: 0,
        total: data.total,
        couponCode: data.couponCode,
        couponDiscount: data.couponDiscount,
        shippingName: data.shippingName,
        shippingEmail: data.shippingEmail,
        shippingPhone: data.shippingPhone,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingState: data.shippingState,
        shippingZip: data.shippingZip,
        shippingCountry: data.shippingCountry,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
        },
      },
    })

    for (const item of data.items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        })
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }
    }

    if (data.couponCode) {
      await prisma.coupon.update({
        where: { code: data.couponCode },
        data: { usedCount: { increment: 1 } },
      }).catch(() => null)
    }

    if (session?.user?.id) {
      await prisma.cartItem.deleteMany({ where: { userId: session.user.id } }).catch(() => null)
    }

    return NextResponse.json({ orderNumber: order.orderNumber, orderId: order.id }, { status: 201 })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
