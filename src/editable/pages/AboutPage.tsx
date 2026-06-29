import Link from 'next/link'
import { ArrowRight, Bookmark, Compass, Library, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { Ads } from '@/lib/ads'

const valueIcons = [Compass, Library, Sparkles]

export default function AboutPage() {
  const about = pagesContent.about
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[var(--editable-border)]">
          <div className="pointer-events-none absolute inset-x-0 -top-32 h-80 bg-[radial-gradient(50%_60%_at_50%_0%,var(--slot4-accent-soft),transparent_72%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-6 lg:px-8 lg:py-28" data-reveal>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              <span className="h-px w-6 bg-[var(--slot4-accent)]/50" /> {about.badge}
            </span>
            <h1 className="editable-display mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
              {about.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">{about.description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-110">
                Browse collections <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-sm font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
                Suggest a resource
              </Link>
            </div>
          </div>
        </section>

        {/* Story + values */}
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <article data-reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--slot4-accent)]">
              <Bookmark className="h-3.5 w-3.5" /> The library
            </span>
            <div className="mt-6 space-y-5 text-[1.0625rem] leading-8 text-[var(--slot4-muted-text)]">
              {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
          <aside className="space-y-4">
            {about.values.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length]
              return (
                <div
                  key={value.title}
                  data-reveal
                  style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
                  className="rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(22,33,28,0.08)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]"><Icon className="h-5 w-5" /></span>
                  <h2 className="editable-display mt-4 text-xl font-semibold tracking-[-0.01em]">{value.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                </div>
              )
            })}
          </aside>
        </section>
        {/* CTA */}
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[1.6rem] border border-[var(--editable-border)] bg-[var(--slot4-dark-bg)] px-6 py-14 text-center text-[var(--slot4-dark-text)] sm:px-12" data-reveal>
            <h2 className="editable-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">Start exploring {SITE_CONFIG.name}.</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--slot4-dark-text)]/70">Dive into curated collections, or add the links worth keeping to the shelves.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--slot4-dark-bg)] transition hover:brightness-95">Browse the library <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">Search resources</Link>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
