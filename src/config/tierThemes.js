export const DEFAULT_PALETTE = [
  { color: '#f43f5e', glow: '#fb7185' },
  { color: '#fb923c', glow: '#f97316' },
  { color: '#facc15', glow: '#eab308' },
  { color: '#34d399', glow: '#10b981' },
  { color: '#38bdf8', glow: '#0ea5e9' },
  { color: '#818cf8', glow: '#6366f1' },
  { color: '#c084fc', glow: '#a855f7' },
  { color: '#ec4899', glow: '#db2777' },
  { color: '#fb7185', glow: '#e11d48' },
  { color: '#f59e0b', glow: '#d97706' },
  { color: '#10b981', glow: '#059669' },
  { color: '#06b6d4', glow: '#0891b2' },
  { color: '#d946ef', glow: '#f0abfc' }
];

export const PASTEL_PALETTE = [
  { color: '#f9a8d4', glow: '#f472b6' }, // 2: Sakura Pink
  { color: '#fdba74', glow: '#fb923c' }, // 4: Peach Custard
  { color: '#fef08a', glow: '#fde047' }, // 8: Buttercup Mochi
  { color: '#86efac', glow: '#4ade80' }, // 16: Matcha Milk
  { color: '#7dd3fc', glow: '#38bdf8' }, // 32: Boba Sky
  { color: '#c4b5fd', glow: '#a78bfa' }, // 64: Lavender Cloud
  { color: '#d8b4fe', glow: '#c084fc' }, // 128: Taro Dream
  { color: '#f472b6', glow: '#ec4899' }, // 256: Sweet Bubblegum
  { color: '#fda4af', glow: '#fb7185' }, // 512: Soft Coral
  { color: '#fcd34d', glow: '#f59e0b' }, // 1024: Honey Amber
  { color: '#6ee7b7', glow: '#34d399' }, // 2048: Mint Sorbet
  { color: '#67e8f9', glow: '#22d3ee' }, // 4096: Pastel Cyan
  { color: '#f0abfc', glow: '#e879f9' }  // 8192: Cosmic Magic Plum
];

export function applyThemeToTiers(tiers, theme = 'default') {
  const palette = theme === 'pastel' ? PASTEL_PALETTE : DEFAULT_PALETTE;
  tiers.forEach((tier, i) => {
    if (palette[i]) {
      tier.color = palette[i].color;
      tier.glow = palette[i].glow;
    }
  });
}
