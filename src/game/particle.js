export class Particle {
  constructor(x, y, color, scale = 1) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = (1.5 + Math.random() * 5) * scale;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.radius = (2.5 + Math.random() * 3.5) * scale;
    this.alpha = 1;
    this.decay = 0.02 + Math.random() * 0.03;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class Shockwave {
  constructor(x, y, color, maxRadius = 35, scale = 1) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 4 * scale;
    this.maxRadius = maxRadius;
    this.alpha = 0.85;
    this.growth = (maxRadius - 4 * scale) / 14;
  }

  update() {
    this.radius += this.growth;
    this.alpha -= 0.06;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

export function updateParticles(particles) {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].alpha <= 0) particles.splice(i, 1);
  }
}
