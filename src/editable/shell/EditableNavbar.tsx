'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle, LogOut } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const NAV_LINKS = globalContent.nav.primaryLinks

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  // Sticky-shrink: compress the bar + raise its surface once the user scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  const firstName = session?.name?.split(' ')[0] || session?.name

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/92 shadow-[0_8px_30px_rgba(22,33,28,0.07)] backdrop-blur-md'
          : 'border-transparent bg-[var(--editable-nav-bg)]/80 backdrop-blur-sm'
      }`}
    >
      <nav
        className={`mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-6 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? 'min-h-[64px]' : 'min-h-[80px]'
        }`}
      >
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span>
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="editable-display block max-w-[220px] truncate text-[1.35rem] font-semibold leading-none tracking-[-0.01em]">
              {SITE_CONFIG.name}
            </span>
            <span className="mt-1 block max-w-[220px] truncate text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
              {globalContent.nav.tagline}
            </span>
          </span>
        </Link>

        <div className="ml-2 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                className={`editable-navlink relative px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  active ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <Link
            href="/search"
            aria-label="Search the library"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] md:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-1.5 rounded-full bg-[var(--editable-cta-bg)] px-4 py-2 text-[13px] font-semibold text-[var(--editable-cta-text)] transition hover:brightness-110 sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Save a link
              </Link>
              <span className="hidden max-w-[140px] truncate text-[13px] font-semibold text-[var(--slot4-page-text)] lg:inline">
                {firstName}
              </span>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-1.5 rounded-full border border-[var(--editable-border)] px-3.5 py-2 text-[13px] font-medium text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-1.5 rounded-full bg-[var(--editable-cta-bg)] px-4 py-2 text-[13px] font-semibold text-[var(--editable-cta-text)] transition hover:brightness-110 sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Sign up
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-4 py-5 lg:hidden">
          <form action="/search" className="mb-5 flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-2.5">
            <Search className="h-4 w-4 text-[var(--slot4-accent)]" />
            <input
              name="q"
              type="search"
              placeholder={globalContent.nav.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]"
            />
          </form>
          <div className="grid gap-1">
            {NAV_LINKS.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg border-l-2 px-4 py-3 text-sm font-semibold ${
                    active
                      ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
                      : 'border-transparent text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
          <div className="mt-5 grid gap-2 border-t border-[var(--editable-border)] pt-5">
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-4 py-3 text-sm font-semibold text-[var(--editable-cta-text)]">
                  <PlusCircle className="h-4 w-4" /> Save a link
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-3 text-sm font-semibold text-[var(--slot4-muted-text)]"
                >
                  <LogOut className="h-4 w-4" /> Logout{firstName ? ` · ${firstName}` : ''}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-3 text-sm font-semibold">
                  <LogIn className="h-4 w-4" /> Sign in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-4 py-3 text-sm font-semibold text-[var(--editable-cta-text)]">
                  <UserPlus className="h-4 w-4" /> Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
