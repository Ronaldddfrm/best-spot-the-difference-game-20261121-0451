// Tiny WebAudio synth: every sound is generated, no audio files are loaded.
export class SoundBank {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  tone(freq, startAt, duration, type = 'sine', volume = 0.12) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t = ctx.currentTime + startAt;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  // Satisfying two-note chime on every found difference.
  found() { this.tone(659.25, 0, 0.18, 'sine', 0.14); this.tone(987.77, 0.09, 0.28, 'sine', 0.14); }
  // Dull thud for a wrong click.
  wrong() { this.tone(160, 0, 0.16, 'square', 0.06); this.tone(110, 0.05, 0.2, 'square', 0.05); }
  hint() { this.tone(880, 0, 0.1, 'triangle', 0.09); this.tone(1174.66, 0.08, 0.16, 'triangle', 0.09); }
  tick() { this.tone(1200, 0, 0.05, 'sine', 0.04); }
  win() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, i * 0.12, 0.3, 'sine', 0.13)); }
  lose() { [392, 330, 262].forEach((f, i) => this.tone(f, i * 0.16, 0.3, 'triangle', 0.1)); }
  click() { this.tone(520, 0, 0.06, 'sine', 0.05); }
}
