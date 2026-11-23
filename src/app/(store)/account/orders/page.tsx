import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { ArrowLeft, Package } from 'lucide-react'

const statusColors: Record<string, 'default' | 'info' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'danger',
  refunded: 'danger',
}

export const metadata = { title: 'My Orders' }

export default async function AccountOrdersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/account/orders')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: { include: { images: { take: 1 } } } },
      },
    },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account" className="text-neutral-500 hover:text-neutral-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="text-neutral-200 mx-auto mb-4" />
          <p className="text-lg font-medium text-neutral-900">No orders yet</p>
          <p className="text-neutral-500 mt-1">Start shopping to see your orders here</p>
          <Link href="/products" className="inline-block mt-6 bg-neutral-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-neutral-50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-neutral-900">{order.orderNumber}</p>
                  <p className="text-sm text-neutral-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusColors[order.status] ?? 'default'}>{order.status}</Badge>
                  <span className="font-semibold text-neutral-900">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                      <p className="text-xs text-neutral-500">Qty: {item.quantity} · {formatPrice(item.price)}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>
              {order.trackingNumber && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-neutral-500">
                    Tracking: <span className="font-medium text-neutral-900">{order.trackingNumber}</span>
                    {order.trackingUrl && (
                      <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">Track</a>
                    )}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
