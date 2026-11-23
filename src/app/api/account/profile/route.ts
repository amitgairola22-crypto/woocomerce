import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name } = await req.json()
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: { id: true, name: true, email: true },
    })
    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
