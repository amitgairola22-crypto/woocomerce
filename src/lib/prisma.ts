import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'
import { cache } from 'react'

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

// In production (Cloudflare Workers): React cache() creates a fresh Prisma instance
// per request. This prevents "Cannot perform I/O on behalf of a different request"
// which occurs because Pool WebSocket connections are bound to the request context
// that created them and cannot be reused across concurrent requests.
//
// In development: use a global singleton to avoid exhausting local connections.
const getRequestClient =
  process.env.NODE_ENV !== 'production'
    ? () => (globalForPrisma.prisma ??= createPrismaClient())
    : cache(createPrismaClient)

// Proxy delegates all property access to the per-request client.
// All existing `import { prisma }` usages work without any changes.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getRequestClient()
    const value = (client as any)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})
