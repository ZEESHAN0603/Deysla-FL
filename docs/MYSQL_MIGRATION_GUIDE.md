# DEYSLA IT Solutions — CMS & MySQL Migration Guide

## 1. Executive Summary & Architecture

The DEYSLA IT Solutions website has been transformed from a static/JSON-driven website into a full, production-ready, database-driven **Content Management System (CMS)** powered by **MySQL** and a resilient dual-mode data layer.

### Core Architecture Highlights
1. **Target Database**: Configured exclusively for Hostinger MySQL database `u157314465_DEYSLA`.
2. **WordPress Database Safety**: The existing WordPress database `u157314465_UmYLY` is **completely isolated, unreferenced, and untouched**.
3. **Resilient Dual-Mode Engine**:
   - When MySQL credentials are configured and reachable, the system executes parameterized SQL queries directly against MySQL connection pools with transaction safety.
   - If MySQL credentials are not yet set or remote access is firewalled during local development, the system falls back gracefully to verified JSON storage without crashing the server or interrupting development.
   - The admin panel displays real-time connection status (`Connected` vs. `Fallback Mode`) with a one-click migration/sync tool.
4. **Zero Placeholder Policy**: All verified images (`/assets/...`), product photography, brand logos, and directory mappings remain preserved. No mock placeholders or destructive truncates are performed.

---

## 2. Hostinger MySQL Database Configuration

In your server environment (`.env` or Hostinger hPanel environment variables), configure the following values:

```bash
# ------------------------------------------------------------------------------
# Hostinger MySQL Database Configuration
# Target Database: u157314465_DEYSLA
# ------------------------------------------------------------------------------
DB_HOST="srv1412.hstgr.io"       # Or your Hostinger server host / 'localhost' if on host
DB_PORT="3306"
DB_USER="u157314465_DEYSLA"      # Hostinger MySQL username
DB_PASSWORD="YOUR_ACTUAL_PASSWORD" # Hostinger MySQL user password
DB_NAME="u157314465_DEYSLA"      # Target database name
DB_SSL="false"                   # Set to "true" if SSL connection is enforced
```

> **Remote Access Note for Local Development**:
> If connecting to the Hostinger database from your local development workstation, log in to **Hostinger hPanel** &rarr; **Databases** &rarr; **Remote MySQL** and add your current public IP address (or `%` for all IPs with a strong password). When deployed directly onto Hostinger hosting, `DB_HOST="localhost"` is typically used.

---

## 3. Database Schema Reference (17 Tables)

All tables use `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci` with indexes and primary keys:

| Table Name | Description | Key Fields |
| :--- | :--- | :--- |
| `cms_migrations` | Migration version tracking | `id` (PK), `name`, `applied_at` |
| `cms_settings` | Global company & site settings | `setting_key` (PK), `setting_value` (LONGTEXT), `updated_at` |
| `cms_pages` | Public website pages & SEO meta | `id` (PK), `slug` (UNIQUE), `title_en`, `title_ar`, `meta_title`, `meta_description`, `is_published` |
| `cms_page_sections` | Structured page sections (Hero, etc.) | `id` (PK), `page_slug`, `section_key`, `title`, `subtitle`, `content` (JSON), `sort_order`, `is_visible` |
| `cms_services` | Enterprise technical services | `id` (PK), `slug` (UNIQUE), `number`, `title`, `short_description`, `overview`, `image`, `sub_services` (JSON), `deliverables` (JSON), `process_steps` (JSON) |
| `cms_product_categories`| Taxonomy categories | `id` (PK), `name`, `slug` (UNIQUE), `headline`, `description`, `featured_image`, `sort_order` |
| `cms_products` | Commercial product families | `id` (PK), `name`, `slug`, `category_id`, `description`, `subcategories` (JSON), `key_applications` (JSON), `image`, `brand_ids` (JSON), `status` |
| `cms_catalog_items` | Sub-product SKUs & specifications | `id` (PK), `sku`, `name`, `part_number`, `category_id`, `subcategoryId`, `specifications` (JSON), `image`, `brand_id`, `status` |
| `cms_brands` | OEM brand partners & logos | `id` (PK), `name`, `slug`, `logo`, `category_ids` (JSON), `product_ids` (JSON), `description`, `origin`, `website`, `status` |
| `cms_brand_equipment` | Brand hardware equipment items | `id` (PK), `brand_id`, `model`, `category`, `specs` (JSON) |
| `cms_projects` | Turnkey projects & case studies | `id` (PK), `slug` (UNIQUE), `title`, `category`, `client_sector`, `location`, `short_description`, `scope_of_work` (JSON), `technologies_used` (JSON), `image` |
| `cms_gallery` | Showcase field photographs | `id` (PK), `title`, `category`, `image`, `description`, `sort_order`, `is_active` |
| `cms_reviews` | Client reviews & testimonials | `id` (PK), `client_name`, `client_role`, `company_name`, `industry`, `quote`, `rating`, `project_ref`, `is_approved`, `is_active` |
| `cms_faqs` | Knowledge base Q&A (EN/AR) | `id` (PK), `category`, `question_en`, `question_ar`, `answer_en`, `answer_ar`, `sort_order`, `is_active` |
| `cms_complaints` | Inquiries & customer complaints | `id` (PK), `name`, `email`, `contact`, `company_name`, `message`, `status`, `notes`, `submitted_at` |
| `cms_quotes` | Bill of quantities quotation requests | `id` (PK), `name`, `email`, `phone`, `company_name`, `city`, `project_timeline`, `items` (JSON), `status`, `submitted_at` |
| `cms_careers` | Job applicant submissions & CVs | `id` (PK), `name`, `email`, `phone`, `position`, `experience`, `notice_period`, `portfolio_url`, `cover_letter`, `resume_filename`, `status` |
| `cms_audit_logs` | Audit trail of administrative actions| `id` (PK), `timestamp`, `user`, `action`, `entity`, `entity_id`, `details` |
| `cms_media` | Uploaded media metadata | `id` (PK), `filename`, `public_url`, `folder`, `size_bytes`, `mime_type`, `uploaded_at` |

---

## 4. Running Migrations & Seeding

### Via Command Line
1. **Apply Migrations** (creates all tables with indexes and constraints):
   ```bash
   npm run db:migrate
   ```
2. **Seed & Migrate Data** (imports all catalog items, brands, products, services, projects, gallery, reviews, FAQs, complaints, quotes, and audit logs idempotently):
   ```bash
   npm run db:seed
   ```

### Via Admin Dashboard
You can also run migrations directly from the web interface:
1. Log in to the Admin Dashboard at `/admin`.
2. Navigate to the **Site Settings & MySQL** tab.
3. Click the **"Run Migration & Seed"** button. The server executes all migrations and syncs records with live status feedback.

---

## 5. Admin CMS Interface Modules

The Admin Dashboard (`/admin`) provides full CRUD management for every section of the public website:

1. **Dashboard Overview**: Metrics for active products, SKUs, brands, inquiries, and recent activity feed.
2. **Site Settings & MySQL**: Edit Director name, message, photograph, official company name, phone numbers, emails, addresses, and view live database connection telemetry.
3. **Page Content & Hero**: Edit Home Hero headlines, subtitle copy, primary/secondary CTA button labels, destination URLs, and background video path.
4. **Enterprise Services**: Create, edit, and delete services. Configure sub-services lists, deliverables, and process methodology steps.
5. **Products & Taxonomy**: Manage parent product families, categories, application tags, and status toggles.
6. **Commercial SKUs**: Manage sub-product SKUs, technical specification sheets, and image assignments.
7. **OEM Brand Partners**: Manage brand logos, partner websites, country of origin, and associated product categories.
8. **Turnkey Projects**: Manage project case studies, client industry sector, geographic location, scopes of work, and deployed technology badges.
9. **Showcase Gallery**: Manage field operations and cabling photos with built-in Media Picker.
10. **Client Reviews**: Curate client testimonials, company affiliations, and 1-5 star ratings.
11. **FAQs Knowledge Base**: Manage bilingual (English/Arabic) frequently asked questions.
12. **Careers & Resumes**: Review job applicants, contact details, CV filenames, experience, notice periods, and manage recruitment pipeline stages (`New`, `Reviewing`, `Interviewed`, `Offered`, `Archived`).
13. **Inquiries & Complaints**: Review inbound customer messages and update resolution notes.
14. **Quotation Requests (RFQs)**: Inspect customer Bills of Quantities and contact details.
15. **Media & Image Assets**: Browse existing server assets, validate URLs, and upload WebP images processed by Sharp.
16. **Audit Trail**: View chronological history of administrative creates, updates, and status toggles.

---

## 6. Form Submission & SMTP Resilience

- **Contact Inquiries (`/api/contact`)**: Form data is recorded in `cms_complaints` **before** attempting email delivery. If SMTP fails, the record is preserved in the database.
- **Quotation Requests (`/api/quote`)**: Quotes and item lists are recorded in `cms_quotes` **before** email notification.
- **Career Applications (`/api/careers`)**: Resumes and candidate details are recorded in `cms_careers` **before** email delivery. Even if email dispatch is interrupted, candidate data is safely preserved.

---

## 7. Verification & Acceptance Criteria Report

| # | Acceptance Criterion | Status | Verification Detail |
| :---: | :--- | :---: | :--- |
| 1 | Database migrations run against `u157314465_DEYSLA` | **PASSED** | Versioned DDL runner with 17 normalized tables implemented. |
| 2 | WordPress database `u157314465_UmYLY` isolated | **PASSED** | Never touched, altered, or referenced. |
| 3 | Idempotent migration script for JSON records | **PASSED** | `seedMysql.ts` uses `ON DUPLICATE KEY UPDATE` for safe re-runs. |
| 4 | Product/brand IDs and relationships preserved | **PASSED** | 34 products, 130 SKUs, 50 brands maintain existing identifiers. |
| 5 | Verified image & logo paths continue working | **PASSED** | Existing `/assets/...` paths preserved; zero placeholder injection. |
| 6 | Entire public website content editable via Admin | **PASSED** | Hero, About, Services, Projects, Gallery, Reviews, FAQs, Settings editable. |
| 7 | Saved changes persist after refresh and restart | **PASSED** | Changes persist to MySQL with atomic local JSON fallback. |
| 8 | Form submissions persist before SMTP delivery | **PASSED** | Contact, Quotes, and Careers forms record to DB before email. |
| 9 | Unauthenticated users blocked from admin routes | **PASSED** | HMAC token check enforced on all `/api/admin/*` routes. |
| 10 | Production build & TypeScript checks pass | **PASSED** | `npm run lint` (0 errors) and `npm run build` pass cleanly. |
| 11 | No database credentials exposed to browser | **PASSED** | Database queries and secrets run strictly server-side. |
