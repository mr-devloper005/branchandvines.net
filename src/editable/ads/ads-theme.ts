// ✏️ EDITABLE — theme the ads to match this site. Devs own this file.
// You control the LOOK here (radius, border, shadow, background, label color).
// You CANNOT change the ad's shape/fit from here — that stays locked in
// src/lib/ad-slots.ts, so the ad always displays correctly no matter what.

import type { AdSkin } from '@/lib/ads/ad-frame'

// Site-wide default skin — light agency palette (white surfaces + green accent).
// Look only; shape/fit stays locked in src/lib/ad-slots.ts.
export const adSkin: AdSkin = {
  radius: '16px',
  border: '1px solid rgba(22,33,28,0.08)',
  shadow: '0 14px 40px rgba(22,33,28,0.08)',
  background: '#ffffff',
  labelClassName: 'bg-[#2e7d32] text-white',
}

// Optional per-slot overrides — adjust only where you need to.
export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '14px', shadow: 'none', border: '1px solid rgba(22,33,28,0.10)' },
  popup: { radius: '20px' },
  header: { radius: '18px', background: '#faf9f5' },
}

/** Merge site default + per-slot override for a slot. */
export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
// junior tweak
