// Dapur Kilat — screenshot scenes.
// One job: ?shot=start|play|serve|end builds one fixed scene for the camera.
// The scene is frozen, so every render of it is the same picture.

function makeShotOrder(id, recipeId, frac) {
  const patience = patienceForOrder();
  return { id, recipeId, patience: patience * frac, maxPatience: patience };
}

function applyShot() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (shot === null) return;
  DKState.frozen = true;
  if (shot === 'start') {
    DKState.screen = 'title';
    DKState.orders = [makeShotOrder(1, 'nasi-goreng', 0.85), makeShotOrder(2, 'mie-ayam', 0.6)];
    DKState.coins = 0;
    DKState.served = 0;
    DKState.strikes = 0;
    DKState.combo = 0;
    return;
  }
  if (shot === 'play') {
    DKState.screen = 'playing';
    DKState.time = 20000;
    DKState.coins = 45;
    DKState.served = 4;
    DKState.strikes = 0;
    DKState.combo = 2;
    DKState.bestCombo = 3;
    DKState.orders = [
      makeShotOrder(3, 'nasi-goreng', 0.72),
      makeShotOrder(4, 'mie-ayam', 0.45),
      makeShotOrder(5, 'sate-ayam', 0.28),
    ];
    // One dish mid-assembly: rice and chicken already on the plate,
    // kecap still in hand; ice is being chopped, noodles on the stove.
    DKState.plate = [{ id: 'rice' }, { id: 'chicken' }];
    DKState.hand = { id: 'kecap', ready: true };
    DKState.board = { busy: { item: { id: 'ice', ready: false }, endsAt: 21100 }, done: null };
    DKState.stove = { busy: { item: { id: 'noodle', ready: false }, endsAt: 21600 }, done: null };
    DKState.message = 'Nasi Goreng hampir jadi!';
    DKState.messageAt = 20000;
    // The carried kecap shows in hand, halfway to the plate.
    DKMouse.x = 600;
    DKMouse.y = 380;
    return;
  }
  if (shot === 'serve') {
    DKState.screen = 'playing';
    DKState.time = 34000;
    DKState.coins = 80;
    DKState.served = 7;
    DKState.strikes = 0;
    DKState.combo = 3;
    DKState.bestCombo = 4;
    DKState.orders = [makeShotOrder(8, 'nasi-goreng', 0.55), makeShotOrder(9, 'es-teh', 0.8)];
    // The full Nasi Goreng on the plate, matching order #8.
    DKState.plate = [{ id: 'rice' }, { id: 'chicken' }, { id: 'kecap' }];
    DKState.hand = null;
    DKState.board = { busy: null, done: null };
    DKState.stove = { busy: null, done: null };
    DKState.message = 'Siap disajikan!';
    DKState.messageAt = 34000;
    return;
  }
  if (shot === 'end') {
    DKState.screen = 'complete';
    DKState.time = 514000;
    DKState.coins = 210;
    DKState.served = 12;
    DKState.strikes = 1;
    DKState.combo = 0;
    DKState.bestCombo = 5;
    DKState.orders = [];
    DKState.plate = [];
    DKState.hand = null;
    DKState.board = { busy: null, done: null };
    DKState.stove = { busy: null, done: null };
  }
}
