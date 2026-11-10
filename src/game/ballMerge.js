export function updateMergeAnimation(ball, width, height, floorY, m) {
  ball.mergeFrame++;
  ball.vy += 0.35 * (ball.scale || 1);
  ball.vx *= 0.985;
  ball.vy *= 0.99;
  ball.targetX += ball.vx;
  ball.targetY += ball.vy;

  // Bound target center of mass to playfield
  if (ball.targetX - m < 0) {
    ball.targetX = m;
    ball.vx = Math.abs(ball.vx) * 0.70;
  } else if (ball.targetX + m > width) {
    ball.targetX = width - m;
    ball.vx = -Math.abs(ball.vx) * 0.70;
  }

  if (ball.targetY > floorY) {
    ball.targetY = floorY;
    ball.vy = -Math.abs(ball.vy) * 0.20;
    ball.vx *= 0.88;
  } else if (ball.targetY - m < 0) {
    ball.targetY = m;
    ball.vy = Math.abs(ball.vy) * 0.5;
  }

  // Wobble & suction animation
  if (ball.mergeFrame <= ball.wobbleDuration) {
    const progress = ball.mergeFrame / ball.wobbleDuration;
    const wobble = Math.sin(progress * Math.PI);
    ball.scaleX = 1 + wobble * 0.24;
    ball.scaleY = 1 - wobble * 0.20;
    ball.x = ball.targetX + ball.offsetX;
    ball.y = ball.targetY + ball.offsetY;
  } else {
    const suction = (ball.mergeFrame - ball.wobbleDuration) / (ball.mergeDuration - ball.wobbleDuration);
    const easeIn = Math.min(1, suction) ** 3;
    ball.x = ball.targetX + ball.offsetX * (1 - easeIn);
    ball.y = ball.targetY + ball.offsetY * (1 - easeIn);
    const squish = Math.max(0.18, 1 - easeIn * 0.72);
    ball.scaleX = squish;
    ball.scaleY = squish;
    ball.alpha = Math.max(0.15, 1 - easeIn * 0.8);

    if (ball.mergeFrame >= ball.mergeDuration) ball.toRemove = true;
  }

  // Guarded edge clamp during merge animation
  if (ball.x - m < 0) {
    ball.x = m;
    ball.vx = Math.abs(ball.vx) * 0.70;
  } else if (ball.x + m > width) {
    ball.x = width - m;
    ball.vx = -Math.abs(ball.vx) * 0.70;
  }
  if (ball.y > floorY) {
    ball.y = floorY;
    ball.vy = -Math.abs(ball.vy) * 0.20;
  } else if (ball.y - m < 0) {
    ball.y = m;
  }
}
