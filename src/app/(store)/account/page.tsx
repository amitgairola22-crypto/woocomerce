import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { Package, MapPin, Heart, Settings } from 'lucide-react'

const statusColors: Record<string, 'default' | 'info' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'danger',
}

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/account')
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { items: { select: { quantity: true, name: true } } },
  })

  const links = [
    { label: 'Orders', description: 'Track and manage your orders', icon: Package, href: '/account/orders' },
    { label: 'Addresses', description: 'Manage your shipping addresses', icon: MapPin, href: '/account/addresses' },
    { label: 'Wishlist', description: 'Your saved products', icon: Heart, href: '/account/wishlist' },
    { label: 'Settings', description: 'Update your profile and password', icon: Settings, href: '/account/settings' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">My Account</h1>
        <p className="text-neutral-500 mt-1">Welcome back, {session.user.name || session.user.email}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="bg-white border border-neutral-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
              <link.icon size={22} className="text-neutral-600" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">{link.label}</p>
              <p className="text-sm text-neutral-500">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {orders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm text-neutral-500 hover:text-neutral-700">View all →</Link>
          </div>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-neutral-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                  <p className="text-sm text-neutral-500">{formatDate(order.createdAt)} · {order.items.reduce((s, i) => s + i.quantity, 0)} items</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={statusColors[order.status] ?? 'default'}>{order.status}</Badge>
                  <span className="font-semibold text-neutral-900">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
