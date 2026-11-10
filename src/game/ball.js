import { TIERS } from '../config/tiers.js';

export class Ball {
  constructor(x, y, tierIndex) {
    this.x = x;
    this.y = y;
    this.tierIndex = tierIndex;
    const t = TIERS[tierIndex];
    this.radius = t.radius;
    this.mass = t.mass;
    this.vx = 0;
    this.vy = 0;
    this.scaleX = 1.15;
    this.scaleY = 0.85;
    this.rotation = Math.random() * Math.PI * 2;
    this.angularVelocity = 0;
    this.age = 0;
    this.toRemove = false;
  }

  update(width, height) {
    this.age++;
    this.vy += 0.42;

    this.vx *= 0.99;
    this.vy *= 0.99;

    this.x += this.vx;
    this.y += this.vy;

    this.angularVelocity = this.vx / this.radius;
    this.rotation += this.angularVelocity;

    // Smoothly transition from jello to rigid over 240 frames (~4s)
    const rigidityFactor = Math.min(1, this.age / 240);
    this.scaleX += (1 - this.scaleX) * (0.05 + rigidityFactor * 0.15);
    this.scaleY += (1 - this.scaleY) * (0.05 + rigidityFactor * 0.15);

    if (Math.abs(1 - this.scaleX) < 0.001) this.scaleX = 1;
    if (Math.abs(1 - this.scaleY) < 0.001) this.scaleY = 1;

    // Wall collisions
    const m = this.radius;
    if (this.x - m < 0) {
      this.x = m;
      this.vx *= -0.35;
    }
    if (this.x + m > width) {
      this.x = width - m;
      this.vx *= -0.35;
    }

    // Floor collision (floor at height - 20)
    const floorY = height - 20 - this.radius;
    if (this.y > floorY) {
      this.y = floorY;
      this.vy *= -0.2;
      this.vx *= 0.92;
      if (Math.abs(this.vy) < 0.3) this.vy = 0;
      if (Math.abs(this.vx) < 0.05) this.vx = 0;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, this.scaleY);

    const t = TIERS[this.tierIndex];

    ctx.shadowColor = t.glow;
    ctx.shadowBlur = 10;

    const grad = ctx.createRadialGradient(-4, -4, 2, 0, 0, this.radius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, t.color);
    grad.addColorStop(1, t.glow);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Fixed surface shine
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.beginPath();
    ctx.arc(-this.radius * 0.35, -this.radius * 0.35, this.radius * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Number text
    ctx.fillStyle = '#07090e';
    ctx.font = `900 ${Math.max(11, this.radius * 0.48)}px 'Outfit', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.name, 0, 1);

    ctx.restore();
  }
}
