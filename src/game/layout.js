export const BASE_WIDTH = 360;
export const BASE_HEIGHT = 540;
export const ASPECT_RATIO = 2 / 3;

export function computeGameLayout(wrapper) {
  if (!wrapper) return null;
  const parent = wrapper.parentElement || document.body;
  const computed = window.getComputedStyle(parent);
  const padX = parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight) || 32;
  const padY = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom) || 8;

  const maxW = Math.min(440, (parent.clientWidth || window.innerWidth) - padX);
  const maxH = (parent.clientHeight || window.innerHeight) - padY;

  let width = maxW;
  let height = width / ASPECT_RATIO;

  if (height > maxH && maxH > 100) {
    height = maxH;
    width = height * ASPECT_RATIO;
  }

  width = Math.round(Math.max(240, width));
  height = Math.round(width / ASPECT_RATIO);

  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${height}px`;

  const scale = width / BASE_WIDTH;
  const dangerY = Math.round(75 * scale);

  const dangerEl = document.getElementById('dangerLine');
  if (dangerEl) {
    dangerEl.style.top = `${dangerY}px`;
  }

  return {
    width,
    height,
    scale,
    dangerY,
    originX: width / 2,
    originY: Math.round(38 * scale)
  };
}

export function rescaleBalls(balls, scaleRatio, newScale) {
  if (!balls || !scaleRatio || scaleRatio === 1) return;
  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];
    b.scale = newScale;
    b.x *= scaleRatio;
    b.y *= scaleRatio;
    b.vx *= scaleRatio;
    b.vy *= scaleRatio;
    b.targetX *= scaleRatio;
    b.targetY *= scaleRatio;
    b.offsetX *= scaleRatio;
    b.offsetY *= scaleRatio;
    b.radius *= scaleRatio;
  }
}

export function applyCanvasResize({ wrapper, canvas, renderer, engine }) {
  const layout = computeGameLayout(wrapper);
  if (!layout) return;

  const oldScale = engine.scale || 1;
  engine.width = layout.width;
  engine.height = layout.height;
  engine.scale = layout.scale;
  engine.dangerY = layout.dangerY;
  engine.originX = layout.originX;
  engine.originY = layout.originY;

  if (engine.balls.length > 0 && oldScale !== engine.scale) {
    rescaleBalls(engine.balls, engine.scale / oldScale, engine.scale);
  }

  const d = window.devicePixelRatio || 1;
  canvas.width = engine.width * d;
  canvas.height = engine.height * d;
  renderer.ctx.setTransform(d, 0, 0, d, 0, 0);
}
