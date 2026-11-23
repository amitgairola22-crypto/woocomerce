import { NextRequest, NextResponse } from 'next/server'
import { getSession, isSuperAdmin } from '@/lib/authHelpers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!isSuperAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const settings = await prisma.siteSetting.findMany()
    const result: Record<string, string> = {}
    settings.forEach((s) => { result[s.key] = s.value })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!isSuperAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json() as Record<string, string>

    await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
