import { checkMysqlConnection, getMysqlPool, query } from '../src/server/db/mysql.ts';

const EXPECTED_TABLES = [
  'cms_migrations',
  'cms_settings',
  'cms_pages',
  'cms_page_sections',
  'cms_services',
  'cms_product_categories',
  'cms_products',
  'cms_catalog_items',
  'cms_brands',
  'cms_brand_equipment',
  'cms_projects',
  'cms_gallery',
  'cms_reviews',
  'cms_faqs',
  'cms_complaints',
  'cms_quotes',
  'cms_careers',
  'cms_audit_logs',
  'cms_media',
];

async function main() {
  console.log('===============================================================');
  console.log('DEYSLA — Safe Read-Only Database & Schema Verification');
  console.log('===============================================================\n');

  // 1. Check Connectivity
  console.log('1. Checking MySQL Connection...');
  const connCheck = await checkMysqlConnection(true);

  if (!connCheck.connected) {
    console.error(`[ERROR] Unable to connect to MySQL: ${connCheck.error}`);
    process.exit(1);
  }

  console.log(`[OK] Connected to database: "${connCheck.dbName}"\n`);

  const pool = await getMysqlPool();
  if (!pool) {
    console.error('[ERROR] Could not obtain connection pool.');
    process.exit(1);
  }

  try {
    // 2. Fetch existing tables
    console.log('2. Inspecting Existing Tables...');
    const [rawTables]: [any[], any] = await pool.query('SHOW TABLES');
    const existingTables = new Set(rawTables.map((r) => Object.values(r)[0] as string));

    console.log(`Found ${existingTables.size} total tables in database.\n`);

    // 3. Verify each expected table & row count (read-only)
    console.log('3. Verifying Required CMS Tables & Row Counts (Read-Only):');
    console.log('---------------------------------------------------------------');
    console.log(String('Table Name').padEnd(28) + String('Status').padEnd(12) + 'Row Count');
    console.log('---------------------------------------------------------------');

    let allTablesExist = true;

    for (const table of EXPECTED_TABLES) {
      if (existingTables.has(table)) {
        const [[{ count }]]: [any, any] = await pool.query(`SELECT COUNT(*) as count FROM \`${table}\``);
        console.log(table.padEnd(28) + '[FOUND]'.padEnd(12) + `${count} rows`);
      } else {
        console.log(table.padEnd(28) + '[MISSING]'.padEnd(12) + '-');
        allTablesExist = false;
      }
    }
    console.log('---------------------------------------------------------------\n');

    // 4. Verify Applied Migrations
    console.log('4. Inspecting Applied Migrations:');
    if (existingTables.has('cms_migrations')) {
      const [migrations]: [any[], any] = await pool.query(
        'SELECT id, name, applied_at FROM cms_migrations ORDER BY applied_at ASC'
      );
      for (const m of migrations) {
        console.log(` - [${m.id}] ${m.name} (Applied at: ${m.applied_at})`);
      }
    } else {
      console.log(' - cms_migrations table does not exist.');
    }
    console.log('');

    // 5. Verify Key Schema Enhancements (read-only column inspection)
    console.log('5. Inspecting Specific Column Definitions:');
    if (existingTables.has('cms_complaints')) {
      const [complaintCols]: [any[], any] = await pool.query(
        "SHOW COLUMNS FROM cms_complaints LIKE 'type'"
      );
      const hasType = complaintCols.length > 0;
      console.log(` - cms_complaints.type column: ${hasType ? '[EXISTS]' : '[MISSING]'}`);
    }

    if (existingTables.has('cms_careers')) {
      const [careerCols]: [any[], any] = await pool.query(
        "SHOW COLUMNS FROM cms_careers LIKE 'notes'"
      );
      const hasNotes = careerCols.length > 0;
      console.log(` - cms_careers.notes column: ${hasNotes ? '[EXISTS]' : '[MISSING]'}`);
    }
    console.log('');

    // Final Summary
    console.log('===============================================================');
    if (allTablesExist) {
      console.log('[SUCCESS] All 19 required CMS tables exist and are verified.');
    } else {
      console.log('[WARNING] One or more required tables are missing.');
    }
    console.log('===============================================================');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('[ERROR] Uncaught error during read-only verification:', err);
  process.exit(1);
});
