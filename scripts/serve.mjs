import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, sep } from 'node:path';

await import('./build.mjs');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
http.createServer(async (req,res)=>{
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream','Cache-Control':'no-store'}).end(body);
  } catch { res.writeHead(404, {'Content-Type':'text/plain'}).end('Not found'); }
}).listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}`));
