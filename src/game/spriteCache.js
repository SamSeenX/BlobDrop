import { TIERS } from '../config/tiers.js';
import { drawAnimeBall } from './animeSprite.js';

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
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const isAnime = !isDark;
    const r = Math.round(radius || tier.radius);
    const key = `${isAnime ? 'anime' : 'cyber'}_${tierIndex}_${r}`;
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    return this.generateSprite(tierIndex, r, key, isAnime);
  }

  generateSprite(tierIndex, r, key, isAnime = false) {
    const tier = TIERS[tierIndex];
    if (!tier) return null;

    const padding = Math.max(4, Math.round(r * 0.15));
    const size = Math.ceil((r + padding) * 2);
    const center = size / 2;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (isAnime) {
      drawAnimeBall(ctx, tier, r, center);
    } else {
      // Outer intense neon aura halo
      const aura = ctx.createRadialGradient(center, center, r * 0.65, center, center, r + padding - 1);
      aura.addColorStop(0, tier.glow);
      aura.addColorStop(0.65, tier.glow);
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(center, center, r + padding - 1, 0, Math.PI * 2);
      ctx.fill();

      // Deep 3D Spherical Neon Orb
      const body = ctx.createRadialGradient(center - r * 0.28, center - r * 0.28, 2, center, center, r);
      body.addColorStop(0, '#ffffff');
      body.addColorStop(0.2, tier.color);
      body.addColorStop(0.82, tier.glow);
      body.addColorStop(1, '#020617');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(center, center, r, 0, Math.PI * 2);
      ctx.fill();

      // Outer rim laser ring
      ctx.strokeStyle = tier.glow;
      ctx.lineWidth = Math.max(1.2, r * 0.05);
      ctx.beginPath();
      ctx.arc(center, center, r - 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Curved specular gloss
      ctx.fillStyle = 'rgba(255, 255, 255, 0.52)';
      ctx.beginPath();
      ctx.arc(center - r * 0.35, center - r * 0.35, r * 0.26, 0, Math.PI * 2);
      ctx.fill();

      // Secondary micro-sparkle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(center - r * 0.16, center - r * 0.48, Math.max(1.2, r * 0.06), 0, Math.PI * 2);
      ctx.fill();

      // Luminous tier number label
      const fontSize = Math.max(9, Math.round(r * 0.46));
      ctx.font = `900 ${fontSize}px 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = 'rgba(2, 6, 23, 0.95)';
      ctx.lineWidth = Math.max(2.5, r * 0.1);
      ctx.lineJoin = 'round';
      ctx.strokeText(tier.name, center, center + 1);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(tier.name, center, center + 1);
    }

    const sprite = { canvas, offset: center };
    this.cache.set(key, sprite);
    return sprite;
  }
}

export const spriteCache = new SpriteCache();
