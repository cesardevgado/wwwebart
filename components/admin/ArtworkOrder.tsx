'use client'
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { reorderArtworksAction } from '@/app/admin/actions'

type Row = { id: number; title: string; year: number; status: 'draft' | 'published' }
export function ArtworkOrder({ initialRows }: { initialRows: Row[] }) {
  const [rows,setRows] = useState(initialRows); const [pending,start] = useTransition(); const [dragged,setDragged] = useState<number|null>(null)
  const persist = (next: Row[]) => { setRows(next); start(() => reorderArtworksAction(next.map((r) => r.id))) }
  const move = (index:number,offset:number) => { const target=index+offset;if(target<0||target>=rows.length)return;const next=[...rows];[next[index],next[target]]=[next[target],next[index]];persist(next) }
  const drop = (targetId:number) => { if(dragged===null||dragged===targetId)return;const next=[...rows];const from=next.findIndex(r=>r.id===dragged);const to=next.findIndex(r=>r.id===targetId);const [item]=next.splice(from,1);next.splice(to,0,item);persist(next);setDragged(null) }
  return <div className="mt-8 border-t border-[var(--divider)]" aria-busy={pending}>{rows.map((row,index) => <div key={row.id} draggable onDragStart={() => setDragged(row.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => drop(row.id)} className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 border-b border-[var(--divider)] py-4 text-sm"><GripVertical size={17} className="cursor-grab text-black/45" aria-hidden="true" /><span>{row.title}<small className="ml-3 text-black/45">{row.year}</small></span><span className="capitalize text-black/55 max-sm:hidden">{row.status}</span><div className="flex"><button aria-label={`Move ${row.title} up`} onClick={() => move(index,-1)} className="p-2"><ArrowUp size={16} /></button><button aria-label={`Move ${row.title} down`} onClick={() => move(index,1)} className="p-2"><ArrowDown size={16} /></button></div><Link href={`/admin/artworks/${row.id}`} className="underline underline-offset-4">Edit</Link></div>)}</div>
}
