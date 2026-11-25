// Dapur Kilat v23 — render (canvas 2D).
// v23: R1 Tombol Buang + hapus "Di tangan" dari panel PIRING; R2 border
// RUSH di papan + konfeti menang; R3 tagline + garis emas judul;
// R4 not musik "♪" di header.
// Dipertahankan v22: countdown RUSH + progress level, wajah akhir,
// placeholder papan + ikon tangan, keycap + koin berdenyut.
// v21: statistik akhir, progress bar, dekorasi dapur, batas PAKET,
// perbaiki overlap harga/SEMPURNA.
// v20: speaker, wajah pelanggan, lencana Lv, kartu menu.
// v19: upgrade, PAKET, koin, koki, Cling, RUSH 30.
// v18: VIP, urgensi, preview, SPESIAL, kilau kombo. v17: preview.
// v15: counter 2x9. v14: SEMPURNA! + uap.

import { COUNTER, CUSTOMERS, DISHES, INGREDIENTS, KEY_LABELS, LAYOUT, RULES, STATIONS, UPGRADE_COSTS, UPGRADE_MAX, UPGRADE_TIMES, counterCardRect } from './config.js';
import { levelFor, levelLabel, orderPrice, requiredIngredients, stationTime } from './state.js';

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

// v20 S2: wajah pelanggan. mood: 'senyum' | 'cemas' | 'marah' | 'senang'.
// customerIdx -> CUSTOMERS {skin, hair, style}.
export function drawCustomer(ctx, x, y, r, customerIdx, mood = 'senyum') {
  const c = CUSTOMERS[customerIdx % CUSTOMERS.length];
  ctx.save();
  ctx.translate(x, y);
  // Kepala.
  ctx.fillStyle = c.skin;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Rambut menurut style.
  ctx.fillStyle = c.hair;
  if (c.style === 'panjang') {
    ctx.beginPath(); ctx.arc(0, -r * 0.25, r * 1.05, Math.PI, 0); ctx.fill();
    ctx.fillRect(-r * 1.05, -r * 0.3, r * 0.4, r * 1.1);
    ctx.fillRect(r * 0.65, -r * 0.3, r * 0.4, r * 1.1);
  } else if (c.style === 'ikal') {
    ctx.beginPath(); ctx.arc(-r * 0.6, -r * 0.5, r * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -r * 0.75, r * 0.45, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.6, -r * 0.5, r * 0.4, 0, Math.PI * 2); ctx.fill();
  } else if (c.style === 'topi') {
    ctx.fillStyle = '#e2574c';
    ctx.beginPath(); ctx.ellipse(0, -r * 0.55, r * 1.1, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -r * 0.7, r * 0.6, Math.PI, 0); ctx.fill();
  } else if (c.style === 'bando') {
    ctx.strokeStyle = c.hair;
    ctx.lineWidth = r * 0.25;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, -r * 0.1, r * 0.85, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  } else if (c.style === 'pita') {
    ctx.beginPath(); ctx.arc(0, -r * 0.25, r * 1.0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#e83e6b';
    ctx.beginPath(); ctx.moveTo(r * 0.7, -r * 0.7); ctx.lineTo(r * 1.25, -r * 1.0); ctx.lineTo(r * 1.25, -r * 0.45); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(r * 0.7, -r * 0.7); ctx.lineTo(r * 1.25, -r * 0.4); ctx.lineTo(r * 0.7, -r * 0.4); ctx.closePath(); ctx.fill();
  } else {
    // 'pendek': topi rambut.
    ctx.beginPath(); ctx.arc(0, -r * 0.25, r * 1.0, Math.PI, 0); ctx.fill();
  }
  // Mata.
  ctx.fillStyle = '#2b2118';
  if (mood === 'senang') {
    ctx.strokeStyle = '#2b2118';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(-r * 0.38, -r * 0.05, r * 0.18, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(r * 0.38, -r * 0.05, r * 0.18, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(-r * 0.38, -r * 0.05, r * 0.11, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.38, -r * 0.05, r * 0.11, 0, Math.PI * 2); ctx.fill();
    if (mood === 'cemas') {
      ctx.strokeStyle = '#2b2118';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-r * 0.55, -r * 0.4); ctx.lineTo(-r * 0.2, -r * 0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r * 0.2, -r * 0.5); ctx.lineTo(r * 0.55, -r * 0.4); ctx.stroke();
    }
  }
  // Mulut.
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (mood === 'senang') {
    ctx.arc(0, r * 0.25, r * 0.4, 0.15 * Math.PI, 0.85 * Math.PI);
  } else if (mood === 'marah') {
    ctx.arc(0, r * 0.75, r * 0.3, Math.PI * 1.15, Math.PI * 1.85);
  } else if (mood === 'cemas') {
    ctx.moveTo(-r * 0.2, r * 0.45); ctx.lineTo(r * 0.2, r * 0.45);
  } else {
    ctx.arc(0, r * 0.3, r * 0.3, 0.15 * Math.PI, 0.85 * Math.PI);
  }
  ctx.stroke();
  // Pipi (lebih merah saat marah).
  ctx.fillStyle = mood === 'marah' ? 'rgba(226,57,57,0.5)' : 'rgba(226,87,76,0.3)';
  ctx.beginPath(); ctx.arc(-r * 0.6, r * 0.25, r * 0.16, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(r * 0.6, r * 0.25, r * 0.16, 0, Math.PI * 2); ctx.fill();
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

// Header: koin, saji, level, kombo, waktu, strike. Oranye saat RUSH (v18 C2).
// v20: lencana Lv (S3) + tombol speaker (S1).
// v21 P2: progress bar hari di bawah header.
// v22 Q1: countdown RUSH + progress level; Q3: ikon bahan di kiri teks
// "Di tangan"; Q4: koin berdenyut.
// v23 R4: not musik "♪" di kiri tombol speaker (bila musik berbunyi).
function drawHeader(ctx, s, L) {
  const rush = s.rushActive;
  ctx.fillStyle = rush ? '#b85a1e' : '#5a3a1e';
  ctx.fillRect(0, 0, 1280, 64);
  // v22 Q4: koin berdenyut — font membesar saat baru saji.
  const pulse = s.coinPulse > 0 ? s.coinPulse / RULES.coinPulseSeconds : 0;
  const coinSize = 30 + Math.round(12 * pulse);
  text(ctx, 'Rp ' + s.coins, 24, 42, 'bold ' + coinSize + 'px sans-serif', '#ffd94d');
  text(ctx, 'Saji: ' + s.served + '/12', 200, 40, '22px sans-serif', '#fff');
  // v22 Q1: lencana Level + progress ("Lv 2 (2/4)" / "Lv 3 MAX").
  text(ctx, levelLabel(s), 330, 40, 'bold 22px sans-serif', '#ffd700');
  // v18 C4: teks Kombo emas + tebal bila kombo >= 3.
  const comboGold = s.combo >= RULES.comboGlowAt;
  text(ctx, 'Kombo: x' + s.combo, 450, 40, (comboGold ? 'bold ' : '') + '22px sans-serif', comboGold ? '#ffd700' : '#fff');
  text(ctx, 'Waktu: ' + Math.max(0, Math.floor(s.time)) + ' dtk', 640, 40, '22px sans-serif', '#fff');
  text(ctx, 'Strike: ' + s.strikes + '/3', 830, 40, '22px sans-serif', s.strikes > 0 ? '#ff8a7a' : '#fff');
  if (rush) {
    const a = 0.7 + 0.3 * Math.sin(s.time * 6);
    ctx.globalAlpha = a;
    // v22 Q1: countdown RUSH (sisa detik, dibulatkan ke bawah).
    text(ctx, '⚡ RUSH! ' + Math.floor(s.rushTimer) + ' dtk', 1000, 42, 'bold 26px sans-serif', '#ffd700');
    ctx.globalAlpha = 1;
  } else if (s.hand) {
    // v22 Q3: ikon bahan di kiri teks "Di tangan".
    drawIngredientIcon(ctx, s.hand, 982, 40, 12);
    text(ctx, 'Di tangan: ' + INGREDIENTS[s.hand].label, 1000, 40, '20px sans-serif', '#ffe9b0', 'left');
  }
  if (s.paused) {
    text(ctx, 'JEDA (P)', 640, 40, 'bold 22px sans-serif', '#ffd94d', 'center');
  }
  // v23 R4: not musik "♪" di kiri tombol speaker (bila musik berbunyi).
  if (!s.muted && s.screen === 'main') {
    const bob = Math.sin(s.time * 4) * 3;
    text(ctx, '♪', 1212, 24 + bob, '18px sans-serif', '#ffd700');
  }
  // v20 S1: tombol speaker (bisukan) di pojok kanan header.
  const sp = L.tombolSpeaker;
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  rr(ctx, sp.x, sp.y, sp.w, sp.h, 8); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1.5; ctx.stroke();
  // Ikon speaker: kotak + corong + gelombang (atau X bila bisu).
  const cx = sp.x + 13, cy = sp.y + sp.h / 2;
  ctx.fillStyle = '#fff';
  ctx.fillRect(cx - 6, cy - 3, 5, 6);
  ctx.beginPath(); ctx.moveTo(cx - 1, cy - 8); ctx.lineTo(cx + 7, cy - 3); ctx.lineTo(cx + 7, cy + 3); ctx.lineTo(cx - 1, cy + 8); ctx.closePath(); ctx.fill();
  if (s.muted) {
    ctx.strokeStyle = '#ff8a7a'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx + 10, cy - 6); ctx.lineTo(cx + 18, cy + 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 18, cy - 6); ctx.lineTo(cx + 10, cy + 6); ctx.stroke();
  } else {
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(cx + 9, cy, 5, -Math.PI / 3, Math.PI / 3); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + 9, cy, 9, -Math.PI / 3, Math.PI / 3); ctx.stroke();
  }
  // v21 P2: progress bar hari (Saji x/12) di bawah header.
  const barW = 1280 * Math.min(1, s.served / RULES.servesToWin);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 64, 1280, 8);
  ctx.fillStyle = '#2a9a3a';
  ctx.fillRect(0, 64, barW, 8);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = 1; i < RULES.servesToWin; i++) {
    ctx.fillRect((1280 / RULES.servesToWin) * i - 1, 64, 2, 8);
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

// ---- Panel stasiun ----
function drawStation(ctx, s, L, name) {
  const box = L[name];
  const st = s.stations[name];
  ctx.fillStyle = '#fff8ea';
  rr(ctx, box.x, box.y, box.w, box.h, 12); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  const lv = s.upg ? s.upg[name] : 0;
  text(ctx, STATIONS[name].name + '  Lv' + lv, box.x + 16, box.y + 34, 'bold 20px sans-serif', '#5a3a1e');
  // Ikon stasiun.
  const ix = box.x + box.w / 2, iy = box.y + 108;
  if (name === 'talenan') {
    ctx.fillStyle = '#c98a3a';
    rr(ctx, ix - 70, iy - 30, 140, 60, 10); ctx.fill();
    ctx.strokeStyle = '#8a5a3b'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#e8b96a';
    ctx.beginPath(); ctx.arc(ix + 56, iy, 10, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#8a5a3b'; ctx.beginPath(); ctx.arc(ix + 56, iy, 4, 0, Math.PI * 2); ctx.stroke();
  } else {
    ctx.fillStyle = '#5a5a5a';
    rr(ctx, ix - 70, iy - 30, 140, 60, 10); ctx.fill();
    ctx.fillStyle = '#2b2b2b';
    ctx.beginPath(); ctx.arc(ix - 34, iy, 22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ix + 34, iy, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e2574c';
    ctx.beginPath(); ctx.arc(ix - 34, iy, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ix + 34, iy, 10, 0, Math.PI * 2); ctx.fill();
  }
  if (st) {
    const pct = Math.min(1, st.t / st.total);
    ctx.fillStyle = '#e3dcc8';
    rr(ctx, box.x + 20, box.y + box.h - 46, box.w - 40, 16, 8); ctx.fill();
    ctx.fillStyle = '#2a9a3a';
    rr(ctx, box.x + 20, box.y + box.h - 46, (box.w - 40) * pct, 16, 8); ctx.fill();
    const ing = INGREDIENTS[st.item];
    const label = ing ? ing.label : st.item;
    text(ctx, st.t >= st.total ? label + ' matang! Klik untuk ambil.' : 'Mengolah ' + label + '… ' + Math.ceil(st.total - st.t) + ' dtk', box.x + box.w / 2, box.y + box.h - 14, '15px sans-serif', '#5a3a1e', 'center');
  } else {
    text(ctx, 'Klik untuk olah bahan di tangan.', box.x + box.w / 2, box.y + box.h - 14, '15px sans-serif', '#8a7a5a', 'center');
  }
}

// ---- Panel piring ----
// v23 R1: tombol Buang (kosongkan piring) di bawah-tengah, tampil bila
// plate.length > 0; teks "Di tangan" DIHAPUS dari panel (sudah ada di
// header, v22 Q3).
function drawPlate(ctx, s, L) {
  const box = L.piring;
  ctx.fillStyle = '#fff8ea';
  rr(ctx, box.x, box.y, box.w, box.h, 12); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  // v18 C4 + v20: topi koki kecil di judul panel.
  ctx.save();
  ctx.translate(box.x + 34, box.y + 26);
  ctx.scale(0.5, 0.5);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-7, -8, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -10, 7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(7, -8, 6, 0, Math.PI * 2); ctx.fill();
  rr(ctx, -11, -11, 22, 7, 3); ctx.fill();
  ctx.restore();
  text(ctx, 'PIRING', box.x + 52, box.y + 34, 'bold 20px sans-serif', '#5a3a1e');
  // Piring putih besar.
  const pc = L.plateCenter;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(pc.x, pc.y, pc.r, pc.r * 0.45, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  // Bahan di piring.
  const n = s.plate.length;
  s.plate.forEach((id, i) => {
    const a = n === 1 ? -Math.PI / 2 : -Math.PI / 2 + (i / Math.max(1, n - 1) - 0.5) * Math.PI * 1.1;
    const rx = pc.x + Math.cos(a) * 38;
    const ry = pc.y + Math.sin(a) * 20 - 6;
    drawIngredientIcon(ctx, id, rx, ry, 16);
  });
  // v18 C4: kilau emas bila kombo >= 3.
  if (s.combo >= RULES.comboGlowAt) {
    const a = 0.4;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(pc.x, pc.y, pc.r + 6, pc.r * 0.45 + 6, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  // v20 S2: wajah pelanggan senang saat saji.
  if (s.servedFace) {
    drawCustomer(ctx, box.x + box.w - 30, box.y + 30, 20, s.servedFace.customer, 'senang');
  }
  // v19 S3/S6: partikel koin + sparkle Cling.
  for (const p of s.coinFx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.t / p.life);
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#e8a33a'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#e8a33a';
    text(ctx, 'Rp', p.x, p.y + 3, 'bold 7px sans-serif', '#e8a33a', 'center');
    ctx.restore();
  }
  for (const p of s.sparkles) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, p.t / p.life);
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(0, -p.r); ctx.quadraticCurveTo(2, -2, p.r, 0); ctx.quadraticCurveTo(2, 2, 0, p.r);
    ctx.quadraticCurveTo(-2, 2, -p.r, 0); ctx.quadraticCurveTo(-2, -2, 0, -p.r);
    ctx.fill();
    ctx.restore();
  }
  // Teks "+Rp X" melayang.
  if (s.floatText) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, s.floatText.t / 1.2);
    text(ctx, s.floatText.text, pc.x, pc.y - 56, 'bold 26px sans-serif', '#2a9a3a', 'center');
    ctx.restore();
  }
  // Teks "SEMPURNA!" (v14) — v21 P5: di bawah piring agar tidak
  // menumpuk label "PIRING".
  if (s.perfect) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, s.perfect.t / 1.5);
    text(ctx, s.perfect.text, pc.x, pc.y + 62, 'bold 30px sans-serif', '#ffd700', 'center');
    ctx.restore();
  }
  if (n === 0 && !s.floatText && !s.perfect) {
    text(ctx, 'Klik piring untuk taruh bahan.', box.x + box.w / 2, box.y + box.h - 14, '15px sans-serif', '#8a7a5a', 'center');
  }
  // v23 R1: tombol Buang (kosongkan piring) — tampil bila ada bahan.
  if (n > 0) {
    const b = L.tombolBuang;
    ctx.fillStyle = '#8a7a5a';
    rr(ctx, b.x, b.y, b.w, b.h, 8); ctx.fill();
    text(ctx, 'Buang', b.x + b.w / 2, b.y + 19, 'bold 15px sans-serif', '#fff', 'center');
  }
}

// Pesan (bar di bawah stasiun/piring).
function drawMessage(ctx, s, L) {
  const box = L.pesan;
  ctx.fillStyle = '#fff8ea';
  rr(ctx, box.x, box.y, box.w, box.h, 10); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  text(ctx, s.message, box.x + 16, box.y + 30, '18px sans-serif', '#5a3a1e');
  // v19 S3: rincian bayaran saji terakhir (di bawah pesan).
  if (s.breakdown) {
    text(ctx, s.breakdown, box.x + 16, box.y + 44, '13px sans-serif', '#8a7a5a');
  }
}

// Tombol SAJIKAN.
function drawServeButton(ctx, s, L) {
  const box = L.sajikan;
  const can = s.plate.length > 0;
  ctx.fillStyle = can ? '#2a9a3a' : '#9a9a9a';
  rr(ctx, box.x, box.y, box.w, box.h, 10); ctx.fill();
  text(ctx, 'SAJIKAN', box.x + box.w / 2, box.y + 32, 'bold 22px sans-serif', '#fff', 'center');
}

// Kartu counter (2 baris x 9). v15: grid pakai counterCardRect (shared).
function drawCounter(ctx, s, L) {
  const box = L.kartu;
  ctx.fillStyle = '#fff8ea';
  rr(ctx, box.x, box.y, box.w, box.h, 12); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  text(ctx, 'MEJA BAHAN — klik bahan (atau tekan tombol)', box.x + 16, box.y + 26, 'bold 16px sans-serif', '#5a3a1e');
  COUNTER.forEach((id, i) => {
    const r = counterCardRect(L, i);
    const ing = INGREDIENTS[id];
    const inHand = s.hand === id;
    const onPlate = s.plate.includes(id);
    ctx.fillStyle = inHand ? '#ffe9b0' : onPlate ? '#d8f0d8' : '#ffffff';
    rr(ctx, r.x, r.y, r.w, r.h, 8); ctx.fill();
    ctx.strokeStyle = inHand ? '#e8a33a' : '#d8cfb8'; ctx.lineWidth = inHand ? 2.5 : 1.5; ctx.stroke();
    drawIngredientIcon(ctx, id, r.x + r.w / 2, r.y + r.h / 2 - 12, 18);
    text(ctx, ing.label, r.x + r.w / 2, r.y + r.h - 26, '13px sans-serif', '#5a3a1e', 'center');
    // Stasiun kecil di bawah nama.
    const stLabel = ing.station === 'siap' ? 'SIAP' : STATIONS[ing.station].name;
    text(ctx, stLabel, r.x + r.w / 2, r.y + r.h - 10, '11px sans-serif', ing.station === 'siap' ? '#2a9a3a' : '#8a5a3b', 'center');
    // Label tombol keyboard.
    ctx.fillStyle = '#8a7a5a';
    ctx.beginPath(); ctx.arc(r.x + r.w - 12, r.y + 12, 9, 0, Math.PI * 2); ctx.fill();
    text(ctx, KEY_LABELS[i], r.x + r.w - 12, r.y + 16, 'bold 10px sans-serif', '#fff', 'center');
  });
}

// Footer: toko upgrade (v19 S1).
function drawFooter(ctx, s, L) {
  const box = L.footer;
  ctx.fillStyle = '#fff8ea';
  rr(ctx, box.x, box.y, box.w, box.h, 12); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  text(ctx, 'TOKO UPGRADE — percepat stasiun (pakai koin)', box.x + 16, box.y + 20, 'bold 15px sans-serif', '#5a3a1e');
  for (const name of ['talenan', 'kompor']) {
    const b = L.tombolUpgrade[name];
    const lv = s.upg[name];
    const maxed = lv >= UPGRADE_MAX;
    const cost = maxed ? 0 : UPGRADE_COSTS[name][lv];
    const afford = !maxed && s.coins >= cost;
    ctx.fillStyle = maxed ? '#9a9a9a' : afford ? '#2a9a3a' : '#c8b898';
    rr(ctx, b.x, b.y, b.w, b.h, 8); ctx.fill();
    const label = maxed
      ? STATIONS[name].name + ' Lv' + lv + ' (MAX)'
      : STATIONS[name].name + ' Lv' + lv + ' -> Lv' + (lv + 1) + ' (' + UPGRADE_TIMES[name][lv + 1] + ' dtk) — Rp ' + cost;
    text(ctx, label, b.x + b.w / 2, b.y + 26, 'bold 15px sans-serif', '#fff', 'center');
  }
  // Info kontrol.
  text(ctx, 'R: mulai ulang • P: jeda • M: suara • Klik tiket untuk sajikan pesanan itu', box.x + 620, box.y + 52, '14px sans-serif', '#8a7a5a');
}

// ---- Papan pesanan (tiket) ----
function drawTicket(ctx, s, order, t, i, L) {
  const box = L.tiket;
  const y = box.y + i * (box.h + box.gap);
  const frac = Math.max(0, order.patience / order.max);
  // Latar: VIP = emas (v17 S1), urgent = merah berdenyut (v17 S2),
  // fresh = kilau emas (v19 S6).
  if (order.vip) {
    ctx.fillStyle = '#fff6d6';
    rr(ctx, t.x, y, box.w, box.h, 10); ctx.fill();
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3; ctx.stroke();
  } else {
    ctx.fillStyle = '#fff8ea';
    rr(ctx, t.x, y, box.w, box.h, 10); ctx.fill();
    ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  }
  if (order.freshT > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.5, order.freshT);
    ctx.fillStyle = '#ffd700';
    rr(ctx, t.x, y, box.w, box.h, 10); ctx.fill();
    ctx.restore();
  }
  // v20 S2: wajah pelanggan di kiri atas tiket.
  const mood = frac > 0.5 ? 'senyum' : frac > 0.25 ? 'cemas' : 'marah';
  drawCustomer(ctx, t.x + 26, y + 30, 18, order.customer, mood);
  if (order.vip) {
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(t.x + 26, y + 30, 21, 0, Math.PI * 2); ctx.stroke();
    text(ctx, '★', t.x + 50, y + 20, 'bold 16px sans-serif', '#e8a33a');
  }
  // Nama hidangan di kanan wajah (v20 fix: dari t.x+12 -> t.x+52).
  const nameX = t.x + 52;
  const names = order.paket
    ? [DISHES[order.paket[0]].label, DISHES[order.paket[1]].label]
    : [DISHES[order.dish].label];
  const label = names.join(' + ');
  // Nama dua baris bila panjang.
  const maxW = box.w - 64;
  ctx.font = 'bold 16px sans-serif';
  if (ctx.measureText(label).width > maxW && names.length === 1) {
    const parts = label.split(' ');
    let line1 = parts[0], line2 = parts.slice(1).join(' ');
    if (label.startsWith('Spaghetti')) { line1 = 'Spaghetti'; line2 = 'Bolognese'; }
    if (label.startsWith('Mie Goreng')) { line1 = 'Mie Goreng'; line2 = 'Spesial'; }
    if (label.startsWith('Strawberry')) { line1 = 'Strawberry'; line2 = 'Squash'; }
    if (label.startsWith('Lemon Squash')) { line1 = 'Lemon Squash'; line2 = 'Mint'; }
    text(ctx, line1, nameX, y + 26, 'bold 16px sans-serif', '#5a3a1e');
    text(ctx, line2, nameX, y + 44, 'bold 16px sans-serif', '#5a3a1e');
  } else if (names.length === 2) {
    text(ctx, 'PAKET', nameX, y + 24, 'bold 15px sans-serif', '#8a3ae8');
    text(ctx, names[0], nameX, y + 42, 'bold 15px sans-serif', '#5a3a1e');
    text(ctx, names[1], nameX, y + 60, 'bold 15px sans-serif', '#5a3a1e');
  } else {
    text(ctx, label, nameX, y + 30, 'bold 16px sans-serif', '#5a3a1e');
  }
  // Preview hidangan jadi (v17 S4): di kiri baris tengah, skala 0.38.
  const previewY = y + 88;
  if (order.paket) {
    drawDish(ctx, order.paket[0], t.x + 46, previewY + 30, 0.38, s.time);
    drawDish(ctx, order.paket[1], t.x + 130, previewY + 30, 0.38, s.time);
  } else {
    drawDish(ctx, order.dish, t.x + 52, previewY + 34, 0.38, s.time);
  }
  // Ikon bahan (digeser ke kanan karena preview, v17 S4).
  const req = requiredIngredients(order);
  const iconW = 52;
  const startX = t.x + 108;
  req.forEach((id, j) => {
    const ix = startX + j * iconW + iconW / 2 - 26;
    const iy = previewY + 30;
    drawIngredientIcon(ctx, id, ix, iy, 20);
    if (s.plate.includes(id)) {
      ctx.strokeStyle = '#2a9a3a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(ix - 8, iy); ctx.lineTo(ix - 2, iy + 7); ctx.lineTo(ix + 9, iy - 7); ctx.stroke();
    }
  });
  // Bar kesabaran.
  const barY = y + box.h - 46;
  ctx.fillStyle = '#e3dcc8';
  rr(ctx, t.x + 12, barY, box.w - 24, 12, 6); ctx.fill();
  const barColor = frac > 0.5 ? '#2a9a3a' : frac > 0.25 ? '#e8a33a' : '#e2574c';
  ctx.fillStyle = barColor;
  rr(ctx, t.x + 12, barY, (box.w - 24) * frac, 12, 6); ctx.fill();
  // v17 S2: urgensi — denyut merah + teks kesabaran merah tebal bila <10 dtk.
  // v21 P5: teks "Kesabaran" geser ke kanan bila ada pil PAKET.
  const urgent = order.patience < RULES.urgentSeconds;
  const kesX = order.paket ? t.x + 90 : t.x + 12;
  if (urgent) {
    const a = 0.5 + 0.5 * Math.sin(s.time * 6);
    ctx.save();
    ctx.globalAlpha = a * 0.4;
    ctx.strokeStyle = '#e2574c'; ctx.lineWidth = 4;
    rr(ctx, t.x, y, box.w, box.h, 10); ctx.stroke();
    ctx.restore();
    text(ctx, 'Kesabaran: ' + Math.ceil(order.patience) + ' dtk', kesX, barY + 30, 'bold 15px sans-serif', '#e2574c');
  } else {
    text(ctx, 'Kesabaran: ' + Math.ceil(order.patience) + ' dtk', kesX, barY + 30, '15px sans-serif', '#8a7a5a');
  }
  // v21 P5: harga di pojok kanan ATAS (agar tidak tertutup pil SPESIAL).
  const price = orderPrice(order);
  text(ctx, 'Rp ' + price, t.x + box.w - 12, y + 30, 'bold 17px sans-serif', '#2a9a3a', 'right');
  if (order.special) {
    ctx.fillStyle = '#ffd700';
    rr(ctx, t.x + box.w - 92, y + box.h - 22, 80, 20, 10); ctx.fill();
    text(ctx, 'SPESIAL', t.x + box.w - 52, y + box.h - 8, 'bold 12px sans-serif', '#5a3a1e', 'center');
  }
  if (order.paket) {
    ctx.fillStyle = '#8a3ae8';
    rr(ctx, t.x + 12, y + box.h - 22, 70, 20, 10); ctx.fill();
    text(ctx, 'PAKET', t.x + 47, y + box.h - 8, 'bold 12px sans-serif', '#fff', 'center');
  }
}

// v23 R2: border oranye berdenyut di sekeliling papan saat RUSH aktif.
function drawBoard(ctx, s, L) {
  const box = L.papan;
  ctx.fillStyle = '#fff8ea';
  rr(ctx, box.x, box.y, box.w, box.h, 12); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  text(ctx, 'PAPAN PESANAN', box.x + 16, box.y + 28, 'bold 18px sans-serif', '#5a3a1e');
  if (s.orders.length === 0) {
    text(ctx, 'Belum ada pesanan.', box.x + 16, box.y + 70, '16px sans-serif', '#8a7a5a');
  }
  s.orders.forEach((order, i) => drawTicket(ctx, s, order, L.tiket, i, L));
  // v22 Q3: placeholder slot kosong ("Menunggu pesanan…").
  for (let i = s.orders.length; i < RULES.ordersMax; i++) {
    const y = L.tiket.y + i * (L.tiket.h + L.tiket.gap);
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = 'rgba(138,122,90,0.5)';
    ctx.lineWidth = 2;
    rr(ctx, L.tiket.x, y, L.tiket.w, L.tiket.h, 10); ctx.stroke();
    ctx.restore();
    text(ctx, 'Menunggu pesanan…', L.tiket.x + L.tiket.w / 2, y + L.tiket.h / 2 + 6, '15px sans-serif', '#a89a7a', 'center');
  }
  // v23 R2: border RUSH di papan.
  if (s.rushActive) {
    const a = 0.4 + 0.3 * Math.sin(s.time * 6);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.strokeStyle = '#ff8a2a'; ctx.lineWidth = 4;
    rr(ctx, box.x, box.y, box.w, box.h, 12); ctx.stroke();
    ctx.restore();
  }
}

// ---- Layar judul ----
// v23 R3: tagline + garis emas di celah antara kartu menu dan tombol.
function drawTitle(ctx, s, L) {
  drawBackground(ctx, s);
  // v21 P3: lampu gantung di kanan atas (kabel + kap + bola + cahaya).
  const lampX = 1150;
  ctx.fillStyle = 'rgba(255,217,77,0.12)';
  ctx.beginPath(); ctx.arc(lampX, 130, 60, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(lampX, 0); ctx.lineTo(lampX, 75); ctx.stroke();
  ctx.fillStyle = '#e2574c';
  ctx.beginPath();
  ctx.moveTo(lampX - 28, 105); ctx.lineTo(lampX + 28, 105);
  ctx.lineTo(lampX + 16, 75); ctx.lineTo(lampX - 16, 75);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath(); ctx.arc(lampX, 112, 8, 0, Math.PI * 2); ctx.fill();
  // Banner krem di belakang judul.
  ctx.fillStyle = '#fff8ea';
  rr(ctx, 340, 78, 600, 100, 16); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  text(ctx, 'DAPUR KILAT', 640, 142, 'bold 56px sans-serif', '#e2574c', 'center');
  text(ctx, 'Sajikan 12 pesanan sebelum shift berakhir!', 640, 172, '20px sans-serif', '#5a3a1e', 'center');
  // Heading menu + garis emas.
  text(ctx, 'MENU HARI INI', 640, 268, 'bold 22px sans-serif', '#5a3a1e', 'center');
  ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(540, 278); ctx.lineTo(740, 278); ctx.stroke();
  // Kartu menu (v20 S4): 7 kartu 160x150, nama 1-2 baris + harga.
  const km = L.kartuMenu;
  const keys = Object.keys(DISHES);
  keys.forEach((id, i) => {
    const x = km.x + i * (km.w + km.gap);
    const y = km.y;
    ctx.fillStyle = '#fff8ea';
    rr(ctx, x, y, km.w, km.h, 12); ctx.fill();
    ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
    drawDish(ctx, id, x + km.w / 2, y + 48, 0.42, s.time);
    const d = DISHES[id];
    // Label 2 baris bila perlu.
    let line1 = d.label, line2 = null;
    if (id === 'spaghetti') { line1 = 'Spaghetti'; line2 = 'Bolognese'; }
    if (id === 'miegoreng') { line1 = 'Mie Goreng'; line2 = 'Spesial'; }
    if (id === 'strawsquash') { line1 = 'Strawberry'; line2 = 'Squash'; }
    if (id === 'lemonsquash') { line1 = 'Lemon Squash'; line2 = 'Mint'; }
    if (line2) {
      text(ctx, line1, x + km.w / 2, y + 108, 'bold 14px sans-serif', '#5a3a1e', 'center');
      text(ctx, line2, x + km.w / 2, y + 126, 'bold 14px sans-serif', '#5a3a1e', 'center');
      text(ctx, 'Rp ' + d.base, x + km.w / 2, y + 144, '13px sans-serif', '#b8860b', 'center');
    } else {
      text(ctx, line1, x + km.w / 2, y + 112, 'bold 14px sans-serif', '#5a3a1e', 'center');
      text(ctx, 'Rp ' + d.base, x + km.w / 2, y + 136, '13px sans-serif', '#b8860b', 'center');
    }
  });
  // v23 R3: tagline + garis emas di celah (kartu berakhir 435, tombol 520).
  text(ctx, 'Masak cepat, sajikan tepat — pelanggan senang, koin mengalir!', 640, 470, 'italic 17px sans-serif', '#8a7a5a', 'center');
  ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(560, 488); ctx.lineTo(720, 488); ctx.stroke();
  // v21 P3: tumpukan piring + tanaman di kanan bawah (seimbang dengan koki).
  const px = 1140, py = 640;
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(px, py - i * 8, 42, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 1.5; ctx.stroke();
  }
  const tx = 1220, ty = 640;
  ctx.fillStyle = '#c98a3a';
  ctx.beginPath();
  ctx.moveTo(tx - 14, ty - 12); ctx.lineTo(tx + 14, ty - 12);
  ctx.lineTo(tx + 10, ty + 6); ctx.lineTo(tx - 10, ty + 6);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3e9b4f';
  ctx.beginPath(); ctx.ellipse(tx - 6, ty - 22, 6, 12, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(tx + 6, ty - 22, 6, 12, 0.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(tx, ty - 28, 6, 12, 0, 0, Math.PI * 2); ctx.fill();
  // Koki melambai di kiri bawah.
  drawChef(ctx, 150, 495, 1.3, 'senyum');
  // Tombol MULAI berdenyut emas (v20 S4).
  const btn = L.tombolJudul;
  const a = 0.15 + 0.1 * Math.sin(s.time * 3);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 6;
  rr(ctx, btn.x - 4, btn.y - 4, btn.w + 8, btn.h + 8, 14); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#e2574c';
  rr(ctx, btn.x, btn.y, btn.w, btn.h, 12); ctx.fill();
  text(ctx, 'MULAI MEMASAK', btn.x + btn.w / 2, btn.y + 42, 'bold 28px sans-serif', '#fff', 'center');
  // Instruksi.
  text(ctx, 'Klik bahan di meja, olah di TALENAN / KOMPOR, taruh di PIRING, lalu SAJIKAN.', 640, 620, '17px sans-serif', '#5a3a1e', 'center');
  text(ctx, 'R: mulai ulang • P: jeda • M: suara • 3 pesanan hangus = shift berakhir.', 640, 650, '15px sans-serif', '#8a7a5a', 'center');
  // v22 Q4: baris pil keycap [R] [P] [M] di bawah instruksi (y=680).
  const pills = [
    { key: 'R', label: 'Mulai ulang', w: 132 },
    { key: 'P', label: 'Jeda', w: 92 },
    { key: 'M', label: 'Suara', w: 104 },
  ];
  const gap = 12;
  const totalW = pills.reduce((acc, p) => acc + p.w, 0) + gap * (pills.length - 1);
  let px0 = 640 - totalW / 2;
  for (const p of pills) {
    ctx.fillStyle = '#fff8ea';
    rr(ctx, px0, 664, p.w, 32, 8); ctx.fill();
    ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 1.5; ctx.stroke();
    // Kotak huruf.
    ctx.fillStyle = '#5a3a1e';
    rr(ctx, px0 + 8, 670, 20, 20, 4); ctx.fill();
    text(ctx, p.key, px0 + 18, 685, 'bold 13px sans-serif', '#fff', 'center');
    text(ctx, p.label, px0 + 34, 685, '14px sans-serif', '#5a3a1e');
    px0 += p.w + gap;
  }
}

// ---- Konfeti menang (v23 R2) ----
// Deterministik dari indeks (tanpa state acak): tiap potong punya x0,
// warna, ukuran, kecepatan jatuh & fase tetap; posisi y dari s.endT.
const CONFETTI_COLORS = ['#e2574c', '#ffd700', '#2a9a3a', '#3e9b4f', '#e83e6b', '#5a3ae8'];
function drawConfetti(ctx, s) {
  const n = RULES.confettiCount;
  for (let i = 0; i < n; i++) {
    const x0 = (i * 97) % 1280;
    const size = 6 + ((i * 13) % 8);
    const speed = 60 + ((i * 29) % 80);
    const phase = (i * 0.7) % 1;
    const y = ((s.endT * speed + phase * 720) % 760) - 20;
    const x = x0 + Math.sin(s.endT * 1.5 + phase * Math.PI * 2) * 20;
    const rot = s.endT * (1 + (i % 3)) + phase;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    ctx.fillRect(-size / 2, -size / 4, size, size / 2);
    ctx.restore();
  }
}

// ---- Layar akhir ----
// v22 Q2: kartu 600x460 + baris wajah pelanggan yang disajikan.
// v21 P1: grid statistik 2 kolom x 3 baris.
// v23 R2: konfeti jatuh saat menang (di depan kartu).
function drawEnd(ctx, s, L) {
  drawBackground(ctx, s);
  const win = s.screen === 'win';
  const card = L.kartuAkhir;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, 1280, 720);
  ctx.fillStyle = '#fff8ea';
  rr(ctx, card.x, card.y, card.w, card.h, 16); ctx.fill();
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 2; ctx.stroke();
  // Koki sesuai mood.
  drawChef(ctx, card.x + card.w / 2, card.y + 58, 1.05, win ? 'rayakan' : 'sedih');
  text(ctx, win ? 'HARI SELESAI!' : 'SHIFT BERAKHIR', card.x + card.w / 2, card.y + 142, 'bold 36px sans-serif', win ? '#2a9a3a' : '#e2574c', 'center');
  text(ctx, win ? 'Kamu menyajikan 12 pesanan. Kerja bagus, koki!' : 'Tiga pesanan hangus. Coba lagi, koki!', card.x + card.w / 2, card.y + 175, '18px sans-serif', '#5a3a1e', 'center');
  text(ctx, 'Total koin: Rp ' + s.coins, card.x + card.w / 2, card.y + 208, 'bold 26px sans-serif', '#5a3a1e', 'center');
  // Garis pemisah.
  ctx.strokeStyle = '#d8cfb8'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(card.x + 60, card.y + 226); ctx.lineTo(card.x + card.w - 60, card.y + 226); ctx.stroke();
  // Grid statistik.
  const st = s.stats || { perfect: 0, vip: 0, paket: 0, bestCombo: 0, rushServes: 0 };
  const statsLeft = [
    'SEMPURNA!: ' + st.perfect,
    'VIP disajikan: ' + st.vip,
    'Paket disajikan: ' + st.paket,
  ];
  const statsRight = [
    'Kombo terbaik: x' + st.bestCombo,
    'Level akhir: Lv ' + (s.level || 1),
    'Waktu: ' + Math.floor(s.time) + ' dtk',
  ];
  const rowsY = [card.y + 252, card.y + 280, card.y + 308];
  for (let i = 0; i < 3; i++) {
    text(ctx, statsLeft[i], card.x + 80, rowsY[i], '17px sans-serif', '#5a3a1e');
    text(ctx, statsRight[i], card.x + 340, rowsY[i], '17px sans-serif', '#5a3a1e');
  }
  // v22 Q2: baris wajah pelanggan yang disajikan.
  const faces = s.servedCustomers || [];
  if (faces.length > 0) {
    text(ctx, 'Pelanggan yang dilayani:', card.x + card.w / 2, card.y + 332, '14px sans-serif', '#8a7a5a', 'center');
    const r = 14, gap = 42;
    const totalW = faces.length * gap - (gap - r * 2);
    let fx = card.x + card.w / 2 - totalW / 2 + r;
    for (const c of faces) {
      drawCustomer(ctx, fx, card.y + 356, r, c, 'senang');
      fx += gap;
    }
  }
  ctx.fillStyle = '#e2574c';
  rr(ctx, card.x + 150, card.y + 380, 300, 48, 12); ctx.fill();
  text(ctx, 'MAIN LAGI (R)', card.x + card.w / 2, card.y + 412, 'bold 22px sans-serif', '#fff', 'center');
  // v23 R2: konfeti jatuh saat menang (di depan kartu).
  if (win) drawConfetti(ctx, s);
}

export function render(ctx, s, L = LAYOUT) {
  if (s.screen === 'title') {
    drawTitle(ctx, s, L);
    return;
  }
  if (s.screen === 'win' || s.screen === 'over') {
    drawEnd(ctx, s, L);
    return;
  }
  drawBackground(ctx, s);
  drawHeader(ctx, s, L);
  drawStation(ctx, s, L, 'talenan');
  drawStation(ctx, s, L, 'kompor');
  drawPlate(ctx, s, L);
  drawMessage(ctx, s, L);
  drawServeButton(ctx, s, L);
  drawCounter(ctx, s, L);
  drawFooter(ctx, s, L);
  drawBoard(ctx, s, L);
}
