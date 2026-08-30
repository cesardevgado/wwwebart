import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowUpRight, Mail } from 'lucide-react'
import { getProfile, getSocialLinks } from '@/db/queries'

export const metadata: Metadata = { title: 'About', alternates: { canonical: '/about' } }
export default function AboutPage() {
  const profile = getProfile(); const links = getSocialLinks()
  return <main className="page-shell">
    <header><h1 className="display-title">{profile?.artistName ?? 'Artist Name'}</h1><p className="eyebrow">{profile?.subtitle}</p></header>
    {profile?.portraitPath && <figure className="relative mt-16 aspect-[4/5] w-full overflow-hidden bg-[#ddd]"><Image src={profile.portraitPath} alt={`${profile.artistName} in the studio`} fill priority unoptimized={profile.portraitPath.startsWith('/media/')} sizes="(max-width: 840px) 100vw, 800px" className="object-cover" /></figure>}
    <div className="prose-copy mt-14">{profile?.bio.split(/\n\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    <ul className="mt-14 border-t border-[var(--divider)] text-sm">
      {links.map((link) => <li key={link.id} className="border-b border-[var(--divider)]"><a href={link.url} target={link.platform === 'email' ? undefined : '_blank'} rel="noreferrer" className="group flex min-h-14 items-center justify-between"><span className="group-hover:underline group-hover:underline-offset-4">{link.label}</span>{link.platform === 'email' ? <Mail size={15} aria-hidden="true" /> : <ArrowUpRight size={15} aria-hidden="true" />}</a></li>)}
    </ul>
  </main>
}
