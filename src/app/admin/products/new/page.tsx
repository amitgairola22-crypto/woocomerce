import { ProductForm } from '@/components/admin/ProductForm'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'Add Product' }

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Add Product</h1>
        <p className="text-sm text-neutral-500 mt-1">Create a new product listing</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
