import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = z.object({ email: z.string().email() }).safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    await prisma.newsletter.upsert({
      where: { email: result.data.email },
      update: { isActive: true },
      create: { email: result.data.email },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
