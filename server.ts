import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { handleNodeRequest } from './src/server/nodeBridge';
import { POST as contactHandler } from './app/api/contact/route';
import { POST as quoteHandler } from './app/api/quote/route';
import { POST as careersHandler } from './app/api/careers/route';
import { GET as verifySmtpHandler } from './app/api/verify-smtp/route';
import { handleAdminApiRequest } from './src/server/adminApiHandler';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// API Routes
app.all('/api/catalog', (req, res) => {
  handleNodeRequest(req, res, handleAdminApiRequest);
});

app.all('/api/cms*', (req, res) => {
  handleNodeRequest(req, res, handleAdminApiRequest);
});

app.all('/api/admin*', (req, res) => {
  handleNodeRequest(req, res, handleAdminApiRequest);
});

app.post('/api/contact', (req, res) => {
  handleNodeRequest(req, res, contactHandler);
});

app.post('/api/quote', (req, res) => {
  handleNodeRequest(req, res, quoteHandler);
});

app.post('/api/careers', (req, res) => {
  handleNodeRequest(req, res, careersHandler);
});

app.get('/api/verify-smtp', (req, res) => {
  handleNodeRequest(req, res, verifySmtpHandler);
});


import fs from 'fs';
import { ensureUploadsDir, getUploadsDir, getLegacyUploadsDir } from './src/server/imageService';

// Ensure persistent uploads directory is initialized
const uploadsDir = ensureUploadsDir();
const legacyUploads = getLegacyUploadsDir();

console.log(`[DEYSLA Storage] Uploads storage directory initialized at: "${uploadsDir}"`);

// 1. Serve persistent uploads via /uploads with fallback to legacy uploads
app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));
if (fs.existsSync(legacyUploads)) {
  app.use('/uploads', express.static(legacyUploads, { maxAge: '7d' }));
}

// 2. Serve legacy /assets/uploads from uploadsDir with fallback to public/assets/uploads
app.use('/assets/uploads', express.static(uploadsDir, { maxAge: '7d' }));
if (fs.existsSync(legacyUploads)) {
  app.use('/assets/uploads', express.static(legacyUploads, { maxAge: '7d' }));
}

// 3. Serve frontend static build
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// 4. Fallback serve public folder for bundled static assets (e.g. /assets/products/...)
const publicPath = path.resolve(process.cwd(), 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// 5. SPA fallback routing: return index.html for page navigation, 404 for missing static assets
app.get('*', (req, res) => {
  // If request targets a missing asset file, return clean 404 rather than HTML
  if (req.path.match(/\.(png|jpg|jpeg|webp|svg|ico|gif|mp4|webm|pdf|json|css|js|map|woff|woff2|ttf|eot)$/i)) {
    return res.status(404).send('Asset not found');
  }

  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // If running in development without dist, check public index or return notice
    const publicIndex = path.join(publicPath, 'index.html');
    if (fs.existsSync(publicIndex)) {
      res.sendFile(publicIndex);
    } else {
      res.status(503).send('Application build not found. Please run "npm run build" to generate client bundle.');
    }
  }
});

const server = app.listen(PORT, () => {
  console.log(`[DEYSLA Server] Running on http://localhost:${PORT}`);
  console.log(`[DEYSLA Server] Serving static uploads from: ${uploadsDir}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[DEYSLA Server Error] Port ${PORT} is already in use by another process.`);
    console.error(`To fix: terminate the existing process or run with a different port (e.g. PORT=3002 npm start).\n`);
  } else {
    console.error('[DEYSLA Server Error]:', err);
  }
  process.exit(1);
});

