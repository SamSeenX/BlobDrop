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
      const dx = b2.x - b1.x, dy = b2.y - b1.y;
      if (Math.abs(dx) > contactDist || Math.abs(dy) > contactDist) continue;

      if (dx * dx + dy * dy <= contactDist * contactDist) {
        const targetX = (b1.x + b2.x) / 2, targetY = (b1.y + b2.y) / 2;
        const sharedVx = ((b1.vx + b2.vx) * 0.5) * 0.85;
        const sharedVy = ((b1.vy + b2.vy) * 0.5) * 0.85;
        b1.startMerge(targetX, targetY, b1.tierIndex + 1, true, sharedVx, sharedVy, b2);
        b2.startMerge(targetX, targetY, b1.tierIndex + 1, false, sharedVx, sharedVy, b1);
        break;
      }
    }
  }
}

export function resolveCollisions({ balls, particles, width, height, onMerge }) {
  const newBalls = [], n = balls.length;
  detectMerges(balls);

  // Pass 2: Iterative Relaxation Solver with edge containment & cross-blob collision
  for (let iter = 0; iter < SOLVER_ITERATIONS; iter++) {
    for (let i = 0; i < n; i++) {
      const b1 = balls[i];
      if (b1.toRemove) continue;

      for (let j = i + 1; j < n; j++) {
        const b2 = balls[j];
        if (b2.toRemove || (b1.isMerging && b2.isMerging && b1.mergePartner === b2)) continue;

        const minDist = b1.radius + b2.radius;
        const dx = b2.x - b1.x, dy = b2.y - b1.y;
        if (Math.abs(dx) >= minDist || Math.abs(dy) >= minDist) continue;

        const distSq = dx * dx + dy * dy;
        if (distSq >= minDist * minDist || distSq === 0) continue;

        const dist = Math.sqrt(distSq), overlap = minDist - dist;
        const nx = dx / dist, ny = dy / dist;

        const totalMass = b1.mass + b2.mass;
        const invM1 = b2.mass / totalMass, invM2 = b1.mass / totalMass;
        const shift1X = nx * overlap * invM1 * 0.55, shift1Y = ny * overlap * invM1 * 0.55;
        const shift2X = nx * overlap * invM2 * 0.55, shift2Y = ny * overlap * invM2 * 0.55;

        b1.x -= shift1X; b1.y -= shift1Y;
        b2.x += shift2X; b2.y += shift2Y;

        if (b1.isMerging) {
          b1.targetX -= shift1X; b1.targetY -= shift1Y;
          if (b1.mergePartner) {
            b1.mergePartner.targetX = b1.targetX; b1.mergePartner.targetY = b1.targetY;
          }
        }
        if (b2.isMerging) {
          b2.targetX += shift2X; b2.targetY += shift2Y;
          if (b2.mergePartner) {
            b2.mergePartner.targetX = b2.targetX; b2.mergePartner.targetY = b2.targetY;
          }
        }

        const rvx = b2.vx - b1.vx, rvy = b2.vy - b1.vy;
        const velAlongNormal = rvx * nx + rvy * ny;

        if (velAlongNormal < 0) {
          const massDisparity = Math.max(b1.mass, b2.mass) / Math.min(b1.mass, b2.mass);
          const baseRestitution = massDisparity > 2.5 ? 0.38 : 0.20;
          const restitution = Math.abs(velAlongNormal) > RESTITUTION_THRESHOLD ? baseRestitution : 0.0;
          const impulseMag = -(1 + restitution) * velAlongNormal / (1 / b1.mass + 1 / b2.mass);

          b1.vx -= (impulseMag / b1.mass) * nx; b1.vy -= (impulseMag / b1.mass) * ny;
          b2.vx += (impulseMag / b2.mass) * nx; b2.vy += (impulseMag / b2.mass) * ny;

          const tx = -ny, ty = nx;
          const velAlongTangent = rvx * tx + rvy * ty;
          const frictionMag = -velAlongTangent * FRICTION / (1 / b1.mass + 1 / b2.mass);

          b1.vx -= (frictionMag / b1.mass) * tx; b1.vy -= (frictionMag / b1.mass) * ty;
          b2.vx += (frictionMag / b2.mass) * tx; b2.vy += (frictionMag / b2.mass) * ty;

          if (b1.isMerging && b1.mergePartner) {
            b1.mergePartner.vx = b1.vx; b1.mergePartner.vy = b1.vy;
          }
          if (b2.isMerging && b2.mergePartner) {
            b2.mergePartner.vx = b2.vx; b2.mergePartner.vy = b2.vy;
          }
        }
      }
    }

    // Boundary containment within relaxation pass
    if (width && height) {
      for (let i = 0; i < n; i++) {
        const b = balls[i];
        if (b.toRemove) continue;
        const m = b.radius, floorY = height - 20 - m;
        if (b.x - m < 0) b.x = m;
        else if (b.x + m > width) b.x = width - m;
        if (b.y > floorY) b.y = floorY;
        else if (b.y - m < 0) b.y = m;
      }
    }
  }

  detectMerges(balls);

  // Pass 4: Finalize completed merges with contained spawn coordinates
  for (let i = 0; i < n; i++) {
    const b = balls[i];
    if (b.isMerging && b.toRemove && b.isMergeLeader) {
      const nextTier = b.nextTier, color = TIERS[nextTier].color;
      let spawnX = b.targetX, spawnY = b.targetY;
      const nextRadius = TIERS[nextTier].radius;

      if (width && height) {
        spawnX = Math.max(nextRadius, Math.min(width - nextRadius, spawnX));
        spawnY = Math.max(nextRadius, Math.min(height - 20 - nextRadius, spawnY));
      }

      particles.push(new Shockwave(spawnX, spawnY, color, nextRadius * 1.6));
      for (let p = 0; p < 14; p++) particles.push(new Particle(spawnX, spawnY, color));

      audioManager.play('merge');
      if (onMerge) onMerge(b.tierIndex);
      newBalls.push(new Ball(spawnX, spawnY, nextTier, true, b.vx, b.vy));
    }
  }

  return balls.filter(b => !b.toRemove).concat(newBalls);
}
