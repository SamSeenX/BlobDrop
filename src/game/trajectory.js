export function calculateTrajectory({
  originX,
  originY,
  targetX,
  targetY,
  radius,
  width,
  height,
  maxBounces = 2
}) {
  let dx = targetX - originX;
  let dy = targetY - originY;

  // Enforce minimum downward angle so player cannot shoot backwards/upwards
  if (dy < 12) dy = 12;

  const len = Math.hypot(dx, dy) || 1;
  let vx = dx / len;
  let vy = dy / len;

  const points = [{ x: originX, y: originY }];
  let currentX = originX;
  let currentY = originY;

  const leftWall = radius;
  const rightWall = width - radius;
  const floorY = height - 20 - radius;

  for (let b = 0; b <= maxBounces; b++) {
    let tWall = Infinity;
    let willHitWall = false;

    if (vx < -0.001) {
      tWall = (leftWall - currentX) / vx;
      willHitWall = true;
    } else if (vx > 0.001) {
      tWall = (rightWall - currentX) / vx;
      willHitWall = true;
    }

    const tFloor = vy > 0.001 ? (floorY - currentY) / vy : Infinity;

    if (tFloor <= tWall) {
      const endX = Math.max(leftWall, Math.min(rightWall, currentX + vx * tFloor));
      points.push({ x: endX, y: floorY });
      break;
    }

    if (willHitWall && tWall < Infinity) {
      const hitX = vx < 0 ? leftWall : rightWall;
      const hitY = currentY + vy * tWall;

      if (hitY >= floorY) {
        points.push({ x: hitX, y: floorY });
        break;
      }

      points.push({ x: hitX, y: hitY });
      currentX = hitX;
      currentY = hitY;
      vx = -vx;
    } else {
      break;
    }
  }

  return {
    points,
    launchDir: { x: dx / len, y: dy / len }
  };
}
