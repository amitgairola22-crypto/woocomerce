import Link from 'next/link'
import { Share2, Camera, MessageCircle, Play } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold">LuxeShop</h3>
            <p className="text-sm leading-relaxed">
              Premium fashion and lifestyle products curated for the modern individual.
            </p>
            <div className="flex gap-3">
              {[Share2, Camera, MessageCircle, Play].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {["Men's", "Women's", 'Accessories', 'Footwear', 'Sale', 'New Arrivals'].map((item) => (
                <li key={item}>
                  <Link href="/products" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Help</h4>
            <ul className="space-y-2.5 text-sm">
              {['FAQ', 'Shipping & Returns', 'Size Guide', 'Contact Us', 'Track Order', 'Store Locator'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm">Subscribe for exclusive offers, early access and style inspiration.</p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-neutral-900 font-medium text-sm py-2.5 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2024 LuxeShop. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
