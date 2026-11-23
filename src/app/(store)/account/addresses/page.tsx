import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export const metadata = { title: 'My Addresses' }

export default async function AddressesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/account/addresses')

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account" className="text-neutral-500 hover:text-neutral-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Saved Addresses</h1>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin size={48} className="text-neutral-200 mx-auto mb-4" />
          <p className="font-medium text-neutral-900">No saved addresses</p>
          <p className="text-sm text-neutral-500 mt-1">Addresses saved during checkout will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white border border-neutral-100 rounded-2xl p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-neutral-900">{addr.name}</p>
                  {addr.isDefault && <Badge variant="success">Default</Badge>}
                </div>
                <p className="text-sm text-neutral-600">{addr.address}</p>
                <p className="text-sm text-neutral-600">{addr.city}, {addr.state} {addr.zip}</p>
                <p className="text-sm text-neutral-600">{addr.country}</p>
                {addr.phone && <p className="text-sm text-neutral-500 mt-1">{addr.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
