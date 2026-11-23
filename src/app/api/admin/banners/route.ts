import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const banners = await prisma.banner.findMany({ orderBy: [{ position: 'asc' }, { sortOrder: 'asc' }] })
    return NextResponse.json(banners)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const body = await req.json()
    const banner = await prisma.banner.create({
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        image: body.image,
        link: body.link || null,
        buttonText: body.buttonText || null,
        position: body.position ?? 'hero',
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    })
    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 })
  }
}
