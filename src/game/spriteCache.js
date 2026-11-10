import { TIERS } from '../config/tiers.js';

class SpriteCache {
  constructor() {
    this.cache = new Map();
  }

  clear() {
    this.cache.clear();
  }

  getSprite(tierIndex, radius = null) {
    const tier = TIERS[tierIndex];
    if (!tier) return null;
    const r = Math.round(radius || tier.radius);
    const key = `${tierIndex}_${r}`;
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    return this.generateSprite(tierIndex, r, key);
  }

  generateSprite(tierIndex, r, key) {
    const tier = TIERS[tierIndex];
    if (!tier) return null;

    const padding = Math.max(4, Math.round(r * 0.15));
    const size = Math.ceil((r + padding) * 2);
    const center = size / 2;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Outer soft glow aura
    const aura = ctx.createRadialGradient(center, center, r * 0.75, center, center, r + padding - 2);
    aura.addColorStop(0, tier.glow);
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(center, center, r + padding - 2, 0, Math.PI * 2);
    ctx.fill();

    // Spherical radial gradient body
    const body = ctx.createRadialGradient(center - r * 0.25, center - r * 0.25, 2, center, center, r);
    body.addColorStop(0, '#ffffff');
    body.addColorStop(0.35, tier.color);
    body.addColorStop(1, tier.glow);
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.fill();

    // Specular gloss reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.beginPath();
    ctx.arc(center - r * 0.35, center - r * 0.35, r * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Tier number label
    ctx.fillStyle = '#07090e';
    const fontSize = Math.max(9, Math.round(r * 0.46));
    ctx.font = `900 ${fontSize}px 'Outfit', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tier.name, center, center + 1);

    const sprite = { canvas, offset: center };
    this.cache.set(key, sprite);
    return sprite;
  }
}

export const spriteCache = new SpriteCache();
