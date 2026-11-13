import { hapticManager } from '../audio/haptics.js';
import { eventBus } from '../core/eventBus.js';

export class ConfirmModal {
  constructor() {
    this.overlay = document.getElementById('confirmResetOverlay');
    this.cancelBtn = document.getElementById('cancelResetBtn');
    this.confirmBtn = document.getElementById('confirmResetBtn');
    this.wasPlaying = false;
    this.init();
  }

  init() {
    if (!this.overlay) return;

    this.cancelBtn?.addEventListener('click', () => {
      hapticManager.trigger('drop');
      this.close();
      if (this.wasPlaying) {
        eventBus.emit('game:resume');
      }
    });

    this.confirmBtn?.addEventListener('click', () => {
      hapticManager.trigger('merge');
      this.close();
      eventBus.emit('game:reset:confirmed');
    });

    eventBus.on('confirm:reset:open', ({ wasPlaying }) => {
      this.wasPlaying = wasPlaying;
      this.open();
    });
  }

  open() {
    if (!this.overlay) return;
    this.overlay.classList.remove('hidden');
    requestAnimationFrame(() => {
      this.overlay.classList.remove('opacity-0', 'pointer-events-none');
    });
  }

  close() {
    if (!this.overlay) return;
    this.overlay.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      this.overlay.classList.add('hidden');
    }, 200);
  }
}
