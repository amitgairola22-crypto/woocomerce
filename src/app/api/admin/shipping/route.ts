import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const zones = await prisma.shippingZone.findMany({
      include: { rates: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(zones)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { name, countries } = await req.json()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const zone = await prisma.shippingZone.create({
      data: {
        name,
        countries: JSON.stringify(
          countries ? countries.split(',').map((c: string) => c.trim()).filter(Boolean) : []
        ),
      },
      include: { rates: true },
    })
    return NextResponse.json(zone, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create zone' }, { status: 500 })
  }
}
