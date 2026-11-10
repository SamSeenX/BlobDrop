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

  startMerge(targetX, targetY, nextTier, isLeader, sharedVx = 0, sharedVy = 0) {
    this.isMerging = true;
    this.isMergeLeader = isLeader;
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
    if (this.isMerging) {
      this.mergeFrame++;

      // Center of mass continuously moves with shared momentum and gravity
      this.vy += 0.35;
      this.vx *= 0.985;
      this.vy *= 0.99;
      this.targetX += this.vx;
      this.targetY += this.vy;

      // Bound center of mass to play area
      const m = this.radius;
      if (this.targetX - m < 0) {
        this.targetX = m;
        this.vx *= -0.7;
      } else if (this.targetX + m > width) {
        this.targetX = width - m;
        this.vx *= -0.7;
      }

      const floorY = height - 20 - this.radius;
      if (this.targetY > floorY) {
        this.targetY = floorY;
        this.vy *= -0.15;
        this.vx *= 0.88;
      }

      // Phase 1: Physical impact wobble while traveling
      if (this.mergeFrame <= this.wobbleDuration) {
        const progress = this.mergeFrame / this.wobbleDuration;
        const wobble = Math.sin(progress * Math.PI);
        this.scaleX = 1 + wobble * 0.24;
        this.scaleY = 1 - wobble * 0.20;
        this.x = this.targetX + this.offsetX;
        this.y = this.targetY + this.offsetY;
        return;
      }

      // Phase 2: Suction fusion into the moving center of mass
      const suctionProgress = (this.mergeFrame - this.wobbleDuration) / (this.mergeDuration - this.wobbleDuration);
      const t = Math.min(1, suctionProgress);
      const easeIn = t * t * t;
      this.x = this.targetX + this.offsetX * (1 - easeIn);
      this.y = this.targetY + this.offsetY * (1 - easeIn);
      const squish = Math.max(0.18, 1 - easeIn * 0.72);
      this.scaleX = squish;
      this.scaleY = squish;
      this.alpha = Math.max(0.15, 1 - easeIn * 0.8);

      if (this.mergeFrame >= this.mergeDuration) {
        this.toRemove = true;
      }
      return;
    }

    this.age++;
    this.vy += 0.40;
    this.vx *= 0.985;
    this.vy *= 0.99;

    // Velocity deadband to prevent micro-jitter
    if (Math.abs(this.vx) < 0.03) this.vx = 0;
    if (Math.abs(this.vy) < 0.05) this.vy = 0;

    this.x += this.vx;
    this.y += this.vy;

    if (Math.abs(this.vx) > 0.03) {
      this.angularVelocity = this.vx / this.radius;
      this.rotation += this.angularVelocity;
    }

    // Rigidity settling: jello -> firm body over 200 frames
    const rigidityFactor = Math.min(1, this.age / 200);
    this.scaleX += (1 - this.scaleX) * (0.08 + rigidityFactor * 0.16);
    this.scaleY += (1 - this.scaleY) * (0.08 + rigidityFactor * 0.16);

    if (Math.abs(1 - this.scaleX) < 0.001) this.scaleX = 1;
    if (Math.abs(1 - this.scaleY) < 0.001) this.scaleY = 1;

    // Wall collisions
    const m = this.radius;
    if (this.x - m < 0) {
      this.x = m;
      const restitution = Math.abs(this.vx) > 1.2 ? 0.88 : 0.40;
      this.vx = -this.vx * restitution;
      if (Math.abs(this.vx) < 0.04) this.vx = 0;
    }
    if (this.x + m > width) {
      this.x = width - m;
      const restitution = Math.abs(this.vx) > 1.2 ? 0.88 : 0.40;
      this.vx = -this.vx * restitution;
      if (Math.abs(this.vx) < 0.04) this.vx = 0;
    }

    // Floor collision
    const floorY = height - 20 - this.radius;
    if (this.y > floorY) {
      this.y = floorY;
      this.vy *= -0.15;
      this.vx *= 0.88;
      if (Math.abs(this.vy) < 0.35) this.vy = 0;
      if (Math.abs(this.vx) < 0.04) this.vx = 0;
    }
  }

  draw(ctx) {
    const sprite = spriteCache.getSprite(this.tierIndex);
    if (!sprite) return;

    ctx.save();
    if (this.alpha < 1) {
      ctx.globalAlpha = this.alpha;
    }
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, this.scaleY);

    ctx.drawImage(sprite.canvas, -sprite.offset, -sprite.offset);

    ctx.restore();
  }
}
