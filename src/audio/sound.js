import { storage } from '../core/storage.js';

class AudioManager {
  constructor() {
    this.soundEnabled = storage.getSoundEnabled();
    this.audioCtx = null;
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    storage.setSoundEnabled(this.soundEnabled);
    return this.soundEnabled;
  }

  play(type) {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;

    if (type === 'milestone') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const o = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();
        o.type = 'triangle';
        o.connect(g);
        g.connect(this.audioCtx.destination);

        const start = now + idx * 0.09;
        const dur = idx === notes.length - 1 ? 0.65 : 0.25;
        o.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(0.22, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);
        o.start(start);
        o.stop(start + dur);
      });
      return;
    }

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    if (type === 'drop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'merge') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 + Math.random() * 250, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.22);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'gameover') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.7);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.7);
      osc.start(now);
      osc.stop(now + 0.7);
    }
  }
}

export const audioManager = new AudioManager();
