'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '@/lib/validations'
import type { z } from 'zod'
type ProductInput = z.infer<typeof productSchema>
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { slugify } from '@/lib/utils'
import { Plus, X, Image as ImageIcon } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  categories: Category[]
  product?: ProductInput & {
    id?: string
    images?: { url: string; alt?: string | null }[]
  }
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product?.id
  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    product?.images?.map(i => ({ url: i.url, alt: i.alt ?? '' })) ?? []
  )
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: (product ?? {
      status: 'draft' as const,
      price: 0,
      stock: 0,
      trackStock: true,
      featured: false,
    }) as ProductInput,
  })

  const name = watch('name')

  async function onSubmit(data: ProductInput) {
    try {
      const url = isEdit ? `/api/admin/products/${product!.id}` : '/api/admin/products'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images }),
      })
      if (!res.ok) {
        const err = await res.json()
        toast(err.error || 'Failed to save product', 'error')
        return
      }
      toast(isEdit ? 'Product updated!' : 'Product created!', 'success')
      router.push('/admin/products')
      router.refresh()
    } catch {
      toast('Something went wrong', 'error')
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const { url } = await res.json()
        setImages(prev => [...prev, { url, alt: '' }])
        toast('Image uploaded', 'success')
      } else {
        toast('Failed to upload image', 'error')
      }
    } finally {
      setUploading(false)
    }
  }

  function addImageUrl() {
    if (!imageUrl.trim()) return
    setImages(prev => [...prev, { url: imageUrl.trim(), alt: '' }])
    setImageUrl('')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Basic Information</h2>
            <Input
              label="Product Name"
              required
              {...register('name')}
              error={errors.name?.message}
              onChange={(e) => {
                register('name').onChange(e)
                if (!isEdit) setValue('slug', slugify(e.target.value))
              }}
            />
            <Input
              label="Slug (URL)"
              required
              {...register('slug')}
              error={errors.slug?.message}
              helperText="Used in the product URL"
            />
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Short product description..."
                className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">Full Content</label>
              <textarea
                {...register('content')}
                rows={5}
                placeholder="Detailed product content..."
                className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Pricing</h2>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Price"
                type="number"
                step="0.01"
                min="0"
                required
                {...register('price', { valueAsNumber: true })}
                error={errors.price?.message}
                prefix="$"
              />
              <Input
                label="Compare Price"
                type="number"
                step="0.01"
                min="0"
                {...register('comparePrice', { valueAsNumber: true })}
                prefix="$"
                helperText="Original price"
              />
              <Input
                label="Cost Price"
                type="number"
                step="0.01"
                min="0"
                {...register('costPrice', { valueAsNumber: true })}
                prefix="$"
                helperText="Your cost"
              />
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="SKU" {...register('sku')} placeholder="e.g. SHIRT-BLK-M" />
              <Input
                label="Stock Quantity"
                type="number"
                min="0"
                {...register('stock', { valueAsNumber: true })}
                error={errors.stock?.message}
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="trackStock" {...register('trackStock')} className="rounded" />
              <label htmlFor="trackStock" className="text-sm text-neutral-700">Track inventory</label>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Images</h2>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group aspect-square bg-neutral-100 rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Paste image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={addImageUrl} size="sm">
                <Plus size={16} />
                Add URL
              </Button>
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="sr-only"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 border-2 border-dashed border-neutral-200 rounded-xl p-4 text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 cursor-pointer transition-colors"
              >
                <ImageIcon size={18} />
                {uploading ? 'Uploading...' : 'Upload from computer'}
              </label>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">SEO</h2>
            <Input
              label="Meta Title"
              {...register('metaTitle')}
              placeholder={name || 'Product title for search engines'}
            />
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">Meta Description</label>
              <textarea
                {...register('metaDesc')}
                rows={2}
                placeholder="Description shown in search results..."
                className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Status</h2>
            <select
              {...register('status')}
              className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" {...register('featured')} className="rounded" />
              <label htmlFor="featured" className="text-sm text-neutral-700">Featured product</label>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Category</h2>
            <select
              {...register('categoryId')}
              className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-3">
            <Button fullWidth type="submit" loading={isSubmitting}>
              {isEdit ? 'Save Changes' : 'Create Product'}
            </Button>
            <Button
              fullWidth
              variant="outline"
              type="button"
              onClick={() => router.push('/admin/products')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
