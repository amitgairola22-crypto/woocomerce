'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'

export default function AccountSettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState(session?.user?.name ?? '')
  const [saving, setSaving] = useState(false)

  if (!session?.user) {
    router.push('/login?callbackUrl=/account/settings')
    return null
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        await update({ name })
        toast('Profile updated', 'success')
      } else {
        toast('Failed to update profile', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account" className="text-neutral-500 hover:text-neutral-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Account Settings</h1>
      </div>

      <div className="bg-white border border-neutral-100 rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-neutral-900">Profile</h2>
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          value={session.user.email ?? ''}
          disabled
          helperText="Email cannot be changed"
        />
        <Button onClick={handleSave} loading={saving}>Save Changes</Button>
      </div>
    </div>
  )
}
