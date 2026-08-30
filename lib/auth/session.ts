import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE = 'portfolio_admin'
const duration = 60 * 60 * 24 * 7
function secret() {
  const value = process.env.SESSION_SECRET
  if (!value || value.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters.')
  return value
}
function signature(payload: string) { return createHmac('sha256', secret()).update(payload).digest('base64url') }
export function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({ admin: true, exp: Math.floor(Date.now() / 1000) + duration })).toString('base64url')
  return `${payload}.${signature(payload)}`
}
export function verifySessionToken(token?: string) {
  try {
    if (!token) return false
    const [payload, supplied] = token.split('.'); const expected = signature(payload)
    if (!supplied || supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return false
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return data.admin === true && data.exp > Date.now() / 1000
  } catch { return false }
}

export async function createSession() {
  const store = await cookies()
  store.set(COOKIE, createSessionToken(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: duration })
}
export async function destroySession() { (await cookies()).delete(COOKIE) }
export async function isAuthenticated() {
  return verifySessionToken((await cookies()).get(COOKIE)?.value)
}
export async function requireAdmin() { if (!(await isAuthenticated())) redirect('/admin/login') }
