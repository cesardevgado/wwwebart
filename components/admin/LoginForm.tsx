'use client'
import { useActionState } from 'react'
import { loginAction, type ActionState } from '@/app/admin/actions'
const initial: ActionState = {}
export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial)
  return <form action={action} className="mt-12"><label className="admin-label" htmlFor="password">Password</label><input className="admin-input" id="password" name="password" type="password" required autoComplete="current-password" autoFocus />{state.error && <p role="alert" className="mt-3 text-sm text-red-800">{state.error}</p>}<button className="admin-button mt-6 w-full" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button></form>
}
