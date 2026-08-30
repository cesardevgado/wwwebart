'use client'

import Link from 'next/link'
import { Home, UserRound } from 'lucide-react'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/', label: 'Catalog', icon: Home },
  { href: '/about', label: 'About', icon: UserRound },
]

export function BottomNav() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return (
    <nav aria-label="Primary navigation" className="fixed bottom-0 left-0 z-50 w-screen border-t border-[var(--divider)] bg-[color:var(--background)]/95 px-3 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <div className="mx-auto flex h-[var(--nav-height)] max-w-[800px] items-center justify-center gap-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex min-h-11 items-center gap-2 px-5 text-sm transition-colors ${active ? 'bg-[var(--foreground)] text-[var(--background)]' : 'hover:bg-black/5'}`}><Icon size={16} strokeWidth={1.7} aria-hidden="true" />{label}</Link>
        })}
      </div>
    </nav>
  )
}
