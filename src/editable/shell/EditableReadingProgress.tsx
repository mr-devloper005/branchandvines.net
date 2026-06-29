'use client'

import { useEffect, useRef } from 'react'

/*
  Slim reading-progress bar pinned to the top of detail pages. Tracks scroll
  through the document and scales a single bar via the `--reading-progress`
  custom property (0 → 1). Pure presentation; safe if JS never runs (the bar
  simply stays at 0 width and is visually inert).
*/
export function EditableReadingProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = ref.current
    if (!bar) return
    let frame = 0
    const update = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0
      bar.style.setProperty('--reading-progress', String(progress))
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
      <div ref={ref} className="editable-progress h-full w-full bg-[var(--tk-accent,var(--slot4-accent))]" />
    </div>
  )
}
