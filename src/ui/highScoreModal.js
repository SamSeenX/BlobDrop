import { audioManager } from '../audio/sound.js';
import { fireVictoryConfetti, stopVictoryConfetti } from './confetti.js';

export function renderHighScoreModal(ui, score) {
  audioManager.play('victory');

  if (ui.highScoreModalValue) {
    ui.highScoreModalValue.innerText = score;
  }

  const confettiCanvas = document.getElementById('highScoreConfettiCanvas');
  if (ui.highScoreOverlay) {
    ui.highScoreOverlay.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
  }

  requestAnimationFrame(() => fireVictoryConfetti(confettiCanvas));
}

export function cleanupHighScoreModal(ui) {
  const confettiCanvas = document.getElementById('highScoreConfettiCanvas');
  stopVictoryConfetti(confettiCanvas);
  if (ui?.highScoreOverlay) {
    ui.highScoreOverlay.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => ui.highScoreOverlay?.classList.add('hidden'), 200);
  }
}
