import { TIERS } from '../config/tiers.js';

export function calculateTrajectory({
  originX,
  originY,
  targetX,
  targetY,
  width,
  height,
  scale = 1,
  tierIndex = 0
}) {
  let dx = targetX - originX;
  let dy = targetY - originY;

  if (dy < 12 * scale) dy = 12 * scale;

  const len = Math.hypot(dx, dy) || 1;
  const dirX = dx / len;
  const dirY = dy / len;

  const speed = 14 * scale;
  let simVx = dirX * speed;
  let simVy = dirY * speed;
  let simX = originX;
  let simY = originY;

  const tier = TIERS[tierIndex] || TIERS[0];
  const radius = tier.radius * scale;
  const gravity = 0.40 * scale;
  const floorY = height - 20 - radius;

  const points = [{ x: simX, y: simY }];
  const MAX_STEPS = 22;

  for (let i = 0; i < MAX_STEPS; i++) {
    simVy += gravity;
    simVx *= 0.985;
    simVy *= 0.99;

    simX += simVx;
    simY += simVy;

    if (simX - radius < 0) {
      simX = radius;
      simVx = Math.abs(simVx) * 0.88;
    } else if (simX + radius > width) {
      simX = width - radius;
      simVx = -Math.abs(simVx) * 0.88;
    }

    if (simY >= floorY) {
      simY = floorY;
      points.push({ x: simX, y: simY });
      break;
    }

    points.push({ x: simX, y: simY });
  }

  return {
    startX: originX,
    startY: originY,
    endX: points[points.length - 1].x,
    endY: points[points.length - 1].y,
    points,
    launchDir: { x: dirX, y: dirY }
  };
}
