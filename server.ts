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


// Serve frontend static build
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[DEYSLA Server] Running on http://localhost:${PORT}`);
});
