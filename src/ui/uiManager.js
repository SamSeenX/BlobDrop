import { eventBus } from '../core/eventBus.js';
import { storage } from '../core/storage.js';
import { audioManager } from '../audio/sound.js';
import { renderMilestoneModal } from './milestoneModal.js';

export class UIManager {
  constructor() {
    this.scoreDisplay = document.getElementById('scoreDisplay');
    this.bestDisplay = document.getElementById('bestDisplay');
    this.nextCircle = document.getElementById('nextPreviewCircle');
    this.nextName = document.getElementById('nextPreviewName');
    this.comboBadge = document.getElementById('comboBadge');
    this.gameOverlay = document.getElementById('gameOverlay');
    this.overlayEmoji = document.getElementById('overlayEmoji');
    this.overlayTitle = document.getElementById('overlayTitle');
    this.overlaySub = document.getElementById('overlaySub');
    this.actionBtn = document.getElementById('actionBtn');
    this.gameOverAd = document.getElementById('gameOverAd');
    this.muteBtn = document.getElementById('muteBtn');
    this.muteIcon = document.getElementById('muteIcon');
    this.muteText = document.getElementById('muteText');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.pauseIcon = document.getElementById('pauseIcon');
    this.pauseText = document.getElementById('pauseText');

    this.milestoneOverlay = document.getElementById('milestoneOverlay');
    this.milestoneEmoji = document.getElementById('milestoneEmoji');
    this.milestoneTitle = document.getElementById('milestoneTitle');
    this.milestoneDesc = document.getElementById('milestoneDesc');
    this.milestoneDareBox = document.getElementById('milestoneDareBox');
    this.milestoneNext = document.getElementById('milestoneNext');
    this.milestoneNextRow = document.getElementById('milestoneNextRow');
    this.milestoneContinueBtn = document.getElementById('milestoneContinueBtn');

    this.highScore = storage.getHighScore();
    this.init();
  }

  init() {
    this.updateBestDisplay(this.highScore);
    this.updateMuteUI(audioManager.soundEnabled);

    this.muteBtn?.addEventListener('click', () => {
      this.updateMuteUI(audioManager.toggleSound());
    });

    this.pauseBtn?.addEventListener('click', () => {
      eventBus.emit('game:pause:toggle');
    });

    this.milestoneContinueBtn?.addEventListener('click', () => {
      if (this.milestoneOverlay) {
        this.milestoneOverlay.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => this.milestoneOverlay?.classList.add('hidden'), 200);
      }
      eventBus.emit('game:resume');
    });

    eventBus.on('score:update', ({ score }) => {
      if (this.scoreDisplay) this.scoreDisplay.innerText = score;
      if (score > this.highScore) {
        this.highScore = score;
        storage.setHighScore(score);
        this.updateBestDisplay(this.highScore);
      }
    });

    eventBus.on('next:update', ({ nextTier }) => {
      if (this.nextCircle && nextTier) {
        this.nextCircle.style.backgroundColor = nextTier.color;
        this.nextCircle.style.boxShadow = `0 0 10px ${nextTier.glow}`;
      }
      if (this.nextName && nextTier) this.nextName.innerText = nextTier.name;
    });

    eventBus.on('combo:update', ({ multiplier }) => {
      if (this.comboBadge && multiplier > 1) {
        this.comboBadge.innerText = `🔥 COMBO x${multiplier}`;
        this.comboBadge.classList.remove('hidden');
      }
    });

    eventBus.on('combo:reset', () => this.comboBadge?.classList.add('hidden'));

    eventBus.on('game:paused', () => {
      if (this.pauseIcon) this.pauseIcon.innerText = '▶️';
      if (this.pauseText) this.pauseText.innerText = 'Resume';
    });

    eventBus.on('game:resumed', () => {
      if (this.pauseIcon) this.pauseIcon.innerText = '⏸️';
      if (this.pauseText) this.pauseText.innerText = 'Pause';
    });

    eventBus.on('milestone:unlocked', (data) => this.handleMilestoneUI(data));

    eventBus.on('game:started', () => {
      if (this.gameOverlay) {
        this.gameOverlay.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => this.gameOverlay?.classList.add('hidden'), 220);
      }
      this.gameOverAd?.classList.add('hidden');
    });

    eventBus.on('game:over', ({ score }) => {
      if (this.overlayEmoji) this.overlayEmoji.innerText = '💀';
      if (this.overlayTitle) this.overlayTitle.innerText = 'BLOBS OVERFLOWED!';
      if (this.overlaySub) this.overlaySub.innerText = `Final Score: ${score} (Best: ${this.highScore})`;
      this.gameOverAd?.classList.remove('hidden');
      if (this.actionBtn) this.actionBtn.innerText = 'TRY AGAIN';
      if (this.gameOverlay) {
        this.gameOverlay.classList.remove('hidden');
        requestAnimationFrame(() => {
          this.gameOverlay?.classList.remove('opacity-0', 'pointer-events-none');
        });
      }
    });
  }

  handleMilestoneUI(data) {
    renderMilestoneModal(this, data);
  }

  updateBestDisplay(score) {
    if (this.bestDisplay) this.bestDisplay.innerText = score;
  }

  updateMuteUI(isEnabled) {
    if (this.muteIcon) this.muteIcon.innerText = isEnabled ? '🔊' : '🔇';
    if (this.muteText) this.muteText.innerText = isEnabled ? 'Sound' : 'Muted';
  }

  bindStartAction(callback) {
    if (!this.actionBtn) return;
    let handled = false;
    const trigger = (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      if (handled) return;
      handled = true;
      setTimeout(() => { handled = false; }, 300);
      callback();
    };

    this.actionBtn.addEventListener('click', trigger);
    this.actionBtn.addEventListener('pointerup', trigger);
    this.actionBtn.addEventListener('touchend', trigger);
  }
}
