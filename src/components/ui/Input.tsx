'use client'

import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  error?: string
  helperText?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, prefix, suffix, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 text-neutral-400">{prefix}</div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full border rounded-md text-sm transition-colors placeholder:text-neutral-400',
              'focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent',
              'disabled:bg-neutral-50 disabled:cursor-not-allowed',
              error
                ? 'border-red-400 focus:ring-red-500'
                : 'border-neutral-200 hover:border-neutral-300',
              prefix ? 'pl-10' : 'pl-3',
              suffix ? 'pr-10' : 'pr-3',
              'py-2.5',
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 text-neutral-400">{suffix}</div>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {helperText && !error && <p className="text-xs text-neutral-500">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
