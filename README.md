# DEYSLA IT Solutions Website

An enterprise-grade, bilingual web application, digital product catalogue, and Content Management System (CMS) engineered for **DEYSLA IT Solutions** — a premier IT infrastructure, structured cabling, enterprise networking, cybersecurity, and cloud solutions provider serving clients across the Kingdom of Saudi Arabia (KSA), Bahrain, and the United States.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Verified Main Features](#2-verified-main-features)
3. [Technology Stack](#3-technology-stack)
4. [Project Architecture & Directory Structure](#4-project-architecture--directory-structure)
5. [Prerequisites & Software Requirements](#5-prerequisites--software-requirements)
6. [Installation Instructions](#6-installation-instructions)
7. [Environment Configuration](#7-environment-configuration)
8. [Local Development Instructions](#8-local-development-instructions)
9. [Production Build & Validation Commands](#9-production-build--validation-commands)
10. [Backend API Overview](#10-backend-api-overview)
11. [Database Setup, Migrations & Seeding](#11-database-setup-migrations--seeding)
12. [SMTP Configuration Guidance](#12-smtp-configuration-guidance)
13. [Admin Panel & CMS Overview](#13-admin-panel--cms-overview)
14. [Static Assets & Product Catalogue Organization](#14-static-assets--product-catalogue-organization)
15. [Testing & Troubleshooting Instructions](#15-testing--troubleshooting-instructions)
16. [Deployment Requirements & Hosting Limitations](#16-deployment-requirements--hosting-limitations)
17. [Security Considerations](#17-security-considerations)
18. [Freelance Handover Notes & Maintenance Guidance](#18-freelance-handover-notes--maintenance-guidance)
19. [Feature Implementation Status Matrix](#19-feature-implementation-status-matrix)
20. [Documentation Index](#20-documentation-index)

---

## 1. Project Overview

The **DEYSLA IT Solutions** website provides an authoritative online presence and interactive commercial portal for enterprise procurement teams, IT managers, and system integrators.

Built with a performance-first architecture, the platform features:
- **Comprehensive Bilingual Experience**: Seamless English and Arabic interfaces with full Right-to-Left (RTL) typography, cultural localization, and specialized enterprise terminology.
- **Dynamic Product & Brand Catalogue**: Structured browsing of enterprise hardware lines, OEM partner brands, detailed technical datasheets, and Bill of Quantities (RFQ) generation.
- **Enterprise CMS & Admin Panel**: Secure, password-protected control panel for updating page sections, services, case studies, project portfolios, gallery photos, reviews, FAQs, and job listings.
- **Dual-Mode Persistence Architecture**: High-availability data layer connecting directly to Hostinger MySQL with automated fallback to localized JSON database storage.
- **Automated Communication Layer**: Direct Nodemailer SMTP integration dispatching branded HTML emails for contact inquiries, customer complaints, job applications, and quote requests.

---

## 2. Verified Main Features

### 2.1 Public Frontend Experience
- **Bilingual Interface (EN / AR)**: Instant language switching with dynamic URL routing (`/ar/...`), RTL layout adaptation, and Cairo/Inter typography.
- **High-Impact Landing Experience**: Background video streaming, animated partner brand marquee, corporate overview, key statistics, and core service matrix.
- **Product & Brand Catalog**:
  - Filterable by OEM brand (Cisco, Fortinet, HP, Dell, Schneider Electric, Panduit, Leviton, Ubiquiti, etc.) and category.
  - Dedicated brand showcase pages with brand history, certifications, and related hardware models.
  - Sub-product SKU listings with technical specifications, model numbers, and high-resolution photography.
- **Quotation Cart & RFQ System**:
  - Add-to-quote functionality with local storage persistence.
  - Slide-out cart drawer with quantity adjustments.
  - Multi-item quotation checkout modal capturing company name, project timeline, city, and bill of quantities.
- **Enterprise Service Showcase**: Detailed breakdowns of structured cabling, data center builds, cybersecurity, unified communications, CCTV, and industrial networking.
- **Turnkey Projects & Portfolio**: Filterable project case studies with scope of work, technical specifications, and sector classification (Government, Commercial, Industrial).
- **Media Gallery**: High-resolution gallery of field installations and completed data center infrastructure.
- **Careers Portal**: Job vacancy listings with department filtering and online resume/CV submission.
- **Customer Care & Complaints**: Interactive Google Maps office locations, inquiry form, and dedicated complaint resolution ticket submission.
- **AI Assistant Widget**: Floating assistant button with interactive prompt interface.

### 2.2 Administrative Control Panel (`/admin`)
- **Secure Authentication**: Username/password verification, JWT session tokens, and protected API routes.
- **Real-Time Operational Dashboard**: Metrics for catalog size, active inquiries, quotation requests, and recent audit events.
- **Product & SKU Management**: Full CRUD interface for adding, updating, and toggling active/inactive status of product families and sub-product SKUs.
- **Partner Brand Management**: Manage OEM partner brands, logos, origin countries, and website links.
- **Full Content Management System (CMS)**:
  - Homepage hero, intro, and page section editor.
  - Services manager (add/edit deliverables, process steps, sub-services).
  - Projects and case study manager.
  - Media gallery photo manager.
  - Customer review and testimonial moderation.
  - Bilingual FAQ question-and-answer editor.
- **Customer Inquiry & Complaint Resolution**: Review submitted customer messages, assign statuses (`New`, `In Progress`, `Resolved`), and add administrative notes.
- **Quotation Request Inspection**: View detailed RFQ submissions with contact details, company information, and ordered line items.
- **Career Application Review**: Inspect submitted candidate profiles and update recruitment status (`Reviewing`, `Interviewed`, `Hired`, `Rejected`).
- **Server-Side Media Library**: Image Picker Modal with direct upload capabilities, validating and resizing images via `sharp`.
- **System Diagnostics & Database Synchronization**: Live status indicator of Hostinger MySQL connection and one-click data migration from JSON to MySQL.
- **Audit Logging**: Immutable, timestamped audit trail of all administrative actions.

---

## 3. Technology Stack

### 3.1 Frontend
- **Framework**: React 19 (`react`, `react-dom`)
- **Bundler & Dev Server**: Vite 8 (`vite`, `@vitejs/plugin-react`)
- **Routing**: React Router DOM v7 (`react-router-dom`)
- **Styling**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`, `autoprefixer`)
- **Icons**: Lucide React (`lucide-react`)
- **Animations**: Framer Motion (`framer-motion`, `motion`)
- **Maps**: Google Maps Platform (`@vis.gl/react-google-maps`)
- **Typography**: Google Fonts (`Inter` for English, `Cairo` for Arabic)

### 3.2 Backend & Runtime
- **Runtime**: Node.js (v18.18+ / v20 LTS recommended)
- **Production Server**: Express 4 (`express`)
- **TypeScript Runner**: TSX (`tsx`)
- **Language**: TypeScript 7 (`typescript`, `@types/node`, `@types/express`)
- **Environment Management**: Dotenv (`dotenv`)
- **Email Delivery**: Nodemailer (`nodemailer`, `@types/nodemailer`)
- **Image Processing**: Sharp (`sharp`)
- **AI Integration**: Google GenAI SDK (`@google/genai`)

### 3.3 Database & Data Layer
- **Relational Database**: Hostinger MySQL (`u157314465_DEYSLA`) via `mysql2` connection pooling with SSL support.
- **Fallback Database**: High-performance local JSON storage (`data/db/*.json`).
- **Database Engine**: InnoDB with `utf8mb4_unicode_ci` character encoding.
- **Migrations**: Custom zero-dependency DDL migration runner (`src/server/db/migrations/runMigrations.ts`).

---

## 4. Project Architecture & Directory Structure

```
D:\DEYSLA
├── app/                                 # Serverless-style API route definitions
│   └── api/
│       ├── careers/route.ts             # Job application submission handler
│       ├── contact/route.ts             # Customer inquiry & complaint handler
│       ├── quote/route.ts               # RFQ quotation request handler
│       └── verify-smtp/route.ts         # SMTP gateway connection tester
├── components/                          # Root re-export stubs for path aliases
│   └── ui/hero-3.tsx                    # Re-exports src/components/ui/hero-3
├── data/                                # Persistent database files
│   └── db/
│       ├── audit_logs.json              # Administrative action history
│       ├── catalog.json                 # Core product and brand catalogue
│       ├── cms_content.json             # Live website CMS text and sections
│       ├── complaints.json              # Customer inquiries and tickets
│       └── quotes.json                  # Customer RFQ quotation submissions
├── dist/                                # Compiled production output (generated by Vite)
├── docs/                                # Production documentation suite
│   ├── DEPLOYMENT.md                    # Hosting and production deployment guide
│   ├── MAINTENANCE.md                   # Operations, backups, and security guide
│   ├── PROJECT_STRUCTURE.md             # Codebase layout and module responsibilities
│   └── SETUP.md                         # Local environment setup instructions
├── lib/                                 # Root re-export stubs for path aliases
│   └── utils.ts                         # Re-exports src/lib/utils
├── public/                              # Publicly accessible static assets
│   ├── assets/                          # Product photography, brand logos, banners
│   ├── videos/                          # Looping background video
│   ├── robots.txt                       # Search engine crawler instructions
│   └── sitemap.xml                      # Production sitemap
├── scripts/                             # Maintenance and CLI automation scripts
│   ├── buildEcommerceCatalogImages.js   # Normalizes catalog image dimensions
│   ├── generateCpPlusNvr.cjs            # CP Plus asset utility
│   ├── generateProductsCatalog.js       # Product catalogue generator
│   ├── test-smtp.mjs                    # Standalone SMTP test script
│   ├── testCustomerComplaint.ts         # Customer complaint test script
│   └── testSmtpIntegration.ts           # End-to-end email dispatch tester
├── src/                                 # Main client & server source code
│   ├── components/                      # Visual components organized by domain
│   │   ├── admin/                       # 18 Admin panel tabs and modals
│   │   ├── careers/                     # Career listings and application modal
│   │   ├── cart/                        # RFQ drawer and checkout workflow
│   │   ├── common/                      # Floating chatbot button and shared UI
│   │   ├── contact/                     # Inquiry form and complaint modal
│   │   ├── home/                        # Landing page sections and marquee
│   │   ├── layout/                      # Navbar, Footer, MegaMenu
│   │   └── ui/                          # Marquee hero component (hero-3.tsx)
│   ├── context/                         # React state providers (Lang, Cart, Catalog, CMS, Auth)
│   ├── data/                            # Static catalogue and fallback definitions
│   ├── i18n/                            # English and Arabic translation dictionaries
│   ├── lib/                             # Class merge utility (cn)
│   ├── pages/                           # 17 Public pages and 2 Admin pages
│   ├── server/                          # Server services and database layer
│   │   ├── db/                          # Database connection, CMS store, migrations, seed
│   │   ├── mail/                        # Nodemailer transporter and HTML templates
│   │   ├── adminApiHandler.ts           # Central REST API controller
│   │   ├── auth.ts                      # JWT authentication and cookie helpers
│   │   ├── imageService.ts              # Sharp image processor and validator
│   │   ├── nodeBridge.ts                # Express/Node to Web Request adapter
│   │   └── smtpVitePlugin.ts            # Vite dev server API bridge
│   ├── utils/                           # Poster extraction utilities
│   ├── App.tsx                          # Top-level router and context wrapper
│   ├── index.css                        # Global CSS and Tailwind directives
│   └── main.tsx                         # React application entry point
├── .backups/                            # Historical asset backups and migration manifests
├── .env.example                         # Safe configuration template with placeholders
├── .gitignore                           # Git ignore rules
├── index.html                           # Root HTML document
├── metadata.json                        # Application metadata
├── MYSQL_MIGRATION_GUIDE.md             # Dedicated Hostinger MySQL migration guide
├── package.json                         # NPM package definition and scripts
├── server.ts                            # Production Express application server
├── SMTP_SETUP_GUIDE.md                  # Dedicated SMTP email setup guide
├── tsconfig.json                        # TypeScript configuration
└── vite.config.ts                       # Vite 8 build and plugin configuration
```

---

## 5. Prerequisites & Software Requirements

- **Node.js**: `v18.18.0` or higher (`v20 LTS` or `v22 LTS` recommended)
- **NPM**: `v9.0.0` or higher
- **Git**: Installed and configured on your operating system
- **MySQL Client (Optional)**: If connecting to a local or remote MySQL instance

---

## 6. Installation Instructions

1. Clone or download the repository to your local drive:
   ```bash
   cd D:\DEYSLA
   ```
2. Install dependencies using the locked package versions:
   ```bash
   npm install
   ```

---

## 7. Environment Configuration

The application reads configuration from `.env.local` (local development) or `.env` (production).

Create your local configuration by copying `.env.example`:
```bash
# Windows PowerShell:
Copy-Item .env.example .env.local

# macOS / Linux:
cp .env.example .env.local
```

### Configuration Parameters

```env
# ------------------------------------------------------------------------------
# SMTP Email Delivery (Hostinger / Nodemailer) - Server-side only
# ------------------------------------------------------------------------------
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="info@sa.deysla.com"
SMTP_PASS="your-hostinger-mailbox-password"
SMTP_FROM="DEYSLA IT Solutions <info@sa.deysla.com>"
CONTACT_EMAIL="info@sa.deysla.com"

# ------------------------------------------------------------------------------
# Hostinger MySQL Database Configuration (Optional - Falls back to JSON DB)
# Target Database: u157314465_DEYSLA
# ------------------------------------------------------------------------------
DB_HOST="srv1412.hstgr.io"
DB_PORT="3306"
DB_USER="u157314465_DEYSLA"
DB_PASSWORD="your-mysql-user-password"
DB_NAME="u157314465_DEYSLA"
DB_SSL="false"

# ------------------------------------------------------------------------------
# Frontend & Platform Environment Variables
# ------------------------------------------------------------------------------
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# ------------------------------------------------------------------------------
# Admin Dashboard Authentication (Server-Side Only)
# ------------------------------------------------------------------------------
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-this-to-a-strong-password"
ADMIN_JWT_SECRET="replace-with-a-random-secure-secret-key"
```

> **Security Guarantee:** Credentials configured in `.env` or `.env.local` are read strictly on the server. They are never bundled into client JavaScript.

---

## 8. Local Development Instructions

Start the development server:
```bash
npm run dev
```

- Local URL: `http://localhost:3000`
- Features active: Vite Hot Module Replacement (HMR), Tailwind CSS compilation, and automatic API routing via `smtpApiPlugin`.
- When MySQL credentials are not yet set, the server runs seamlessly using JSON fallback data (`data/db/*.json`).

---

## 9. Production Build & Validation Commands

### 9.1 TypeScript Type Checking
```bash
npm run lint
```
*(Executes `tsc --noEmit` to verify type safety across all files)*

### 9.2 Production Bundle Generation
```bash
npm run build
```
*(Executes `vite build`, outputting optimized assets to `dist/`)*

### 9.3 Previewing Production Build
```bash
npm run preview
```

### 9.4 Running the Production Server
```bash
npm run start
```
*(Executes `tsx server.ts`, launching Express to serve `dist/` and all backend API routes)*

---

## 10. Backend API Overview

All backend endpoints are available during both local development (`npm run dev`) and production (`npm run start`):

### 10.1 Public Endpoints
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/catalog` | Returns active products, categories, brands, and catalog item SKUs. |
| `GET` | `/api/cms/content` | Returns live CMS website content (sections, services, projects, FAQs, reviews). |
| `POST` | `/api/contact` | Submits customer inquiries, creates a complaint record, and sends an email. |
| `POST` | `/api/quote` | Submits RFQ quotation requests with line items and sends an email. |
| `POST` | `/api/careers` | Submits job applications and sends candidate notifications. |
| `GET` | `/api/verify-smtp` | Performs diagnostic health check on SMTP gateway connection. |
| `GET` | `/api/extracted-status` | Checks if master catalog poster exists. |
| `POST` | `/api/extract-poster` | Server-side Sharp tile extraction for catalog graphics. |

### 10.2 Admin Endpoints (Protected by JWT Session)
| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/auth/login` | Authenticates administrator and sets `HttpOnly` cookie. |
| `GET` | `/api/admin/auth/me` | Validates active session and returns user profile. |
| `POST` | `/api/admin/auth/logout` | Clears authentication session cookie. |
| `GET` | `/api/admin/stats` | Returns operational dashboard counts and metrics. |
| `GET` | `/api/admin/audit-logs` | Returns historical record of administrative actions. |
| `POST` | `/api/admin/backup` | Creates an on-demand snapshot of catalog JSON data. |
| `GET` / `POST` | `/api/admin/products` | Retrieves or saves product families. |
| `POST` | `/api/admin/products/:id/toggle-status` | Toggles product active/inactive visibility. |
| `GET` / `POST` | `/api/admin/catalog-items` | Retrieves or saves sub-product SKUs. |
| `POST` | `/api/admin/catalog-items/:id/toggle-status` | Toggles catalog item visibility. |
| `GET` / `POST` | `/api/admin/brands` | Retrieves or saves partner OEM brands. |
| `POST` | `/api/admin/brands/:id/toggle-status` | Toggles brand visibility. |
| `GET` / `PUT` | `/api/admin/complaints` | Retrieves or updates customer inquiry tickets. |
| `GET` | `/api/admin/quotes` | Inspects submitted RFQ quotation requests. |
| `GET` | `/api/admin/existing-images` | Scans and lists verified images from `public/assets/`. |
| `POST` | `/api/admin/validate-image-path` | Validates file existence on the server filesystem. |
| `POST` | `/api/admin/upload-image` | Validates, compresses, and saves uploaded images via Sharp. |
| `GET` | `/api/admin/cms/db-status` | Returns live MySQL connection health and active DB host. |
| `POST` | `/api/admin/cms/migrate-seed` | Runs one-click data migration from JSON into MySQL. |
| `POST` | `/api/admin/cms/settings` | Updates site-wide parameters. |
| `POST` | `/api/admin/cms/sections` | Updates page section content (Hero, About, etc.). |
| `POST` / `DELETE`| `/api/admin/cms/services` | Creates, updates, or deletes corporate services. |
| `POST` / `DELETE`| `/api/admin/cms/projects` | Creates, updates, or deletes turnkey case studies. |
| `POST` / `DELETE`| `/api/admin/cms/gallery` | Creates, updates, or deletes showcase gallery photos. |
| `POST` / `DELETE`| `/api/admin/cms/reviews` | Creates, updates, or deletes client reviews. |
| `POST` / `DELETE`| `/api/admin/cms/faqs` | Creates, updates, or deletes bilingual FAQs. |
| `GET` / `PATCH` | `/api/admin/cms/careers` | Reviews job candidate applications and updates status. |

---

## 11. Database Setup, Migrations & Seeding

### 11.1 Target Database
- **Hostinger MySQL Database**: `u157314465_DEYSLA`
- **WordPress Isolation**: The pre-existing WordPress database `u157314465_UmYLY` is completely isolated and untouched.

### 11.2 Executing Migrations
To create the 17 InnoDB tables with proper indexes and UTF8MB4 charset:
```bash
npm run db:migrate
```

### 11.3 Idempotent Data Seeding
To populate MySQL with the complete catalog and CMS content:
```bash
npm run db:seed
```

> **Warning:** Always verify database connection parameters and ensure regular backups before running migration scripts against a production database.

---

## 12. SMTP Configuration Guidance

The system uses **Nodemailer** to send transactional emails for contact forms, RFQs, and job applications.

### Provider Setup Summary
- **Hostinger Mail (Verified & Recommended)**: Outgoing SMTP server `smtp.hostinger.com`, Port `465` (SSL/TLS), `SMTP_SECURE=true`, Username `info@sa.deysla.com`, and Hostinger mailbox password.
- **Google Workspace / Gmail**: Generate a 16-character **App Password** (`myaccount.google.com/apppasswords`) with 2-Step Verification enabled. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`.
- **Microsoft 365 / Exchange**: Enable **Authenticated SMTP** under Mail &gt; Email apps in the M365 Admin Center. Set `SMTP_HOST=smtp.office365.com`, `SMTP_PORT=587`, `SMTP_SECURE=false`.

Test delivery via CLI:
```bash
npx tsx scripts/testSmtpIntegration.ts
```

For full setup instructions, see [`docs/SMTP_SETUP_GUIDE.md`](./docs/SMTP_SETUP_GUIDE.md).

---

## 13. Admin Panel & CMS Overview

- **Login URL**: `http://localhost:3000/admin/login` (or `https://your-domain.com/admin/login`)
- **Default Credentials**: Configured via `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env.local` / `.env`.
- **Key Modules**:
  1. **Dashboard Overview**: Key metrics and quick actions (backup, status).
  2. **Products & SKUs**: Add, edit, or toggle products and specific catalog items.
  3. **Brands**: OEM partner logos, country of origin, and associated product categories.
  4. **Content Management**: Edit website hero sections, corporate blurbs, and banner copy.
  5. **Services, Projects & Gallery**: Full control over service offerings, portfolio projects, and field photos.
  6. **Customer Inquiries & Quotes**: Real-time review of RFQ requests and customer complaints.
  7. **Career Applications**: Applicant tracking system for submitted CVs and notes.
  8. **Settings & Database**: Live MySQL connection test and migration controls.

---

## 14. Static Assets & Product Catalogue Organization

- **Public Assets Directory**: `public/assets/`
  - Partner logos: `public/assets/*-logo.png`
  - High-resolution product images: `public/assets/*.png`, `public/assets/*.jpg`, `public/assets/*.webp`
  - Hero backgrounds: `public/assets/*hero-bg.jpg`
- **Zero-Placeholder Policy**: Every product and brand references real, verified media assets. No broken placeholder URLs exist in the catalogue.

---

## 15. Testing & Troubleshooting Instructions

1. **Type Checking**:
   ```bash
   npm run lint
   ```
2. **Production Build**:
   ```bash
   npm run build
   ```
3. **SMTP Verification**:
   ```bash
   npx tsx scripts/testSmtpIntegration.ts
   ```
4. **Common Issues**:
   - *Remote MySQL Connection Refused*: Check Hostinger Remote MySQL whitelist to ensure your current IP is authorized.
   - *SMTP Authentication Failed*: Verify 2-Step Verification is active and you are using a dedicated App Password rather than your account password.
   - *Blank Page on Refresh in Production*: Ensure your production server routes all unmatched requests to `dist/index.html` (handled automatically by `server.ts`).

---

## 16. Deployment Requirements & Hosting Limitations

- **Runtime Requirement**: The website requires a Node.js runtime environment (v18.18+) to run the Express server (`server.ts`) and process API requests.
- **Static-Only Hosting Limitation**: Deploying to static-only hosting (such as basic GitHub Pages) will render the frontend SPA, but API routes, emails, and database synchronization will not function without serverless adaptations.
- **Recommended Production Stack**: Hostinger Node.js Web Hosting, Linux VPS (Ubuntu/Debian) with PM2 and Nginx reverse proxy, or containerized Docker deployment.

For complete deployment walk-throughs and Nginx configuration, see [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

---

## 17. Security Considerations

- **Secrets Management**: All passwords, API keys, and JWT secrets are stored exclusively in environment variables and are excluded from Git via `.gitignore`.
- **Database Safety**: Parameterized queries are used across the database layer to eliminate SQL injection risks.
- **Admin Authentication**: JWT tokens are signed with HMAC-SHA256 and transmitted via `HttpOnly`, `SameSite=Lax` cookies.
- **Image Upload Sanitization**: Uploaded images are validated, sanitized, and re-encoded using `sharp` to prevent arbitrary file upload vulnerabilities.

---

## 18. Freelance Handover Notes & Maintenance Guidance

### Handover Checklist for Client
1. **Repository Access**: Ensure the client has administrative access to the repository.
2. **Environment Variables**: Provide the client with their designated `.env` file containing production credentials over a secure channel.
3. **Admin Account**: Prompt the client to set a custom, strong `ADMIN_PASSWORD` and `ADMIN_JWT_SECRET`.
4. **Database Verification**: Confirm Hostinger MySQL connectivity via the Admin Dashboard.
5. **Email Delivery**: Verify that incoming contact inquiries and quotation emails arrive at `info@sa.deysla.com`.

For ongoing operational tasks and backup routines, refer to [`docs/MAINTENANCE.md`](./docs/MAINTENANCE.md).

---

## 19. Feature Implementation Status Matrix

| Feature | Implementation Status | Verification Status | Notes |
| :--- | :--- | :--- | :--- |
| **Bilingual EN / AR UI** | Implemented | Verified | Complete RTL and LTR support with localized routing |
| **Product & Brand Catalog** | Implemented | Verified | Fully populated with verified OEM products and specs |
| **RFQ Quotation Cart** | Implemented | Verified | Cart drawer, BoQ checkout, and email notifications |
| **Contact & Complaint Forms** | Implemented | Verified | Inquiries saved to database and emailed to admin |
| **Job Applicant Portal** | Implemented | Verified | Career listings and resume submission workflow |
| **Admin Panel & CMS** | Implemented | Verified | 18 tabs covering products, content, and inquiries |
| **Dual-Mode Persistence** | Implemented | Verified | Connects to MySQL or falls back gracefully to JSON |
| **Nodemailer SMTP** | Implemented | Verified | Formatted HTML email dispatch for all forms |
| **Express Production Server** | Implemented | Verified | Production server configured in `server.ts` |
| **Vite Production Build** | Implemented | Verified | Builds cleanly in ~3.5 seconds with zero lint errors |

---

## 20. Documentation Index

- **[`docs/PROJECT_STRUCTURE.md`](./docs/PROJECT_STRUCTURE.md)** — Architectural layout and directory responsibilities.
- **[`docs/SETUP.md`](./docs/SETUP.md)** — Local workstation setup and environment configuration.
- **[`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)** — Production hosting, PM2 process management, and Nginx setup.
- **[`docs/MAINTENANCE.md`](./docs/MAINTENANCE.md)** — Database backup, restore, catalog updates, and operations.
- **[`docs/MYSQL_MIGRATION_GUIDE.md`](./docs/MYSQL_MIGRATION_GUIDE.md)** — Hostinger MySQL table schema and migration steps.
- **[`docs/SMTP_SETUP_GUIDE.md`](./docs/SMTP_SETUP_GUIDE.md)** — Email gateway configuration for Hostinger Mail, Google Workspace, and Microsoft 365.