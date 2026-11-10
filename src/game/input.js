export class InputHandler {
  constructor({ canvas, getAimRadius, getWidth, onAim, onDrop }) {
    this.canvas = canvas;
    this.getAimRadius = getAimRadius;
    this.getWidth = getWidth;
    this.onAim = onAim;
    this.onDrop = onDrop;
    this.isAiming = false;
    this.bind();
  }

  getPointerX(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return clientX - rect.left;
  }

  clampDropX(rawX) {
    const radius = this.getAimRadius();
    const width = this.getWidth();
    return Math.max(radius, Math.min(width - radius, rawX));
  }

  bind() {
    this.canvas.addEventListener('pointerdown', (e) => {
      this.isAiming = true;
      const dropX = this.clampDropX(this.getPointerX(e));
      this.onAim(dropX);
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (!this.isAiming) return;
      const dropX = this.clampDropX(this.getPointerX(e));
      this.onAim(dropX);
    });

    this.canvas.addEventListener('pointerup', () => {
      if (!this.isAiming) return;
      this.isAiming = false;
      this.onDrop();
    });
  }
}
