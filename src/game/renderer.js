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

  drawTrajectory(trajectory, tier) {
    if (!trajectory) return;

    this.ctx.save();
    const grad = this.ctx.createLinearGradient(
      trajectory.startX,
      trajectory.startY,
      trajectory.endX,
      trajectory.endY
    );
    grad.addColorStop(0, tier.color);
    grad.addColorStop(0.35, tier.color);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.strokeStyle = grad;
    this.ctx.lineWidth = 2.5;
    this.ctx.setLineDash([5, 5]);
    this.ctx.shadowColor = tier.glow;
    this.ctx.shadowBlur = 8;

    this.ctx.beginPath();
    this.ctx.moveTo(trajectory.startX, trajectory.startY);
    this.ctx.lineTo(trajectory.endX, trajectory.endY);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawCannon({ originX, originY, currentTierIndex, isAiming, trajectory }) {
    const tier = TIERS[currentTierIndex];
    if (!tier) return;
    const currentRadius = tier.radius;

    if (isAiming && trajectory) {
      this.drawTrajectory(trajectory, tier);
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

  render({ width, height, balls, particles, isAiming, originX, originY, currentTierIndex, trajectory, isPlaying }) {
    this.clear(width, height);

    if (isPlaying) {
      this.drawCannon({ originX, originY, currentTierIndex, isAiming, trajectory });
    }

    for (let i = 0; i < balls.length; i++) {
      balls[i].draw(this.ctx);
    }

    for (let i = 0; i < particles.length; i++) {
      particles[i].draw(this.ctx);
    }
  }
}
