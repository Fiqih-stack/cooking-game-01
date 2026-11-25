// Dapur Kilat v11 — server lokal untuk render screenshot.
// `/` redirect 302 ke `/game/index.html` dengan query dipertahankan,
// supaya path relatif `./src/main.js` tidak 404 (bug serve.ts v7/v8).
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'game');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost:8080');
  if (url.pathname === '/') {
    res.writeHead(302, { Location: `/game/index.html${url.search}` });
    res.end();
    return;
  }
  let path = url.pathname;
  if (path.startsWith('/game/')) path = path.slice('/game/'.length);
  const file = join(root, path);
  if (!existsSync(file)) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});

server.listen(8080, () => {
  console.log('Dapur Kilat di http://localhost:8080/ (redirect ke /game/index.html)');
});
