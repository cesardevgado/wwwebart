'use client'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

type LinkItem = { platform: string; label: string; url: string; enabled: boolean }
export function SocialLinksEditor({ initialLinks }: { initialLinks: LinkItem[] }) {
  const [links, setLinks] = useState(initialLinks)
  const update = (index: number, patch: Partial<LinkItem>) => setLinks((all) => all.map((item, i) => i === index ? { ...item, ...patch } : item))
  const move = (index: number, direction: -1 | 1) => setLinks((all) => { const copy = [...all]; const target = index + direction; if (target < 0 || target >= copy.length) return all; [copy[index], copy[target]] = [copy[target], copy[index]]; return copy })
  return <fieldset className="mt-14"><legend className="text-xl">Social and contact links</legend><input type="hidden" name="linksJson" value={JSON.stringify(links)} />
    <div className="mt-5 space-y-3">{links.map((link, index) => <div key={index} className="grid grid-cols-[110px_1fr_auto] gap-2 border-t border-[var(--divider)] pt-3 max-sm:grid-cols-1">
      <select aria-label={`Platform for link ${index + 1}`} className="admin-input" value={link.platform} onChange={(e) => update(index, { platform: e.target.value })}><option>website</option><option>github</option><option>instagram</option><option>x</option><option>bluesky</option><option>mastodon</option><option>vimeo</option><option>youtube</option><option>email</option><option>other</option></select>
      <div className="grid grid-cols-2 gap-2"><input aria-label={`Label for link ${index + 1}`} className="admin-input" placeholder="Label" value={link.label} onChange={(e) => update(index, { label: e.target.value })} /><input aria-label={`URL for link ${index + 1}`} className="admin-input" placeholder="URL or mailto:" value={link.url} onChange={(e) => update(index, { url: e.target.value })} /></div>
      <div className="flex items-center gap-1"><label className="mr-2 flex items-center gap-1 text-xs"><input type="checkbox" checked={link.enabled} onChange={(e) => update(index, { enabled: e.target.checked })} /> On</label><button type="button" aria-label="Move link up" onClick={() => move(index,-1)}><ArrowUp size={17} /></button><button type="button" aria-label="Move link down" onClick={() => move(index,1)}><ArrowDown size={17} /></button><button type="button" aria-label="Remove link" onClick={() => setLinks(links.filter((_, i) => i !== index))}><Trash2 size={17} /></button></div>
    </div>)}</div><button type="button" className="admin-button secondary mt-4" onClick={() => setLinks([...links, { platform: 'other', label: '', url: '', enabled: true }])}><Plus size={15} />Add link</button>
  </fieldset>
}
