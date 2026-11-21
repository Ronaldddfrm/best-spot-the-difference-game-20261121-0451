// scenes.js — three original scenes, drawn entirely in code.
// Each scene draws the SAME world twice: once as the original (right=false)
// and once with its differences applied (right=true). A difference is only
// a small, deliberate change to one drawn element, so both panels stay
// rich scenes worth studying rather than empty outlines.

export const SCENE_W = 560;
export const SCENE_H = 420;

function cloud(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.arc(x, y, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 18 * s, y - 6 * s, 20 * s, 0, Math.PI * 2);
  ctx.arc(x + 38 * s, y, 15 * s, 0, Math.PI * 2);
  ctx.arc(x + 19 * s, y + 6 * s, 17 * s, 0, Math.PI * 2);
  ctx.fill();
}

function bird(ctx, x, y, s = 1) {
  ctx.strokeStyle = '#2b2b3a';
  ctx.lineWidth = 2.4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 8 * s, x + 10 * s, y);
  ctx.stroke();
}

function flower(ctx, x, y, petal, stemH = 26) {
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + stemH); ctx.stroke();
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffd54f';
  ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
}

function butterfly(ctx, x, y, wing) {
  ctx.fillStyle = wing;
  ctx.beginPath(); ctx.ellipse(x - 8, y - 4, 9, 6, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 8, y - 4, 9, 6, 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x - 6, y + 6, 7, 5, 0.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 6, y + 6, 7, 5, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 9); ctx.stroke();
}

function star(ctx, x, y, r, color = '#fff') {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rad = i % 2 === 0 ? r : r * 0.4;
    ctx[i === 0 ? 'moveTo' : 'lineTo'](x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  ctx.closePath(); ctx.fill();
}

// ---------------------------------------------------------------------------
// Scene 1 — Sunny Garden (Easy, 7 differences, 180 s)
// ---------------------------------------------------------------------------
function drawGarden(ctx, right) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#7ec8f7'); sky.addColorStop(1, '#cfeefc');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, SCENE_W, 300);
  // Sun with rays (diff: rays missing on the right)
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath(); ctx.arc(72, 62, 30, 0, Math.PI * 2); ctx.fill();
  if (!right) {
    ctx.strokeStyle = '#ffd93b'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(72 + Math.cos(a) * 38, 62 + Math.sin(a) * 38);
      ctx.lineTo(72 + Math.cos(a) * 50, 62 + Math.sin(a) * 50);
      ctx.stroke();
    }
  }
  cloud(ctx, 180, 60, 0.9);
  if (!right) cloud(ctx, 380, 74, 1.1); // diff 1: second cloud gone
  if (!right) bird(ctx, 262, 96);       // diff 2: bird gone
  bird(ctx, 300, 70, 0.8);
  // Hills + grass
  ctx.fillStyle = '#8fd07a';
  ctx.beginPath(); ctx.ellipse(120, 330, 260, 90, 0, Math.PI, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6fbf5e';
  ctx.beginPath(); ctx.ellipse(470, 340, 260, 100, 0, Math.PI, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#58a848'; ctx.fillRect(0, 330, SCENE_W, 90);
  // Path
  ctx.fillStyle = '#e8d5a3';
  ctx.beginPath(); ctx.moveTo(250, 420); ctx.lineTo(300, 420); ctx.lineTo(285, 300); ctx.lineTo(265, 300); ctx.closePath(); ctx.fill();
  // House
  ctx.fillStyle = '#fff3e0'; ctx.fillRect(270, 190, 130, 110);
  ctx.fillStyle = '#c0392b';
  ctx.beginPath(); ctx.moveTo(258, 192); ctx.lineTo(335, 130); ctx.lineTo(412, 192); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#7b4b2a'; ctx.fillRect(322, 245, 28, 55);
  ctx.fillStyle = '#ffd54f'; ctx.beginPath(); ctx.arc(354, 272, 3, 0, Math.PI * 2); ctx.fill();
  // Window: curtains open on the left, closed on the right (diff 3)
  ctx.fillStyle = '#bfe8ff'; ctx.fillRect(286, 208, 34, 34);
  ctx.strokeStyle = '#5b7fa6'; ctx.lineWidth = 2; ctx.strokeRect(286, 208, 34, 34);
  if (!right) {
    ctx.strokeStyle = '#5b7fa6';
    ctx.beginPath(); ctx.moveTo(303, 208); ctx.lineTo(303, 242); ctx.moveTo(286, 225); ctx.lineTo(320, 225); ctx.stroke();
  } else {
    ctx.fillStyle = '#e75480';
    ctx.fillRect(286, 208, 10, 34); ctx.fillRect(310, 208, 10, 34);
  }
  ctx.fillStyle = '#bfe8ff'; ctx.fillRect(352, 208, 34, 34);
  ctx.strokeStyle = '#5b7fa6'; ctx.strokeRect(352, 208, 34, 34);
  // Tree with apples (diff 4: one apple gone)
  ctx.fillStyle = '#6d4c41'; ctx.fillRect(462, 210, 18, 90);
  ctx.fillStyle = '#2e9e4f';
  ctx.beginPath(); ctx.arc(471, 170, 52, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(430, 195, 34, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(512, 195, 34, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e53935';
  ctx.beginPath(); ctx.arc(448, 178, 7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(492, 168, 7, 0, Math.PI * 2); ctx.fill();
  if (!right) { ctx.beginPath(); ctx.arc(471, 198, 7, 0, Math.PI * 2); ctx.fill(); }
  // Fence (diff 5: one post missing)
  ctx.fillStyle = '#d9a066';
  for (let x = 20; x <= 220; x += 28) {
    if (right && x === 104) continue;
    ctx.fillRect(x, 300, 8, 34);
    ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x + 4, 292); ctx.lineTo(x + 8, 300); ctx.closePath(); ctx.fill();
  }
  ctx.fillRect(16, 308, 212, 5); ctx.fillRect(16, 322, 212, 5);
  // Flowers: one changes colour (diff 6)
  flower(ctx, 60, 372, '#e75480');
  flower(ctx, 120, 382, right ? '#9b59d0' : '#e53935');
  flower(ctx, 180, 372, '#ff8f00');
  flower(ctx, 420, 380, '#e75480');
  flower(ctx, 500, 372, '#ff8f00');
  // Butterfly (diff 7: gone on the right)
  if (!right) butterfly(ctx, 210, 268, '#7e57c2');
  butterfly(ctx, 150, 240, '#29b6f6');
  // Pond with a duck
  ctx.fillStyle = '#4db6e8';
  ctx.beginPath(); ctx.ellipse(440, 392, 62, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(440, 388, 10, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffb300'; ctx.beginPath(); ctx.moveTo(449, 388); ctx.lineTo(456, 390); ctx.lineTo(449, 392); ctx.closePath(); ctx.fill();
}

// ---------------------------------------------------------------------------
// Scene 2 — Harbour at Dusk (Medium, 8 differences, 150 s)
// ---------------------------------------------------------------------------
function drawHarbour(ctx, right) {
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#3b2d6b'); sky.addColorStop(0.55, '#c65d7b'); sky.addColorStop(1, '#ff9e57');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, SCENE_W, 260);
  // Sun setting over the sea
  ctx.fillStyle = '#ffb03a';
  ctx.beginPath(); ctx.arc(150, 225, 34, 0, Math.PI * 2); ctx.fill();
  // Moon: full on the left, crescent on the right (diff 1)
  ctx.fillStyle = '#f4f1de';
  ctx.beginPath(); ctx.arc(486, 58, 22, 0, Math.PI * 2); ctx.fill();
  if (right) { ctx.fillStyle = '#3b2d6b'; ctx.beginPath(); ctx.arc(494, 52, 19, 0, Math.PI * 2); ctx.fill(); }
  star(ctx, 420, 40, 5); star(ctx, 360, 70, 4); star(ctx, 520, 110, 4);
  if (!right) bird(ctx, 210, 84); // diff 2: gull gone
  bird(ctx, 250, 60, 0.8);
  // Sea
  const sea = ctx.createLinearGradient(0, 260, 0, 420);
  sea.addColorStop(0, '#e8836b'); sea.addColorStop(1, '#274b73');
  ctx.fillStyle = sea; ctx.fillRect(0, 260, SCENE_W, 160);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2;
  for (let y = 285; y < 410; y += 26) {
    ctx.beginPath();
    for (let x = 0; x <= SCENE_W; x += 28) ctx.lineTo(x, y + Math.sin(x / 40 + y) * 3);
    ctx.stroke();
  }
  // Boat with a sail (diff 3: sail turns red-striped)
  ctx.fillStyle = '#5d4037';
  ctx.beginPath(); ctx.moveTo(90, 320); ctx.lineTo(210, 320); ctx.lineTo(190, 348); ctx.lineTo(110, 348); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3e2723'; ctx.fillRect(147, 250, 5, 72);
  if (!right) {
    ctx.fillStyle = '#fdfdfd';
    ctx.beginPath(); ctx.moveTo(152, 254); ctx.lineTo(152, 312); ctx.lineTo(196, 312); ctx.closePath(); ctx.fill();
  } else {
    ctx.fillStyle = '#e53935';
    ctx.beginPath(); ctx.moveTo(152, 254); ctx.lineTo(152, 312); ctx.lineTo(196, 312); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(152, 272); ctx.lineTo(176, 272); ctx.lineTo(176, 282); ctx.lineTo(152, 282); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(152, 294); ctx.lineTo(188, 294); ctx.lineTo(188, 304); ctx.lineTo(152, 304); ctx.closePath(); ctx.fill();
  }
  // Second small boat
  ctx.fillStyle = '#4e342e';
  ctx.beginPath(); ctx.moveTo(330, 350); ctx.lineTo(400, 350); ctx.lineTo(388, 368); ctx.lineTo(342, 368); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#8d6e63'; ctx.fillRect(360, 318, 4, 34);
  ctx.fillStyle = '#ffe082'; ctx.beginPath(); ctx.moveTo(364, 320); ctx.lineTo(364, 348); ctx.lineTo(388, 348); ctx.closePath(); ctx.fill();
  // Lighthouse (diff 4: lamp dark; diff 5: window dark)
  ctx.fillStyle = '#f5f0e6'; ctx.fillRect(452, 120, 44, 150);
  ctx.fillStyle = '#d32f2f'; ctx.fillRect(452, 150, 44, 16); ctx.fillRect(452, 196, 44, 16); ctx.fillRect(452, 242, 44, 16);
  ctx.fillStyle = '#37474f'; ctx.fillRect(446, 96, 56, 26);
  if (!right) {
    ctx.fillStyle = '#fff59d';
    ctx.beginPath(); ctx.arc(474, 109, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,245,157,0.25)';
    ctx.beginPath(); ctx.moveTo(474, 109); ctx.lineTo(400, 80); ctx.lineTo(400, 140); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(474, 109); ctx.lineTo(548, 80); ctx.lineTo(548, 140); ctx.closePath(); ctx.fill();
  } else {
    ctx.fillStyle = '#546e7a'; ctx.beginPath(); ctx.arc(474, 109, 9, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = right ? '#263238' : '#ffd54f';
  ctx.fillRect(466, 168, 16, 20); // window
  // Flag on the lighthouse (diff 6: flag flips direction)
  ctx.strokeStyle = '#37474f'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(474, 96); ctx.lineTo(474, 66); ctx.stroke();
  ctx.fillStyle = '#e53935';
  ctx.beginPath();
  if (!right) { ctx.moveTo(474, 66); ctx.lineTo(504, 73); ctx.lineTo(474, 82); }
  else { ctx.moveTo(474, 66); ctx.lineTo(444, 73); ctx.lineTo(474, 82); }
  ctx.closePath(); ctx.fill();
  // Pier with crates (diff 7: one crate gone) and a lantern (diff 8: unlit)
  ctx.fillStyle = '#6d4c41'; ctx.fillRect(0, 372, 330, 48);
  ctx.fillStyle = '#8d6e63'; ctx.fillRect(0, 372, 330, 8);
  for (let x = 12; x < 320; x += 34) { ctx.fillStyle = '#5d4037'; ctx.fillRect(x, 380, 3, 40); }
  ctx.fillStyle = '#a1887f'; ctx.fillRect(52, 330, 36, 42); ctx.fillRect(92, 330, 36, 42);
  if (!right) { ctx.fillStyle = '#8d6e63'; ctx.fillRect(70, 292, 36, 38); }
  ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 2;
  ctx.strokeRect(52, 330, 36, 42); ctx.strokeRect(92, 330, 36, 42);
  // Lantern post
  ctx.strokeStyle = '#37474f'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(300, 372); ctx.lineTo(300, 322); ctx.stroke();
  ctx.fillStyle = '#37474f'; ctx.fillRect(290, 306, 20, 18);
  ctx.fillStyle = right ? '#455a64' : '#ffe082';
  ctx.beginPath(); ctx.arc(300, 315, 6, 0, Math.PI * 2); ctx.fill();
  if (!right) {
    ctx.fillStyle = 'rgba(255,224,130,0.3)';
    ctx.beginPath(); ctx.arc(300, 315, 20, 0, Math.PI * 2); ctx.fill();
  }
  // Coiled rope on the pier
  ctx.strokeStyle = '#d7ccc8'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(180, 388, 12, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(180, 388, 6, 0, Math.PI * 2); ctx.stroke();
}

// ---------------------------------------------------------------------------
// Scene 3 — Moon Observatory (Hard, 10 differences, 120 s)
// ---------------------------------------------------------------------------
function drawObservatory(ctx, right) {
  // Night room
  ctx.fillStyle = '#141b33'; ctx.fillRect(0, 0, SCENE_W, SCENE_H);
  // Big window with the night sky
  ctx.fillStyle = '#0a1030';
  ctx.beginPath(); ctx.arc(150, 150, 118, 0, Math.PI * 2); ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.arc(150, 150, 118, 0, Math.PI * 2); ctx.clip();
  star(ctx, 100, 80, 5); star(ctx, 190, 60, 4); star(ctx, 220, 130, 5);
  star(ctx, 80, 160, 4); star(ctx, 150, 110, 3.5); star(ctx, 60, 100, 3);
  if (!right) star(ctx, 195, 185, 6, '#ffe082'); // diff 1: bright star gone
  // Planet with a ring (diff 2: ring gone)
  ctx.fillStyle = '#c65d7b';
  ctx.beginPath(); ctx.arc(120, 190, 22, 0, Math.PI * 2); ctx.fill();
  if (!right) {
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(120, 190, 36, 10, -0.35, 0, Math.PI * 2); ctx.stroke();
  }
  // Crescent moon
  ctx.fillStyle = '#f4f1de'; ctx.beginPath(); ctx.arc(210, 90, 18, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0a1030'; ctx.beginPath(); ctx.arc(218, 84, 15, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(150, 150, 118, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(150, 32); ctx.lineTo(150, 268); ctx.moveTo(32, 150); ctx.lineTo(268, 150); ctx.stroke();
  // Dome + telescope
  ctx.fillStyle = '#263156';
  ctx.beginPath(); ctx.moveTo(300, 300); ctx.lineTo(300, 210); ctx.quadraticCurveTo(400, 130, 500, 210); ctx.lineTo(500, 300); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1a2540'; ctx.fillRect(300, 296, 200, 10);
  // Telescope tube, angled up-left on the left, level on the right (diff 3)
  ctx.save();
  ctx.translate(400, 250); ctx.rotate(right ? 0.05 : -0.5);
  ctx.fillStyle = '#b0bec5'; ctx.fillRect(-70, -10, 130, 20);
  ctx.fillStyle = '#37474f'; ctx.fillRect(52, -13, 18, 26);
  ctx.restore();
  ctx.fillStyle = '#37474f'; ctx.fillRect(392, 250, 16, 50);
  ctx.fillStyle = '#546e7a'; ctx.beginPath(); ctx.ellipse(400, 302, 34, 8, 0, 0, Math.PI * 2); ctx.fill();
  // Wall clock (diff 4: hands move from 3:00 to 4:30)
  ctx.fillStyle = '#f5f0e6'; ctx.beginPath(); ctx.arc(512, 52, 26, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#37474f'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(512, 52, 26, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#222'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(512, 52); ctx.lineTo(512, 38); ctx.stroke(); // 12
  ctx.beginPath(); ctx.moveTo(512, 52);
  if (!right) ctx.lineTo(526, 52); else ctx.lineTo(512, 66); // 3 vs 6
  ctx.stroke();
  // Star chart on the wall (diff 5: red pin gone)
  ctx.fillStyle = '#f7ead1'; ctx.fillRect(300, 40, 90, 64);
  ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 2; ctx.strokeRect(300, 40, 90, 64);
  ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(310, 90); ctx.lineTo(330, 60); ctx.lineTo(355, 84); ctx.lineTo(378, 56); ctx.stroke();
  star(ctx, 330, 60, 4, '#c65d7b'); star(ctx, 355, 84, 4, '#2e7d32'); star(ctx, 378, 56, 4, '#1565c0');
  if (!right) { ctx.fillStyle = '#e53935'; ctx.beginPath(); ctx.arc(368, 92, 5, 0, Math.PI * 2); ctx.fill(); }
  // Desk
  ctx.fillStyle = '#5d4037'; ctx.fillRect(0, 330, SCENE_W, 90);
  ctx.fillStyle = '#795548'; ctx.fillRect(0, 330, SCENE_W, 10);
  // Books (diff 6: middle book turns red)
  ctx.fillStyle = '#1565c0'; ctx.fillRect(30, 292, 16, 38);
  ctx.fillStyle = right ? '#c62828' : '#2e7d32'; ctx.fillRect(48, 286, 16, 44);
  ctx.fillStyle = '#f9a825'; ctx.fillRect(66, 296, 16, 34);
  ctx.fillStyle = '#6a1b9a'; ctx.fillRect(84, 290, 16, 40);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(33, 296, 10, 3); ctx.fillRect(51, 290, 10, 3); ctx.fillRect(69, 300, 10, 3);
  // Mug with steam (diff 7: steam gone)
  ctx.fillStyle = '#e53935'; ctx.fillRect(140, 300, 30, 32);
  ctx.fillStyle = '#e53935'; ctx.beginPath(); ctx.arc(174, 316, 9, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  ctx.strokeStyle = '#e53935'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(174, 316, 8, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  if (!right) {
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(150, 292); ctx.quadraticCurveTo(146, 282, 150, 274); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(162, 292); ctx.quadraticCurveTo(166, 282, 162, 274); ctx.stroke();
  }
  // Model rocket (diff 8: fin colour changes)
  ctx.fillStyle = '#eceff1';
  ctx.beginPath(); ctx.moveTo(250, 268); ctx.lineTo(262, 300); ctx.lineTo(238, 300); ctx.closePath(); ctx.fill();
  ctx.fillStyle = right ? '#e53935' : '#1565c0';
  ctx.beginPath(); ctx.moveTo(238, 300); ctx.lineTo(226, 316); ctx.lineTo(240, 312); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(262, 300); ctx.lineTo(274, 316); ctx.lineTo(260, 312); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#29b6f6'; ctx.beginPath(); ctx.arc(250, 286, 6, 0, Math.PI * 2); ctx.fill();
  // Desk lamp (diff 9: lamp off, light cone gone)
  ctx.fillStyle = '#37474f'; ctx.fillRect(430, 322, 8, 10);
  ctx.strokeStyle = '#37474f'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(434, 322); ctx.lineTo(434, 292); ctx.stroke();
  ctx.fillStyle = '#546e7a';
  ctx.beginPath(); ctx.moveTo(420, 292); ctx.lineTo(448, 292); ctx.lineTo(440, 278); ctx.lineTo(428, 278); ctx.closePath(); ctx.fill();
  if (!right) {
    ctx.fillStyle = 'rgba(255,224,130,0.35)';
    ctx.beginPath(); ctx.moveTo(428, 292); ctx.lineTo(448, 292); ctx.lineTo(480, 330); ctx.lineTo(400, 330); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffe082'; ctx.beginPath(); ctx.arc(434, 292, 5, 0, Math.PI * 2); ctx.fill();
  }
  // Cat asleep on the desk (diff 10: tail up vs tail down)
  ctx.fillStyle = '#ff8f00';
  ctx.beginPath(); ctx.ellipse(500, 318, 34, 13, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(532, 312, 11, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(524, 304); ctx.lineTo(527, 296); ctx.lineTo(531, 303); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(534, 303); ctx.lineTo(537, 295); ctx.lineTo(540, 302); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#ff8f00'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath();
  if (!right) { ctx.moveTo(468, 316); ctx.quadraticCurveTo(452, 306, 456, 290); }
  else { ctx.moveTo(468, 318); ctx.quadraticCurveTo(452, 326, 446, 322); }
  ctx.stroke();
  ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(530, 312); ctx.lineTo(535, 312); ctx.stroke();
  // Scattered papers
  ctx.fillStyle = '#fff'; ctx.save(); ctx.translate(330, 352); ctx.rotate(-0.06); ctx.fillRect(0, 0, 52, 34); ctx.restore();
  ctx.fillStyle = '#fff'; ctx.save(); ctx.translate(392, 356); ctx.rotate(0.08); ctx.fillRect(0, 0, 52, 34); ctx.restore();
  ctx.strokeStyle = '#90a4ae'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(336, 362); ctx.lineTo(376, 362); ctx.moveTo(336, 372); ctx.lineTo(370, 372); ctx.stroke();
}

export const SCENES = [
  {
    id: 'garden', name: 'Sunny Garden', difficulty: 'Easy', timeLimit: 180, hints: 3,
    blurb: 'A cottage garden on a bright morning. Seven small changes hide in plain sight.',
    draw: drawGarden,
    diffs: [
      { id: 'cloud', x: 399, y: 74, r: 30, label: 'the vanished cloud' },
      { id: 'bird', x: 262, y: 96, r: 18, label: 'the missing bird' },
      { id: 'window', x: 303, y: 225, r: 24, label: 'the closed curtains' },
      { id: 'apple', x: 471, y: 198, r: 16, label: 'the missing apple' },
      { id: 'fence', x: 108, y: 314, r: 18, label: 'the missing fence post' },
      { id: 'flower', x: 120, y: 382, r: 18, label: 'the flower that changed colour' },
      { id: 'butterfly', x: 210, y: 268, r: 20, label: 'the missing butterfly' },
    ],
  },
  {
    id: 'harbour', name: 'Harbour at Dusk', difficulty: 'Medium', timeLimit: 150, hints: 3,
    blurb: 'Sunset over the pier, boats bobbing and the lighthouse waking up. Eight changes.',
    draw: drawHarbour,
    diffs: [
      { id: 'moon', x: 486, y: 58, r: 26, label: 'the moon that turned crescent' },
      { id: 'gull', x: 210, y: 84, r: 18, label: 'the missing gull' },
      { id: 'sail', x: 174, y: 283, r: 30, label: 'the sail that turned red' },
      { id: 'lamp', x: 474, y: 109, r: 22, label: 'the dark lighthouse lamp' },
      { id: 'window', x: 474, y: 178, r: 18, label: 'the dark lighthouse window' },
      { id: 'flag', x: 489, y: 74, r: 20, label: 'the flag that flipped' },
      { id: 'crate', x: 88, y: 311, r: 24, label: 'the missing crate' },
      { id: 'lantern', x: 300, y: 315, r: 20, label: 'the unlit pier lantern' },
    ],
  },
  {
    id: 'observatory', name: 'Moon Observatory', difficulty: 'Hard', timeLimit: 120, hints: 2,
    blurb: 'A quiet night in the observatory dome. Ten tiny changes — the hardest hunt.',
    draw: drawObservatory,
    diffs: [
      { id: 'star', x: 195, y: 185, r: 16, label: 'the bright star that went out' },
      { id: 'ring', x: 120, y: 190, r: 30, label: 'the planet that lost its ring' },
      { id: 'telescope', x: 400, y: 240, r: 34, label: 'the telescope that swung level' },
      { id: 'clock', x: 512, y: 52, r: 28, label: 'the clock hands that moved' },
      { id: 'pin', x: 368, y: 92, r: 14, label: 'the missing red pin' },
      { id: 'book', x: 56, y: 308, r: 20, label: 'the book that turned red' },
      { id: 'steam', x: 156, y: 284, r: 18, label: 'the mug that stopped steaming' },
      { id: 'rocket', x: 250, y: 292, r: 26, label: 'the rocket fins that turned red' },
      { id: 'lamp', x: 434, y: 292, r: 22, label: 'the desk lamp that went dark' },
      { id: 'cat', x: 456, y: 306, r: 20, label: 'the cat that lowered its tail' },
    ],
  },
];
