import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const body = await req.json()
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        image: body.image,
        link: body.link || null,
        buttonText: body.buttonText || null,
        position: body.position,
        isActive: body.isActive,
      },
    })
    return NextResponse.json(banner)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
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
    await prisma.banner.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}
