const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('=== DEYSLA E2E AUTOMATED ADMIN INTEGRATION TEST ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Admin Auth: Invalid credentials
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrongpassword' }),
    });
    const data = await res.json();
    assert(res.status === 401 && !data.success, 'Invalid credentials rejected with 401');
  } catch (e) {
    assert(false, `Login failure test error: ${e.message}`);
  }

  // 2. Admin Auth: Valid credentials
  let token = '';
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'deyslaAdmin2026!' }),
    });
    const data = await res.json();
    assert(res.status === 200 && data.success && !!data.token, 'Admin login succeeded and returned token');
    token = data.token;
  } catch (e) {
    assert(false, `Login success test error: ${e.message}`);
  }

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // 3. Verify Session /api/admin/auth/me
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth/me`, { headers: authHeaders });
    const data = await res.json();
    assert(res.status === 200 && data.authenticated && data.user.username === 'admin', 'Session verification /me confirmed admin user');
  } catch (e) {
    assert(false, `/me verification error: ${e.message}`);
  }

  // 4. Test Protected API without Token
  try {
    const res = await fetch(`${BASE_URL}/api/admin/stats`);
    assert(res.status === 401, 'Protected /api/admin/stats strictly rejects unauthenticated access');
  } catch (e) {
    assert(false, `Auth guard error: ${e.message}`);
  }

  // 5. Product Creation
  const testProdId = `test-switch-${Date.now()}`;
  try {
    const res = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        id: testProdId,
        name: 'DEYSLA Enterprise Core Switch X1',
        slug: testProdId,
        categoryId: 'networking',
        categoryName: 'Networking',
        description: 'Next-gen 100G aggregation chassis for campus core.',
        image: '/assets/products/network-switches.webp',
        brandIds: ['cisco', 'aruba'],
        subcategories: ['Modular Core Switch', '100G Uplinks'],
        keyApplications: ['Enterprise Campus Core', 'High Throughput SAN'],
        status: 'active',
      }),
    });
    const data = await res.json();
    assert(res.status === 200 && data.success && data.product.id === testProdId, `Product creation succeeded for ${testProdId}`);
  } catch (e) {
    assert(false, `Product creation error: ${e.message}`);
  }

  // 6. Duplicate Product Rejection
  try {
    const res = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        id: testProdId,
        name: 'Duplicate Item',
        categoryId: 'networking',
      }),
    });
    const data = await res.json();
    assert(data.success === false, 'Duplicate product ID creation safely rejected with error');
  } catch (e) {
    assert(false, `Duplicate product test error: ${e.message}`);
  }

  // 7. Product Update & Status Toggle
  try {
    const res = await fetch(`${BASE_URL}/api/admin/products/${testProdId}/toggle-status`, {
      method: 'POST',
      headers: authHeaders,
    });
    const data = await res.json();
    assert(data.success && data.product.status === 'inactive', 'Toggled product status to inactive');

    // Toggle back to active
    const res2 = await fetch(`${BASE_URL}/api/admin/products/${testProdId}/toggle-status`, {
      method: 'POST',
      headers: authHeaders,
    });
    const data2 = await res2.json();
    assert(data2.success && data2.product.status === 'active', 'Toggled product status back to active');
  } catch (e) {
    assert(false, `Product toggle error: ${e.message}`);
  }

  // 8. Sub-product (CatalogItem) Creation & Parent Relationship
  const testSkuId = `sku-${testProdId}-48p`;
  try {
    const res = await fetch(`${BASE_URL}/api/admin/catalog-items`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        id: testSkuId,
        name: 'Core Switch X1 48-Port 10G SFP+',
        subcategoryId: testProdId,
        subcategoryName: 'DEYSLA Enterprise Core Switch X1',
        categoryId: 'networking',
        brand: 'DEYSLA / OEM',
        badge: '48x 10G SFP+ / 6x 100G QSFP28',
        specs: ['Non-blocking 1.92 Tbps fabric', 'Dual Hot-Swap Titanium Power Supplies'],
        image: '/assets/products/network-switches.webp',
        status: 'active',
      }),
    });
    const data = await res.json();
    assert(data.success && data.catalogItem.subcategoryId === testProdId, 'Sub-product SKU created with parent-product link');
  } catch (e) {
    assert(false, `Sub-product creation error: ${e.message}`);
  }

  // 9. Existing Image Validation
  try {
    const res = await fetch(`${BASE_URL}/api/admin/validate-image-path`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ imagePath: '/assets/products/network-switches.webp' }),
    });
    const data = await res.json();
    assert(data.valid && data.exists, 'Valid existing image verified successfully');

    const resBad = await fetch(`${BASE_URL}/api/admin/validate-image-path`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ imagePath: '/assets/non-existent-random.webp' }),
    });
    const dataBad = await resBad.json();
    assert(!dataBad.exists, 'Non-existent image path rejected by validator');
  } catch (e) {
    assert(false, `Image validation error: ${e.message}`);
  }

  // 10. New Image Upload via Server with Sharp WebP Conversion
  let uploadedUrl = '';
  try {
    // 1x1 transparent PNG in base64
    const samplePngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const res = await fetch(`${BASE_URL}/api/admin/upload-image`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        imageBase64: samplePngBase64,
        preferredName: 'test-audit-upload',
      }),
    });
    const data = await res.json();
    assert(data.success && data.url && data.url.endsWith('.webp'), `Image uploaded & converted to WebP: ${data.url}`);
    uploadedUrl = data.url;

    // Verify file exists on server disk
    const diskPath = path.resolve(process.cwd(), 'public', uploadedUrl.replace(/^\//, ''));
    assert(fs.existsSync(diskPath), `Uploaded file confirmed physically on disk: ${diskPath}`);
  } catch (e) {
    assert(false, `Image upload error: ${e.message}`);
  }

  // 11. Customer Complaint Status & Internal Notes
  try {
    // Get existing complaints
    const listRes = await fetch(`${BASE_URL}/api/admin/complaints`, { headers: authHeaders });
    const listData = await listRes.json();
    assert(listData.complaints.length > 0, `Complaints found: ${listData.complaints.length}`);
    const firstComplaint = listData.complaints[0];

    // Update status to 'In Progress' and add note
    const updateRes = await fetch(`${BASE_URL}/api/admin/complaints/${encodeURIComponent(firstComplaint.id)}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        status: 'In Progress',
        notes: 'Assigned to senior network engineer Tariq for site survey.',
      }),
    });
    const updateData = await updateRes.json();
    assert(
      updateData.success &&
      updateData.complaint.status === 'In Progress' &&
      updateData.complaint.notes.includes('site survey'),
      'Complaint status updated to "In Progress" with persistent internal notes'
    );
  } catch (e) {
    assert(false, `Complaint update error: ${e.message}`);
  }

  // 12. View-Only Quotation Requests
  try {
    const quotesRes = await fetch(`${BASE_URL}/api/admin/quotes`, { headers: authHeaders });
    const quotesData = await quotesRes.json();
    assert(quotesData.quotes.length > 0, `Quotes found: ${quotesData.quotes.length}`);
    const firstQuote = quotesData.quotes[0];
    assert(!!firstQuote.id && !!firstQuote.companyName && Array.isArray(firstQuote.items), `Quote ${firstQuote.id} inspected with ${firstQuote.items.length} BOQ items`);
  } catch (e) {
    assert(false, `Quote inspection error: ${e.message}`);
  }

  // 13. Audit Log Verification
  try {
    const auditRes = await fetch(`${BASE_URL}/api/admin/audit-logs`, { headers: authHeaders });
    const auditData = await auditRes.json();
    assert(auditData.logs.length >= 3, `Audit log contains ${auditData.logs.length} tracked administrative events`);
  } catch (e) {
    assert(false, `Audit log error: ${e.message}`);
  }

  // 14. Recoverable Backup
  try {
    const backupRes = await fetch(`${BASE_URL}/api/admin/backup`, {
      method: 'POST',
      headers: authHeaders,
    });
    const backupData = await backupRes.json();
    assert(backupData.success && fs.existsSync(backupData.backupPath), `Snapshot backup created and verified: ${backupData.backupPath}`);
  } catch (e) {
    assert(false, `Backup error: ${e.message}`);
  }

  // 15. Verify Public /api/catalog includes active items
  try {
    const catRes = await fetch(`${BASE_URL}/api/catalog`);
    const catData = await catRes.json();
    const hasTestProduct = catData.products.some((p) => p.id === testProdId);
    assert(hasTestProduct, `Public /api/catalog successfully reflects newly created product ${testProdId}`);
  } catch (e) {
    assert(false, `Public catalog verification error: ${e.message}`);
  }

  console.log(`\n=== TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runTests();
