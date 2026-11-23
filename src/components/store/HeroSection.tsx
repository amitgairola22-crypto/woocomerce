'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Banner {
  id: string
  title: string
  subtitle?: string | null
  image: string
  link?: string | null
  buttonText?: string | null
}

export function HeroSection({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  if (banners.length === 0) {
    return (
      <section className="relative h-[70vh] min-h-[500px] bg-neutral-100 flex items-center justify-center">
        <div className="text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6"
          >
            New Season
            <br />
            <span className="text-neutral-500">Arrivals</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-neutral-600 mb-8"
          >
            Discover the latest trends in premium fashion
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/products">
              <Button size="lg">Shop Now</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    )
  }

  const banner = banners[current]

  return (
    <section className="relative h-[80vh] min-h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-xl">
          <motion.h1
            key={`title-${current}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
          >
            {banner.title}
          </motion.h1>
          {banner.subtitle && (
            <motion.p
              key={`sub-${current}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-white/80 mb-8"
            >
              {banner.subtitle}
            </motion.p>
          )}
          {banner.link && (
            <motion.div
              key={`btn-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link href={banner.link}>
                <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                  {banner.buttonText || 'Shop Now'}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </section>
  )
}
