'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/*
  Global, fail-safe scroll-reveal.

  Renders nothing. On mount it arms the CSS reveal system by adding
  `.reveal-ready` to <html>, then observes every `[data-reveal]` element and
  adds `.reveal-in` as it scrolls into view. Because the hidden state only
  applies under `.reveal-ready` (set by JS), content is always visible when JS
  is disabled or hydration is interrupted. Re-runs on every route change so
  freshly mounted server content also reveals.
*/
export function EditableReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduce || !('IntersectionObserver' in window)) {
      // No motion: make sure nothing stays hidden.
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('reveal-in'))
      return
    }

    root.classList.add('reveal-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.reveal-in)'))
    // Anything already on screen at load reveals immediately (no pop-in flash).
    for (const el of elements) {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.92) el.classList.add('reveal-in')
      else observer.observe(el)
    }

    // Safety net: if anything is still hidden after a beat, reveal it.
    const timer = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.reveal-in)').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight) el.classList.add('reveal-in')
      })
    }, 1200)

    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [pathname])

  return null
}
