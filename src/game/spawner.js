export function getMinSpawnTier(highestTier) {
  if (highestTier >= 10) return 3; // 2048 unlocked -> min is 16
  if (highestTier >= 9) return 2;  // 1024 unlocked -> min is 8
  if (highestTier >= 8) return 1;  // 512 unlocked -> min is 4
  return 0;                        // base game -> min is 2
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
      nextMilestoneIndex: tierIndex < 11 ? tierIndex + 1 : null
    };
  }
  return { isMilestone: false };
}

export function checkDangerLimit(balls) {
  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];
    if (!b.isMerging && b.age > 45 && b.y - b.radius <= 75 && Math.abs(b.vy) < 0.6) {
      return true;
    }
  }
  return false;
}

export function launchBallData(trajectory, originX, originY, tierIndex, speed = 14) {
  return {
    vx: trajectory.launchDir.x * speed,
    vy: trajectory.launchDir.y * speed
  };
}
