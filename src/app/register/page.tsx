'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterInput } from '@/lib/validations'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema) as unknown as never,
  })

  async function onSubmit(data: RegisterInput) {
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json()
      setError(err.error || 'Registration failed')
      return
    }

    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-neutral-50">
      <div className="w-full max-w-md">
        <Link href="/" className="text-2xl font-bold text-neutral-900 block mb-8">LuxeShop</Link>

        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Create account</h2>
        <p className="text-neutral-500 mb-8">
          Already have an account?{' '}
          <Link href="/login" className="text-neutral-900 font-medium hover:underline">Sign in</Link>
        </p>

        <div className="bg-white rounded-2xl border border-neutral-100 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              required
              autoComplete="name"
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              required
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              required
              autoComplete="new-password"
              {...register('password')}
              error={errors.password?.message}
              helperText="At least 8 characters"
            />

            <Button fullWidth type="submit" size="lg" loading={isSubmitting}>
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
