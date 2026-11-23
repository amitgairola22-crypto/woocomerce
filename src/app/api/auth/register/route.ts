import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { registerSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? 'Validation error' },
        { status: 400 }
      )
    }

    const { name, email, password } = result.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: 'customer' },
      select: { id: true, name: true, email: true, role: true },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
