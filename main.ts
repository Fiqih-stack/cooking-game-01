// Dapur Kilat v14 — program utama (Node 22, stdlib saja).
// Menyalin game/ + screenshots/ ke /output lalu menulis dossier.json
// via buildDossier(dir, caps) dari ./vendor/makefun-game.ts (salinan kit,
// tak diubah). buildDossier membaca game/ + screenshots/ dari dir itu
// sendiri dan mengembalikan dossier sebagai Uint8Array (JSON kanonis).
// (Pelajaran v12: JANGAN panggil buildDossier dengan objek {text, ...};
// signature-nya buildDossier(dir, caps).)

import { buildDossier } from './vendor/makefun-game.ts';
import { cp, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(join(outDir, 'game'), { recursive: true });
  await mkdir(join(outDir, 'screenshots'), { recursive: true });

  // Salin game/ (rekursif) + screenshots/ ke /output.
  await cp('game', join(outDir, 'game'), { recursive: true });
  await cp('screenshots', join(outDir, 'screenshots'), { recursive: true });

  // Dossier dari /output, dengan caps kontrak harness program/v1.
  const bytes = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  });
  await writeFile(join(outDir, 'dossier.json'), bytes);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
