import { auth } from './auth'
import type { Session } from 'next-auth'

export type AuthSession = Session | null

export async function getSession(): Promise<AuthSession> {
  return auth() as Promise<AuthSession>
}

export function isAdminSession(session: AuthSession): boolean {
  return !!(session?.user && ['admin', 'manager'].includes((session.user as { role?: string }).role ?? ''))
}

export function isSuperAdmin(session: AuthSession): boolean {
  return !!(session?.user && (session.user as { role?: string }).role === 'admin')
}
