import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'
import { ProductCard } from '@/components/store/ProductCard'

export const metadata = { title: 'Wishlist' }

export default async function WishlistPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/account/wishlist')

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account" className="text-neutral-500 hover:text-neutral-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={64} className="text-neutral-200 mx-auto mb-4" />
          <p className="text-lg font-medium text-neutral-900">Your wishlist is empty</p>
          <p className="text-neutral-500 mt-1">Save items you love to come back to later</p>
          <Link href="/products" className="inline-block mt-6 bg-neutral-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item, i) => (
            <ProductCard
              key={item.id}
              id={item.product.id}
              name={item.product.name}
              slug={item.product.slug}
              price={item.product.price}
              comparePrice={item.product.comparePrice}
              image={item.product.images[0]?.url}
              stock={item.product.stock}
              featured={item.product.featured}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  )
}
