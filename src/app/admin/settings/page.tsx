'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => { setSettings(data); setLoading(false) })
  }, [])

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    if (res.ok) {
      toast('Settings saved', 'success')
    } else {
      toast('Failed to save settings', 'error')
    }
  }

  if (loading) return <div className="p-12 text-center text-neutral-400">Loading...</div>

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">Configure your store settings</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
        <h2 className="font-semibold text-neutral-900">General</h2>
        {[
          { key: 'store_name', label: 'Store Name' },
          { key: 'store_tagline', label: 'Tagline' },
          { key: 'store_email', label: 'Contact Email' },
          { key: 'store_phone', label: 'Contact Phone' },
        ].map(({ key, label }) => (
          <Input
            key={key}
            label={label}
            value={settings[key] || ''}
            onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
        <h2 className="font-semibold text-neutral-900">Currency</h2>
        {[
          { key: 'currency_code', label: 'Currency Code (e.g. USD)' },
          { key: 'currency_symbol', label: 'Currency Symbol (e.g. $)' },
        ].map(({ key, label }) => (
          <Input
            key={key}
            label={label}
            value={settings[key] || ''}
            onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
          />
        ))}
      </div>

      <Button onClick={handleSave} loading={saving}>Save Settings</Button>
    </div>
  )
}
