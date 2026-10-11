import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, type ViteDevServer, type Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { extractPosterBuffer } from './src/utils/serverExtractor.js';
import { smtpApiPlugin } from './src/server/smtpVitePlugin.ts';

function posterApiPlugin(): Plugin {
  return {
    name: 'poster-api-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/extracted-status', (_req: IncomingMessage, res: ServerResponse) => {
        const publicDir = path.resolve(__dirname, 'public');
        const masterPath = path.join(publicDir, 'assets', 'deysla-solutions-library.png');
        const hasMaster = fs.existsSync(masterPath);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ hasMaster }));
      });

      server.middlewares.use('/api/extract-poster', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end('Method Not Allowed');
        }

        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', async () => {
          try {
            const rawBody = Buffer.concat(chunks).toString();
            const { imageBase64 } = JSON.parse(rawBody);
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');

            const publicDir = path.resolve(__dirname, 'public');
            const result = await extractPosterBuffer(buffer, publicDir);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, result }));
          } catch (err: unknown) {
            console.error('Error extracting poster:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            const message = err instanceof Error ? err.message : 'Unknown error';
            res.end(JSON.stringify({ error: message }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), posterApiPlugin(), smtpApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
