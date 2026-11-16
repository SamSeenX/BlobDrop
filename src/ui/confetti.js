const COLORS = ['#facc15', '#f43f5e', '#10b981', '#06b6d4', '#a855f7', '#fb923c', '#ec4899', '#ffffff'];
let animId = null;

export function fireVictoryConfetti(canvas) {
  if (!canvas) return;
  stopVictoryConfetti(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = (canvas.width = canvas.clientWidth * dpr);
  const h = (canvas.height = canvas.clientHeight * dpr);

  const particles = Array.from({ length: 70 }, () => {
    const isLeft = Math.random() < 0.5;
    const originX = isLeft ? w * 0.15 : w * 0.85;
    const angle = isLeft ? -Math.PI / 4 + (Math.random() - 0.5) * 0.5 : (-3 * Math.PI) / 4 + (Math.random() - 0.5) * 0.5;
    const speed = (6 + Math.random() * 8) * dpr;

    return {
      x: originX,
      y: h * 0.75,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: (5 + Math.random() * 6) * dpr,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 8,
      wobble: Math.random() * 10,
      wobbleSpeed: 0.08 + Math.random() * 0.06,
      opacity: 1,
      isCircle: Math.random() < 0.3
    };
  });

  const startTime = performance.now();

  function loop(time) {
    const elapsed = time - startTime;
    ctx.clearRect(0, 0, w, h);

    let activeCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22 * dpr;
      p.vx *= 0.985;
      p.rotation += p.vRot;
      p.wobble += p.wobbleSpeed;

      if (elapsed > 2000) {
        p.opacity = Math.max(0, p.opacity - 0.025);
      }

      if (p.opacity > 0 && p.y < h + 30) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.scale(Math.cos(p.wobble), 1);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.isCircle) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size * 0.5, -p.size * 0.4, p.size, p.size * 0.7);
        }
        ctx.restore();
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
