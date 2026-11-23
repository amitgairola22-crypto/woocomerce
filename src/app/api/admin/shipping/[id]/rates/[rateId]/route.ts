import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; rateId: string }> }
) {
  try {
    const session = await getSession()
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { rateId } = await params
    await prisma.shippingRate.delete({ where: { id: rateId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete rate' }, { status: 500 })
  }
}
