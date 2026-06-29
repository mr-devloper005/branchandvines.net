import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Yelp-style task surfaces.

  Every task (archive + detail) now shares one cohesive premium identity:
  clean white surfaces, the signature Yelp red accent, hairline gray borders
  and a single crisp sans-serif — exactly like Yelp. Per-task copy (kicker /
  note) still varies so each section keeps a little voice, but the visual
  language is unified. Tokens are delivered via CSS variables (`--tk-*`).
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const BODY_FONT = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const DISPLAY_FONT = "'Space Grotesk', 'Inter', system-ui, sans-serif"

// Shared palette — Nevire-style agency on a LIGHT canvas: warm off-white pages,
// white cards, near-black ink, hairline warm borders, one botanical-green accent.
// Every task inherits this; only kicker/note differ. Brand name comes from env.
const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#f5f4ef',
  surface: '#ffffff',
  raised: '#eeede6',
  text: '#16181c',
  muted: '#5f635d',
  line: '#e2e0d6',
  accent: '#2e7d32',
  accentSoft: '#e6f1e4',
  onAccent: '#ffffff',
  glow: 'rgba(46,125,50,0.08)',
  radius: '0.9rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Reading', note: 'Long-form notes and essays worth coming back to.' },
  listing: { ...base, kicker: 'Directory', note: 'Curated places and services, gathered in one shelf.' },
  classified: { ...base, kicker: 'Noticeboard', note: 'Fresh finds and offers, ready to act on.' },
  image: { ...base, kicker: 'Gallery', note: 'A visual shelf of standout images and references.' },
  sbm: { ...base, kicker: 'Collections', note: 'Hand-picked links, tools and resources worth saving.' },
  pdf: { ...base, kicker: 'Library', note: 'Downloadable guides, reports and reference files.' },
  profile: { ...base, kicker: 'Curator', note: 'The people behind the collections and saves.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    // Re-point the shared article-body accent vars so post HTML (headings,
    // links) inherits this task's accent instead of the global site accent.
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
