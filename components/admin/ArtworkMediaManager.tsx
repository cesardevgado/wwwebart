'use client'

import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from 'lucide-react'
import { useActionState, useEffect, useState, useTransition } from 'react'
import { addArtworkMediaAction, deleteArtworkMediaAction, reorderArtworkMediaAction, type ActionState } from '@/app/admin/actions'
import { MediaPreview } from './MediaPreview'
import { MediaUploadFields } from './MediaUploadFields'

type Item = { id: number; type: 'image' | 'video' | 'iframe'; path: string; altText: string | null }
export function ArtworkMediaManager({ artworkId, initialItems, cloudUploads = false }: { artworkId: number; initialItems: Item[]; cloudUploads?: boolean }) {
  const [items, setItems] = useState(initialItems); const [type, setType] = useState<Item['type']>('image'); const [pending, start] = useTransition(); const [dragged, setDragged] = useState<number | null>(null)
  useEffect(() => setItems(initialItems), [initialItems])
  const [state, action, adding] = useActionState(addArtworkMediaAction.bind(null, artworkId), {} as ActionState)
  const persist = (next: Item[]) => { setItems(next); start(() => reorderArtworkMediaAction(artworkId, next.map((item) => item.id))) }
  const move = (index: number, offset: number) => { const target=index+offset;if(target<0||target>=items.length)return;const next=[...items];[next[index],next[target]]=[next[target],next[index]];persist(next) }
  const drop = (targetId: number) => { if(dragged===null||dragged===targetId)return;const next=[...items];const from=next.findIndex(i=>i.id===dragged);const to=next.findIndex(i=>i.id===targetId);const [item]=next.splice(from,1);next.splice(to,0,item);persist(next);setDragged(null) }
  return <section className="mt-16 border-t border-[var(--divider)] pt-8">
    <h2 className="text-2xl font-medium tracking-[-.03em]">Additional Media</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/55">Add any combination of images, videos, and iframe artworks. These appear after the primary media in this order on the public artwork page.</p>
    <div className="mt-7 border-t border-[var(--divider)]" aria-busy={pending}>{items.length === 0 && <p className="border-b border-[var(--divider)] py-5 text-sm text-black/50">No additional media yet.</p>}{items.map((item,index) => <div key={item.id} draggable onDragStart={() => setDragged(item.id)} onDragEnd={() => setDragged(null)} onDragOver={(e) => e.preventDefault()} onDrop={() => drop(item.id)} className="grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-[var(--divider)] py-3 text-sm max-sm:gap-2">
      <GripVertical size={17} className="cursor-grab text-black/40" /><MediaPreview src={item.path} type={item.type} alt={item.altText || `Additional ${item.type} ${index + 1}`} compact /><div className="min-w-0"><p className="text-xs uppercase tracking-wider text-black/50">{item.type}</p><p className="mt-1 truncate" title={item.path}>{item.altText || item.path}</p></div><div className="flex max-sm:flex-col"><div className="flex"><button type="button" aria-label="Move media up" className="p-2" onClick={() => move(index,-1)}><ArrowUp size={16} /></button><button type="button" aria-label="Move media down" className="p-2" onClick={() => move(index,1)}><ArrowDown size={16} /></button></div><button type="button" aria-label="Delete media" className="p-2 text-red-800" onClick={() => { if(window.confirm('Remove this media item? Uploaded files will also be deleted.')) start(async () => { await deleteArtworkMediaAction(item.id); setItems((all) => all.filter((entry) => entry.id !== item.id)) }) }}><Trash2 size={16} /></button></div>
    </div>)}</div>
    <form action={action} encType="multipart/form-data" onReset={() => setType('image')} className="mt-9 border border-[var(--divider)] bg-white p-5"><h3 className="text-lg">Add media</h3><div className="admin-grid mt-5"><div><label className="admin-label" htmlFor="mediaType">Type</label><select className="admin-input" id="mediaType" name="mediaType" value={type} onChange={(e) => setType(e.target.value as Item['type'])}><option value="image">Image</option><option value="video">Video</option><option value="iframe">Iframe</option></select></div>{type === 'iframe' && <div><label className="admin-label" htmlFor="mediaItemUrl">Iframe URL</label><input className="admin-input" id="mediaItemUrl" name="mediaItemUrl" placeholder="https://…" /></div>}{type === 'image' && <div><label className="admin-label" htmlFor="mediaItemAlt">Alternative text</label><input className="admin-input" id="mediaItemAlt" name="mediaItemAlt" /></div>}</div>
      {type !== 'iframe' && <div className="mt-5"><MediaUploadFields key={type} type={type} cloudUploads={cloudUploads} fileId="mediaItemFile" fileName="mediaItemFile" uploadedFieldName="uploadedMediaItemUrl" urlId="mediaItemUrl" urlName="mediaItemUrl" uploadLabel="Upload file" /></div>}
      {type === 'video' && <div className="mt-5 flex flex-wrap gap-6 text-sm">{[['mediaAutoplay','Autoplay'],['mediaMuted','Muted'],['mediaLoop','Loop'],['mediaControls','Controls']].map(([name,label]) => <label key={name} className="flex items-center gap-2"><input type="checkbox" name={name} defaultChecked />{label}</label>)}</div>}
      {state.error && <p role="alert" className="mt-4 text-sm text-red-800">{state.error}</p>}{state.success && <p role="status" className="mt-4 text-sm text-green-800">{state.success}</p>}<button className="admin-button mt-5" disabled={adding}><Plus size={16} />{adding ? 'Adding…' : 'Add to artwork'}</button>
    </form>
  </section>
}
