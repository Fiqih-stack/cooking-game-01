// Dapur Kilat v20 — suara & musik (WebAudio, tanpa file eksternal).
// Semua bunyi disintesis dengan oscillator. Aman dipanggil di Node /
// headless (tanpa AudioContext): semua fungsi jadi no-op diam-diam.
// state.js hanya mendorong nama ke s.sfx; main.js menguras antrean dan
// memanggil playSfx di sini. Musik dimulai setelah gestur pertama.

let ctx = null; // AudioContext (null bila tak tersedia)
let muted = false;
let musicTimer = null;
let musicStep = 0;

// Melodi ceria 8 langkah (pentatonik C mayor) + bass tiap 4 langkah.
const MELODY = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 440.0];
const BASS = [130.81, 130.81, 174.61, 196.0];

export function setMuted(m) {
  muted = !!m;
  if (muted) stopMusic();
}

export function isMuted() {
  return muted;
}

// Buat/resume AudioContext. Dipanggil saat gestur pertama (klik/tombol).
// Kembalikan true bila audio siap.
export function ensureAudio() {
  try {
    if (typeof window === 'undefined') return false;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx.state === 'running';
  } catch (e) {
    return false;
  }
}

// Satu nada oscillator.
function tone(freq, dur, type, vol, when = 0) {
  if (!ctx || muted) return;
  try {
    const t0 = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  } catch (e) {
    // Audio gagal di tengah jalan: diam saja, game tetap jalan.
  }
}

// Arpeggio: beberapa nada berurutan.
function arp(notes, step, dur, type, vol) {
  notes.forEach((f, i) => tone(f, dur, type, vol, i * step));
}

export function playSfx(name) {
  if (muted) return;
  if (!ctx) {
    // Belum ada gestur / tak ada audio: coba siapkan sekali.
    if (!ensureAudio()) return;
  }
  if (!ctx || ctx.state !== 'running') return;
  switch (name) {
    case 'pick': tone(600, 0.08, 'sine', 0.12); break;
    case 'place': tone(300, 0.1, 'triangle', 0.14); break;
    case 'stationDone': tone(880, 0.18, 'sine', 0.14); break;
    case 'serve': arp([523.25, 659.25, 783.99], 0.07, 0.16, 'triangle', 0.14); break;
    case 'perfect': arp([523.25, 659.25, 783.99, 1046.5], 0.06, 0.18, 'sine', 0.14); break;
    case 'strike': tone(150, 0.35, 'sawtooth', 0.1); break;
    case 'rush': arp([392, 523.25, 659.25, 783.99], 0.05, 0.12, 'square', 0.06); break;
    case 'coin': tone(988, 0.09, 'sine', 0.12); tone(1319, 0.14, 'sine', 0.1, 0.07); break;
    case 'click': tone(700, 0.05, 'square', 0.06); break;
    case 'levelUp': arp([523.25, 659.25, 783.99, 1046.5, 1318.5], 0.07, 0.18, 'triangle', 0.13); break;
    case 'win': arp([523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5], 0.12, 0.25, 'triangle', 0.13); break;
    case 'over': arp([392, 330, 262, 196], 0.14, 0.25, 'sawtooth', 0.07); break;
    default: break;
  }
}

// Musik latar: satu langkah tiap 320ms (melodi + bass tiap 4 langkah).
function musicTick() {
  if (!ctx || muted || ctx.state !== 'running') return;
  const m = MELODY[musicStep % MELODY.length];
  tone(m, 0.28, 'triangle', 0.035);
  if (musicStep % 4 === 0) {
    tone(BASS[(musicStep / 4) % BASS.length], 0.5, 'sine', 0.05);
  }
  musicStep++;
}

export function startMusic() {
  if (musicTimer) return;
  if (!ensureAudio()) return;
  try {
    musicTimer = setInterval(musicTick, 320);
  } catch (e) {
    musicTimer = null;
  }
}

export function stopMusic() {
  if (musicTimer) {
    try { clearInterval(musicTimer); } catch (e) { /* abaikan */ }
    musicTimer = null;
  }
}

// Dipanggil tiap frame dari main.js: nyalakan musik saat main & tak bisu,
// matikan di layar lain / saat bisu.
export function updateMusic(shouldPlay) {
  if (shouldPlay && !muted) startMusic();
  else stopMusic();
}
