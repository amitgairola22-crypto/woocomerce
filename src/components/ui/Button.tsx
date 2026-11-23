'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

    const variants = {
      primary: 'bg-neutral-900 text-white hover:bg-neutral-700 focus:ring-neutral-900',
      secondary: 'bg-white text-neutral-900 border border-neutral-900 hover:bg-neutral-50 focus:ring-neutral-900',
      ghost: 'text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-900',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
      outline: 'border border-neutral-200 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 focus:ring-neutral-900',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm rounded',
      md: 'h-10 px-5 text-sm rounded-md',
      lg: 'h-12 px-8 text-base rounded-md',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
