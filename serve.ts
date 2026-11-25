// Dapur Kilat — local test server. Serves game/ at http://localhost:8080/.
// Not part of the entry: main.ts only copies game/ and screenshots/.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), 'game');
const types: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
};

const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  const path = url === '/' ? '/index.html' : url;
  try {
    const data = await readFile(join(root, path));
    res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Dapur Kilat: file tidak ditemukan');
  }
});

const port = 8080;
server.listen(port, () => {
  console.log('Dapur Kilat at http://localhost:' + port + '/');
});
