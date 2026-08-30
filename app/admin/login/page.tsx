import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin/LoginForm'
import { isAuthenticated } from '@/lib/auth/session'
export default async function LoginPage() {
  if (await isAuthenticated()) redirect('/admin')
  return <main className="mx-auto flex min-h-dvh w-[min(100%-40px,420px)] flex-col justify-center py-16"><p className="text-xs font-bold tracking-[.18em]">ADMIN</p><h1 className="mt-4 text-4xl font-medium tracking-[-.04em]">Portfolio access</h1><LoginForm /><a href="/" className="mt-8 text-center text-sm underline underline-offset-4">Return to catalog</a></main>
}
