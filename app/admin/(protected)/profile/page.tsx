import { ProfileForm } from '@/components/admin/ProfileForm'
import { getProfile, getSocialLinks } from '@/db/queries'
export default function ProfilePage() {
  const profile = getProfile(); if (!profile) return <p>Run <code>npm run db:setup</code> to initialize the portfolio.</p>
  return <main><p className="text-xs uppercase tracking-[.12em] text-black/50">Profile</p><h1 className="mt-2 text-4xl font-medium tracking-[-.04em]">Artist information</h1><ProfileForm profile={profile} links={getSocialLinks(true).map(({ platform,label,url,enabled }) => ({ platform,label,url,enabled }))} /></main>
}
