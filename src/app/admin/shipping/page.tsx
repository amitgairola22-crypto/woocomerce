'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { toast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils'

interface ShippingRate {
  id: string
  name: string
  type: string
  price: number
  minOrderValue?: number | null
  isActive: boolean
}

interface ShippingZone {
  id: string
  name: string
  countries: string
  rates: ShippingRate[]
}

export default function AdminShippingPage() {
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [loading, setLoading] = useState(true)
  const [zoneModal, setZoneModal] = useState(false)
  const [rateModal, setRateModal] = useState<string | null>(null) // zoneId
  const [zoneName, setZoneName] = useState('')
  const [zoneCountries, setZoneCountries] = useState('')
  const [rateName, setRateName] = useState('')
  const [rateType, setRateType] = useState('flat')
  const [ratePrice, setRatePrice] = useState('')
  const [rateMinOrder, setRateMinOrder] = useState('')
  const [saving, setSaving] = useState(false)

  async function fetchZones() {
    setLoading(true)
    const res = await fetch('/api/admin/shipping')
    const data = await res.json()
    setZones(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchZones() }, [])

  async function createZone() {
    if (!zoneName.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: zoneName, countries: zoneCountries }),
    })
    setSaving(false)
    if (res.ok) {
      toast('Zone created', 'success')
      setZoneModal(false)
      setZoneName('')
      setZoneCountries('')
      fetchZones()
    } else {
      toast('Failed to create zone', 'error')
    }
  }

  async function addRate(zoneId: string) {
    if (!rateName.trim()) return
    setSaving(true)
    const res = await fetch(`/api/admin/shipping/${zoneId}/rates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: rateName,
        type: rateType,
        price: parseFloat(ratePrice) || 0,
        minOrderValue: rateMinOrder ? parseFloat(rateMinOrder) : null,
        isActive: true,
      }),
    })
    setSaving(false)
    if (res.ok) {
      toast('Rate added', 'success')
      setRateModal(null)
      setRateName(''); setRateType('flat'); setRatePrice(''); setRateMinOrder('')
      fetchZones()
    } else {
      toast('Failed to add rate', 'error')
    }
  }

  async function deleteZone(id: string) {
    if (!confirm('Delete this shipping zone?')) return
    const res = await fetch(`/api/admin/shipping/${id}`, { method: 'DELETE' })
    if (res.ok) { toast('Zone deleted', 'success'); fetchZones() }
    else toast('Failed to delete', 'error')
  }

  async function deleteRate(zoneId: string, rateId: string) {
    if (!confirm('Delete this rate?')) return
    const res = await fetch(`/api/admin/shipping/${zoneId}/rates/${rateId}`, { method: 'DELETE' })
    if (res.ok) { toast('Rate deleted', 'success'); fetchZones() }
    else toast('Failed to delete', 'error')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Shipping</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage shipping zones and rates</p>
        </div>
        <Button onClick={() => setZoneModal(true)}><Plus size={18} />Add Zone</Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-neutral-400">Loading...</div>
      ) : zones.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center text-neutral-400">
          No shipping zones yet. Add one to get started.
        </div>
      ) : (
        <div className="space-y-6">
          {zones.map((zone) => (
            <div key={zone.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
              <div className="p-5 border-b border-neutral-50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-900">{zone.name}</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    {(() => { try { return (JSON.parse(zone.countries) as string[]).join(', ') } catch { return zone.countries } })()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setRateModal(zone.id)}>
                    <Plus size={14} />Add Rate
                  </Button>
                  <button onClick={() => deleteZone(zone.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {zone.rates.length === 0 ? (
                <div className="p-4 text-center text-sm text-neutral-400">No rates yet — add one above</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b border-neutral-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-neutral-500">Name</th>
                      <th className="text-left p-4 font-medium text-neutral-500">Type</th>
                      <th className="text-left p-4 font-medium text-neutral-500">Price</th>
                      <th className="text-left p-4 font-medium text-neutral-500">Min Order</th>
                      <th className="text-right p-4 font-medium text-neutral-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zone.rates.map((rate) => (
                      <tr key={rate.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                        <td className="p-4 font-medium text-neutral-900">{rate.name}</td>
                        <td className="p-4 capitalize text-neutral-600">{rate.type}</td>
                        <td className="p-4 text-neutral-900">{rate.type === 'free' ? 'Free' : formatPrice(rate.price)}</td>
                        <td className="p-4 text-neutral-600">{rate.minOrderValue ? formatPrice(rate.minOrderValue) : '—'}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => deleteRate(zone.id, rate.id)} className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Zone Modal */}
      <Modal open={zoneModal} onClose={() => setZoneModal(false)} title="New Shipping Zone" size="sm">
        <div className="p-6 space-y-4">
          <Input label="Zone Name" placeholder="e.g. United States" value={zoneName} onChange={(e) => setZoneName(e.target.value)} required />
          <Input label="Countries (comma-separated codes)" placeholder="US, CA, MX" value={zoneCountries} onChange={(e) => setZoneCountries(e.target.value)} helperText="e.g. US, GB, AU" />
          <div className="flex gap-3">
            <Button fullWidth onClick={createZone} loading={saving}>Create Zone</Button>
            <Button fullWidth variant="outline" onClick={() => setZoneModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Rate Modal */}
      <Modal open={!!rateModal} onClose={() => setRateModal(null)} title="Add Shipping Rate" size="sm">
        <div className="p-6 space-y-4">
          <Input label="Rate Name" placeholder="e.g. Standard Shipping" value={rateName} onChange={(e) => setRateName(e.target.value)} required />
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1">Type</label>
            <select value={rateType} onChange={(e) => setRateType(e.target.value)} className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900">
              <option value="flat">Flat Rate</option>
              <option value="free">Free Shipping</option>
              <option value="weight">Weight Based</option>
            </select>
          </div>
          {rateType !== 'free' && (
            <Input label="Price" type="number" step="0.01" min="0" prefix="$" value={ratePrice} onChange={(e) => setRatePrice(e.target.value)} />
          )}
          <Input label="Min Order Value (optional)" type="number" step="0.01" min="0" prefix="$" value={rateMinOrder} onChange={(e) => setRateMinOrder(e.target.value)} helperText="Leave blank for no minimum" />
          <div className="flex gap-3">
            <Button fullWidth onClick={() => rateModal && addRate(rateModal)} loading={saving}>Add Rate</Button>
            <Button fullWidth variant="outline" onClick={() => setRateModal(null)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
