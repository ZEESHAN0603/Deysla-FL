import { getMysqlPool, checkMysqlConnection } from '../mysql.ts';

export interface Migration {
  id: string;
  name: string;
  up: string[];
}

export const MIGRATIONS: Migration[] = [
  {
    id: '001_create_cms_schema',
    name: 'Create CMS and Website Content Tables',
    up: [
      `CREATE TABLE IF NOT EXISTS cms_migrations (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_pages (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        title_en VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) DEFAULT '',
        meta_title VARCHAR(255) DEFAULT '',
        meta_description TEXT,
        is_published TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_page_slug (slug),
        INDEX idx_page_published (is_published)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_page_sections (
        id VARCHAR(100) PRIMARY KEY,
        page_slug VARCHAR(100) NOT NULL,
        section_key VARCHAR(100) NOT NULL,
        title VARCHAR(255) DEFAULT '',
        subtitle VARCHAR(255) DEFAULT '',
        content LONGTEXT,
        sort_order INT DEFAULT 0,
        is_visible TINYINT(1) DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_page_section (page_slug, section_key),
        INDEX idx_section_page (page_slug),
        INDEX idx_section_order (sort_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_services (
        id VARCHAR(100) PRIMARY KEY,
        number VARCHAR(20) DEFAULT '',
        slug VARCHAR(100) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        short_description TEXT,
        overview LONGTEXT,
        image VARCHAR(500) DEFAULT '',
        image_alt VARCHAR(255) DEFAULT '',
        icon VARCHAR(100) DEFAULT '',
        sub_services LONGTEXT,
        deliverables LONGTEXT,
        process_steps LONGTEXT,
        relevant_categories LONGTEXT,
        relevant_brand_ids LONGTEXT,
        sort_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_service_slug (slug),
        INDEX idx_service_active (is_active),
        INDEX idx_service_order (sort_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_product_categories (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        icon VARCHAR(100) DEFAULT '',
        headline VARCHAR(255) DEFAULT '',
        description TEXT,
        featured_image VARCHAR(500) DEFAULT '',
        sort_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_cat_slug (slug),
        INDEX idx_cat_order (sort_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(150) NOT NULL,
        category_id VARCHAR(100) NOT NULL,
        category_name VARCHAR(255) DEFAULT '',
        description LONGTEXT,
        subcategories LONGTEXT,
        key_applications LONGTEXT,
        image VARCHAR(500) DEFAULT '',
        image_alt VARCHAR(255) DEFAULT '',
        brand_ids LONGTEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_product_cat (category_id),
        INDEX idx_product_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_catalog_items (
        id VARCHAR(100) PRIMARY KEY,
        sku VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        part_number VARCHAR(100) DEFAULT '',
        subcategory_id VARCHAR(100) DEFAULT '',
        subcategory_name VARCHAR(255) DEFAULT '',
        category_id VARCHAR(100) NOT NULL,
        category_name VARCHAR(255) DEFAULT '',
        description LONGTEXT,
        badge VARCHAR(100) DEFAULT '',
        specifications LONGTEXT,
        image VARCHAR(500) DEFAULT '',
        image_webp VARCHAR(500) DEFAULT '',
        brand_id VARCHAR(100) DEFAULT '',
        brand_name VARCHAR(100) DEFAULT '',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_catitem_sku (sku),
        INDEX idx_catitem_cat (category_id),
        INDEX idx_catitem_sub (subcategory_id),
        INDEX idx_catitem_brand (brand_id),
        INDEX idx_catitem_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_brands (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(150) NOT NULL,
        logo VARCHAR(500) DEFAULT '',
        category_ids LONGTEXT,
        product_ids LONGTEXT,
        origin VARCHAR(100) DEFAULT 'Global',
        website VARCHAR(255) DEFAULT '',
        description TEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_brand_slug (slug),
        INDEX idx_brand_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_brand_equipment (
        id VARCHAR(100) PRIMARY KEY,
        brand_id VARCHAR(100) NOT NULL,
        model VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT '',
        specs LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_be_brand (brand_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_projects (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(150) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT '',
        client_sector VARCHAR(150) DEFAULT '',
        location VARCHAR(150) DEFAULT '',
        short_description TEXT,
        full_overview LONGTEXT,
        scope_of_work LONGTEXT,
        technologies_used LONGTEXT,
        image VARCHAR(500) DEFAULT '',
        is_placeholder TINYINT(1) DEFAULT 0,
        is_featured TINYINT(1) DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_project_slug (slug),
        INDEX idx_project_featured (is_featured),
        INDEX idx_project_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_gallery (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT '',
        image VARCHAR(500) NOT NULL,
        description TEXT,
        sort_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_gallery_order (sort_order),
        INDEX idx_gallery_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_reviews (
        id VARCHAR(100) PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_role VARCHAR(150) DEFAULT '',
        company_name VARCHAR(255) DEFAULT '',
        industry VARCHAR(150) DEFAULT '',
        quote LONGTEXT NOT NULL,
        rating INT DEFAULT 5,
        project_ref VARCHAR(150) DEFAULT '',
        is_approved TINYINT(1) DEFAULT 1,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_review_active (is_active),
        INDEX idx_review_approved (is_approved)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_faqs (
        id VARCHAR(100) PRIMARY KEY,
        category VARCHAR(100) DEFAULT 'General',
        question_en TEXT NOT NULL,
        question_ar TEXT,
        answer_en LONGTEXT NOT NULL,
        answer_ar LONGTEXT,
        sort_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_faq_order (sort_order),
        INDEX idx_faq_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_complaints (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        contact VARCHAR(100) DEFAULT '',
        company_name VARCHAR(255) DEFAULT '',
        message LONGTEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'New',
        notes LONGTEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_complaint_status (status),
        INDEX idx_complaint_submitted (submitted_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_quotes (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        project_timeline VARCHAR(100) NOT NULL,
        notes LONGTEXT,
        items LONGTEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_quote_status (status),
        INDEX idx_quote_submitted (submitted_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_careers (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        position VARCHAR(150) NOT NULL,
        experience VARCHAR(100) DEFAULT '',
        notice_period VARCHAR(100) DEFAULT '',
        portfolio_url VARCHAR(500) DEFAULT '',
        cover_letter LONGTEXT,
        resume_filename VARCHAR(255) DEFAULT '',
        resume_path VARCHAR(500) DEFAULT '',
        status VARCHAR(50) DEFAULT 'New',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_career_status (status),
        INDEX idx_career_submitted (submitted_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_audit_logs (
        id VARCHAR(100) PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user VARCHAR(100) NOT NULL,
        action VARCHAR(50) NOT NULL,
        entity VARCHAR(50) NOT NULL,
        entity_id VARCHAR(100) NOT NULL,
        details LONGTEXT,
        INDEX idx_audit_entity (entity, entity_id),
        INDEX idx_audit_timestamp (timestamp)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS cms_media (
        id VARCHAR(100) PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        public_url VARCHAR(500) NOT NULL,
        folder VARCHAR(100) DEFAULT 'uploads',
        size_bytes BIGINT DEFAULT 0,
        mime_type VARCHAR(100) DEFAULT '',
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_media_folder (folder)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    ],
  },
];

export async function runMigrations(): Promise<{ success: boolean; appliedCount: number; message: string }> {
  const connCheck = await checkMysqlConnection(true);
  if (!connCheck.connected) {
    return {
      success: false,
      appliedCount: 0,
      message: `MySQL not reachable: ${connCheck.error}. Skipping database migrations.`,
    };
  }

  const pool = await getMysqlPool();
  if (!pool) {
    return { success: false, appliedCount: 0, message: 'Could not obtain database pool.' };
  }

  const conn = await pool.getConnection();
  try {
    // 1. Ensure migrations table exists
    await conn.query(`
      CREATE TABLE IF NOT EXISTS cms_migrations (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Fetch applied migrations
    const [rows]: [any[], any] = await conn.query('SELECT id FROM cms_migrations');
    const appliedIds = new Set(rows.map((r: any) => r.id));

    let appliedCount = 0;

    for (const migration of MIGRATIONS) {
      if (!appliedIds.has(migration.id)) {
        console.log(`[DEYSLA Migration] Applying migration ${migration.id}: ${migration.name}...`);
        for (const sql of migration.up) {
          await conn.query(sql);
        }
        await conn.query('INSERT INTO cms_migrations (id, name) VALUES (?, ?)', [
          migration.id,
          migration.name,
        ]);
        appliedCount++;
        console.log(`[DEYSLA Migration] Applied migration ${migration.id} successfully.`);
      }
    }

    return {
      success: true,
      appliedCount,
      message: `Database migrations checked successfully. Applied ${appliedCount} new migrations.`,
    };
  } catch (err: any) {
    console.error('[DEYSLA Migration Error]', err);
    return {
      success: false,
      appliedCount: 0,
      message: `Migration failed: ${err?.message || 'Unknown error'}`,
    };
  } finally {
    conn.release();
  }
}

// Allow direct CLI execution: tsx src/server/db/migrations/runMigrations.ts
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('runMigrations.ts')) {
  console.log('[DEYSLA DB] Running database migrations...');
  runMigrations().then((res) => {
    console.log(res.message);
    process.exit(res.success ? 0 : 1);
  });
}
