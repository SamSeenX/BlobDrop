import { TIERS } from '../config/tiers.js';
import { Ball } from './ball.js';
import { resolveCollisions } from './physics.js';
import { audioManager } from '../audio/sound.js';
import { eventBus } from '../core/eventBus.js';
import { InputHandler } from './input.js';
import { calculateTrajectory } from './trajectory.js';
import { updateParticles } from './particle.js';
import { getRandomSpawnTier, checkMilestone, checkDangerLimit, launchBallData } from './spawner.js';
import { applyCanvasResize } from './layout.js';
import { saveGameState, restoreGameState, clearSavedGameState } from './stateStorage.js';

export class Engine {
  constructor({ canvas, wrapper, renderer }) {
    Object.assign(this, {
      canvas, wrapper, renderer, width: 360, height: 540, scale: 1, dangerY: 45, originX: 180, originY: 38,
      aimPos: { x: 180, y: 300 }, balls: [], particles: [], score: 0, gameState: 'START', isAiming: false,
      currentTierIndex: 0, nextTierIndex: 1, highestTier: 0, unlockedMilestones: new Set(), canDrop: true,
      comboMultiplier: 1, comboTimer: 0, trajectory: null, spawnProgress: 1, dangerTimer: 0, isMuzzleBlocked: false
    });

    this.dangerEl = document.getElementById('dangerLine');
    this.input = new InputHandler({
      canvas: this.canvas, onAim: (x, y) => this.handleAim(x, y), onDrop: () => this.handleLaunch()
    });

    eventBus.on('game:resume', () => this.resume());
    eventBus.on('game:pause:toggle', () => (this.gameState === 'PLAYING' ? this.pause() : this.resume()));
    eventBus.on('game:reset', () => this.handleReset());
    window.addEventListener('beforeunload', () => saveGameState(this));
    document.addEventListener('visibilitychange', () => { if (document.hidden) saveGameState(this); });

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    restoreGameState(this);
  }

  handleAim(x, y) {
    if (this.gameState !== 'PLAYING') return;
    this.isAiming = true;
    this.aimPos = { x, y };
    this.updateTrajectory();
  }

  resizeCanvas() {
    applyCanvasResize({ wrapper: this.wrapper, canvas: this.canvas, renderer: this.renderer, engine: this });
  }

  updateTrajectory() {
    this.trajectory = calculateTrajectory({
      originX: this.originX, originY: this.originY, targetX: this.aimPos.x, targetY: this.aimPos.y,
      width: this.width, height: this.height, scale: this.scale, tierIndex: this.currentTierIndex
    });
  }

  pause() {
    if (this.gameState !== 'PLAYING') return;
    this.gameState = 'PAUSED';
    this.isAiming = false;
    this.trajectory = null;
    saveGameState(this);
    eventBus.emit('game:paused');
  }

  resume() {
    if (this.gameState !== 'PAUSED') return;
    this.gameState = 'PLAYING';
    eventBus.emit('game:resumed');
  }

  handleReset() {
    if ((this.balls.length > 0 || this.score > 0) && !window.confirm('Start a new game? Current board will be reset.')) return;
    this.start();
  }

  start() {
    clearSavedGameState();
    Object.assign(this, {
      balls: [], particles: [], score: 0, highestTier: 0, comboMultiplier: 1, comboTimer: 0,
      dangerTimer: 0, isMuzzleBlocked: false, gameState: 'PLAYING', canDrop: true,
      currentTierIndex: getRandomSpawnTier(0), nextTierIndex: getRandomSpawnTier(0),
      trajectory: null, isAiming: false, spawnProgress: 0.15
    });
    this.unlockedMilestones.clear();
    this.dangerEl?.classList.remove('danger-active');
    eventBus.emit('score:update', { score: 0 });
    eventBus.emit('next:update', { currentTier: TIERS[this.currentTierIndex], nextTier: TIERS[this.nextTierIndex] });
    eventBus.emit('game:started');
  }

  triggerGameOver() {
    if (this.gameState === 'GAMEOVER') return;
    this.gameState = 'GAMEOVER';
    this.dangerEl?.classList.remove('danger-active');
    clearSavedGameState();
    audioManager.play('gameover');
    eventBus.emit('game:over', { score: this.score });
  }

  handleMerge(tierIndex) {
    this.comboTimer = 45;
    this.comboMultiplier = Math.min(8, this.comboMultiplier + 1);
    this.score += TIERS[tierIndex].points * this.comboMultiplier;
    eventBus.emit('score:update', { score: this.score });
    eventBus.emit('combo:update', { multiplier: this.comboMultiplier });
    const newTier = tierIndex + 1;
    if (newTier > this.highestTier) this.highestTier = newTier;
    saveGameState(this);

    const m = checkMilestone(newTier, this.unlockedMilestones);
    if (m.isMilestone) {
      this.pause();
      eventBus.emit('milestone:unlocked', {
        currentTier: TIERS[m.currentTierIndex],
        nextTier: m.nextMilestoneIndex !== null ? TIERS[m.nextMilestoneIndex] : null,
        isWin4096: m.isWin4096, isGodlike8192: m.isGodlike8192
      });
    }
  }

  handleLaunch() {
    if (this.gameState !== 'PLAYING' || !this.canDrop || this.isMuzzleBlocked) return;
    this.isAiming = false;
    if (!this.trajectory) this.updateTrajectory();

    const { vx, vy } = launchBallData(this.trajectory, this.scale);
    this.balls.push(new Ball(this.originX, this.originY, this.currentTierIndex, false, vx, vy, this.scale));
    audioManager.play('drop');

    this.currentTierIndex = this.nextTierIndex;
    this.nextTierIndex = getRandomSpawnTier(this.highestTier);
    eventBus.emit('next:update', { currentTier: TIERS[this.currentTierIndex], nextTier: TIERS[this.nextTierIndex] });
    this.trajectory = null;
    this.canDrop = false;
    this.spawnProgress = 0;
    saveGameState(this);
    setTimeout(() => { this.canDrop = true; }, 320);
  }

  update() {
    if (this.gameState !== 'PLAYING') return;

    if (this.comboTimer > 0 && --this.comboTimer === 0) {
      this.comboMultiplier = 1;
      eventBus.emit('combo:reset');
    }

    if (this.spawnProgress < 1) this.spawnProgress = Math.min(1, this.spawnProgress + 0.065);
    updateParticles(this.particles);

    for (let i = 0; i < this.balls.length; i++) this.balls[i].update(this.width, this.height);

    this.balls = resolveCollisions({
      balls: this.balls, particles: this.particles, width: this.width, height: this.height,
      scale: this.scale, onMerge: (tierIdx) => this.handleMerge(tierIdx)
    });

    const spawnR = (TIERS[this.currentTierIndex]?.radius || 15) * this.scale;
    const danger = checkDangerLimit(this.balls, this.originX, this.originY, this.dangerY, spawnR);
    this.isMuzzleBlocked = danger.isMuzzleBlocked;

    if (danger.hasOverflow) {
      this.dangerEl?.classList.add('danger-active');
      if (++this.dangerTimer >= (danger.isMuzzleBlocked ? 25 : 55)) this.triggerGameOver();
    } else {
      this.dangerTimer = 0;
      this.dangerEl?.classList.remove('danger-active');
    }
  }

  render() {
    this.renderer.render({
      width: this.width, height: this.height, dangerY: this.dangerY, scale: this.scale,
      balls: this.balls, particles: this.particles, isAiming: this.isAiming, originX: this.originX,
      originY: this.originY, currentTierIndex: this.currentTierIndex, trajectory: this.trajectory,
      spawnProgress: this.spawnProgress, isPlaying: this.gameState === 'PLAYING'
    });
  }
}
