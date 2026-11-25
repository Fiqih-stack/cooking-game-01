// Dapur Kilat — a tiny static server for local play-testing only.
// Serves game/ at http://localhost:8080/. Not part of the entry: main.ts
// copies only game/ and screenshots/ into the output directory.

import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), 'game');
const port = 8080;
const types: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

const server = createServer((req, res) => {
  const raw = req.url === '/' || req.url === undefined ? '/index.html' : req.url.split('?')[0];
  const file = join(root, raw);
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});

server.listen(port, () => {
  console.log('Dapur Kilat at http://localhost:' + port + '/');
  console.log('Shots: ?shot=start | ?shot=play | ?shot=serve | ?shot=end');
});
