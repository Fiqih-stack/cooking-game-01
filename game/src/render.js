// Dapur Kilat — rendering.
// One job: draw the kitchen, the order board, the HUD and every screen.
// All geometry comes from DK_LAYOUT, all rules from state.js.

function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function patienceColor(frac) {
  if (frac > 0.5) return '#2e9e4f';
  if (frac > 0.25) return '#e8a13c';
  return '#d93a2b';
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

// One ingredient, drawn in code — no images, no emoji. Center (cx, cy),
// radius r. Each case is a few flat shapes in the ingredient's colours.
function drawIngredientIcon(ctx, id, cx, cy, r) {
  const ing = DK_INGREDIENTS[id];
  if (!ing) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineWidth = Math.max(2, r * 0.09);
  ctx.strokeStyle = ing.dark;
  ctx.fillStyle = ing.color;
  ctx.lineJoin = 'round';
  if (id === 'rice') {
    ctx.beginPath();
    ctx.arc(0, -r * 0.1, r * 0.55, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, r * 0.35, r * 0.7, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#b98d4f';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.05, r * 0.1, 0, Math.PI * 2);
    ctx.arc(r * 0.2, -r * 0.2, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'chicken') {
    ctx.beginPath();
    ctx.arc(-r * 0.12, -r * 0.12, r * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#fdf6ec';
    ctx.lineWidth = Math.max(3, r * 0.14);
    ctx.beginPath();
    ctx.moveTo(r * 0.25, r * 0.25);
    ctx.lineTo(r * 0.7, r * 0.7);
    ctx.moveTo(r * 0.3, r * 0.15);
    ctx.lineTo(r * 0.75, r * 0.55);
    ctx.stroke();
    ctx.fillStyle = '#fdf6ec';
    ctx.beginPath();
    ctx.arc(r * 0.72, r * 0.72, r * 0.14, 0, Math.PI * 2);
    ctx.arc(r * 0.78, r * 0.55, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'kecap') {
    rr(ctx, -r * 0.42, -r * 0.25, r * 0.84, r * 0.95, r * 0.18);
    ctx.fill();
    ctx.stroke();
    rr(ctx, -r * 0.2, -r * 0.8, r * 0.4, r * 0.6, r * 0.1);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f2b705';
    rr(ctx, -r * 0.42, r * 0.05, r * 0.84, r * 0.3, r * 0.08);
    ctx.fill();
  } else if (id === 'noodle') {
    ctx.strokeStyle = '#f7d154';
    ctx.lineWidth = Math.max(3, r * 0.16);
    for (let k = -1; k <= 1; k++) {
      ctx.beginPath();
      ctx.arc(k * r * 0.45, -r * 0.15, r * 0.32, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }
    ctx.fillStyle = '#b98d4f';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.35, r * 0.7, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ing.dark;
    ctx.stroke();
  } else if (id === 'broth') {
    ctx.fillStyle = '#8a5a2b';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.3, r * 0.7, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#d9d9d9';
    ctx.lineWidth = Math.max(2, r * 0.1);
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, -r * 0.1);
    ctx.quadraticCurveTo(-r * 0.45, -r * 0.5, -r * 0.25, -r * 0.8);
    ctx.moveTo(r * 0.25, -r * 0.1);
    ctx.quadraticCurveTo(r * 0.4, -r * 0.5, r * 0.2, -r * 0.8);
    ctx.stroke();
  } else if (id === 'skewer') {
    ctx.strokeStyle = '#8a5a2b';
    ctx.lineWidth = Math.max(3, r * 0.12);
    ctx.beginPath();
    ctx.moveTo(-r * 0.9, 0);
    ctx.lineTo(r * 0.9, 0);
    ctx.stroke();
    ctx.fillStyle = '#c96f3b';
    for (const dx of [-0.5, 0, 0.5]) {
      rr(ctx, dx * r - r * 0.22, -r * 0.26, r * 0.44, r * 0.52, r * 0.1);
      ctx.fill();
      ctx.stroke();
    }
  } else if (id === 'sauce') {
    ctx.fillStyle = '#d98e32';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.25, r * 0.68, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#8a5a2b';
    for (const [dx, dy] of [[-0.3, 0.15], [0.05, 0.3], [0.35, 0.1]]) {
      ctx.beginPath();
      ctx.arc(dx * r, dy * r, r * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'tea') {
    ctx.beginPath();
    ctx.moveTo(-r * 0.55, -r * 0.5);
    ctx.lineTo(r * 0.55, -r * 0.5);
    ctx.lineTo(r * 0.4, r * 0.6);
    ctx.lineTo(-r * 0.4, r * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(r * 0.62, 0, r * 0.28, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.strokeStyle = '#d9d9d9';
    ctx.lineWidth = Math.max(2, r * 0.1);
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.65);
    ctx.quadraticCurveTo(r * 0.15, -r * 0.85, 0, -r * 1.0);
    ctx.stroke();
  } else if (id === 'ice') {
    ctx.fillStyle = '#aee6f5';
    for (const [dx, dy, rot] of [[-0.35, 0.15, 0.3], [0.3, 0.25, -0.25], [0.05, -0.4, 0.15]]) {
      ctx.save();
      ctx.translate(dx * r, dy * r);
      ctx.rotate(rot);
      rr(ctx, -r * 0.32, -r * 0.32, r * 0.64, r * 0.64, r * 0.12);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  } else if (id === 'sugar') {
    ctx.fillStyle = '#ffffff';
    for (const [dx, dy] of [[-0.35, 0.2], [0.3, 0.3], [0, -0.35]]) {
      rr(ctx, dx * r - r * 0.24, dy * r - r * 0.24, r * 0.48, r * 0.48, r * 0.08);
      ctx.fill();
      ctx.stroke();
    }
    ctx.strokeStyle = '#f2b705';
    ctx.lineWidth = Math.max(2, r * 0.08);
    ctx.beginPath();
    ctx.moveTo(r * 0.7, -r * 0.7);
    ctx.lineTo(r * 0.85, -r * 0.85);
    ctx.moveTo(r * 0.85, -r * 0.7);
    ctx.lineTo(r * 0.7, -r * 0.85);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBackground(ctx) {
  const wall = ctx.createLinearGradient(0, 0, 0, 420);
  wall.addColorStop(0, DK_PALETTE.wallTop);
  wall.addColorStop(1, DK_PALETTE.wall);
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, DK_CONFIG.width, DK_CONFIG.height);
  ctx.fillStyle = DK_PALETTE.floor;
  ctx.fillRect(0, 600, DK_CONFIG.width, 120);
  ctx.strokeStyle = DK_PALETTE.floorLine;
  ctx.lineWidth = 2;
  for (let y = 620; y <= 700; y += 26) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(DK_CONFIG.width, y);
    ctx.stroke();
  }
  // Back counter the stations stand on.
  ctx.fillStyle = DK_PALETTE.wood;
  rr(ctx, 12, 84, 900, 224, 14);
  ctx.fill();
  ctx.fillStyle = DK_PALETTE.counterTop;
  rr(ctx, 12, 84, 900, 18, 9);
  ctx.fill();
}

function drawHUD(ctx) {
  const h = DK_LAYOUT.hud;
  ctx.fillStyle = DK_PALETTE.hud;
  ctx.fillRect(h.x, h.y, h.w, h.h);
  ctx.fillStyle = DK_PALETTE.hudText;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.font = 'bold 26px Arial, sans-serif';
  ctx.fillText('DAPUR KILAT', 20, 33);
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillStyle = DK_PALETTE.gold;
  ctx.beginPath();
  ctx.arc(268, 32, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3b2a1e';
  ctx.font = 'bold 13px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Rp', 268, 33);
  ctx.textAlign = 'left';
  ctx.fillStyle = DK_PALETTE.hudText;
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillText(String(DKState.coins), 286, 33);
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText('Disajikan ' + DKState.served + '/' + DK_CONFIG.ordersToWin, 380, 33);
  // Strikes: three marks, filled red for each failed order.
  for (let i = 0; i < DK_CONFIG.maxStrikes; i++) {
    const x = 620 + i * 34;
    ctx.beginPath();
    ctx.arc(x, 32, 12, 0, Math.PI * 2);
    ctx.fillStyle = i < DKState.strikes ? DK_PALETTE.danger : '#6b543d';
    ctx.fill();
    ctx.strokeStyle = '#ffe9c9';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#ffe9c9';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('X', x, 33);
    ctx.textAlign = 'left';
  }
  if (DKState.combo > 1) {
    ctx.fillStyle = DK_PALETTE.gold;
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText('Kombo x' + DKState.combo, 730, 33);
  }
  // Day progress bar.
  ctx.fillStyle = '#6b543d';
  rr(ctx, 920, 22, 180, 20, 10);
  ctx.fill();
  ctx.fillStyle = DK_PALETTE.good;
  rr(ctx, 920, 22, 180 * (DKState.served / DK_CONFIG.ordersToWin), 20, 10);
  ctx.fill();
  ctx.fillStyle = DK_PALETTE.hudText;
  ctx.font = '16px Arial, sans-serif';
  ctx.fillText('Hari ' + Math.round((DKState.served / DK_CONFIG.ordersToWin) * 100) + '%', 1112, 33);
  ctx.textAlign = 'right';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillText(formatTime(DKState.time), 1260, 33);
  ctx.textAlign = 'left';
}

function drawOrderTicket(ctx, order, rect) {
  const recipe = recipeById(order.recipeId);
  const ready = matchingOrder() === order;
  const frac = Math.max(0, order.patience / order.maxPatience);
  ctx.fillStyle = DK_PALETTE.ticket;
  rr(ctx, rect.x, rect.y, rect.w, rect.h, 14);
  ctx.fill();
  ctx.lineWidth = ready ? 5 : 2;
  ctx.strokeStyle = ready ? DK_PALETTE.good : DK_PALETTE.ticketEdge;
  ctx.stroke();
  // Recipe colour strip.
  ctx.fillStyle = recipe.color;
  rr(ctx, rect.x, rect.y, rect.w, 34, 14);
  ctx.fill();
  ctx.fillRect(rect.x, rect.y + 20, rect.w, 14);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 19px Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('#' + order.id + '  ' + recipe.name, rect.x + 14, rect.y + 18);
  // Ingredients with their station tags.
  const needs = recipe.needs;
  const cellW = rect.w / needs.length;
  for (let i = 0; i < needs.length; i++) {
    const id = needs[i];
    const ing = DK_INGREDIENTS[id];
    const cx = rect.x + cellW * (i + 0.5);
    drawIngredientIcon(ctx, id, cx, rect.y + 82, 26);
    ctx.fillStyle = '#3b2a1e';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ing.name, cx, rect.y + 122);
    ctx.font = '12px Arial, sans-serif';
    ctx.fillStyle = ing.station === 'ready' ? DK_PALETTE.good : '#b96a28';
    ctx.fillText(DK_STATION_LABEL[ing.station], cx, rect.y + 142);
    ctx.textAlign = 'left';
  }
  if (ready) {
    ctx.fillStyle = DK_PALETTE.good;
    rr(ctx, rect.x + 14, rect.y + 152, 232, 26, 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText('SIAP — KLIK UNTUK SAJIKAN', rect.x + 24, rect.y + 165);
  }
  // Patience bar with seconds.
  ctx.fillStyle = '#e8dcc8';
  rr(ctx, rect.x + 14, rect.y + rect.h - 24, rect.w - 28, 12, 6);
  ctx.fill();
  ctx.fillStyle = patienceColor(frac);
  rr(ctx, rect.x + 14, rect.y + rect.h - 24, (rect.w - 28) * frac, 12, 6);
  ctx.fill();
  ctx.fillStyle = '#3b2a1e';
  ctx.font = 'bold 13px Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(Math.ceil(order.patience / 1000) + ' dtk', rect.x + rect.w - 14, rect.y + rect.h - 34);
  ctx.textAlign = 'left';
}

function drawOrderBoard(ctx) {
  ctx.fillStyle = '#f7e3c2';
  rr(ctx, DK_LAYOUT.board.x - 8, DK_LAYOUT.board.y - 8, DK_LAYOUT.board.w + 16, DK_LAYOUT.board.h + 16, 16);
  ctx.fill();
  ctx.fillStyle = '#3b2a1e';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('PAPAN PESANAN', DK_LAYOUT.board.x, DK_LAYOUT.board.y - 26);
  for (let i = 0; i < DKState.orders.length; i++) {
    drawOrderTicket(ctx, DKState.orders[i], ticketRect(i));
  }
  if (DKState.orders.length === 0 && DKState.screen === 'playing') {
    ctx.fillStyle = '#8a7a63';
    ctx.font = '18px Arial, sans-serif';
    ctx.fillText('Menunggu pesanan masuk…', DK_LAYOUT.board.x + 10, DK_LAYOUT.board.y + 40);
  }
}

function drawStationProgress(ctx, x, y, w, frac) {
  ctx.fillStyle = '#e8dcc8';
  rr(ctx, x, y, w, 10, 5);
  ctx.fill();
  ctx.fillStyle = '#e8a13c';
  rr(ctx, x, y, w * Math.max(0, Math.min(1, frac)), 10, 5);
  ctx.fill();
}

function drawBoardStation(ctx) {
  const r = DK_LAYOUT.boardStation;
  ctx.fillStyle = '#d9a066';
  rr(ctx, r.x, r.y, r.w, r.h, 14);
  ctx.fill();
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#3b2a1e';
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('TALENAN', r.x + 16, r.y + 22);
  // Knife.
  ctx.fillStyle = '#c8c8c8';
  ctx.beginPath();
  ctx.moveTo(r.x + r.w - 66, r.y + 34);
  ctx.lineTo(r.x + r.w - 18, r.y + 34);
  ctx.lineTo(r.x + r.w - 26, r.y + 48);
  ctx.lineTo(r.x + r.w - 66, r.y + 48);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(r.x + r.w - 70, r.y + 34, 8, 14);
  const cx = r.x + r.w / 2;
  const cy = r.y + 118;
  if (DKState.board.busy !== null) {
    const frac = 1 - (DKState.board.busy.endsAt - DKState.time) / DK_CONFIG.chopMs;
    drawIngredientIcon(ctx, DKState.board.busy.item.id, cx, cy, 34);
    drawStationProgress(ctx, r.x + 40, r.y + 168, r.w - 80, frac);
    ctx.fillStyle = '#3b2a1e';
    ctx.font = '14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Memotong…', cx, r.y + 190);
    ctx.textAlign = 'left';
  } else if (DKState.board.done !== null) {
    ctx.strokeStyle = DK_PALETTE.good;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 44, 0, Math.PI * 2);
    ctx.stroke();
    drawIngredientIcon(ctx, DKState.board.done.id, cx, cy, 34);
    ctx.fillStyle = DK_PALETTE.good;
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Siap — klik untuk ambil', cx, r.y + 190);
    ctx.textAlign = 'left';
  } else {
    ctx.strokeStyle = '#b98d4f';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#8a6a42';
    ctx.font = '14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Taruh bahan di sini', cx, cy + 4);
    ctx.textAlign = 'left';
  }
}

function drawStove(ctx) {
  const r = DK_LAYOUT.stove;
  ctx.fillStyle = '#4a4a52';
  rr(ctx, r.x, r.y, r.w, r.h, 14);
  ctx.fill();
  ctx.strokeStyle = '#2c2c32';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('KOMPOR', r.x + 16, r.y + 22);
  const cx = r.x + r.w / 2;
  const cy = r.y + 108;
  // Burners.
  for (const bx of [r.x + 78, r.x + r.w - 78]) {
    ctx.strokeStyle = '#1d1d22';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(bx, cy + 8, 34, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (DKState.stove.busy !== null) {
    // Flame under the pot, flickering with time (frozen in shot mode).
    const flick = 0.85 + 0.15 * Math.sin(DKState.time / 90);
    ctx.fillStyle = '#f2820a';
    ctx.beginPath();
    ctx.moveTo(cx - 34, cy + 44);
    ctx.quadraticCurveTo(cx - 18, cy + 10 * flick, cx, cy + 40);
    ctx.quadraticCurveTo(cx + 18, cy + 10 * flick, cx + 34, cy + 44);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f7d154';
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy + 44);
    ctx.quadraticCurveTo(cx - 8, cy + 24 * flick, cx, cy + 42);
    ctx.quadraticCurveTo(cx + 8, cy + 24 * flick, cx + 20, cy + 44);
    ctx.closePath();
    ctx.fill();
    drawIngredientIcon(ctx, DKState.stove.busy.item.id, cx, cy - 6, 30);
    const frac = 1 - (DKState.stove.busy.endsAt - DKState.time) / DK_CONFIG.cookMs;
    drawStationProgress(ctx, r.x + 40, r.y + 168, r.w - 80, frac);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Memasak…', cx, r.y + 190);
    ctx.textAlign = 'left';
  } else if (DKState.stove.done !== null) {
    ctx.strokeStyle = DK_PALETTE.good;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 44, 0, Math.PI * 2);
    ctx.stroke();
    drawIngredientIcon(ctx, DKState.stove.done.id, cx, cy - 6, 30);
    ctx.fillStyle = DK_PALETTE.good;
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Siap — klik untuk ambil', cx, r.y + 190);
    ctx.textAlign = 'left';
  } else {
    ctx.strokeStyle = '#77777f';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#b9b9c0';
    ctx.font = '14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Taruh bahan di sini', cx, cy + 4);
    ctx.textAlign = 'left';
  }
}

function drawPlateArea(ctx) {
  const r = DK_LAYOUT.plate;
  ctx.fillStyle = '#f3e2c8';
  rr(ctx, r.x, r.y, r.w, r.h, 14);
  ctx.fill();
  ctx.strokeStyle = '#d9b380';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#3b2a1e';
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('PIRING', r.x + 16, r.y + 22);
  const cx = r.x + r.w / 2;
  const cy = r.y + 112;
  ctx.fillStyle = DK_PALETTE.plateWhite;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 104, 62, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d9d9d9';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, cy, 76, 44, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (DKState.plate.length === 0) {
    ctx.fillStyle = '#a08a6a';
    ctx.font = '14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Piring kosong', cx, cy + 4);
    ctx.textAlign = 'left';
  } else {
    const n = DKState.plate.length;
    const spread = Math.min(120, (n - 1) * 52);
    for (let i = 0; i < n; i++) {
      const ix = cx - spread / 2 + (n === 1 ? 0 : (spread * i) / (n - 1));
      drawIngredientIcon(ctx, DKState.plate[i].id, ix, cy, 26);
    }
  }
  const match = matchingOrder();
  ctx.fillStyle = match !== null ? DK_PALETTE.good : '#8a7a63';
  ctx.font = 'bold 14px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    match !== null ? 'Cocok dengan #' + match.id + ' — siap disajikan!' : DKState.plate.length + ' bahan di piring',
    cx,
    r.y + 190,
  );
  ctx.textAlign = 'left';
}

function drawCounter(ctx) {
  const c = DK_LAYOUT.counter;
  ctx.fillStyle = DK_PALETTE.woodDark;
  rr(ctx, 12, c.y - 12, 900, c.h + 24, 14);
  ctx.fill();
  ctx.fillStyle = DK_PALETTE.counterTop;
  rr(ctx, 12, c.y - 12, 900, 16, 8);
  ctx.fill();
  ctx.fillStyle = '#ffe9c9';
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('MEJA BAHAN — klik untuk ambil (tombol 1–6)', 24, c.y - 32);
  const slots = currentCounterSlots();
  for (let i = 0; i < 6; i++) {
    const r = counterSlotRect(i);
    ctx.fillStyle = '#fff8ec';
    rr(ctx, r.x, r.y, r.w, r.h, 12);
    ctx.fill();
    ctx.strokeStyle = '#d9b380';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#3b2a1e';
    ctx.beginPath();
    ctx.arc(r.x + 18, r.y + 18, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), r.x + 18, r.y + 19);
    ctx.textAlign = 'left';
    if (slots[i] !== undefined) {
      const ing = DK_INGREDIENTS[slots[i]];
      drawIngredientIcon(ctx, slots[i], r.x + r.w / 2, r.y + 88, 36);
      ctx.fillStyle = '#3b2a1e';
      ctx.font = 'bold 16px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ing.name, r.x + r.w / 2, r.y + 148);
      ctx.font = '13px Arial, sans-serif';
      ctx.fillStyle = ing.station === 'ready' ? DK_PALETTE.good : '#b96a28';
      ctx.fillText(DK_STATION_LABEL[ing.station], r.x + r.w / 2, r.y + 172);
      ctx.textAlign = 'left';
    }
  }
}

function drawServeButton(ctx) {
  const r = DK_LAYOUT.serve;
  const match = matchingOrder();
  ctx.fillStyle = match !== null ? DK_PALETTE.good : '#9a8a74';
  rr(ctx, r.x, r.y, r.w, r.h, 12);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(match !== null ? 'SAJIKAN  (Spasi)' : 'SAJIKAN', r.x + r.w / 2, r.y + r.h / 2 + 1);
  ctx.textAlign = 'left';
}

function drawMessage(ctx) {
  if (DKState.message === '') return;
  const age = DKState.time - DKState.messageAt;
  if (!DKState.frozen && age > 2600) return;
  const r = DK_LAYOUT.message;
  ctx.fillStyle = 'rgba(59, 42, 30, 0.92)';
  rr(ctx, r.x, r.y, r.w, r.h, 12);
  ctx.fill();
  ctx.fillStyle = '#ffe9c9';
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(DKState.message, r.x + r.w / 2, r.y + r.h / 2 + 1);
  ctx.textAlign = 'left';
}

function drawHelp(ctx) {
  const r = DK_LAYOUT.help;
  ctx.fillStyle = 'rgba(59, 42, 30, 0.85)';
  rr(ctx, r.x, r.y, r.w, r.h, 12);
  ctx.fill();
  ctx.fillStyle = '#ffe9c9';
  ctx.font = '16px Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('Klik bahan (atau 1–6) untuk mengambil — olah di talenan / kompor bila perlu —', r.x + 18, r.y + 26);
  ctx.fillText('taruh di piring — klik pesanan yang cocok atau tekan Spasi untuk menyajikan.', r.x + 18, r.y + 50);
  ctx.fillText('P = jeda   •   R = mulai lagi   •   Sajikan 12 pesanan untuk menutup hari.', r.x + 18, r.y + 72);
}

function drawHand(ctx) {
  if (DKState.hand === null) return;
  const ing = DK_INGREDIENTS[DKState.hand.id];
  ctx.fillStyle = 'rgba(255, 248, 236, 0.95)';
  ctx.beginPath();
  ctx.arc(DKMouse.x, DKMouse.y - 18, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d9b380';
  ctx.lineWidth = 2;
  ctx.stroke();
  drawIngredientIcon(ctx, DKState.hand.id, DKMouse.x, DKMouse.y - 18, 22);
  if (DKState.hand.ready && ing.station !== 'ready') {
    ctx.fillStyle = DK_PALETTE.good;
    ctx.beginPath();
    ctx.arc(DKMouse.x + 20, DKMouse.y - 38, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(DKMouse.x + 15, DKMouse.y - 38);
    ctx.lineTo(DKMouse.x + 19, DKMouse.y - 34);
    ctx.lineTo(DKMouse.x + 26, DKMouse.y - 43);
    ctx.stroke();
  }
  ctx.fillStyle = '#3b2a1e';
  ctx.font = 'bold 13px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(ing.name, DKMouse.x, DKMouse.y + 22);
  ctx.textAlign = 'left';
}

function drawTitle(ctx) {
  ctx.fillStyle = 'rgba(30, 18, 8, 0.55)';
  ctx.fillRect(0, 0, DK_CONFIG.width, DK_CONFIG.height);
  ctx.fillStyle = '#fff8ec';
  rr(ctx, 290, 150, 700, 420, 20);
  ctx.fill();
  ctx.strokeStyle = DK_PALETTE.gold;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#e07840';
  ctx.font = 'bold 64px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DAPUR KILAT', 640, 220);
  ctx.fillStyle = '#3b2a1e';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText('Masak cepat, sajikan tepat waktu!', 640, 272);
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText('Pesanan masuk di papan kanan. Ambil bahan dari meja,', 640, 330);
  ctx.fillText('olah di talenan atau kompor, rakit di piring, lalu sajikan', 640, 358);
  ctx.fillText('sebelum kesabaran pelanggan habis. Sajikan 12 pesanan', 640, 386);
  ctx.fillText('untuk menutup hari — 3 pesanan hangus dan shift berakhir.', 640, 414);
  ctx.fillStyle = DK_PALETTE.good;
  rr(ctx, 440, 450, 400, 64, 12);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText('KLIK ATAU TEKAN ENTER', 640, 482);
  ctx.fillStyle = '#8a7a63';
  ctx.font = '15px Arial, sans-serif';
  ctx.fillText('Mouse + keyboard  •  P jeda  •  R mulai lagi', 640, 540);
  ctx.textAlign = 'left';
}

function drawEndPanel(ctx, title, color, lines, foot) {
  ctx.fillStyle = 'rgba(30, 18, 8, 0.6)';
  ctx.fillRect(0, 0, DK_CONFIG.width, DK_CONFIG.height);
  ctx.fillStyle = '#fff8ec';
  rr(ctx, 340, 180, 600, 330, 20);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = 'bold 52px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 640, 232);
  ctx.fillStyle = '#3b2a1e';
  ctx.font = '22px Arial, sans-serif';
  let y = 300;
  for (const line of lines) {
    ctx.fillText(line, 640, y);
    y += 36;
  }
  ctx.fillStyle = '#8a7a63';
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText(foot, 640, 460);
  ctx.textAlign = 'left';
}

function drawGame(ctx) {
  drawBackground(ctx);
  drawHUD(ctx);
  drawOrderBoard(ctx);
  drawBoardStation(ctx);
  drawStove(ctx);
  drawPlateArea(ctx);
  drawCounter(ctx);
  drawServeButton(ctx);
  drawMessage(ctx);
  drawHelp(ctx);
  drawHand(ctx);
  if (DKState.screen === 'title') {
    drawTitle(ctx);
  } else if (DKState.screen === 'paused') {
    ctx.fillStyle = 'rgba(30, 18, 8, 0.55)';
    ctx.fillRect(0, 0, DK_CONFIG.width, DK_CONFIG.height);
    ctx.fillStyle = '#fff8ec';
    ctx.font = 'bold 52px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('JEDA', 640, 330);
    ctx.font = '22px Arial, sans-serif';
    ctx.fillStyle = '#3b2a1e';
    ctx.fillText('Tekan P atau klik untuk lanjut', 640, 390);
    ctx.textAlign = 'left';
  } else if (DKState.screen === 'complete') {
    drawEndPanel(ctx, 'HARI SELESAI!', DK_PALETTE.good, [
      'Semua ' + DK_CONFIG.ordersToWin + ' pesanan tersaji.',
      'Koin: ' + DKState.coins + '   •   Kombo terbaik: x' + DKState.bestCombo,
      'Waktu shift: ' + formatTime(DKState.time) + '   •   Pesanan hangus: ' + DKState.strikes,
    ], 'Tekan R atau klik untuk main lagi');
  } else if (DKState.screen === 'gameover') {
    drawEndPanel(ctx, 'SHIFT BERAKHIR', DK_PALETTE.danger, [
      'Tiga pesanan hangus — pelanggan pulang.',
      'Koin: ' + DKState.coins + '   •   Tersaji: ' + DKState.served + '/' + DK_CONFIG.ordersToWin,
      'Kombo terbaik: x' + DKState.bestCombo + '   •   Waktu: ' + formatTime(DKState.time),
    ], 'Tekan R atau klik untuk coba lagi');
  }
}
