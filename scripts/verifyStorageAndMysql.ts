import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { query, execute, getMysqlPool } from '../src/server/db/mysql.ts';
import { getCatalog, saveProduct } from '../src/server/db/database.ts';
import {
  getUploadsDir,
  ensureUploadsDir,
  processAndSaveImageUpload,
  validateImagePath,
} from '../src/server/imageService.ts';

async function runVerification() {
  console.log('===============================================================');
  console.log('DEYSLA — Storage & MySQL CMS End-to-End Verification Test');
  console.log('===============================================================\n');

  const pool = await getMysqlPool();
  if (!pool) {
    throw new Error('Could not establish MySQL connection pool.');
  }

  const testId = `test-verify-${Date.now()}`;
  let uploadedUrl = '';
  let uploadedFilename = '';
  let uploadedFilePath = '';

  try {
    // ------------------------------------------------------------------------
    // Step 1: Create a 100x100 test PNG image buffer and test upload
    // ------------------------------------------------------------------------
    console.log('Step 1: Testing persistent image upload & sharp WebP processing...');
    const testPngBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 102, b: 0, alpha: 1 }, // Orange
      },
    })
      .png()
      .toBuffer();

    const base64Data = `data:image/png;base64,${testPngBuffer.toString('base64')}`;
    const uploadResult = await processAndSaveImageUpload(base64Data, 'test-persistent-asset');

    if (!uploadResult.success || !uploadResult.url) {
      throw new Error(`Upload failed: ${uploadResult.error}`);
    }

    uploadedUrl = uploadResult.url;
    uploadedFilename = path.basename(uploadedUrl);
    uploadedFilePath = path.join(getUploadsDir(), uploadedFilename);

    console.log(`[PASS] Upload succeeded. URL: ${uploadedUrl}`);
    console.log(`       Target file: ${uploadedFilePath}\n`);

    // ------------------------------------------------------------------------
    // Step 2: Verify file exists in persistent storage directory
    // ------------------------------------------------------------------------
    console.log('Step 2: Verifying file existence on persistent storage...');
    if (!fs.existsSync(uploadedFilePath)) {
      throw new Error(`Uploaded file does not exist at ${uploadedFilePath}`);
    }
    const stat = fs.statSync(uploadedFilePath);
    console.log(`[PASS] File exists on disk. Size: ${stat.size} bytes\n`);

    // ------------------------------------------------------------------------
    // Step 3: Verify MySQL cms_media registration
    // ------------------------------------------------------------------------
    console.log('Step 3: Checking MySQL cms_media table record...');
    const mediaRows = await query<any>(
      'SELECT id, filename, public_url, size_bytes, mime_type, uploaded_at FROM cms_media WHERE filename = ?',
      [uploadedFilename]
    );

    if (mediaRows.length === 0) {
      throw new Error(`No record in cms_media for filename ${uploadedFilename}`);
    }

    console.log(`[PASS] Found in cms_media: ID "${mediaRows[0].id}", URL "${mediaRows[0].public_url}", MIME "${mediaRows[0].mime_type}"\n`);

    // ------------------------------------------------------------------------
    // Step 4: Validate image path via validateImagePath
    // ------------------------------------------------------------------------
    console.log('Step 4: Validating image path resolver...');
    const pathCheck = validateImagePath(uploadedUrl);
    if (!pathCheck.valid || !pathCheck.exists) {
      throw new Error(`validateImagePath failed for ${uploadedUrl}: ${pathCheck.message}`);
    }
    console.log(`[PASS] Path validation succeeded: ${pathCheck.message}\n`);

    // ------------------------------------------------------------------------
    // Step 5: Save a test product via saveProduct (Admin Panel workflow)
    // ------------------------------------------------------------------------
    console.log('Step 5: Testing Admin Panel product save with uploaded image URL...');
    const testProduct = await saveProduct(
      {
        id: testId,
        name: `Test Verification Hardware ${testId}`,
        slug: testId,
        categoryId: 'data-center-infrastructure',
        categoryName: 'Data Center & Server Infrastructure',
        description: 'Temporary test record for persistent image storage verification.',
        image: uploadedUrl,
        imageAlt: 'Test Hardware Image',
        subcategories: ['Rack Servers', 'Compute Nodes'],
        keyApplications: ['Unit Testing', 'Verification'],
        brandIds: ['cisco', 'hpe'],
        status: 'active',
        isCreate: true,
      },
      'automated_test_runner'
    );

    console.log(`[PASS] Product created in MySQL: ID "${testProduct.id}", Image "${testProduct.image}"\n`);

    // ------------------------------------------------------------------------
    // Step 6: Verify website getCatalog() reflects the new record and image
    // ------------------------------------------------------------------------
    console.log('Step 6: Verifying public website getCatalog() fetches new product and image...');
    const catalog = await getCatalog();
    const fetchedProd = catalog.products.find((p) => p.id === testId);
    if (!fetchedProd) {
      throw new Error(`Product ${testId} not found in getCatalog() results`);
    }
    if (fetchedProd.image !== uploadedUrl) {
      throw new Error(`Expected image "${uploadedUrl}", but got "${fetchedProd.image}"`);
    }
    console.log(`[PASS] Website getCatalog() correctly returned product with image "${fetchedProd.image}"\n`);

    // ------------------------------------------------------------------------
    // Step 7: Test Direct MySQL Edit reflection
    // ------------------------------------------------------------------------
    console.log('Step 7: Testing Direct MySQL Edit synchronization...');
    const directUpdatedName = `Direct MySQL Updated ${testId}`;
    const directUpdatedDesc = `Directly edited via raw SQL at ${new Date().toISOString()}`;
    await execute(
      'UPDATE cms_products SET name = ?, description = ?, updated_at = NOW() WHERE id = ?',
      [directUpdatedName, directUpdatedDesc, testId]
    );

    const catalogAfterDirectEdit = await getCatalog();
    const directFetched = catalogAfterDirectEdit.products.find((p) => p.id === testId);
    if (!directFetched) {
      throw new Error(`Product ${testId} missing after direct MySQL update`);
    }
    if (directFetched.name !== directUpdatedName || directFetched.description !== directUpdatedDesc) {
      throw new Error(`Direct MySQL edit not reflected. Expected "${directUpdatedName}", got "${directFetched.name}"`);
    }
    console.log(`[PASS] Direct MySQL edit immediately reflected in website catalog: "${directFetched.name}"\n`);

    // ------------------------------------------------------------------------
    // Step 8: Clean up only the disposable test data
    // ------------------------------------------------------------------------
    console.log('Step 8: Cleaning up test data...');
    await execute('DELETE FROM cms_products WHERE id = ?', [testId]);
    await execute('DELETE FROM cms_media WHERE filename = ?', [uploadedFilename]);
    await execute('DELETE FROM cms_audit_logs WHERE entity_id = ? OR details LIKE ?', [testId, `%${uploadedUrl}%`]);

    if (fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }

    console.log('[PASS] Test product, test media log, and test image file successfully cleaned up.\n');

    console.log('===============================================================');
    console.log('[ALL VERIFICATION CHECKS PASSED SUCCESSFULLY]');
    console.log('===============================================================');
  } catch (err: any) {
    console.error('[TEST FAILED]', err);

    // Attempt cleanup on failure
    try {
      await execute('DELETE FROM cms_products WHERE id = ?', [testId]);
      if (uploadedFilename) {
        await execute('DELETE FROM cms_media WHERE filename = ?', [uploadedFilename]);
      }
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    } catch {}

    process.exit(1);
  } finally {
    await pool.end();
  }
}

runVerification();
