'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { toast } from '@/components/ui/Toast'

interface Banner {
  id: string
  title: string
  subtitle?: string | null
  image: string
  link?: string | null
  buttonText?: string | null
  position: string
  sortOrder: number
  isActive: boolean
}

const defaultForm = { title: '', subtitle: '', image: '', link: '', buttonText: 'Shop Now', position: 'hero', isActive: true }

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [saving, setSaving] = useState(false)

  async function fetchBanners() {
    setLoading(true)
    const res = await fetch('/api/admin/banners')
    const data = await res.json()
    setBanners(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchBanners() }, [])

  function openCreate() {
    setForm(defaultForm)
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(b: Banner) {
    setForm({ title: b.title, subtitle: b.subtitle ?? '', image: b.image, link: b.link ?? '', buttonText: b.buttonText ?? 'Shop Now', position: b.position, isActive: b.isActive })
    setEditing(b)
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.title || !form.image) { toast('Title and image are required', 'error'); return }
    setSaving(true)
    const url = editing ? `/api/admin/banners/${editing.id}` : '/api/admin/banners'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    if (res.ok) { toast(editing ? 'Banner updated' : 'Banner created', 'success'); setModalOpen(false); fetchBanners() }
    else toast('Failed to save', 'error')
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this banner?')) return
    const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
    if (res.ok) { toast('Banner deleted', 'success'); fetchBanners() }
    else toast('Failed to delete', 'error')
  }

  async function toggleActive(banner: Banner) {
    const res = await fetch(`/api/admin/banners/${banner.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
    })
    if (res.ok) fetchBanners()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Banners</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage homepage and promotional banners</p>
        </div>
        <Button onClick={openCreate}><Plus size={18} />Add Banner</Button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading...</div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">No banners yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100">
              <tr>
                <th className="text-left p-4 font-medium text-neutral-500">Banner</th>
                <th className="text-left p-4 font-medium text-neutral-500">Position</th>
                <th className="text-left p-4 font-medium text-neutral-500">Status</th>
                <th className="text-right p-4 font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{banner.title}</p>
                        {banner.subtitle && <p className="text-xs text-neutral-500 mt-0.5">{banner.subtitle}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 capitalize text-neutral-600">{banner.position}</td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(banner)}>
                      <Badge variant={banner.isActive ? 'success' : 'default'}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(banner)} className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(banner.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Banner' : 'New Banner'} size="lg">
        <div className="p-6 space-y-4">
          <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          <Input label="Image URL" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} helperText="Paste an image URL (Unsplash, CDN, etc.)" />
          {form.image && (
            <div className="w-full h-32 bg-neutral-100 rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Link URL" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/products" />
            <Input label="Button Text" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} placeholder="Shop Now" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1">Position</label>
            <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900">
              <option value="hero">Hero (Homepage Slider)</option>
              <option value="promo">Promotional Strip</option>
              <option value="category">Category Banner</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActiveBanner" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
            <label htmlFor="isActiveBanner" className="text-sm text-neutral-700">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button fullWidth onClick={handleSave} loading={saving}>{editing ? 'Save' : 'Create'}</Button>
            <Button fullWidth variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
