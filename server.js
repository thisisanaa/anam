const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PRIMARY_FRAMES_DIR = 'C:\\Users\\Lenovo\\Downloads\\frames perfume';
const FALLBACK_FRAMES_DIR = 'C:\\Users\\Lenovo\\Downloads\\perfumes new';
const FRAMES_DIR = fs.existsSync(PRIMARY_FRAMES_DIR) ? PRIMARY_FRAMES_DIR : FALLBACK_FRAMES_DIR;
const MP4_PATH = 'C:\\Users\\Lenovo\\Downloads\\Perfume_product_prompt_request_202609081704.mp4';
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

function getFrameFiles() {
  try {
    if (!fs.existsSync(FRAMES_DIR)) {
      console.warn(`FRAMES_DIR not found: ${FRAMES_DIR}`);
      return [];
    }
    const files = fs.readdirSync(FRAMES_DIR);
    const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
    return files
      .filter(f => imageExtensions.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  } catch (err) {
    console.error('Error reading frames directory:', err);
    return [];
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Stream HD MP4 video with HTTP 206 Partial Content (Range requests)
  if (pathname === '/video/perfume.mp4') {
    if (!fs.existsSync(MP4_PATH)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Video Not Found');
      return;
    }

    const stat = fs.statSync(MP4_PATH);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (req.method === 'HEAD') {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600'
      });
      res.end();
      return;
    }

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(MP4_PATH, { start, end });

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
        'Cache-Control': 'no-cache'
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache'
      };

      res.writeHead(200, head);
      fs.createReadStream(MP4_PATH).pipe(res);
    }
    return;
  }

  // API endpoint: list frames
  if (pathname === '/api/frames') {
    const frameFiles = getFrameFiles();
    const frameUrls = frameFiles.map(f => `/perfume-frames/${encodeURIComponent(f)}`);
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({
      totalFrames: frameUrls.length,
      frames: frameUrls,
      source: path.basename(FRAMES_DIR),
      directory: FRAMES_DIR,
      videoUrl: '/video/perfume.mp4'
    }));
    return;
  }

  // Serve image frame files
  if (pathname.startsWith('/perfume-frames/') || pathname.startsWith('/frames/')) {
    let filename = pathname.replace('/perfume-frames/', '').replace('/frames/', '');
    filename = filename.split('?')[0]; // Strip query parameters if any
    let safePath = path.normalize(path.join(FRAMES_DIR, filename));

    if (!fs.existsSync(safePath) && fs.existsSync(FALLBACK_FRAMES_DIR)) {
      safePath = path.normalize(path.join(FALLBACK_FRAMES_DIR, filename));
    }

    if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
      const ext = path.extname(safePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'image/jpeg';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable'
      });
      fs.createReadStream(safePath).pipe(res);
      return;
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Frame Not Found: ' + filename);
      return;
    }
  }

  // Serve static files
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, pathname);
  const normalizedFilePath = path.normalize(filePath);

  if (!normalizedFilePath.startsWith(path.normalize(PUBLIC_DIR))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(normalizedFilePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(normalizedFilePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    fs.createReadStream(normalizedFilePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`SCANDAL HD Server running at http://localhost:${PORT}/`);
  console.log(`Source directory: ${FRAMES_DIR}`);
  console.log(`HD Video source: ${MP4_PATH}`);
});
