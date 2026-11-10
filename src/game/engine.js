import { TIERS } from '../config/tiers.js';
import { Ball } from './ball.js';
import { resolveCollisions } from './physics.js';
import { audioManager } from '../audio/sound.js';
import { eventBus } from '../core/eventBus.js';
import { InputHandler } from './input.js';

export class Engine {
  constructor({ canvas, wrapper, renderer }) {
    this.canvas = canvas;
    this.wrapper = wrapper;
    this.renderer = renderer;

    this.width = 300;
    this.height = 450;
    this.balls = [];
    this.particles = [];
    this.score = 0;
    this.gameState = 'START';
    this.dropX = 150;
    this.isAiming = false;
    this.currentTierIndex = 0;
    this.nextTierIndex = 1;
    this.canDrop = true;
    this.comboMultiplier = 1;
    this.comboTimer = 0;

    this.input = new InputHandler({
      canvas: this.canvas,
      getAimRadius: () => TIERS[this.currentTierIndex].radius,
      getWidth: () => this.width,
      onAim: (x) => {
        if (this.gameState !== 'PLAYING') return;
        this.isAiming = true;
        this.dropX = x;
      },
      onDrop: () => this.handleDrop()
    });

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.wrapper) return;
    this.width = this.wrapper.clientWidth || 300;
    this.height = this.wrapper.clientHeight || 450;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    const ctx = this.renderer.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    if (this.dropX > this.width) this.dropX = this.width / 2;
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

    eventBus.emit('score:update', { score: this.score });
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
    const pointsEarned = TIERS[tierIndex].points * this.comboMultiplier;
    this.score += pointsEarned;

    eventBus.emit('score:update', { score: this.score });
    eventBus.emit('combo:update', { multiplier: this.comboMultiplier });
  }

  handleDrop() {
    if (this.gameState !== 'PLAYING' || !this.canDrop) {
      this.isAiming = false;
      return;
    }
    this.isAiming = false;

    const radius = TIERS[this.currentTierIndex].radius;
    const clampedX = Math.max(radius, Math.min(this.width - radius, this.dropX));
    const dropY = Math.max(70 + radius, 40);

    this.balls.push(new Ball(clampedX, dropY, this.currentTierIndex));
    audioManager.play('drop');

    this.currentTierIndex = this.nextTierIndex;
    this.nextTierIndex = Math.floor(Math.random() * 4);
    eventBus.emit('next:update', {
      currentTier: TIERS[this.currentTierIndex],
      nextTier: TIERS[this.nextTierIndex]
    });

    this.canDrop = false;
    setTimeout(() => { this.canDrop = true; }, 300);
  }

  update() {
    if (this.gameState !== 'PLAYING') return;

    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0) {
        this.comboMultiplier = 1;
        eventBus.emit('combo:reset');
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].update(this.width, this.height);
    }

    this.balls = resolveCollisions({
      balls: this.balls,
      particles: this.particles,
      onMerge: (tierIdx) => this.handleMerge(tierIdx)
    });

    const dangerLimitY = 12;
    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];
      if (!ball.isMerging && ball.y - ball.radius <= dangerLimitY && Math.abs(ball.vy) < 0.6) {
        this.triggerGameOver();
        break;
      }
    }
  }

  render() {
    this.renderer.render({
      width: this.width,
      height: this.height,
      balls: this.balls,
      particles: this.particles,
      isAiming: this.isAiming,
      dropX: this.dropX,
      currentTierIndex: this.currentTierIndex,
      isPlaying: this.gameState === 'PLAYING'
    });
  }
}
