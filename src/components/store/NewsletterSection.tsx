'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-neutral-900 py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-neutral-400 mb-8">
            Subscribe for exclusive deals, early access to new arrivals, and style inspiration.
          </p>

          {submitted ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
              <p className="text-green-400 font-medium">
                Thanks for subscribing! You&apos;re on the list. 🎉
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-white"
              />
              <Button type="submit" loading={loading} className="bg-white text-neutral-900 hover:bg-neutral-100 whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          )}
          <p className="text-neutral-600 text-xs mt-4">
            No spam. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
