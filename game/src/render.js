// Dapur Kilat v12 — semua gambar digambar dengan kode canvas.
// v12: Nasi Goreng — nasi HARUS terlihat (telur + udang kecil, di pinggir);
// Spaghetti — helai DITUMPUK rapat tanpa rongga (seperti referensi).

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
  // Butir nasi (oval kecil, putih pucat).
  ctx.fillStyle = '#fffdf6';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const bx = cx + Math.cos(a) * 12 * s;
    const by = cy - 2 * s + Math.sin(a) * 5 * s;
    ctx.beginPath();
    ctx.ellipse(bx, by, 4 * s, 2 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#3e9b4f';
  ctx.fillRect(cx - 4 * s, cy - 8 * s, 5 * s, 2 * s);
}

function drawTelur(ctx, cx, cy, s) {
  // Telur ceplok: putih organik + kuning mengilap.
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

function drawUdang(ctx, cx, cy, s) {
  // Udang pink berbentuk C: tubuh melengkung + garis segmen + ekor kipas merah.
  shadow(ctx, 'rgba(0,0,0,0.2)', 4 * s, 0, 2 * s);
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#f28b6d';
  ctx.lineWidth = 11 * s;
  ctx.beginPath();
  ctx.arc(cx, cy + 2 * s, 15 * s, Math.PI * 0.15, Math.PI * 1.75);
  ctx.stroke();
  noShadow(ctx);
  ctx.strokeStyle = '#f7b09a';
  ctx.lineWidth = 7 * s;
  ctx.beginPath();
  ctx.arc(cx, cy + 2 * s, 15 * s, Math.PI * 0.25, Math.PI * 1.65);
  ctx.stroke();
  // Garis segmen.
  ctx.strokeStyle = '#d96a4a';
  ctx.lineWidth = 1.6 * s;
  for (const a of [0.5, 0.9, 1.3, 1.7]) {
    const x1 = cx + Math.cos(a) * 10 * s;
    const y1 = cy + 2 * s + Math.sin(a) * 10 * s;
    const x2 = cx + Math.cos(a) * 20 * s;
    const y2 = cy + 2 * s + Math.sin(a) * 20 * s;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  // Ekor kipas merah (di ujung kanan atas busur).
  const tx = cx + Math.cos(Math.PI * 0.15) * 15 * s;
  const ty = cy + 2 * s + Math.sin(Math.PI * 0.15) * 15 * s;
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(tx + 12 * s, ty - 6 * s);
  ctx.lineTo(tx + 9 * s, ty + 2 * s);
  ctx.lineTo(tx + 13 * s, ty + 7 * s);
  ctx.closePath();
  ctx.fill();
  // Kilau.
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.arc(cx, cy + 2 * s, 15 * s, Math.PI * 1.1, Math.PI * 1.5);
  ctx.stroke();
}

function drawSpaghettiRaw(ctx, cx, cy, s) {
  // Ikatan stik spaghetti kering: stik panjang tipis kuning pucat, sedikit mengembang.
  shadow(ctx, 'rgba(0,0,0,0.18)', 3 * s, 0, 2 * s);
  ctx.lineCap = 'round';
  for (let i = -3; i <= 3; i++) {
    ctx.strokeStyle = i % 2 === 0 ? '#f2d98a' : '#e8c96a';
    ctx.lineWidth = 3.5 * s;
    ctx.beginPath();
    ctx.moveTo(cx + i * 5 * s, cy - 24 * s);
    ctx.lineTo(cx + i * 6 * s + (i % 2) * 2 * s, cy + 22 * s);
    ctx.stroke();
  }
  noShadow(ctx);
  ctx.fillStyle = '#d94f3d';
  ctx.fillRect(cx - 14 * s, cy - 4 * s, 28 * s, 6 * s);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(cx - 10 * s, cy - 4 * s, 3 * s, 6 * s);
}

function drawDaging(ctx, cx, cy, s) {
  // Daging mentah: potongan merah muda dengan lemak putih.
  shadow(ctx, 'rgba(0,0,0,0.2)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#c96a5a';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 24 * s, 16 * s, 0.15, 0, Math.PI * 2);
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#e8a89a';
  ctx.beginPath();
  ctx.ellipse(cx - 6 * s, cy - 4 * s, 10 * s, 6 * s, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f7ead0';
  ctx.beginPath();
  ctx.ellipse(cx + 8 * s, cy + 5 * s, 8 * s, 4 * s, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#a84a3a';
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 14 * s, cy + 2 * s);
  ctx.quadraticCurveTo(cx, cy + 8 * s, cx + 14 * s, cy - 2 * s);
  ctx.stroke();
}

function drawSaus(ctx, cx, cy, s) {
  // Mangkuk saus tomat: mangkuk putih + saus merah mengilap.
  shadow(ctx, 'rgba(0,0,0,0.2)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#f7f3e8';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 8 * s, 26 * s, 12 * s, 0, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#c93a1e';
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
}

function drawKeju(ctx, cx, cy, s) {
  // Keju: balok kuning dengan lubang + serpihan.
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
}

function drawSelada(ctx, cx, cy, s) {
  // Selada: daun hijau berombak.
  ctx.fillStyle = '#3e9b4f';
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
  ctx.strokeStyle = '#2a7a3a';
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 8 * s);
  ctx.lineTo(cx, cy + 4 * s);
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
  ctx.fillStyle = '#a85a2a';
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
  ctx.fillStyle = '#e85d3d';
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
}

function drawCucumberSlice(ctx, x, y, r) {
  ctx.fillStyle = '#3e9b4f';
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
  ctx.lineWidth = 1 * 1;
  ctx.stroke();
  ctx.restore();
}

function drawBasilLeaf(ctx, x, y, r, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#2a8a3a';
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
  ctx.restore();
}

// ---------- hidangan jadi ----------
// Nasi Goreng jadi (v12): NASI HARUS TERLIHAT.
// Gundukan nasi keemasan berbutir DOMINAN di tengah; telur ceplok KECIL
// di pinggir atas-kanan; 2 udang KECIL di tepi kiri-kanan; tomat/timun
// melengkung di depan; selada + kerupuk di pinggir.
function drawNasgorDish(ctx, cx, cy, s) {
  drawPlateBase(ctx, cx, cy, s);
  // Gundukan nasi goreng keemasan berbutir — LEBIH BESAR & dominan.
  shadow(ctx, 'rgba(0,0,0,0.15)', 4 * s, 0, 2 * s);
  const g = ctx.createRadialGradient(cx - 8 * s, cy - 6 * s, 4 * s, cx, cy + 6 * s, 54 * s);
  g.addColorStop(0, '#f2c14e');
  g.addColorStop(0.7, '#e8a83e');
  g.addColorStop(1, '#d18a26');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 6 * s, 52 * s, 24 * s, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  // Butir nasi BANYAK & JELAS di seluruh permukaan gundukan (v12: 20 butir).
  ctx.fillStyle = '#f7d774';
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 + 0.3;
    const bx = cx + Math.cos(a) * (14 + (i % 4) * 8) * s;
    const by = cy - 2 * s + Math.sin(a) * 8 * s;
    ctx.beginPath();
    ctx.ellipse(bx, by, 4.5 * s, 2.2 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  // Butir putih pucat (tekstur nasi).
  ctx.fillStyle = '#fdf6e3';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.9;
    const bx = cx + Math.cos(a) * (8 + (i % 3) * 10) * s;
    const by = cy - 6 * s + Math.sin(a) * 6 * s;
    ctx.beginPath();
    ctx.ellipse(bx, by, 3.5 * s, 2 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  // Daun bawang + cabai + telur orak-arik (taburan kecil, jangan membesar).
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
  // Udang KECIL di TEPI kiri-kanan gundukan (v12: skala 0,6, menempel di sisi).
  drawUdang(ctx, cx - 46 * s, cy + 2 * s, 0.6 * s);
  drawUdang(ctx, cx + 46 * s, cy + 2 * s, 0.6 * s);
  // Telur ceplok KECIL di pinggir ATAS-KANAN (v12: skala 0,55 — BUKAN di tengah).
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
  // Uap.
  ctx.strokeStyle = 'rgba(180,170,150,0.7)';
  ctx.lineWidth = 1.6 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 8 * s, cy - 30 * s);
  ctx.quadraticCurveTo(cx - 11 * s, cy - 36 * s, cx - 8 * s, cy - 42 * s);
  ctx.moveTo(cx + 6 * s, cy - 30 * s);
  ctx.quadraticCurveTo(cx + 9 * s, cy - 36 * s, cx + 6 * s, cy - 42 * s);
  ctx.stroke();
}

// Spaghetti Bolognese jadi (v12): HELAI DITUMPUK TANPA RONGGA.
// 10 loop elips PENUH, langkah vertikal (4,5) LEBIH KECIL dari lebar garis
// (7) — tiap helai menumpuk di atas helai di bawahnya, TIDAK ADA celah.
// Kubah tinggi padat seperti referensi; saus datar + keju + basil besar.
function drawSpaghettiDish(ctx, cx, cy, s) {
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
  // Herba hijau cincang BANYAK tersebar di seluruh sarang (v12: 14 potong).
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
  // Saus Bolognese merah DATAR di atas sarang (bukan kubah).
  shadow(ctx, 'rgba(0,0,0,0.18)', 3 * s, 0, 2 * s);
  const g = ctx.createRadialGradient(cx - 4 * s, cy - 20 * s, 2 * s, cx, cy - 16 * s, 28 * s);
  g.addColorStop(0, '#e85d3d');
  g.addColorStop(0.7, '#c93a1e');
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
  // Uap.
  ctx.strokeStyle = 'rgba(180,170,150,0.7)';
  ctx.lineWidth = 1.6 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 10 * s, cy - 36 * s);
  ctx.quadraticCurveTo(cx - 13 * s, cy - 42 * s, cx - 10 * s, cy - 48 * s);
  ctx.moveTo(cx + 8 * s, cy - 36 * s);
  ctx.quadraticCurveTo(cx + 11 * s, cy - 42 * s, cx + 8 * s, cy - 48 * s);
  ctx.stroke();
}

// Kotak kentang goreng merah (pendamping Burger — hiasan visual).
function drawFriesCarton(ctx, cx, cy, s) {
  // Stik kentang emas di belakang kotak.
  ctx.lineCap = 'round';
  for (let i = -3; i <= 3; i++) {
    const x = cx + i * 6 * s;
    ctx.strokeStyle = i % 2 === 0 ? '#f7c948' : '#eeb83a';
    ctx.lineWidth = 4.5 * s;
    ctx.beginPath();
    ctx.moveTo(x, cy - 26 * s - Math.abs(i) * -2 * s);
    ctx.lineTo(x + (i * 0.8) * s, cy + 2 * s);
    ctx.stroke();
  }
  // Kotak merah (trapesium) + garis kuning.
  shadow(ctx, 'rgba(0,0,0,0.2)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(cx - 20 * s, cy - 2 * s);
  ctx.lineTo(cx + 20 * s, cy - 2 * s);
  ctx.lineTo(cx + 16 * s, cy + 24 * s);
  ctx.lineTo(cx - 16 * s, cy + 24 * s);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#f7c948';
  ctx.fillRect(cx - 19 * s, cy + 8 * s, 38 * s, 5 * s);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillRect(cx - 16 * s, cy, 3 * s, 20 * s);
}

// Burger jadi: burger berlapis + bendera merah + kotak kentang goreng di samping.
function drawBurgerDish(ctx, cx, cy, s) {
  drawPlateBase(ctx, cx, cy, s);
  // Roti bawah.
  ctx.fillStyle = '#e8b96a';
  rr(ctx, cx - 34 * s, cy + 6 * s, 68 * s, 12 * s, 5 * s);
  ctx.fill();
  // Selada berombak.
  drawSelada(ctx, cx, cy + 4 * s, 0.9 * s);
  // Patty.
  const g = ctx.createLinearGradient(cx, cy - 8 * s, cx, cy + 8 * s);
  g.addColorStop(0, '#8a5a3b');
  g.addColorStop(1, '#6a3a22');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 36 * s, 10 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4a2410';
  ctx.lineWidth = 1.8 * s;
  for (const dx of [-20, -7, 6, 19]) {
    ctx.beginPath();
    ctx.moveTo(cx + dx * s, cy - 6 * s);
    ctx.lineTo(cx + (dx - 3) * s, cy + 6 * s);
    ctx.stroke();
  }
  // Keju meleleh.
  ctx.fillStyle = '#f7c948';
  ctx.beginPath();
  ctx.moveTo(cx - 34 * s, cy - 4 * s);
  ctx.lineTo(cx + 34 * s, cy - 4 * s);
  ctx.lineTo(cx + 30 * s, cy + 4 * s);
  ctx.quadraticCurveTo(cx + 20 * s, cy + 12 * s, cx + 12 * s, cy + 4 * s);
  ctx.quadraticCurveTo(cx, cy + 12 * s, cx - 12 * s, cy + 4 * s);
  ctx.quadraticCurveTo(cx - 22 * s, cy + 12 * s, cx - 30 * s, cy + 4 * s);
  ctx.closePath();
  ctx.fill();
  // Roti atas + wijen.
  const g2 = ctx.createLinearGradient(cx, cy - 34 * s, cx, cy - 2 * s);
  g2.addColorStop(0, '#f2c078');
  g2.addColorStop(1, '#d89a4e');
  ctx.fillStyle = g2;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 4 * s, 36 * s, 22 * s, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff6e0';
  for (const [dx, dy] of [[-18, -18], [-4, -24], [12, -18], [6, -12], [-10, -12]]) {
    ctx.beginPath();
    ctx.ellipse(cx + dx * s, cy + dy * s, 2.5 * s, 1.5 * s, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Bendera merah kecil di atas burger.
  ctx.strokeStyle = '#8a5a3b';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(cx + 10 * s, cy - 26 * s);
  ctx.lineTo(cx + 10 * s, cy - 44 * s);
  ctx.stroke();
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(cx + 10 * s, cy - 44 * s);
  ctx.lineTo(cx + 26 * s, cy - 40 * s);
  ctx.lineTo(cx + 10 * s, cy - 36 * s);
  ctx.closePath();
  ctx.fill();
  // Kotak kentang goreng di samping kanan piring.
  drawFriesCarton(ctx, cx + 58 * s, cy - 2 * s, 0.85 * s);
  // Uap.
  ctx.strokeStyle = 'rgba(180,170,150,0.7)';
  ctx.lineWidth = 1.6 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 10 * s, cy - 30 * s);
  ctx.quadraticCurveTo(cx - 13 * s, cy - 36 * s, cx - 10 * s, cy - 42 * s);
  ctx.stroke();
}

// Es Teh Manis jadi: gelas tinggi + teh + es + gula + sedotan + daun mint.
function drawEstehDish(ctx, cx, cy, s) {
  drawPlateBase(ctx, cx, cy, s);
  // Gelas tinggi.
  shadow(ctx, 'rgba(0,0,0,0.18)', 4 * s, 0, 2 * s);
  ctx.fillStyle = 'rgba(190,220,240,0.5)';
  ctx.beginPath();
  ctx.moveTo(cx - 22 * s, cy - 34 * s);
  ctx.lineTo(cx + 22 * s, cy - 34 * s);
  ctx.lineTo(cx + 17 * s, cy + 22 * s);
  ctx.lineTo(cx - 17 * s, cy + 22 * s);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  // Teh.
  ctx.fillStyle = '#a85a2a';
  ctx.beginPath();
  ctx.moveTo(cx - 20 * s, cy - 24 * s);
  ctx.lineTo(cx + 20 * s, cy - 24 * s);
  ctx.lineTo(cx + 16 * s, cy + 20 * s);
  ctx.lineTo(cx - 16 * s, cy + 20 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(cx - 16 * s, cy - 22 * s, 5 * s, 38 * s);
  // Es batu.
  ctx.fillStyle = '#bfe8ff';
  ctx.save();
  ctx.translate(cx - 6 * s, cy - 10 * s);
  ctx.rotate(0.4);
  ctx.fillRect(-6 * s, -6 * s, 12 * s, 12 * s);
  ctx.restore();
  ctx.save();
  ctx.translate(cx + 8 * s, cy + 2 * s);
  ctx.rotate(-0.3);
  ctx.fillRect(-6 * s, -6 * s, 12 * s, 12 * s);
  ctx.restore();
  // Gula larut (butir putih di dasar).
  ctx.fillStyle = '#ffffff';
  for (const [dx, dy] of [[-8, 14], [2, 16], [10, 13]]) {
    circle(ctx, cx + dx * s, cy + dy * s, 2.5 * s);
    ctx.fill();
  }
  // Sedotan merah.
  ctx.strokeStyle = '#d94f3d';
  ctx.lineWidth = 5 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + 6 * s, cy + 12 * s);
  ctx.lineTo(cx + 16 * s, cy - 44 * s);
  ctx.stroke();
  // Daun mint di tepi gelas.
  drawBasilLeaf(ctx, cx - 20 * s, cy - 34 * s, 8 * s, -0.5);
  // Tetes embun di gelas.
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (const [dx, dy] of [[-14, -6], [-10, 8], [12, -10]]) {
    circle(ctx, cx + dx * s, cy + dy * s, 2 * s);
    ctx.fill();
  }
}

const DRAW_DISH = {
  nasgor: drawNasgorDish,
  spaghetti: drawSpaghettiDish,
  burger: drawBurgerDish,
  esteh: drawEstehDish,
};

// ---------- UI ----------
function drawHeader(ctx, s) {
  const L = LAYOUT.header;
  const g = ctx.createLinearGradient(0, 0, 0, L.h);
  g.addColorStop(0, '#3a2410');
  g.addColorStop(1, '#2a1808');
  ctx.fillStyle = g;
  ctx.fillRect(L.x, L.y, L.w, L.h);
  // Judul.
  ctx.fillStyle = '#f7c948';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('🍳 Dapur Kilat', 16, L.h / 2);
  // Koin (angka tidak menutupi lingkaran Rp — teks di kanan ikon).
  ctx.fillStyle = '#f7c948';
  circle(ctx, 340, L.h / 2, 16);
  ctx.fill();
  ctx.fillStyle = '#3a2410';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Rp', 340, L.h / 2 + 1);
  ctx.fillStyle = '#fff6e0';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(String(s.coins), 364, L.h / 2);
  // Saji + kombo + waktu.
  ctx.fillStyle = '#fff6e0';
  ctx.font = '20px sans-serif';
  ctx.fillText('Saji ' + s.served + '/' + RULES.servesToWin, 520, L.h / 2);
  if (s.combo > 1) {
    ctx.fillStyle = '#f7c948';
    ctx.fillText('Kombo x' + s.combo, 660, L.h / 2);
  }
  ctx.fillStyle = '#fff6e0';
  ctx.textAlign = 'right';
  const m = Math.floor(s.time / 60);
  const sec = Math.floor(s.time % 60);
  ctx.fillText('⏱ ' + m + ':' + String(sec).padStart(2, '0'), 1264, L.h / 2);
  ctx.textAlign = 'left';
  // Strike.
  for (let i = 0; i < RULES.strikesMax; i++) {
    ctx.fillStyle = i < s.strikes ? '#d94f3d' : 'rgba(255,255,255,0.25)';
    circle(ctx, 840 + i * 28, L.h / 2, 10);
    ctx.fill();
    if (i < s.strikes) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(840 + i * 28 - 5, L.h / 2 - 5);
      ctx.lineTo(840 + i * 28 + 5, L.h / 2 + 5);
      ctx.moveTo(840 + i * 28 + 5, L.h / 2 - 5);
      ctx.lineTo(840 + i * 28 - 5, L.h / 2 + 5);
      ctx.stroke();
    }
  }
}

function drawStation(ctx, s, name, box) {
  const st = s.stations[name];
  const label = name === 'talenan' ? 'TALENAN' : 'KOMPOR';
  // Panel kayu.
  const g = ctx.createLinearGradient(box.x, box.y, box.x, box.y + box.h);
  g.addColorStop(0, '#8a5a3b');
  g.addColorStop(1, '#6a3a22');
  ctx.fillStyle = g;
  rr(ctx, box.x, box.y, box.w, box.h, 12);
  ctx.fill();
  ctx.fillStyle = '#fff6e0';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, box.x + box.w / 2, box.y + 28);
  ctx.textAlign = 'left';
  if (name === 'talenan') {
    // Talenan kayu + pisau (pisau di kanan, tidak menutupi judul).
    ctx.fillStyle = '#e8c89a';
    rr(ctx, box.x + 30, box.y + 48, 150, 110, 8);
    ctx.fill();
    ctx.strokeStyle = '#c8a878';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(box.x + 30, box.y + 80);
    ctx.lineTo(box.x + 180, box.y + 80);
    ctx.stroke();
    // Pisau di kanan talenan.
    ctx.fillStyle = '#d8d8d8';
    ctx.save();
    ctx.translate(box.x + 72 + 130, box.y + 58);
    ctx.rotate(0.5);
    ctx.fillRect(-4, -30, 8, 60);
    ctx.restore();
    ctx.fillStyle = '#3a2410';
    ctx.save();
    ctx.translate(box.x + 72 + 130, box.y + 58 + 38);
    ctx.rotate(0.5);
    ctx.fillRect(-5, 0, 10, 22);
    ctx.restore();
  } else {
    // Kompor: 2 tungku + api.
    for (const dx of [60, 170]) {
      ctx.fillStyle = '#2a1808';
      circle(ctx, box.x + dx, box.y + 110, 42);
      ctx.fill();
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(box.x + dx, box.y + 110, 42, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  if (st) {
    // Bahan sedang diolah + bar kemajuan.
    const cx = box.x + box.w / 2;
    const cy = box.y + 110;
    DRAW_ING[st.item](ctx, cx, cy, 0.7);
    const frac = st.t / st.total;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    rr(ctx, box.x + 30, box.y + box.h - 34, box.w - 60, 14, 7);
    ctx.fill();
    ctx.fillStyle = frac >= 1 ? '#3e9b4f' : '#f7c948';
    rr(ctx, box.x + 30, box.y + box.h - 34, (box.w - 60) * frac, 14, 7);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(frac >= 1 ? 'SELESAI — klik untuk ambil' : 'Mengolah… ' + Math.ceil(st.total - st.t) + ' dtk', cx, box.y + box.h - 44);
    ctx.textAlign = 'left';
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name === 'talenan' ? 'Potong udang, daging, selada & es' : 'Masak nasi, telur, spaghetti & patty', box.x + box.w / 2, box.y + 110);
    ctx.textAlign = 'left';
  }
}

function drawPlateArea(ctx, s) {
  const box = LAYOUT.piring;
  const g = ctx.createLinearGradient(box.x, box.y, box.x, box.y + box.h);
  g.addColorStop(0, '#f7ead0');
  g.addColorStop(1, '#e8d8b8');
  ctx.fillStyle = g;
  rr(ctx, box.x, box.y, box.w, box.h, 12);
  ctx.fill();
  ctx.fillStyle = '#3a2410';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PIRING', box.x + box.w / 2, box.y + 28);
  ctx.textAlign = 'left';
  const pc = LAYOUT.plateCenter;
  // Piring kosong (alas).
  ctx.fillStyle = '#f7f3ee';
  ellipse(ctx, pc.x, pc.y + 8, pc.r, pc.r * 0.4);
  ctx.fill();
  ctx.strokeStyle = '#d8d0c4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(pc.x, pc.y + 8, pc.r * 0.88, pc.r * 0.34, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Bahan di piring (≤4, melingkar).
  const n = s.plate.length;
  for (let i = 0; i < n; i++) {
    const a = (i / Math.max(1, n)) * Math.PI * 2 - Math.PI / 2;
    const x = pc.x + Math.cos(a) * 34;
    const y = pc.y + Math.sin(a) * 16;
    DRAW_ING[s.plate[i]](ctx, x, y, 0.55);
  }
  // Bila lengkap: gambar hidangan jadi (menutupi bahan mentah).
  const idx = findCompleteDish(s);
  if (idx >= 0) {
    const dishId = s.orders[idx] ? s.orders[idx].dish : null;
    if (dishId && DRAW_DISH[dishId]) DRAW_DISH[dishId](ctx, pc.x, pc.y, 0.85);
  }
}

function findCompleteDish(s) {
  for (let i = 0; i < s.orders.length; i++) {
    const dish = DISHES[s.orders[i].dish];
    if (dish.ingredients.length !== s.plate.length) continue;
    if (dish.ingredients.every((id) => s.plate.includes(id))) return i;
  }
  return -1;
}

function drawMessageAndServe(ctx, s) {
  // Hanya di layar utama (disembunyikan di layar akhir).
  if (s.screen !== 'main') return;
  const m = LAYOUT.pesan;
  ctx.fillStyle = '#fff6e0';
  rr(ctx, m.x, m.y, m.w, m.h, 10);
  ctx.fill();
  ctx.fillStyle = '#3a2410';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const msg = s.paused ? 'JEDA — tekan P untuk lanjut.' : (s.message || '');
  ctx.fillText(msg.slice(0, 60), m.x + 14, m.y + m.h / 2);
  // Tombol SAJIKAN.
  const b = LAYOUT.sajikan;
  const ready = findCompleteDish(s) >= 0;
  ctx.fillStyle = ready ? '#3e9b4f' : '#8a8a8a';
  rr(ctx, b.x, b.y, b.w, b.h, 10);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🍽 SAJIKAN (Spasi)', b.x + b.w / 2, b.y + b.h / 2);
  ctx.textAlign = 'left';
  // Teks melayang (+Rp).
  if (s.floatText) {
    ctx.fillStyle = 'rgba(62,155,79,' + Math.min(1, s.floatText.t) + ')';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.floatText.text, b.x + b.w / 2, b.y - 12 - (1.2 - s.floatText.t) * 20);
    ctx.textAlign = 'left';
  }
}

function drawCards(ctx, s) {
  const L = LAYOUT.kartu;
  const cw = (L.w - (6 - 1) * L.gap) / 6;
  for (let i = 0; i < 6; i++) {
    const id = COUNTER[i];
    const ing = INGREDIENTS[id];
    const x = L.x + i * (cw + L.gap);
    const y = L.y;
    // Kartu.
    const g = ctx.createLinearGradient(x, y, x, y + L.h);
    g.addColorStop(0, '#fffdf6');
    g.addColorStop(1, '#f7ead0');
    ctx.fillStyle = g;
    rr(ctx, x, y, cw, L.h, 12);
    ctx.fill();
    if (s.hand === id) {
      ctx.strokeStyle = '#f7c948';
      ctx.lineWidth = 4;
      rr(ctx, x + 2, y + 2, cw - 4, L.h - 4, 10);
      ctx.stroke();
    }
    // Ikon bahan.
    DRAW_ING[id](ctx, x + cw / 2, y + 90, 1.0);
    // Label + stasiun + tombol.
    ctx.fillStyle = '#3a2410';
    ctx.font = 'bold 17px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ing.label, x + cw / 2, y + 170);
    ctx.fillStyle = '#8a6a4a';
    ctx.font = '14px sans-serif';
    ctx.fillText(
      ing.station === 'siap' ? 'Siap pakai' : (ing.station === 'talenan' ? 'Talenan' : 'Kompor'),
      x + cw / 2, y + 192,
    );
    ctx.fillStyle = '#3a2410';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('[' + (i + 1) + ']', x + cw / 2, y + 214);
    ctx.textAlign = 'left';
  }
  // Tangan: bahan yang dipegang (di kanan kartu).
  if (s.hand) {
    ctx.fillStyle = '#3a2410';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Di tangan: ' + INGREDIENTS[s.hand].label, L.x + L.w, L.y - 10);
    ctx.textAlign = 'left';
  }
}

function drawFooter(ctx, s) {
  const f = LAYOUT.footer;
  ctx.fillStyle = '#2a1808';
  rr(ctx, f.x, f.y, f.w, f.h, 12);
  ctx.fill();
  ctx.fillStyle = '#f7c948';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Cara main', f.x + 16, f.y + 28);
  ctx.fillStyle = '#fff6e0';
  ctx.font = '15px sans-serif';
  ctx.fillText('Klik bahan → olah di talenan/kompor → taruh di piring → SAJIKAN.  Bahan "siap" langsung ke piring.', f.x + 16, f.y + 52);
  ctx.fillText('Spasi = sajikan  •  1–6 = ambil bahan  •  R = mulai lagi  •  P = jeda  •  3 hangus = shift berakhir.', f.x + 16, f.y + 76);
}

function drawBoard(ctx, s) {
  const p = LAYOUT.papan;
  const g = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
  g.addColorStop(0, '#4a3220');
  g.addColorStop(1, '#3a2410');
  ctx.fillStyle = g;
  rr(ctx, p.x, p.y, p.w, p.h, 12);
  ctx.fill();
  ctx.fillStyle = '#f7c948';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📋 PAPAN PESANAN', p.x + p.w / 2, p.y + 32);
  ctx.textAlign = 'left';
  for (let i = 0; i < s.orders.length; i++) {
    const o = s.orders[i];
    const dish = DISHES[o.dish];
    const t = {
      x: LAYOUT.tiket.x,
      y: LAYOUT.tiket.y + i * (LAYOUT.tiket.h + LAYOUT.tiket.gap),
      w: LAYOUT.tiket.w,
      h: LAYOUT.tiket.h,
    };
    // Tiket.
    ctx.fillStyle = '#fffdf6';
    rr(ctx, t.x, t.y, t.w, t.h, 10);
    ctx.fill();
    const frac = Math.max(0, o.patience / o.max);
    ctx.fillStyle = frac > 0.5 ? '#3e9b4f' : (frac > 0.25 ? '#f7c948' : '#d94f3d');
    rr(ctx, t.x, t.y, t.w, 8, 4);
    ctx.fill();
    // Bar kesabaran.
    ctx.fillStyle = '#e8dcc8';
    rr(ctx, t.x + 12, t.y + 24, t.w - 24, 10, 5);
    ctx.fill();
    ctx.fillStyle = frac > 0.5 ? '#3e9b4f' : (frac > 0.25 ? '#f7c948' : '#d94f3d');
    rr(ctx, t.x + 12, t.y + 24, (t.w - 24) * frac, 10, 5);
    ctx.fill();
    // Nama hidangan + harga.
    ctx.fillStyle = '#3a2410';
    ctx.font = 'bold 19px sans-serif';
    ctx.fillText(dish.label, t.x + 12, t.y + 62);
    ctx.fillStyle = '#8a6a4a';
    ctx.font = '16px sans-serif';
    ctx.fillText('Rp ' + dish.base + '  •  ' + Math.ceil(o.patience) + ' dtk', t.x + 12, t.y + 84);
    // Ikon bahan (4 dalam satu baris, ~60px tiap ikon).
    const iw = 60;
    const startX = t.x + 12;
    for (let j = 0; j < dish.ingredients.length; j++) {
      const id = dish.ingredients[j];
      const done = s.plate.includes(id);
      const ix = startX + j * iw + iw / 2;
      const iy = t.y + 140;
      if (done) {
        ctx.fillStyle = 'rgba(62,155,79,0.25)';
        circle(ctx, ix, iy, 26);
        ctx.fill();
      }
      DRAW_ING[id](ctx, ix, iy, 0.55);
      if (done) {
        ctx.strokeStyle = '#3e9b4f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ix - 8, iy);
        ctx.lineTo(ix - 2, iy + 6);
        ctx.lineTo(ix + 10, iy - 8);
        ctx.stroke();
      }
    }
  }
  if (s.orders.length === 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Belum ada pesanan…', p.x + p.w / 2, p.y + 120);
    ctx.textAlign = 'left';
  }
}

function drawTitle(ctx, s) {
  // Latar gradien hangat.
  const g = ctx.createLinearGradient(0, 0, 0, 720);
  g.addColorStop(0, '#f7c948');
  g.addColorStop(0.5, '#f2a94e');
  g.addColorStop(1, '#e8890c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1280, 720);
  // Hero: 4 hidangan jadi.
  const dishes = ['nasgor', 'spaghetti', 'burger', 'esteh'];
  const hx = [200, 480, 760, 1040];
  for (let i = 0; i < 4; i++) {
    DRAW_DISH[dishes[i]](ctx, hx[i], 300, 1.15);
  }
  // Judul.
  ctx.fillStyle = '#3a2410';
  ctx.font = 'bold 72px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🍳 Dapur Kilat', 640, 120);
  ctx.font = '26px sans-serif';
  ctx.fillStyle = '#5a3a1a';
  ctx.fillText('Masak cepat, sajikan tepat waktu — 12 pesanan, 1 hari yang menegangkan!', 640, 165);
  // Kartu instruksi (tidak menutupi tombol MULAI: iy 460, ih 56).
  ctx.fillStyle = 'rgba(255,253,246,0.95)';
  rr(ctx, 340, 460, 600, 56, 12);
  ctx.fill();
  ctx.fillStyle = '#3a2410';
  ctx.font = '18px sans-serif';
  ctx.fillText('Klik bahan → olah → rakit di piring → SAJIKAN sebelum hangus!', 640, 494);
  // Tombol MULAI.
  const b = LAYOUT.tombolJudul;
  ctx.fillStyle = '#3e9b4f';
  rr(ctx, b.x, b.y, b.w, b.h, 14);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('▶ MULAI MASAK', b.x + b.w / 2, b.y + b.h / 2 + 2);
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#5a3a1a';
  ctx.fillText('Spasi / Enter juga bisa  •  R = mulai lagi  •  P = jeda', 640, 620);
  ctx.textAlign = 'left';
}

function drawEnd(ctx, s) {
  // Latar gelap transparan di atas permainan.
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, 1280, 720);
  const c = LAYOUT.kartuAkhir;
  ctx.fillStyle = '#fffdf6';
  rr(ctx, c.x, c.y, c.w, c.h, 16);
  ctx.fill();
  const win = s.screen === 'win';
  ctx.fillStyle = win ? '#3e9b4f' : '#d94f3d';
  ctx.font = 'bold 38px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(win ? '🎉 Hari Selesai!' : '💔 Shift Berakhir', c.x + c.w / 2, c.y + 70);
  ctx.fillStyle = '#3a2410';
  ctx.font = '22px sans-serif';
  ctx.fillText(win ? 'Semua 12 pesanan tersaji. Kerja bagus, Chef!' : 'Tiga pesanan hangus. Coba lagi, Chef!', c.x + c.w / 2, c.y + 112);
  ctx.font = 'bold 30px sans-serif';
  ctx.fillStyle = '#f7c948';
  ctx.fillText('Total: Rp ' + s.coins, c.x + c.w / 2, c.y + 160);
  ctx.fillStyle = '#8a6a4a';
  ctx.font = '18px sans-serif';
  ctx.fillText('Pesanan disajikan: ' + s.served + '/' + RULES.servesToWin + '  •  Kombo tertinggi: x' + Math.max(1, s.combo), c.x + c.w / 2, c.y + 196);
  ctx.fillStyle = '#3e9b4f';
  rr(ctx, c.x + 130, c.y + 230, 300, 56, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('↻ MAIN LAGI (R)', c.x + c.w / 2, c.y + 266);
  ctx.textAlign = 'left';
}

// ---------- render utama ----------
export function render(ctx, s) {
  ctx.clearRect(0, 0, 1280, 720);
  if (s.screen === 'title') {
    drawTitle(ctx, s);
    return;
  }
  // Latar dapur.
  const g = ctx.createLinearGradient(0, 0, 0, 720);
  g.addColorStop(0, '#f6ead2');
  g.addColorStop(1, '#e8d8b8');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1280, 720);
  drawHeader(ctx, s);
  drawStation(ctx, s, 'talenan', LAYOUT.talenan);
  drawStation(ctx, s, 'kompor', LAYOUT.kompor);
  drawPlateArea(ctx, s);
  drawMessageAndServe(ctx, s);
  drawCards(ctx, s);
  drawFooter(ctx, s);
  drawBoard(ctx, s);
  if (s.screen === 'win' || s.screen === 'over') drawEnd(ctx, s);
  if (s.paused && s.screen === 'main') {
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, 1280, 720);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⏸ JEDA', 640, 360);
    ctx.font = '22px sans-serif';
    ctx.fillText('Tekan P untuk lanjut', 640, 400);
    ctx.textAlign = 'left';
  }
}
