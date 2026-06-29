'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Mail, Send, CheckCircle2, Star } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'

const footer = globalContent.footer

export function EditableFooter() {
  const year = new Date().getFullYear()
  const [subscribed, setSubscribed] = useState(false)

  // Presentational only — no backend wiring is added here.
  const onSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubscribed(true)
  }

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1.1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
              
              <span className="editable-display text-2xl font-semibold tracking-[-0.01em]">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[var(--editable-footer-text)]/65">{footer.description}</p>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--editable-footer-text)]/80 transition hover:text-white"
            >
              <Mail className="h-4 w-4" /> {SITE_CONFIG.domain}
            </a>
          </div>

          {/* Curated link columns */}
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-accent)] brightness-150">
                {column.title}
              </h3>
              <div className="mt-5 grid gap-3">
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--editable-footer-text)]/70 transition hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Newsletter / CTA */}
          <div>
            <h3 className="editable-display text-lg font-semibold tracking-[-0.01em]">{footer.newsletter.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--editable-footer-text)]/65">{footer.newsletter.description}</p>
            {subscribed ? (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent)] brightness-150" /> You’re on the list.
              </p>
            ) : (
              <form onSubmit={onSubscribe} className="mt-5 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 pl-4">
                <input
                  type="email"
                  required
                  placeholder={footer.newsletter.placeholder}
                  aria-label="Email address"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                />
                <button
                  type="submit"
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[var(--slot4-accent)] px-4 text-[13px] font-semibold text-white transition hover:brightness-110"
                >
                  <Send className="h-3.5 w-3.5" /> {footer.newsletter.cta}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Star rating + giant brand wordmark (Nevire signature) */}
      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 pt-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-[var(--slot4-accent)] text-[var(--slot4-accent)]" />
              ))}
            </span>
            <span className="text-sm font-medium text-[var(--editable-footer-text)]/70">Trusted by curators worldwide</span>
          </div>
        </div>
        <div className="overflow-hidden">
          <p className="editable-display select-none whitespace-nowrap px-4 pb-4 pt-6 text-center text-[20vw] font-semibold leading-[0.8] tracking-[-0.04em] text-[var(--editable-footer-text)]/10 sm:px-6 lg:px-8 lg:text-[15rem]">
            {SITE_CONFIG.name}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-[var(--editable-footer-text)]/55 sm:flex-row sm:px-6 lg:px-8">
          <span>© {year} {SITE_CONFIG.name}. {footer.bottomNote}</span>
          <div className="flex items-center gap-5">
            <Link href="/about" className="transition hover:text-white">About</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
            <Link href="/search" className="transition hover:text-white">Search</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
