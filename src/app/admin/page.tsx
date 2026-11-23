import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import { TrendingUp, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

export const metadata = { title: 'Dashboard' }

const statusColors: Record<string, 'default' | 'info' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'danger',
  refunded: 'danger',
}

export default async function AdminDashboard() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [
    monthRevenue,
    lastMonthRevenue,
    monthOrders,
    lastMonthOrders,
    totalCustomers,
    monthCustomers,
    lowStockProducts,
    recentOrders,
    pendingOrders,
  ] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: 'paid', createdAt: { gte: startOfMonth } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: 'paid', createdAt: { gte: startOfLastMonth, lt: startOfMonth } }, _sum: { total: true } }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
    prisma.user.count({ where: { role: 'customer' } }),
    prisma.user.count({ where: { role: 'customer', createdAt: { gte: startOfMonth } } }),
    prisma.product.findMany({ where: { status: 'active', stock: { lte: 5 } }, include: { images: { take: 1 } }, take: 5 }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { items: { select: { quantity: true } } },
    }),
    prisma.order.count({ where: { status: 'pending' } }),
  ])

  const revenueChange = lastMonthRevenue._sum.total
    ? ((((monthRevenue._sum.total ?? 0) - lastMonthRevenue._sum.total) / lastMonthRevenue._sum.total) * 100).toFixed(1)
    : null

  const ordersChange = lastMonthOrders > 0
    ? (((monthOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1)
    : null

  const stats = [
    {
      title: 'Monthly Revenue',
      value: formatPrice(monthRevenue._sum.total ?? 0),
      change: revenueChange,
      icon: TrendingUp,
      href: '/admin/orders',
    },
    {
      title: 'Monthly Orders',
      value: monthOrders.toString(),
      change: ordersChange,
      icon: ShoppingCart,
      href: '/admin/orders',
      badge: pendingOrders > 0 ? `${pendingOrders} pending` : undefined,
    },
    {
      title: 'Total Customers',
      value: totalCustomers.toString(),
      sub: `+${monthCustomers} this month`,
      icon: Users,
      href: '/admin/customers',
    },
    {
      title: 'Low Stock',
      value: lowStockProducts.length.toString(),
      sub: 'products need attention',
      icon: Package,
      href: '/admin/products',
      alert: lowStockProducts.length > 0,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening in your store.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="bg-white rounded-2xl p-6 border border-neutral-100 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.alert ? 'bg-red-100' : 'bg-neutral-100'}`}>
                <stat.icon size={20} className={stat.alert ? 'text-red-600' : 'text-neutral-600'} />
              </div>
              {stat.badge && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                  {stat.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
            {stat.change && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${parseFloat(stat.change) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {parseFloat(stat.change) >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{Math.abs(parseFloat(stat.change))}% vs last month</span>
              </div>
            )}
            {stat.sub && <p className="text-sm text-neutral-500 mt-2">{stat.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <div className="p-6 border-b border-neutral-50 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-neutral-500 hover:text-neutral-700">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-50">
                  <th className="text-left p-4 font-medium text-neutral-500">Order</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Customer</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Items</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Total</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Status</th>
                  <th className="text-left p-4 font-medium text-neutral-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-neutral-900 hover:text-neutral-600">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="p-4 text-neutral-600">{order.shippingName}</td>
                    <td className="p-4 text-neutral-600">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}
                    </td>
                    <td className="p-4 font-medium text-neutral-900">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <Badge variant={statusColors[order.status] ?? 'default'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-neutral-500">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <div className="p-6 border-b border-neutral-50 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Low Stock Alerts</h2>
            <Link href="/admin/products" className="text-sm text-neutral-500 hover:text-neutral-700">View all →</Link>
          </div>
          <div className="p-4 space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-center text-neutral-400 text-sm py-6">All products are well-stocked</p>
            ) : (
              lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-xl transition-colors"
                >
                  <div className="w-10 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900 truncate">{product.name}</p>
                    <p className={`text-xs ${product.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
