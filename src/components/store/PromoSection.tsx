'use client'

import { motion } from 'framer-motion'
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react'

const perks = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Your data is protected',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Always here to help',
  },
]

export function PromoSection() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {perks.map((perk, i) => (
          <motion.div
            key={perk.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4">
              <perk.icon size={24} className="text-neutral-700" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-1">{perk.title}</h3>
            <p className="text-sm text-neutral-500">{perk.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
