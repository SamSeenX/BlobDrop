export function calculateTrajectory({
  originX,
  originY,
  targetX,
  targetY,
  width,
  height
}) {
  let dx = targetX - originX;
  let dy = targetY - originY;

  // Enforce minimum downward angle so ball shoots towards the board
  if (dy < 12) dy = 12;

  const len = Math.hypot(dx, dy) || 1;
  const vx = dx / len;
  const vy = dy / len;

  // Fade-off ray length: reaches into the upper-middle of screen (~200px max)
  const maxDistance = Math.min(210, height * 0.45);
  let distance = maxDistance;

  // Stop trajectory line before penetrating wall boundary
  const edgeMargin = 16;
  if (vx < -0.001) {
    const tWall = (edgeMargin - originX) / vx;
    if (tWall > 0 && tWall < distance) distance = tWall;
  } else if (vx > 0.001) {
    const tWall = (width - edgeMargin - originX) / vx;
    if (tWall > 0 && tWall < distance) distance = tWall;
  }

  const endX = originX + vx * distance;
  const endY = originY + vy * distance;

  return {
    startX: originX,
    startY: originY,
    endX,
    endY,
    launchDir: { x: vx, y: vy }
  };
}
