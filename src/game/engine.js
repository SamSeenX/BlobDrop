import { TIERS } from '../config/tiers.js';
import { Ball } from './ball.js';
import { resolveCollisions } from './physics.js';
import { audioManager } from '../audio/sound.js';
import { eventBus } from '../core/eventBus.js';
import { InputHandler } from './input.js';
import { calculateTrajectory } from './trajectory.js';
import { updateParticles } from './particle.js';

export class Engine {
  constructor({ canvas, wrapper, renderer }) {
    this.canvas = canvas;
    this.wrapper = wrapper;
    this.renderer = renderer;

    this.width = 300;
    this.height = 450;
    this.originX = 150;
    this.originY = 38;
    this.aimPos = { x: 150, y: 300 };
    this.balls = [];
    this.particles = [];
    this.score = 0;
    this.gameState = 'START';
    this.isAiming = false;
    this.currentTierIndex = 0;
    this.nextTierIndex = 1;
    this.canDrop = true;
    this.comboMultiplier = 1;
    this.comboTimer = 0;
    this.trajectory = null;

    this.input = new InputHandler({
      canvas: this.canvas,
      onAim: (x, y) => this.handleAim(x, y),
      onDrop: () => this.handleLaunch()
    });

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
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.renderer.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  updateTrajectory() {
    this.trajectory = calculateTrajectory({
      originX: this.originX,
      originY: this.originY,
      targetX: this.aimPos.x,
      targetY: this.aimPos.y,
      width: this.width,
      height: this.height
    });
  }

  start() {
    this.balls = [];
    this.particles = [];
    this.score = 0;
    this.comboMultiplier = 1;
    this.comboTimer = 0;
    this.currentTierIndex = Math.floor(Math.random() * 3);
    this.nextTierIndex = Math.floor(Math.random() * 3);
    this.gameState = 'PLAYING';
    this.trajectory = null;
    this.isAiming = false;
    eventBus.emit('score:update', { score: 0 });
    eventBus.emit('next:update', {
      currentTier: TIERS[this.currentTierIndex],
      nextTier: TIERS[this.nextTierIndex]
    });
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
  }

  handleLaunch() {
    if (this.gameState !== 'PLAYING' || !this.canDrop) {
      this.isAiming = false;
      return;
    }
    this.isAiming = false;
    if (!this.trajectory) this.updateTrajectory();

    const speed = 14;
    const vx = this.trajectory.launchDir.x * speed;
    const vy = this.trajectory.launchDir.y * speed;
    this.balls.push(new Ball(this.originX, this.originY, this.currentTierIndex, false, vx, vy));
    audioManager.play('drop');

    this.currentTierIndex = this.nextTierIndex;
    this.nextTierIndex = Math.floor(Math.random() * 4);
    eventBus.emit('next:update', {
      currentTier: TIERS[this.currentTierIndex],
      nextTier: TIERS[this.nextTierIndex]
    });

    this.trajectory = null;
    this.canDrop = false;
    setTimeout(() => { this.canDrop = true; }, 320);
  }

  checkDangerLimit() {
    for (let i = 0; i < this.balls.length; i++) {
      const b = this.balls[i];
      if (!b.isMerging && b.age > 45 && b.y - b.radius <= 75 && Math.abs(b.vy) < 0.6) {
        this.triggerGameOver();
        break;
      }
    }
  }

  update() {
    if (this.gameState !== 'PLAYING') return;

    if (this.comboTimer > 0 && --this.comboTimer === 0) {
      this.comboMultiplier = 1;
      eventBus.emit('combo:reset');
    }

    updateParticles(this.particles);

    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].update(this.width, this.height);
    }

    this.balls = resolveCollisions({
      balls: this.balls,
      particles: this.particles,
      onMerge: (tierIdx) => this.handleMerge(tierIdx)
    });

    this.checkDangerLimit();
  }

  render() {
    this.renderer.render({
      width: this.width,
      height: this.height,
      balls: this.balls,
      particles: this.particles,
      isAiming: this.isAiming,
      originX: this.originX,
      originY: this.originY,
      currentTierIndex: this.currentTierIndex,
      trajectory: this.trajectory,
      isPlaying: this.gameState === 'PLAYING'
    });
  }
}
