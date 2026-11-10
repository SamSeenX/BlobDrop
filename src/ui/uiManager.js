import { eventBus } from '../core/eventBus.js';
import { storage } from '../core/storage.js';
import { audioManager } from '../audio/sound.js';

export class UIManager {
  constructor() {
    this.scoreDisplay = document.getElementById('scoreDisplay');
    this.bestDisplay = document.getElementById('bestDisplay');
    this.nextCircle = document.getElementById('nextPreviewCircle');
    this.nextName = document.getElementById('nextPreviewName');
    this.comboBadge = document.getElementById('comboBadge');
    this.gameOverlay = document.getElementById('gameOverlay');
    this.overlayTitle = document.getElementById('overlayTitle');
    this.overlaySub = document.getElementById('overlaySub');
    this.actionBtn = document.getElementById('actionBtn');
    this.muteBtn = document.getElementById('muteBtn');
    this.muteIcon = document.getElementById('muteIcon');
    this.muteText = document.getElementById('muteText');

    this.highScore = storage.getHighScore();
    this.init();
  }

  init() {
    this.updateBestDisplay(this.highScore);
    this.updateMuteUI(audioManager.soundEnabled);

    this.muteBtn?.addEventListener('click', () => {
      const isEnabled = audioManager.toggleSound();
      this.updateMuteUI(isEnabled);
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
      if (this.nextName && nextTier) {
        this.nextName.innerText = nextTier.name;
      }
    });

    eventBus.on('combo:update', ({ multiplier }) => {
      if (this.comboBadge && multiplier > 1) {
        this.comboBadge.innerText = `🔥 COMBO x${multiplier}`;
        this.comboBadge.classList.remove('hidden');
      }
    });

    eventBus.on('combo:reset', () => {
      if (this.comboBadge) this.comboBadge.classList.add('hidden');
    });

    eventBus.on('game:started', () => {
      if (this.gameOverlay) {
        this.gameOverlay.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    eventBus.on('game:over', ({ score }) => {
      if (this.overlayTitle) this.overlayTitle.innerText = 'BLOBS OVERFLOWED!';
      if (this.overlaySub) {
        this.overlaySub.innerText = `Your highest blob reached the top! Final Score: ${score}`;
      }
      if (this.actionBtn) this.actionBtn.innerText = 'TRY AGAIN';
      if (this.gameOverlay) {
        this.gameOverlay.classList.remove('opacity-0', 'pointer-events-none');
      }
    });
  }

  updateBestDisplay(score) {
    if (this.bestDisplay) this.bestDisplay.innerText = score;
  }

  updateMuteUI(isEnabled) {
    if (this.muteIcon) this.muteIcon.innerText = isEnabled ? '🔊' : '🔇';
    if (this.muteText) this.muteText.innerText = isEnabled ? 'Sound' : 'Muted';
  }

  bindStartAction(callback) {
    this.actionBtn?.addEventListener('click', callback);
  }
}
