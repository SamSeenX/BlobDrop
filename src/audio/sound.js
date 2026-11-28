import { storage } from '../core/storage.js';
import { hapticManager } from './haptics.js';

class AudioManager {
  constructor() {
    this.soundEnabled = storage.getSoundEnabled();
    this.audioCtx = null;
    this.lastBounceTime = 0;
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

  play(type, arg) {
    hapticManager.trigger(type);
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;

    if (type === 'bounce') {
      const closingSpeed = typeof arg === 'number' ? arg : 2;
      if (now - this.lastBounceTime < 0.08) return;
      this.lastBounceTime = now;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const vol = Math.min(0.16, Math.max(0.03, closingSpeed * 0.015));
      osc.type = 'sine';
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.035);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.start(now);
      osc.stop(now + 0.035);
      return;
    }

    if (type === 'milestone' || type === 'victory') {
      const notes = type === 'victory'
        ? [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]
        : [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const o = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();
        o.type = type === 'victory' ? 'sine' : 'triangle';
        o.connect(g);
        g.connect(this.audioCtx.destination);

        const start = now + idx * 0.085;
        const dur = idx === notes.length - 1 ? 0.95 : 0.22;
        o.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(0.24, start);
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
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(1350, now + 0.025);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.075);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
      osc.start(now);
      osc.stop(now + 0.075);
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
