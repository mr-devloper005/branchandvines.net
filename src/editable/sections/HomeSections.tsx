import type { CSSProperties } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Bookmark, BookOpen, Compass, FolderOpen, Globe, Hash,
  Layers, Library, Link2, Search, Sparkles, Star, Tag,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const home = pagesContent.home
const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

// Stagger helper for the scroll-reveal system (typed custom property).
const revealDelay = (ms: number): CSSProperties => ({ '--reveal-delay': `${ms}ms` } as CSSProperties)

/* ------------------------------ data helpers ----------------------------- */
function contentOf(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
}

function getExcerpt(post?: SitePost | null, limit = 140) {
  const content = contentOf(post)
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.note === 'string' && content.note) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = contentOf(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function urlOf(post?: SitePost | null) {
  const content = contentOf(post)
  for (const key of ['website', 'url', 'link', 'source']) {
    const value = content[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function domainOf(url: string) {
  return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '')
}

function slugifyTopic(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function latestPostImages(posts: SitePost[], max = 8) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

/* ------------------------------ small atoms ------------------------------ */
function Eyebrow({ children, num }: { children: React.ReactNode; num?: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-accent)]">
      {num ? (
        <span className="font-mono tabular-nums text-[var(--slot4-accent)]">[{num}]</span>
      ) : (
        <span className="h-px w-6 bg-[var(--slot4-accent)]/50" />
      )}
      {children}
    </span>
  )
}

function SourceChip({ url }: { url: string }) {
  if (!url) return null
  const domain = domainOf(url)
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--slot4-muted-text)]">
      <Globe className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
      <span className="truncate">{domain}</span>
    </span>
  )
}

/* --------------------------- marquee (Nevire) ---------------------------- */
function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null
  const loop = [...items, ...items]
  return (
    <div className="editable-marquee-track overflow-hidden border-y border-[var(--editable-border)] bg-[var(--slot4-warm)] py-5" aria-hidden="true">
      <div className="editable-marquee">
        {loop.map((item, i) => (
          <span key={i} className="editable-display mx-5 inline-flex items-center gap-5 whitespace-nowrap text-2xl font-semibold uppercase tracking-[0.04em] text-[var(--slot4-page-text)] sm:mx-8 sm:gap-8 sm:text-[2rem]">
            {item}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
          </span>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------- HERO ---------------------------------- */
export function EditableHomeHero({ posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestPostImages(pool)
  const heroTitle = home.hero.title

  // Topic chips from real saved-post categories, linking into the collection archive.
  const topics = Array.from(
    new Set(pool.map((post) => categoryOf(post)).filter((value): value is string => Boolean(value)))
  ).slice(0, 6)

  // Real-data metrics for the agency-style stat band.
  const topicCount = new Set(pool.map((post) => categoryOf(post)).filter(Boolean)).size
  const heroStats = [
    { value: `${Math.max(pool.length, 1)}+`, label: 'Resources on the shelves' },
    { value: `${Math.max(topicCount, 1)}`, label: 'Topics & collections' },
    { value: '100%', label: 'Reviewed before it’s saved' },
    { value: 'Weekly', label: 'Fresh saves added' },
  ]

  // Marquee phrases — brand-neutral curation words + real topics.
  const marqueeItems = ['Curated links', 'Saved resources', 'Worth keeping', 'Collections', 'Discover more', ...topics.slice(0, 4)]

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(50%_60%_at_70%_0%,var(--slot4-accent-soft),transparent_70%)]" />

      <div className={`relative grid items-end gap-12 pt-16 pb-12 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24 ${container}`}>
        <div data-reveal>
          {/* meta row: bracketed label + discipline line */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Eyebrow num="00">{home.hero.badge}</Eyebrow>
            <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-soft-muted-text)]">
              Save — Curate — Discover
            </span>
          </div>

          <h1 className="editable-hero-title editable-display mt-7 text-balance text-[2.9rem] font-semibold leading-[0.98] sm:text-[4.5rem] lg:text-[5.25rem]">
            {heroTitle.map((line, index) => (
              <span key={line} className={index === 1 ? 'block text-[var(--slot4-accent)]' : 'block'}>
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--slot4-muted-text)]">{home.hero.description}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <Link href={home.hero.primaryCta.href} className="group inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-110">
              {home.hero.primaryCta.label}
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href={home.hero.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
              <Search className="h-4 w-4" /> {home.hero.secondaryCta.label}
            </Link>
          </div>

          {topics.length ? (
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">Topics</span>
              {topics.map((topic) => (
                <Link
                  key={topic}
                  href={`/sbm?category=${slugifyTopic(topic)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border)] px-3.5 py-1.5 text-xs font-medium text-[var(--slot4-muted-text)] transition hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                >
                  <Hash className="h-3 w-3" /> {topic}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {/* Featured image panel */}
        <div data-reveal style={revealDelay(120)} className="relative">
          <div className="relative overflow-hidden rounded-[1.4rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
            <div className="relative h-[340px] sm:h-[440px] lg:h-[540px]">
              <EditableHeroCollage images={heroImages} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(11,11,13,0.86))]" />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {home.hero.featureCardBadge}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/65">{home.hero.focusLabel}</p>
                <p className="editable-display mt-2 max-w-sm text-xl font-semibold leading-snug text-white">{home.hero.featureCardTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <Marquee items={marqueeItems} />

      {/* Stats band */}
      <div className="border-b border-[var(--editable-border)] bg-[var(--slot4-warm)]">
        <div className={container}>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {heroStats.map((item, index) => (
              <div
                key={item.label}
                data-reveal
                style={revealDelay(index * 80)}
                className={`py-10 ${index % 2 === 1 ? 'border-l border-[var(--editable-border)] pl-5 sm:pl-8' : ''} ${index === 2 ? 'lg:border-l lg:border-[var(--editable-border)] lg:pl-8' : ''} ${index === 3 ? 'lg:pl-8' : ''} ${index < 2 ? 'border-b border-[var(--editable-border)] lg:border-b-0' : ''}`}
              >
                <p className="editable-display text-4xl font-semibold tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-5xl">
                  {item.value}
                </p>
                <p className="mt-2 max-w-[15rem] text-xs leading-5 text-[var(--slot4-muted-text)] sm:text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- BROWSE BY TOPIC --------------------------- */
const topicIcons = [Compass, FolderOpen, Layers, BookOpen, Tag, Library, Hash, Globe]

export function EditableStoryRail({ posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  // Build topic shelves from real categories, with a count per topic.
  const counts = new Map<string, number>()
  for (const post of pool) {
    const category = categoryOf(post)
    if (category) counts.set(category, (counts.get(category) || 0) + 1)
  }
  const topics = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)
  if (!topics.length) return null

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`py-16 sm:py-20 ${container}`}>
        <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
          <div>
            <Eyebrow num="01">{home.topics.eyebrow}</Eyebrow>
            <h2 className="editable-display mt-4 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">{home.topics.title}</h2>
            <p className="mt-3 max-w-xl text-[var(--slot4-muted-text)]">{home.topics.description}</p>
          </div>
          <Link href="/sbm" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)] transition hover:gap-2.5">
            All collections <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {topics.map(([topic, count], index) => {
            const Icon = topicIcons[index % topicIcons.length]
            return (
              <Link
                key={topic}
                href={`/sbm?category=${slugifyTopic(topic)}`}
                data-reveal
                style={revealDelay(index * 60)}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--slot4-accent)] hover:shadow-[0_18px_40px_rgba(22,33,28,0.10)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)] transition group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-6">
                  <p className="editable-display text-lg font-semibold capitalize leading-snug tracking-[-0.01em]">{topic}</p>
                  <p className="mt-1 text-xs font-medium text-[var(--slot4-muted-text)]">{count} {count === 1 ? 'save' : 'saves'}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------- FEATURED COLLECTION + LATEST SAVES ----------------- */
function SaveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = categoryOf(post)
  const url = urlOf(post)
  const image = getEditablePostImage(post)
  return (
    <Link
      href={href}
      data-reveal
      style={revealDelay((index % 3) * 70)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(22,33,28,0.12)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" loading="lazy" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-surface-bg)]/95 px-3 py-1 text-[11px] font-semibold text-[var(--slot4-page-text)] shadow-sm">
          <Bookmark className="h-3 w-3 text-[var(--slot4-accent)]" /> Saved
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {category ? <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{category}</p> : null}
        <h3 className="editable-display mt-2 line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.01em] group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 110)}</p>
        <div className="mt-4 flex items-center justify-between border-t border-[var(--editable-border)] pt-3.5">
          <SourceChip url={url} />
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--slot4-accent)]">Open <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
        </div>
      </div>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const all = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  if (!all.length) return null
  const [featured, ...rest] = all
  const latest = rest.slice(0, 6)
  const featuredUrl = urlOf(featured)
  const featuredCategory = categoryOf(featured)

  return (
    <section className="bg-[var(--slot4-warm)]">
      <div className={`py-16 sm:py-20 ${container}`}>
        <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
          <div>
            <Eyebrow num="02">{home.featured.eyebrow}</Eyebrow>
            <h2 className="editable-display mt-4 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">{home.featured.title}</h2>
            <p className="mt-3 max-w-xl text-[var(--slot4-muted-text)]">{home.featured.description}</p>
          </div>
          <Link href={primaryRoute} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)] transition hover:gap-2.5">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Featured large card */}
          <Link
            href={postHref(primaryTask, featured, primaryRoute)}
            data-reveal
            className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[1.4rem] border border-[var(--editable-border)] bg-[var(--slot4-dark-bg)] p-7 text-white sm:min-h-[440px] sm:p-9"
          >
            <img src={getEditablePostImage(featured)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-65" loading="lazy" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,33,28,0.2),rgba(22,33,28,0.9))]" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" /> {featuredCategory || 'Featured save'}
              </span>
              <h3 className="editable-display mt-5 max-w-xl text-3xl font-semibold leading-[1.08] tracking-[-0.02em] sm:text-4xl">{featured.title}</h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/75">{getExcerpt(featured, 180)}</p>
              <div className="mt-6 flex items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--slot4-dark-bg)]">
                  Open resource <ArrowUpRight className="h-4 w-4" />
                </span>
                {featuredUrl ? <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70"><Link2 className="h-3.5 w-3.5" /> {domainOf(featuredUrl)}</span> : null}
              </div>
            </div>
          </Link>

          {/* Latest saves grid */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]" data-reveal>{home.latest.eyebrow}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {latest.map((post, index) => (
                <SaveCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------- POPULAR THIS WEEK --------------------------- */
function RankRow({ post, href, rank }: { post: SitePost; href: string; rank: number }) {
  const url = urlOf(post)
  const category = categoryOf(post)
  return (
    <Link
      href={href}
      data-reveal
      style={revealDelay(rank * 50)}
      className="group flex items-center gap-4 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:shadow-[0_14px_34px_rgba(22,33,28,0.10)]"
    >
      <span className="editable-display w-8 shrink-0 text-center text-2xl font-semibold text-[var(--slot4-soft-muted-text)] group-hover:text-[var(--slot4-accent)]">
        {String(rank).padStart(2, '0')}
      </span>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
        <Bookmark className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-sm font-semibold leading-snug group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
        <div className="mt-1 flex items-center gap-3">
          {category ? <span className="truncate text-xs font-medium text-[var(--slot4-muted-text)]">{category}</span> : null}
          <SourceChip url={url} />
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--slot4-soft-muted-text)] transition group-hover:text-[var(--slot4-accent)]" />
    </Link>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const popular = pool.slice(0, 8)
  if (popular.length < 2) return null

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`py-16 sm:py-20 ${container}`}>
        <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
          <div>
            <Eyebrow num="03">{home.popular.eyebrow}</Eyebrow>
            <h2 className="editable-display mt-4 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">{home.popular.title}</h2>
            <p className="mt-3 max-w-xl text-[var(--slot4-muted-text)]">{home.popular.description}</p>
          </div>
          <Link href={primaryRoute} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)] transition hover:gap-2.5">
            See the full library <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {popular.map((post, index) => (
            <RankRow key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} rank={index + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- CTA band ------------------------------- */
export function EditableHomeCta() {
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-page-bg)]">
      <div className={`py-16 sm:py-24 ${container}`}>
        <div
          data-reveal
          className="relative overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-dark-bg)] px-6 py-20 text-center text-[var(--slot4-dark-text)] sm:px-12 sm:py-28"
        >
          <div className="pointer-events-none absolute inset-x-0 -top-32 h-72 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(120,200,120,0.18),transparent_70%)]" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em]">
              <Bookmark className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {home.cta.badge}
            </span>
            <h2 className="editable-display mt-7 text-balance text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
              {home.cta.title}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--slot4-dark-text)]/70 sm:text-lg">{home.cta.description}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link href={home.cta.primaryCta.href} className="group inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-8 py-4 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-110">
                {home.cta.primaryCta.label} <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href={home.cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
                {home.cta.secondaryCta.label}
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-7">
              <span className="inline-flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-[var(--slot4-accent)] text-[var(--slot4-accent)]" />
                ))}
              </span>
              <span className="text-sm font-medium text-[var(--slot4-dark-text)]/75">Trusted by curators building better shelves</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
