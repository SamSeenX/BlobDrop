import { TIERS } from '../config/tiers.js';
import { spriteCache } from './spriteCache.js';

export class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  clear(width, height, dangerY = 75) {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    this.ctx.strokeStyle = 'rgba(244, 63, 94, 0.05)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let x = 30; x < width; x += 40) {
      this.ctx.moveTo(x, 40);
      this.ctx.lineTo(x, height - 20);
    }
    this.ctx.stroke();

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.setLineDash([4, 6]);
    this.ctx.beginPath();
    this.ctx.moveTo(10, dangerY);
    this.ctx.lineTo(width - 10, dangerY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  drawTrajectory(trajectory, tier) {
    if (!trajectory) return;
    this.ctx.save();
    const grad = this.ctx.createLinearGradient(
      trajectory.startX, trajectory.startY,
      trajectory.endX, trajectory.endY
    );
    grad.addColorStop(0, tier.color);
    grad.addColorStop(0.35, tier.color);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.strokeStyle = grad;
    this.ctx.lineWidth = 2.5;
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(trajectory.startX, trajectory.startY);
    this.ctx.lineTo(trajectory.endX, trajectory.endY);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawCannon({ originX, originY, currentTierIndex, isAiming, trajectory, spawnProgress = 1, scale = 1 }) {
    const tier = TIERS[currentTierIndex];
    if (!tier) return;

    if (isAiming && trajectory) this.drawTrajectory(trajectory, tier);

    const radius = tier.radius * scale;
    const sprite = spriteCache.getSprite(currentTierIndex, radius);
    if (!sprite) return;

    let y = originY, scaleX = 1, scaleY = 1;
    if (spawnProgress < 1) {
      const dropT = Math.min(1, spawnProgress / 0.65);
      const easeDrop = 1 - Math.cos((dropT * Math.PI) / 2);
      const startY = -radius - 10;
      y = startY + (originY - startY) * easeDrop;

      if (spawnProgress > 0.5) {
        const bounceT = (spawnProgress - 0.5) / 0.5;
        const wobble = Math.sin(bounceT * Math.PI * 2) * Math.exp(-bounceT * 3.5) * 0.16;
        scaleX = 1 + wobble;
        scaleY = 1 - wobble;
      }
    }

    this.ctx.save();
    this.ctx.translate(originX, y);
    if (scaleX !== 1 || scaleY !== 1) this.ctx.scale(scaleX, scaleY);
    this.ctx.drawImage(sprite.canvas, -sprite.offset, -sprite.offset);
    this.ctx.restore();
  }

  render({ width, height, dangerY = 75, scale = 1, balls, particles, isAiming, originX, originY, currentTierIndex, trajectory, spawnProgress, isPlaying }) {
    this.clear(width, height, dangerY);

    if (isPlaying) {
      this.drawCannon({ originX, originY, currentTierIndex, isAiming, trajectory, spawnProgress, scale });
    }

    const sortedBalls = balls.slice().sort((a, b) => b.tierIndex - a.tierIndex);
    for (let i = 0; i < sortedBalls.length; i++) sortedBalls[i].draw(this.ctx);
    for (let i = 0; i < particles.length; i++) particles[i].draw(this.ctx);
  }
}
