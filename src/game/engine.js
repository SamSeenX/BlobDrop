import { TIERS } from '../config/tiers.js';
import { Ball } from './ball.js';
import { resolveCollisions } from './physics.js';
import { audioManager } from '../audio/sound.js';
import { eventBus } from '../core/eventBus.js';
import { InputHandler } from './input.js';
import { calculateTrajectory } from './trajectory.js';
import { updateParticles } from './particle.js';
import { getRandomSpawnTier, checkMilestone, checkDangerLimit, launchBallData } from './spawner.js';

export class Engine {
  constructor({ canvas, wrapper, renderer }) {
    Object.assign(this, {
      canvas, wrapper, renderer,
      width: 300, height: 450,
      originX: 150, originY: 38,
      aimPos: { x: 150, y: 300 },
      balls: [], particles: [], score: 0, gameState: 'START',
      isAiming: false, currentTierIndex: 0, nextTierIndex: 1,
      highestTier: 0, unlockedMilestones: new Set(),
      canDrop: true, comboMultiplier: 1, comboTimer: 0, trajectory: null,
      spawnProgress: 1
    });

    this.input = new InputHandler({
      canvas: this.canvas,
      onAim: (x, y) => this.handleAim(x, y),
      onDrop: () => this.handleLaunch()
    });

    eventBus.on('game:resume', () => this.resume());
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  handleAim(x, y) {
    if (this.gameState !== 'PLAYING') return;
    this.isAiming = true;
    this.aimPos = { x, y };
    this.updateTrajectory();
  }

  resizeCanvas() {
    if (!this.wrapper) return;
    this.width = this.wrapper.clientWidth || 300;
    this.height = this.wrapper.clientHeight || 450;
    this.originX = this.width / 2;
    const d = window.devicePixelRatio || 1;
    this.canvas.width = this.width * d;
    this.canvas.height = this.height * d;
    this.renderer.ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  updateTrajectory() {
    this.trajectory = calculateTrajectory({
      originX: this.originX, originY: this.originY,
      targetX: this.aimPos.x, targetY: this.aimPos.y,
      width: this.width, height: this.height
    });
  }

  pause() {
    if (this.gameState !== 'PLAYING') return;
    this.gameState = 'PAUSED';
    this.isAiming = false;
    this.trajectory = null;
    eventBus.emit('game:paused');
  }

  resume() {
    if (this.gameState !== 'PAUSED') return;
    this.gameState = 'PLAYING';
    eventBus.emit('game:resumed');
  }

  start() {
    Object.assign(this, {
      balls: [], particles: [], score: 0, highestTier: 0,
      comboMultiplier: 1, comboTimer: 0,
      currentTierIndex: getRandomSpawnTier(0), nextTierIndex: getRandomSpawnTier(0),
      gameState: 'PLAYING', trajectory: null, isAiming: false, spawnProgress: 0.15
    });
    this.unlockedMilestones.clear();
    eventBus.emit('score:update', { score: 0 });
    eventBus.emit('next:update', { currentTier: TIERS[this.currentTierIndex], nextTier: TIERS[this.nextTierIndex] });
    eventBus.emit('game:started');
  }

  triggerGameOver() {
    if (this.gameState === 'GAMEOVER') return;
    this.gameState = 'GAMEOVER';
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

    const m = checkMilestone(newTier, this.unlockedMilestones);
    if (m.isMilestone) {
      this.pause();
      eventBus.emit('milestone:unlocked', {
        currentTier: TIERS[m.currentTierIndex],
        nextTier: m.nextMilestoneIndex !== null ? TIERS[m.nextMilestoneIndex] : null
      });
    }
  }

  handleLaunch() {
    if (this.gameState !== 'PLAYING' || !this.canDrop) return;
    this.isAiming = false;
    if (!this.trajectory) this.updateTrajectory();

    const { vx, vy } = launchBallData(this.trajectory);
    this.balls.push(new Ball(this.originX, this.originY, this.currentTierIndex, false, vx, vy));
    audioManager.play('drop');

    this.currentTierIndex = this.nextTierIndex;
    this.nextTierIndex = getRandomSpawnTier(this.highestTier);
    eventBus.emit('next:update', {
      currentTier: TIERS[this.currentTierIndex],
      nextTier: TIERS[this.nextTierIndex]
    });

    this.trajectory = null;
    this.canDrop = false;
    this.spawnProgress = 0;
    setTimeout(() => { this.canDrop = true; }, 320);
  }

  update() {
    if (this.gameState !== 'PLAYING') return;

    if (this.comboTimer > 0 && --this.comboTimer === 0) {
      this.comboMultiplier = 1;
      eventBus.emit('combo:reset');
    }

    if (this.spawnProgress < 1) {
      this.spawnProgress = Math.min(1, this.spawnProgress + 0.065);
    }

    updateParticles(this.particles);

    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].update(this.width, this.height);
    }

    this.balls = resolveCollisions({
      balls: this.balls,
      particles: this.particles,
      width: this.width,
      height: this.height,
      onMerge: (tierIdx) => this.handleMerge(tierIdx)
    });

    if (checkDangerLimit(this.balls)) this.triggerGameOver();
  }

  render() {
    this.renderer.render({
      width: this.width, height: this.height,
      balls: this.balls, particles: this.particles,
      isAiming: this.isAiming, originX: this.originX, originY: this.originY,
      currentTierIndex: this.currentTierIndex, trajectory: this.trajectory,
      spawnProgress: this.spawnProgress, isPlaying: this.gameState === 'PLAYING'
    });
  }
}
