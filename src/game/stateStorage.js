import { storage } from '../core/storage.js';
import { Ball } from './ball.js';
import { TIERS } from '../config/tiers.js';
import { eventBus } from '../core/eventBus.js';

export function saveGameState(engine) {
  if (engine.gameState !== 'PLAYING' && engine.gameState !== 'PAUSED') return;
  if (!engine.balls || engine.balls.length === 0) return;

  const serializedBalls = engine.balls
    .filter(b => !b.toRemove)
    .map(b => ({
      x: b.x,
      y: b.y,
      tierIndex: b.tierIndex,
      vx: Math.abs(b.vx) > 0.05 ? b.vx : 0,
      vy: Math.abs(b.vy) > 0.05 ? b.vy : 0
    }));

  storage.setGameState({
    score: engine.score,
    comboMultiplier: engine.comboMultiplier,
    currentTierIndex: engine.currentTierIndex,
    nextTierIndex: engine.nextTierIndex,
    highestTier: engine.highestTier,
    unlockedMilestones: Array.from(engine.unlockedMilestones),
    balls: serializedBalls
  });
}

export function restoreGameState(engine) {
  const saved = storage.getGameState();
  if (!saved || !saved.balls || saved.balls.length === 0) return false;

  engine.balls = saved.balls.map(d =>
    new Ball(d.x, d.y, d.tierIndex, false, d.vx || 0, d.vy || 0, engine.scale)
  );
  engine.score = saved.score || 0;
  engine.comboMultiplier = saved.comboMultiplier || 1;
  engine.currentTierIndex = saved.currentTierIndex ?? 0;
  engine.nextTierIndex = saved.nextTierIndex ?? 1;
  engine.highestTier = saved.highestTier || 0;
  engine.unlockedMilestones = new Set(saved.unlockedMilestones || []);
  engine.gameState = 'PLAYING';

  eventBus.emit('score:update', { score: engine.score });
  eventBus.emit('next:update', {
    currentTier: TIERS[engine.currentTierIndex],
    nextTier: TIERS[engine.nextTierIndex]
  });
  eventBus.emit('game:started');
  return true;
}

export function clearSavedGameState() {
  storage.clearGameState();
}
