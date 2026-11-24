import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAdminSession } from '@/lib/authHelpers'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Local filesystem is not available on Cloudflare Workers.
  // Images must be hosted externally (Unsplash, CDN, etc.) and added via URL.
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })

  return NextResponse.json(
    { error: 'Direct file upload is not supported on this deployment. Please paste an external image URL (e.g. from Unsplash or your CDN) using the "Add URL" field.' },
    { status: 501 }
  )
}
