import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about LuxeShop — our story, values, and commitment to premium fashion.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-neutral-900 mb-4">Our Story</h1>
        <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
          LuxeShop was built for people who believe that great style shouldn&apos;t compromise on quality or values.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-neutral-900 text-white rounded-3xl p-10 mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-neutral-300 leading-relaxed text-lg">
          We curate premium fashion and lifestyle products from independent designers and sustainable brands,
          making elevated style accessible without the luxury markup. Every piece in our collection is selected
          for quality, craftsmanship, and timeless appeal.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            title: 'Quality First',
            description: 'Every product is carefully vetted for materials, construction, and durability before it reaches our shelves.',
          },
          {
            title: 'Sustainable Style',
            description: "We prioritise brands that care about their environmental footprint — because fashion shouldn't cost the earth.",
          },
          {
            title: 'Honest Pricing',
            description: 'No inflated retail markups. We price fairly so you get genuine value on every order.',
          },
        ].map((value) => (
          <div key={value.title} className="bg-white border border-neutral-100 rounded-2xl p-6">
            <h3 className="font-bold text-neutral-900 text-lg mb-2">{value.title}</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">{value.description}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[
          { value: '500+', label: 'Products' },
          { value: '50+', label: 'Brands' },
          { value: '10K+', label: 'Happy Customers' },
          { value: '4.9★', label: 'Average Rating' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
            <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to explore?</h2>
        <div className="flex gap-4 justify-center">
          <Link
            href="/products"
            className="bg-neutral-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-neutral-700 transition-colors"
          >
            Shop Now
          </Link>
          <Link
            href="/collections"
            className="border border-neutral-200 text-neutral-700 px-8 py-3 rounded-xl font-medium hover:border-neutral-400 transition-colors"
          >
            View Collections
          </Link>
        </div>
      </div>
    </div>
  )
}
