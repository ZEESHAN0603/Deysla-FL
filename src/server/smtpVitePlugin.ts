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

// Load .env and .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export function smtpApiPlugin(): Plugin {
  return {
    name: 'smtp-api-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/catalog', (req: IncomingMessage, res: ServerResponse) => {
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

