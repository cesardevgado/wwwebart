'use client'
import { useState } from 'react'
import { deleteArtworkAction } from '@/app/admin/actions'
export function DeleteArtwork({ id, title }: { id: number; title: string }) {
  const [open, setOpen] = useState(false)
  if (!open) return <button type="button" className="admin-button danger mt-12" onClick={() => setOpen(true)}>Delete artwork</button>
  return <div role="alertdialog" aria-labelledby="delete-title" className="mt-12 border border-red-800 p-5"><h2 id="delete-title" className="text-xl">Delete artwork?</h2><p className="mt-2 text-sm">This permanently removes “{title}”. Locally uploaded media is also deleted.</p><div className="mt-5 flex gap-2"><button className="admin-button secondary" onClick={() => setOpen(false)}>Cancel</button><form action={deleteArtworkAction.bind(null,id)}><button className="admin-button danger">Delete</button></form></div></div>
}
