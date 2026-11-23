'use client'

import { create } from 'zustand'

interface UIStore {
  cartOpen: boolean
  mobileMenuOpen: boolean
  searchOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  openMobileMenu: () => void
  closeMobileMenu: () => void
  openSearch: () => void
  closeSearch: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  cartOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,

  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),

  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),

  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
}))
