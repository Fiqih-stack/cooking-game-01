// Dapur Kilat v19 — render (canvas 2D).
// v19: S1 tombol upgrade di footer + Lv di panel stasiun; S2 tiket PAKET;
// S3 partikel koin + rincian bayaran; S4 koki + latar dapur hidup;
// S6 sparkle Cling + kilau fresh order baru.
// Dipertahankan v18: VIP (tiket emas), urgensi <10 dtk, preview tiket,
// SPESIAL (pil emas), kilau emas kombo >= 3, header oranye RUSH.
// v17: preview hidangan di tiket. v15: counter 2x9. v14: SEMPURNA! + uap.

import { COUNTER, DISHES, INGREDIENTS, KEY_LABELS, LAYOUT, RULES, STATIONS, UPGRADE_COSTS, UPGRADE_MAX, UPGRADE_TIMES, counterCardRect } from './config.js';
import { orderPrice, requiredIngredients, stationTime } from './state.js';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, s, x, y, font, color, align = 'left', baseline = 'alphabetic') {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(s, x, y);
}

// v19 S4: koki mungil. mood: 'senyum' | 'rayakan' | 'sedih'.
// Digambar dari bentuk dasar (topi, wajah, apron, lengan).
export function drawChef(ctx, x, y, sc, mood = 'senyum') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sc, sc);
  // Badan / apron.
  ctx.fillStyle = '#f7f3ea';
  rr(ctx, -26, 18, 52, 46, 10);
  ctx.fill();
  ctx.strokeStyle = '#d8cfb8';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#e2574c';
  rr(ctx, -26, 18, 52, 12, 6);
  ctx.fill();
  // Lengan.
  ctx.strokeStyle = '#f7f3ea';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (mood === 'rayakan') {
    ctx.moveTo(-24, 26); ctx.lineTo(-40, -6);
    ctx.moveTo(24, 26); ctx.lineTo(40, -6);
  } else if (mood === 'sedih') {
    ctx.moveTo(-24, 26); ctx.lineTo(-34, 52);
    ctx.moveTo(24, 26); ctx.lineTo(34, 52);
  } else {
    ctx.moveTo(-24, 26); ctx.lineTo(-40, 10);
    ctx.moveTo(24, 26); ctx.lineTo(42, 2);
  }
  ctx.stroke();
  // Tangan (melambai saat senyum).
  ctx.fillStyle = '#f2c9a0';
  ctx.beginPath();
  if (mood === 'rayakan') { ctx.arc(-40, -8, 6, 0, Math.PI * 2); ctx.arc(40, -8, 6, 0, Math.PI * 2); }
  else if (mood === 'sedih') { ctx.arc(-34, 54, 6, 0, Math.PI * 2); ctx.arc(34, 54, 6, 0, Math.PI * 2); }
  else { ctx.arc(-40, 10, 6, 0, Math.PI * 2); ctx.arc(44, 0, 6, 0, Math.PI * 2); }
  ctx.fill();
  // Kepala.
  ctx.fillStyle = '#f2c9a0';
  ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fill();
  // Topi koki.
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-14, -20, 11, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -24, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(14, -20, 11, 0, Math.PI * 2); ctx.fill();
  rr(ctx, -22, -26, 44, 12, 5); ctx.fill();
  ctx.strokeStyle = '#e3dcc8'; ctx.lineWidth = 1.5; ctx.stroke();
  // Mata.
  ctx.fillStyle = '#2b2118';
  ctx.beginPath(); ctx.arc(-8, -2, 2.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(8, -2, 2.6, 0, Math.PI * 2); ctx.fill();
  // Mulut.
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (mood === 'sedih') { ctx.arc(0, 14, 6, Math.PI * 1.15, Math.PI * 1.85); }
  else { ctx.arc(0, 6, 7, 0.15 * Math.PI, 0.85 * Math.PI); }
  ctx.stroke();
  // Pipi.
  ctx.fillStyle = 'rgba(226,87,76,0.35)';
  ctx.beginPath(); ctx.arc(-14, 6, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(14, 6, 4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// Latar: dinding hangat bermotif ubin + rak toples (v19 S4).
function drawBackground(ctx, s) {
  ctx.fillStyle = '#f3e9d2';
  ctx.fillRect(0, 0, 1280, 720);
  // Motif ubin hangat.
  ctx.strokeStyle = 'rgba(190,160,110,0.25)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1280; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 720); ctx.stroke();
  }
  for (let y = 0; y <= 720; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1280, y); ctx.stroke();
  }
  // Rak kayu dengan 3 toples di strip latar (y 600-612, area kiri).
  ctx.fillStyle = '#a8763e';
  ctx.fillRect(12, 600, 220, 8);
  const jarColors = ['#e8b96a', '#3e9b4f', '#c93a1e'];
  for (let i = 0; i < 3; i++) {
    const jx = 30 + i * 70;
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    rr(ctx, jx, 566, 34, 34, 6); ctx.fill();
    ctx.fillStyle = jarColors[i];
    rr(ctx, jx + 4, 576, 26, 20, 4); ctx.fill();
    ctx.fillStyle = '#8a5a3b';
    ctx.fillRect(jx + 6, 562, 22, 6);
  }
}

// Header: koin, saji, kombo, waktu, strike. Oranye saat RUSH (v18 C2).
function drawHeader(ctx, s, L) {
  const rush = s.rushActive;
  ctx.fillStyle = rush ? '#b85a1e' : '#5a3a1e';
  ctx.fillRect(0, 0, 1280, 64);
  text(ctx, 'Rp ' + s.coins, 24, 42, 'bold 30px sans-serif', '#ffd94d');
  text(ctx, 'Saji: ' + s.served + '/12', 200, 40, '22px sans-serif', '#fff');
  // v18 C4: teks Kombo emas + tebal bila kombo >= 3.
  const comboGold = s.combo >= RULES.comboGlowAt;
  text(ctx, 'Kombo: x' + s.combo, 380, 40, (comboGold ? 'bold ' : '') + '22px sans-serif', comboGold ? '#ffd700' : '#fff');
  text(ctx, 'Waktu: ' + Math.max(0, Math.floor(s.time)) + ' dtk', 580, 40, '22px sans-serif', '#fff');
  text(ctx, 'Strike: ' + s.strikes + '/3', 800, 40, '22px sans-serif', s.strikes > 0 ? '#ff8a7a' : '#fff');
  if (rush) {
    const a = 0.7 + 0.3 * Math.sin(s.time * 6);
    ctx.globalAlpha = a;
    text(ctx, '⚡ RUSH!', 1080, 42, 'bold 26px sans-serif', '#ffd700');
    ctx.globalAlpha = 1;
  } else if (s.hand) {
    text(ctx, 'Di tangan: ' + INGREDIENTS[s.hand].label, 1080, 40, '20px sans-serif', '#ffe9b0', 'left');
  }
  if (s.paused) {
    text(ctx, 'JEDA (P)', 640, 40, 'bold 22px sans-serif', '#ffd94d', 'center');
  }
}

// ---- Ikon bahan (dipakai di kartu counter, tiket, dan piring) ----
function drawIngredientIcon(ctx, id, x, y, r) {
  const ing = INGREDIENTS[id];
  if (!ing) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = ing.color;
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 1.5;
  if (id === 'nasi') {
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff8e0';
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-r * 0.5 + i * r * 0.25, -r * 0.2 + (i % 2) * r * 0.25, r * 0.14, 0, Math.PI * 2); ctx.fill(); }
  } else if (id === 'telur') {
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff9d2e';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'kecap') {
    ctx.fillStyle = '#5a2c12';
    rr(ctx, -r * 0.45, -r, r * 0.9, r * 2, r * 0.3); ctx.fill();
    ctx.fillStyle = '#3a1c0a';
    ctx.fillRect(-r * 0.45, -r * 0.4, r * 0.9, r * 0.5);
  } else if (id === 'udang') {
    ctx.strokeStyle = '#f28b6d'; ctx.lineWidth = r * 0.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.6, 0.3, Math.PI * 1.7); ctx.stroke();
    ctx.fillStyle = '#f7e8c8';
    ctx.beginPath(); ctx.arc(r * 0.55, -r * 0.35, r * 0.28, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'spaghetti') {
    ctx.strokeStyle = '#f2c94c'; ctx.lineWidth = 2.5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(-r * 0.6, i * r * 0.32); ctx.lineTo(r * 0.6, i * r * 0.32); ctx.stroke();
    }
  } else if (id === 'daging') {
    ctx.fillStyle = '#c0392b';
    rr(ctx, -r * 0.8, -r * 0.5, r * 1.6, r, r * 0.3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f7e8e0';
    ctx.beginPath(); ctx.arc(-r * 0.3, 0, r * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.35, -r * 0.1, r * 0.15, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'saus') {
    ctx.fillStyle = '#c93a1e';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#8a2410';
    ctx.beginPath(); ctx.arc(-r * 0.2, -r * 0.2, r * 0.25, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'keju') {
    ctx.fillStyle = '#fff6e0';
    ctx.beginPath(); ctx.moveTo(-r * 0.8, r * 0.5); ctx.lineTo(r * 0.8, r * 0.5); ctx.lineTo(0, -r * 0.7); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e8c96a';
    ctx.beginPath(); ctx.arc(0, r * 0.1, r * 0.16, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'roti') {
    ctx.fillStyle = '#e8b96a';
    ctx.beginPath(); ctx.ellipse(0, 0, r * 0.85, r * 0.55, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c98a3a';
    ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.15, r * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.25, -r * 0.1, r * 0.1, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'patty') {
    ctx.fillStyle = '#8a5a3b';
    ctx.beginPath(); ctx.ellipse(0, 0, r * 0.85, r * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#6a4028';
    ctx.beginPath(); ctx.arc(-r * 0.3, 0, r * 0.14, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'selada') {
    ctx.fillStyle = '#3e9b4f';
    ctx.beginPath(); ctx.ellipse(-r * 0.3, 0, r * 0.55, r * 0.4, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(r * 0.3, 0, r * 0.55, r * 0.4, 0.4, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'teh') {
    ctx.fillStyle = '#a85a2a';
    rr(ctx, -r * 0.4, -r * 0.8, r * 0.8, r * 1.6, r * 0.2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#7a3a1a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(r * 0.4, -r * 0.4); ctx.arc(r * 0.6, 0, r * 0.35, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  } else if (id === 'es') {
    ctx.fillStyle = '#bfe8ff';
    ctx.save(); ctx.rotate(Math.PI / 4);
    ctx.fillRect(-r * 0.45, -r * 0.45, r * 0.9, r * 0.9);
    ctx.restore();
    ctx.strokeStyle = '#7ab8d8'; ctx.strokeRect(-r * 0.45, -r * 0.45, r * 0.9, r * 0.9);
  } else if (id === 'gula') {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-r * 0.4 + i * r * 0.4, (i % 2) * r * 0.3 - r * 0.1, r * 0.22, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
  } else if (id === 'stroberi') {
    ctx.fillStyle = '#e83e6b';
    ctx.beginPath(); ctx.moveTo(0, r * 0.8); ctx.quadraticCurveTo(-r * 0.9, -r * 0.2, 0, -r * 0.6); ctx.quadraticCurveTo(r * 0.9, -r * 0.2, 0, r * 0.8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2a9a3a';
    ctx.beginPath(); ctx.moveTo(0, -r * 0.6); ctx.lineTo(-r * 0.4, -r); ctx.lineTo(0, -r * 0.75); ctx.lineTo(r * 0.4, -r); ctx.closePath(); ctx.fill();
  } else if (id === 'soda') {
    ctx.fillStyle = '#bfe8ff';
    rr(ctx, -r * 0.35, -r, r * 0.7, r * 2, r * 0.25); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, -r * 0.4, r * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.15, 0, r * 0.12, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'lemon') {
    ctx.fillStyle = '#f2d95c';
    ctx.beginPath(); ctx.ellipse(0, 0, r * 0.8, r * 0.55, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d8b93a';
    ctx.beginPath(); ctx.arc(r * 0.7, -r * 0.3, r * 0.16, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'mint') {
    ctx.fillStyle = '#2a9a3a';
    ctx.beginPath(); ctx.ellipse(0, -r * 0.2, r * 0.3, r * 0.6, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -r * 0.2, r * 0.3, r * 0.6, -0.4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// Uap bergerak (v14): naik-turun halus, deterministik dari s.time.
function drawSteam(ctx, cx, cy, time) {
  ctx.save();
  ctx.strokeStyle = 'rgba(180,180,180,0.5)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const ox = (i - 1) * 16;
    const wob = Math.sin(time * 2.5 + i * 1.3) * 3;
    ctx.beginPath();
    ctx.moveTo(cx + ox, cy);
    ctx.quadraticCurveTo(cx + ox + wob, cy - 10, cx + ox - wob, cy - 20);
    ctx.stroke();
  }
  ctx.restore();
}

// ---- Gambar hidangan jadi (skala: 1.0 = ukuran piring penuh) ----
function drawNasgorDish(ctx, cx, cy, sc, time) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
  // Piring.
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(0, 6, 78, 26, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  // Gundukan nasi keemasan.
  ctx.fillStyle = '#e8b93a';
  ctx.beginPath(); ctx.ellipse(0, -6, 58, 30, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#f2c94c';
  ctx.beginPath(); ctx.ellipse(-6, -10, 46, 24, 0, Math.PI, 0); ctx.fill();
  // Butir nasi.
  ctx.fillStyle = '#fff3c8';
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    const rx = Math.cos(a) * (18 + (i % 3) * 9);
    const ry = -8 - Math.abs(Math.sin(a)) * 16 - (i % 4) * 2;
    ctx.beginPath(); ctx.ellipse(rx, ry, 3.2, 1.8, a, 0, Math.PI * 2); ctx.fill();
  }
  // Telur kecil di kanan atas.
  ctx.fillStyle = '#fff8e0';
  ctx.beginPath(); ctx.ellipse(30, -26, 16, 11, 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff9d2e';
  ctx.beginPath(); ctx.arc(30, -26, 6, 0, Math.PI * 2); ctx.fill();
  // 2 udang kecil di tepi.
  for (const sx of [-46, 46]) {
    ctx.strokeStyle = '#f28b6d'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(sx, 0, 10, 0.4, Math.PI * 1.6); ctx.stroke();
    ctx.fillStyle = '#f7e8c8';
    ctx.beginPath(); ctx.arc(sx + 8, -6, 4, 0, Math.PI * 2); ctx.fill();
  }
  // Kerupuk + selada.
  ctx.fillStyle = '#fff3d0';
  ctx.beginPath(); ctx.ellipse(-52, 12, 12, 7, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3e9b4f';
  ctx.beginPath(); ctx.ellipse(52, 14, 12, 6, 0.4, 0, Math.PI * 2); ctx.fill();
  // v18 C1: tomat + timun 2+2 BERLAPIS di sisi gundukan (kanan-bawah).
  // Digambar kanan-ke-kiri supaya tiap irisan menumpuk irisan sebelumnya.
  const slices = [
    { dx: 44, dy: 20, kind: 'tomat' },
    { dx: 32, dy: 23, kind: 'timun' },
    { dx: 20, dy: 25, kind: 'tomat' },
    { dx: 8, dy: 26, kind: 'timun' },
  ];
  for (const sl of slices) {
    if (sl.kind === 'tomat') {
      ctx.fillStyle = '#e83e3e';
      ctx.beginPath(); ctx.arc(sl.dx, sl.dy, 8.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff8a7a';
      ctx.beginPath(); ctx.arc(sl.dx, sl.dy, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c93a1e';
      ctx.beginPath(); ctx.arc(sl.dx, sl.dy, 2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = '#2a9a3a';
      ctx.beginPath(); ctx.arc(sl.dx, sl.dy, 8.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#bfe8a0';
      ctx.beginPath(); ctx.arc(sl.dx, sl.dy, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7ab85a';
      ctx.beginPath(); ctx.arc(sl.dx, sl.dy, 2.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  drawSteam(ctx, 0, -40, time);
  ctx.restore();
}

function drawSpaghettiDish(ctx, cx, cy, sc, time) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(0, 8, 76, 24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  // Sarang mie tinggi, helai rapat tanpa rongga.
  ctx.fillStyle = '#f2e6a8';
  ctx.beginPath(); ctx.ellipse(0, -4, 54, 34, 0, Math.PI, 0); ctx.fill();
  ctx.strokeStyle = '#e8d488'; ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath(); ctx.ellipse(0, -6 - i * 3, 48 - i * 3, 8, 0, Math.PI, 0); ctx.stroke();
  }
  // Saus natural: gumpalan organik di puncak + 3 drip.
  ctx.fillStyle = '#c93a1e';
  ctx.beginPath();
  ctx.moveTo(-26, -34);
  ctx.quadraticCurveTo(-30, -48, -12, -46);
  ctx.quadraticCurveTo(-4, -54, 8, -46);
  ctx.quadraticCurveTo(26, -48, 24, -34);
  ctx.quadraticCurveTo(0, -28, -26, -34);
  ctx.fill();
  ctx.fillStyle = '#a82e16';
  for (const dx of [-16, 2, 16]) {
    ctx.beginPath(); ctx.ellipse(dx, -26, 4, 10, 0, 0, Math.PI * 2); ctx.fill();
  }
  // Daun basil.
  ctx.fillStyle = '#2a9a3a';
  ctx.beginPath(); ctx.ellipse(-6, -48, 7, 4, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(6, -48, 7, 4, 0.5, 0, Math.PI * 2); ctx.fill();
  // Taburan keju.
  ctx.fillStyle = '#fff6e0';
  for (let i = 0; i < 8; i++) {
    ctx.fillRect(-30 + i * 8, -18 + (i % 2) * 6, 4, 2);
  }
  drawSteam(ctx, 0, -52, time);
  ctx.restore();
}

function drawMieGorengDish(ctx, cx, cy, sc, time) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(0, 8, 78, 24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  // Gundukan mie LEBAR & DATAR cokelat-keemasan.
  ctx.fillStyle = '#c98a3a';
  ctx.beginPath(); ctx.ellipse(0, -2, 62, 20, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#d8a04a';
  ctx.beginPath(); ctx.ellipse(0, -6, 56, 16, 0, Math.PI, 0); ctx.fill();
  // Helai bergelombang + glaze kecap.
  ctx.strokeStyle = '#a8763e'; ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(-48 + i * 4, -10 - i * 2);
    ctx.quadraticCurveTo(-20, -18 - i * 2, 10, -12 - i * 2);
    ctx.quadraticCurveTo(34, -8 - i * 2, 50, -12 - i * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = '#5a2c12'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-30, -16); ctx.quadraticCurveTo(0, -20, 30, -16); ctx.stroke();
  // Telur ceplok + selada.
  ctx.fillStyle = '#fff8e0';
  ctx.beginPath(); ctx.ellipse(26, -20, 14, 9, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff9d2e';
  ctx.beginPath(); ctx.arc(26, -20, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3e9b4f';
  ctx.beginPath(); ctx.ellipse(-38, 2, 12, 6, 0.4, 0, Math.PI * 2); ctx.fill();
  drawSteam(ctx, 0, -34, time);
  ctx.restore();
}

function drawBurgerDish(ctx, cx, cy, sc, time) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(0, 10, 72, 22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  // Roti bawah.
  ctx.fillStyle = '#e8b96a';
  rr(ctx, -34, 2, 68, 10, 5); ctx.fill();
  // Selada.
  ctx.fillStyle = '#3e9b4f';
  ctx.beginPath(); ctx.ellipse(0, 0, 38, 7, 0, 0, Math.PI * 2); ctx.fill();
  // Keju.
  ctx.fillStyle = '#ffe066';
  ctx.beginPath(); ctx.moveTo(-36, -2); ctx.lineTo(36, -2); ctx.lineTo(28, -10); ctx.lineTo(-28, -10); ctx.closePath(); ctx.fill();
  // Patty tebal.
  ctx.fillStyle = '#8a5a3b';
  rr(ctx, -36, -20, 72, 12, 6); ctx.fill();
  ctx.fillStyle = '#6a4028';
  ctx.beginPath(); ctx.arc(-14, -14, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(12, -14, 3, 0, Math.PI * 2); ctx.fill();
  // Roti atas + wijen.
  ctx.fillStyle = '#e8b96a';
  ctx.beginPath(); ctx.ellipse(0, -22, 36, 16, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#fff3d0';
  for (const [sx, sy] of [[-14, -32], [0, -36], [14, -32], [-6, -28], [8, -28]]) {
    ctx.beginPath(); ctx.ellipse(sx, sy, 2.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
  }
  // Kentang goreng (pendamping visual, BUKAN bahan).
  ctx.fillStyle = '#e83e3e';
  ctx.beginPath(); ctx.moveTo(48, -6); ctx.lineTo(70, -6); ctx.lineTo(66, 14); ctx.lineTo(52, 14); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f2c94c';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(51 + i * 5, -16 - (i % 2) * 4, 4, 14);
  }
  drawSteam(ctx, 0, -40, time);
  ctx.restore();
}

function drawDrinkDish(ctx, cx, cy, sc, time, kind) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
  // Piring kecil.
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(0, 12, 52, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  // Gelas.
  const body = kind === 'esteh' ? '#c98a3a' : kind === 'strawsquash' ? '#e83e6b' : '#f2d95c';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath(); ctx.moveTo(-18, -34); ctx.lineTo(18, -34); ctx.lineTo(14, 10); ctx.lineTo(-14, 10); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#c8b898'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = body;
  ctx.beginPath(); ctx.moveTo(-15, -28); ctx.lineTo(15, -28); ctx.lineTo(12, 8); ctx.lineTo(-12, 8); ctx.closePath(); ctx.fill();
  // Es batu.
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.save(); ctx.rotate(0.5); ctx.fillRect(-8, -18, 10, 10); ctx.restore();
  ctx.save(); ctx.rotate(-0.4); ctx.fillRect(2, -10, 9, 9); ctx.restore();
  // Sedotan.
  ctx.strokeStyle = kind === 'esteh' ? '#e83e3e' : '#2a9a3a';
  ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(8, -30); ctx.lineTo(16, -48); ctx.stroke();
  // Hiasan.
  if (kind === 'strawsquash') {
    ctx.fillStyle = '#e83e6b';
    ctx.beginPath(); ctx.arc(-20, -30, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a9a3a';
    ctx.beginPath(); ctx.ellipse(-20, -38, 6, 3, -0.4, 0, Math.PI * 2); ctx.fill();
  } else if (kind === 'lemonsquash') {
    ctx.fillStyle = '#f2d95c';
    ctx.beginPath(); ctx.arc(-20, -30, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a9a3a';
    ctx.beginPath(); ctx.ellipse(-14, -36, 6, 3, 0.4, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.fillStyle = '#a85a2a';
    ctx.beginPath(); ctx.arc(-20, -28, 5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// Dispatcher hidangan jadi.
export function drawDish(ctx, dishId, cx, cy, sc, time) {
  if (dishId === 'nasgor') drawNasgorDish(ctx, cx, cy, sc, time);
  else if (dishId === 'spaghetti') drawSpaghettiDish(ctx, cx, cy, sc, time);
  else if (dishId === 'miegoreng') drawMieGorengDish(ctx, cx, cy, sc, time);
  else if (dishId === 'burger') drawBurgerDish(ctx, cx, cy, sc, time);
  else if (dishId === 'esteh') drawDrinkDish(ctx, cx, cy, sc, time, 'esteh');
  else if (dishId === 'strawsquash') drawDrinkDish(ctx, cx, cy, sc, time, 'strawsquash');
  else if (dishId === 'lemonsquash') drawDrinkDish(ctx, cx, cy, sc, time, 'lemonsquash');
}

// ---- Panel stasiun (talenan / kompor) ----
function drawStation(ctx, s, name, box) {
  const st = STATIONS[name];
  const lv = s.upg ? s.upg[name] : 0;
  const isKompor = name === 'kompor';
  ctx.fillStyle = isKompor ? '#3a3a3a' : '#f2e2c8';
  rr(ctx, box.x, box.y, box.w, box.h, 12); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  const labelColor = isKompor ? '#fff' : '#5a3a1e';
  text(ctx, st.name, box.x + box.w / 2, box.y + 30, 'bold 22px sans-serif', labelColor, 'center');
  // v19 S1: badge level upgrade.
  text(ctx, 'Lv' + lv + ' ⚡', box.x + box.w - 14, box.y + 30, 'bold 15px sans-serif', lv > 0 ? '#ffd700' : (isKompor ? '#999' : '#a08a68'), 'right');
  const item = s.stations[name];
  const cx = box.x + box.w / 2;
  const cy = box.y + 120;
  if (item) {
    // Item sedang diolah + progress.
    drawIngredientIcon(ctx, item.item, cx, cy - 10, 30);
    const frac = item.total > 0 ? item.t / item.total : 0;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    rr(ctx, box.x + 24, box.y + 168, box.w - 48, 14, 7); ctx.fill();
    ctx.fillStyle = '#ffd94d';
    rr(ctx, box.x + 24, box.y + 168, (box.w - 48) * Math.min(1, frac), 14, 7); ctx.fill();
    text(ctx, INGREDIENTS[item.item].label + ' diolah…', cx, box.y + 204, '16px sans-serif', labelColor, 'center');
  } else {
    // Kosong: gambar alat stasiun.
    if (isKompor) {
      ctx.fillStyle = '#555';
      ctx.beginPath(); ctx.arc(cx - 34, cy, 34, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 34, cy, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff8a3a';
      ctx.beginPath(); ctx.arc(cx - 34, cy, 12, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 34, cy, 12, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = '#d8b96a';
      rr(ctx, cx - 70, cy - 40, 140, 80, 8); ctx.fill();
      ctx.strokeStyle = '#a8763e'; ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(cx - 56, cy - 20 + i * 20); ctx.lineTo(cx + 56, cy - 20 + i * 20); ctx.stroke();
      }
      ctx.strokeStyle = '#cfd8dc'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx + 60, cy - 46); ctx.lineTo(cx + 86, cy + 10); ctx.stroke();
    }
    text(ctx, 'Kosong — klik bahan dulu', cx, box.y + 204, '16px sans-serif', labelColor, 'center');
  }
}

// ---- Panel piring ----
function drawPlate(ctx, s, L) {
  const box = L.piring;
  // v18 C4: kilau emas bila kombo >= 3 (alpha min 0.4 agar selalu terlihat).
  ctx.fillStyle = '#fff8ea';
  rr(ctx, box.x, box.y, box.w, box.h, 12); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  if (s.combo >= RULES.comboGlowAt) {
    const glow = 0.7 + 0.3 * Math.sin(s.time * 4);
    ctx.strokeStyle = 'rgba(255,215,0,' + glow.toFixed(3) + ')';
    ctx.lineWidth = 5;
    rr(ctx, box.x + 2, box.y + 2, box.w - 4, box.h - 4, 10); ctx.stroke();
    ctx.lineWidth = 2;
  }
  // v19 S4: topi koki kecil di sudut panel.
  ctx.save();
  ctx.translate(box.x + 26, box.y + 22);
  ctx.scale(0.32, 0.32);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-14, -20, 11, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -24, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(14, -20, 11, 0, Math.PI * 2); ctx.fill();
  rr(ctx, -22, -26, 44, 12, 5); ctx.fill();
  ctx.restore();
  text(ctx, 'PIRING', box.x + box.w / 2, box.y + 30, 'bold 22px sans-serif', '#5a3a1e', 'center');
  const pc = L.plateCenter;
  if (s.plate.length === 0) {
    // Piring kosong.
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(pc.x, pc.y, 70, 24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, 'Klik piring untuk taruh bahan', pc.x, pc.y + 52, '15px sans-serif', '#a08a68', 'center');
    return;
  }
  // Cek apakah piring cocok dengan satu order -> gambar hidangan jadi.
  let matchedDish = null;
  for (const o of s.orders) {
    const req = requiredIngredients(o);
    if (req.length === s.plate.length && req.every((id) => s.plate.includes(id))) {
      matchedDish = o.paket ? o.paket[0] : o.dish;
      break;
    }
  }
  if (matchedDish) {
    drawDish(ctx, matchedDish, pc.x, pc.y, 0.85, s.time);
  } else {
    // Bahan lepas: grid kecil (maks 8, 2 baris x 4) — v19 muat paket.
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(pc.x, pc.y, 70, 24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
    const n = s.plate.length;
    const cols = Math.min(4, n);
    const rows = Math.ceil(n / 4);
    const gapX = 34, gapY = 30;
    const startX = pc.x - ((cols - 1) * gapX) / 2;
    const startY = pc.y - ((rows - 1) * gapY) / 2 - 4;
    for (let i = 0; i < n; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      drawIngredientIcon(ctx, s.plate[i], startX + col * gapX, startY + row * gapY, 13);
    }
  }
  // SEMPURNA! + float +Rp.
  if (s.perfect) {
    text(ctx, 'SEMPURNA!', pc.x, box.y + 168, 'bold 26px sans-serif', '#ffd700', 'center');
  }
  if (s.floatText) {
    ctx.globalAlpha = Math.min(1, s.floatText.t / 0.6);
    text(ctx, s.floatText.text, pc.x, box.y + 196, 'bold 22px sans-serif', '#2a9a3a', 'center');
    ctx.globalAlpha = 1;
  }
}

// ---- Area pesan + tombol SAJIKAN ----
function drawMessage(ctx, s, L) {
  const box = L.pesan;
  ctx.fillStyle = '#fff3d0';
  rr(ctx, box.x, box.y, box.w, box.h, 10); ctx.fill();
  ctx.strokeStyle = '#e8d8a8'; ctx.lineWidth = 1.5; ctx.stroke();
  text(ctx, s.message, box.x + 16, box.y + 20, '17px sans-serif', '#5a3a1e');
  // v19 S3: rincian bayaran (baris ke-2, kecil).
  if (s.breakdown && s.messageT > 0) {
    text(ctx, s.breakdown, box.x + 16, box.y + 40, '13px sans-serif', '#8a6a3a');
  }
}

function drawServeButton(ctx, s, L) {
  const box = L.sajikan;
  const canServe = s.plate.length > 0;
  ctx.fillStyle = canServe ? '#2a9a3a' : '#8aa88a';
  rr(ctx, box.x, box.y, box.w, box.h, 10); ctx.fill();
  text(ctx, 'SAJIKAN (Spasi)', box.x + box.w / 2, box.y + 32, 'bold 22px sans-serif', '#fff', 'center');
}

// ---- Counter 18 kartu ----
function drawCounter(ctx, s, L) {
  for (let i = 0; i < COUNTER.length; i++) {
    const card = counterCardRect(L, i);
    const id = COUNTER[i];
    const ing = INGREDIENTS[id];
    const inHand = s.hand === id;
    const onPlate = s.plate.includes(id);
    ctx.fillStyle = inHand ? '#ffe9b0' : '#fff8ea';
    rr(ctx, card.x, card.y, card.w, card.h, 8); ctx.fill();
    ctx.strokeStyle = inHand ? '#e2574c' : '#d8cfb8';
    ctx.lineWidth = inHand ? 3 : 1.5; ctx.stroke();
    drawIngredientIcon(ctx, id, card.x + card.w / 2, card.y + 34, 20);
    text(ctx, ing.label, card.x + card.w / 2, card.y + 66, 'bold 14px sans-serif', '#5a3a1e', 'center');
    const stLabel = ing.station === 'siap' ? 'Siap pakai' : ('Olah: ' + STATIONS[ing.station].name);
    text(ctx, stLabel, card.x + card.w / 2, card.y + 84, '12px sans-serif', '#8a6a3a', 'center');
    text(ctx, '[' + KEY_LABELS[i] + ']', card.x + card.w / 2, card.y + 100, '12px sans-serif', '#a08a68', 'center');
    if (onPlate) {
      ctx.fillStyle = '#2a9a3a';
      ctx.beginPath(); ctx.arc(card.x + card.w - 14, card.y + 14, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(card.x + card.w - 18, card.y + 14); ctx.lineTo(card.x + card.w - 15, card.y + 18); ctx.lineTo(card.x + card.w - 9, card.y + 9); ctx.stroke();
    }
  }
}

// ---- Footer: toko upgrade (v19 S1) + instruksi ----
function drawFooter(ctx, s, L) {
  const box = L.footer;
  ctx.fillStyle = '#f7ecd4';
  rr(ctx, box.x, box.y, box.w, box.h, 10); ctx.fill();
  ctx.strokeStyle = '#e8d8a8'; ctx.lineWidth = 1.5; ctx.stroke();
  text(ctx, '⚡ UPGRADE STASIUN — pakai koin untuk masak lebih cepat:', box.x + 12, box.y + 16, 'bold 13px sans-serif', '#5a3a1e');
  for (const name of ['talenan', 'kompor']) {
    const b = L.tombolUpgrade[name];
    const lv = s.upg[name];
    const maxed = lv >= UPGRADE_MAX;
    const cost = maxed ? 0 : UPGRADE_COSTS[name][lv];
    const afford = !maxed && s.coins >= cost;
    ctx.fillStyle = maxed ? '#d8d0c0' : afford ? '#ffd94d' : '#e8e0d0';
    rr(ctx, b.x, b.y, b.w, b.h, 8); ctx.fill();
    ctx.strokeStyle = maxed ? '#b8b0a0' : afford ? '#c98a3a' : '#c8b898';
    ctx.lineWidth = 2; ctx.stroke();
    const nextTime = maxed ? UPGRADE_TIMES[name][lv] : UPGRADE_TIMES[name][lv + 1];
    const label = STATIONS[name].name + ' Lv' + lv + ' → ' + nextTime + ' dtk' + (maxed ? ' — MAX' : ' — Rp ' + cost);
    text(ctx, label, b.x + b.w / 2, b.y + 26, 'bold 15px sans-serif', maxed ? '#8a8070' : '#5a3a1e', 'center');
  }
  text(ctx, 'Klik / 1-9, A-L: ambil bahan • Spasi: sajikan • R: ulang • P: jeda • Sajikan 12 pesanan.', box.x + 12, box.y + 88, '12px sans-serif', '#8a6a3a');
}

// ---- Papan pesanan (tiket) ----
function drawTicket(ctx, s, order, idx, L) {
  const t = {
    x: L.tiket.x,
    y: L.tiket.y + idx * (L.tiket.h + L.tiket.gap),
    w: L.tiket.w,
    h: L.tiket.h,
  };
  const urgent = order.patience < RULES.urgentSeconds;
  const isPaket = !!order.paket;
  // Latar tiket.
  ctx.fillStyle = order.vip ? '#fff6d6' : '#fff8ea';
  rr(ctx, t.x, t.y, t.w, t.h, 10); ctx.fill();
  // Border: VIP emas tebal; urgent denyut merah; normal cokelat.
  if (order.vip) {
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3;
  } else if (urgent) {
    const pulse = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(s.time * 6));
    ctx.strokeStyle = 'rgba(226,57,57,' + pulse.toFixed(3) + ')'; ctx.lineWidth = 3;
  } else {
    ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2;
  }
  rr(ctx, t.x, t.y, t.w, t.h, 10); ctx.stroke();
  ctx.lineWidth = 2;
  // v19 S6: kilau fresh — order baru berdenyut emas + sparkle di sudut.
  if (order.freshT > 0) {
    const fa = 0.5 + 0.5 * Math.sin(s.time * 8);
    ctx.strokeStyle = 'rgba(255,215,0,' + fa.toFixed(3) + ')';
    ctx.lineWidth = 4;
    rr(ctx, t.x + 2, t.y + 2, t.w - 4, t.h - 4, 8); ctx.stroke();
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(255,215,0,' + fa.toFixed(3) + ')';
    for (const [sx, sy] of [[t.x + 14, t.y + 12], [t.x + t.w - 14, t.y + 12], [t.x + t.w / 2, t.y + 8]]) {
      drawStar(ctx, sx, sy, 6, s.time * 2);
    }
  }
  const price = orderPrice(order);
  if (isPaket) {
    // --- Tiket PAKET: 2 hidangan ---
    // Pil PAKET + harga.
    ctx.fillStyle = '#7a4a9a';
    rr(ctx, t.x + 12, t.y + 10, 62, 20, 10); ctx.fill();
    text(ctx, 'PAKET', t.x + 43, t.y + 25, 'bold 12px sans-serif', '#fff', 'center');
    text(ctx, 'Rp ' + price, t.x + t.w - 12, t.y + 28, 'bold 18px sans-serif', '#2a9a3a', 'right');
    const dA = DISHES[order.paket[0]];
    const dB = DISHES[order.paket[1]];
    text(ctx, (order.vip ? '★ ' : '') + dA.label, t.x + 12, t.y + 52, 'bold 16px sans-serif', '#5a3a1e');
    text(ctx, '+ ' + dB.label, t.x + 12, t.y + 72, 'bold 16px sans-serif', '#5a3a1e');
    // Dua preview berdampingan.
    drawDish(ctx, order.paket[0], t.x + 52, t.y + 108, 0.26, s.time);
    drawDish(ctx, order.paket[1], t.x + 150, t.y + 108, 0.26, s.time);
    // Ikon bahan gabungan (union), 1 baris maks 8.
    const req = requiredIngredients(order);
    const iconW = 36;
    const startX = t.x + 16;
    for (let i = 0; i < req.length; i++) {
      const ix = startX + i * iconW + 14;
      const iy = t.y + 140;
      drawIngredientIcon(ctx, req[i], ix, iy, 13);
      if (s.plate.includes(req[i])) {
        ctx.fillStyle = '#2a9a3a';
        ctx.beginPath(); ctx.arc(ix + 10, iy - 10, 6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ix + 6, iy - 10); ctx.lineTo(ix + 9, iy - 6); ctx.lineTo(ix + 14, iy - 13); ctx.stroke();
      }
    }
  } else {
    // --- Tiket biasa: 1 hidangan ---
    const dish = DISHES[order.dish];
    text(ctx, (order.vip ? '★ ' : '') + dish.label, t.x + 12, t.y + 28, 'bold 18px sans-serif', '#5a3a1e');
    text(ctx, 'Rp ' + price, t.x + t.w - 12, t.y + 28, 'bold 18px sans-serif', '#2a9a3a', 'right');
    // Preview hidangan jadi di kiri + ikon bahan bergeser kanan.
    drawDish(ctx, order.dish, t.x + 44, t.y + 96, 0.38, s.time);
    const iconW = 52;
    const startX = t.x + 92;
    for (let i = 0; i < dish.ingredients.length; i++) {
      const ix = startX + i * iconW + 20;
      const iy = t.y + 96;
      drawIngredientIcon(ctx, dish.ingredients[i], ix, iy, 16);
      if (s.plate.includes(dish.ingredients[i])) {
        ctx.fillStyle = '#2a9a3a';
        ctx.beginPath(); ctx.arc(ix + 12, iy - 12, 8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(ix + 7, iy - 12); ctx.lineTo(ix + 11, iy - 7); ctx.lineTo(ix + 17, iy - 16); ctx.stroke();
      }
    }
  }
  // Bar kesabaran.
  const frac = Math.max(0, order.patience / order.max);
  const barY = t.y + 164;
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  rr(ctx, t.x + 12, barY, t.w - 24, 12, 6); ctx.fill();
  ctx.fillStyle = frac > 0.5 ? '#3e9b4f' : frac > 0.25 ? '#e8a33a' : '#e2574c';
  rr(ctx, t.x + 12, barY, (t.w - 24) * frac, 12, 6); ctx.fill();
  // Teks kesabaran (merah tebal bila urgent).
  if (urgent) {
    text(ctx, 'Kesabaran: ' + Math.ceil(order.patience) + ' dtk', t.x + 12, t.y + 190, 'bold 14px sans-serif', '#e2574c');
  } else {
    text(ctx, 'Kesabaran: ' + Math.ceil(order.patience) + ' dtk', t.x + 12, t.y + 190, '14px sans-serif', '#8a6a3a');
  }
  // Pil SPESIAL (v18 C3).
  if (order.special) {
    ctx.fillStyle = '#ffd700';
    rr(ctx, t.x + t.w - 84, t.y + 164, 70, 18, 9); ctx.fill();
    text(ctx, 'SPESIAL', t.x + t.w - 49, t.y + 178, 'bold 11px sans-serif', '#5a3a1e', 'center');
  }
}

// Bintang 4-sisi (sparkle Cling).
function drawStar(ctx, x, y, r, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, -r); ctx.quadraticCurveTo(0, 0, r, 0); ctx.quadraticCurveTo(0, 0, 0, r);
  ctx.quadraticCurveTo(0, 0, -r, 0); ctx.quadraticCurveTo(0, 0, 0, -r);
  ctx.fill();
  ctx.restore();
}

// v19 S3/S6: partikel koin + sparkle Cling (di atas panel).
function drawFx(ctx, s) {
  for (const p of s.coinFx) {
    ctx.globalAlpha = Math.max(0, p.t / p.life);
    ctx.fillStyle = '#ffd700';
    ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#c98a3a'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#c98a3a';
    ctx.font = 'bold 7px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Rp', p.x, p.y);
  }
  ctx.globalAlpha = 1;
  for (const p of s.sparkles) {
    ctx.globalAlpha = Math.max(0, p.t / p.life);
    ctx.fillStyle = '#ffd700';
    drawStar(ctx, p.x, p.y, p.r, p.rot);
    ctx.fillStyle = '#ffffff';
    drawStar(ctx, p.x, p.y, p.r * 0.5, -p.rot);
  }
  ctx.globalAlpha = 1;
}

// ---- Layar judul ----
function drawTitle(ctx, s, L) {
  drawBackground(ctx, s);
  // Jendela (langit + matahari + awan) di latar judul.
  ctx.fillStyle = '#bfe8ff';
  rr(ctx, 60, 60, 220, 140, 10); ctx.fill();
  ctx.strokeStyle = '#a8763e'; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath(); ctx.arc(120, 110, 24, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(180, 100, 34, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(210, 130, 28, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#a8763e'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(170, 60); ctx.lineTo(170, 200); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(60, 130); ctx.lineTo(280, 130); ctx.stroke();
  // Koki besar di kiri bawah (di bawah label hero, di kiri tombol).
  drawChef(ctx, 150, 470, 1.4, 'senyum');
  text(ctx, 'DAPUR KILAT', 640, 150, 'bold 84px sans-serif', '#e2574c', 'center');
  text(ctx, 'Masak cepat, sajikan tepat waktu!', 640, 200, 'bold 28px sans-serif', '#5a3a1e', 'center');
  text(ctx, 'Ambil bahan, olah di talenan & kompor, rakit di piring, sajikan sebelum hangus.', 640, 238, '20px sans-serif', '#8a6a3a', 'center');
  // Hero 7 hidangan.
  const hero = ['nasgor', 'spaghetti', 'miegoreng', 'burger', 'esteh', 'strawsquash', 'lemonsquash'];
  const labels = ['Nasi Goreng', 'Spaghetti Bolognese', 'Mie Goreng Spesial', 'Burger', 'Es Teh Manis', 'Strawberry Squash', 'Lemon Squash Mint'];
  for (let i = 0; i < hero.length; i++) {
    const hx = 100 + i * 155;
    drawDish(ctx, hero[i], hx, 330, 0.5, s.time);
    text(ctx, labels[i], hx, 400, 'bold 16px sans-serif', '#5a3a1e', 'center');
  }
  // Tombol mulai.
  const b = L.tombolJudul;
  ctx.fillStyle = '#e2574c';
  rr(ctx, b.x, b.y, b.w, b.h, 14); ctx.fill();
  text(ctx, 'MULAI MEMASAK', b.x + b.w / 2, b.y + 42, 'bold 28px sans-serif', '#fff', 'center');
  text(ctx, 'Klik / tombol 1-9, A-L: ambil bahan • Spasi: sajikan • R: ulang • P: jeda', 640, 620, '18px sans-serif', '#5a3a1e', 'center');
  text(ctx, 'Sajikan 12 pesanan untuk menyelesaikan hari. 3 pesanan hangus = shift berakhir.', 640, 650, '18px sans-serif', '#8a6a3a', 'center');
}

// ---- Layar akhir (menang / kalah) ----
function drawEnd(ctx, s, L) {
  drawBackground(ctx, s);
  const win = s.screen === 'win';
  const card = L.kartuAkhir;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, 1280, 720);
  ctx.fillStyle = '#fff8ea';
  rr(ctx, card.x, card.y, card.w, card.h, 16); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  // Koki sesuai mood (lebih besar, mengisi kartu).
  drawChef(ctx, card.x + card.w / 2, card.y + 70, 1.25, win ? 'rayakan' : 'sedih');
  text(ctx, win ? 'HARI SELESAI!' : 'SHIFT BERAKHIR', card.x + card.w / 2, card.y + 170, 'bold 36px sans-serif', win ? '#2a9a3a' : '#e2574c', 'center');
  text(ctx, win ? 'Kamu menyajikan 12 pesanan. Kerja bagus, koki!' : 'Tiga pesanan hangus. Coba lagi, koki!', card.x + card.w / 2, card.y + 205, '18px sans-serif', '#5a3a1e', 'center');
  text(ctx, 'Total koin: Rp ' + s.coins, card.x + card.w / 2, card.y + 245, 'bold 26px sans-serif', '#5a3a1e', 'center');
  text(ctx, 'Pesanan disajikan: ' + s.served + ' • Waktu: ' + Math.floor(s.time) + ' dtk', card.x + card.w / 2, card.y + 275, '18px sans-serif', '#8a6a3a', 'center');
  ctx.fillStyle = '#e2574c';
  rr(ctx, card.x + 130, card.y + 296, 300, 52, 12); ctx.fill();
  text(ctx, 'MAIN LAGI (R)', card.x + card.w / 2, card.y + 330, 'bold 22px sans-serif', '#fff', 'center');
}

// ---- Render utama ----
export function render(ctx, s) {
  const L = LAYOUT;
  ctx.clearRect(0, 0, 1280, 720);
  if (s.screen === 'title') { drawTitle(ctx, s, L); return; }
  if (s.screen === 'win' || s.screen === 'over') { drawEnd(ctx, s, L); return; }
  // Layar main.
  drawBackground(ctx, s);
  drawHeader(ctx, s, L);
  drawStation(ctx, s, 'talenan', L.talenan);
  drawStation(ctx, s, 'kompor', L.kompor);
  drawPlate(ctx, s, L);
  drawMessage(ctx, s, L);
  drawServeButton(ctx, s, L);
  drawCounter(ctx, s, L);
  drawFooter(ctx, s, L);
  // Papan pesanan.
  ctx.fillStyle = '#f7ecd4';
  rr(ctx, L.papan.x, L.papan.y, L.papan.w, L.papan.h, 12); ctx.fill();
  ctx.strokeStyle = '#e8d8a8'; ctx.lineWidth = 2; ctx.stroke();
  text(ctx, 'PESANAN', L.papan.x + L.papan.w / 2, L.papan.y + 4, 'bold 18px sans-serif', '#5a3a1e', 'center');
  for (let i = 0; i < s.orders.length; i++) {
    drawTicket(ctx, s, s.orders[i], i, L);
  }
  // Efek di atas semua panel.
  drawFx(ctx, s);
}
