import { NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(startOfToday)
    startOfWeek.setDate(startOfWeek.getDate() - 7)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      todayRevenue, weekRevenue, monthRevenue, totalRevenue,
      pendingOrders, processingOrders, shippedOrders, totalOrders,
      totalCustomers, monthCustomers, recentOrders,
    ] = await Promise.all([
      prisma.order.aggregate({ where: { paymentStatus: 'paid', createdAt: { gte: startOfToday } }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { paymentStatus: 'paid', createdAt: { gte: startOfWeek } }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { paymentStatus: 'paid', createdAt: { gte: startOfMonth } }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { paymentStatus: 'paid' }, _sum: { total: true } }),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'processing' } }),
      prisma.order.count({ where: { status: 'shipped' } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.user.count({ where: { role: 'customer', createdAt: { gte: startOfMonth } } }),
      prisma.order.findMany({
        take: 10, orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: { select: { name: true } } } }, user: { select: { name: true, email: true } } },
      }),
    ])

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    })

    const topProductDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { images: { take: 1 } },
        })
        return {
          id: item.productId,
          name: product?.name ?? 'Unknown',
          slug: product?.slug ?? '',
          image: product?.images[0]?.url,
          totalSold: item._sum.quantity ?? 0,
          revenue: item._sum.total ?? 0,
        }
      })
    )

    return NextResponse.json({
      revenue: { today: todayRevenue._sum.total ?? 0, week: weekRevenue._sum.total ?? 0, month: monthRevenue._sum.total ?? 0, total: totalRevenue._sum.total ?? 0 },
      orders: { pending: pendingOrders, processing: processingOrders, shipped: shippedOrders, total: totalOrders },
      customers: { total: totalCustomers, thisMonth: monthCustomers },
      topProducts: topProductDetails,
      recentOrders,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
