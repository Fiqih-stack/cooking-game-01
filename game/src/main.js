// Dapur Kilat — main loop.
// One job: run the frame loop, advance the game and draw it.
// Screens live in state.js, drawing in render.js, input in input.js.

const DKCanvas = document.getElementById('game');
const DKContext = DKCanvas.getContext('2d');
let DKLastTs = 0;

function frame(ts) {
  const dt = Math.min(100, ts - DKLastTs || 0);
  DKLastTs = ts;
  updateGame(dt);
  drawGame(DKContext);
  requestAnimationFrame(frame);
}

// The title shows a living kitchen behind it: two orders already on the
// board, waiting. Their patience does not drain until play starts.
function seedTitle() {
  DKState.screen = 'title';
  DKState.time = 0;
  DKState.coins = 0;
  DKState.served = 0;
  DKState.strikes = 0;
  DKState.combo = 0;
  DKState.bestCombo = 0;
  DKState.orders = [];
  DKState.nextOrderId = 1;
  DKState.hand = null;
  DKState.board = { busy: null, done: null };
  DKState.stove = { busy: null, done: null };
  DKState.plate = [];
  DKState.message = '';
  spawnOrder();
  spawnOrder();
}

function boot() {
  seedTitle();
  applyShot();
  initInput(DKCanvas);
  // Hiding the tab pauses the shift — no patience drains unseen.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && DKState.screen === 'playing') DKState.screen = 'paused';
  });
  requestAnimationFrame(frame);
}

boot();
