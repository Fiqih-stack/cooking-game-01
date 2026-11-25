// Dapur Kilat — the entry program.
// One job: copy game/ and screenshots/ beside it into the output directory
// and write /output/dossier.json with buildDossier from vendor/makefun-game.ts.
// Runs on Node 22, standard library only; reads MAKEFUN_OUTPUT_DIR as a
// plain path (data, never code) and writes the same bytes on every run.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyFresh(from: string, to: string): void {
  if (existsSync(to)) rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
}

function main(): void {
  if (!existsSync(join(repoRoot, 'game'))) {
    throw new Error('main.ts: game/ is missing beside main.ts');
  }
  if (!existsSync(join(repoRoot, 'screenshots'))) {
    throw new Error('main.ts: screenshots/ is missing beside main.ts');
  }
  mkdirSync(outDir, { recursive: true });
  copyFresh(join(repoRoot, 'game'), join(outDir, 'game'));
  copyFresh(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'));
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
}

main();
