// Dapur Kilat v2 — all drawing: warm gradients, soft shadows, detailed food art.
// Pillar 1 (UI): gradient panels, bevels, shadows, clear hierarchy.
// Pillar 2 (textures): canvas gradients on every big surface, shadowBlur,
//   DPR-crisp edges, rounded rects, steam, bobbing, pulses, floating coins.
// Pillar 3 (food): every ingredient drawn with base + shade + highlight.
// Pillar 4 (neat & classy): uniform cards, gold accents, fine-dining plating.

import {
  CANVAS_W, CANVAS_H, COLORS, LAYOUT, INGREDIENTS,
  cardRect, ticketRect, plateSlots, clamp,
} from './config.js';
import { counterIngredients, matchingOrder } from './state.js';

export function setupCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = CANVAS_W * dpr;
  canvas.height = CANVAS_H * dpr;
  canvas.style.width = `${CANVAS_W}px`;
  canvas.style.height = `${CANVAS_H}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

// Rounded-rect path (works everywhere, no dependency on ctx.roundRect).
export function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function vGrad(ctx, y, h, c1, c2) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

function rGrad(ctx, x, y, r, c1, c2) {
  const g = ctx.createRadialGradient(x, y, r * 0.08, x, y, r);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

function text(ctx, str, x, y, font, color, align = 'left', baseline = 'alphabetic') {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(str, x, y);
}

export function inRect(p, r) {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// A polished panel: gradient fill, soft drop shadow, light top edge and
// darker bottom edge (bevel), thin gold border.
function panel(ctx, r, radius = 16) {
  ctx.save();
  ctx.shadowColor = 'rgba(60, 30, 10, 0.28)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 5;
  rr(ctx, r.x, r.y, r.w, r.h, radius);
  ctx.fillStyle = vGrad(ctx, r.y, r.h, COLORS.panelTop, COLORS.panelBottom);
  ctx.fill();
  ctx.restore();
  rr(ctx, r.x, r.y, r.w, r.h, radius);
  ctx.strokeStyle = COLORS.panelBorder;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r.x + radius, r.y + 1);
  ctx.lineTo(r.x + r.w - radius, r.y + 1);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r.x + radius, r.y + r.h - 1);
  ctx.lineTo(r.x + r.w - radius, r.y + r.h - 1);
  ctx.strokeStyle = 'rgba(120, 70, 20, 0.25)';
  ctx.stroke();
}

function softShadow(ctx, x, y, rx, ry) {
  ctx.fillStyle = 'rgba(60, 30, 10, 0.16)';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Two rising steam curls, phase-driven so they drift smoothly.
function steam(ctx, x, y, t, s = 1) {
  ctx.save();
  ctx.lineCap = 'round';
  for (let i = 0; i < 2; i++) {
    const ox = (i - 0.5) * 14 * s;
    const ph = t * 1.6 + i * 1.7;
    ctx.beginPath();
    ctx.moveTo(x + ox, y);
    ctx.quadraticCurveTo(x + ox + Math.sin(ph) * 6 * s, y - 12 * s, x + ox + Math.sin(ph + 1) * 5 * s, y - 24 * s);
    ctx.quadraticCurveTo(x + ox + Math.sin(ph + 2) * 6 * s, y - 34 * s, x + ox, y - 44 * s);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 2 * s;
    ctx.stroke();
  }
  ctx.restore();
}

// ---------- food art ----------
// Every item is drawn with a base tone, a darker shade, a bright highlight
// and a soft shadow — never a single flat colour. `detail` turns off steam
// and tiny grains at small sizes (tickets, plated pieces).
export function drawIngredient(ctx, id, x, y, r, t = 0, detail = true) {
  softShadow(ctx, x, y + r * 0.82, r * 0.75, r * 0.2);
  switch (id) {
    case 'nasi': {
      // Rice mound in a porcelain bowl, a few grains visible, steam curls.
      ctx.fillStyle = '#f3ead2';
      ctx.beginPath();
      ctx.arc(x, y - r * 0.05, r * 0.78, 0, Math.PI * 2);
      ctx.fill();
      const grains = [[-0.42, 0.08, 0.3], [0, -0.28, 0.36], [0.42, 0.08, 0.3], [-0.2, 0.28, 0.3], [0.2, 0.28, 0.3], [0, 0.02, 0.34]];
      for (const [gx, gy, gr] of grains) {
        ctx.fillStyle = '#fffef8';
        ctx.beginPath();
        ctx.arc(x + gx * r, y + gy * r, gr * r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.ellipse(x - r * 0.25, y - r * 0.32, r * 0.3, r * 0.16, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f5f0e6';
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.42, r * 0.95, r * 0.42, 0, 0, Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#d9cba8';
      ctx.lineWidth = r * 0.07;
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.42, r * 0.95, r * 0.42, 0, 0, Math.PI);
      ctx.stroke();
      if (detail) steam(ctx, x, y - r * 0.55, t, r / 40);
      break;
    }
    case 'ayam': {
      // Golden chicken piece, glossy highlight, light grill marks.
      const g = ctx.createLinearGradient(x - r * 0.6, y - r * 0.6, x + r * 0.6, y + r * 0.6);
      g.addColorStop(0, '#f0b45a');
      g.addColorStop(0.55, '#dd9433');
      g.addColorStop(1, '#b97a25');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.05, r * 0.85, r * 0.62, -0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 225, 150, 0.55)';
      ctx.beginPath();
      ctx.ellipse(x - r * 0.22, y - r * 0.22, r * 0.42, r * 0.2, -0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#7a4a12';
      ctx.lineWidth = r * 0.09;
      ctx.lineCap = 'round';
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x + (i * 0.34 - 0.18) * r, y - r * 0.05);
        ctx.lineTo(x + (i * 0.34 + 0.18) * r, y + r * 0.28);
        ctx.stroke();
      }
      if (detail) steam(ctx, x, y - r * 0.5, t, r / 40);
      break;
    }
    case 'kecap': {
      // Dark soy-sauce bottle, glossy vertical highlight, cap, small label.
      const g = ctx.createLinearGradient(x - r * 0.4, y, x + r * 0.4, y);
      g.addColorStop(0, '#4a2c17');
      g.addColorStop(0.5, '#2e1a10');
      g.addColorStop(1, '#1a0d06');
      rr(ctx, x - r * 0.38, y - r * 0.35, r * 0.76, r * 1.1, r * 0.22);
      ctx.fillStyle = g;
      ctx.fill();
      rr(ctx, x - r * 0.16, y - r * 0.95, r * 0.32, r * 0.62, r * 0.1);
      ctx.fillStyle = '#241207';
      ctx.fill();
      rr(ctx, x - r * 0.2, y - r * 1.08, r * 0.4, r * 0.22, r * 0.08);
      ctx.fillStyle = '#120a05';
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      rr(ctx, x - r * 0.28, y - r * 0.25, r * 0.1, r * 0.85, r * 0.05);
      ctx.fill();
      ctx.fillStyle = '#f3e2b8';
      rr(ctx, x - r * 0.3, y + r * 0.18, r * 0.6, r * 0.34, r * 0.05);
      ctx.fill();
      ctx.fillStyle = '#8a5a20';
      ctx.fillRect(x - r * 0.2, y + r * 0.3, r * 0.4, r * 0.05);
      break;
    }
    case 'mie': {
      // Noodle nest: swirled arcs, curved highlight strands, loose strands.
      ctx.strokeStyle = '#d99a26';
      ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        ctx.lineWidth = r * (0.2 - i * 0.04);
        ctx.beginPath();
        ctx.arc(x, y + r * 0.1, r * (0.72 - i * 0.2), Math.PI * 0.15, Math.PI * 1.25);
        ctx.stroke();
      }
      ctx.strokeStyle = '#ffe08a';
      ctx.lineWidth = r * 0.09;
      ctx.beginPath();
      ctx.arc(x, y + r * 0.05, r * 0.55, Math.PI * 1.05, Math.PI * 1.7);
      ctx.stroke();
      ctx.strokeStyle = '#b97a1a';
      ctx.lineWidth = r * 0.08;
      ctx.beginPath();
      ctx.moveTo(x + r * 0.7, y - r * 0.3);
      ctx.quadraticCurveTo(x + r * 1.05, y - r * 0.55, x + r * 0.95, y - r * 0.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - r * 0.7, y - r * 0.2);
      ctx.quadraticCurveTo(x - r * 1.0, y - r * 0.5, x - r * 0.85, y - r * 0.8);
      ctx.stroke();
      if (detail) steam(ctx, x, y - r * 0.5, t, r / 40);
      break;
    }
    case 'kaldu': {
      // Amber broth bowl, surface sheen, steam.
      ctx.fillStyle = '#f5f0e6';
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.3, r * 0.95, r * 0.48, 0, 0, Math.PI);
      ctx.fill();
      const g = rGrad(ctx, x, y + r * 0.05, r * 0.9, '#f0b45a', '#c97f2a');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.02, r * 0.85, r * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(x - r * 0.28, y - r * 0.08, r * 0.36, r * 0.13, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d9cba8';
      ctx.lineWidth = r * 0.07;
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.3, r * 0.95, r * 0.48, 0, 0, Math.PI);
      ctx.stroke();
      if (detail) steam(ctx, x, y - r * 0.45, t, r / 40);
      break;
    }
    case 'sate': {
      // Skewers with browned meat cubes, char marks, peanut-sauce drizzle.
      ctx.strokeStyle = '#d9b078';
      ctx.lineWidth = r * 0.09;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - r * 0.85, y - r * 0.55);
      ctx.lineTo(x + r * 0.85, y + r * 0.45);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - r * 0.85, y + r * 0.45);
      ctx.lineTo(x + r * 0.85, y - r * 0.55);
      ctx.stroke();
      const cubes = [[-0.45, -0.28], [0, 0.05], [0.45, 0.38], [-0.45, 0.18], [0, -0.15], [0.45, -0.48]];
      for (const [cx, cy] of cubes) {
        const g = rGrad(ctx, x + cx * r, y + cy * r, r * 0.3, '#b06a30', '#7a4218');
        ctx.fillStyle = g;
        rr(ctx, x + (cx - 0.26) * r, y + (cy - 0.26) * r, r * 0.52, r * 0.52, r * 0.14);
        ctx.fill();
        ctx.fillStyle = '#4a2410';
        ctx.beginPath();
        ctx.arc(x + (cx + 0.08) * r, y + (cy + 0.08) * r, r * 0.06, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = '#e07830';
      ctx.lineWidth = r * 0.07;
      ctx.beginPath();
      ctx.moveTo(x - r * 0.6, y + r * 0.62);
      ctx.quadraticCurveTo(x, y + r * 0.82, x + r * 0.6, y + r * 0.6);
      ctx.stroke();
      break;
    }
    case 'teh': {
      // Glass of amber tea, gradient, tea-bag string over the rim, highlight.
      const g = ctx.createLinearGradient(x, y - r * 0.7, x, y + r * 0.8);
      g.addColorStop(0, 'rgba(217, 154, 38, 0.55)');
      g.addColorStop(1, '#a8641e');
      ctx.beginPath();
      ctx.moveTo(x - r * 0.55, y - r * 0.7);
      ctx.lineTo(x + r * 0.55, y - r * 0.7);
      ctx.lineTo(x + r * 0.38, y + r * 0.8);
      ctx.lineTo(x - r * 0.38, y + r * 0.8);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = r * 0.06;
      ctx.beginPath();
      ctx.moveTo(x - r * 0.55, y - r * 0.7);
      ctx.lineTo(x + r * 0.55, y - r * 0.7);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(x - r * 0.35, y - r * 0.55);
      ctx.lineTo(x - r * 0.2, y - r * 0.55);
      ctx.lineTo(x - r * 0.3, y + r * 0.6);
      ctx.lineTo(x - r * 0.42, y + r * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#8a6d4b';
      ctx.lineWidth = r * 0.05;
      ctx.beginPath();
      ctx.moveTo(x + r * 0.45, y - r * 0.7);
      ctx.quadraticCurveTo(x + r * 0.75, y - r * 0.3, x + r * 0.55, y - r * 0.05);
      ctx.stroke();
      ctx.fillStyle = '#f3e2b8';
      rr(ctx, x + r * 0.42, y - r * 0.18, r * 0.26, r * 0.3, r * 0.05);
      ctx.fill();
      break;
    }
    case 'es': {
      // Translucent blue-white ice cubes, facet lines, a sparkle.
      for (const [ox, oy, rot] of [[-0.3, 0.1, -0.2], [0.32, -0.05, 0.25]]) {
        ctx.save();
        ctx.translate(x + ox * r, y + oy * r);
        ctx.rotate(rot);
        const g = ctx.createLinearGradient(-r * 0.4, -r * 0.4, r * 0.4, r * 0.4);
        g.addColorStop(0, '#eaf6fd');
        g.addColorStop(1, '#9ecfe8');
        rr(ctx, -r * 0.42, -r * 0.42, r * 0.84, r * 0.84, r * 0.16);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = r * 0.06;
        ctx.beginPath();
        ctx.moveTo(-r * 0.42, r * 0.1);
        ctx.lineTo(r * 0.42, -r * 0.1);
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(x + r * 0.55, y - r * 0.75);
      ctx.lineTo(x + r * 0.62, y - r * 0.6);
      ctx.lineTo(x + r * 0.78, y - r * 0.68);
      ctx.lineTo(x + r * 0.62, y - r * 0.55);
      ctx.lineTo(x + r * 0.55, y - r * 0.4);
      ctx.lineTo(x + r * 0.48, y - r * 0.55);
      ctx.lineTo(x + r * 0.32, y - r * 0.68);
      ctx.lineTo(x + r * 0.48, y - r * 0.6);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'gula': {
      // White sugar cubes, soft grey shading, bright top highlight.
      for (const [ox, oy] of [[-0.28, 0.12], [0.3, -0.08]]) {
        const g = ctx.createLinearGradient(x + (ox - 0.4) * r, y + (oy - 0.4) * r, x + (ox + 0.4) * r, y + (oy + 0.4) * r);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.7, '#efe9db');
        g.addColorStop(1, '#cfc7b4');
        rr(ctx, x + (ox - 0.42) * r, y + (oy - 0.42) * r, r * 0.84, r * 0.84, r * 0.12);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = '#b8b0a0';
        ctx.lineWidth = r * 0.05;
        rr(ctx, x + (ox - 0.42) * r, y + (oy - 0.42) * r, r * 0.84, r * 0.84, r * 0.12);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.ellipse(x - r * 0.28, y - r * 0.32, r * 0.3, r * 0.1, -0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'kacang': {
      // Small bowl of thick peanut sauce, glossy swirl on top.
      ctx.fillStyle = '#f5f0e6';
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.3, r * 0.95, r * 0.48, 0, 0, Math.PI);
      ctx.fill();
      const g = rGrad(ctx, x, y + r * 0.02, r * 0.85, '#d98a3a', '#a85f1a');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.02, r * 0.85, r * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e8a85a';
      ctx.lineWidth = r * 0.09;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(x, y, r * 0.45, Math.PI * 0.2, Math.PI * 1.5);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.ellipse(x - r * 0.3, y - r * 0.12, r * 0.3, r * 0.1, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d9cba8';
      ctx.lineWidth = r * 0.07;
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.3, r * 0.95, r * 0.48, 0, 0, Math.PI);
      ctx.stroke();
      break;
    }
    default:
      break;
  }
}

// ---------- background ----------
function drawBackground(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  g.addColorStop(0, COLORS.wallTop);
  g.addColorStop(1, COLORS.wallBottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Wood counter band behind the ingredient row.
  const wood = ctx.createLinearGradient(0, 360, 0, 608);
  wood.addColorStop(0, COLORS.woodTop);
  wood.addColorStop(1, COLORS.woodBottom);
  ctx.fillStyle = wood;
  ctx.fillRect(0, 360, CANVAS_W, 248);
  ctx.strokeStyle = COLORS.woodGrain;
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const y = 385 + i * 38;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(320, y + 6, 640, y - 6, 1280, y + 3);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(60, 30, 10, 0.18)';
  ctx.fillRect(0, 360, CANVAS_W, 4);

  // Soft vignette for depth.
  const v = ctx.createRadialGradient(640, 360, 260, 640, 360, 820);
  v.addColorStop(0, 'rgba(60, 30, 10, 0)');
  v.addColorStop(1, 'rgba(60, 30, 10, 0.10)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

// ---------- header ----------
function drawHeader(ctx, state) {
  const h = LAYOUT.header;
  ctx.fillStyle = vGrad(ctx, h.y, h.h, COLORS.headerTop, COLORS.headerBottom);
  ctx.fillRect(h.x, h.y, h.w, h.h);
  ctx.fillStyle = 'rgba(212, 164, 55, 0.9)';
  ctx.fillRect(0, h.h - 3, CANVAS_W, 3);

  const tg = ctx.createLinearGradient(20, 14, 20, 52);
  tg.addColorStop(0, '#f7dc8a');
  tg.addColorStop(0.5, COLORS.goldLight);
  tg.addColorStop(1, COLORS.gold);
  ctx.font = '800 30px system-ui, sans-serif';
  ctx.fillStyle = tg;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('DAPUR KILAT', 20, 33);

  // Coin with shine.
  const cx = 620;
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = rGrad(ctx, cx, 32, 15, '#ffe08a', '#d4a437');
  ctx.beginPath();
  ctx.arc(cx, 32, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#a87f22';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, 32, 15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.ellipse(cx - 5, 26, 5, 3, -0.5, 0, Math.PI * 2);
  ctx.fill();
  text(ctx, 'Rp', cx, 33, '800 11px system-ui, sans-serif', '#5a3a10', 'center', 'middle');
  text(ctx, `${state.coins}`, cx + 24, 33, '700 20px system-ui, sans-serif', COLORS.cream, 'left', 'middle');

  text(ctx, `Disajikan ${state.served}/12`, 720, 33, '600 16px system-ui, sans-serif', COLORS.cream, 'left', 'middle');

  // Strikes: three circles, red X when spent.
  for (let i = 0; i < 3; i++) {
    const sx = 850 + i * 30;
    ctx.beginPath();
    ctx.arc(sx, 32, 11, 0, Math.PI * 2);
    if (i < state.strikes) {
      ctx.fillStyle = COLORS.red;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx - 4, 28);
      ctx.lineTo(sx + 4, 36);
      ctx.moveTo(sx + 4, 28);
      ctx.lineTo(sx - 4, 36);
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(255, 248, 231, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  text(
    ctx,
    state.combo >= 2 ? `Kombo x${state.combo}` : 'Kombo x1',
    935, 33,
    '700 16px system-ui, sans-serif',
    state.combo >= 2 ? COLORS.goldLight : 'rgba(255, 248, 231, 0.55)',
    'left', 'middle',
  );

  // Day progress bar.
  const px = 1030;
  rr(ctx, px, 26, 90, 12, 6);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fill();
  const frac = state.served / 12;
  if (frac > 0) {
    rr(ctx, px, 26, 90 * frac, 12, 6);
    ctx.fillStyle = vGrad(ctx, 26, 12, COLORS.goldLight, COLORS.gold);
    ctx.fill();
  }
  text(ctx, `Hari ${Math.round(frac * 100)}%`, px + 98, 33, '600 13px system-ui, sans-serif', COLORS.cream, 'left', 'middle');

  text(ctx, fmtTime(state.time), 1268, 33, '700 22px system-ui, sans-serif', COLORS.cream, 'right', 'middle');
}

// ---------- stations ----------
function drawProgress(ctx, x, y, w, frac) {
  rr(ctx, x, y, w, 9, 4.5);
  ctx.fillStyle = 'rgba(60, 30, 10, 0.25)';
  ctx.fill();
  if (frac > 0) {
    rr(ctx, x, y, w * clamp(frac, 0, 1), 9, 4.5);
    ctx.fillStyle = vGrad(ctx, y, 9, '#7cc47f', COLORS.greenBottom);
    ctx.fill();
  }
}

function stationLabel(ctx, r, label) {
  text(ctx, label, r.x + 18, r.y + 26, '800 15px system-ui, sans-serif', COLORS.ink, 'left', 'middle');
}

function emptySlot(ctx, x, y, r, label, color = COLORS.inkDim) {
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  text(ctx, label, x, y + r + 18, '600 13px system-ui, sans-serif', color, 'center', 'middle');
}

function drawStations(ctx, state, t) {
  const s = LAYOUT.stations;

  // TALENAN — cutting board, light wood gradient + grain.
  panel(ctx, s.talenan);
  stationLabel(ctx, s.talenan, 'TALENAN');
  const tb = { x: s.talenan.x + 40, y: s.talenan.y + 52, w: 200, h: 104 };
  ctx.save();
  ctx.shadowColor = 'rgba(60, 30, 10, 0.25)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  rr(ctx, tb.x, tb.y, tb.w, tb.h, 12);
  ctx.fillStyle = vGrad(ctx, tb.y, tb.h, '#ecd2a0', '#c89a5e');
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = 'rgba(120, 70, 20, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(tb.x + 14, tb.y + 30);
  ctx.lineTo(tb.x + tb.w - 14, tb.y + 26);
  ctx.moveTo(tb.x + 14, tb.y + 70);
  ctx.lineTo(tb.x + tb.w - 14, tb.y + 74);
  ctx.stroke();
  const tj = state.stations.talenan;
  const tcx = s.talenan.x + s.talenan.w / 2;
  if (tj) {
    drawIngredient(ctx, tj.ing, tcx, tb.y + 58, 34, t);
    drawProgress(ctx, tcx - 80, tb.y + 122, 160, tj.progress);
    text(ctx, tj.done ? 'Siap!' : 'Memotong…', tcx, tb.y + 148, '600 13px system-ui, sans-serif', tj.done ? COLORS.greenDark : COLORS.inkDim, 'center', 'middle');
  } else {
    emptySlot(ctx, tcx, tb.y + 46, 30, 'Taruh bahan di sini');
  }

  // KOMPOR — dark metal stove, burner rings with radial glow.
  panel(ctx, s.kompor);
  stationLabel(ctx, s.kompor, 'KOMPOR');
  const st = { x: s.kompor.x + 30, y: s.kompor.y + 52, w: 220, h: 104 };
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  rr(ctx, st.x, st.y, st.w, st.h, 12);
  ctx.fillStyle = vGrad(ctx, st.y, st.h, '#3a3a42', '#1e1e24');
  ctx.fill();
  ctx.restore();
  const kj = state.stations.kompor;
  const kcx = s.kompor.x + s.kompor.w / 2;
  const burnerY = st.y + 52;
  for (const bx of [kcx - 52, kcx + 52]) {
    const glow = kj && !kj.done ? 0.5 + 0.3 * Math.sin(t * 5) : 0.12;
    ctx.fillStyle = `rgba(255, 140, 50, ${glow})`;
    ctx.beginPath();
    ctx.arc(bx, burnerY, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#55555e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bx, burnerY, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#2a2a30';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bx, burnerY, 18, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (kj) {
    drawIngredient(ctx, kj.ing, kcx - 52, burnerY, 26, t);
    drawProgress(ctx, kcx - 80, st.y + 122, 160, kj.progress);
    text(ctx, kj.done ? 'Siap!' : 'Memasak…', kcx, st.y + 148, '600 13px system-ui, sans-serif', kj.done ? COLORS.greenDark : COLORS.inkDim, 'center', 'middle');
  } else {
    emptySlot(ctx, kcx, burnerY, 26, 'Taruh bahan di sini', 'rgba(255, 248, 231, 0.75)');
  }

  // PIRING — fine-dining porcelain plate, thin gold rim, symmetric plating.
  panel(ctx, s.piring);
  stationLabel(ctx, s.piring, 'PIRING');
  const pcx = LAYOUT.plate.x;
  const pcy = LAYOUT.plate.y;
  drawPlate(ctx, state, pcx, pcy, LAYOUT.plate.r, t);
  const match = matchingOrder(state);
  const statusY = s.piring.y + 196;
  if (match) {
    text(ctx, `Cocok dengan #${match.id} — siap disajikan!`, pcx, statusY, '700 13px system-ui, sans-serif', COLORS.greenDark, 'center', 'middle');
  } else if (state.plate.length > 0) {
    text(ctx, `${state.plate.length} bahan di piring`, pcx, statusY, '600 13px system-ui, sans-serif', COLORS.inkDim, 'center', 'middle');
  } else {
    text(ctx, 'Piring kosong', pcx, statusY, '600 13px system-ui, sans-serif', COLORS.inkDim, 'center', 'middle');
  }
}

// White porcelain plate: radial gradient, thin gold rim, symmetric plating,
// a garnish accent and a fine drizzle — served like fine dining.
function drawPlate(ctx, state, cx, cy, r, t) {
  ctx.save();
  ctx.shadowColor = 'rgba(60, 30, 10, 0.3)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = rGrad(ctx, cx, cy, r, '#ffffff', '#efe6d0');
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = COLORS.plateRim;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(212, 164, 55, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 9, 0, Math.PI * 2);
  ctx.stroke();

  const slots = plateSlots(state.plate.length, cx, cy, r - 26);
  state.plate.forEach((ing, i) => {
    drawIngredient(ctx, ing, slots[i].x, slots[i].y, 24, t, false);
  });
  if (state.plate.length > 0) {
    // Garnish: two small leaves and a thin golden drizzle arc.
    for (const [gx, gy, rot] of [[-0.62, -0.55, -0.6], [0.62, -0.55, 0.6]]) {
      ctx.save();
      ctx.translate(cx + gx * r, cy + gy * r);
      ctx.rotate(rot);
      ctx.fillStyle = COLORS.garnish;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.14, r * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3e7a40';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-r * 0.12, 0);
      ctx.lineTo(r * 0.12, 0);
      ctx.stroke();
      ctx.restore();
    }
    ctx.strokeStyle = 'rgba(212, 164, 55, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, Math.PI * 1.15, Math.PI * 1.65);
    ctx.stroke();
  }
}

// ---------- message bar + serve button ----------
function drawMessageServe(ctx, state, input, t) {
  const m = LAYOUT.message;
  ctx.save();
  ctx.shadowColor = 'rgba(60, 30, 10, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  rr(ctx, m.x, m.y, m.w, m.h, 24);
  ctx.fillStyle = vGrad(ctx, m.y, m.h, COLORS.headerTop, COLORS.headerBottom);
  ctx.fill();
  ctx.restore();
  text(ctx, state.message, m.x + m.w / 2, m.y + m.h / 2 + 1, '600 15px system-ui, sans-serif', COLORS.cream, 'center', 'middle');

  const b = LAYOUT.serve;
  const ready = !!matchingOrder(state);
  const hover = inRect(input.mouse, b);
  const pressed = hover && input.mouseDown;
  ctx.save();
  if (ready) {
    ctx.shadowColor = 'rgba(76, 175, 80, 0.8)';
    ctx.shadowBlur = 16 + 8 * Math.sin(t * 4);
    ctx.shadowOffsetY = 4;
  } else {
    ctx.shadowColor = 'rgba(60, 30, 10, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
  }
  rr(ctx, b.x, b.y + (pressed ? 2 : 0), b.w, b.h, 14);
  ctx.fillStyle = ready
    ? vGrad(ctx, b.y, b.h, COLORS.greenTop, COLORS.greenBottom)
    : vGrad(ctx, b.y, b.h, '#9a9a88', '#6f6f60');
  ctx.fill();
  ctx.restore();
  rr(ctx, b.x, b.y + (pressed ? 2 : 0), b.w, b.h, 14);
  ctx.strokeStyle = ready ? '#2e6b3a' : '#5c5c4e';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  text(ctx, 'SAJIKAN  (Spasi)', b.x + b.w / 2, b.y + (pressed ? 2 : 0) + b.h / 2 + 1, '800 18px system-ui, sans-serif', ready ? '#ffffff' : 'rgba(255, 255, 255, 0.75)', 'center', 'middle');
}

// ---------- ingredient cards (mise en place) ----------
function drawCards(ctx, state, input, t) {
  const slots = counterIngredients(state);
  for (let i = 0; i < 6; i++) {
    const r = cardRect(i);
    const ing = INGREDIENTS[slots[i]];
    const hover = inRect(input.mouse, r);
    const held = !!state.hand && state.hand.id === ing.id;
    ctx.save();
    if (hover) ctx.translate(0, -3);
    ctx.shadowColor = held ? 'rgba(212, 164, 55, 0.55)' : 'rgba(60, 30, 10, 0.25)';
    ctx.shadowBlur = hover || held ? 16 : 10;
    ctx.shadowOffsetY = hover ? 6 : 4;
    rr(ctx, r.x, r.y, r.w, r.h, 14);
    ctx.fillStyle = vGrad(ctx, r.y, r.h, '#fffdf6', '#f6e8c4');
    ctx.fill();
    // Crisp border and text: clear the shadow, keep the lift.
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    rr(ctx, r.x, r.y, r.w, r.h, 14);
    ctx.strokeStyle = held ? COLORS.gold : 'rgba(212, 164, 55, 0.55)';
    ctx.lineWidth = held ? 2.5 : 1.25;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(r.x + 14, r.y + 1);
    ctx.lineTo(r.x + r.w - 14, r.y + 1);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Number badge, top-left.
    ctx.fillStyle = COLORS.headerBottom;
    ctx.beginPath();
    ctx.arc(r.x + 18, r.y + 18, 11, 0, Math.PI * 2);
    ctx.fill();
    text(ctx, `${i + 1}`, r.x + 18, r.y + 19, '800 12px system-ui, sans-serif', '#fff', 'center', 'middle');

    // Centred icon with consistent padding, thin gold rule beneath it.
    const cx = r.x + r.w / 2;
    drawIngredient(ctx, ing.id, cx, r.y + 92, 42, t);
    ctx.strokeStyle = 'rgba(212, 164, 55, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 24, r.y + 146);
    ctx.lineTo(cx + 24, r.y + 146);
    ctx.stroke();

    text(ctx, ing.name, cx, r.y + 172, '700 17px system-ui, sans-serif', COLORS.ink, 'center', 'middle');
    text(ctx, ing.label, cx, r.y + 196, '600 12px system-ui, sans-serif', COLORS.inkDim, 'center', 'middle');
    ctx.restore();
  }
}

// ---------- footer ----------
function drawFooter(ctx) {
  const f = LAYOUT.footer;
  ctx.save();
  ctx.shadowColor = 'rgba(60, 30, 10, 0.25)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  rr(ctx, f.x, f.y, f.w, f.h, 14);
  ctx.fillStyle = vGrad(ctx, f.y, f.h, COLORS.headerTop, COLORS.headerBottom);
  ctx.fill();
  ctx.restore();
  const lines = [
    'Klik bahan (atau 1–6) untuk mengambil — olah di talenan / kompor bila perlu —',
    'taruh di piring — klik pesanan yang cocok atau tekan Spasi untuk menyajikan.',
    'P jeda  •  R mulai lagi  •  Sajikan 12 pesanan untuk menutup hari.',
  ];
  lines.forEach((line, i) => {
    text(ctx, line, f.x + 18, f.y + 26 + i * 24, '600 13px system-ui, sans-serif', 'rgba(255, 248, 231, 0.85)', 'left', 'middle');
  });
}

// ---------- order board ----------
function drawBoard(ctx, state, t) {
  const b = LAYOUT.board;
  rr(ctx, b.x, b.y, b.w, b.h, 16);
  ctx.fillStyle = 'rgba(255, 249, 234, 0.55)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 164, 55, 0.5)';
  ctx.lineWidth = 1.5;
  rr(ctx, b.x, b.y, b.w, b.h, 16);
  ctx.stroke();

  const match = matchingOrder(state);
  for (let i = 0; i < 3; i++) {
    const r = ticketRect(i);
    const order = state.orders[i];
    if (!order) {
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(138, 109, 75, 0.5)';
      ctx.lineWidth = 1.5;
      rr(ctx, r.x, r.y, r.w, r.h, 14);
      ctx.stroke();
      ctx.setLineDash([]);
      text(ctx, 'Menunggu pesanan…', r.x + r.w / 2, r.y + r.h / 2, '600 14px system-ui, sans-serif', COLORS.inkDim, 'center', 'middle');
      continue;
    }
    const recipe = order.recipe;
    const isReady = match && match.id === order.id;
    const low = order.patience < 10;
    const bob = isReady ? Math.sin(t * 2) * 2 : 0;

    ctx.save();
    ctx.translate(0, bob);
    if (low) {
      ctx.shadowColor = `rgba(217, 79, 61, ${0.5 + 0.3 * Math.sin(t * 6)})`;
      ctx.shadowBlur = 18;
    } else if (isReady) {
      ctx.shadowColor = 'rgba(76, 175, 80, 0.6)';
      ctx.shadowBlur = 16;
    } else {
      ctx.shadowColor = 'rgba(60, 30, 10, 0.25)';
      ctx.shadowBlur = 12;
    }
    ctx.shadowOffsetY = 4;
    rr(ctx, r.x, r.y, r.w, r.h, 14);
    ctx.fillStyle = vGrad(ctx, r.y, r.h, '#fffdf6', '#f7ecd2');
    ctx.fill();
    ctx.restore();

    // The ticket content bobs with the body when its dish is ready.
    ctx.save();
    ctx.translate(0, bob);

    // Coloured header band, clipped to the ticket's rounded top corners.
    ctx.save();
    rr(ctx, r.x, r.y, r.w, r.h, 14);
    ctx.clip();
    const hg = ctx.createLinearGradient(r.x, r.y, r.x + r.w, r.y);
    hg.addColorStop(0, recipe.color);
    hg.addColorStop(1, recipe.colorDark);
    ctx.fillStyle = hg;
    ctx.fillRect(r.x, r.y, r.w, 36);
    ctx.restore();
    text(ctx, `#${order.id}  ${recipe.name}`, r.x + 14, r.y + 24, '700 17px system-ui, sans-serif', '#ffffff', 'left', 'middle');

    // Ingredients in a neat, even row.
    const n = recipe.ingredients.length;
    recipe.ingredients.forEach((ingId, j) => {
      const ix = r.x + ((j + 1) * r.w) / (n + 1);
      drawIngredient(ctx, ingId, ix, r.y + 78, 22, t, false);
      text(ctx, INGREDIENTS[ingId].name, ix, r.y + 112, '600 11px system-ui, sans-serif', COLORS.ink, 'center', 'middle');
      text(ctx, INGREDIENTS[ingId].label, ix, r.y + 128, '600 10px system-ui, sans-serif', COLORS.inkDim, 'center', 'middle');
    });

    // Ready badge.
    if (isReady) {
      const bw = 208;
      const bx = r.x + (r.w - bw) / 2;
      const by = r.y + 140;
      rr(ctx, bx, by, bw, 22, 11);
      ctx.fillStyle = vGrad(ctx, by, 22, COLORS.greenTop, COLORS.greenBottom);
      ctx.fill();
      text(ctx, 'SIAP — KLIK UNTUK SAJIKAN', bx + bw / 2, by + 12, '800 11px system-ui, sans-serif', '#ffffff', 'center', 'middle');
    }

    // Patience bar: green → amber → red as it drains.
    const frac = clamp(order.patience / order.patienceMax, 0, 1);
    const barX = r.x + 14;
    const barY = r.y + r.h - 28;
    const barW = r.w - 28 - 62;
    rr(ctx, barX, barY, barW, 10, 5);
    ctx.fillStyle = 'rgba(60, 30, 10, 0.22)';
    ctx.fill();
    const barColor = frac > 0.5 ? COLORS.greenTop : frac > 0.25 ? COLORS.amber : COLORS.red;
    if (frac > 0) {
      rr(ctx, barX, barY, barW * frac, 10, 5);
      ctx.fillStyle = barColor;
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      rr(ctx, barX, barY, barW * frac, 4, 2);
      ctx.fill();
    }
    text(ctx, `${Math.ceil(order.patience)} dtk`, r.x + r.w - 14, barY + 6, '700 13px system-ui, sans-serif', barColor, 'right', 'middle');

    if (isReady) {
      rr(ctx, r.x, r.y, r.w, r.h, 14);
      ctx.strokeStyle = COLORS.greenTop;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    ctx.restore();
  }
}

// ---------- floating texts + held ingredient ----------
function drawFloats(ctx, state) {
  for (const f of state.floats) {
    const a = clamp(f.life / f.max, 0, 1);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = '800 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(58, 36, 21, 0.8)';
    ctx.strokeText(f.text, f.x, f.y);
    ctx.fillStyle = COLORS.goldLight;
    ctx.fillText(f.text, f.x, f.y);
    ctx.restore();
  }
}

function drawHeld(ctx, state, input) {
  const x = clamp(input.mouse.x, 60, CANVAS_W - 60);
  const y = clamp(input.mouse.y, 60, CANVAS_H - 60);
  ctx.save();
  ctx.shadowColor = 'rgba(60, 30, 10, 0.35)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = vGrad(ctx, y - 58, 58, '#fffdf6', '#f6e8c4');
  ctx.beginPath();
  ctx.arc(x, y - 34, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y - 34, 30, 0, Math.PI * 2);
  ctx.stroke();
  drawIngredient(ctx, state.hand.id, x, y - 34, 19, 0, false);
  text(ctx, INGREDIENTS[state.hand.id].name, x, y + 6, '700 12px system-ui, sans-serif', COLORS.ink, 'center', 'middle');
}

// ---------- screens ----------
function drawTitle(ctx, state, t) {
  ctx.fillStyle = 'rgba(46, 26, 12, 0.55)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  g.addColorStop(0, 'rgba(74, 44, 23, 0.55)');
  g.addColorStop(1, 'rgba(46, 26, 12, 0.75)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Decorative steam and floating food motifs.
  steam(ctx, 320, 300, t, 1.4);
  steam(ctx, 960, 260, t + 2, 1.4);
  drawIngredient(ctx, 'nasi', 180, 180, 34, t, false);
  drawIngredient(ctx, 'sate', 1100, 200, 34, t, false);
  drawIngredient(ctx, 'mie', 150, 520, 30, t, false);
  drawIngredient(ctx, 'teh', 1130, 520, 30, t, false);

  const tg = ctx.createLinearGradient(0, 130, 0, 230);
  tg.addColorStop(0, '#f7dc8a');
  tg.addColorStop(0.55, COLORS.goldLight);
  tg.addColorStop(1, COLORS.gold);
  text(ctx, 'DAPUR KILAT', CANVAS_W / 2, 190, '800 72px system-ui, sans-serif', tg, 'center', 'middle');
  text(ctx, 'Masak cepat, sajikan tepat waktu!', CANVAS_W / 2, 250, '600 26px system-ui, sans-serif', COLORS.cream, 'center', 'middle');

  const card = { x: 390, y: 300, w: 500, h: 150 };
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
  rr(ctx, card.x, card.y, card.w, card.h, 18);
  ctx.fillStyle = 'rgba(255, 249, 234, 0.96)';
  ctx.fill();
  ctx.restore();
  const lines = [
    'Pesanan masuk di papan kanan. Ambil bahan dari meja,',
    'olah di talenan atau kompor, rakit di piring, lalu sajikan',
    'sebelum kesabaran pelanggan habis. Sajikan 12 pesanan',
    'untuk menutup hari — 3 pesanan hangus dan shift berakhir.',
  ];
  lines.forEach((line, i) => {
    text(ctx, line, CANVAS_W / 2, card.y + 34 + i * 28, '600 16px system-ui, sans-serif', COLORS.ink, 'center', 'middle');
  });

  const b = LAYOUT.titleButton;
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 16 + 6 * Math.sin(t * 3);
  ctx.shadowOffsetY = 5;
  rr(ctx, b.x, b.y, b.w, b.h, 32);
  ctx.fillStyle = vGrad(ctx, b.y, b.h, COLORS.greenTop, COLORS.greenBottom);
  ctx.fill();
  ctx.restore();
  text(ctx, 'KLIK ATAU TEKAN ENTER', b.x + b.w / 2, b.y + b.h / 2 + 1, '800 22px system-ui, sans-serif', '#ffffff', 'center', 'middle');
  text(ctx, 'Mouse + keyboard  •  P jeda  •  R mulai lagi', CANVAS_W / 2, b.y + b.h + 30, '600 14px system-ui, sans-serif', 'rgba(255, 248, 231, 0.85)', 'center', 'middle');
}

function drawEnd(ctx, state) {
  ctx.fillStyle = 'rgba(46, 26, 12, 0.55)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  const c = LAYOUT.endCard;
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  rr(ctx, c.x, c.y, c.w, c.h, 20);
  ctx.fillStyle = vGrad(ctx, c.y, c.h, '#fffdf6', '#f6e8c4');
  ctx.fill();
  ctx.restore();
  rr(ctx, c.x, c.y, c.w, c.h, 20);
  ctx.strokeStyle = COLORS.panelBorder;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const done = state.screen === 'dayComplete';
  text(ctx, done ? 'HARI SELESAI!' : 'SHIFT BERAKHIR', c.x + c.w / 2, c.y + 72, '800 44px system-ui, sans-serif', done ? COLORS.greenDark : COLORS.red, 'center', 'middle');
  const lines = done
    ? [
      'Semua 12 pesanan tersaji.',
      `Koin: ${state.coins}  •  Kombo terbaik: x${state.bestCombo}`,
      `Waktu shift: ${fmtTime(state.time)}  •  Pesanan hangus: ${state.strikes}`,
    ]
    : [
      '3 pesanan hangus.',
      `Koin: ${state.coins}  •  Disajikan: ${state.served}/12`,
      `Waktu shift: ${fmtTime(state.time)}  •  Kombo terbaik: x${state.bestCombo}`,
    ];
  lines.forEach((line, i) => {
    text(ctx, line, c.x + c.w / 2, c.y + 140 + i * 34, '600 18px system-ui, sans-serif', COLORS.ink, 'center', 'middle');
  });
  text(ctx, 'Tekan R atau klik untuk main lagi', c.x + c.w / 2, c.y + c.h - 36, '600 15px system-ui, sans-serif', COLORS.inkDim, 'center', 'middle');
}

function drawPaused(ctx) {
  ctx.fillStyle = 'rgba(46, 26, 12, 0.6)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  text(ctx, 'JEDA', CANVAS_W / 2, CANVAS_H / 2 - 20, '800 56px system-ui, sans-serif', COLORS.cream, 'center', 'middle');
  text(ctx, 'Tekan P untuk lanjut', CANVAS_W / 2, CANVAS_H / 2 + 34, '600 18px system-ui, sans-serif', 'rgba(255, 248, 231, 0.85)', 'center', 'middle');
}

// ---------- main draw ----------
export function drawGame(ctx, state, input, t) {
  const time = state.frozen ? state.shotTime : t;
  drawBackground(ctx, time);
  drawHeader(ctx, state);
  drawStations(ctx, state, time);
  drawMessageServe(ctx, state, input, time);
  drawCards(ctx, state, input, time);
  drawFooter(ctx);
  drawBoard(ctx, state, time);
  drawFloats(ctx, state);
  if (state.hand) drawHeld(ctx, state, input);
  if (state.screen === 'title') drawTitle(ctx, state, time);
  else if (state.screen === 'paused') drawPaused(ctx);
  else if (state.screen === 'dayComplete' || state.screen === 'gameOver') drawEnd(ctx, state);
}
