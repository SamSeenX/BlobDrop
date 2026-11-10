import { TIERS } from '../config/tiers.js';
import { Ball } from './ball.js';
import { Particle, Shockwave } from './particle.js';
import { audioManager } from '../audio/sound.js';

export function resolveCollisions({ balls, particles, onMerge }) {
  const newBalls = [];

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const b1 = balls[i];
      const b2 = balls[j];

      if (b1.toRemove || b2.toRemove) continue;
      if (b1.isMerging || b2.isMerging) continue;

      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = b1.radius + b2.radius;

      if (dist < minDist) {
        if (b1.tierIndex === b2.tierIndex && b1.tierIndex < TIERS.length - 1) {
          const targetX = (b1.x + b2.x) / 2;
          const targetY = (b1.y + b2.y) / 2;
          const nextTier = b1.tierIndex + 1;

          // Initiate ease-in suction merge
          b1.startMerge(targetX, targetY, nextTier, true);
          b2.startMerge(targetX, targetY, nextTier, false);
        } else {
          // Standard impulse resolution
          const overlap = minDist - dist;
          const nx = dx / (dist || 0.001);
          const ny = dy / (dist || 0.001);

          const totalMass = b1.mass + b2.mass;

          b1.x -= nx * overlap * (b2.mass / totalMass);
          b1.y -= ny * overlap * (b2.mass / totalMass);
          b2.x += nx * overlap * (b1.mass / totalMass);
          b2.y += ny * overlap * (b1.mass / totalMass);

          const kx = b1.vx - b2.vx;
          const ky = b1.vy - b2.vy;
          const p = 1.9 * (nx * kx + ny * ky) / totalMass;

          b1.vx -= p * b2.mass * nx;
          b1.vy -= p * b2.mass * ny;
          b2.vx += p * b1.mass * nx;
          b2.vy += p * b1.mass * ny;
        }
      }
    }
  }

  // Handle completed merge animations
  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];
    if (b.isMerging && b.toRemove && b.isMergeLeader) {
      const nextTier = b.nextTier;
      const color = TIERS[nextTier].color;

      // Spawn shockwave ring and burst particles
      particles.push(new Shockwave(b.targetX, b.targetY, color, TIERS[nextTier].radius * 1.6));
      for (let p = 0; p < 14; p++) {
        particles.push(new Particle(b.targetX, b.targetY, color));
      }

      audioManager.play('merge');
      if (onMerge) {
        onMerge(b.tierIndex);
      }

      newBalls.push(new Ball(b.targetX, b.targetY, nextTier, true));
    }
  }

  const remainingBalls = balls.filter(b => !b.toRemove);
  return remainingBalls.concat(newBalls);
}
