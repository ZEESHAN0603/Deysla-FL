import fs from 'fs';
import path from 'path';
import { getMysqlPool, checkMysqlConnection } from './mysql.ts';
import { runMigrations } from './migrations/runMigrations.ts';

// Static seed data definitions
import { COMPANY_DATA } from '../../data/company.ts';
import { SERVICES_DATA } from '../../data/services.ts';
import { PROJECTS_DATA } from '../../data/projects.ts';
import { GALLERY_DATA } from '../../data/gallery.ts';
import { REVIEWS_DATA } from '../../data/reviews.ts';
import { PRODUCT_CATEGORIES } from '../../data/productCategories.ts';
import { BRAND_EQUIPMENT_ITEMS } from '../../data/brandProducts.ts';
import { PRODUCTS_DATA } from '../../data/products.ts';
import { CATALOG_ITEMS } from '../../data/productCatalogItems.ts';
import { BRANDS_DATA } from '../../data/brands.ts';

const DB_DIR = path.resolve(process.cwd(), 'data', 'db');
const CATALOG_FILE = path.join(DB_DIR, 'catalog.json');
const COMPLAINTS_FILE = path.join(DB_DIR, 'complaints.json');
const QUOTES_FILE = path.join(DB_DIR, 'quotes.json');
const AUDIT_FILE = path.join(DB_DIR, 'audit_logs.json');

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

export const INITIAL_FAQS = [
  {
    id: 'faq-1',
    category: 'General',
    question_en: 'What core enterprise technology solutions does DEYSLA provide?',
    question_ar: 'ما هي حلول التكنولوجيا المؤسسية الأساسية التي تقدمها ديسلا؟',
    answer_en: 'DEYSLA delivers turnkey enterprise IT infrastructure, structured cabling (Cat6A & Fiber), data center staging, cybersecurity & next-gen firewalls, CCTV IP surveillance, biometric speed gates, industrial automation networking, and business telephony.',
    answer_ar: 'تقدم ديسلا بنية تحتية متكاملة لتقنية المعلومات، التمديدات الهيكلية، تجهيز مراكز البيانات، الأمن السيبراني، المراقبة بالكاميرات، البوابات الأمنية، وشبكات الأتمتة الصناعية.',
    sort_order: 1,
    is_active: 1,
  },
  {
    id: 'faq-2',
    category: 'Procurement',
    question_en: 'Are your hardware products and brand alliances genuine OEM components?',
    question_ar: 'هل منتجات الأجهزة والماركات الشريكة أصلية ومعتمدة؟',
    answer_en: 'Yes. All hardware supplied by DEYSLA is 100% genuine OEM certified equipment sourced directly through authorized regional and global distribution channels, complete with manufacturer warranty and serial verification.',
    answer_ar: 'نعم. جميع الأجهزة الموردة من ديسلا أصلية ومعتمدة 100% من المصنعين مباشرة مع ضمان رسمي وتوثيق بالأرقام التسلسلية.',
    sort_order: 2,
    is_active: 1,
  },
  {
    id: 'faq-3',
    category: 'Support',
    question_en: 'Where are your regional support offices located?',
    question_ar: 'أين تقع مكاتب الدعم الإقليمية الخاصة بكم؟',
    answer_en: 'DEYSLA operates certified regional facilities in Al Khalidiya, Dammam (Kingdom of Saudi Arabia), BIW Business Park, Al Hidd (Bahrain), and Charleston, West Virginia (United States).',
    answer_ar: 'تعمل مكاتب ديسلا الإقليمية في الخالدية بالدمام (المملكة العربية السعودية)، مجمع البحرين الاستثماري (البحرين)، وتشارلستون في فرجينيا الغربية (الولايات المتحدة).',
    sort_order: 3,
    is_active: 1,
  },
  {
    id: 'faq-4',
    category: 'Services',
    question_en: 'How can I request a formal Quotation (RFQ) for an infrastructure project?',
    question_ar: 'كيف يمكنني طلب عرض أسعار رسمي لمشروع بنية تحتية؟',
    answer_en: 'You can build your Bill of Quantities (BOQ) directly on our website via the commercial catalog and submit an RFQ, or reach our regional engineering desk at enquiry-sa@deysla.com or +966-544553670.',
    answer_ar: 'يمكنك إعداد قائمة الكميات الخاصة بك مباشرة عبر موقعنا وتقديم طلب عرض أسعار أو التواصل مع مكتبنا الهندسي عبر enquiry-sa@deysla.com.',
    sort_order: 4,
    is_active: 1,
  },
];

export async function seedMysqlDatabase(): Promise<{
  success: boolean;
  message: string;
  counts: Record<string, number>;
}> {
  console.log('[DEYSLA DB] Checking MySQL connection for seeding...');
  const connCheck = await checkMysqlConnection(true);
  if (!connCheck.connected) {
    return {
      success: false,
      message: `MySQL not reachable: ${connCheck.error}. Seed script skipped.`,
      counts: {},
    };
  }

  // 1. Run migrations first
  const migrationResult = await runMigrations();
  if (!migrationResult.success) {
    return {
      success: false,
      message: `Migrations failed: ${migrationResult.message}`,
      counts: {},
    };
  }

  const pool = await getMysqlPool();
  if (!pool) {
    return { success: false, message: 'Could not obtain database pool.', counts: {} };
  }

  const conn = await pool.getConnection();
  const counts: Record<string, number> = {};

  try {
    console.log('[DEYSLA DB] Seeding data into MySQL tables idempotently...');

    // 1. Settings (Global configuration)
    const settingsEntries = [
      ['company_name', COMPANY_DATA.name],
      ['tagline', COMPANY_DATA.tagline],
      ['director_name', COMPANY_DATA.director.name],
      ['director_title', COMPANY_DATA.director.title],
      ['director_image', COMPANY_DATA.director.image],
      ['director_message', COMPANY_DATA.director.message],
      ['contact_phone', COMPANY_DATA.contact.phone],
      ['contact_phone_formatted', COMPANY_DATA.contact.phoneFormatted],
      ['contact_email', COMPANY_DATA.contact.email],
      ['contact_primary_location', COMPANY_DATA.contact.primaryLocation],
      ['contact_primary_city', COMPANY_DATA.contact.primaryCity],
      ['contact_primary_country', COMPANY_DATA.contact.primaryCountry],
      ['offices_data', JSON.stringify(COMPANY_DATA.offices)],
      ['global_presence_data', JSON.stringify(COMPANY_DATA.globalPresence)],
      ['company_stats', JSON.stringify(COMPANY_DATA.stats)],
      ['about_data', JSON.stringify(COMPANY_DATA.about)],
    ];

    for (const [key, val] of settingsEntries) {
      await conn.query(
        `INSERT INTO cms_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, val]
      );
    }
    counts['cms_settings'] = settingsEntries.length;

    // 2. Pages & Sections
    const defaultPages = [
      { slug: 'home', title_en: 'Home', title_ar: 'الرئيسية', meta_title: 'DEYSLA IT Solutions | Enterprise Infrastructure & Security', meta_desc: 'Empowering businesses across KSA, Bahrain, and USA with turnkey enterprise technology solutions.' },
      { slug: 'about', title_en: 'About Us', title_ar: 'من نحن', meta_title: 'About DEYSLA IT Solutions | Vision, Leadership & Heritage', meta_desc: 'Learn about our journey, leadership, core pillars, and regional footprint.' },
      { slug: 'services', title_en: 'Services', title_ar: 'خدماتنا', meta_title: 'Enterprise IT Services & Engineering | DEYSLA IT Solutions', meta_desc: 'Comprehensive technology solutions from data centers to cybersecurity and industrial automation.' },
      { slug: 'products', title_en: 'Products & Brands', title_ar: 'المنتجات والعلامات التجارية', meta_title: 'Commercial Hardware Catalogue & OEM Partners | DEYSLA', meta_desc: 'Procure certified enterprise IT hardware, networking, cabling, and surveillance systems.' },
      { slug: 'projects', title_en: 'Projects', title_ar: 'مشاريعنا', meta_title: 'Enterprise Technology Case Studies & Turnkey Projects | DEYSLA', meta_desc: 'Explore completed data center, cabling, security, and automation projects.' },
      { slug: 'gallery', title_en: 'Showcase Gallery', title_ar: 'معرض الأعمال', meta_title: 'Technology Operations & Staging Gallery | DEYSLA', meta_desc: 'Field installations, staging benchmarks, and technology deployments.' },
      { slug: 'careers', title_en: 'Careers', title_ar: 'الوظائف', meta_title: 'Careers & Engineering Opportunities | DEYSLA IT Solutions', meta_desc: 'Join our team of technology professionals in Saudi Arabia and regional hubs.' },
      { slug: 'contact', title_en: 'Contact Us', title_ar: 'اتصل بنا', meta_title: 'Contact Regional Engineering Hubs | DEYSLA IT Solutions', meta_desc: 'Get in touch with our offices in Dammam, Bahrain, or the USA.' },
    ];

    for (const p of defaultPages) {
      await conn.query(
        `INSERT INTO cms_pages (id, slug, title_en, title_ar, meta_title, meta_description, is_published)
         VALUES (?, ?, ?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE title_en = VALUES(title_en), title_ar = VALUES(title_ar), meta_title = VALUES(meta_title), meta_description = VALUES(meta_description)`,
        [`page-${p.slug}`, p.slug, p.title_en, p.title_ar, p.meta_title, p.meta_desc]
      );
    }
    counts['cms_pages'] = defaultPages.length;

    // Home Page Sections
    const defaultSections = [
      {
        page_slug: 'home',
        section_key: 'hero',
        title: 'Empowering Businesses Through Innovative Technology',
        subtitle: 'Enterprise IT Infrastructure, Networking, Security & Automation',
        content: JSON.stringify({
          heading: 'EMPOWERING BUSINESSES THROUGH INNOVATIVE TECHNOLOGY SOLUTIONS',
          tagline: 'Leading enterprise hardware distribution, turnkey deployment, and digital engineering across KSA, Bahrain, and USA.',
          ctaPrimaryText: 'Explore Solutions',
          ctaPrimaryLink: '/services',
          ctaSecondaryText: 'Request Quotation',
          ctaSecondaryLink: '/cart',
          videoSrc: '/assets/video/hero.mp4',
        }),
        sort_order: 1,
      },
      {
        page_slug: 'home',
        section_key: 'company_intro',
        title: 'End-to-End Enterprise Technology Partner',
        subtitle: 'Engineering Excellence & Certified Distribution',
        content: JSON.stringify({
          description: 'DEYSLA IT Solutions is a premier technology provider operating across Saudi Arabia, the Kingdom of Bahrain, and the United States. We specialize in supply, deployment, and lifecycle maintenance of mission-critical IT infrastructure.',
          badge: 'ISO Compliant Engineering & OEM Alliances',
        }),
        sort_order: 2,
      },
      {
        page_slug: 'home',
        section_key: 'stats',
        title: 'Proven Scale & Regional Impact',
        subtitle: 'Key Milestones',
        content: JSON.stringify(COMPANY_DATA.stats),
        sort_order: 3,
      },
    ];

    for (const s of defaultSections) {
      await conn.query(
        `INSERT INTO cms_page_sections (id, page_slug, section_key, title, subtitle, content, sort_order, is_visible)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE title = VALUES(title), subtitle = VALUES(subtitle), content = VALUES(content), sort_order = VALUES(sort_order)`,
        [`sec-${s.page_slug}-${s.section_key}`, s.page_slug, s.section_key, s.title, s.subtitle, s.content, s.sort_order]
      );
    }
    counts['cms_page_sections'] = defaultSections.length;

    // 3. Services
    for (let i = 0; i < SERVICES_DATA.length; i++) {
      const s = SERVICES_DATA[i];
      await conn.query(
        `INSERT INTO cms_services (
          id, number, slug, title, short_description, overview, image, image_alt, icon,
          sub_services, deliverables, process_steps, relevant_categories, relevant_brand_ids, sort_order, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title), short_description = VALUES(short_description), overview = VALUES(overview),
          image = VALUES(image), image_alt = VALUES(image_alt), sub_services = VALUES(sub_services),
          deliverables = VALUES(deliverables), process_steps = VALUES(process_steps), sort_order = VALUES(sort_order)`,
        [
          s.id,
          s.number || String(i + 1).padStart(2, '0'),
          s.slug || s.id,
          s.title,
          s.shortDescription,
          s.overview,
          s.image,
          s.imageAlt || s.title,
          '',
          JSON.stringify(s.subServices || []),
          JSON.stringify(s.deliverables || []),
          JSON.stringify(s.process || []),
          JSON.stringify(s.relevantCategories || []),
          JSON.stringify(s.relevantBrandIds || []),
          i + 1,
        ]
      );
    }
    counts['cms_services'] = SERVICES_DATA.length;

    // 4. Product Categories
    for (let i = 0; i < PRODUCT_CATEGORIES.length; i++) {
      const c = PRODUCT_CATEGORIES[i];
      await conn.query(
        `INSERT INTO cms_product_categories (id, name, slug, icon, headline, description, featured_image, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE
          name = VALUES(name), icon = VALUES(icon), headline = VALUES(headline),
          description = VALUES(description), featured_image = VALUES(featured_image), sort_order = VALUES(sort_order)`,
        [
          c.id,
          c.name,
          c.slug || c.id,
          c.icon || '',
          c.headline || '',
          c.description || '',
          c.featuredImage || '',
          i + 1,
        ]
      );
    }
    counts['cms_product_categories'] = PRODUCT_CATEGORIES.length;

    // 5. Existing Catalog from catalog.json (or static fallback)
    const storedCatalog = readJsonFile<any>(CATALOG_FILE, {
      products: PRODUCTS_DATA,
      catalogItems: CATALOG_ITEMS,
      brands: BRANDS_DATA,
      brandEquipmentItems: BRAND_EQUIPMENT_ITEMS,
    });

    // Products
    const productsToSeed = storedCatalog.products || PRODUCTS_DATA;
    for (const p of productsToSeed) {
      await conn.query(
        `INSERT INTO cms_products (
          id, name, slug, category_id, category_name, description, subcategories,
          key_applications, image, image_alt, brand_ids, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name), description = VALUES(description), image = VALUES(image),
          subcategories = VALUES(subcategories), key_applications = VALUES(key_applications),
          brand_ids = VALUES(brand_ids), status = VALUES(status)`,
        [
          p.id,
          p.name,
          p.slug || p.id,
          p.categoryId,
          p.categoryName || '',
          p.description || '',
          JSON.stringify(p.subcategories || []),
          JSON.stringify(p.keyApplications || []),
          p.image || '/assets/placeholder-product.svg',
          p.imageAlt || p.name,
          JSON.stringify(p.brandIds || []),
          p.status || 'active',
        ]
      );
    }
    counts['cms_products'] = productsToSeed.length;

    // Catalog Items (Commercial SKUs)
    const itemsToSeed = storedCatalog.catalogItems || CATALOG_ITEMS;
    for (const it of itemsToSeed) {
      await conn.query(
        `INSERT INTO cms_catalog_items (
          id, sku, name, part_number, subcategory_id, subcategory_name, category_id, category_name,
          description, badge, specifications, image, image_webp, brand_id, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name), sku = VALUES(sku), specifications = VALUES(specifications),
          image = VALUES(image), image_webp = VALUES(image_webp), status = VALUES(status)`,
        [
          it.id,
          it.id || it.sku,
          it.name,
          it.partNumber || '',
          it.subcategoryId || '',
          it.subcategoryName || '',
          it.categoryId || '',
          it.categoryName || '',
          it.description || '',
          it.badge || '',
          JSON.stringify(it.specs || []),
          it.image || '/assets/placeholder-product.svg',
          it.imageWebp || it.image || '/assets/placeholder-product.svg',
          it.brand || '',
          it.status || 'active',
        ]
      );
    }
    counts['cms_catalog_items'] = itemsToSeed.length;

    // Brands
    const brandsToSeed = storedCatalog.brands || BRANDS_DATA;
    for (const b of brandsToSeed) {
      await conn.query(
        `INSERT INTO cms_brands (
          id, name, slug, logo, category_ids, product_ids, origin, website, description, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name), logo = VALUES(logo), category_ids = VALUES(category_ids),
          product_ids = VALUES(product_ids), description = VALUES(description), status = VALUES(status)`,
        [
          b.id,
          b.name,
          b.slug || b.id,
          b.logo || '',
          JSON.stringify(b.categoryIds || []),
          JSON.stringify(b.productIds || []),
          b.origin || 'Global',
          b.website || '',
          b.description || '',
          b.status || 'active',
        ]
      );
    }
    counts['cms_brands'] = brandsToSeed.length;

    // Brand Equipment Items
    const equipmentToSeed = storedCatalog.brandEquipmentItems || BRAND_EQUIPMENT_ITEMS;
    for (let i = 0; i < equipmentToSeed.length; i++) {
      const eq = equipmentToSeed[i];
      const eqId = eq.id || `eq-${eq.brandId}-${i}`;
      await conn.query(
        `INSERT INTO cms_brand_equipment (id, brand_id, model, category, specs)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE model = VALUES(model), specs = VALUES(specs)`,
        [eqId, eq.brandId, eq.model, eq.category || '', JSON.stringify(eq.specs || {})]
      );
    }
    counts['cms_brand_equipment'] = equipmentToSeed.length;

    // 6. Projects
    for (let i = 0; i < PROJECTS_DATA.length; i++) {
      const proj = PROJECTS_DATA[i];
      await conn.query(
        `INSERT INTO cms_projects (
          id, slug, title, category, client_sector, location, short_description,
          full_overview, scope_of_work, technologies_used, image, is_placeholder, is_featured, is_active, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title), short_description = VALUES(short_description),
          scope_of_work = VALUES(scope_of_work), technologies_used = VALUES(technologies_used), image = VALUES(image)`,
        [
          proj.id,
          proj.slug || proj.id,
          proj.title,
          proj.category || '',
          proj.clientSector || '',
          proj.location || '',
          proj.shortDescription,
          proj.fullOverview || '',
          JSON.stringify(proj.scopeOfWork || []),
          JSON.stringify(proj.technologiesUsed || []),
          proj.image,
          proj.isPlaceholder ? 1 : 0,
          i < 2 ? 1 : 0,
          i + 1,
        ]
      );
    }
    counts['cms_projects'] = PROJECTS_DATA.length;

    // 7. Gallery
    for (let i = 0; i < GALLERY_DATA.length; i++) {
      const gal = GALLERY_DATA[i];
      await conn.query(
        `INSERT INTO cms_gallery (id, title, category, image, description, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE
          title = VALUES(title), image = VALUES(image), description = VALUES(description), sort_order = VALUES(sort_order)`,
        [gal.id, gal.title, gal.category || '', gal.image, gal.description || '', i + 1]
      );
    }
    counts['cms_gallery'] = GALLERY_DATA.length;

    // 8. Reviews
    for (const rev of REVIEWS_DATA) {
      await conn.query(
        `INSERT INTO cms_reviews (
          id, client_name, client_role, company_name, industry, quote, rating, project_ref, is_approved, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
        ON DUPLICATE KEY UPDATE
          quote = VALUES(quote), rating = VALUES(rating), client_name = VALUES(client_name)`,
        [
          rev.id,
          rev.clientName,
          rev.clientRole || '',
          rev.companyName || '',
          rev.industry || '',
          rev.quote,
          rev.rating || 5,
          rev.projectRef || '',
        ]
      );
    }
    counts['cms_reviews'] = REVIEWS_DATA.length;

    // 9. FAQs
    for (const faq of INITIAL_FAQS) {
      await conn.query(
        `INSERT INTO cms_faqs (id, category, question_en, question_ar, answer_en, answer_ar, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          question_en = VALUES(question_en), answer_en = VALUES(answer_en), is_active = VALUES(is_active)`,
        [
          faq.id,
          faq.category,
          faq.question_en,
          faq.question_ar,
          faq.answer_en,
          faq.answer_ar,
          faq.sort_order,
          faq.is_active,
        ]
      );
    }
    counts['cms_faqs'] = INITIAL_FAQS.length;

    // 10. Existing Complaints from complaints.json
    const complaints = readJsonFile<any[]>(COMPLAINTS_FILE, []);
    for (const c of complaints) {
      await conn.query(
        `INSERT INTO cms_complaints (id, name, email, contact, company_name, message, status, notes, submitted_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), notes = VALUES(notes)`,
        [
          c.id,
          c.name,
          c.email,
          c.contact || '',
          c.companyName || '',
          c.message,
          c.status || 'New',
          c.notes || '',
          c.submittedAt || new Date().toISOString(),
          c.updatedAt || new Date().toISOString(),
        ]
      );
    }
    counts['cms_complaints'] = complaints.length;

    // 11. Existing Quotes from quotes.json
    const quotes = readJsonFile<any[]>(QUOTES_FILE, []);
    for (const q of quotes) {
      await conn.query(
        `INSERT INTO cms_quotes (id, name, email, phone, company_name, city, project_timeline, notes, items, status, submitted_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), notes = VALUES(notes)`,
        [
          q.id,
          q.name,
          q.email,
          q.phone,
          q.companyName,
          q.city,
          q.projectTimeline,
          q.notes || '',
          JSON.stringify(q.items || []),
          q.status || 'Pending',
          q.submittedAt || new Date().toISOString(),
          q.updatedAt || new Date().toISOString(),
        ]
      );
    }
    counts['cms_quotes'] = quotes.length;

    // 12. Existing Audit Logs from audit_logs.json
    const logs = readJsonFile<any[]>(AUDIT_FILE, []);
    for (const l of logs) {
      await conn.query(
        `INSERT INTO cms_audit_logs (id, timestamp, user, action, entity, entity_id, details)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE details = VALUES(details)`,
        [
          l.id,
          l.timestamp || new Date().toISOString(),
          l.user || 'admin',
          l.action,
          l.entity,
          l.entityId,
          l.details || '',
        ]
      );
    }
    counts['cms_audit_logs'] = logs.length;

    console.log('[DEYSLA DB] Seeding completed successfully. Record counts:', counts);

    return {
      success: true,
      message: 'Idempotent seed completed successfully for all CMS tables.',
      counts,
    };
  } catch (err: any) {
    console.error('[DEYSLA DB Seed Error]', err);
    return {
      success: false,
      message: `Seeding error: ${err?.message || 'Unknown error'}`,
      counts,
    };
  } finally {
    conn.release();
  }
}

// Allow direct CLI execution: tsx src/server/db/seedMysql.ts
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('seedMysql.ts')) {
  console.log('[DEYSLA DB] Executing MySQL Seed Script...');
  seedMysqlDatabase().then((res) => {
    console.log(res.message);
    console.log(JSON.stringify(res.counts, null, 2));
    process.exit(res.success ? 0 : 1);
  });
}
