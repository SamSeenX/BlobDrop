import { eventBus } from '../core/eventBus.js';
import { findMatchingBlob, performQuickTap, performDragAim, performAimAndDrop } from './tutorialActions.js';

export class TutorialController {
  constructor(engine) {
    this.engine = engine;
    this.container = document.getElementById('phantomContainer');
    this.hand = document.getElementById('phantomHand');
    this.badgeText = document.getElementById('phantomActionText');
    this.timeouts = [];
    this.animFrame = null;
    this.isRunning = false;
    this.dropCount = 0;

    this.bindEvents();
  }

  bindEvents() {
    const cancel = () => { if (this.isRunning) this.stopDemo(); };
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
    this.dropCount = 0;
    this.container.classList.remove('hidden');
    requestAnimationFrame(() => this.container?.classList.remove('opacity-0'));

    this.scheduleNextAction(400);
  }

  scheduleNextAction(delay = 500) {
    this.schedule(() => {
      if (!this.isRunning || this.engine.gameState !== 'PLAYING') return;
      if (this.dropCount >= 9 || this.engine.isMuzzleBlocked) {
        this.finishDemo();
        return;
      }
      this.executeNextAction();
    }, delay);
  }

  executeNextAction() {
    const match = findMatchingBlob(this.engine.balls, this.engine.currentTierIndex);

    if (match && this.dropCount >= 2) {
      const targetX = Math.max(45, Math.min(315, match.x / this.engine.scale));
      performAimAndDrop(this, 'Match & Merge 💥', targetX, 290, false, true);
      return;
    }

    if (this.dropCount === 0) {
      performQuickTap(this, 'Quick Tap Drop ⚡', 105, 310);
    } else if (this.dropCount === 1) {
      performDragAim(this, 'Hold & Drag to Aim 🎯', 180, 290, 265, 290);
    } else if (this.dropCount === 2) {
      performAimAndDrop(this, 'Wall Ricochet ↗️', 345, 160, true);
    } else if (this.dropCount === 3) {
      performAimAndDrop(this, 'Bank Ricochet ↖️', 15, 160, true);
    } else if (this.dropCount % 2 === 0) {
      const endX = 75 + (this.dropCount * 43) % 210;
      performDragAim(this, 'Aim & Redirect 🏹', 180, 290, endX, 290);
    } else {
      const x = 80 + (this.dropCount * 57) % 200;
      performAimAndDrop(this, 'Stack & Balance ⚖️', x, 300);
    }
  }

  finishDemo() {
    this.setBadge('Your Turn! Drag to Aim & Release 🚀');
    this.schedule(() => this.stopDemo(), 1500);
  }

  setBadge(text) {
    if (this.badgeText) this.badgeText.innerText = text;
  }

  updateHandPos(targetX, targetY) {
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
    if (this.animFrame) cancelAnimationFrame(this.animFrame);

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
