import { initErrorBoundary } from './core/errorBoundary.js';
import { storage } from './core/storage.js';
import { Renderer } from './game/renderer.js';
import { Engine } from './game/engine.js';
import { UIManager } from './ui/uiManager.js';
import { TIERS } from './config/tiers.js';
import { eventBus } from './core/eventBus.js';

initErrorBoundary();
storage.initPersistence();

const canvas = document.getElementById('gameCanvas');
const wrapper = document.getElementById('canvasWrapper');
const ctx = canvas.getContext('2d');

const renderer = new Renderer(canvas, ctx);
const engine = new Engine({ canvas, wrapper, renderer });
const uiManager = new UIManager();

uiManager.bindStartAction(() => {
  engine.start();
});

// Initial UI Preview before first play
eventBus.emit('next:update', {
  currentTier: TIERS[0],
  nextTier: TIERS[1]
});

function loop() {
  engine.update();
  engine.render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
