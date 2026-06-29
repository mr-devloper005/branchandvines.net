import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Filter, Globe, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const decodeEntities = (value: string) => value
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#0?39;|&apos;|&rsquo;|&lsquo;/gi, '’')
  .replace(/&ldquo;|&rdquo;/gi, '"')
  .replace(/&hellip;/gi, '…')
  .replace(/&mdash;/gi, '—')
  .replace(/&ndash;/gi, '–')
  .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)))
// Strip tags + decode entities + collapse whitespace → clean plain text for cards.
const plainText = (value: string) => decodeEntities(stripHtml(value)).replace(/\s+/g, ' ').trim()
const compactText = (value: unknown) => typeof value === 'string' ? plainText(value).toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => plainText(post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || '')

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  // Keep profiles out of the public search surface (reachable by direct URL only).
  if (derivedTask === 'profile') return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

const domainOf = (value: string) => value.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '')
const urlOf = (post: SitePost) => {
  const content = getContent(post)
  for (const key of ['website', 'url', 'link', 'source']) {
    const value = content[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  // Route from the task config (e.g. /sbm/<slug>); buildPostUrl can fall
  // back to /posts for tasks missing from the enabled taskViews map, which 404s.
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'sbm'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Resource'
  const url = urlOf(post)
  const strong = index % 5 === 0

  return (
    <Link
      href={href}
      data-reveal
      style={{ '--reveal-delay': `${(index % 3) * 60}ms` } as React.CSSProperties}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] shadow-[0_1px_3px_rgba(22,33,28,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(22,33,28,0.12)] ${strong ? 'md:col-span-2' : ''}`}
    >
      {image ? (
        <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(22,33,28,0.45))]" />
          <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-surface-bg)]/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent)] shadow-sm">{taskLabel}</span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        {!image ? <span className="w-fit rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent)]">{taskLabel}</span> : null}
        <h2 className="editable-display mt-3 line-clamp-2 text-xl font-semibold leading-snug tracking-[-0.01em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        {summary ? <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <div className="mt-4 flex items-center justify-between border-t border-[var(--editable-border)] pt-3.5">
          {url ? <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-[var(--slot4-muted-text)]"><Globe className="h-3.5 w-3.5 shrink-0 text-[var(--slot4-accent)]" /> <span className="truncate">{domainOf(url)}</span></span> : <span />}
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--slot4-accent)]">Open <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
        </div>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  // Profiles are hidden from public discovery, so omit them from the type filter.
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled && item.key !== 'profile')

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 rounded-[1.6rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[0_24px_70px_rgba(22,33,28,0.08)] md:grid-cols-[0.85fr_1.15fr] md:items-center lg:p-10" data-reveal>
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                <span className="h-px w-6 bg-[var(--slot4-accent)]/50" /> {pagesContent.search.hero.badge}
              </span>
              <h1 className="editable-display mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">{pagesContent.search.hero.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[var(--slot4-muted-text)]">{pagesContent.search.hero.description}</p>
            </div>
            <form action="/search" className="rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-warm)] p-4 sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[var(--slot4-muted-text)]" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input name="category" defaultValue={category} placeholder="Topic or collection" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-muted-text)]" />
                </label>
                <select name="task" defaultValue={task} className="rounded-xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none">
                  <option value="">All types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--slot4-accent)] px-6 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-110" type="submit">
                <Search className="h-4 w-4" /> Search the library
              </button>
            </form>
          </div>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-4" data-reveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">{results.length} {results.length === 1 ? 'result' : 'results'}</p>
              <h2 className="editable-display mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{query ? `Results for “${query}”` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">Browse collections <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <div className="mt-7">
            <Ads slot="in-feed" showLabel className="mx-auto w-full" />
          </div>

          {results.length ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-12 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--slot4-muted-text)]" />
              <p className="editable-display mt-5 text-2xl font-semibold tracking-[-0.02em]">No matching resources found.</p>
              <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Try a different keyword, type, or collection.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
