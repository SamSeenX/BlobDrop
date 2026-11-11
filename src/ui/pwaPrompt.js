export function initPwaPrompt() {
  const installBtn = document.getElementById('installPwaBtn');
  if (!installBtn) return;

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
  if (isStandalone) return;

  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    installBtn.classList.add('hidden');
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice && choice.outcome === 'accepted') {
      deferredPrompt = null;
    } else {
      installBtn.classList.remove('hidden');
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installBtn.classList.add('hidden');
  });
}
