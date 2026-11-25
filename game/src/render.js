// Dapur Kilat v14 — semua gambar digambar dengan kode canvas.
// v14: bonus "SEMPURNA!" + uap BERGERAK; udang + daging DIREVISI TOTAL
// (referensi baru Fiqih); warna FRESH & menarik (lebih cerah, mengilap).
// v13 dipertahankan: spaghetti mentah rapat, nasgor nasi terlihat,
// spaghetti jadi ditumpuk tanpa rongga, play shot 3 bahan, "Di tangan" di header.

import { COUNTER, DISHES, INGREDIENTS, LAYOUT, RULES } from './config.js';

// ---------- util kanvas ----------
function shadow(ctx, color, blur, ox, oy) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = ox;
  ctx.shadowOffsetY = oy;
}
function noShadow(ctx) {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}
function ellipse(ctx, x, y, rx, ry, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
}
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Uap bergerak (v14): 2 lengkung uap yang naik-turun halus mengikuti waktu.
// yOff = sin(time * 2.5) * 3 — game terasa hidup; screenshot tetap
// deterministik (virtual-time-budget → s.time tetap).
function drawSteam(ctx, cx, cy, s, time) {
  const yOff = Math.sin(time * 2.5) * 3 * s;
  ctx.strokeStyle = 'rgba(180,170,150,0.7)';
  ctx.lineWidth = 1.6 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 8 * s, cy - 30 * s + yOff);
  ctx.quadraticCurveTo(cx - 11 * s, cy - 36 * s + yOff, cx - 8 * s, cy - 42 * s + yOff);
  ctx.moveTo(cx + 6 * s, cy - 30 * s - yOff);
  ctx.quadraticCurveTo(cx + 9 * s, cy - 36 * s - yOff, cx + 6 * s, cy - 42 * s - yOff);
  ctx.stroke();
}

// ---------- gambar bahan (ikon kecil) ----------
function drawNasi(ctx, cx, cy, s) {
  // Mangkuk nasi putih: mangkuk biru + gundukan nasi putih berbutir.
  shadow(ctx, 'rgba(0,0,0,0.2)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#4a7fb5';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 8 * s, 26 * s, 12 * s, 0, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#f7f3e8';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2 * s, 24 * s, 12 * s, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  // Butir nasi (oval kecil, putih pucat) — tekstur lebih jelas.
  ctx.fillStyle = '#fffdf6';
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const bx = cx + Math.cos(a) * 12 * s;
    const by = cy - 2 * s + Math.sin(a) * 5 * s;
    ctx.beginPath();
    ctx.ellipse(bx, by, 4 * s, 2 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#e8dcc8';
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.5;
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * 7 * s, cy - 4 * s + Math.sin(a) * 3 * s, 3 * s, 1.5 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#3e9b4f';
  ctx.fillRect(cx - 4 * s, cy - 8 * s, 5 * s, 2 * s);
}

function drawTelur(ctx, cx, cy, s) {
  // Telur ceplok: putih organik + kuning mengilap (fresh, kuning cerah).
  shadow(ctx, 'rgba(0,0,0,0.18)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#fffdf6';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2 * s, 24 * s, 18 * s, 0.2, 0, Math.PI * 2);
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath();
  ctx.ellipse(cx - 6 * s, cy + 6 * s, 12 * s, 8 * s, -0.3, 0, Math.PI * 2);
  ctx.fill();
  const g = ctx.createRadialGradient(cx - 2 * s, cy - 2 * s, 2 * s, cx, cy, 12 * s);
  g.addColorStop(0, '#ffe066');
  g.addColorStop(0.7, '#f5a623');
  g.addColorStop(1, '#e8890c');
  ctx.fillStyle = g;
  circle(ctx, cx, cy, 11 * s);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  circle(ctx, cx - 3.5 * s, cy - 3.5 * s, 3 * s);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  circle(ctx, cx + 4 * s, cy + 3 * s, 2 * s);
  ctx.fill();
}

function drawKecap(ctx, cx, cy, s) {
  // Botol kecap: botol gelap berleher sempit, tutup merah, label krem.
  shadow(ctx, 'rgba(0,0,0,0.22)', 4 * s, 0, 2 * s);
  const g = ctx.createLinearGradient(cx - 12 * s, 0, cx + 12 * s, 0);
  g.addColorStop(0, '#3a1c0d');
  g.addColorStop(0.5, '#5a2c12');
  g.addColorStop(1, '#2a1408');
  ctx.fillStyle = g;
  rr(ctx, cx - 11 * s, cy - 6 * s, 22 * s, 30 * s, 7 * s);
  ctx.fill();
  ctx.fillStyle = '#5a2c12';
  rr(ctx, cx - 6 * s, cy - 20 * s, 12 * s, 16 * s, 3 * s);
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#d94f3d';
  rr(ctx, cx - 7 * s, cy - 26 * s, 14 * s, 8 * s, 3 * s);
  ctx.fill();
  ctx.fillStyle = '#f7ead0';
  rr(ctx, cx - 11 * s, cy + 2 * s, 22 * s, 14 * s, 3 * s);
  ctx.fill();
  ctx.fillStyle = '#d94f3d';
  ctx.fillRect(cx - 11 * s, cy + 7 * s, 22 * s, 3 * s);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(cx - 8 * s, cy - 4 * s, 3 * s, 26 * s);
}

// Udang (v14): DIREVISI TOTAL — referensi baru Fiqih (udang matang di piring).
// Montok, pink-oranye PUCAT + krem, SANGAT mengilap, segmen jelas,
// ujung "kepala" BULAT GEMUK (krem), ekor mengecil membulat.
function drawUdang(ctx, cx, cy, s) {
  shadow(ctx, 'rgba(0,0,0,0.2)', 4 * s, 0, 2 * s);
  ctx.lineCap = 'round';
  // Tubuh luar: busur C SANGAT TEBAL (garis 17) — gemuk, berisi.
  // Gradien pink-oranye pucat (seperti referensi: krem → pink muda).
  const g = ctx.createLinearGradient(cx - 20 * s, cy - 14 * s, cx + 20 * s, cy + 16 * s);
  g.addColorStop(0, '#f7c4a8');
  g.addColorStop(0.5, '#f2a184');
  g.addColorStop(1, '#e87a5a');
  ctx.strokeStyle = g;
  ctx.lineWidth = 17 * s;
  ctx.beginPath();
  ctx.arc(cx, cy + 2 * s, 14 * s, Math.PI * 0.15, Math.PI * 1.75);
  ctx.stroke();
  noShadow(ctx);
  // Perut dalam: krem terang (lebar 10) — tubuh terlihat berisi & segar.
  ctx.strokeStyle = '#fbe0c8';
  ctx.lineWidth = 10 * s;
  ctx.beginPath();
  ctx.arc(cx, cy + 2 * s, 14 * s, Math.PI * 0.25, Math.PI * 1.65);
  ctx.stroke();
  // Garis segmen oranye tipis (5 garis, jelas seperti referensi).
  ctx.strokeStyle = '#d96a4a';
  ctx.lineWidth = 1.8 * s;
  for (const a of [0.45, 0.8, 1.15, 1.5, 1.85]) {
    const x1 = cx + Math.cos(a) * 7 * s;
    const y1 = cy + 2 * s + Math.sin(a) * 7 * s;
    const x2 = cx + Math.cos(a) * 23 * s;
    const y2 = cy + 2 * s + Math.sin(a) * 23 * s;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  // Ujung "kepala" BULAT GEMUK (krem, r=9) — seperti referensi.
  const hx = cx + Math.cos(Math.PI * 1.75) * 14 * s;
  const hy = cy + 2 * s + Math.sin(Math.PI * 1.75) * 14 * s;
  const hg = ctx.createRadialGradient(hx - 3 * s, hy - 3 * s, 2 * s, hx, hy, 10 * s);
  hg.addColorStop(0, '#fff6e8');
  hg.addColorStop(0.6, '#fbe0c8');
  hg.addColorStop(1, '#f2a184');
  ctx.fillStyle = hg;
  circle(ctx, hx, hy, 9 * s);
  ctx.fill();
  // Ekor kecil mengecil membulat (ujung kanan atas busur).
  const tx = cx + Math.cos(Math.PI * 0.15) * 14 * s;
  const ty = cy + 2 * s + Math.sin(Math.PI * 0.15) * 14 * s;
  ctx.fillStyle = '#e87a5a';
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(tx + 13 * s, ty - 6 * s);
  ctx.lineTo(tx + 11 * s, ty + 2 * s);
  ctx.lineTo(tx + 14 * s, ty + 8 * s);
  ctx.closePath();
  ctx.fill();
  // Kilau SANGAT kuat (seperti referensi — udang mengilap segar).
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.arc(cx, cy + 2 * s, 14 * s, Math.PI * 1.05, Math.PI * 1.5);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  circle(ctx, cx - 10 * s, cy - 8 * s, 2.5 * s);
  ctx.fill();
  circle(ctx, cx + 2 * s, cy - 12 * s, 2 * s);
  ctx.fill();
}

// Spaghetti mentah (v13, dipertahankan v14): ikatan RAPAT — stik BERDEMPETAN.
// Referensi: ikatan pasta kering — stik rapat, ujung sedikit mengembang
// seperti kipas, diikat pita merah di tengah.
function drawSpaghettiRaw(ctx, cx, cy, s) {
  shadow(ctx, 'rgba(0,0,0,0.18)', 3 * s, 0, 2 * s);
  ctx.lineCap = 'round';
  // 9 stik RAPAT (jarak 3,2 — berdempetan), ujung mengembang seperti kipas.
  for (let i = -4; i <= 4; i++) {
    ctx.strokeStyle = i % 2 === 0 ? '#f2d98a' : '#e8c96a';
    ctx.lineWidth = 3.2 * s;
    const topX = cx + i * 3.2 * s;
    const botX = cx + i * 4.2 * s;
    ctx.beginPath();
    ctx.moveTo(topX, cy - 24 * s);
    ctx.lineTo(botX, cy + 22 * s);
    ctx.stroke();
  }
  noShadow(ctx);
  // Pita pengikat merah (lebih lebar, jelas mengikat).
  ctx.fillStyle = '#d94f3d';
  ctx.fillRect(cx - 15 * s, cy - 5 * s, 30 * s, 7 * s);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(cx - 11 * s, cy - 5 * s, 3 * s, 7 * s);
  // Kilau di stik tengah.
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 1 * s, cy - 22 * s);
  ctx.lineTo(cx - 1 * s, cy + 20 * s);
  ctx.stroke();
}

// Daging mentah (v14): DIREVISI TOTAL — referensi baru Fiqih (steak tebal).
// BALOK persegi panjang membulat + sisi 3D TEBAL, marmer putih TEBAL,
// tepi lemak putih, merah KAYA, mengilap segar. BUKAN lagi elips datar.
function drawDaging(ctx, cx, cy, s) {
  shadow(ctx, 'rgba(0,0,0,0.22)', 4 * s, 0, 2 * s);
  // Sisi 3D TEBAL (bawah, merah gelap) — steak terlihat tebal.
  ctx.fillStyle = '#7a1f14';
  rr(ctx, cx - 25 * s, cy - 6 * s, 50 * s, 26 * s, 9 * s);
  ctx.fill();
  noShadow(ctx);
  // Permukaan atas: balok membulat, merah KAYA (gradien).
  const g = ctx.createRadialGradient(cx - 8 * s, cy - 8 * s, 4 * s, cx, cy - 2 * s, 30 * s);
  g.addColorStop(0, '#e84a3a');
  g.addColorStop(0.6, '#c0392b');
  g.addColorStop(1, '#96281b');
  ctx.fillStyle = g;
  rr(ctx, cx - 26 * s, cy - 16 * s, 52 * s, 26 * s, 10 * s);
  ctx.fill();
  // Tepi lemak putih di sisi kanan (seperti referensi — lemak menumpuk).
  ctx.fillStyle = 'rgba(255,240,230,0.92)';
  ctx.beginPath();
  ctx.moveTo(cx + 14 * s, cy - 16 * s);
  ctx.quadraticCurveTo(cx + 26 * s, cy - 12 * s, cx + 26 * s, cy - 2 * s);
  ctx.quadraticCurveTo(cx + 26 * s, cy + 6 * s, cx + 18 * s, cy + 8 * s);
  ctx.quadraticCurveTo(cx + 24 * s, cy - 2 * s, cx + 14 * s, cy - 16 * s);
  ctx.closePath();
  ctx.fill();
  // Marmer: urat putih TEBAL bercabang (seperti referensi).
  ctx.strokeStyle = 'rgba(255,240,230,0.95)';
  ctx.lineCap = 'round';
  ctx.lineWidth = 3.6 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 20 * s, cy - 8 * s);
  ctx.quadraticCurveTo(cx - 4 * s, cy - 12 * s, cx + 10 * s, cy - 8 * s);
  ctx.quadraticCurveTo(cx + 18 * s, cy - 6 * s, cx + 20 * s, cy - 2 * s);
  ctx.stroke();
  // Tambalan lemak putih BESAR (2 patch, seperti referensi).
  ctx.fillStyle = 'rgba(255,240,230,0.92)';
  ctx.beginPath();
  ctx.ellipse(cx - 8 * s, cy - 10 * s, 8 * s, 4.5 * s, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 4 * s, cy + 2 * s, 6 * s, 3.5 * s, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Cabang-cabang marmer.
  ctx.lineWidth = 2.2 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 8 * s, cy - 11 * s);
  ctx.quadraticCurveTo(cx - 12 * s, cy - 4 * s, cx - 16 * s, cy + 2 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 2 * s, cy - 8 * s);
  ctx.quadraticCurveTo(cx, cy - 1 * s, cx + 6 * s, cy + 5 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 12 * s, cy - 7 * s);
  ctx.quadraticCurveTo(cx + 16 * s, cy - 1 * s, cx + 14 * s, cy + 4 * s);
  ctx.stroke();
  // Bercak lemak kecil (marbling).
  ctx.fillStyle = 'rgba(255,240,230,0.9)';
  for (const [dx, dy, r] of [[-18, 0, 2.2], [-2, 4, 1.8], [16, -4, 2], [-14, -12, 1.6]]) {
    circle(ctx, cx + dx * s, cy + dy * s, r * s);
    ctx.fill();
  }
  // Kilau basah kuat (daging segar mengilap).
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.ellipse(cx - 12 * s, cy - 11 * s, 10 * s, 3.5 * s, -0.25, 0, Math.PI * 2);
  ctx.fill();
}

function drawSaus(ctx, cx, cy, s) {
  // Mangkuk saus tomat: mangkuk putih + saus merah mengilap (fresh, merah hidup).
  shadow(ctx, 'rgba(0,0,0,0.2)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#f7f3e8';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 8 * s, 26 * s, 12 * s, 0, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#d43a1e';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2 * s, 24 * s, 11 * s, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.ellipse(cx - 8 * s, cy - 2 * s, 8 * s, 3 * s, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a2a12';
  circle(ctx, cx + 6 * s, cy, 2.5 * s);
  ctx.fill();
  ctx.fillStyle = '#5a1a08';
  for (const [dx, dy] of [[-4, 2], [10, -3]]) {
    circle(ctx, cx + dx * s, cy + dy * s, 1.5 * s);
    ctx.fill();
  }
}

function drawKeju(ctx, cx, cy, s) {
  // Keju: balok kuning cerah dengan lubang + serpihan.
  shadow(ctx, 'rgba(0,0,0,0.18)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#f7c948';
  rr(ctx, cx - 22 * s, cy - 10 * s, 44 * s, 22 * s, 5 * s);
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#e8a83e';
  rr(ctx, cx - 22 * s, cy + 2 * s, 44 * s, 10 * s, 5 * s);
  ctx.fill();
  ctx.fillStyle = '#c98a2a';
  for (const [dx, dy, r] of [[-10, -4, 3], [4, -6, 2.5], [12, 2, 3.5], [-2, 6, 2]]) {
    circle(ctx, cx + dx * s, cy + dy * s, r * s);
    ctx.fill();
  }
  ctx.fillStyle = '#fff6e0';
  ctx.save();
  ctx.translate(cx + 16 * s, cy - 16 * s);
  ctx.rotate(0.4);
  ctx.fillRect(-5 * s, -1.5 * s, 10 * s, 3 * s);
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillRect(cx - 18 * s, cy - 8 * s, 30 * s, 2 * s);
}

function drawRoti(ctx, cx, cy, s) {
  // Roti burger: bun atas mengilap + wijen + bun bawah.
  shadow(ctx, 'rgba(0,0,0,0.2)', 4 * s, 0, 2 * s);
  const g = ctx.createLinearGradient(cx, cy - 20 * s, cx, cy + 16 * s);
  g.addColorStop(0, '#f2c078');
  g.addColorStop(1, '#d89a4e');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 2 * s, 26 * s, 18 * s, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#fff6e0';
  for (const [dx, dy] of [[-12, -10], [-2, -14], [10, -10], [4, -6], [-6, -6]]) {
    ctx.beginPath();
    ctx.ellipse(cx + dx * s, cy + dy * s, 2.5 * s, 1.5 * s, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#e8b96a';
  rr(ctx, cx - 24 * s, cy + 2 * s, 48 * s, 10 * s, 4 * s);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(cx - 8 * s, cy - 12 * s, 10 * s, 3 * s, -0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawPatty(ctx, cx, cy, s) {
  // Patty: daging panggang cokelat dengan garis grill.
  shadow(ctx, 'rgba(0,0,0,0.22)', 4 * s, 0, 2 * s);
  const g = ctx.createLinearGradient(cx, cy - 10 * s, cx, cy + 10 * s);
  g.addColorStop(0, '#8a5a3b');
  g.addColorStop(1, '#6a3a22');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 26 * s, 13 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  noShadow(ctx);
  ctx.strokeStyle = '#4a2410';
  ctx.lineWidth = 2 * s;
  for (const dx of [-14, -5, 4, 13]) {
    ctx.beginPath();
    ctx.moveTo(cx + dx * s, cy - 8 * s);
    ctx.lineTo(cx + (dx - 3) * s, cy + 8 * s);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,200,120,0.35)';
  ctx.beginPath();
  ctx.ellipse(cx - 8 * s, cy - 5 * s, 10 * s, 3 * s, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4a2410';
  for (const [dx, dy] of [[-18, 2], [8, -6], [16, 4]]) {
    circle(ctx, cx + dx * s, cy + dy * s, 1.5 * s);
    ctx.fill();
  }
}

function drawSelada(ctx, cx, cy, s) {
  // Selada: daun hijau SEGAR (hijau cerah, v14 fresh).
  ctx.fillStyle = '#45b058';
  ctx.beginPath();
  ctx.moveTo(cx - 24 * s, cy);
  ctx.quadraticCurveTo(cx - 18 * s, cy - 14 * s, cx - 8 * s, cy - 6 * s);
  ctx.quadraticCurveTo(cx, cy - 14 * s, cx + 8 * s, cy - 6 * s);
  ctx.quadraticCurveTo(cx + 18 * s, cy - 14 * s, cx + 24 * s, cy);
  ctx.quadraticCurveTo(cx + 16 * s, cy + 8 * s, cx + 6 * s, cy + 4 * s);
  ctx.quadraticCurveTo(cx, cy + 10 * s, cx - 6 * s, cy + 4 * s);
  ctx.quadraticCurveTo(cx - 16 * s, cy + 8 * s, cx - 24 * s, cy);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2a8a3a';
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 8 * s);
  ctx.lineTo(cx, cy + 4 * s);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 14 * s, cy - 4 * s);
  ctx.lineTo(cx - 4 * s, cy - 2 * s);
  ctx.moveTo(cx + 6 * s, cy - 6 * s);
  ctx.lineTo(cx + 16 * s, cy - 3 * s);
  ctx.stroke();
}

function drawTeh(ctx, cx, cy, s) {
  // Gelas es teh: gelas bening + teh cokelat + es batu + sedotan.
  shadow(ctx, 'rgba(0,0,0,0.18)', 4 * s, 0, 2 * s);
  ctx.fillStyle = 'rgba(190,220,240,0.55)';
  ctx.beginPath();
  ctx.moveTo(cx - 16 * s, cy - 20 * s);
  ctx.lineTo(cx + 16 * s, cy - 20 * s);
  ctx.lineTo(cx + 12 * s, cy + 20 * s);
  ctx.lineTo(cx - 12 * s, cy + 20 * s);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#b06a2e';
  ctx.beginPath();
  ctx.moveTo(cx - 14 * s, cy - 12 * s);
  ctx.lineTo(cx + 14 * s, cy - 12 * s);
  ctx.lineTo(cx + 11 * s, cy + 18 * s);
  ctx.lineTo(cx - 11 * s, cy + 18 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#bfe8ff';
  ctx.save();
  ctx.translate(cx - 5 * s, cy - 4 * s);
  ctx.rotate(0.4);
  ctx.fillRect(-4 * s, -4 * s, 8 * s, 8 * s);
  ctx.restore();
  ctx.save();
  ctx.translate(cx + 6 * s, cy + 4 * s);
  ctx.rotate(-0.3);
  ctx.fillRect(-4 * s, -4 * s, 8 * s, 8 * s);
  ctx.restore();
  ctx.strokeStyle = '#d94f3d';
  ctx.lineWidth = 4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + 4 * s, cy + 10 * s);
  ctx.lineTo(cx + 12 * s, cy - 28 * s);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  for (const [dx, dy] of [[-6, 6], [4, 12], [0, 0]]) {
    circle(ctx, cx + dx * s, cy + dy * s, 1.5 * s);
    ctx.fill();
  }
}

function drawEs(ctx, cx, cy, s) {
  // Es batu: kubus bening kebiruan.
  shadow(ctx, 'rgba(0,0,0,0.15)', 3 * s, 0, 2 * s);
  ctx.fillStyle = '#bfe8ff';
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(0.2);
  ctx.fillRect(-14 * s, -14 * s, 28 * s, 28 * s);
  ctx.restore();
  noShadow(ctx);
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.moveTo(cx - 10 * s, cy - 10 * s);
  ctx.lineTo(cx + 2 * s, cy - 10 * s);
  ctx.lineTo(cx - 10 * s, cy + 2 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,180,220,0.8)';
  ctx.lineWidth = 1.5 * s;
  ctx.strokeRect(cx - 14 * s, cy - 14 * s, 28 * s, 28 * s);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 6 * s, cy - 12 * s);
  ctx.lineTo(cx + 2 * s, cy - 2 * s);
  ctx.lineTo(cx - 2 * s, cy + 10 * s);
  ctx.stroke();
}

function drawGula(ctx, cx, cy, s) {
  // Gula: mangkuk kecil + kubus gula putih.
  shadow(ctx, 'rgba(0,0,0,0.15)', 3 * s, 0, 2 * s);
  ctx.fillStyle = '#f7f3e8';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 10 * s, 20 * s, 8 * s, 0, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#ffffff';
  ctx.save();
  ctx.translate(cx - 6 * s, cy - 4 * s);
  ctx.rotate(0.15);
  ctx.fillRect(-6 * s, -6 * s, 12 * s, 12 * s);
  ctx.restore();
  ctx.save();
  ctx.translate(cx + 7 * s, cy - 2 * s);
  ctx.rotate(-0.2);
  ctx.fillRect(-6 * s, -6 * s, 12 * s, 12 * s);
  ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(cx - 12 * s, cy + 2 * s, 24 * s, 2 * s);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillRect(cx - 11 * s, cy - 9 * s, 3 * s, 3 * s);
  ctx.fillRect(cx + 2 * s, cy - 7 * s, 3 * s, 3 * s);
}

const DRAW_ING = {
  nasi: drawNasi,
  telur: drawTelur,
  kecap: drawKecap,
  udang: drawUdang,
  spaghetti: drawSpaghettiRaw,
  daging: drawDaging,
  saus: drawSaus,
  keju: drawKeju,
  roti: drawRoti,
  patty: drawPatty,
  selada: drawSelada,
  teh: drawTeh,
  es: drawEs,
  gula: drawGula,
};

// ---------- alas piring & hiasan ----------
function drawPlateBase(ctx, cx, cy, s) {
  // Piring putih dengan bibir + bayangan.
  shadow(ctx, 'rgba(0,0,0,0.18)', 5 * s, 0, 3 * s);
  ctx.fillStyle = '#f7f3ee';
  ellipse(ctx, cx, cy + 8 * s, 66 * s, 26 * s);
  ctx.fill();
  noShadow(ctx);
  ctx.strokeStyle = '#d8d0c4';
  ctx.lineWidth = 2 * s;
  ellipse(ctx, cx, cy + 8 * s, 58 * s, 21 * s);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 8 * s, 62 * s, 23 * s, 0, Math.PI * 1.1, Math.PI * 1.5);
  ctx.stroke();
}

function drawTomatoSlice(ctx, x, y, r) {
  // Tomat cerah (fresh, merah hidup).
  ctx.fillStyle = '#ef5d3d';
  circle(ctx, x, y, r);
  ctx.fill();
  ctx.fillStyle = '#f7a08a';
  circle(ctx, x - r * 0.25, y - r * 0.25, r * 0.55);
  ctx.fill();
  ctx.fillStyle = '#d94f3d';
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.5;
    circle(ctx, x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4, r * 0.14);
    ctx.fill();
  }
  ctx.fillStyle = '#f7c8b8';
  circle(ctx, x + r * 0.3, y + r * 0.2, r * 0.12);
  ctx.fill();
}

function drawCucumberSlice(ctx, x, y, r) {
  ctx.fillStyle = '#45b058';
  circle(ctx, x, y, r);
  ctx.fill();
  ctx.fillStyle = '#c8e8a8';
  circle(ctx, x, y, r * 0.7);
  ctx.fill();
  ctx.fillStyle = '#8ab86a';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    circle(ctx, x + Math.cos(a) * r * 0.35, y + Math.sin(a) * r * 0.35, r * 0.09);
    ctx.fill();
  }
}

function drawKerupuk(ctx, x, y, r, rot) {
  // Kerupuk putih bergelombang.
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#fffdf6';
  ctx.beginPath();
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rr2 = r * (1 + 0.12 * Math.sin(a * 3));
    const px = Math.cos(a) * rr2;
    const py = Math.sin(a) * rr2 * 0.8;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e8dcc8';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#f0e6d0';
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.7;
    circle(ctx, Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.4, r * 0.08);
    ctx.fill();
  }
  ctx.restore();
}

function drawBasilLeaf(ctx, x, y, r, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#2a9a3a';
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r * 0.9, -r * 0.2, 0, r);
  ctx.quadraticCurveTo(-r * 0.9, -r * 0.2, 0, -r);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1a6a2a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.8);
  ctx.lineTo(0, r * 0.8);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.4);
  ctx.lineTo(r * 0.5, -r * 0.1);
  ctx.moveTo(0, 0);
  ctx.lineTo(-r * 0.5, r * 0.3);
  ctx.stroke();
  ctx.restore();
}

// ---------- hidangan jadi ----------
// Nasi Goreng jadi (v12–v13, dipertahankan v14): NASI TERLIHAT.
// Gundukan nasi keemasan dominan; telur KECIL di pinggir atas-kanan;
// 2 udang KECIL di tepi (v14: udang model baru); tomat/timun melengkung.
// v14: uap BERGERAK + warna lebih fresh (nasi lebih keemasan).
function drawNasgorDish(ctx, cx, cy, s, time) {
  drawPlateBase(ctx, cx, cy, s);
  // Gundukan nasi goreng keemasan berbutir — BESAR & dominan (fresh).
  shadow(ctx, 'rgba(0,0,0,0.15)', 4 * s, 0, 2 * s);
  const g = ctx.createRadialGradient(cx - 8 * s, cy - 6 * s, 4 * s, cx, cy + 6 * s, 54 * s);
  g.addColorStop(0, '#f7c95a');
  g.addColorStop(0.7, '#f0b43e');
  g.addColorStop(1, '#d18a26');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 6 * s, 52 * s, 24 * s, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  // Butir nasi BANYAK & JELAS di seluruh permukaan gundukan (20 butir).
  ctx.fillStyle = '#f7d774';
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 + 0.3;
    const bx = cx + Math.cos(a) * (14 + (i % 4) * 8) * s;
    const by = cy - 2 * s + Math.sin(a) * 8 * s;
    ctx.beginPath();
    ctx.ellipse(bx, by, 4.5 * s, 2.2 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#fdf6e3';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.9;
    const bx = cx + Math.cos(a) * (8 + (i % 3) * 10) * s;
    const by = cy - 6 * s + Math.sin(a) * 6 * s;
    ctx.beginPath();
    ctx.ellipse(bx, by, 3.5 * s, 2 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  // Daun bawang + cabai + telur orak-arik (taburan kecil).
  ctx.fillStyle = '#3e9b4f';
  for (const [dx, dy] of [[-28, -8], [10, -12], [30, 0], [-8, 0]]) {
    ctx.fillRect(cx + dx * s, cy + dy * s, 5 * s, 2.4 * s);
  }
  ctx.fillStyle = '#d94f3d';
  for (const [dx, dy] of [[-18, -2], [24, -6]]) {
    ctx.beginPath();
    ctx.ellipse(cx + dx * s, cy + dy * s, 4 * s, 2 * s, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffe066';
  for (const [dx, dy] of [[-34, 2], [4, -14], [36, 4]]) {
    ctx.beginPath();
    ctx.ellipse(cx + dx * s, cy + dy * s, 4.5 * s, 3 * s, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Udang KECIL di TEPI kiri-kanan gundukan (v14: model baru).
  drawUdang(ctx, cx - 46 * s, cy + 2 * s, 0.6 * s);
  drawUdang(ctx, cx + 46 * s, cy + 2 * s, 0.6 * s);
  // Telur ceplok KECIL di pinggir ATAS-KANAN (skala 0,55 — BUKAN di tengah).
  drawTelur(ctx, cx + 24 * s, cy - 16 * s, 0.55 * s);
  // Tomat 3 + timun 3 MELENGKUNG mengikuti sisi gundukan nasi (busur).
  for (let i = 0; i < 6; i++) {
    const a = 0.15 + ((Math.PI - 0.3) * i) / 5;
    const x = cx + Math.cos(a) * 56 * s;
    const y = cy + 12 * s + Math.sin(a) * 24 * s;
    if (i < 3) drawTomatoSlice(ctx, x, y, 7.5 * s);
    else drawCucumberSlice(ctx, x, y, 7.5 * s);
  }
  // Selada kecil di pinggir kiri + kerupuk putih di pinggir kanan atas.
  drawSelada(ctx, cx - 62 * s, cy + 2 * s, 0.45 * s);
  drawKerupuk(ctx, cx + 58 * s, cy - 14 * s, 11 * s, 0.4);
  drawKerupuk(ctx, cx + 64 * s, cy - 4 * s, 9 * s, -0.3);
  // Uap BERGERAK (v14).
  drawSteam(ctx, cx, cy, s, time);
}

// Spaghetti Bolognese jadi (v12–v13, dipertahankan v14): HELAI DITUMPUK TANPA RONGGA.
// 10 loop elips PENUH, langkah vertikal (4,5) < lebar garis (7).
// v14: uap BERGERAK + saus merah lebih hidup.
function drawSpaghettiDish(ctx, cx, cy, s, time) {
  drawPlateBase(ctx, cx, cy, s);
  // Sarang: 10 loop penuh yang DITUMPUK — dari lebar (bawah) ke sempit (atas).
  ctx.lineCap = 'round';
  const loops = 10;
  for (let i = 0; i < loops; i++) {
    const t = i / (loops - 1); // 0 = bawah, 1 = atas
    const rx = (48 - t * 26) * s;
    const ry = (13 - t * 4) * s;
    const y = cy + 12 * s - t * 40 * s;
    ctx.strokeStyle = i % 3 === 0 ? '#f7d774' : (i % 2 === 0 ? '#f2c94c' : '#eec14a');
    ctx.lineWidth = 7 * s;
    ctx.beginPath();
    ctx.ellipse(cx, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Kilau di atas tiap loop.
    ctx.strokeStyle = 'rgba(255,240,180,0.85)';
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.ellipse(cx, y - 1.5 * s, rx * 0.96, ry * 0.9, 0, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // Herba hijau cincang BANYAK tersebar di seluruh sarang (14 potong).
  ctx.fillStyle = '#3e9b4f';
  for (const [dx, dy, r] of [
    [-30, 0, 0.4], [-14, -10, -0.3], [6, -6, 0.5], [24, -8, -0.4],
    [-6, 8, 0.2], [16, -14, 0.6], [-22, -16, -0.5], [30, 2, 0.3],
    [-2, -20, 0.4], [10, 10, -0.2], [-34, -6, 0.5], [20, 6, -0.6],
    [-10, -26, 0.3], [2, -2, -0.4],
  ]) {
    ctx.save();
    ctx.translate(cx + dx * s, cy + dy * s);
    ctx.rotate(r);
    ctx.fillRect(-2.4 * s, -1.2 * s, 4.8 * s, 2.4 * s);
    ctx.restore();
  }
  // Saus Bolognese merah DATAR di atas sarang (bukan kubah) — merah hidup (v14).
  shadow(ctx, 'rgba(0,0,0,0.18)', 3 * s, 0, 2 * s);
  const g = ctx.createRadialGradient(cx - 4 * s, cy - 20 * s, 2 * s, cx, cy - 16 * s, 28 * s);
  g.addColorStop(0, '#ef6a45');
  g.addColorStop(0.7, '#d43a1e');
  g.addColorStop(1, '#a82c14');
  ctx.fillStyle = g;
  ellipse(ctx, cx, cy - 16 * s, 27 * s, 8 * s);
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#8a2a12';
  circle(ctx, cx - 10 * s, cy - 17 * s, 2.6 * s);
  ctx.fill();
  circle(ctx, cx + 8 * s, cy - 14 * s, 2.2 * s);
  ctx.fill();
  circle(ctx, cx + 2 * s, cy - 19 * s, 1.8 * s);
  ctx.fill();
  // Taburan keju (serpihan putih) + basil hijau BESAR di puncak saus.
  ctx.fillStyle = '#fff6e0';
  for (const [dx, dy, r] of [[-14, -18, 0.4], [-4, -14, -0.3], [8, -18, 0.5], [16, -15, -0.4]]) {
    ctx.save();
    ctx.translate(cx + dx * s, cy + dy * s);
    ctx.rotate(r);
    ctx.fillRect(-3 * s, -1 * s, 6 * s, 2 * s);
    ctx.restore();
  }
  drawBasilLeaf(ctx, cx - 6 * s, cy - 28 * s, 11 * s, -0.25);
  drawBasilLeaf(ctx, cx + 8 * s, cy - 26 * s, 9 * s, 0.5);
  drawBasilLeaf(ctx, cx + 1 * s, cy - 32 * s, 8 * s, 0.1);
  // Uap BERGERAK (v14).
  drawSteam(ctx, cx, cy - 6 * s, s, time);
}

// Kentang goreng (pendamping visual Burger): kotak merah + stik emas.
// BUKAN bahan, BUKAN hidangan — hiasan di piring Burger saja.
function drawFries(ctx, cx, cy, s) {
  // Stik emas (7 batang, miring acak).
  ctx.lineCap = 'round';
  for (const [dx, dy, rot] of [
    [-10, -12, -0.15], [-5, -16, 0.05], [0, -13, -0.05], [5, -17, 0.1],
    [10, -12, 0.2], [-14, -8, -0.25], [14, -9, 0.28],
  ]) {
    ctx.strokeStyle = '#f2c94c';
    ctx.lineWidth = 4.5 * s;
    ctx.beginPath();
    ctx.moveTo(cx + dx * s, cy + dy * s + 12 * s);
    ctx.lineTo(cx + (dx + rot * 30) * s, cy + (dy - 8) * s);
    ctx.stroke();
  }
  // Kotak merah (trapesium).
  shadow(ctx, 'rgba(0,0,0,0.2)', 3 * s, 0, 2 * s);
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(cx - 20 * s, cy - 6 * s);
  ctx.lineTo(cx + 20 * s, cy - 6 * s);
  ctx.lineTo(cx + 15 * s, cy + 16 * s);
  ctx.lineTo(cx - 15 * s, cy + 16 * s);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  // Logo kuning (lingkaran) + garis putih.
  ctx.fillStyle = '#f2c94c';
  circle(ctx, cx, cy + 5 * s, 6 * s);
  ctx.fill();
  ctx.fillStyle = '#d94f3d';
  circle(ctx, cx, cy + 5 * s, 3 * s);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(cx - 17 * s, cy - 4 * s, 4 * s, 16 * s);
}

// Burger jadi: bun atas + wijen, selada bergelombang, patty, keju meleleh,
// tomat, bun bawah, bendera merah — + kentang goreng di samping.
// v14: uap BERGERAK + warna lebih vivid.
function drawBurgerDish(ctx, cx, cy, s, time) {
  drawPlateBase(ctx, cx, cy, s);
  // Bun bawah.
  shadow(ctx, 'rgba(0,0,0,0.15)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#e8b96a';
  rr(ctx, cx - 34 * s, cy + 10 * s, 68 * s, 12 * s, 5 * s);
  ctx.fill();
  noShadow(ctx);
  // Patty (gelap, menonjol).
  const g = ctx.createLinearGradient(cx, cy + 2 * s, cx, cy + 12 * s);
  g.addColorStop(0, '#8a5a3b');
  g.addColorStop(1, '#5a3018');
  ctx.fillStyle = g;
  rr(ctx, cx - 38 * s, cy + 2 * s, 76 * s, 11 * s, 5 * s);
  ctx.fill();
  // Keju meleleh (segitiga menetes).
  ctx.fillStyle = '#f7c948';
  ctx.beginPath();
  ctx.moveTo(cx - 36 * s, cy - 2 * s);
  ctx.lineTo(cx + 36 * s, cy - 2 * s);
  ctx.lineTo(cx + 30 * s, cy + 2 * s);
  ctx.lineTo(cx + 18 * s, cy + 8 * s);
  ctx.lineTo(cx + 10 * s, cy + 2 * s);
  ctx.lineTo(cx - 2 * s, cy + 9 * s);
  ctx.lineTo(cx - 14 * s, cy + 2 * s);
  ctx.lineTo(cx - 26 * s, cy + 7 * s);
  ctx.closePath();
  ctx.fill();
  // Selada hijau berombak (menjulur keluar) — hijau segar (v14).
  ctx.fillStyle = '#45b058';
  ctx.beginPath();
  ctx.moveTo(cx - 42 * s, cy - 4 * s);
  ctx.quadraticCurveTo(cx - 34 * s, cy + 2 * s, cx - 24 * s, cy - 4 * s);
  ctx.quadraticCurveTo(cx - 16 * s, cy + 2 * s, cx - 6 * s, cy - 4 * s);
  ctx.quadraticCurveTo(cx + 2 * s, cy + 2 * s, cx + 12 * s, cy - 4 * s);
  ctx.quadraticCurveTo(cx + 20 * s, cy + 2 * s, cx + 30 * s, cy - 4 * s);
  ctx.quadraticCurveTo(cx + 38 * s, cy + 1 * s, cx + 42 * s, cy - 4 * s);
  ctx.lineTo(cx + 40 * s, cy - 8 * s);
  ctx.lineTo(cx - 40 * s, cy - 8 * s);
  ctx.closePath();
  ctx.fill();
  // Tomat merah (2 iris) — merah hidup.
  ctx.fillStyle = '#ef5d3d';
  ellipse(ctx, cx - 18 * s, cy - 8 * s, 14 * s, 4 * s);
  ctx.fill();
  ellipse(ctx, cx + 16 * s, cy - 8 * s, 14 * s, 4 * s);
  ctx.fill();
  // Bun atas (kubah mengilap) + wijen.
  const g2 = ctx.createLinearGradient(cx, cy - 34 * s, cx, cy - 6 * s);
  g2.addColorStop(0, '#f2c078');
  g2.addColorStop(1, '#d89a4e');
  ctx.fillStyle = g2;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 8 * s, 36 * s, 24 * s, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff6e0';
  for (const [dx, dy] of [[-18, -22], [-6, -28], [8, -24], [20, -18], [0, -18], [-12, -14]]) {
    ctx.beginPath();
    ctx.ellipse(cx + dx * s, cy + dy * s, 2.5 * s, 1.5 * s, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Kilau bun.
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.ellipse(cx - 14 * s, cy - 26 * s, 12 * s, 4 * s, -0.25, 0, Math.PI * 2);
  ctx.fill();
  // Bendera merah kecil di tusuk sate.
  ctx.strokeStyle = '#8a5a3b';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 30 * s);
  ctx.lineTo(cx, cy - 52 * s);
  ctx.stroke();
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 52 * s);
  ctx.lineTo(cx + 16 * s, cy - 48 * s);
  ctx.lineTo(cx, cy - 44 * s);
  ctx.closePath();
  ctx.fill();
  // Kentang goreng di samping kanan piring.
  drawFries(ctx, cx + 76 * s, cy + 8 * s, 0.85 * s);
  // Uap BERGERAK (v14).
  drawSteam(ctx, cx, cy - 10 * s, s, time);
}

// Es Teh Manis jadi: gelas besar + teh + es batu + sedotan + daun mint + lemon.
// v14: teh lebih cerah, embun lebih jelas (fresh).
function drawEstehDish(ctx, cx, cy, s, time) {
  drawPlateBase(ctx, cx, cy, s);
  // Gelas besar.
  shadow(ctx, 'rgba(0,0,0,0.2)', 5 * s, 0, 3 * s);
  ctx.fillStyle = 'rgba(190,220,240,0.5)';
  ctx.beginPath();
  ctx.moveTo(cx - 30 * s, cy - 34 * s);
  ctx.lineTo(cx + 30 * s, cy - 34 * s);
  ctx.lineTo(cx + 22 * s, cy + 28 * s);
  ctx.lineTo(cx - 22 * s, cy + 28 * s);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  // Teh cokelat keemasan (lebih cerah, v14).
  const g = ctx.createLinearGradient(cx, cy - 26 * s, cx, cy + 26 * s);
  g.addColorStop(0, '#d08640');
  g.addColorStop(1, '#96521e');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(cx - 27 * s, cy - 24 * s);
  ctx.lineTo(cx + 27 * s, cy - 24 * s);
  ctx.lineTo(cx + 21 * s, cy + 26 * s);
  ctx.lineTo(cx - 21 * s, cy + 26 * s);
  ctx.closePath();
  ctx.fill();
  // Es batu besar (2 kubus).
  ctx.fillStyle = '#bfe8ff';
  ctx.save();
  ctx.translate(cx - 10 * s, cy - 6 * s);
  ctx.rotate(0.3);
  ctx.fillRect(-9 * s, -9 * s, 18 * s, 18 * s);
  ctx.restore();
  ctx.save();
  ctx.translate(cx + 11 * s, cy + 4 * s);
  ctx.rotate(-0.25);
  ctx.fillRect(-9 * s, -9 * s, 18 * s, 18 * s);
  ctx.restore();
  // Kilau es.
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillRect(cx - 17 * s, cy - 13 * s, 4 * s, 4 * s);
  ctx.fillRect(cx + 5 * s, cy - 3 * s, 4 * s, 4 * s);
  // Sedotan merah-putih bergaris.
  ctx.strokeStyle = '#d94f3d';
  ctx.lineWidth = 6 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + 8 * s, cy + 14 * s);
  ctx.lineTo(cx + 20 * s, cy - 46 * s);
  ctx.stroke();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6 * s;
  ctx.beginPath();
  ctx.moveTo(cx + 12 * s, cy - 4 * s);
  ctx.lineTo(cx + 16 * s, cy - 18 * s);
  ctx.stroke();
  // Daun mint + iris lemon di tepi gelas.
  drawBasilLeaf(ctx, cx - 22 * s, cy - 34 * s, 10 * s, -0.6);
  ctx.fillStyle = '#ffe066';
  circle(ctx, cx + 26 * s, cy - 28 * s, 8 * s);
  ctx.fill();
  ctx.fillStyle = '#f7d774';
  circle(ctx, cx + 26 * s, cy - 28 * s, 5 * s);
  ctx.fill();
  // Tetesan embun di gelas (fresh, lebih jelas v14).
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  for (const [dx, dy] of [[-24, -10], [24, -14], [-20, 8], [20, 14], [-10, 18], [14, 22]]) {
    circle(ctx, cx + dx * s, cy + dy * s, 1.8 * s);
    ctx.fill();
  }
  // (Es teh dingin — tidak ada uap panas; kesegaran dari embun + es.)
}

const DRAW_DISH = {
  nasgor: drawNasgorDish,
  spaghetti: drawSpaghettiDish,
  burger: drawBurgerDish,
  esteh: drawEstehDish,
};

// ---------- gambar bahan di piring (tengah perakitan) ----------
// Bahan di piring disusun melingkar; bila lengkap, gambar hidangan jadi.
export function drawPlateContents(ctx, s, cx, cy) {
  const match = s.orders.findIndex((o) => {
    const d = DISHES[o.dish];
    return d.ingredients.length === s.plate.length && d.ingredients.every((id) => s.plate.includes(id));
  });
  if (match >= 0) {
    DRAW_DISH[s.orders[match].dish](ctx, cx, cy, 1, s.time);
    return;
  }
  // Perakitan: bahan disusun melingkar (≤4 item).
  const n = s.plate.length;
  s.plate.forEach((id, i) => {
    const a = (i / Math.max(1, n)) * Math.PI * 2 - Math.PI / 2;
    const bx = cx + Math.cos(a) * 30;
    const by = cy + 6 + Math.sin(a) * 14;
    DRAW_ING[id](ctx, bx, by, 0.55);
  });
}

// ---------- render utama ----------
export function render(ctx, s) {
  // Latar: dinding dapur krem + lantai kayu + garis ubin.
  const g = ctx.createLinearGradient(0, 0, 0, 720);
  g.addColorStop(0, '#f6ead2');
  g.addColorStop(0.55, '#f6ead2');
  g.addColorStop(0.56, '#e8c9a0');
  g.addColorStop(1, '#d8a86a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1280, 720);
  // Garis ubin dinding.
  ctx.strokeStyle = 'rgba(180,150,110,0.25)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1280; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 400);
    ctx.stroke();
  }
  for (let y = 0; y <= 400; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1280, y);
    ctx.stroke();
  }
  // Papan kayu di lantai.
  ctx.strokeStyle = 'rgba(120,80,40,0.2)';
  for (let y = 420; y <= 720; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1280, y);
    ctx.stroke();
  }

  if (s.screen === 'title') {
    renderTitle(ctx, s);
    return;
  }
  if (s.screen === 'win' || s.screen === 'over') {
    renderMain(ctx, s);
    renderEndCard(ctx, s);
    return;
  }
  renderMain(ctx, s);
}

function renderTitle(ctx, s) {
  // Judul besar + hero 4 hidangan + tombol MULAI.
  ctx.textAlign = 'center';
  shadow(ctx, 'rgba(0,0,0,0.25)', 8, 0, 4);
  ctx.fillStyle = '#d94f3d';
  ctx.font = 'bold 84px system-ui, sans-serif';
  ctx.fillText('DAPUR KILAT', 640, 150);
  noShadow(ctx);
  ctx.fillStyle = '#5a2c12';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText('Masak cepat, sajikan tepat waktu!', 640, 196);
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillStyle = '#7a5a3a';
  ctx.fillText('Ambil bahan, olah di talenan & kompor, rakit di piring, sajikan sebelum hangus.', 640, 230);
  // Hero: 4 hidangan jadi berjejer.
  const heroX = [240, 490, 740, 990];
  const heroDish = ['nasgor', 'spaghetti', 'burger', 'esteh'];
  heroX.forEach((x, i) => {
    DRAW_DISH[heroDish[i]](ctx, x, 330, 0.75, s.time);
    ctx.fillStyle = '#5a2c12';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(DISHES[heroDish[i]].label, x, 430);
  });
  // Tombol MULAI.
  const b = LAYOUT.tombolJudul;
  shadow(ctx, 'rgba(0,0,0,0.3)', 6, 0, 3);
  ctx.fillStyle = '#d94f3d';
  rr(ctx, b.x, b.y, b.w, b.h, 16);
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.fillText('MULAI MEMASAK', 640, b.y + 42);
  // Instruksi.
  ctx.fillStyle = '#5a2c12';
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillText('Klik / tombol 1–6: ambil bahan  •  Spasi: sajikan  •  R: ulang  •  P: jeda', 640, 630);
  ctx.fillStyle = '#7a5a3a';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText('Sajikan 12 pesanan untuk menyelesaikan hari. 3 pesanan hangus = shift berakhir.', 640, 660);
}

function renderMain(ctx, s) {
  const L = LAYOUT;
  // Header: koin, saji, kombo, waktu, strike.
  ctx.fillStyle = '#5a2c12';
  ctx.fillRect(L.header.x, L.header.y, L.header.w, L.header.h);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText('Rp ' + s.coins, 24, 42);
  ctx.fillStyle = '#fff';
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText('Saji: ' + s.served + '/' + RULES.servesToWin, 220, 40);
  ctx.fillText('Kombo: x' + s.combo, 400, 40);
  ctx.fillText('Waktu: ' + Math.floor(s.time) + ' dtk', 580, 40);
  ctx.fillStyle = '#ff6b6b';
  ctx.fillText('Strike: ' + s.strikes + '/' + RULES.strikesMax, 780, 40);
  if (s.paused) {
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillText('JEDA (P)', 1020, 42);
  } else if (s.hand) {
    // Indikator bahan di tangan — di header (kanan), BUKAN di footer.
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('Di tangan: ' + INGREDIENTS[s.hand].label, 1000, 42);
  }

  // Stasiun talenan.
  renderStation(ctx, s, 'talenan', L.talenan);
  renderStation(ctx, s, 'kompor', L.kompor);

  // Area piring.
  ctx.fillStyle = '#fff8ea';
  rr(ctx, L.piring.x, L.piring.y, L.piring.w, L.piring.h, 12);
  ctx.fill();
  ctx.strokeStyle = '#d8c9a8';
  ctx.lineWidth = 2;
  rr(ctx, L.piring.x, L.piring.y, L.piring.w, L.piring.h, 12);
  ctx.stroke();
  ctx.fillStyle = '#5a2c12';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PIRING', L.plateCenter.x, L.piring.y + 28);
  drawPlateBase(ctx, L.plateCenter.x, L.plateCenter.y - 8, 1);
  drawPlateContents(ctx, s, L.plateCenter.x, L.plateCenter.y - 8);

  // Bar pesan + tombol SAJIKAN — hanya saat layar utama.
  if (s.screen === 'main') {
    ctx.fillStyle = '#fff3d6';
    rr(ctx, L.pesan.x, L.pesan.y, L.pesan.w, L.pesan.h, 10);
    ctx.fill();
    ctx.strokeStyle = '#e8d5a8';
    ctx.lineWidth = 2;
    rr(ctx, L.pesan.x, L.pesan.y, L.pesan.w, L.pesan.h, 10);
    ctx.stroke();
    ctx.fillStyle = '#5a2c12';
    ctx.font = '20px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(s.message || '', L.pesan.x + 16, L.pesan.y + 30);
    // Tombol SAJIKAN.
    const canServe = s.plate.length > 0;
    ctx.fillStyle = canServe ? '#2a8a3a' : '#9a9a9a';
    rr(ctx, L.sajikan.x, L.sajikan.y, L.sajikan.w, L.sajikan.h, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SAJIKAN (Spasi)', L.sajikan.x + L.sajikan.w / 2, L.sajikan.y + 32);
    // Float text (+Rp …) + "SEMPURNA!" emas di atas tombol.
    if (s.floatText) {
      ctx.fillStyle = '#2a8a3a';
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.fillText(s.floatText.text, L.sajikan.x + L.sajikan.w / 2, L.sajikan.y - 8);
    }
    if (s.perfect) {
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 30px system-ui, sans-serif';
      ctx.textAlign = 'center';
      shadow(ctx, 'rgba(0,0,0,0.3)', 4, 0, 2);
      ctx.fillText(s.perfect.text, L.sajikan.x + L.sajikan.w / 2, L.sajikan.y - 40);
      noShadow(ctx);
    }
  }

  // Kartu bahan di meja (6 kartu).
  const cw = (L.kartu.w - 5 * L.kartu.gap) / 6;
  COUNTER.forEach((id, i) => {
    const x = L.kartu.x + i * (cw + L.kartu.gap);
    const y = L.kartu.y;
    ctx.fillStyle = '#fff8ea';
    rr(ctx, x, y, cw, L.kartu.h, 12);
    ctx.fill();
    ctx.strokeStyle = s.hand === id ? '#d94f3d' : '#d8c9a8';
    ctx.lineWidth = s.hand === id ? 4 : 2;
    rr(ctx, x, y, cw, L.kartu.h, 12);
    ctx.stroke();
    // Ikon bahan + label + stasiun.
    DRAW_ING[id](ctx, x + cw / 2, y + 78, 1);
    ctx.fillStyle = '#5a2c12';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(INGREDIENTS[id].label, x + cw / 2, y + 168);
    ctx.fillStyle = '#7a5a3a';
    ctx.font = '16px system-ui, sans-serif';
    const st = INGREDIENTS[id].station;
    ctx.fillText(st === 'siap' ? 'Siap pakai' : 'Olah: ' + (st === 'talenan' ? 'Talenan' : 'Kompor'), x + cw / 2, y + 194);
    ctx.fillStyle = '#9a9a9a';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('[' + (i + 1) + ']', x + cw / 2, y + 216);
  });

  // Footer: petunjuk.
  ctx.fillStyle = 'rgba(90,44,18,0.08)';
  rr(ctx, L.footer.x, L.footer.y, L.footer.w, L.footer.h, 10);
  ctx.fill();
  ctx.fillStyle = '#5a2c12';
  ctx.font = '18px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Klik bahan (1–6) → olah di Talenan (2 dtk) / Kompor (3,2 dtk) → klik Piring → SAJIKAN.', L.footer.x + 16, L.footer.y + 32);
  ctx.fillText('Bahan "Siap pakai" langsung ke piring. Sajikan cepat = tip lebih besar. Kombo menaikkan bonus koin.', L.footer.x + 16, L.footer.y + 60);
  ctx.fillText('Sajikan dengan kesabaran >75% = SEMPURNA! (+Rp 3).  P: jeda  •  R: ulang hari  •  Klik tiket untuk sajikan.', L.footer.x + 16, L.footer.y + 84);

  // Papan pesanan (kanan).
  renderBoard(ctx, s, L);
}

function renderStation(ctx, s, name, box) {
  ctx.fillStyle = name === 'talenan' ? '#e8c9a0' : '#3a3a3a';
  rr(ctx, box.x, box.y, box.w, box.h, 12);
  ctx.fill();
  ctx.strokeStyle = '#c8a878';
  ctx.lineWidth = 2;
  rr(ctx, box.x, box.y, box.w, box.h, 12);
  ctx.stroke();
  ctx.fillStyle = name === 'talenan' ? '#5a2c12' : '#fff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name === 'talenan' ? 'TALENAN' : 'KOMPOR', box.x + box.w / 2, box.y + 30);
  const st = s.stations[name];
  if (st) {
    // Bahan sedang diolah + progress bar.
    DRAW_ING[st.item](ctx, box.x + box.w / 2, box.y + 105, 1);
    const frac = Math.min(1, st.t / st.total);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    rr(ctx, box.x + 20, box.y + 170, box.w - 40, 16, 8);
    ctx.fill();
    ctx.fillStyle = frac >= 1 ? '#2a8a3a' : '#f2c94c';
    rr(ctx, box.x + 20, box.y + 170, (box.w - 40) * frac, 16, 8);
    ctx.fill();
    ctx.fillStyle = name === 'talenan' ? '#5a2c12' : '#fff';
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText(frac >= 1 ? 'SELESAI — klik untuk ambil' : INGREDIENTS[st.item].label + ' diolah…', box.x + box.w / 2, box.y + 205);
  } else {
    ctx.fillStyle = name === 'talenan' ? '#7a5a3a' : '#bbb';
    ctx.font = '18px system-ui, sans-serif';
    if (name === 'talenan') {
      // Gambar talenan kayu + pisau.
      ctx.fillStyle = '#d8a86a';
      rr(ctx, box.x + 60, box.y + 70, box.w - 120, 90, 10);
      ctx.fill();
      ctx.strokeStyle = '#b88a4a';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(box.x + 80, box.y + 90 + i * 22);
        ctx.lineTo(box.x + box.w - 80, box.y + 90 + i * 22);
        ctx.stroke();
      }
      ctx.fillStyle = '#c0c0c0';
      ctx.save();
      ctx.translate(box.x + box.w - 50, box.y + 60);
      ctx.rotate(0.6);
      rr(ctx, -6, -30, 12, 60, 4);
      ctx.fill();
      ctx.restore();
    } else {
      // Gambar kompor: 2 tungku + api.
      for (const dx of [-50, 50]) {
        ctx.fillStyle = '#222';
        circle(ctx, box.x + box.w / 2 + dx, box.y + 115, 42);
        ctx.fill();
        ctx.fillStyle = '#555';
        circle(ctx, box.x + box.w / 2 + dx, box.y + 115, 32);
        ctx.fill();
        ctx.fillStyle = '#ff8c42';
        ctx.beginPath();
        ctx.moveTo(box.x + box.w / 2 + dx - 14, box.y + 118);
        ctx.quadraticCurveTo(box.x + box.w / 2 + dx, box.y + 92, box.x + box.w / 2 + dx + 14, box.y + 118);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(box.x + box.w / 2 + dx - 7, box.y + 118);
        ctx.quadraticCurveTo(box.x + box.w / 2 + dx, box.y + 102, box.x + box.w / 2 + dx + 7, box.y + 118);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.fillStyle = name === 'talenan' ? '#7a5a3a' : '#bbb';
    ctx.fillText('Kosong — klik bahan lalu klik sini', box.x + box.w / 2, box.y + 205);
  }
}

function renderBoard(ctx, s, L) {
  // Papan pesanan.
  ctx.fillStyle = '#5a2c12';
  rr(ctx, L.papan.x, L.papan.y, L.papan.w, L.papan.h, 14);
  ctx.fill();
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PESANAN', L.papan.x + L.papan.w / 2, L.papan.y + 36);
  // Tiket (maks 3).
  s.orders.forEach((order, i) => {
    const t = {
      x: L.tiket.x,
      y: L.tiket.y + i * (L.tiket.h + L.tiket.gap),
      w: L.tiket.w,
      h: L.tiket.h,
    };
    const dish = DISHES[order.dish];
    const frac = Math.max(0, order.patience / order.max);
    ctx.fillStyle = '#fff8ea';
    rr(ctx, t.x, t.y, t.w, t.h, 10);
    ctx.fill();
    ctx.strokeStyle = frac < 0.3 ? '#d94f3d' : '#d8c9a8';
    ctx.lineWidth = frac < 0.3 ? 4 : 2;
    rr(ctx, t.x, t.y, t.w, t.h, 10);
    ctx.stroke();
    // Nama hidangan + harga.
    ctx.fillStyle = '#5a2c12';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(dish.label, t.x + 16, t.y + 32);
    ctx.fillStyle = '#2a8a3a';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Rp ' + dish.base, t.x + t.w - 16, t.y + 32);
    // Ikon bahan (≤4 ikon sebaris, ~60px).
    const iconW = 60;
    const startX = t.x + 16;
    dish.ingredients.forEach((id, j) => {
      const ix = startX + j * iconW + 26;
      DRAW_ING[id](ctx, ix, t.y + 92, 0.55);
      // Ceklis bila bahan sudah di piring.
      if (s.plate.includes(id)) {
        ctx.strokeStyle = '#2a8a3a';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ix - 10, t.y + 92);
        ctx.lineTo(ix - 2, t.y + 100);
        ctx.lineTo(ix + 12, t.y + 82);
        ctx.stroke();
      }
    });
    // Bar kesabaran.
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    rr(ctx, t.x + 16, t.y + 148, t.w - 32, 14, 7);
    ctx.fill();
    ctx.fillStyle = frac > 0.5 ? '#2a8a3a' : frac > 0.3 ? '#f2c94c' : '#d94f3d';
    rr(ctx, t.x + 16, t.y + 148, (t.w - 32) * frac, 14, 7);
    ctx.fill();
    ctx.fillStyle = '#7a5a3a';
    ctx.font = '16px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Kesabaran: ' + Math.ceil(order.patience) + ' dtk', t.x + 16, t.y + 184);
  });
  // Slot kosong.
  for (let i = s.orders.length; i < RULES.ordersMax; i++) {
    const t = {
      x: L.tiket.x,
      y: L.tiket.y + i * (L.tiket.h + L.tiket.gap),
      w: L.tiket.w,
      h: L.tiket.h,
    };
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    rr(ctx, t.x, t.y, t.w, t.h, 10);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Pesanan baru datang…', t.x + t.w / 2, t.y + t.h / 2 + 6);
  }
}

function renderEndCard(ctx, s) {
  const c = LAYOUT.kartuAkhir;
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, 1280, 720);
  ctx.fillStyle = '#fff8ea';
  rr(ctx, c.x, c.y, c.w, c.h, 18);
  ctx.fill();
  ctx.strokeStyle = '#d8c9a8';
  ctx.lineWidth = 3;
  rr(ctx, c.x, c.y, c.w, c.h, 18);
  ctx.stroke();
  ctx.textAlign = 'center';
  if (s.screen === 'win') {
    ctx.fillStyle = '#2a8a3a';
    ctx.font = 'bold 40px system-ui, sans-serif';
    ctx.fillText('HARI SELESAI!', 640, c.y + 70);
    ctx.fillStyle = '#5a2c12';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('Kamu menyajikan 12 pesanan. Kerja bagus, koki!', 640, c.y + 116);
  } else {
    ctx.fillStyle = '#d94f3d';
    ctx.font = 'bold 40px system-ui, sans-serif';
    ctx.fillText('SHIFT BERAKHIR', 640, c.y + 70);
    ctx.fillStyle = '#5a2c12';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('3 pesanan hangus. Dapur tutup hari ini.', 640, c.y + 116);
  }
  ctx.fillStyle = '#5a2c12';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText('Total koin: Rp ' + s.coins, 640, c.y + 168);
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText('Pesanan disajikan: ' + s.served + '  •  Waktu: ' + Math.floor(s.time) + ' dtk', 640, c.y + 206);
  ctx.fillStyle = '#d94f3d';
  rr(ctx, 520, c.y + 240, 240, 52, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('MAIN LAGI (R)', 640, c.y + 274);
}
