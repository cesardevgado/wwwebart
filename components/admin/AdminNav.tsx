import Link from 'next/link'
import { logoutAction } from '@/app/admin/actions'

export function AdminNav() {
  return <header className="mb-16 flex flex-wrap items-center justify-between gap-5 border-b border-[var(--divider)] pb-5">
    <Link href="/admin" className="text-xs font-bold tracking-[.18em]">ADMIN</Link>
    <nav aria-label="Admin navigation" className="flex items-center gap-5 text-sm"><Link href="/admin/profile">Profile</Link><Link href="/admin/artworks">Artworks</Link><form action={logoutAction}><button className="underline underline-offset-4">Log out</button></form></nav>
  </header>
}
