// Dapur Kilat v23 — harness (buildDossier).
// Harness v1 untuk main.ts (Node 22, stdlib-only).
// Dipertahankan dari v19/v20:
// - buildDossier(dir, caps) MENGEMBALIKAN byte (tidak menulis file);
//   main.ts HARUS menulisnya (cp + writeFile) — pelajaran v19.
// - caps harus format nested: screenshots: { max, max_bytes }.
// - File di /output: dossier.json + file game/ + screenshots/ (4 JPEG).
// - buildDossier TIDAK membaca game/src/shots.js / serve.ts:
//   screenshot diambil dari game/screenshots/*.jpg (input manual).

import { buildDossier } from './vendor/makefun-game.ts';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dir = process.argv[2] ?? '.';
const caps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

const bytes = buildDossier(dir, caps);
await mkdir(join(dir, 'output'), { recursive: true });
await writeFile(join(dir, 'output', 'dossier.json'), bytes);
