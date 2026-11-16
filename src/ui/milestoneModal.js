import { audioManager } from '../audio/sound.js';
import { fireVictoryConfetti, stopVictoryConfetti } from './confetti.js';

export function renderMilestoneModal(ui, { currentTier, nextTier, isWin4096, isGodlike8192 }) {
  const isVictory = isWin4096 || isGodlike8192;
  audioManager.play(isVictory ? 'victory' : 'milestone');

  const confettiCanvas = document.getElementById('confettiCanvas');
  const modalContent = ui.milestoneContent || document.getElementById('milestoneContent');

  if (isWin4096) {
    if (ui.milestoneEmoji) ui.milestoneEmoji.innerText = '🏆';
    if (ui.milestoneTitle) ui.milestoneTitle.innerText = 'YOU WON 4096!';
    if (ui.milestoneDesc) ui.milestoneDesc.innerHTML = 'Sensational victory! You crafted the legendary <strong>4096</strong> blob!';
    ui.milestoneDareBox?.classList.remove('hidden');
    ui.milestoneNextRow?.classList.add('hidden');
    if (ui.milestoneContinueBtn) {
      ui.milestoneContinueBtn.innerText = 'DARE ACCEPTED: GO FOR 8192!';
      ui.milestoneContinueBtn.classList.add('dare-btn-pulse');
    }
  } else if (isGodlike8192) {
    if (ui.milestoneEmoji) ui.milestoneEmoji.innerText = '👑';
    if (ui.milestoneTitle) ui.milestoneTitle.innerText = 'GODLIKE: 8192 UNLOCKED!';
    if (ui.milestoneDesc) ui.milestoneDesc.innerHTML = 'UNBELIEVABLE! You conquered the ultimate <strong>8192</strong> blob!';
    ui.milestoneDareBox?.classList.add('hidden');
    ui.milestoneNextRow?.classList.add('hidden');
    if (ui.milestoneContinueBtn) {
      ui.milestoneContinueBtn.innerText = 'KEEP PLAYING';
      ui.milestoneContinueBtn.classList.remove('dare-btn-pulse');
    }
  } else {
    if (ui.milestoneEmoji) ui.milestoneEmoji.innerText = '🎉';
    if (ui.milestoneTitle) ui.milestoneTitle.innerText = 'MILESTONE UNLOCKED!';
    if (ui.milestoneDesc) ui.milestoneDesc.innerHTML = `You just unlocked <strong class="milestone-current">${currentTier.name}</strong>`;
    ui.milestoneDareBox?.classList.add('hidden');
    if (nextTier && ui.milestoneNext) {
      ui.milestoneNext.innerText = nextTier.name;
      ui.milestoneNextRow?.classList.remove('hidden');
    } else {
      ui.milestoneNextRow?.classList.add('hidden');
    }
    if (ui.milestoneContinueBtn) {
      ui.milestoneContinueBtn.innerText = 'CONTINUE';
      ui.milestoneContinueBtn.classList.remove('dare-btn-pulse');
    }
  }

  if (ui.milestoneOverlay) {
    ui.milestoneOverlay.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
  }

  if (isVictory) {
    modalContent?.classList.add('milestone-win-flare');
    requestAnimationFrame(() => fireVictoryConfetti(confettiCanvas));
  } else {
    modalContent?.classList.remove('milestone-win-flare');
    stopVictoryConfetti(confettiCanvas);
  }
}

export function cleanupMilestoneModal(ui) {
  const confettiCanvas = document.getElementById('confettiCanvas');
  const modalContent = ui?.milestoneContent || document.getElementById('milestoneContent');
  modalContent?.classList.remove('milestone-win-flare');
  stopVictoryConfetti(confettiCanvas);
}
