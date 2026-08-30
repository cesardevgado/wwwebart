'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ArtworkControls({ previous, next }: { previous?: { slug: string; title: string }; next?: { slug: string; title: string } }) {
  const router = useRouter()
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') router.push('/')
      if (event.key === 'ArrowLeft' && previous) router.push(`/artwork/${previous.slug}`)
      if (event.key === 'ArrowRight' && next) router.push(`/artwork/${next.slug}`)
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [next, previous, router])
  return <div className="mt-16 grid grid-cols-2 border-y border-[var(--divider)] text-sm">
    <div className="border-r border-[var(--divider)]">{previous && <Link href={`/artwork/${previous.slug}`} className="flex min-h-20 items-center gap-2 py-4 pr-4"><ArrowLeft size={16} aria-hidden="true" /><span><small className="block text-[10px] uppercase tracking-widest text-black/50">Previous</small>{previous.title}</span></Link>}</div>
    <div>{next && <Link href={`/artwork/${next.slug}`} className="flex min-h-20 items-center justify-end gap-2 py-4 pl-4 text-right"><span><small className="block text-[10px] uppercase tracking-widest text-black/50">Next</small>{next.title}</span><ArrowRight size={16} aria-hidden="true" /></Link>}</div>
  </div>
}
