import { TIERS } from '../config/tiers.js';
import { eventBus } from '../core/eventBus.js';

export class TutorialController {
  constructor(engine) {
    this.engine = engine;
    this.container = document.getElementById('phantomContainer');
    this.hand = document.getElementById('phantomHand');
    this.badgeText = document.getElementById('phantomActionText');
    this.timeouts = [];
    this.isRunning = false;

    this.bindEvents();
  }

  bindEvents() {
    const cancel = () => {
      if (this.isRunning) this.stopDemo();
    };

    this.engine.wrapper?.addEventListener('pointerdown', cancel, { passive: true });
    this.engine.wrapper?.addEventListener('touchstart', cancel, { passive: true });
    eventBus.on('game:reset', cancel);
    eventBus.on('game:over', cancel);
    eventBus.on('game:paused', cancel);
  }

  startDemo() {
    this.stopDemo();
    if (!this.container || !this.hand || this.engine.gameState !== 'PLAYING') return;

    this.isRunning = true;
    this.container.classList.remove('hidden');
    requestAnimationFrame(() => this.container?.classList.remove('opacity-0'));

    const steps = [
      { text: 'Direct Shot 🎯', tier: 0, x: 105, y: 310, delay: 500, tapDelay: 600 },
      { text: 'Wall Ricochet ↗️', tier: 1, x: 345, y: 160, delay: 650, tapDelay: 650 },
      { text: 'Match & Merge 💥', tier: 0, x: 105, y: 310, delay: 700, tapDelay: 650 },
      { text: 'Bank Ricochet ↖️', tier: 1, x: 15, y: 160, delay: 700, tapDelay: 650 },
      { text: 'Stack Blobs 🫧', tier: 0, x: 235, y: 300, delay: 700, tapDelay: 650 }
    ];

    let currentWait = 350;

    steps.forEach((step, index) => {
      currentWait += step.delay;
      this.schedule(() => {
        if (!this.isRunning) return;
        this.runStepAim(step);
      }, currentWait);

      currentWait += step.tapDelay;
      this.schedule(() => {
        if (!this.isRunning) return;
        this.runStepDrop(step, index === steps.length - 1);
      }, currentWait);
    });
  }

  runStepAim({ text, tier, x, y }) {
    if (this.badgeText) this.badgeText.innerText = text;
    this.engine.currentTierIndex = tier;
    eventBus.emit('next:update', {
      currentTier: TIERS[this.engine.currentTierIndex],
      nextTier: TIERS[this.engine.nextTierIndex]
    });

    this.updateHandPosition(x, y);
    this.engine.handleAim(x, y);
  }

  runStepDrop(step, isLast) {
    this.hand?.classList.add('tapping');
    this.engine.handleLaunch();

    this.schedule(() => {
      this.hand?.classList.remove('tapping');
      if (isLast) {
        if (this.badgeText) this.badgeText.innerText = 'Your Turn! Drag & Release 🚀';
        this.schedule(() => this.stopDemo(), 1500);
      }
    }, 280);
  }

  updateHandPosition(targetX, targetY) {
    if (!this.hand || !this.engine.wrapper) return;
    const scaleX = this.engine.wrapper.clientWidth / this.engine.width;
    const scaleY = this.engine.wrapper.clientHeight / this.engine.height;
    this.hand.style.left = `${targetX * scaleX}px`;
    this.hand.style.top = `${targetY * scaleY}px`;
  }

  schedule(fn, delay) {
    const id = setTimeout(fn, delay);
    this.timeouts.push(id);
    return id;
  }

  stopDemo() {
    this.isRunning = false;
    this.timeouts.forEach((id) => clearTimeout(id));
    this.timeouts = [];

    this.hand?.classList.remove('tapping');
    if (this.container) {
      this.container.classList.add('opacity-0');
      setTimeout(() => {
        if (!this.isRunning) this.container?.classList.add('hidden');
      }, 250);
    }

    if (this.engine.isAiming) {
      this.engine.isAiming = false;
      this.engine.trajectory = null;
    }
    this.engine.canDrop = true;
  }
}
