// game.js — the hunt itself: state, clicks, timer, hints, scoring and marks.
// The two canvases always show the same scene; the left is the original and
// the right carries the differences. A click is tested against the scene's
// difference list in scene coordinates, on either panel.

import { SCENES, SCENE_W, SCENE_H } from './scenes.js';
import { SoundBank } from './audio.js';

const $ = (id) => document.getElementById(id);

export class SpotGame {
  constructor(opts = {}) {
    this.sounds = new SoundBank();
    this.left = $('canvas-left').getContext('2d');
    this.right = $('canvas-right').getContext('2d');
    this.levelIndex = opts.level ?? 0;
    this.staged = opts.staged ?? null; // { found:[indices], shot:'play'|'win' }
    this.status = 'playing'; // playing | won | lost
    this.found = new Set();
    this.wrongMarks = []; // {x, y, panel, born}
    this.sparkles = []; // {x, y, born}
    this.hint = null; // {diff, until}
    this.score = 0;
    this.streak = 0;
    this.timeLeft = 0;
    this.lastTickSecond = -1;
    this.timerId = null;
    this.pausedForShot = false;
    this.bindControls();
    this.startLevel(this.levelIndex);
  }

  get scene() { return SCENES[this.levelIndex]; }

  bindControls() {
    for (const canvas of [$('canvas-left'), $('canvas-right')]) {
      canvas.addEventListener('click', (ev) => this.onPanelClick(ev, canvas));
    }
    document.querySelectorAll('.level-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sounds.click();
        this.startLevel(Number(btn.dataset.level));
      });
    });
    $('btn-hint').addEventListener('click', () => this.useHint());
    $('btn-restart').addEventListener('click', () => { this.sounds.click(); this.startLevel(this.levelIndex); });
    $('btn-sound').addEventListener('click', () => {
      this.sounds.enabled = !this.sounds.enabled;
      $('btn-sound').textContent = this.sounds.enabled ? '♪ Sound: on' : '♪ Sound: off';
    });
    $('btn-overlay-next').addEventListener('click', () => {
      this.hideOverlay();
      this.startLevel((this.levelIndex + 1) % SCENES.length);
    });
    $('btn-overlay-replay').addEventListener('click', () => {
      this.hideOverlay();
      this.startLevel(this.levelIndex);
    });
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'h' || ev.key === 'H') this.useHint();
      else if (ev.key === 'r' || ev.key === 'R') this.startLevel(this.levelIndex);
      else if (ev.key === '1') this.startLevel(0);
      else if (ev.key === '2') this.startLevel(1);
      else if (ev.key === '3') this.startLevel(2);
    });
  }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.wrongMarks = [];
    this.sparkles = [];
    this.hint = null;
    this.streak = 0;
    this.status = 'playing';
    this.timeLeft = this.scene.timeLimit;
    this.lastTickSecond = -1;
    this.hintsLeft = this.scene.hints;
    document.querySelectorAll('.level-btn').forEach((b, i) => b.classList.toggle('active', i === index));
    this.hideOverlay();
    this.setMessage(`${this.scene.name} — ${this.scene.blurb}`, '');
    this.updateHud();
    this.stopTimer();
    // Staged screenshots: pre-mark differences and freeze the clock.
    if (this.staged && this.staged.level === index) {
      for (const i of this.staged.found ?? []) this.found.add(i);
      this.score = (this.staged.found ?? []).length * 100;
      if (this.staged.time != null) this.timeLeft = this.staged.time;
      this.pausedForShot = true;
      if (this.staged.shot === 'win') {
        for (let i = 0; i < this.scene.diffs.length; i++) this.found.add(i);
        this.score = this.scene.diffs.length * 100 + 500;
        this.status = 'won';
        this.showWinOverlay(true);
      }
      this.updateHud();
      return;
    }
    this.pausedForShot = false;
    this.timerId = window.setInterval(() => this.tick(), 250);
  }

  stopTimer() { if (this.timerId != null) { window.clearInterval(this.timerId); this.timerId = null; } }

  tick() {
    if (this.status !== 'playing' || this.pausedForShot) return;
    this.timeLeft = Math.max(0, this.timeLeft - 0.25);
    const whole = Math.ceil(this.timeLeft);
    if (whole !== this.lastTickSecond) {
      this.lastTickSecond = whole;
      if (whole <= 10 && whole > 0) this.sounds.tick();
    }
    this.updateHud();
    if (this.timeLeft <= 0) this.lose();
  }

  scenePoint(ev, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((ev.clientX - rect.left) / rect.width) * SCENE_W,
      y: ((ev.clientY - rect.top) / rect.height) * SCENE_H,
    };
  }

  onPanelClick(ev, canvas) {
    if (this.status !== 'playing') return;
    const p = this.scenePoint(ev, canvas);
    const hit = this.scene.diffs.findIndex((d, i) => {
      if (this.found.has(i)) return false;
      return Math.hypot(p.x - d.x, p.y - d.y) <= Math.max(d.r, 22);
    });
    if (hit >= 0) this.registerFind(hit, p);
    else this.registerMiss(p, canvas.id === 'canvas-left' ? 'left' : 'right');
  }

  registerFind(index, p) {
    const diff = this.scene.diffs[index];
    this.found.add(index);
    this.streak += 1;
    let gained = 100;
    if (this.streak >= 3) gained += 50;
    if (this.timeLeft > this.scene.timeLimit * 0.5) gained += 25;
    this.score += gained;
    this.sparkles.push({ x: diff.x, y: diff.y, born: performance.now() });
    this.sounds.found();
    const left = this.scene.diffs.length - this.found.size;
    this.setMessage(
      `Found it — ${diff.label}! ${left === 0 ? 'That was the last one!' : `${left} still hiding…`}`,
      'good',
    );
    $('status').textContent = `Found ${diff.label}. ${left} differences remain.`;
    $('combo').textContent = this.streak >= 2 ? `🔥 x${this.streak} streak` : '';
    this.updateHud();
    if (this.found.size === this.scene.diffs.length) this.win();
  }

  registerMiss(p, panel) {
    this.streak = 0;
    this.wrongMarks.push({ x: p.x, y: p.y, panel, born: performance.now() });
    this.timeLeft = Math.max(0, this.timeLeft - 5);
    this.sounds.wrong();
    this.setMessage('Not a difference — 5 seconds lost. Look closer!', 'bad');
    $('combo').textContent = '';
    this.updateHud();
    if (this.timeLeft <= 0) this.lose();
  }

  useHint() {
    if (this.status !== 'playing') return;
    if (this.hintsLeft <= 0) { this.setMessage('No hints left — trust your eyes!', 'bad'); return; }
    const remaining = this.scene.diffs.map((d, i) => i).filter((i) => !this.found.has(i));
    if (!remaining.length) return;
    this.hintsLeft -= 1;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hint = { diff: this.scene.diffs[pick], until: performance.now() + 3000 };
    this.score = Math.max(0, this.score - 25);
    this.sounds.hint();
    this.setMessage(`Hint: something changed near the ${this.hint.diff.label}. (−25 pts)`, '');
    this.updateHud();
  }

  win() {
    this.status = 'won';
    this.stopTimer();
    const bonus = Math.round(this.timeLeft) * 5;
    this.score += bonus;
    this.sounds.win();
    this.updateHud();
    this.showWinOverlay(false, bonus);
  }

  lose() {
    this.status = 'lost';
    this.stopTimer();
    this.sounds.lose();
    this.setMessage(`Time's up! You found ${this.found.size} of ${this.scene.diffs.length}. Try again — the changes are still there.`, 'bad');
    this.showLoseOverlay();
  }

  showWinOverlay(staged) {
    const total = this.scene.diffs.length;
    const timeBonus = staged ? 0 : Math.round(this.timeLeft) * 5;
    $('overlay-title').textContent = staged ? `All ${total} differences found!` : `Scene cleared!`;
    $('overlay-text').textContent =
      `You found all ${total} differences in ${this.scene.name} and scored ${this.score} points` +
      (timeBonus ? `, including a ${timeBonus}-point time bonus.` : '.');
    const stars = this.timeLeft > this.scene.timeLimit * 0.5 ? '★★★' : this.timeLeft > 0 ? '★★☆' : '★☆☆';
    $('overlay-stars').textContent = stars;
    $('btn-overlay-next').textContent = this.levelIndex < SCENES.length - 1 ? 'Next scene →' : 'Back to Garden →';
    $('overlay').classList.remove('hidden');
  }

  showLoseOverlay() {
    $('overlay-title').textContent = `Time's up!`;
    $('overlay-text').textContent =
      `You found ${this.found.size} of ${this.scene.diffs.length} differences in ${this.scene.name}. ` +
      `The unfound ones are still hiding — have another look.`;
    $('overlay-stars').textContent = '☆☆☆';
    $('btn-overlay-next').textContent = 'Try another scene →';
    $('overlay').classList.remove('hidden');
  }

  hideOverlay() { $('overlay').classList.add('hidden'); }

  setMessage(text, kind) {
    const el = $('message');
    el.textContent = text;
    el.className = kind || '';
  }

  updateHud() {
    $('found-count').textContent = `${this.found.size} / ${this.scene.diffs.length}`;
    $('score').textContent = String(this.score);
    $('hints-left').textContent = String(this.hintsLeft);
    const secs = Math.max(0, Math.ceil(this.timeLeft));
    const mm = Math.floor(secs / 60);
    const ss = String(secs % 60).padStart(2, '0');
    const timeEl = $('time-left');
    timeEl.textContent = `${mm}:${ss}`;
    timeEl.classList.toggle('low', secs <= 30);
    const fill = $('timer-fill');
    fill.style.width = `${(this.timeLeft / this.scene.timeLimit) * 100}%`;
    fill.classList.toggle('low', secs <= 30);
    $('btn-hint').disabled = this.hintsLeft <= 0 || this.status !== 'playing';
  }

  // ---- rendering ---------------------------------------------------------
  drawMarker(ctx, x, y, now, kind) {
    const pulse = kind === 'hint' ? 1 + Math.sin(now / 180) * 0.08 : 1;
    const r = 24 * pulse;
    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = kind === 'hint' ? '#ffb300' : '#2ee66b';
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowBlur = 0;
    if (kind === 'found') {
      ctx.strokeStyle = '#2ee66b';
      ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x - 10, y); ctx.lineTo(x - 3, y + 8); ctx.lineTo(x + 11, y - 8);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawWrong(ctx, mark, now) {
    const age = (now - mark.born) / 900;
    if (age >= 1) return false;
    const alpha = 1 - age;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#ff5252'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    const s = 12;
    ctx.beginPath();
    ctx.moveTo(mark.x - s, mark.y - s); ctx.lineTo(mark.x + s, mark.y + s);
    ctx.moveTo(mark.x + s, mark.y - s); ctx.lineTo(mark.x - s, mark.y + s);
    ctx.stroke();
    ctx.restore();
    return true;
  }

  drawSparkle(ctx, sp, now) {
    const age = (now - sp.born) / 800;
    if (age >= 1) return false;
    const r = 8 + age * 26;
    ctx.save();
    ctx.globalAlpha = 1 - age;
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2.5;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(sp.x + Math.cos(a) * r * 0.6, sp.y + Math.sin(a) * r * 0.6);
      ctx.lineTo(sp.x + Math.cos(a) * r, sp.y + Math.sin(a) * r);
      ctx.stroke();
    }
    ctx.restore();
    return true;
  }

  frame(now) {
    this.scene.draw(this.left, false);
    this.scene.draw(this.right, true);
    for (const i of this.found) {
      const d = this.scene.diffs[i];
      this.drawMarker(this.left, d.x, d.y, now, 'found');
      this.drawMarker(this.right, d.x, d.y, now, 'found');
    }
    if (this.hint && now < this.hint.until) {
      this.drawMarker(this.left, this.hint.diff.x, this.hint.diff.y, now, 'hint');
      this.drawMarker(this.right, this.hint.diff.x, this.hint.diff.y, now, 'hint');
    } else if (this.hint) {
      this.hint = null;
    }
    this.wrongMarks = this.wrongMarks.filter((m) => {
      const ctx = m.panel === 'left' ? this.left : this.right;
      return this.drawWrong(ctx, m, now);
    });
    this.sparkles = this.sparkles.filter((s) => {
      const a = this.drawSparkle(this.left, s, now);
      const b = this.drawSparkle(this.right, s, now);
      return a || b;
    });
    requestAnimationFrame((t) => this.frame(t));
  }

  start() {
    requestAnimationFrame((t) => this.frame(t));
  }
}
