import { checkMysqlConnection, getMysqlPool, query, execute } from '../src/server/db/mysql.ts';
import {
  getCatalog,
  saveProduct,
  toggleProductStatus,
  saveCatalogItem,
  toggleCatalogItemStatus,
  saveBrand,
  toggleBrandStatus,
  getComplaints,
  recordComplaint,
  updateComplaint,
  getQuotes,
  recordQuote,
  getDashboardStats,
  getAuditLogs,
} from '../src/server/db/database.ts';
import {
  getPublicCmsContent,
  updateCmsSetting,
  savePageSection,
  saveCmsService,
  deleteCmsService,
  getCareerApplications,
  recordCareerApplication,
  updateCareerApplicationStatus,
} from '../src/server/db/cmsStore.ts';
import { seedMysqlDatabase } from '../src/server/db/seedMysql.ts';

async function runTests() {
  console.log('===============================================================');
  console.log('DEYSLA — Automated Verification Suite: MySQL Runtime Storage');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${detail ? `- ${detail}` : ''}`);
      failed++;
    }
  }

  // 1. Connection & Initial Health
  console.log('--- Test Group 1: MySQL Connectivity & Health ---');
  const connCheck = await checkMysqlConnection(true);
  assert(connCheck.connected === true, 'MySQL connection is active and healthy', connCheck.error || '');
  assert(connCheck.dbName === 'u157314465_DEYSLA', 'Connected to target database u157314465_DEYSLA');

  // 2. Catalog & Products CRUD
  console.log('\n--- Test Group 2: Product Lifecycle in MySQL ---');
  const initialCatalog = await getCatalog();
  assert(initialCatalog.products.length > 0, `getCatalog() returned ${initialCatalog.products.length} products`);

  const testProdId = `test-prod-${Date.now()}`;
  const testProdName = `Automated Test Firewall ${Date.now()}`;

  // Create
  const createdProd = await saveProduct({
    id: testProdId,
    name: testProdName,
    categoryId: 'network-security',
    categoryName: 'Network Security',
    description: 'Enterprise grade firewall unit for automated test verification.',
    subcategories: ['Firewalls', 'Next-Gen Security'],
    keyApplications: ['Datacenter', 'Campus'],
    isCreate: true,
  });
  assert(createdProd.id === testProdId, 'Product created with correct ID');
  assert(createdProd.status === 'active', 'Product defaults to active status');

  // Verify in MySQL directly
  const [dbProd] = await query<any>('SELECT * FROM cms_products WHERE id = ?', [testProdId]);
  assert(dbProd && dbProd.name === testProdName, 'Product verified directly in cms_products table');

  // Update
  const updatedDesc = 'Updated description for live verification.';
  const updatedProd = await saveProduct({
    id: testProdId,
    name: testProdName,
    categoryId: 'network-security',
    description: updatedDesc,
  });
  assert(updatedProd.description === updatedDesc, 'Product update persisted');

  // Status Toggle
  const toggled = await toggleProductStatus(testProdId);
  assert(toggled.status === 'inactive', 'Product status toggled to inactive');
  const toggledBack = await toggleProductStatus(testProdId);
  assert(toggledBack.status === 'active', 'Product status toggled back to active');

  // 3. Catalog SKU Items CRUD
  console.log('\n--- Test Group 3: Catalog Item (SKU) in MySQL ---');
  const testSkuId = `sku-test-${Date.now()}`;
  const testSku = await saveCatalogItem({
    id: testSkuId,
    name: 'DEYSLA FortiGate 200F Bundle',
    subcategoryId: 'firewalls',
    categoryId: 'network-security',
    brand: 'Fortinet',
    specs: ['27 Gbps Firewall', '3 Gbps IPSec VPN'],
    isCreate: true,
  });
  assert(testSku.id === testSkuId, 'Catalog item created');
  const [dbSku] = await query<any>('SELECT * FROM cms_catalog_items WHERE id = ?', [testSkuId]);
  assert(dbSku && dbSku.brand_name === 'Fortinet', 'Catalog item verified directly in cms_catalog_items');

  // Toggle SKU status
  const toggledSku = await toggleCatalogItemStatus(testSkuId);
  assert(toggledSku.status === 'inactive', 'SKU toggled to inactive');
  await toggleCatalogItemStatus(testSkuId);

  // 4. Brands CRUD
  console.log('\n--- Test Group 4: Brands Lifecycle in MySQL ---');
  const testBrandId = `brand-test-${Date.now()}`;
  const createdBrand = await saveBrand({
    id: testBrandId,
    name: 'CyberShield Systems',
    origin: 'United States',
    description: 'Next-gen enterprise networking partner.',
    categoryIds: ['network-security'],
    isCreate: true,
  });
  assert(createdBrand.id === testBrandId, 'Brand created successfully');
  const [dbBrand] = await query<any>('SELECT * FROM cms_brands WHERE id = ?', [testBrandId]);
  assert(dbBrand && dbBrand.origin === 'United States', 'Brand verified directly in cms_brands');

  // 5. CMS Settings & Page Sections
  console.log('\n--- Test Group 5: CMS Content Mutations in MySQL ---');
  const testSettingKey = `test_setting_${Date.now()}`;
  const testSettingVal = { verified: true, timestamp: Date.now() };
  await updateCmsSetting(testSettingKey, testSettingVal);

  const [dbSetting] = await query<any>('SELECT * FROM cms_settings WHERE setting_key = ?', [testSettingKey]);
  assert(dbSetting !== undefined, 'CMS setting persisted directly to cms_settings');

  // CMS Service
  const testServiceId = `srv-test-${Date.now()}`;
  const createdService = await saveCmsService({
    id: testServiceId,
    title: 'Automated Datacenter Audit Service',
    shortDescription: 'Verifying live MySQL persistence for enterprise services.',
    subServices: ['Power Audit', 'Thermal Mapping'],
  });
  assert(createdService.id === testServiceId, 'CMS Service saved');
  const [dbSrv] = await query<any>('SELECT * FROM cms_services WHERE id = ?', [testServiceId]);
  assert(dbSrv && dbSrv.title === createdService.title, 'Service verified in cms_services');

  // Delete CMS Service
  await deleteCmsService(testServiceId);
  const [deletedSrvCheck] = await query<any>('SELECT * FROM cms_services WHERE id = ?', [testServiceId]);
  assert(!deletedSrvCheck, 'CMS Service deleted from cms_services');

  // 6. Customer Inquiries & Complaints
  console.log('\n--- Test Group 6: Customer Inquiries Persistence in MySQL ---');
  const testComplaint = await recordComplaint({
    name: 'Dr. Tariq Al-Mansoor',
    email: 'tariq.mansoor@example-enterprise.sa',
    contact: '+966-501234567',
    companyName: 'Al-Mansoor Engineering Group',
    message: 'Requesting emergency technical inspection for fiber backbone.',
    type: 'Contact Enquiry',
  });
  assert(testComplaint.id.startsWith('CMP-'), 'Complaint generated valid CMP reference ID');

  const [dbComplaint] = await query<any>('SELECT * FROM cms_complaints WHERE id = ?', [testComplaint.id]);
  assert(dbComplaint && dbComplaint.email === 'tariq.mansoor@example-enterprise.sa', 'Inquiry persisted directly to cms_complaints');
  assert(dbComplaint.type === 'Contact Enquiry', 'Inquiry type persisted correctly');

  // Admin status update
  const updatedComp = await updateComplaint(testComplaint.id, {
    status: 'In Progress',
    notes: 'Assigned to regional Dammam field engineering dispatch.',
  });
  assert(updatedComp.status === 'In Progress', 'Inquiry status update persisted');

  // 7. Quotation Requests (RFQs)
  console.log('\n--- Test Group 7: Quotation Requests (RFQs) in MySQL ---');
  const testRfqRef = `DEY-RFQ-${Date.now().toString().slice(-6)}`;
  const testQuote = await recordQuote({
    rfqReference: testRfqRef,
    name: 'Eng. Khalid Al-Otaibi',
    email: 'khalid@otaibi-telecom.com',
    phone: '+966-559876543',
    companyName: 'Otaibi Telecom Ltd',
    city: 'Riyadh',
    projectTimeline: '1-2 weeks',
    notes: 'Urgent staging requirement',
    items: [
      { title: 'Cat6A S/FTP 500m Drum', quantity: 10, brand: 'Schneider' },
      { title: '24-Port Gigabit Managed Switch', quantity: 4, brand: 'Cisco' },
    ],
  });
  assert(testQuote.id === testRfqRef, 'Quote generated with correct reference');

  const [dbQuote] = await query<any>('SELECT * FROM cms_quotes WHERE id = ?', [testRfqRef]);
  assert(dbQuote && dbQuote.company_name === 'Otaibi Telecom Ltd', 'Quote record verified directly in cms_quotes');
  const parsedItems = JSON.parse(dbQuote.items);
  assert(parsedItems.length === 2, 'Quote items JSON parsed correctly from MySQL');

  // 8. Career Applications
  console.log('\n--- Test Group 8: Career Applications in MySQL ---');
  const testCareer = await recordCareerApplication({
    name: 'Ahmad Al-Ghamdi',
    email: 'ahmad.ghamdi@test-applicant.sa',
    phone: '+966-541122334',
    position: 'Senior Network Infrastructure Engineer',
    experience: '8 Years',
    noticePeriod: '30 Days',
    coverLetter: 'Extensive experience in multi-site Cisco and Fortinet enterprise routing.',
  });
  assert(testCareer.id.startsWith('CAR-'), 'Career application created with CAR ID');

  const [dbCareer] = await query<any>('SELECT * FROM cms_careers WHERE id = ?', [testCareer.id]);
  assert(dbCareer && dbCareer.position === 'Senior Network Infrastructure Engineer', 'Career application verified in cms_careers');

  // Status update
  const updatedCareer = await updateCareerApplicationStatus(
    testCareer.id,
    'Reviewing',
    'admin',
    'Candidate shortlisted for technical interview'
  );
  assert(updatedCareer.status === 'Reviewing', 'Career status updated');

  // 9. Audit Logging
  console.log('\n--- Test Group 9: Audit Logging in MySQL ---');
  const logs = await getAuditLogs();
  assert(logs.length > 0, `getAuditLogs() returned ${logs.length} audit entries from MySQL`);
  const recentAction = logs.find((l) => l.entityId === testProdId);
  assert(recentAction !== undefined, 'Audit log contains record of test product modification');

  // 10. Public API Data Consistency
  console.log('\n--- Test Group 10: Public API Consistency ---');
  const publicCms = await getPublicCmsContent();
  assert(publicCms.source === 'mysql', 'Public CMS content confirmed reading from MySQL');
  assert(publicCms.services.length > 0, `Public services: ${publicCms.services.length} items`);
  assert(publicCms.projects.length > 0, `Public projects: ${publicCms.projects.length} items`);

  const catalogSnapshot = await getCatalog();
  const foundTestProd = catalogSnapshot.products.find((p) => p.id === testProdId);
  assert(foundTestProd !== undefined, 'Public catalog includes newly created product from MySQL');

  // 11. Seed Safety Test (Rerun seed and confirm test records are NOT overwritten)
  console.log('\n--- Test Group 11: Idempotent Seed Re-run Safety ---');
  const seedResult = await seedMysqlDatabase();
  assert(seedResult.success === true, 'seedMysqlDatabase() executed safely without error');

  // Verify test product still exists with our updated description
  const [dbProdAfterSeed] = await query<any>('SELECT * FROM cms_products WHERE id = ?', [testProdId]);
  assert(
    dbProdAfterSeed && dbProdAfterSeed.description === updatedDesc,
    'Seed rerun PRESERVED admin-edited product description (NOT overwritten)'
  );

  // Clean up test records
  console.log('\n--- Cleaning up temporary test records ---');
  await execute('DELETE FROM cms_products WHERE id = ?', [testProdId]);
  await execute('DELETE FROM cms_catalog_items WHERE id = ?', [testSkuId]);
  await execute('DELETE FROM cms_brands WHERE id = ?', [testBrandId]);
  await execute('DELETE FROM cms_settings WHERE setting_key = ?', [testSettingKey]);
  await execute('DELETE FROM cms_complaints WHERE id = ?', [testComplaint.id]);
  await execute('DELETE FROM cms_quotes WHERE id = ?', [testRfqRef]);
  await execute('DELETE FROM cms_careers WHERE id = ?', [testCareer.id]);
  console.log('Cleanup completed cleanly.');

  // Summary
  console.log('\n===============================================================');
  console.log(`Verification Complete: ${passed} PASSED, ${failed} FAILED.`);
  console.log('===============================================================');

  const pool = await getMysqlPool();
  if (pool) await pool.end();

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
