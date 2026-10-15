# DEYSLA IT Solutions — Production Deployment Guide

This document details the production deployment process, infrastructure prerequisites, hosting architecture options, security hardening, and troubleshooting procedures for the DEYSLA IT Solutions website.

---

## 1. Hosting Architecture & Requirements

The DEYSLA platform requires a **Node.js runtime environment** to operate its full suite of features:
- Dynamic REST API endpoints (`/api/catalog`, `/api/cms/*`, `/api/admin/*`)
- Automated SMTP email dispatch (`/api/contact`, `/api/quote`, `/api/careers`)
- Dual-mode MySQL/JSON data persistence
- Single-page application static asset delivery

### 1.1 Supported Hosting Environments

| Hosting Environment | Compatibility | Notes |
| :--- | :--- | :--- |
| **Node.js Cloud / VPS (Ubuntu/Debian)** | **Recommended** | Full control over Node process, PM2 process management, Nginx reverse proxy, and SSL certificates via Let's Encrypt. |
| **Hostinger Node.js Web Hosting** | **Supported** | Can run `npm run start` (`server.ts`) with Hostinger MySQL `u157314465_DEYSLA` over local socket (`localhost:3306`). |
| **Docker / Container Hosting (AWS ECS, GCP Cloud Run, DigitalOcean App Platform)** | **Supported** | Easily containerized using Node 20/22 LTS base image. |
| **Static-Only Hosting (GitHub Pages, Netlify Static, Cloudflare Pages static)** | **Not Recommended** | Frontend UI will render, but backend API endpoints, contact submissions, RFQ quote emails, and admin panel will not function without serverless function adaptations. |

---

## 2. Production Build Workflow

Deploying the platform involves two core steps: compiling the frontend client bundle and starting the Node.js production server.

### Step 1: Install Production Dependencies
```bash
npm install
```

### Step 2: Validate TypeScript Compilation
```bash
npm run lint
```

### Step 3: Compile the Frontend Bundle
```bash
npm run build
```
This builds the production single-page application into the `dist/` directory:
- `dist/index.html` — Production HTML entry point
- `dist/assets/index-*.css` — Minified, purged CSS bundle
- `dist/assets/index-*.js` — Minified, bundled React JavaScript application
- `dist/assets/` — Copied public media, logos, and images

### Step 4: Run Database Migrations (When using MySQL)
```bash
npm run db:migrate
```
Applies schema updates to the production MySQL database (`u157314465_DEYSLA`) without altering any existing unrelated databases.

### Step 5: Start the Production Server
```bash
npm run start
```
*(Runs `tsx server.ts`, which starts Express listening on `PORT` and serves `dist/` along with all API routes).*

---

## 3. Production Process Management (PM2)

For continuous operation on Linux VPS or dedicated servers, use **PM2** to manage the Node.js process:

```bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Start application with tsx
pm2 start "npx tsx server.ts" --name "deysla-server" --time

# 3. Save PM2 state for automatic restart on server reboot
pm2 save
pm2 startup
```

### Useful PM2 Commands:
```bash
pm2 status                  # Check process health
pm2 logs deysla-server      # View real-time application logs
pm2 reload deysla-server    # Zero-downtime reload
pm2 stop deysla-server      # Stop server
```

---

## 4. Reverse Proxy Configuration (Nginx)

When deploying behind Nginx on a Linux server, configure a server block to forward web traffic to the local Express port:

```nginx
server {
    listen 80;
    server_name deysla.com www.deysla.com;

    # Redirect all HTTP traffic to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name deysla.com www.deysla.com;

    ssl_certificate /etc/letsencrypt/live/deysla.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deysla.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location /assets/ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 5. Environment Variables & Secret Protection

Ensure production secrets are loaded via server environment variables or an uncommitted `.env` file with restricted read permissions (`chmod 600 .env` on Linux):

1. **`DB_PASSWORD`**: Set to the strong password of Hostinger user `u157314465_DEYSLA`.
2. **`ADMIN_PASSWORD`**: Set to a robust password (minimum 16 characters).
3. **`ADMIN_JWT_SECRET`**: Set to a cryptographically secure random string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. **`SMTP_PASS`**: App password for the designated mail account (`info@deysla.com`).
5. **`VITE_GOOGLE_MAPS_API_KEY`**: Restrict this key in Google Cloud Console to the authorized production domains (`deysla.com`, `*.deysla.com`).

---

## 6. Post-Deployment Verification Checklist

After deploying to production, execute the following verification steps:

- [ ] **Home Page**: Navigate to `https://deysla.com/` and confirm video loads, fonts render, and navigation operates in both English and Arabic.
- [ ] **API Health**: Request `https://deysla.com/api/catalog` and verify a valid JSON response is returned.
- [ ] **CMS Status**: Check `https://deysla.com/api/cms/content` to confirm live content delivery.
- [ ] **Database Connection**: In the Admin Dashboard (`/admin`), confirm the database status indicator shows **Connected to MySQL (`u157314465_DEYSLA`)**.
- [ ] **SMTP Verification**: Request `/api/verify-smtp` or submit a test inquiry on `/contact` to confirm email delivery to `info@deysla.com`.
- [ ] **Quotation Workflow**: Add a product to the RFQ cart on `/products`, complete the quotation form on `/cart`, and verify receipt of the quote email.
- [ ] **Admin Authentication**: Verify that `/admin` requires login and unauthenticated access to `/api/admin/*` returns HTTP 401.
