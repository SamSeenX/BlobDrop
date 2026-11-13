import { initErrorBoundary } from './core/errorBoundary.js';
import { storage } from './core/storage.js';
import { Renderer } from './game/renderer.js';
import { Engine } from './game/engine.js';
import { UIManager } from './ui/uiManager.js';
import { ConfirmModal } from './ui/confirmModal.js';
import { initPwaPrompt } from './ui/pwaPrompt.js';
import { initAdSystem } from './ui/adManager.js';
import { TIERS } from './config/tiers.js';
import { eventBus } from './core/eventBus.js';
import { Capacitor } from '@capacitor/core';

initErrorBoundary();
storage.initPersistence();

if ('serviceWorker' in navigator) {
  const isNative = Capacitor.isNativePlatform();
  if (isNative || import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const reg of regs) reg.unregister();
    });
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const k of keys) caches.delete(k);
      });
    }
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}

const canvas = document.getElementById('gameCanvas');
const wrapper = document.getElementById('canvasWrapper');
const ctx = canvas.getContext('2d');

const uiManager = new UIManager();
const confirmModal = new ConfirmModal();
const renderer = new Renderer(canvas, ctx);
const engine = new Engine({ canvas, wrapper, renderer });
initPwaPrompt();
initAdSystem();

uiManager.bindStartAction(() => {
  engine.start();
});

// Initial UI Preview before first play
eventBus.emit('next:update', {
  currentTier: TIERS[0],
  nextTier: TIERS[1]
});

eventBus.on('game:resumed', () => {
  lastTimestamp = performance.now();
  accumulator = 0;
});

const FIXED_TIMESTEP = 1000 / 60;
let lastTimestamp = performance.now();
let accumulator = 0;

function loop(currentTimestamp) {
  const delta = Math.min(100, currentTimestamp - lastTimestamp);
  lastTimestamp = currentTimestamp;
  accumulator += delta;

  while (accumulator >= FIXED_TIMESTEP) {
    engine.update();
    accumulator -= FIXED_TIMESTEP;
  }

  engine.render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
