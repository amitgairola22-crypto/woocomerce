'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingBag, Search, User, Menu, X, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useUIStore } from '@/store/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Shop', href: '/products' },
  { label: 'Collections', href: '/collections' },
  { label: 'Sale', href: '/products?sort=featured' },
  { label: 'About', href: '/about' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const totalItems = useCartStore((s) => s.getTotalItems())
  const { openCart, openMobileMenu, mobileMenuOpen, closeMobileMenu, openSearch } = useUIStore()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Use 0 on server to avoid hydration mismatch with persisted localStorage cart
  const displayCount = mounted ? totalItems : 0

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-neutral-100'
            : 'bg-white/90 backdrop-blur-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="font-bold text-xl tracking-tight text-neutral-900">
              LuxeShop
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={openSearch}
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link
                href="/account/wishlist"
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>
              <Link
                href="/account"
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Account"
              >
                <User size={20} />
              </Link>
              <button
                onClick={openCart}
                className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label={`Cart (${displayCount} items)`}
              >
                <ShoppingBag size={20} />
                {displayCount > 0 && (
                  <span className="absolute top-0 right-0 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {displayCount > 99 ? '99+' : displayCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={mobileMenuOpen ? closeMobileMenu : openMobileMenu}
                className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors ml-1"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-30 bg-white border-b border-neutral-100 shadow-lg md:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="py-3 px-2 text-base font-medium text-neutral-700 hover:text-neutral-900 border-b border-neutral-50 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
