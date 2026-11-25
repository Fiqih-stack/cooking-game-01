// Dapur Kilat v11 — semua gambar (canvas 2D, tanpa aset luar).
// Makanan digambar dengan kode mengikuti referensi Fiqih.
// v11: spaghetti matang = sarang melingkar rapih;
// tomat+timun Nasi Goreng = melengkung mengikuti sisi nasi.
import { COLORS, DISHES, INGREDIENTS, LAYOUT, STATION_COLOR, STATION_LABEL } from './config.js';
import { plateDish } from './state.js';

// ---------- util ----------
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

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

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

// ---------- ikon bahan (digambar di (cx, cy), skala s; s=1 ~ 56px) ----------
function drawNasi(ctx, cx, cy, s) {
  // NASI PUTIH POLOS di piring datar: gundukan putih bersih + butir + uap.
  shadow(ctx, 'rgba(0,0,0,0.18)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#f7f3e8';
  ellipse(ctx, cx, cy + 10 * s, 26 * s, 8 * s);
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#ffffff';
  ellipse(ctx, cx, cy + 4 * s, 22 * s, 12 * s);
  ctx.fill();
  // Butir nasi (oval kecil, putih pucat).
  ctx.fillStyle = '#efe9d8';
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const bx = cx + Math.cos(a) * 13 * s;
    const by = cy + 4 * s + Math.sin(a) * 6 * s;
    ctx.beginPath();
    ctx.ellipse(bx, by, 4.5 * s, 2.2 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.5;
    const bx = cx + Math.cos(a) * 8 * s;
    const by = cy - 2 * s + Math.sin(a) * 4 * s;
    ctx.beginPath();
    ctx.ellipse(bx, by, 3.5 * s, 1.8 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  // Uap.
  ctx.strokeStyle = 'rgba(180,170,150,0.7)';
  ctx.lineWidth = 1.6 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 6 * s, cy - 12 * s);
  ctx.quadraticCurveTo(cx - 9 * s, cy - 18 * s, cx - 6 * s, cy - 24 * s);
  ctx.moveTo(cx + 5 * s, cy - 12 * s);
  ctx.quadraticCurveTo(cx + 8 * s, cy - 18 * s, cx + 5 * s, cy - 24 * s);
  ctx.stroke();
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
  for (let i = -4; i <= 4; i++) {
    const spread = i * 3.2 * s;
    const topX = cx + spread * 1.6;
    const botX = cx + spread * 0.7;
    ctx.strokeStyle = i % 2 === 0 ? '#f2cf6b' : '#e8bd45';
    ctx.lineWidth = 3.2 * s;
    ctx.beginPath();
    ctx.moveTo(topX, cy - 24 * s);
    ctx.lineTo(botX, cy + 22 * s);
    ctx.stroke();
  }
  noShadow(ctx);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 8 * s, cy - 20 * s);
  ctx.lineTo(cx - 9 * s, cy + 18 * s);
  ctx.stroke();
}

function drawDaging(ctx, cx, cy, s) {
  // Daging cincang: gumpalan cokelat bertekstur remah.
  shadow(ctx, 'rgba(0,0,0,0.2)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#8a4b2a';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 4 * s, 22 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#a85f36';
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.4;
    circle(ctx, cx + Math.cos(a) * 12 * s, cy + 4 * s + Math.sin(a) * 7 * s, 5 * s);
    ctx.fill();
  }
  ctx.fillStyle = '#6e3a1e';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 1.1;
    circle(ctx, cx + Math.cos(a) * 7 * s, cy + 3 * s + Math.sin(a) * 4 * s, 2.6 * s);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  circle(ctx, cx - 6 * s, cy - 2 * s, 3 * s);
  ctx.fill();
}

function drawSaus(ctx, cx, cy, s) {
  // Mangkuk kecil berisi saus tomat merah.
  shadow(ctx, 'rgba(0,0,0,0.2)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#f7ead0';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 8 * s, 24 * s, 14 * s, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillRect(cx - 24 * s, cy + 6 * s, 48 * s, 4 * s);
  noShadow(ctx);
  const g = ctx.createRadialGradient(cx - 4 * s, cy - 2 * s, 2 * s, cx, cy + 6 * s, 22 * s);
  g.addColorStop(0, '#e85d3d');
  g.addColorStop(0.7, '#c93a1e');
  g.addColorStop(1, '#a82c14');
  ctx.fillStyle = g;
  ellipse(ctx, cx, cy + 4 * s, 21 * s, 7 * s);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ellipse(ctx, cx - 7 * s, cy + 2 * s, 6 * s, 2.2 * s);
  ctx.fill();
  ctx.fillStyle = '#8a2a12';
  circle(ctx, cx + 6 * s, cy + 5 * s, 2.4 * s);
  ctx.fill();
  circle(ctx, cx - 1 * s, cy + 7 * s, 1.8 * s);
  ctx.fill();
}

function drawKeju(ctx, cx, cy, s) {
  // Irisan keju kuning: persegi sudut membulat + lubang + tepi meleleh.
  shadow(ctx, 'rgba(0,0,0,0.18)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#f7c948';
  rr(ctx, cx - 20 * s, cy - 18 * s, 40 * s, 36 * s, 6 * s);
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#e8a90c';
  circle(ctx, cx - 8 * s, cy - 6 * s, 4 * s);
  ctx.fill();
  circle(ctx, cx + 9 * s, cy + 4 * s, 5 * s);
  ctx.fill();
  circle(ctx, cx + 2 * s, cy - 11 * s, 3 * s);
  ctx.fill();
  ctx.fillStyle = '#ffe9a8';
  ctx.fillRect(cx - 16 * s, cy - 14 * s, 8 * s, 3 * s);
}

function drawRoti(ctx, cx, cy, s) {
  // Roti burger: kubah atas berwijen + alas datar.
  shadow(ctx, 'rgba(0,0,0,0.18)', 4 * s, 0, 2 * s);
  const g = ctx.createLinearGradient(cx, cy - 20 * s, cx, cy + 4 * s);
  g.addColorStop(0, '#f2b95e');
  g.addColorStop(1, '#dd9426');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 2 * s, 23 * s, 15 * s, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#fff6e0';
  for (const [dx, dy] of [[-10, -10], [0, -14], [10, -10], [-4, -6], [6, -6]]) {
    ctx.beginPath();
    ctx.ellipse(cx + dx * s, cy + dy * s, 2.2 * s, 1.4 * s, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#e8a83e';
  rr(ctx, cx - 22 * s, cy + 12 * s, 44 * s, 9 * s, 4 * s);
  ctx.fill();
}

function drawPatty(ctx, cx, cy, s) {
  // Patty daging: oval cokelat gelap + bekas panggang + highlight.
  shadow(ctx, 'rgba(0,0,0,0.22)', 4 * s, 0, 2 * s);
  ctx.fillStyle = '#5a3018';
  ellipse(ctx, cx, cy + 2 * s, 24 * s, 13 * s);
  ctx.fill();
  noShadow(ctx);
  ctx.strokeStyle = '#3a1e0c';
  ctx.lineWidth = 2.4 * s;
  for (const dx of [-12, -4, 4, 12]) {
    ctx.beginPath();
    ctx.moveTo(cx + dx * s - 4 * s, cy - 6 * s);
    ctx.lineTo(cx + dx * s + 4 * s, cy + 10 * s);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ellipse(ctx, cx - 8 * s, cy - 3 * s, 8 * s, 3 * s);
  ctx.fill();
}

function drawSelada(ctx, cx, cy, s) {
  // Daun selada hijau bergelombang + urat tengah terang.
  shadow(ctx, 'rgba(0,0,0,0.15)', 3 * s, 0, 2 * s);
  ctx.fillStyle = '#58b368';
  ctx.beginPath();
  ctx.moveTo(cx - 22 * s, cy + 4 * s);
  ctx.quadraticCurveTo(cx - 18 * s, cy - 16 * s, cx, cy - 14 * s);
  ctx.quadraticCurveTo(cx + 18 * s, cy - 16 * s, cx + 22 * s, cy + 4 * s);
  ctx.quadraticCurveTo(cx + 12 * s, cy + 12 * s, cx, cy + 10 * s);
  ctx.quadraticCurveTo(cx - 12 * s, cy + 12 * s, cx - 22 * s, cy + 4 * s);
  ctx.fill();
  noShadow(ctx);
  ctx.strokeStyle = '#a8e0ae';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 12 * s);
  ctx.lineTo(cx, cy + 8 * s);
  ctx.stroke();
  ctx.fillStyle = '#3e9b4f';
  for (const dx of [-12, -5, 5, 12]) {
    ctx.beginPath();
    ctx.ellipse(cx + dx * s, cy - 4 * s, 4 * s, 2 * s, dx > 0 ? 0.5 : -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTeh(ctx, cx, cy, s) {
  // Es teh: gelas tinggi melengkung + teh amber + es + lemon + sedotan merah.
  shadow(ctx, 'rgba(0,0,0,0.2)', 4 * s, 0, 2 * s);
  const g = ctx.createLinearGradient(cx, cy - 22 * s, cx, cy + 24 * s);
  g.addColorStop(0, '#e8a33d');
  g.addColorStop(0.6, '#c97a1e');
  g.addColorStop(1, '#8a4d12');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(cx - 15 * s, cy - 22 * s);
  ctx.quadraticCurveTo(cx - 17 * s, cy + 10 * s, cx - 12 * s, cy + 24 * s);
  ctx.lineTo(cx + 12 * s, cy + 24 * s);
  ctx.quadraticCurveTo(cx + 17 * s, cy + 10 * s, cx + 15 * s, cy - 22 * s);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  // Kubus es.
  ctx.fillStyle = 'rgba(200,230,245,0.9)';
  for (const [dx, dy, r] of [[-7, -8, 0.3], [6, -2, -0.2], [-2, 8, 0.5]]) {
    ctx.save();
    ctx.translate(cx + dx * s, cy + dy * s);
    ctx.rotate(r);
    ctx.fillRect(-5 * s, -5 * s, 10 * s, 10 * s);
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillRect(cx - 10 * s, cy - 4 * s, 3 * s, 3 * s);
  ctx.fillRect(cx + 4 * s, cy + 6 * s, 2.5 * s, 2.5 * s);
  // Irisan lemon di bibir gelas.
  ctx.fillStyle = '#ffe066';
  circle(ctx, cx + 13 * s, cy - 20 * s, 6 * s);
  ctx.fill();
  ctx.fillStyle = '#fff6c8';
  circle(ctx, cx + 13 * s, cy - 20 * s, 4 * s);
  ctx.fill();
  // Sedotan merah.
  ctx.strokeStyle = '#d94f3d';
  ctx.lineWidth = 4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + 8 * s, cy - 28 * s);
  ctx.lineTo(cx + 4 * s, cy - 6 * s);
  ctx.stroke();
  // Embun + highlight gelas.
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(cx - 12 * s, cy - 16 * s, 2.5 * s, 30 * s);
}

function drawEs(ctx, cx, cy, s) {
  // 2-3 kubus es translusen biru muda + sparkle.
  shadow(ctx, 'rgba(0,0,0,0.15)', 3 * s, 0, 2 * s);
  ctx.fillStyle = 'rgba(180,220,245,0.92)';
  for (const [dx, dy, r] of [[-8, 2, 0.3], [6, -6, -0.25], [4, 10, 0.5]]) {
    ctx.save();
    ctx.translate(cx + dx * s, cy + dy * s);
    ctx.rotate(r);
    ctx.fillRect(-8 * s, -8 * s, 16 * s, 16 * s);
    ctx.restore();
  }
  noShadow(ctx);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (const [dx, dy] of [[-10, -4], [8, -10], [2, 4]]) {
    ctx.beginPath();
    ctx.moveTo(cx + dx * s, cy + dy * s - 3 * s);
    ctx.lineTo(cx + dx * s + 1.5 * s, cy + dy * s);
    ctx.lineTo(cx + dx * s, cy + dy * s + 3 * s);
    ctx.lineTo(cx + dx * s - 1.5 * s, cy + dy * s);
    ctx.closePath();
    ctx.fill();
  }
}

function drawGula(ctx, cx, cy, s) {
  // 2 kubus gula putih bertumpuk + sparkle.
  shadow(ctx, 'rgba(0,0,0,0.15)', 3 * s, 0, 2 * s);
  ctx.fillStyle = '#ffffff';
  ctx.save();
  ctx.translate(cx - 4 * s, cy + 6 * s);
  ctx.rotate(-0.12);
  ctx.fillRect(-10 * s, -10 * s, 20 * s, 20 * s);
  ctx.restore();
  ctx.save();
  ctx.translate(cx + 7 * s, cy - 8 * s);
  ctx.rotate(0.18);
  ctx.fillRect(-9 * s, -9 * s, 18 * s, 18 * s);
  ctx.restore();
  noShadow(ctx);
  ctx.strokeStyle = '#d8d0c0';
  ctx.lineWidth = 1.2 * s;
  ctx.strokeRect(cx - 14 * s, cy - 4 * s, 20 * s, 20 * s);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  circle(ctx, cx + 10 * s, cy - 14 * s, 2 * s);
  ctx.fill();
}

export const INGREDIENT_DRAW = {
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

// ---------- hidangan jadi (digambar di (cx, cy), skala s) ----------
function drawPlateBase(ctx, cx, cy, s) {
  shadow(ctx, 'rgba(0,0,0,0.16)', 5 * s, 0, 3 * s);
  ctx.fillStyle = '#fdfdf8';
  ellipse(ctx, cx, cy + 14 * s, 72 * s, 24 * s);
  ctx.fill();
  noShadow(ctx);
  ctx.strokeStyle = '#e3dcc8';
  ctx.lineWidth = 1.5 * s;
  ellipse(ctx, cx, cy + 14 * s, 66 * s, 20 * s);
  ctx.stroke();
}

function drawTomatoSlice(ctx, x, y, r) {
  ctx.fillStyle = '#e84a2f';
  circle(ctx, x, y, r);
  ctx.fill();
  ctx.fillStyle = '#f77b5e';
  circle(ctx, x, y, r * 0.72);
  ctx.fill();
  ctx.strokeStyle = '#d9381e';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62);
    ctx.stroke();
  }
  ctx.fillStyle = '#ffd9c8';
  circle(ctx, x - r * 0.25, y - r * 0.25, r * 0.16);
  ctx.fill();
}

function drawCucumberSlice(ctx, x, y, r) {
  ctx.fillStyle = '#3e9b4f';
  circle(ctx, x, y, r);
  ctx.fill();
  ctx.fillStyle = '#cfeec8';
  circle(ctx, x, y, r * 0.68);
  ctx.fill();
  ctx.fillStyle = '#9ed69a';
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.7;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, r * 0.16, r * 0.1, a, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawKerupuk(ctx, x, y, r, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 0.82, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(210,190,150,0.5)';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.9;
    circle(ctx, Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.45, r * 0.08);
    ctx.fill();
  }
  ctx.restore();
}

function drawBasilLeaf(ctx, x, y, r, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#3e9b4f';
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r * 0.85, -r * 0.2, 0, r);
  ctx.quadraticCurveTo(-r * 0.85, -r * 0.2, 0, -r);
  ctx.fill();
  ctx.strokeStyle = '#a8e0ae';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.8);
  ctx.lineTo(0, r * 0.8);
  ctx.stroke();
  ctx.restore();
}

// Nasi Goreng jadi: nasi keemasan + telur di tengah + udang + tomat/timun
// MELENGKUNG mengikuti sisi gundukan (busur, BUKAN garis lurus) + kerupuk.
function drawNasgorDish(ctx, cx, cy, s) {
  drawPlateBase(ctx, cx, cy, s);
  // Gundukan nasi goreng keemasan berbutir.
  shadow(ctx, 'rgba(0,0,0,0.15)', 4 * s, 0, 2 * s);
  const g = ctx.createRadialGradient(cx - 8 * s, cy - 6 * s, 4 * s, cx, cy + 6 * s, 52 * s);
  g.addColorStop(0, '#f2c14e');
  g.addColorStop(0.7, '#e8a83e');
  g.addColorStop(1, '#d18a26');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 6 * s, 48 * s, 22 * s, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  // Butir + daun bawang + cabai + telur orak-arik di nasi.
  ctx.fillStyle = '#f7d774';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + 0.3;
    const bx = cx + Math.cos(a) * (20 + (i % 3) * 8) * s;
    const by = cy - 2 * s + Math.sin(a) * 7 * s;
    ctx.beginPath();
    ctx.ellipse(bx, by, 4 * s, 2 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#3e9b4f';
  for (const [dx, dy] of [[-24, -6], [14, -10], [28, 2], [-6, 2]]) {
    ctx.fillRect(cx + dx * s, cy + dy * s, 5 * s, 2.4 * s);
  }
  ctx.fillStyle = '#d94f3d';
  for (const [dx, dy] of [[-14, 0], [22, -4]]) {
    ctx.beginPath();
    ctx.ellipse(cx + dx * s, cy + dy * s, 4 * s, 2 * s, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffe066';
  for (const [dx, dy] of [[-30, 4], [8, -12], [34, 6]]) {
    ctx.beginPath();
    ctx.ellipse(cx + dx * s, cy + dy * s, 4.5 * s, 3 * s, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Udang pink berbentuk C (kiri + kanan gundukan).
  drawUdang(ctx, cx - 30 * s, cy - 2 * s, 0.85 * s);
  drawUdang(ctx, cx + 30 * s, cy - 2 * s, 0.85 * s);
  // Telur ceplok TEPAT DI TENGAH.
  drawTelur(ctx, cx, cy - 14 * s, 0.95 * s);
  // Tomat 3 + timun 3 MELENGKUNG mengikuti sisi gundukan nasi (busur).
  // Busur elips di depan gundukan: sudut 0.15..(pi-0.15), jari-jari elips (56, 24)
  // — ujung busur naik ke sisi gundukan, tengahnya turun, jadi bulan sabit jelas.
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

// Spaghetti Bolognese jadi (v11): SARANG MELINGKAR RAPIH — loop konsentris
// tersusun jadi gundukan tinggi, BUKAN helai memanjang/menyebar.
// + saus Bolognese merah DATAR + keju + basil hijau di atas.
function drawSpaghettiDish(ctx, cx, cy, s) {
  drawPlateBase(ctx, cx, cy, s);
  // Sarang: 5 loop konsentris (elips) membentuk kubah, dari lebar (bawah)
  // ke sempit (atas). Tiap loop hampir penuh dengan celah kecil di sudut
  // berbeda — terasa seperti lilitan, bukan tumpukan cincin.
  ctx.lineCap = 'round';
  const loops = 5;
  for (let i = 0; i < loops; i++) {
    const t = i / (loops - 1); // 0 = bawah, 1 = atas
    const rx = (48 - t * 24) * s;
    const ry = (13 - t * 4) * s;
    const y = cy + 12 * s - t * 30 * s;
    const gapA = 0.6 + i * 1.1; // celah berputar tiap loop
    ctx.strokeStyle = i % 2 === 0 ? '#f2c94c' : '#eec14a';
    ctx.lineWidth = 5.5 * s;
    ctx.beginPath();
    ctx.ellipse(cx, y, rx, ry, 0, gapA, gapA + Math.PI * 1.85);
    ctx.stroke();
    // Kilau di atas tiap loop.
    ctx.strokeStyle = 'rgba(255,240,180,0.85)';
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.ellipse(cx, y - 1.5 * s, rx * 0.96, ry * 0.9, 0, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // Potongan herba hijau tersebar di sarang.
  ctx.fillStyle = '#3e9b4f';
  for (const [dx, dy, r] of [[-26, 2, 0.4], [-8, -8, -0.3], [12, 4, 0.5], [26, -4, -0.4], [-2, 10, 0.2], [18, -12, 0.6]]) {
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
  // Taburan keju (serpihan putih) + basil hijau di atas saus.
  ctx.fillStyle = '#fff6e0';
  for (const [dx, dy, r] of [[-14, -18, 0.4], [-4, -14, -0.3], [8, -18, 0.5], [16, -15, -0.4]]) {
    ctx.save();
    ctx.translate(cx + dx * s, cy + dy * s);
    ctx.rotate(r);
    ctx.fillRect(-3 * s, -1 * s, 6 * s, 2 * s);
    ctx.restore();
  }
  drawBasilLeaf(ctx, cx - 4 * s, cy - 26 * s, 9 * s, -0.25);
  drawBasilLeaf(ctx, cx + 8 * s, cy - 24 * s, 7.5 * s, 0.5);
  // Uap.
  ctx.strokeStyle = 'rgba(180,170,150,0.7)';
  ctx.lineWidth = 1.6 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 10 * s, cy - 32 * s);
  ctx.quadraticCurveTo(cx - 13 * s, cy - 38 * s, cx - 10 * s, cy - 44 * s);
  ctx.moveTo(cx + 8 * s, cy - 32 * s);
  ctx.quadraticCurveTo(cx + 11 * s, cy - 38 * s, cx + 8 * s, cy - 44 * s);
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
  // Burger (kiri tengah piring).
  const bx = cx - 18 * s;
  const by = cy + 2 * s;
  shadow(ctx, 'rgba(0,0,0,0.2)', 4 * s, 0, 2 * s);
  // Roti bawah.
  ctx.fillStyle = '#e8a83e';
  rr(ctx, bx - 24 * s, by + 8 * s, 48 * s, 9 * s, 4 * s);
  ctx.fill();
  // Selada (menjulur).
  ctx.fillStyle = '#58b368';
  ctx.beginPath();
  ctx.ellipse(bx, by + 6 * s, 26 * s, 5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Tomat.
  ctx.fillStyle = '#e84a2f';
  rr(ctx, bx - 22 * s, by + 2 * s, 44 * s, 5 * s, 2 * s);
  ctx.fill();
  // Patty.
  ctx.fillStyle = '#5a3018';
  ellipse(ctx, bx, by - 2 * s, 25 * s, 8 * s);
  ctx.fill();
  // Keju meleleh (bergelombang).
  ctx.fillStyle = '#f7c948';
  ctx.beginPath();
  ctx.moveTo(bx - 24 * s, by - 8 * s);
  ctx.lineTo(bx + 24 * s, by - 8 * s);
  ctx.lineTo(bx + 24 * s, by - 4 * s);
  for (let i = 0; i < 4; i++) {
    ctx.quadraticCurveTo(bx + 18 * s - i * 12 * s, by + 2 * s, bx + 12 * s - i * 12 * s, by - 4 * s);
  }
  ctx.closePath();
  ctx.fill();
  // Roti atas berwijen.
  const g = ctx.createLinearGradient(bx, by - 26 * s, bx, by - 8 * s);
  g.addColorStop(0, '#f2b95e');
  g.addColorStop(1, '#dd9426');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(bx, by - 8 * s, 24 * s, 14 * s, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  noShadow(ctx);
  ctx.fillStyle = '#fff6e0';
  for (const [dx, dy] of [[-11, -18], [0, -21], [11, -18], [-5, -13], [6, -13]]) {
    ctx.beginPath();
    ctx.ellipse(bx + dx * s, by + dy * s, 2 * s, 1.3 * s, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  // Bendera merah kecil di atas burger.
  ctx.strokeStyle = '#8a5f33';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(bx, by - 22 * s);
  ctx.lineTo(bx, by - 38 * s);
  ctx.stroke();
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(bx, by - 38 * s);
  ctx.lineTo(bx + 13 * s, by - 34 * s);
  ctx.lineTo(bx, by - 30 * s);
  ctx.closePath();
  ctx.fill();
  // Kentang goreng (kotak merah) di samping kanan burger.
  drawFriesCarton(ctx, cx + 44 * s, cy - 2 * s, 0.9 * s);
}

// Es Teh jadi: gelas besar + es + lemon + sedotan (pakai drawTeh skala besar).
function drawEsTehDish(ctx, cx, cy, s) {
  drawPlateBase(ctx, cx, cy, s);
  drawTeh(ctx, cx, cy - 2 * s, 1.15 * s);
}

export const DISH_DRAW = {
  nasgor: drawNasgorDish,
  spaghetti: drawSpaghettiDish,
  burger: drawBurgerDish,
  esteh: drawEsTehDish,
};

// ---------- dinding, header, stasiun, piring ----------
function drawWall(ctx, t) {
  ctx.fillStyle = COLORS.wall;
  ctx.fillRect(0, 0, 1280, 720);
  ctx.strokeStyle = COLORS.wallLine;
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1280; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 720);
    ctx.stroke();
  }
  for (let y = 0; y <= 720; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1280, y);
    ctx.stroke();
  }
  // Rak kayu + 3 toples di atas.
  ctx.fillStyle = COLORS.wood;
  ctx.fillRect(0, 52, 1280, 12);
  ctx.fillStyle = COLORS.woodDark;
  ctx.fillRect(0, 62, 1280, 3);
  const jars = ['#f7c948', '#58b368', '#d94f3d'];
  jars.forEach((c, i) => {
    const x = 210 + i * 110;
    ctx.fillStyle = c;
    rr(ctx, x, 12, 46, 40, 6);
    ctx.fill();
    ctx.fillStyle = '#4a2c14';
    ctx.fillRect(x + 8, 6, 30, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(x + 8, 18, 5, 26);
  });
}

function drawHeader(ctx, s) {
  const h = LAYOUT.header;
  const g = ctx.createLinearGradient(0, 0, 0, h.h);
  g.addColorStop(0, '#6b4423');
  g.addColorStop(1, '#4a2c14');
  ctx.fillStyle = g;
  ctx.fillRect(h.x, h.y, h.w, h.h);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(h.x, h.y + h.h - 3, h.w, 3);
  // Logo + judul.
  ctx.fillStyle = '#f7c948';
  circle(ctx, 28, 32, 15);
  ctx.fill();
  ctx.fillStyle = '#4a2c14';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Q', 28, 33);
  ctx.fillStyle = '#fff6e0';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('DAPUR KILAT', 52, 33);
  // Koin: lingkaran 'Rp' di x=540, angka kiri-rata mulai x=562.
  ctx.fillStyle = '#f7c948';
  circle(ctx, 540, 32, 15);
  ctx.fill();
  ctx.fillStyle = '#4a2c14';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Rp', 540, 33);
  ctx.fillStyle = '#fff6e0';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(String(s.coins), 562, 33);
  // Tersaji / kombo / waktu.
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(`Tersaji ${s.served}/12`, 690, 33);
  ctx.fillStyle = s.combo > 0 ? '#f7c948' : '#d8c8a8';
  ctx.fillText(`Kombo x${s.combo}`, 850, 33);
  ctx.fillStyle = '#fff6e0';
  const m = Math.floor(s.elapsed / 60);
  const sec = Math.floor(s.elapsed % 60);
  ctx.fillText(`Waktu ${m}:${String(sec).padStart(2, '0')}`, 1010, 33);
  // Titik strike (3) di kanan.
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < s.strikes ? '#d94f3d' : 'rgba(255,255,255,0.35)';
    circle(ctx, 1196 + i * 24, 32, 7);
    ctx.fill();
  }
}

function panel(ctx, r, title) {
  ctx.fillStyle = COLORS.panel;
  rr(ctx, r.x, r.y, r.w, r.h, 12);
  ctx.fill();
  ctx.strokeStyle = COLORS.panelBorder;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = COLORS.ink;
  ctx.font = 'bold 17px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(title, r.x + 12, r.y + 24);
}

function drawStation(ctx, s, kind, label, t) {
  const r = LAYOUT[kind];
  panel(ctx, r, label);
  const st = s.stations[kind];
  if (kind === 'talenan') {
    // Papan talenan kayu + pisau.
    ctx.fillStyle = '#e8c88f';
    rr(ctx, r.x + 12, r.y + 34, r.w - 24, r.h - 82, 8);
    ctx.fill();
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 1.5;
    for (let i = 1; i <= 3; i++) {
      const y = r.y + 34 + ((r.h - 82) * i) / 4;
      ctx.beginPath();
      ctx.moveTo(r.x + 20, y);
      ctx.lineTo(r.x + r.w - 20, y);
      ctx.stroke();
    }
    // Pisau naik-turun (animasi) — di bawah judul, tidak menutupi teks.
    const ky = r.y + 58 + Math.sin(t * 3) * 5;
    ctx.save();
    ctx.translate(r.x + 72, ky);
    ctx.rotate(-0.6);
    ctx.fillStyle = '#d8d8d8';
    rr(ctx, 0, 0, 46, 10, 3);
    ctx.fill();
    ctx.fillStyle = '#4a2c14';
    ctx.fillRect(46, 1, 18, 8);
    ctx.restore();
    if (st) {
      const ing = INGREDIENTS[st.item];
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(r.x + r.w / 2, r.y + 34 + (r.h - 82) / 2, 60, 34, 0, 0, Math.PI * 2);
      ctx.clip();
      INGREDIENT_DRAW[st.item](ctx, r.x + r.w / 2, r.y + 34 + (r.h - 82) / 2 - 4, 0.9);
      ctx.restore();
    }
  } else {
    // Kompor: panel hitam + 2 tungku.
    ctx.fillStyle = '#2b2b2b';
    rr(ctx, r.x + 12, r.y + 34, r.w - 24, r.h - 82, 8);
    ctx.fill();
    for (const bx of [r.x + r.w / 2 - 58, r.x + r.w / 2 + 58]) {
      ctx.fillStyle = '#1a1a1a';
      ellipse(ctx, bx, r.y + 34 + (r.h - 82) / 2, 52, 34);
      ctx.fill();
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 2;
      ellipse(ctx, bx, r.y + 34 + (r.h - 82) / 2, 40, 24);
      ctx.stroke();
      // Percikan sizzle saat ada yang dimasak.
      if (st) {
        ctx.fillStyle = '#f7c948';
        for (let i = 0; i < 3; i++) {
          const a = t * 4 + i * 2.1;
          circle(ctx, bx + Math.cos(a) * 26, r.y + 34 + (r.h - 82) / 2 + Math.sin(a) * 14, 2);
          ctx.fill();
        }
      }
    }
    if (st) {
      const midY = r.y + 34 + (r.h - 82) / 2;
      INGREDIENT_DRAW[st.item](ctx, r.x + r.w / 2, midY - 6, 0.85);
    } else {
      ctx.fillStyle = '#888';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('— kosong —', r.x + r.w / 2 - 58, r.y + 34 + (r.h - 82) / 2 + 5);
      ctx.fillText('— kosong —', r.x + r.w / 2 + 58, r.y + 34 + (r.h - 82) / 2 + 5);
    }
  }
  // Bilah kemajuan + teks status (dengan ruang, tidak menempel tepi bawah).
  const barY = r.y + r.h - 34;
  ctx.fillStyle = COLORS.barBg;
  rr(ctx, r.x + 12, barY, r.w - 24, 10, 5);
  ctx.fill();
  if (st) {
    const frac = st.total > 0 ? Math.min(1, st.t / st.total) : 0;
    ctx.fillStyle = COLORS.barGood;
    rr(ctx, r.x + 12, barY, Math.max(10, (r.w - 24) * frac), 10, 5);
    ctx.fill();
  }
  ctx.fillStyle = COLORS.inkSoft;
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  const sub = st
    ? `${INGREDIENTS[st.item].name} sedang diolah…`
    : kind === 'talenan'
      ? 'Potong udang, daging, selada & es'
      : 'Masak nasi, telur, spaghetti & patty';
  ctx.fillText(sub, r.x + r.w / 2, barY + 20);
}

function drawPlateArea(ctx, s, t) {
  const r = LAYOUT.piring;
  panel(ctx, r, 'PIRING');
  const cx = LAYOUT.plateCenter.x;
  const cy = LAYOUT.plateCenter.y;
  const dish = plateDish(s);
  if (dish) {
    // Piring lengkap: gambar hidangan jadi.
    DISH_DRAW[dish](ctx, cx, cy - 6, 0.92);
  } else if (s.plate.length === 0) {
    ctx.fillStyle = '#fdfdf8';
    ellipse(ctx, cx, cy + 10, 62, 20);
    ctx.fill();
    ctx.strokeStyle = '#e3dcc8';
    ctx.lineWidth = 1.5;
    ellipse(ctx, cx, cy + 10, 62, 20);
    ctx.stroke();
    ctx.fillStyle = '#b8a888';
    ctx.font = '15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('— Piring kosong —', cx, cy + 14);
  } else {
    // Merakit: ikon bahan tersusun melingkar di piring.
    ctx.fillStyle = '#fdfdf8';
    ellipse(ctx, cx, cy + 10, 62, 20);
    ctx.fill();
    ctx.strokeStyle = '#e3dcc8';
    ctx.lineWidth = 1.5;
    ellipse(ctx, cx, cy + 10, 62, 20);
    ctx.stroke();
    s.plate.forEach((id, i) => {
      const a = (i / Math.max(1, s.plate.length)) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(a) * 34;
      const y = cy + Math.sin(a) * 16;
      INGREDIENT_DRAW[id](ctx, x, y, 0.62);
    });
  }
  // Uap di atas piring.
  ctx.strokeStyle = 'rgba(180,170,150,0.6)';
  ctx.lineWidth = 1.6;
  const wob = Math.sin(t * 2) * 3;
  ctx.beginPath();
  ctx.moveTo(cx - 14 + wob, cy - 34);
  ctx.quadraticCurveTo(cx - 18 + wob, cy - 44, cx - 14 + wob, cy - 52);
  ctx.moveTo(cx + 12 - wob, cy - 34);
  ctx.quadraticCurveTo(cx + 16 - wob, cy - 44, cx + 12 - wob, cy - 52);
  ctx.stroke();
  // Float "+Rp" melayang.
  for (const f of s.floats) {
    ctx.fillStyle = '#e8a33d';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(f.text, f.x, f.y);
  }
}

function drawMessageAndServe(ctx, s, t) {
  const m = LAYOUT.pesan;
  ctx.fillStyle = COLORS.cream;
  rr(ctx, m.x, m.y, m.w, m.h, 10);
  ctx.fill();
  ctx.strokeStyle = COLORS.panelBorder;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = COLORS.ink;
  ctx.font = 'bold 17px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(s.message || ' ', m.x + m.w / 2, m.y + m.h / 2 + 1);
  // Tombol SAJIKAN.
  const b = LAYOUT.sajikan;
  const ready = plateDish(s) !== null;
  const pulse = ready ? 1 + Math.sin(t * 5) * 0.04 : 1;
  ctx.save();
  ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
  ctx.scale(pulse, pulse);
  ctx.translate(-(b.x + b.w / 2), -(b.y + b.h / 2));
  const g = ready
    ? ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h)
    : null;
  if (ready) {
    g.addColorStop(0, '#58b368');
    g.addColorStop(1, '#2c7a3a');
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = '#b8a888';
  }
  rr(ctx, b.x, b.y, b.w, b.h, 10);
  ctx.fill();
  ctx.strokeStyle = ready ? COLORS.greenDark : '#8a7a5a';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SAJIKAN', b.x + b.w / 2, b.y + b.h / 2 + 1);
  ctx.restore();
}

// ---------- kartu bahan, footer, papan pesanan ----------
function drawCards(ctx, s, t, cardRect) {
  const k = LAYOUT.kartu;
  const w = (k.w - 5 * k.gap) / 6;
  s.counter.forEach((id, i) => {
    const x = k.x + i * (w + k.gap);
    const y = k.y;
    const ing = INGREDIENTS[id];
    const held = s.hand && s.hand.id === id;
    ctx.fillStyle = held ? '#ffe9a8' : COLORS.panel;
    rr(ctx, x, y, w, k.h, 12);
    ctx.fill();
    ctx.strokeStyle = held ? COLORS.gold : COLORS.panelBorder;
    ctx.lineWidth = held ? 3 : 2;
    ctx.stroke();
    // Badge nomor 1-6.
    ctx.fillStyle = '#4a2c14';
    circle(ctx, x + 16, y + 16, 11);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), x + 16, y + 17);
    // Ikon bahan.
    INGREDIENT_DRAW[id](ctx, x + w / 2, y + 92, 1.05);
    // Nama + badge stasiun.
    ctx.fillStyle = COLORS.ink;
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(ing.name, x + w / 2, y + 172);
    const label = STATION_LABEL[ing.station];
    const color = STATION_COLOR[ing.station];
    ctx.font = 'bold 12px sans-serif';
    const tw = ctx.measureText(label).width + 18;
    ctx.fillStyle = color;
    rr(ctx, x + w / 2 - tw / 2, y + 186, tw, 22, 11);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(label, x + w / 2, y + 197);
    if (cardRect) cardRect.push({ x, y, w, h: k.h, id });
  });
}

function drawFooter(ctx) {
  const f = LAYOUT.footer;
  ctx.fillStyle = COLORS.inkSoft;
  ctx.font = '15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Klik bahan di meja  •  Klik stasiun untuk mengolah  •  Klik piring untuk menaruh  •  Spasi / SAJIKAN untuk menyajikan', f.x + f.w / 2, f.y + 32);
  ctx.fillText('Tombol 1–6 pilih bahan  •  R ulangi  •  P jeda  •  Sajikan 12 pesanan untuk menyelesaikan hari', f.x + f.w / 2, f.y + 56);
}

function drawBoard(ctx, s, t) {
  const p = LAYOUT.papan;
  ctx.fillStyle = '#6b4423';
  rr(ctx, p.x, p.y, p.w, p.h, 14);
  ctx.fill();
  ctx.fillStyle = COLORS.gold;
  rr(ctx, p.x + p.w / 2 - 52, p.y - 12, 104, 24, 12);
  ctx.fill();
  ctx.fillStyle = '#4a2c14';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PESANAN', p.x + p.w / 2, p.y + 1);
  const tk = LAYOUT.tiket;
  for (let i = 0; i < 3; i++) {
    const y = tk.y + i * (tk.h + tk.gap);
    const o = s.orders[i];
    ctx.fillStyle = COLORS.ticket;
    rr(ctx, tk.x, y, tk.w, tk.h, 10);
    ctx.fill();
    if (!o) {
      ctx.fillStyle = '#b8a888';
      ctx.font = '15px sans-serif';
      ctx.fillText('Menunggu pesanan…', tk.x + tk.w / 2, y + tk.h / 2);
      continue;
    }
    const dish = DISHES[o.dish];
    const ready = plateDish(s) === o.dish;
    if (ready) {
      ctx.fillStyle = COLORS.ticketReady;
      rr(ctx, tk.x, y, tk.w, tk.h, 10);
      ctx.fill();
    }
    // Nama + harga.
    ctx.fillStyle = COLORS.ink;
    ctx.font = 'bold 19px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(dish.name, tk.x + 12, y + 28);
    ctx.fillStyle = COLORS.gold;
    ctx.textAlign = 'right';
    ctx.fillText(`Rp ${dish.base}`, tk.x + tk.w - 12, y + 28);
    // 4 ikon bahan dalam satu baris (+ centang bila sudah di piring).
    const iw = tk.w / 4;
    dish.ingredients.forEach((id, j) => {
      const ix = tk.x + iw * j + iw / 2;
      const iy = y + 78;
      INGREDIENT_DRAW[id](ctx, ix, iy, 0.72);
      if (s.plate.includes(id)) {
        ctx.fillStyle = COLORS.green;
        circle(ctx, ix + 20, iy - 26, 10);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(ix + 15, iy - 26);
        ctx.lineTo(ix + 19, iy - 22);
        ctx.lineTo(ix + 25, iy - 30);
        ctx.stroke();
      }
      ctx.fillStyle = COLORS.inkSoft;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(INGREDIENTS[id].name, ix, y + 116);
    });
    // Bar kesabaran.
    const frac = Math.max(0, o.patience / o.maxPatience);
    const barY = y + 130;
    ctx.fillStyle = COLORS.barBg;
    rr(ctx, tk.x + 12, barY, tk.w - 24, 12, 6);
    ctx.fill();
    ctx.fillStyle = frac > 0.5 ? COLORS.barGood : frac > 0.25 ? COLORS.barWarn : COLORS.barBad;
    rr(ctx, tk.x + 12, barY, Math.max(12, (tk.w - 24) * frac), 12, 6);
    ctx.fill();
    if (ready) {
      // Strip SIAP (tiket cocok) — detik disembunyikan supaya tidak tertutup.
      const wob = Math.sin(t * 6) * 0.02;
      ctx.save();
      ctx.translate(tk.x + tk.w / 2, y + 164);
      ctx.rotate(wob);
      ctx.fillStyle = COLORS.green;
      rr(ctx, -110, -14, 220, 28, 14);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('SIAP DISAJIKAN', 0, 5);
      ctx.restore();
    } else {
      ctx.fillStyle = COLORS.inkSoft;
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`◷ ${Math.ceil(o.patience)} dtk`, tk.x + 12, y + 164);
    }
  }
}

// ---------- layar judul, layar akhir, draw utama ----------
function drawTitle(ctx, s, t) {
  drawWall(ctx, t);
  ctx.fillStyle = COLORS.ink;
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('DAPUR KILAT', 640, 150);
  ctx.fillStyle = COLORS.inkSoft;
  ctx.font = '22px sans-serif';
  ctx.fillText('Masak cepat, sajikan tepat waktu!', 640, 188);
  // Baris hero: 4 hidangan (kartu 180x235, gap 50, mulai x=205, y=205).
  const dishes = ['nasgor', 'spaghetti', 'burger', 'esteh'];
  dishes.forEach((id, i) => {
    const x = 205 + i * 230;
    const y = 205;
    const w = 180;
    const h = 235;
    ctx.fillStyle = COLORS.panel;
    rr(ctx, x, y, w, h, 14);
    ctx.fill();
    ctx.strokeStyle = COLORS.panelBorder;
    ctx.lineWidth = 2;
    ctx.stroke();
    DISH_DRAW[id](ctx, x + w / 2, y + 108, 0.82);
    ctx.fillStyle = COLORS.ink;
    ctx.font = 'bold 17px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(DISHES[id].name, x + w / 2, y + 198);
    ctx.fillStyle = COLORS.gold;
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`Rp ${DISHES[id].base}`, x + w / 2, y + 220);
  });
  // Kartu instruksi ber-border emas (berakhir sebelum tombol MULAI di y=520).
  const ix = 200;
  const iy = 460;
  const iw = 880;
  const ih = 56;
  ctx.fillStyle = COLORS.panel;
  rr(ctx, ix, iy, iw, ih, 12);
  ctx.fill();
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = COLORS.ink;
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Cara main: ambil bahan  →  olah di talenan/kompor  →  rakit di piring  →  sajikan tepat waktu', 640, iy + 26);
  ctx.fillStyle = COLORS.inkSoft;
  ctx.font = '14px sans-serif';
  ctx.fillText('Kontrol: 1–6 pilih bahan  •  Spasi sajikan  •  R ulangi  •  P jeda', 640, iy + 48);
  // Tombol MULAI MEMASAK.
  const b = LAYOUT.tombolJudul;
  const pulse = 1 + Math.sin(t * 3) * 0.02;
  ctx.save();
  ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
  ctx.scale(pulse, pulse);
  ctx.translate(-(b.x + b.w / 2), -(b.y + b.h / 2));
  const g = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
  g.addColorStop(0, '#58b368');
  g.addColorStop(1, '#2c7a3a');
  ctx.fillStyle = g;
  shadow(ctx, 'rgba(62,155,79,0.5)', 14, 0, 4);
  rr(ctx, b.x, b.y, b.w, b.h, 14);
  ctx.fill();
  ctx.stroke();
  noShadow(ctx);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MULAI MEMASAK', b.x + b.w / 2, b.y + b.h / 2 + 1);
  ctx.restore();
}

function drawEnd(ctx, s) {
  // Latar redup (layar main di belakang tetap tergambar).
  ctx.fillStyle = 'rgba(40,20,5,0.45)';
  ctx.fillRect(0, 0, 1280, 720);
  const c = LAYOUT.kartuAkhir;
  ctx.fillStyle = COLORS.panel;
  rr(ctx, c.x, c.y, c.w, c.h, 16);
  ctx.fill();
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 3;
  ctx.stroke();
  const win = s.screen === 'win';
  ctx.fillStyle = win ? COLORS.green : COLORS.red;
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(win ? 'HARI SELESAI!' : 'SHIFT BERAKHIR!', c.x + c.w / 2, c.y + 70);
  ctx.fillStyle = COLORS.inkSoft;
  ctx.font = '18px sans-serif';
  ctx.fillText(
    win ? 'Kerja bagus, koki! Semua pesanan tersaji.' : 'Terlalu banyak pesanan hangus.',
    c.x + c.w / 2, c.y + 104,
  );
  ctx.fillStyle = COLORS.ink;
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(`Koin: Rp ${s.coins}`, c.x + c.w / 2, c.y + 160);
  ctx.fillText(`Pesanan tersaji: ${s.served}/12`, c.x + c.w / 2, c.y + 198);
  ctx.fillStyle = COLORS.inkSoft;
  ctx.font = '17px sans-serif';
  ctx.fillText(`Kombo: x${s.combo}  •  Pesanan hangus: ${s.strikes}/3`, c.x + c.w / 2, c.y + 232);
  ctx.fillText('Klik di sini atau tekan R untuk main lagi', c.x + c.w / 2, c.y + 282);
}

function drawMain(ctx, s, mouse, t, cardRect) {
  drawWall(ctx, t);
  drawHeader(ctx, s);
  drawStation(ctx, s, 'talenan', 'TALENAN', t);
  drawStation(ctx, s, 'kompor', 'KOMPOR', t);
  drawPlateArea(ctx, s, t);
  // Bar pesan + tombol SAJIKAN hanya di layar main — di layar akhir (win/over)
  // keduanya tertutup kartu akhir dan teksnya mengintip terpotong di kiri.
  if (s.screen === 'main') drawMessageAndServe(ctx, s, t);
  drawCards(ctx, s, t, cardRect);
  drawFooter(ctx);
  drawBoard(ctx, s, t);
  if (s.paused) {
    ctx.fillStyle = 'rgba(40,20,5,0.45)';
    ctx.fillRect(0, 0, 1280, 720);
    ctx.fillStyle = '#fff6e0';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('JEDA', 640, 340);
    ctx.font = '18px sans-serif';
    ctx.fillText('Tekan P untuk lanjut.', 640, 380);
  }
  // Badge tangan mengikuti kursor (offset +18, -18).
  if (s.screen === 'main' && mouse && mouse.inside && s.hand) {
    INGREDIENT_DRAW[s.hand.id](ctx, mouse.x + 18, mouse.y - 18, 0.7);
  }
}

export function draw(ctx, s, mouse, t) {
  const cardRect = [];
  if (s.screen === 'title') {
    drawTitle(ctx, s, t);
    return;
  }
  drawMain(ctx, s, mouse, t, cardRect);
  if (s.screen === 'win' || s.screen === 'over') drawEnd(ctx, s);
}
