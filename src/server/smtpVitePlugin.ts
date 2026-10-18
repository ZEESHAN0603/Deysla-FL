import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { handleNodeRequest } from './nodeBridge.ts';
import { POST as contactHandler } from '../../app/api/contact/route.ts';
import { POST as quoteHandler } from '../../app/api/quote/route.ts';
import { POST as careersHandler } from '../../app/api/careers/route.ts';
import { GET as verifySmtpHandler } from '../../app/api/verify-smtp/route.ts';
import { handleAdminApiRequest } from './adminApiHandler.ts';

import fs from 'fs';
import { getUploadsDir, getLegacyUploadsDir, ensureUploadsDir } from './imageService.ts';

// Load .env and .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function serveFileFromDisk(dir: string, req: IncomingMessage, res: ServerResponse): boolean {
  try {
    const rawUrl = (req.url || '').split('?')[0];
    const cleanSubPath = rawUrl
      .replace(/^\/?(assets\/uploads|uploads)\/?/i, '')
      .replace(/^\/+/, '');

    if (!cleanSubPath) return false;

    const resolvedDir = path.resolve(dir);
    const targetPath = path.resolve(resolvedDir, cleanSubPath);
    const normalizedDir = resolvedDir.endsWith(path.sep) ? resolvedDir : resolvedDir + path.sep;

    if (!targetPath.startsWith(normalizedDir) && targetPath !== resolvedDir) return false;

    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
      const ext = path.extname(targetPath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.webp': 'image/webp',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.gif': 'image/gif',
      };
      res.statusCode = 200;
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      fs.createReadStream(targetPath).pipe(res);
      return true;
    }
  } catch (err) {
    console.error('[DEYSLA Vite Static Error]:', err);
  }
  return false;
}

export function smtpApiPlugin(): Plugin {
  return {
    name: 'smtp-api-plugin',
    configureServer(server: ViteDevServer) {
      const uploadsDir = ensureUploadsDir();
      const legacyUploads = getLegacyUploadsDir();

      // Serve persistent uploads
      server.middlewares.use('/uploads', (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (serveFileFromDisk(uploadsDir, req, res)) return;
        if (fs.existsSync(legacyUploads) && serveFileFromDisk(legacyUploads, req, res)) return;
        next();
      });

      server.middlewares.use('/assets/uploads', (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (serveFileFromDisk(uploadsDir, req, res)) return;
        if (fs.existsSync(legacyUploads) && serveFileFromDisk(legacyUploads, req, res)) return;
        next();
      });

      server.middlewares.use('/api/catalog', (req: IncomingMessage, res: ServerResponse) => {
        handleNodeRequest(req, res, handleAdminApiRequest);
      });

      server.middlewares.use('/api/cms', (req: IncomingMessage, res: ServerResponse) => {
        handleNodeRequest(req, res, handleAdminApiRequest);
      });

      server.middlewares.use('/api/admin', (req: IncomingMessage, res: ServerResponse) => {
        handleNodeRequest(req, res, handleAdminApiRequest);
      });

      server.middlewares.use('/api/contact', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
        handleNodeRequest(req, res, contactHandler);
      });

      server.middlewares.use('/api/quote', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
        handleNodeRequest(req, res, quoteHandler);
      });

      server.middlewares.use('/api/careers', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
        handleNodeRequest(req, res, careersHandler);
      });

      server.middlewares.use('/api/verify-smtp', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
        handleNodeRequest(req, res, verifySmtpHandler);
      });
    },
  };
}

