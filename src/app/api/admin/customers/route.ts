import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = req.nextUrl
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = { role: 'customer' }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ]
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          _count: { select: { orders: true } },
          orders: {
            where: { paymentStatus: 'paid' },
            select: { total: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    const customersWithStats = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      createdAt: c.createdAt,
      _count: c._count,
      totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
    }))

    return NextResponse.json({ customers: customersWithStats, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
