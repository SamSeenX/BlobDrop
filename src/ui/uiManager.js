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
    this.overlayEmoji = document.getElementById('overlayEmoji');
    this.overlayTitle = document.getElementById('overlayTitle');
    this.overlaySub = document.getElementById('overlaySub');
    this.actionBtn = document.getElementById('actionBtn');
    this.gameOverAd = document.getElementById('gameOverAd');
    this.muteBtn = document.getElementById('muteBtn');
    this.muteIcon = document.getElementById('muteIcon');
    this.muteText = document.getElementById('muteText');

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
      this.comboBadge?.classList.add('hidden');
    });

    eventBus.on('milestone:unlocked', ({ currentTier, nextTier, isWin4096, isGodlike8192 }) => {
      this.handleMilestoneUI({ currentTier, nextTier, isWin4096, isGodlike8192 });
    });

    eventBus.on('game:started', () => {
      this.gameOverlay?.classList.add('opacity-0', 'pointer-events-none');
      this.gameOverAd?.classList.add('hidden');
    });

    eventBus.on('game:over', ({ score }) => {
      if (this.overlayEmoji) this.overlayEmoji.innerText = '💀';
      if (this.overlayTitle) this.overlayTitle.innerText = 'BLOBS OVERFLOWED!';
      if (this.overlaySub) {
        this.overlaySub.innerText = `Final Score: ${score} (Best: ${this.highScore})`;
      }
      this.gameOverAd?.classList.remove('hidden');
      if (this.actionBtn) this.actionBtn.innerText = 'TRY AGAIN';
      this.gameOverlay?.classList.remove('opacity-0', 'pointer-events-none');
    });
  }

  handleMilestoneUI({ currentTier, nextTier, isWin4096, isGodlike8192 }) {
    if (isWin4096) {
      if (this.milestoneEmoji) this.milestoneEmoji.innerText = '🏆';
      if (this.milestoneTitle) this.milestoneTitle.innerText = 'YOU WON 4096!';
      if (this.milestoneDesc) {
        this.milestoneDesc.innerHTML = 'Sensational victory! You crafted the legendary <strong>4096</strong> blob!';
      }
      this.milestoneDareBox?.classList.remove('hidden');
      this.milestoneNextRow?.classList.add('hidden');
      if (this.milestoneContinueBtn) {
        this.milestoneContinueBtn.innerText = 'DARE ACCEPTED: GO FOR 8192!';
        this.milestoneContinueBtn.classList.add('dare-btn-pulse');
      }
    } else if (isGodlike8192) {
      if (this.milestoneEmoji) this.milestoneEmoji.innerText = '👑';
      if (this.milestoneTitle) this.milestoneTitle.innerText = 'GODLIKE: 8192 UNLOCKED!';
      if (this.milestoneDesc) {
        this.milestoneDesc.innerHTML = 'UNBELIEVABLE! You conquered the ultimate <strong>8192</strong> blob!';
      }
      this.milestoneDareBox?.classList.add('hidden');
      this.milestoneNextRow?.classList.add('hidden');
      if (this.milestoneContinueBtn) {
        this.milestoneContinueBtn.innerText = 'KEEP PLAYING';
        this.milestoneContinueBtn.classList.remove('dare-btn-pulse');
      }
    } else {
      if (this.milestoneEmoji) this.milestoneEmoji.innerText = '🎉';
      if (this.milestoneTitle) this.milestoneTitle.innerText = 'MILESTONE UNLOCKED!';
      if (this.milestoneDesc) {
        this.milestoneDesc.innerHTML = `You just unlocked <strong class="milestone-current">${currentTier.name}</strong>`;
      }
      this.milestoneDareBox?.classList.add('hidden');
      if (nextTier) {
        if (this.milestoneNext) this.milestoneNext.innerText = nextTier.name;
        this.milestoneNextRow?.classList.remove('hidden');
      } else {
        this.milestoneNextRow?.classList.add('hidden');
      }
      if (this.milestoneContinueBtn) {
        this.milestoneContinueBtn.innerText = 'CONTINUE';
        this.milestoneContinueBtn.classList.remove('dare-btn-pulse');
      }
    }

    if (this.milestoneOverlay) {
      this.milestoneOverlay.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    }
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
