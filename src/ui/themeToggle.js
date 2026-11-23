import { themeManager } from '../core/themeManager.js';
import { eventBus } from '../core/eventBus.js';
import { audioManager } from '../audio/sound.js';

export function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const iconSpan = document.getElementById('themeIcon');
  if (!toggleBtn) return;

  const updateIcon = () => {
    if (iconSpan) {
      iconSpan.innerText = themeManager.getThemeIcon();
    }
  };

  updateIcon();

  let isToggling = false;
  const handleToggle = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (isToggling) return;
    isToggling = true;
    setTimeout(() => { isToggling = false; }, 250);
    audioManager.play('drop');
    themeManager.toggleTheme();
  };

  toggleBtn.addEventListener('click', handleToggle);
  toggleBtn.addEventListener('pointerup', handleToggle);
  toggleBtn.addEventListener('touchend', handleToggle);

  eventBus.on('theme:changed', () => {
    updateIcon();
  });
}
