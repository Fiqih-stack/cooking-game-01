// Dapur Kilat v14 — server lokal untuk render screenshot.
// Melayani game/ sebagai file statis; '/' dialihkan (302) ke
// /game/index.html dengan query dipertahankan (agar ?shot=... jalan).

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const ROOT = process.cwd();
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.ts': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.json': 'application/json',
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:8080');
  let path = url.pathname;
  if (path === '/') {
    res.writeHead(302, { Location: '/game/index.html' + url.search });
    res.end();
    return;
  }
  const file = join(ROOT, path);
  try {
    const buf = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

server.listen(8080, () => {
  console.log('Dapur Kilat di http://localhost:8080/');
});
