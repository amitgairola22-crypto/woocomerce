'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, ExternalLink } from 'lucide-react'

function getBreadcrumb(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  return parts.map((part, i) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1),
    href: '/' + parts.slice(0, i + 1).join('/'),
  }))
}

export function AdminHeader({ userName }: { userName: string }) {
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumb(pathname)

  return (
    <header className="bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-2">
            {i > 0 && <span className="text-neutral-300">/</span>}
            <Link
              href={crumb.href}
              className={i === breadcrumbs.length - 1 ? 'font-medium text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}
            >
              {crumb.label}
            </Link>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <ExternalLink size={16} />
          <span className="hidden sm:inline">View Store</span>
        </Link>
        <button className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
          <Bell size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-white text-sm font-medium">
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
