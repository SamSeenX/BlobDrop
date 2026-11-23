import { eventBus } from '../core/eventBus.js';
import { storage } from '../core/storage.js';
import { audioManager } from '../audio/sound.js';
import { renderMilestoneModal, cleanupMilestoneModal } from './milestoneModal.js';
import { renderHighScoreModal, cleanupHighScoreModal } from './highScoreModal.js';

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
    this.gameOverPromo = document.getElementById('gameOverPromo');
    this.muteBtn = document.getElementById('muteBtn');
    this.muteIcon = document.getElementById('muteIcon');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.pauseIcon = document.getElementById('pauseIcon');
    this.resetBtn = document.getElementById('resetBtn');

    this.milestoneOverlay = document.getElementById('milestoneOverlay');
    this.milestoneEmoji = document.getElementById('milestoneEmoji');
    this.milestoneTitle = document.getElementById('milestoneTitle');
    this.milestoneDesc = document.getElementById('milestoneDesc');
    this.milestoneDareBox = document.getElementById('milestoneDareBox');
    this.milestoneNext = document.getElementById('milestoneNext');
    this.milestoneNextRow = document.getElementById('milestoneNextRow');
    this.milestoneContinueBtn = document.getElementById('milestoneContinueBtn');
    this.highScoreOverlay = document.getElementById('highScoreOverlay');
    this.highScoreModalValue = document.getElementById('highScoreModalValue');
    this.highScoreContinueBtn = document.getElementById('highScoreContinueBtn');

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

    this.resetBtn?.addEventListener('click', () => {
      eventBus.emit('game:reset');
    });

    this.milestoneContinueBtn?.addEventListener('click', () => {
      cleanupMilestoneModal(this);
      if (this.milestoneOverlay) {
        this.milestoneOverlay.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => this.milestoneOverlay?.classList.add('hidden'), 200);
      }
      eventBus.emit('game:resume');
    });

    const closeHighScore = (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      cleanupHighScoreModal(this);
      eventBus.emit('game:resume');
    };
    this.highScoreContinueBtn?.addEventListener('click', closeHighScore);
    this.highScoreContinueBtn?.addEventListener('pointerup', closeHighScore);
    this.highScoreContinueBtn?.addEventListener('touchend', closeHighScore);

    eventBus.on('highscore:unlocked', ({ score }) => {
      renderHighScoreModal(this, score);
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
        this.comboBadge.classList.remove('hidden', 'combo-pop');
        void this.comboBadge.offsetWidth;
        this.comboBadge.classList.add('combo-pop');
      }
    });

    eventBus.on('combo:reset', () => {
      if (this.comboBadge) {
        this.comboBadge.classList.remove('combo-pop');
        this.comboBadge.classList.add('hidden');
      }
    });

    eventBus.on('game:paused', () => {
      if (this.pauseIcon) this.pauseIcon.innerText = '▶️';
    });

    eventBus.on('game:resumed', () => {
      if (this.pauseIcon) this.pauseIcon.innerText = '⏸️';
    });

    eventBus.on('milestone:unlocked', (data) => this.handleMilestoneUI(data));

    eventBus.on('game:started', () => {
      if (this.gameOverlay) {
        this.gameOverlay.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => this.gameOverlay?.classList.add('hidden'), 220);
      }
      this.gameOverPromo?.classList.add('hidden');
    });

    eventBus.on('game:over', ({ score }) => {
      if (this.overlayEmoji) this.overlayEmoji.innerText = '💀';
      if (this.overlayTitle) this.overlayTitle.innerText = 'BLOBS OVERFLOWED!';
      if (this.overlaySub) this.overlaySub.innerText = `Final Score: ${score} (Best: ${this.highScore})`;
      this.gameOverPromo?.classList.remove('hidden');
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
