import { Header } from '@/components/store/Header'
import { Footer } from '@/components/store/Footer'
import { CartDrawer } from '@/components/store/CartDrawer'
import { SearchModal } from '@/components/store/SearchModal'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <CartDrawer />
      <SearchModal />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  )
}
