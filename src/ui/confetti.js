const COLORS = ['#facc15', '#f43f5e', '#10b981', '#06b6d4', '#a855f7', '#fb923c', '#ec4899', '#ffffff'];
let animId = null;

export function fireVictoryConfetti(canvas) {
  if (!canvas) return;
  stopVictoryConfetti(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const rawW = rect.width || canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth || 360;
  const rawH = rect.height || canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight || 600;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = (canvas.width = Math.round(rawW * dpr));
  const h = (canvas.height = Math.round(rawH * dpr));

  // 35 Fireworks sparks from center + 40 Fluttering confetti ribbons from sides
  const particles = [];

  // 1. Center Firework Starbursts
  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (3.5 + Math.random() * 8.5) * dpr;
    particles.push({
      type: 'spark',
      x: w * 0.5,
      y: h * 0.32,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: (3 + Math.random() * 4) * dpr,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 1,
      decay: 0.016 + Math.random() * 0.012
    });
  }

  // 2. Corner Confetti Cannons
  for (let i = 0; i < 40; i++) {
    const isLeft = Math.random() < 0.5;
    const originX = isLeft ? w * 0.12 : w * 0.88;
    const angle = isLeft
      ? -Math.PI / 4 + (Math.random() - 0.5) * 0.65
      : (-3 * Math.PI) / 4 + (Math.random() - 0.5) * 0.65;
    const speed = (7 + Math.random() * 9) * dpr;

    particles.push({
      type: 'ribbon',
      x: originX,
      y: h * 0.9,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: (5 + Math.random() * 6) * dpr,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 9,
      wobble: Math.random() * 10,
      wobbleSpeed: 0.08 + Math.random() * 0.06,
      opacity: 1
    });
  }

  const startTime = performance.now();

  function loop(time) {
    const elapsed = time - startTime;
    ctx.clearRect(0, 0, w, h);

    let activeCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (p.type === 'spark') {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1 * dpr;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.opacity = Math.max(0, p.opacity - p.decay);

        if (p.opacity > 0) {
          activeCount++;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        }
      } else {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22 * dpr;
        p.vx *= 0.985;
        p.rotation += p.vRot;
        p.wobble += p.wobbleSpeed;

        if (elapsed > 1800) {
          p.opacity = Math.max(0, p.opacity - 0.022);
        }

        if (p.opacity > 0 && p.y < h + 30) {
          activeCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.scale(Math.cos(p.wobble), 1);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fillRect(-p.size * 0.5, -p.size * 0.4, p.size, p.size * 0.7);
          ctx.restore();
        }
      }
    }

    if (activeCount > 0 && elapsed < 4500) {
      animId = requestAnimationFrame(loop);
    } else {
      stopVictoryConfetti(canvas);
    }
  }

  animId = requestAnimationFrame(loop);
}

export function stopVictoryConfetti(canvas) {
  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
