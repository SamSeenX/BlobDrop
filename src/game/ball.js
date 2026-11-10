import { TIERS } from '../config/tiers.js';
import { spriteCache } from './spriteCache.js';

export class Ball {
  constructor(x, y, tierIndex, isSpawning = false, initialVx = 0, initialVy = 0) {
    this.x = x;
    this.y = y;
    this.tierIndex = tierIndex;
    const t = TIERS[tierIndex];
    this.radius = t.radius;
    this.mass = t.mass;
    this.vx = initialVx;
    this.vy = Math.abs(initialVy) > 0.2 ? initialVy : (isSpawning ? -1.2 : 0);
    this.scaleX = isSpawning ? 1.4 : 1.15;
    this.scaleY = isSpawning ? 0.65 : 0.85;
    this.rotation = 0;
    this.angularVelocity = 0;
    this.age = 0;
    this.toRemove = false;

    // Merge state with continuous momentum transfer
    this.isMerging = false;
    this.isMergeLeader = false;
    this.mergePartner = null;
    this.mergeFrame = 0;
    this.wobbleDuration = 8;
    this.mergeDuration = 18;
    this.offsetX = 0;
    this.offsetY = 0;
    this.targetX = x;
    this.targetY = y;
    this.nextTier = tierIndex;
    this.alpha = 1;
  }

  startMerge(targetX, targetY, nextTier, isLeader, sharedVx = 0, sharedVy = 0, partner = null) {
    this.isMerging = true;
    this.isMergeLeader = isLeader;
    this.mergePartner = partner;
    this.offsetX = this.x - targetX;
    this.offsetY = this.y - targetY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.nextTier = nextTier;
    this.vx = sharedVx;
    this.vy = sharedVy;
    this.mergeFrame = 0;
  }

  update(width, height) {
    const m = this.radius;
    const floorY = height - 20 - m;

    if (this.isMerging) {
      this.mergeFrame++;
      this.vy += 0.35;
      this.vx *= 0.985;
      this.vy *= 0.99;
      this.targetX += this.vx;
      this.targetY += this.vy;

      // Bound target center of mass to playfield
      if (this.targetX - m < 0) {
        this.targetX = m;
        this.vx = Math.abs(this.vx) * 0.70;
      } else if (this.targetX + m > width) {
        this.targetX = width - m;
        this.vx = -Math.abs(this.vx) * 0.70;
      }

      if (this.targetY > floorY) {
        this.targetY = floorY;
        this.vy = -Math.abs(this.vy) * 0.20;
        this.vx *= 0.88;
      } else if (this.targetY - m < 0) {
        this.targetY = m;
        this.vy = Math.abs(this.vy) * 0.5;
      }

      // Wobble & suction animation
      if (this.mergeFrame <= this.wobbleDuration) {
        const progress = this.mergeFrame / this.wobbleDuration;
        const wobble = Math.sin(progress * Math.PI);
        this.scaleX = 1 + wobble * 0.24;
        this.scaleY = 1 - wobble * 0.20;
        this.x = this.targetX + this.offsetX;
        this.y = this.targetY + this.offsetY;
      } else {
        const suction = (this.mergeFrame - this.wobbleDuration) / (this.mergeDuration - this.wobbleDuration);
        const easeIn = Math.min(1, suction) ** 3;
        this.x = this.targetX + this.offsetX * (1 - easeIn);
        this.y = this.targetY + this.offsetY * (1 - easeIn);
        const squish = Math.max(0.18, 1 - easeIn * 0.72);
        this.scaleX = squish;
        this.scaleY = squish;
        this.alpha = Math.max(0.15, 1 - easeIn * 0.8);

        if (this.mergeFrame >= this.mergeDuration) this.toRemove = true;
      }

      // Guarded edge clamp during merge animation
      if (this.x - m < 0) {
        this.x = m;
        this.vx = Math.abs(this.vx) * 0.70;
      } else if (this.x + m > width) {
        this.x = width - m;
        this.vx = -Math.abs(this.vx) * 0.70;
      }
      if (this.y > floorY) {
        this.y = floorY;
        this.vy = -Math.abs(this.vy) * 0.20;
      } else if (this.y - m < 0) {
        this.y = m;
      }
      return;
    }

    this.age++;
    this.vy += 0.40;
    this.vx *= 0.985;
    this.vy *= 0.99;

    if (Math.abs(this.vx) < 0.03) this.vx = 0;
    if (Math.abs(this.vy) < 0.05) this.vy = 0;

    this.x += this.vx;
    this.y += this.vy;

    if (Math.abs(this.vx) > 0.03) {
      this.angularVelocity = this.vx / this.radius;
      this.rotation += this.angularVelocity;
    }

    const rigidity = Math.min(1, this.age / 200);
    this.scaleX += (1 - this.scaleX) * (0.08 + rigidity * 0.16);
    this.scaleY += (1 - this.scaleY) * (0.08 + rigidity * 0.16);

    if (Math.abs(1 - this.scaleX) < 0.001) this.scaleX = 1;
    if (Math.abs(1 - this.scaleY) < 0.001) this.scaleY = 1;

    // Boundary bounce & containment
    if (this.x - m < 0) {
      this.x = m;
      const restitution = Math.abs(this.vx) > 1.2 ? 0.88 : 0.40;
      this.vx = Math.abs(this.vx) * restitution;
      if (Math.abs(this.vx) < 0.04) this.vx = 0;
    } else if (this.x + m > width) {
      this.x = width - m;
      const restitution = Math.abs(this.vx) > 1.2 ? 0.88 : 0.40;
      this.vx = -Math.abs(this.vx) * restitution;
      if (Math.abs(this.vx) < 0.04) this.vx = 0;
    }

    if (this.y > floorY) {
      this.y = floorY;
      this.vy = -Math.abs(this.vy) * 0.15;
      this.vx *= 0.88;
      if (Math.abs(this.vy) < 0.35) this.vy = 0;
      if (Math.abs(this.vx) < 0.04) this.vx = 0;
    } else if (this.y - m < 0) {
      this.y = m;
      this.vy = Math.abs(this.vy) * 0.5;
    }
  }

  draw(ctx) {
    const sprite = spriteCache.getSprite(this.tierIndex);
    if (!sprite) return;

    ctx.save();
    if (this.alpha < 1) ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, this.scaleY);
    ctx.drawImage(sprite.canvas, -sprite.offset, -sprite.offset);
    ctx.restore();
  }
}
