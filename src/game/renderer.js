import { TIERS } from '../config/tiers.js';

export class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  clear(width, height) {
    this.ctx.clearRect(0, 0, width, height);

    // Subtle background grid
    this.ctx.strokeStyle = 'rgba(244, 63, 94, 0.06)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let x = 30; x < width; x += 40) {
      this.ctx.moveTo(x, 40);
      this.ctx.lineTo(x, height - 20);
    }
    this.ctx.stroke();
  }

  drawAimGuide({ dropX, currentTierIndex, height }) {
    const currentRadius = TIERS[currentTierIndex].radius;
    const tier = TIERS[currentTierIndex];

    this.ctx.strokeStyle = tier.color;
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(dropX, 45);
    this.ctx.lineTo(dropX, height - 25);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    this.ctx.save();
    this.ctx.shadowColor = tier.glow;
    this.ctx.shadowBlur = 12;
    this.ctx.fillStyle = tier.color;
    this.ctx.beginPath();
    this.ctx.arc(dropX, 35, currentRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  render({ width, height, balls, particles, isAiming, dropX, currentTierIndex, isPlaying }) {
    this.clear(width, height);

    if (isAiming && isPlaying) {
      this.drawAimGuide({ dropX, currentTierIndex, height });
    }

    for (let i = 0; i < balls.length; i++) {
      balls[i].draw(this.ctx);
    }

    for (let i = 0; i < particles.length; i++) {
      particles[i].draw(this.ctx);
    }
  }
}
