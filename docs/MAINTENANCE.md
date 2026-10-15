# DEYSLA IT Solutions — Maintenance & Operations Guide

This guide covers routine maintenance, backup procedures, catalog updates, database operations, security patching, and troubleshooting for the DEYSLA IT Solutions website.

---

## 1. Backup & Recovery Procedures

The platform utilizes a dual-mode persistence architecture (MySQL + JSON fallback). Maintaining regular backups ensures uninterrupted operations.

### 1.1 Automated & Manual JSON Backups
The application provides built-in catalog snapshot capabilities:
- **Via Admin Dashboard**: Navigate to `/admin` &rarr; Click **"Create Backup"** in the overview bar.
- **Via API**: Send an authenticated `POST` request to `/api/admin/backup`.
- **Snapshot Storage**: Snapshots are generated in `data/db/` with timestamped filenames (`catalog_backup_*.json`).

### 1.2 MySQL Database Backup (`mysqldump`)
Run regular SQL dumps of the Hostinger MySQL database (`u157314465_DEYSLA`):

```bash
# Export schema and data to a compressed SQL dump:
mysqldump -h srv1412.hstgr.io -u u157314465_DEYSLA -p u157314465_DEYSLA > backup_deysla_$(date +%F_%T).sql
```

### 1.3 Restoring from Backup
- **To restore MySQL**:
  ```bash
  mysql -h srv1412.hstgr.io -u u157314465_DEYSLA -p u157314465_DEYSLA < backup_deysla_YYYY-MM-DD.sql
  ```
- **To restore JSON fallback**:
  Copy the desired snapshot from `data/db/catalog_backup_*.json` over `data/db/catalog.json`.

---

## 2. Product Catalogue & Asset Management

### 2.1 Managing Products and Brands via Admin Panel
Administrative users can perform day-to-day catalogue management directly at `/admin`:
- **Products**: Add new product families, edit descriptions, adjust category mappings, or toggle visibility without code changes.
- **Sub-Products (SKUs)**: Add individual models with part numbers, technical specifications, and high-resolution photography.
- **Brands**: Manage OEM partner brands, logos, website links, and associated categories.
- **Image Management**: Use the built-in **Image Picker Modal** to select from existing media in `public/assets/` or upload new images. Uploaded images are automatically processed and compressed via `sharp` on the server.

### 2.2 CLI Maintenance Scripts
The `scripts/` directory contains specialized utilities:
- **`scripts/buildEcommerceCatalogImages.js`**: Scans and normalizes product photography dimensions.
- **`scripts/generateProductsCatalog.js`**: Generates and compiles product categories and specification trees.
- **`scripts/testSmtpIntegration.ts`**: Runs end-to-end testing of SMTP mail dispatch across inquiry, quotation, and career forms.

---

## 3. CMS Content Updates

The Content Management System allows instant modification of website sections without recompilation:
- **Hero & Page Sections**: Adjust headlines, subheadings, and CTA button destinations under **Content Management** in `/admin`.
- **Corporate Services**: Manage enterprise service offerings, process steps, and deliverables under the **Services Tab**.
- **Case Studies / Projects**: Showcase completed infrastructure projects across government, industrial, and commercial sectors under the **Projects Tab**.
- **Reviews & Testimonials**: Review and approve client testimonials under the **Reviews Tab**.
- **Bilingual FAQs**: Maintain common questions in both English and Arabic under the **FAQs Tab**.

---

## 4. Safe Dependency Updates

To maintain stability and prevent breaking changes:

1. **Check for Security Advisories**:
   ```bash
   npm audit
   ```
2. **Review Outdated Packages**:
   ```bash
   npm outdated
   ```
3. **Update Minor/Patch Versions Safely**:
   ```bash
   npm update
   ```
4. **Mandatory Verification**:
   After any package update, run:
   ```bash
   npm run lint
   npm run build
   ```
   Confirm that all modules compile without error before deploying to production.

---

## 5. Secret Rotation Procedures

To rotate critical credentials safely:

### 5.1 SMTP Password Rotation
1. Generate a new App Password in your email provider dashboard (Google Workspace or Microsoft 365).
2. Update `SMTP_PASS` in `.env.local` / production environment variables.
3. Test using `npx tsx scripts/testSmtpIntegration.ts` or visit `/api/verify-smtp`.
4. Reload the server process (`pm2 reload deysla-server`).

### 5.2 Admin Authentication Secret Rotation
1. Generate a new 64-character random string for `ADMIN_JWT_SECRET`.
2. Update the environment variable and reload the server.
3. *Note:* Existing active administrator sessions will expire and require re-login.

### 5.3 MySQL Database Password Rotation
1. Update user password in Hostinger hPanel &rarr; **Databases**.
2. Update `DB_PASSWORD` in production server environment.
3. Restart server process and verify connection status in the Admin Dashboard.

---

## 6. Audit Logging & System Diagnostics

- **Admin Audit Trail**: Every administrative creation, modification, deletion, status toggle, or backup operation is permanently recorded in the audit log. View logs via the **Audit Logs Tab** in `/admin` or query `GET /api/admin/audit-logs`.
- **Application Server Logs**: View real-time standard output and error streams via PM2 (`pm2 logs deysla-server`) or systemd journal logs.
