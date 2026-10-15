# DEYSLA IT Solutions — Project Structure & Architecture Reference

This document outlines the codebase organization, module boundaries, directory responsibilities, and key runtime pathways of the **DEYSLA IT Solutions** application.

---

## 1. Architectural Overview

The repository is organized into distinct logical tiers that maintain a strict separation between client-side user experience, backend services, persistent data storage, and utility tooling.

```
D:\DEYSLA
├── app/                       # Serverless-style API route definitions
│   └── api/                   # Handlers for contact, quote, careers, and SMTP verification
├── data/                      # Persistent data storage
│   └── db/                    # Resilient JSON database files (fallback mode)
├── docs/                      # Production documentation suite
├── public/                    # Static assets directly exposed to web clients
│   ├── assets/                # Product photos, partner brand logos, banners
│   └── videos/                # Background hero looping video
├── scripts/                   # CLI maintenance, data generation, and test scripts
├── src/                       # Main application source code
│   ├── components/            # UI components (grouped by functional domain)
│   ├── context/               # React Context state providers
│   ├── data/                  # Static catalogue definitions and seed structures
│   ├── i18n/                  # Bilingual localization (English / Arabic)
│   ├── lib/                   # Utility helpers
│   ├── pages/                 # Full-page route views (public & admin)
│   ├── server/                # Backend services, database layer, auth, and mailer
│   └── utils/                 # Asset manipulation and extraction utilities
├── index.html                 # Frontend SPA HTML entry point
├── package.json               # NPM package manifest, scripts, and dependencies
├── server.ts                  # Production Node.js/Express application server
├── tsconfig.json              # TypeScript configuration and path aliases
└── vite.config.ts             # Vite 8 bundling and development server plugins
```

---

## 2. Directory Responsibilities

### 2.1 Frontend Tier (`src/`)

- **`src/main.tsx`**: Bootstraps the React 19 application into the DOM (`#root`) and imports `src/index.css`.
- **`src/App.tsx`**: Defines all application routes via React Router DOM v7, wrapped in context providers for localization, catalog state, cart management, CMS content, and admin authentication.
- **`src/index.css`**: Configures Tailwind CSS v4 directives, custom font imports (`Inter`, `Cairo`), keyframe animations (marquee, gradient pulses), and theme classes.
- **`src/components/`**: Reusable visual components organized by domain:
  - `admin/`: Complete management interface (18 tab panels and modal dialogs for products, catalog items, brands, CMS content, services, projects, gallery, reviews, FAQs, complaints, quotes, careers, audit logs, media, and settings).
  - `careers/`: Job listings, department filters, and resume submission modal.
  - `cart/`: Bill of Quantities (RFQ) quotation drawer, item counter, and submission workflow.
  - `common/`: Global UI elements including `<ChatbotButton />`, banners, and badges.
  - `contact/`: Interactive Google Map, customer inquiry form, and complaint resolution modal.
  - `home/`: Landing page sections including hero video background, corporate introduction, service matrix, and partner brand marquee.
  - `layout/`: Global `<Navbar />`, `<Footer />`, mega-menus, mobile navigation drawers, and language switchers.
  - `ui/`: Core animation primitives, including `<AnimatedMarqueeHero />` (`hero-3.tsx`).
- **`src/context/`**: React Context providers maintaining application state:
  - `LanguageContext.tsx`: Coordinates `en` vs. `ar` locale, text direction (`ltr` vs. `rtl`), and path prefixing (`/ar/...`).
  - `CatalogContext.tsx`: Manages active brands, categories, products, and catalog item SKUs.
  - `CartContext.tsx`: Manages the RFQ quotation cart state with local storage synchronization.
  - `AdminAuthContext.tsx`: Tracks JWT authentication status and administrator profile.
  - `CmsContentContext.tsx`: Provides dynamic CMS sections, services, projects, FAQs, and reviews to public pages.
  - `PosterImagesContext.tsx`: Coordinates master catalog poster image cropping.
- **`src/data/`**: Static TypeScript catalogues providing verified product specifications, brand profiles, and fallback data structures when running offline.
- **`src/i18n/`**: Bilingual dictionary (`translations.ts`) mapping keys to English and Arabic text, supporting professional terminology for KSA and Bahrain enterprise clients.
- **`src/pages/`**: Customer-facing pages for products, services, company history, portfolio projects, case studies, privacy policy, terms, careers, and the admin control panel.

---

### 2.2 Backend Tier (`src/server/` & `server.ts`)

- **`server.ts`**: The production Express server entry point.
  - Loads environment variables from `.env.local` and `.env`.
  - Exposes REST API endpoints (`/api/catalog`, `/api/cms*`, `/api/admin*`, `/api/contact`, `/api/quote`, `/api/careers`, `/api/verify-smtp`).
  - Bridges Next.js-style Route Handlers using `nodeBridge.ts`.
  - Serves static compiled client assets from `dist/`.
  - Routes unmatched GET requests to `dist/index.html` for client-side routing.
- **`src/server/nodeBridge.ts`**: High-performance adapter bridging Node.js HTTP `IncomingMessage`/`ServerResponse` to modern standard Web `Request`/`Response` objects.
- **`src/server/adminApiHandler.ts`**: Core API controller handling all administrative and CMS REST endpoints, payload validation, image uploads, and status toggles.
- **`src/server/auth.ts`**: Admin authentication module implementing username/password verification and HMAC-SHA256 JWT generation, extraction, and validation with `HttpOnly` cookie support.
- **`src/server/imageService.ts`**: Server-side image upload handler using `sharp` for image compression, sanitization, and persistence into `public/assets/`.
- **`src/server/smtpVitePlugin.ts`**: Vite development plugin that intercepts `/api/*` requests during `npm run dev`, providing full backend API functionality without running a separate backend process.
- **`src/server/mail/mailer.ts`**: Nodemailer transporter configuration and responsive HTML email generators for contact submissions, RFQ quote requests, and career applications.
- **`src/server/db/`**:
  - `mysql.ts`: MySQL2 connection pool setup with automatic keep-alive, SSL support, and health checks against Hostinger database `u157314465_DEYSLA`.
  - `database.ts`: Dual-mode catalog, complaints, quotes, and audit logs manager (switches between MySQL and JSON fallback).
  - `cmsStore.ts`: Dual-mode CMS content manager (settings, sections, services, projects, gallery, reviews, FAQs, careers).
  - `migrations/runMigrations.ts`: DDL migration script creating 17 InnoDB tables with indexes and UTF8MB4 charset.
  - `seedMysql.ts`: Idempotent data seeding script importing catalog items and CMS data into MySQL.

---

### 2.3 Route Handlers (`app/api/`)

Standardized route handlers utilized across both development (Vite plugin) and production (Express server):
- `app/api/contact/route.ts`: Processes customer inquiries and complaint tickets, updates persistent storage, and dispatches email notifications.
- `app/api/quote/route.ts`: Processes Bill of Quantities RFQ requests, records quotation details, and emails structured tables of requested SKUs.
- `app/api/careers/route.ts`: Processes job candidate applications and stores CV metadata.
- `app/api/verify-smtp/route.ts`: Tests SMTP gateway connectivity and returns diagnostic status.

---

### 2.4 Persistent Data Tier (`data/db/`)

When MySQL is unreachable or during offline development, the system persists data in JSON format within `data/db/`:
- `catalog.json`: Full product families, brand partners, categories, and SKU specifications.
- `cms_content.json`: Dynamic website text, banners, services, case studies, gallery items, reviews, and FAQs.
- `complaints.json`: Customer service inquiries and complaint records.
- `quotes.json`: RFQ quotation requests submitted through the cart.
- `audit_logs.json`: Historical log of all administrative actions.

---

### 2.5 Static Assets (`public/`)

- `public/assets/`: Production imagery, brand logos (Cisco, Fortinet, HP, Dell, Schneider, Panduit, etc.), product photography, and category hero banners.
- `public/videos/`: High-definition looping video background (`networking-datacenter-loop.mp4`).
- `public/robots.txt` & `public/sitemap.xml`: Production search engine indexing configurations.

---

### 2.6 Aliases & Re-Export Stubs

- **`tsconfig.json`**: Maps `@/*` to `./*`.
- **`components/ui/hero-3.tsx`**: Re-exports `src/components/ui/hero-3.tsx`.
- **`lib/utils.ts`**: Re-exports `src/lib/utils.ts`.

These stubs guarantee seamless path resolution for both relative and aliased component imports across the repository.
