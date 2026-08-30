'use client'

import { useEffect, useRef } from 'react'

export function InteractiveArtwork({ variant = 'orbit', title }: { variant?: string; title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame = 0, raf = 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const draw = () => {
      const rect = canvas.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio, 2)
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr; ctx.scale(dpr, dpr)
      ctx.fillStyle = variant === 'signal' ? '#12120f' : '#ebe9e1'; ctx.fillRect(0, 0, rect.width, rect.height)
      const t = reduce ? 30 : frame * .008
      for (let i = 0; i < 90; i++) {
        const angle = i * .47 + t; const radius = (i / 90) * Math.min(rect.width, rect.height) * .43
        const x = rect.width / 2 + Math.cos(angle * (variant === 'signal' ? 2.1 : 1)) * radius
        const y = rect.height / 2 + Math.sin(angle * 1.17) * radius
        ctx.beginPath(); ctx.arc(x, y, 1.5 + (i % 8) * .7, 0, Math.PI * 2)
        ctx.fillStyle = variant === 'signal' ? `rgba(238,68,34,${.25 + i / 130})` : `rgba(15,35,190,${.2 + i / 125})`; ctx.fill()
      }
      frame++; if (!reduce) raf = requestAnimationFrame(draw)
    }
    draw(); const observer = new ResizeObserver(draw); observer.observe(canvas)
    return () => { cancelAnimationFrame(raf); observer.disconnect() }
  }, [variant])
  return <canvas ref={canvasRef} className="h-full w-full" role="img" aria-label={`${title}, an animated field of orbiting points`} />
}
