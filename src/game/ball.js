import { TIERS } from '../config/tiers.js';
import { spriteCache } from './spriteCache.js';
import { updateMergeAnimation } from './ballMerge.js';

export class Ball {
  constructor(x, y, tierIndex, isSpawning = false, initialVx = 0, initialVy = 0, scale = 1) {
    this.x = x;
    this.y = y;
    this.tierIndex = tierIndex;
    this.scale = scale;
    const t = TIERS[tierIndex];
    this.radius = t.radius * scale;
    this.mass = t.mass;
    this.vx = initialVx;
    this.vy = Math.abs(initialVy) > 0.2 ? initialVy : (isSpawning ? -1.2 * scale : 0);
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
      updateMergeAnimation(this, width, height, floorY, m);
      return;
    }

    this.age++;
    this.vy += 0.40 * this.scale;
    this.vx *= 0.985;
    this.vy *= 0.99;

    if (Math.abs(this.vx) < 0.03 * this.scale) this.vx = 0;
    if (Math.abs(this.vy) < 0.05 * this.scale) this.vy = 0;

    this.x += this.vx;
    this.y += this.vy;

    if (Math.abs(this.vx) > 0.03 * this.scale) {
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
      const restitution = Math.abs(this.vx) > 1.2 * this.scale ? 0.88 : 0.40;
      this.vx = Math.abs(this.vx) * restitution;
      if (Math.abs(this.vx) < 0.04 * this.scale) this.vx = 0;
    } else if (this.x + m > width) {
      this.x = width - m;
      const restitution = Math.abs(this.vx) > 1.2 * this.scale ? 0.88 : 0.40;
      this.vx = -Math.abs(this.vx) * restitution;
      if (Math.abs(this.vx) < 0.04 * this.scale) this.vx = 0;
    }

    if (this.y > floorY) {
      this.y = floorY;
      this.vy = -Math.abs(this.vy) * 0.15;
      this.vx *= 0.88;
      if (Math.abs(this.vy) < 0.35 * this.scale) this.vy = 0;
      if (Math.abs(this.vx) < 0.04 * this.scale) this.vx = 0;
    } else if (this.y - m < 0) {
      this.y = m;
      this.vy = Math.abs(this.vy) * 0.5;
    }
  }

  draw(ctx) {
    const sprite = spriteCache.getSprite(this.tierIndex, this.radius);
    if (!sprite) return;

    ctx.save();
    if (this.alpha < 1) ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, this.scaleY);
    ctx.drawImage(sprite.canvas, -sprite.offset, -sprite.offset);
    ctx.restore();
  }
}
