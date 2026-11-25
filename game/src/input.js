// Dapur Kilat — input.
// One job: turn mouse clicks and keys into game actions.
// Geometry comes from DK_LAYOUT, rules from state.js.

const DKMouse = { x: 0, y: 0 };

function pointInRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function ticketRect(index) {
  const t = DK_LAYOUT.ticket;
  return { x: DK_LAYOUT.board.x, y: t.y0 + index * (t.h + t.gap), w: t.w, h: t.h };
}

function counterSlotRect(index) {
  const c = DK_LAYOUT.counter;
  return {
    x: c.x0 + index * (c.slotW + c.gap),
    y: c.y,
    w: c.slotW,
    h: c.h,
  };
}

function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * DK_CONFIG.width,
    y: ((event.clientY - rect.top) / rect.height) * DK_CONFIG.height,
  };
}

function handleClick(x, y) {
  DKMouse.x = x;
  DKMouse.y = y;
  if (DKState.screen === 'title') {
    resetGame();
    return;
  }
  if (DKState.screen === 'complete' || DKState.screen === 'gameover') {
    resetGame();
    return;
  }
  if (DKState.screen === 'paused') {
    DKState.screen = 'playing';
    return;
  }
  if (DKState.screen !== 'playing') return;

  // Order tickets: click a ready one to serve it.
  for (let i = 0; i < DKState.orders.length; i++) {
    if (pointInRect(x, y, ticketRect(i))) {
      const order = DKState.orders[i];
      if (matchingOrder() === order) serveOrder(order);
      else showMessage('Piring belum cocok dengan pesanan ini.');
      return;
    }
  }
  if (pointInRect(x, y, DK_LAYOUT.boardStation)) {
    clickStation('board');
    return;
  }
  if (pointInRect(x, y, DK_LAYOUT.stove)) {
    clickStation('stove');
    return;
  }
  if (pointInRect(x, y, DK_LAYOUT.plate)) {
    clickPlate();
    return;
  }
  if (pointInRect(x, y, DK_LAYOUT.serve)) {
    if (!serveFirstMatch()) showMessage('Belum ada pesanan yang cocok dengan piring.');
    return;
  }
  for (let i = 0; i < currentCounterSlots().length; i++) {
    if (pointInRect(x, y, counterSlotRect(i))) {
      pickIngredient(currentCounterSlots()[i]);
      return;
    }
  }
}

function handleKey(key) {
  if (key === 'Enter' && (DKState.screen === 'title' || DKState.screen === 'complete' || DKState.screen === 'gameover')) {
    resetGame();
    return;
  }
  if (key === 'r' || key === 'R') {
    if (DKState.screen !== 'title') resetGame();
    return;
  }
  if (key === 'p' || key === 'P') {
    if (DKState.screen === 'playing') DKState.screen = 'paused';
    else if (DKState.screen === 'paused') DKState.screen = 'playing';
    return;
  }
  if (DKState.screen !== 'playing') return;
  if (key === ' ') {
    serveFirstMatch();
    return;
  }
  const n = parseInt(key, 10);
  if (n >= 1 && n <= 6) {
    const slots = currentCounterSlots();
    if (slots[n - 1] !== undefined) pickIngredient(slots[n - 1]);
  }
}

// Whether a point sits on something clickable while playing, so the
// cursor can turn into a pointer over it.
function isInteractive(x, y) {
  if (DKState.screen !== 'playing') return false;
  for (let i = 0; i < DKState.orders.length; i++) {
    if (pointInRect(x, y, ticketRect(i))) return true;
  }
  if (
    pointInRect(x, y, DK_LAYOUT.boardStation) ||
    pointInRect(x, y, DK_LAYOUT.stove) ||
    pointInRect(x, y, DK_LAYOUT.plate) ||
    pointInRect(x, y, DK_LAYOUT.serve)
  ) {
    return true;
  }
  for (let i = 0; i < currentCounterSlots().length; i++) {
    if (pointInRect(x, y, counterSlotRect(i))) return true;
  }
  return false;
}

function initInput(canvas) {
  canvas.addEventListener('click', (event) => {
    const p = canvasPoint(canvas, event);
    handleClick(p.x, p.y);
  });
  canvas.addEventListener('mousemove', (event) => {
    const p = canvasPoint(canvas, event);
    DKMouse.x = p.x;
    DKMouse.y = p.y;
    canvas.style.cursor = isInteractive(p.x, p.y) ? 'pointer' : 'default';
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === ' ') event.preventDefault();
    handleKey(event.key);
  });
}
