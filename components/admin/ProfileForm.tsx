'use client'
import { useActionState } from 'react'
import { saveProfileAction, type ActionState } from '@/app/admin/actions'
import { SocialLinksEditor } from './SocialLinksEditor'

type Profile = { artistName: string; subtitle: string; bio: string }
type LinkItem = { platform: string; label: string; url: string; enabled: boolean }
export function ProfileForm({ profile, links }: { profile: Profile; links: LinkItem[] }) {
  const [state, action, pending] = useActionState(saveProfileAction, {} as ActionState)
  return <form action={action} encType="multipart/form-data" className="mt-10 space-y-7">
    <div><label className="admin-label" htmlFor="artistName">Artist name</label><input className="admin-input" id="artistName" name="artistName" defaultValue={profile.artistName} required /></div>
    <div><label className="admin-label" htmlFor="subtitle">Subtitle / tagline</label><input className="admin-input" id="subtitle" name="subtitle" defaultValue={profile.subtitle} /></div>
    <div><label className="admin-label" htmlFor="bio">Biography</label><textarea className="admin-input" id="bio" name="bio" defaultValue={profile.bio} rows={10} /></div>
    <div><label className="admin-label" htmlFor="portrait">Replace portrait</label><input className="admin-input pt-3" id="portrait" name="portrait" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" /><p className="mt-2 text-xs text-black/55">Leave empty to keep the current portrait.</p></div>
    <SocialLinksEditor initialLinks={links} />
    {state.error && <p role="alert" className="text-sm text-red-800">{state.error}</p>}{state.success && <p role="status" className="text-sm text-green-800">{state.success}</p>}
    <button className="admin-button" disabled={pending}>{pending ? 'Saving…' : 'Save profile'}</button>
  </form>
}
