# DEYSLA IT Solutions — Local Setup & Configuration Guide

This guide provides step-by-step instructions for installing, configuring, and running the DEYSLA IT Solutions website in a local development environment.

---

## 1. Prerequisites & System Requirements

Ensure the following software packages are installed on your workstation:

- **Node.js**: Version 18.18.0 or higher (Node 20 or 22 LTS recommended).
- **NPM**: Version 9.0.0 or higher (comes bundled with Node.js).
- **Git**: For version control operations.
- **Operating System**: Windows, macOS, or Linux.
- **MySQL (Optional)**: If connecting to a local or remote MySQL instance; if not configured, the application automatically runs in JSON fallback mode.

Verify your environment:
```bash
node -v
npm -v
```

---

## 2. Installation Instructions

1. Clone or navigate to the project directory:
   ```bash
   cd D:\DEYSLA
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

> **Note:** Dependencies are locked in `package-lock.json`. Do not use `--force` or update package versions unless explicitly required.

---

## 3. Environment Configuration

The application loads environment variables in the following order of precedence:
1. `.env.local` (Local overrides; ignored by Git)
2. `.env` (Base environment configuration; ignored by Git)
3. Process environment variables provided by the operating system / hosting provider

### 3.1 Creating the Configuration File

Create a `.env.local` file in the project root by copying the template:

```bash
# On Windows PowerShell:
Copy-Item .env.example .env.local

# On macOS / Linux:
cp .env.example .env.local
```

### 3.2 Environment Variable Reference

Populate `.env.local` with your configuration. **Never commit real credentials to Git.**

```env
# ==============================================================================
# SMTP Email Configuration (Nodemailer)
# Server-side only: Used for Contact Us, RFQ Quotations, and Careers forms.
# ==============================================================================
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="info@deysla.com"
SMTP_PASS="your-smtp-password-or-app-password"
SMTP_FROM="DEYSLA IT Solutions <info@deysla.com>"
CONTACT_EMAIL="info@deysla.com"

# ==============================================================================
# Hostinger MySQL Database Configuration (Optional - Falls back to JSON DB)
# Target Database: u157314465_DEYSLA
# ==============================================================================
DB_HOST="srv1412.hstgr.io"
DB_PORT="3306"
DB_USER="u157314465_DEYSLA"
DB_PASSWORD="your-mysql-user-password"
DB_NAME="u157314465_DEYSLA"
DB_SSL="false"

# ==============================================================================
# Frontend & Third-Party APIs
# ==============================================================================
# GEMINI_API_KEY: Used for AI assistant features
GEMINI_API_KEY="your-gemini-api-key"

# APP_URL: Base URL of the running application
APP_URL="http://localhost:3000"

# VITE_GOOGLE_MAPS_API_KEY: Required for interactive location maps
VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# ==============================================================================
# Admin Dashboard Authentication (Server-side)
# ==============================================================================
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-this-to-a-strong-password"
ADMIN_JWT_SECRET="replace-with-a-random-secure-64-char-string"
```

---

## 4. Running the Local Development Server

Start the development server with Vite:

```bash
npm run dev
```

- The development server starts on `http://localhost:3000`.
- Vite serves the React single-page application with hot module replacement (HMR).
- Built-in Vite middleware plugins (`smtpApiPlugin` and `posterApiPlugin`) handle all backend `/api/*` endpoints directly, eliminating the need to run an external API process.

---

## 5. Database Setup (Optional MySQL Mode)

The website is fully functional out of the box using **JSON fallback storage** (`data/db/*.json`). To connect to the live or staging Hostinger MySQL database:

1. **Whitelist your IP**: Log into Hostinger hPanel &rarr; **Databases** &rarr; **Remote MySQL** and authorize your workstation's public IP address.
2. **Execute Database Migrations**:
   ```bash
   npm run db:migrate
   ```
   This will create the 17 required InnoDB tables with all keys and indexes.
3. **Seed Initial Catalog & CMS Data**:
   ```bash
   npm run db:seed
   ```
   This idempotently populates all products, brands, categories, services, case studies, gallery items, and FAQs.

> **Warning:** Running `npm run db:seed` performs an idempotent upsert. Always verify database backups before running migrations in production.

---

## 6. Testing & Validation

### 6.1 TypeScript Validation
Validate that all modules, components, and route typings compile cleanly:
```bash
npm run lint
```
*(Runs `tsc --noEmit`)*

### 6.2 Production Build Validation
Test bundling client assets for production:
```bash
npm run build
```
*(Outputs the production bundle to `dist/`)*

### 6.3 SMTP Integration Verification
Test email delivery and verify SMTP credentials:
```bash
npx tsx scripts/testSmtpIntegration.ts
```
Or check the browser endpoint: `http://localhost:3000/api/verify-smtp`.
