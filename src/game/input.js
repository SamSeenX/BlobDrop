export class InputHandler {
  constructor({ canvas, onAim, onDrop }) {
    this.canvas = canvas;
    this.onAim = onAim;
    this.onDrop = onDrop;
    this.isAiming = false;
    this.bind();
  }

  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  bind() {
    this.canvas.addEventListener('pointerdown', (e) => {
      this.isAiming = true;
      const pos = this.getPointerPos(e);
      this.onAim(pos.x, pos.y);
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (!this.isAiming) return;
      const pos = this.getPointerPos(e);
      this.onAim(pos.x, pos.y);
    });

    const release = () => {
      if (!this.isAiming) return;
      this.isAiming = false;
      this.onDrop();
    };

    this.canvas.addEventListener('pointerup', release);
    this.canvas.addEventListener('pointercancel', release);
    window.addEventListener('pointerup', release);
  }
}
