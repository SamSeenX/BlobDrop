import { TIERS } from '../config/tiers.js';

export class Ball {
  constructor(x, y, tierIndex, isSpawning = false, initialVx = 0, initialVy = 0) {
    this.x = x;
    this.y = y;
    this.tierIndex = tierIndex;
    const t = TIERS[tierIndex];
    this.radius = t.radius;
    this.mass = t.mass;
    this.vx = initialVx;
    this.vy = isSpawning ? -1.2 : initialVy;
    this.scaleX = isSpawning ? 1.4 : 1.15;
    this.scaleY = isSpawning ? 0.65 : 0.85;
    this.rotation = Math.random() * Math.PI * 2;
    this.angularVelocity = 0;
    this.age = 0;
    this.toRemove = false;

    // Merge suction state
    this.isMerging = false;
    this.isMergeLeader = false;
    this.mergeFrame = 0;
    this.mergeDuration = 12;
    this.startX = x;
    this.startY = y;
    this.targetX = x;
    this.targetY = y;
    this.nextTier = tierIndex;
    this.alpha = 1;
  }

  startMerge(targetX, targetY, nextTier, isLeader) {
    this.isMerging = true;
    this.isMergeLeader = isLeader;
    this.startX = this.x;
    this.startY = this.y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.nextTier = nextTier;
    this.mergeFrame = 0;
  }

  update(width, height) {
    if (this.isMerging) {
      this.mergeFrame++;
      const t = Math.min(1, this.mergeFrame / this.mergeDuration);
      const easeIn = t * t * t;
      this.x = this.startX + (this.targetX - this.startX) * easeIn;
      this.y = this.startY + (this.targetY - this.startY) * easeIn;
      const squish = Math.max(0.2, 1 - easeIn * 0.65);
      this.scaleX = squish;
      this.scaleY = squish;
      this.alpha = Math.max(0.15, 1 - easeIn * 0.7);

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
      const restitution = Math.abs(this.vx) > 1.5 ? 0.75 : 0.35;
      this.vx = -this.vx * restitution;
      if (Math.abs(this.vx) < 0.04) this.vx = 0;
    }
    if (this.x + m > width) {
      this.x = width - m;
      const restitution = Math.abs(this.vx) > 1.5 ? 0.75 : 0.35;
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
    ctx.save();
    if (this.alpha < 1) {
      ctx.globalAlpha = this.alpha;
    }
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, this.scaleY);

    const t = TIERS[this.tierIndex];
    ctx.shadowColor = t.glow;
    ctx.shadowBlur = this.isMerging ? 18 : 10;

    const grad = ctx.createRadialGradient(-4, -4, 2, 0, 0, this.radius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, t.color);
    grad.addColorStop(1, t.glow);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.beginPath();
    ctx.arc(-this.radius * 0.35, -this.radius * 0.35, this.radius * 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#07090e';
    ctx.font = `900 ${Math.max(11, this.radius * 0.48)}px 'Outfit', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.name, 0, 1);

    ctx.restore();
  }
}
