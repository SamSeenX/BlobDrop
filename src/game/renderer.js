import { TIERS } from '../config/tiers.js';

export class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  clear(width, height) {
    this.ctx.clearRect(0, 0, width, height);

    // Subtle background grid
    this.ctx.strokeStyle = 'rgba(244, 63, 94, 0.05)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let x = 30; x < width; x += 40) {
      this.ctx.moveTo(x, 40);
      this.ctx.lineTo(x, height - 20);
    }
    this.ctx.stroke();

    // Subtle danger / cannon threshold guide line
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.setLineDash([4, 6]);
    this.ctx.beginPath();
    this.ctx.moveTo(10, 75);
    this.ctx.lineTo(width - 10, 75);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  drawTrajectory(points, tier) {
    if (!points || points.length < 2) return;

    this.ctx.save();
    this.ctx.strokeStyle = tier.color;
    this.ctx.lineWidth = 2.5;
    this.ctx.setLineDash([6, 6]);
    this.ctx.shadowColor = tier.glow;
    this.ctx.shadowBlur = 8;

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw bounce impact rings
    for (let i = 1; i < points.length - 1; i++) {
      this.ctx.beginPath();
      this.ctx.arc(points[i].x, points[i].y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = tier.glow;
      this.ctx.fill();
    }

    // Terminal landing reticle
    const last = points[points.length - 1];
    this.ctx.beginPath();
    this.ctx.arc(last.x, last.y, 8, 0, Math.PI * 2);
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawNextBallPreview(originX, originY, nextTierIndex) {
    const nextTier = TIERS[nextTierIndex];
    if (!nextTier) return;

    const previewX = originX;
    const previewY = Math.max(12, originY - 26);
    const previewRadius = Math.min(14, nextTier.radius * 0.75);

    this.ctx.save();
    // Subtle queue pill background
    this.ctx.fillStyle = 'rgba(10, 15, 29, 0.85)';
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(previewX - 32, previewY - 14, 64, 28, 14);
    this.ctx.fill();
    this.ctx.stroke();

    // Next badge text
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx.font = '700 8px Outfit, sans-serif';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('NEXT', previewX - 4, previewY);

    // Mini next ball
    this.ctx.shadowColor = nextTier.glow;
    this.ctx.shadowBlur = 6;
    this.ctx.fillStyle = nextTier.color;
    this.ctx.beginPath();
    this.ctx.arc(previewX + 14, previewY, previewRadius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#07090e';
    this.ctx.font = `900 ${Math.max(8, previewRadius * 0.8)}px Outfit, sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(nextTier.name, previewX + 14, previewY + 0.5);

    this.ctx.restore();
  }

  drawCannon({ originX, originY, currentTierIndex, nextTierIndex, isAiming, trajectory }) {
    const tier = TIERS[currentTierIndex];
    const currentRadius = tier.radius;

    if (isAiming && trajectory) {
      this.drawTrajectory(trajectory.points, tier);
      this.drawNextBallPreview(originX, originY, nextTierIndex);
    }

    // Active ball in cannon muzzle
    this.ctx.save();
    this.ctx.shadowColor = tier.glow;
    this.ctx.shadowBlur = 12;
    this.ctx.fillStyle = tier.color;
    this.ctx.beginPath();
    this.ctx.arc(originX, originY, currentRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Specular highlight & label
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.beginPath();
    this.ctx.arc(originX - currentRadius * 0.35, originY - currentRadius * 0.35, currentRadius * 0.28, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#07090e';
    this.ctx.font = `900 ${Math.max(11, currentRadius * 0.48)}px Outfit, sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(tier.name, originX, originY + 1);
    this.ctx.restore();
  }

  render({ width, height, balls, particles, isAiming, originX, originY, currentTierIndex, nextTierIndex, trajectory, isPlaying }) {
    this.clear(width, height);

    if (isPlaying) {
      this.drawCannon({ originX, originY, currentTierIndex, nextTierIndex, isAiming, trajectory });
    }

    for (let i = 0; i < balls.length; i++) {
      balls[i].draw(this.ctx);
    }

    for (let i = 0; i < particles.length; i++) {
      particles[i].draw(this.ctx);
    }
  }
}
