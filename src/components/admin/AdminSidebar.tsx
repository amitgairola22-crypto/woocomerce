'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Ticket,
  Truck,
  Image,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/discounts', label: 'Discounts', icon: Ticket },
  { href: '/admin/shipping', label: 'Shipping', icon: Truck },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

interface AdminSidebarProps {
  userRole: string
  userName: string
  userEmail: string
}

export function AdminSidebar({ userRole, userName, userEmail }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const managerRestricted = ['banners', 'shipping', 'settings', 'categories']
  const isManager = userRole === 'manager'

  const visibleItems = navItems.filter((item) => {
    if (!isManager) return true
    return !managerRestricted.some((r) => item.href.includes(r))
  })

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-neutral-900 text-white flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-800">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-neutral-900 font-bold text-sm">L</span>
          </div>
          <div>
            <p className="font-bold text-white">LuxeShop</p>
            <p className="text-xs text-neutral-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-white text-neutral-900'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              )}
            >
              <item.icon size={18} className={active ? 'text-neutral-900' : 'text-neutral-400 group-hover:text-white'} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-medium">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-neutral-500 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
