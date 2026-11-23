'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { couponSchema, CouponInput } from '@/lib/validations'
import { toast } from '@/components/ui/Toast'
import { formatPrice, formatDate } from '@/lib/utils'

interface Coupon {
  id: string
  code: string
  description?: string | null
  type: string
  value: number
  minOrderValue: number
  usageLimit?: number | null
  usedCount: number
  isActive: boolean
  expiresAt?: string | null
  createdAt: string
}

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CouponInput>({
    resolver: zodResolver(couponSchema) as unknown as never,
    defaultValues: { type: 'percentage', value: 10, isActive: true },
  })

  async function fetchCoupons() {
    setLoading(true)
    const res = await fetch('/api/admin/discounts')
    const data = await res.json()
    setCoupons(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCoupons() }, [])

  function openCreate() {
    reset({ type: 'percentage', value: 10, isActive: true, minOrderValue: 0 })
    setEditing(null)
    setModalOpen(true)
  }

  async function onSubmit(data: CouponInput) {
    const url = editing ? `/api/admin/discounts/${editing.id}` : '/api/admin/discounts'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      toast(editing ? 'Coupon updated' : 'Coupon created', 'success')
      setModalOpen(false)
      fetchCoupons()
    } else {
      const err = await res.json()
      toast(err.error || 'Failed', 'error')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this coupon?')) return
    const res = await fetch(`/api/admin/discounts/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast('Coupon deleted', 'success')
      fetchCoupons()
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    toast(`Copied: ${code}`, 'success')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Discounts</h1>
          <p className="text-sm text-neutral-500 mt-1">{coupons.length} coupons</p>
        </div>
        <Button onClick={openCreate}><Plus size={18} />Add Coupon</Button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">No coupons yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100">
              <tr>
                <th className="text-left p-4 font-medium text-neutral-500">Code</th>
                <th className="text-left p-4 font-medium text-neutral-500">Type</th>
                <th className="text-left p-4 font-medium text-neutral-500">Value</th>
                <th className="text-left p-4 font-medium text-neutral-500">Usage</th>
                <th className="text-left p-4 font-medium text-neutral-500">Expires</th>
                <th className="text-left p-4 font-medium text-neutral-500">Status</th>
                <th className="text-right p-4 font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-neutral-900">{coupon.code}</span>
                      <button onClick={() => copyCode(coupon.code)} className="text-neutral-400 hover:text-neutral-600">
                        <Copy size={14} />
                      </button>
                    </div>
                    {coupon.description && <p className="text-xs text-neutral-500">{coupon.description}</p>}
                  </td>
                  <td className="p-4 capitalize text-neutral-600">{coupon.type.replace('_', ' ')}</td>
                  <td className="p-4 font-medium text-neutral-900">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : coupon.type === 'fixed' ? formatPrice(coupon.value) : 'Free'}
                  </td>
                  <td className="p-4 text-neutral-600">
                    {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                  </td>
                  <td className="p-4 text-neutral-500">
                    {coupon.expiresAt ? formatDate(coupon.expiresAt) : '—'}
                  </td>
                  <td className="p-4">
                    <Badge variant={coupon.isActive ? 'success' : 'default'}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { reset(coupon as CouponInput); setEditing(coupon); setModalOpen(true) }} className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(coupon.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Coupon' : 'New Coupon'} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input label="Code" required {...register('code')} error={errors.code?.message} className="font-mono" />
          <Input label="Description" {...register('description')} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">Type</label>
              <select {...register('type')} className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
            <Input label="Value" type="number" step="0.01" min="0" required {...register('value', { valueAsNumber: true })} error={errors.value?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Order" type="number" step="0.01" min="0" {...register('minOrderValue', { valueAsNumber: true })} prefix="$" />
            <Input label="Usage Limit" type="number" min="1" {...register('usageLimit', { valueAsNumber: true })} helperText="Leave blank for unlimited" />
          </div>
          <Input label="Expiry Date" type="date" {...register('expiresAt')} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" {...register('isActive')} className="rounded" />
            <label htmlFor="isActive" className="text-sm text-neutral-700">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button fullWidth type="submit" loading={isSubmitting}>{editing ? 'Save' : 'Create'}</Button>
            <Button fullWidth variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
