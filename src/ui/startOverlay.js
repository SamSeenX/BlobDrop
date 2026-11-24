import { hasSavedGame, getSavedGameScore } from '../game/stateStorage.js';
import { eventBus } from '../core/eventBus.js';

export class StartOverlay {
  constructor({ onResume, onNewGame }) {
    this.resumeBtn = document.getElementById('resumeBtn');
    this.resumeScore = document.getElementById('resumeScore');
    this.actionBtn = document.getElementById('actionBtn');
    this.overlayTitle = document.getElementById('overlayTitle');
    this.overlaySub = document.getElementById('overlaySub');
    this.onResume = onResume;
    this.onNewGame = onNewGame;

    this.init();
  }

  init() {
    this.checkSavedGame();
    this.bindEvents();
  }

  checkSavedGame() {
    if (hasSavedGame()) {
      const score = getSavedGameScore();
      if (this.resumeScore) this.resumeScore.innerText = score.toLocaleString();
      this.resumeBtn?.classList.remove('hidden');
      if (this.actionBtn) {
        this.actionBtn.innerText = 'NEW GAME';
        this.actionBtn.classList.add('secondary-btn');
      }
      if (this.overlayTitle) this.overlayTitle.innerText = 'RESUME SESSION?';
      if (this.overlaySub) this.overlaySub.innerText = `You have an active run with ${score.toLocaleString()} points.`;
    } else {
      this.resumeBtn?.classList.add('hidden');
      if (this.actionBtn) {
        this.actionBtn.innerText = 'PLAY NOW';
        this.actionBtn.classList.remove('secondary-btn');
      }
    }
  }

  bindEvents() {
    const triggerResume = (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      this.resumeBtn?.classList.add('hidden');
      this.onResume?.();
    };

    this.resumeBtn?.addEventListener('click', triggerResume);
    this.resumeBtn?.addEventListener('pointerup', triggerResume);
    this.resumeBtn?.addEventListener('touchend', triggerResume);

    eventBus.on('game:over', () => {
      this.resumeBtn?.classList.add('hidden');
      this.actionBtn?.classList.remove('secondary-btn');
    });

    eventBus.on('game:reset:confirmed', () => {
      this.resumeBtn?.classList.add('hidden');
      this.actionBtn?.classList.remove('secondary-btn');
    });
  }
}
