'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginInput } from '@/lib/validations'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema) as unknown as never,
  })

  async function onSubmit(data: LoginInput) {
    setError('')
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-md">
      <Link href="/" className="text-2xl font-bold text-neutral-900 block mb-8">LuxeShop</Link>

      <h2 className="text-2xl font-bold text-neutral-900 mb-2">Sign in</h2>
      <p className="text-neutral-500 mb-8">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-neutral-900 font-medium hover:underline">Create one</Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

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
          type={showPass ? 'text' : 'password'}
          required
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
          suffix={
            <button type="button" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <Button fullWidth type="submit" size="lg" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-500">
          Demo admin: admin@store.com / admin123
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:flex-1 bg-neutral-900 items-center justify-center relative overflow-hidden">
        <div className="text-center px-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome back</h1>
          <p className="text-neutral-400 text-lg">Sign in to access your account, track orders, and discover new arrivals.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <Suspense fallback={<div className="text-neutral-400">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
