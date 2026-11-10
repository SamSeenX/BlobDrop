export function getMinSpawnTier(highestTier) {
  if (highestTier >= 11) return 4; // 4096 unlocked -> min spawn is 32
  if (highestTier >= 10) return 3; // 2048 unlocked -> min spawn is 16
  if (highestTier >= 9) return 2;  // 1024 unlocked -> min spawn is 8
  if (highestTier >= 8) return 1;  // 512 unlocked -> min spawn is 4
  return 0;                        // base game -> min spawn is 2
}

export function getRandomSpawnTier(highestTier) {
  const minTier = getMinSpawnTier(highestTier);
  return minTier + Math.floor(Math.random() * 4);
}

export function checkMilestone(tierIndex, unlockedSet) {
  if (tierIndex >= 9 && !unlockedSet.has(tierIndex)) {
    unlockedSet.add(tierIndex);
    return {
      isMilestone: true,
      currentTierIndex: tierIndex,
      nextMilestoneIndex: tierIndex < 12 ? tierIndex + 1 : null,
      isWin4096: tierIndex === 11,
      isGodlike8192: tierIndex === 12
    };
  }
  return { isMilestone: false };
}

export function checkDangerLimit(balls, dangerY = 14, scale = 1) {
  const velLimit = 0.6 * scale;
  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];
    if (!b.isMerging && b.age > 45 && b.y - b.radius <= dangerY && Math.abs(b.vy) < velLimit) {
      return true;
    }
  }
  return false;
}

export function launchBallData(trajectory, scale = 1, baseSpeed = 14) {
  const speed = baseSpeed * scale;
  return {
    vx: trajectory.launchDir.x * speed,
    vy: trajectory.launchDir.y * speed
  };
}
