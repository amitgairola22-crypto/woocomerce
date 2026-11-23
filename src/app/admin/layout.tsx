import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin')
  }

  const role = (session.user as { role?: string }).role
  if (!role || !['admin', 'manager'].includes(role)) {
    redirect('/')
  }

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      <AdminSidebar userRole={role} userName={session.user.name ?? 'Admin'} userEmail={session.user.email ?? ''} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader userName={session.user.name ?? 'Admin'} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
