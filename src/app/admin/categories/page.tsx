'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema, CategoryInput } from '@/lib/validations'
import { toast } from '@/components/ui/Toast'
import { slugify } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  isActive: boolean
  _count: { products: number }
  parent?: { name: string } | null
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema) as unknown as never,
  })

  const name = watch('name')

  async function fetchCategories() {
    setLoading(true)
    const res = await fetch('/api/admin/categories')
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  function openCreate() {
    reset({ isActive: true })
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(cat: Category) {
    reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      isActive: cat.isActive,
    })
    setEditing(cat)
    setModalOpen(true)
  }

  async function onSubmit(data: CategoryInput) {
    const url = editing ? `/api/admin/categories/${editing.id}` : '/api/admin/categories'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      toast(editing ? 'Category updated' : 'Category created', 'success')
      setModalOpen(false)
      fetchCategories()
    } else {
      const err = await res.json()
      toast(err.error || 'Failed', 'error')
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast('Category deleted', 'success')
      fetchCategories()
    } else {
      const err = await res.json()
      toast(err.error || 'Failed to delete', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Categories</h1>
          <p className="text-sm text-neutral-500 mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={18} />
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">No categories yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100">
              <tr>
                <th className="text-left p-4 font-medium text-neutral-500">Name</th>
                <th className="text-left p-4 font-medium text-neutral-500">Slug</th>
                <th className="text-left p-4 font-medium text-neutral-500">Products</th>
                <th className="text-left p-4 font-medium text-neutral-500">Status</th>
                <th className="text-right p-4 font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="p-4 font-medium text-neutral-900">{cat.name}</td>
                  <td className="p-4 text-neutral-500 font-mono text-xs">{cat.slug}</td>
                  <td className="p-4 text-neutral-600">{cat._count.products}</td>
                  <td className="p-4">
                    <Badge variant={cat.isActive ? 'success' : 'default'}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(cat)} className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'New Category'} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input
            label="Name"
            required
            {...register('name')}
            error={errors.name?.message}
            onChange={(e) => {
              register('name').onChange(e)
              if (!editing) setValue('slug', slugify(e.target.value))
            }}
          />
          <Input
            label="Slug"
            required
            {...register('slug')}
            error={errors.slug?.message}
          />
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={2}
              className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" {...register('isActive')} className="rounded" />
            <label htmlFor="isActive" className="text-sm text-neutral-700">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button fullWidth type="submit" loading={isSubmitting}>
              {editing ? 'Save' : 'Create'}
            </Button>
            <Button fullWidth variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
