import { TIERS } from '../config/tiers.js';
import { Ball } from './ball.js';
import { Particle, Shockwave } from './particle.js';
import { audioManager } from '../audio/sound.js';

const SOLVER_ITERATIONS = 4;
const RESTITUTION_THRESHOLD = 0.6;
const FRICTION = 0.22;
const CONTACT_BUFFER = 1.8;

function detectMerges(balls) {
  const n = balls.length;
  for (let i = 0; i < n; i++) {
    const b1 = balls[i];
    if (b1.toRemove || b1.isMerging) continue;

    for (let j = i + 1; j < n; j++) {
      const b2 = balls[j];
      if (b2.toRemove || b2.isMerging) continue;
      if (b1.tierIndex !== b2.tierIndex || b1.tierIndex >= TIERS.length - 1) continue;

      const contactDist = b1.radius + b2.radius + CONTACT_BUFFER;
      const dx = b2.x - b1.x;
      if (Math.abs(dx) > contactDist) continue;
      const dy = b2.y - b1.y;
      if (Math.abs(dy) > contactDist) continue;

      const distSq = dx * dx + dy * dy;
      if (distSq <= contactDist * contactDist) {
        const targetX = (b1.x + b2.x) / 2;
        const targetY = (b1.y + b2.y) / 2;
        b1.startMerge(targetX, targetY, b1.tierIndex + 1, true);
        b2.startMerge(targetX, targetY, b1.tierIndex + 1, false);
        break;
      }
    }
  }
}

export function resolveCollisions({ balls, particles, onMerge }) {
  const newBalls = [];
  const n = balls.length;

  // Pass 1: Initial merge detection on incoming contact
  detectMerges(balls);

  // Pass 2: Iterative Relaxation Solver for rock-solid stability
  for (let iter = 0; iter < SOLVER_ITERATIONS; iter++) {
    for (let i = 0; i < n; i++) {
      const b1 = balls[i];
      if (b1.toRemove || b1.isMerging) continue;

      for (let j = i + 1; j < n; j++) {
        const b2 = balls[j];
        if (b2.toRemove || b2.isMerging) continue;

        const minDist = b1.radius + b2.radius;
        const dx = b2.x - b1.x;
        if (Math.abs(dx) >= minDist) continue;
        const dy = b2.y - b1.y;
        if (Math.abs(dy) >= minDist) continue;

        const distSq = dx * dx + dy * dy;
        if (distSq >= minDist * minDist || distSq === 0) continue;

        const dist = Math.sqrt(distSq);
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;

        const totalMass = b1.mass + b2.mass;
        const invM1 = b2.mass / totalMass;
        const invM2 = b1.mass / totalMass;

        // Position relaxation
        const separationRatio = 0.55;
        b1.x -= nx * overlap * invM1 * separationRatio;
        b1.y -= ny * overlap * invM1 * separationRatio;
        b2.x += nx * overlap * invM2 * separationRatio;
        b2.y += ny * overlap * invM2 * separationRatio;

        // Normal relative velocity
        const rvx = b2.vx - b1.vx;
        const rvy = b2.vy - b1.vy;
        const velAlongNormal = rvx * nx + rvy * ny;

        if (velAlongNormal < 0) {
          const restitution = Math.abs(velAlongNormal) > RESTITUTION_THRESHOLD ? 0.2 : 0.0;
          const impulseMag = -(1 + restitution) * velAlongNormal / (1 / b1.mass + 1 / b2.mass);

          b1.vx -= (impulseMag / b1.mass) * nx;
          b1.vy -= (impulseMag / b1.mass) * ny;
          b2.vx += (impulseMag / b2.mass) * nx;
          b2.vy += (impulseMag / b2.mass) * ny;

          // Tangential friction to eliminate rolling oscillations
          const tx = -ny;
          const ty = nx;
          const velAlongTangent = rvx * tx + rvy * ty;
          const frictionMag = -velAlongTangent * FRICTION / (1 / b1.mass + 1 / b2.mass);

          b1.vx -= (frictionMag / b1.mass) * tx;
          b1.vy -= (frictionMag / b1.mass) * ty;
          b2.vx += (frictionMag / b2.mass) * tx;
          b2.vy += (frictionMag / b2.mass) * ty;
        }
      }
    }
  }

  // Pass 3: Second confirmation pass for balls pushed into contact by solver
  detectMerges(balls);

  // Pass 4: Finalize completed merges
  for (let i = 0; i < n; i++) {
    const b = balls[i];
    if (b.isMerging && b.toRemove && b.isMergeLeader) {
      const nextTier = b.nextTier;
      const color = TIERS[nextTier].color;

      particles.push(new Shockwave(b.targetX, b.targetY, color, TIERS[nextTier].radius * 1.6));
      for (let p = 0; p < 14; p++) {
        particles.push(new Particle(b.targetX, b.targetY, color));
      }

      audioManager.play('merge');
      if (onMerge) onMerge(b.tierIndex);
      newBalls.push(new Ball(b.targetX, b.targetY, nextTier, true));
    }
  }

  const remainingBalls = balls.filter(b => !b.toRemove);
  return remainingBalls.concat(newBalls);
}
