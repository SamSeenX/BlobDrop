export function getMinSpawnTier(highestTier) {
  if (highestTier >= 11) return 4;
  if (highestTier >= 10) return 3;
  if (highestTier >= 9) return 2;
  if (highestTier >= 8) return 1;
  return 0;
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

export function checkDangerLimit(balls, originX, originY, dangerY = 45, spawnRadius = 20) {
  let hasOverflow = false;
  let isMuzzleBlocked = false;

  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];
    if (b.toRemove || b.isMerging) continue;

    const distToCannon = Math.hypot(b.x - originX, b.y - originY);
    if (b.age > 25 && distToCannon < b.radius + spawnRadius * 0.75) {
      isMuzzleBlocked = true;
      hasOverflow = true;
      break;
    }

    if (b.age > 40 && b.y - b.radius <= dangerY) {
      hasOverflow = true;
    }
  }

  return { hasOverflow, isMuzzleBlocked };
}

export function launchBallData(trajectory, scale = 1, baseSpeed = 14) {
  const speed = baseSpeed * scale;
  return {
    vx: trajectory.launchDir.x * speed,
    vy: trajectory.launchDir.y * speed
  };
}
