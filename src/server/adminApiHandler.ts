import {
  getCatalog,
  saveProduct,
  toggleProductStatus,
  saveCatalogItem,
  toggleCatalogItemStatus,
  saveBrand,
  toggleBrandStatus,
  getComplaints,
  updateComplaint,
  getQuotes,
  getDashboardStats,
  getAuditLogs,
  createCatalogBackup,
} from './db/database.ts';
import {
  getPublicCmsContent,
  updateCmsSetting,
  savePageSection,
  saveCmsService,
  deleteCmsService,
  saveCmsProject,
  deleteCmsProject,
  saveCmsGalleryItem,
  deleteCmsGalleryItem,
  saveCmsReview,
  deleteCmsReview,
  saveCmsFaq,
  deleteCmsFaq,
  getCareerApplications,
  updateCareerApplicationStatus,
} from './db/cmsStore.ts';
import { checkMysqlConnection, getDatabaseConfig } from './db/mysql.ts';
import { seedMysqlDatabase } from './db/seedMysql.ts';
import { runMigrations } from './db/migrations/runMigrations.ts';
import {
  authenticateAdminCredentials,
  requireAdmin,
  extractTokenFromRequest,
  verifyAdminToken,
} from './auth.ts';
import {
  listExistingImages,
  validateImagePath,
  processAndSaveImageUpload,
} from './imageService.ts';

export async function handleAdminApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  // --------------------------------------------------------------------------
  // Public CMS Content Endpoint
  // --------------------------------------------------------------------------
  if (pathname === '/api/cms/content' && method === 'GET') {
    try {
      const cmsData = await getPublicCmsContent();
      return Response.json({ success: true, ...cmsData });
    } catch (err: any) {
      return Response.json({ success: false, error: err?.message }, { status: 500 });
    }
  }

  // --------------------------------------------------------------------------
  // Public Catalog Endpoint
  // --------------------------------------------------------------------------
  if (pathname === '/api/catalog' && method === 'GET') {
    const catalog = getCatalog();
    // Return all data (or only active for public, but including status)
    return Response.json({
      success: true,
      lastUpdated: catalog.lastUpdated,
      products: catalog.products.filter((p) => p.status !== 'inactive'),
      catalogItems: catalog.catalogItems.filter((i) => i.status !== 'inactive'),
      brands: catalog.brands.filter((b) => b.status !== 'inactive'),
      categories: catalog.categories,
      brandEquipmentItems: catalog.brandEquipmentItems,
    });
  }

  // --------------------------------------------------------------------------
  // Admin Auth Endpoints
  // --------------------------------------------------------------------------
  if (pathname === '/api/admin/auth/login' && method === 'POST') {
    try {
      const body = await request.json().catch(() => ({}));
      const { username, password } = body;

      if (!username || !password) {
        return Response.json(
          { success: false, error: 'Username and password are required.' },
          { status: 400 }
        );
      }

      const authResult = authenticateAdminCredentials(username, password);
      if (!authResult.success || !authResult.token) {
        return Response.json(
          { success: false, error: authResult.error || 'Invalid credentials.' },
          { status: 401 }
        );
      }

      // Return token in body and in HttpOnly cookie
      const headers = new Headers();
      headers.append(
        'Set-Cookie',
        `deysla_admin_token=${authResult.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
      );

      return new Response(
        JSON.stringify({
          success: true,
          token: authResult.token,
          user: { username, role: 'admin' },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `deysla_admin_token=${authResult.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
          },
        }
      );
    } catch (err: any) {
      return Response.json({ success: false, error: err?.message }, { status: 500 });
    }
  }

  if (pathname === '/api/admin/auth/me' && method === 'GET') {
    const token = extractTokenFromRequest(request);
    const result = verifyAdminToken(token);
    if (!result.valid || !result.username) {
      return Response.json({ authenticated: false }, { status: 401 });
    }
    return Response.json({
      authenticated: true,
      user: { username: result.username, role: 'admin' },
    });
  }

  if (pathname === '/api/admin/auth/logout' && method === 'POST') {
    return new Response(JSON.stringify({ success: true, message: 'Logged out' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'deysla_admin_token=; Path=/; HttpOnly; Max-Age=0',
      },
    });
  }

  // --------------------------------------------------------------------------
  // Admin Protected Routes Guard
  // --------------------------------------------------------------------------
  if (pathname.startsWith('/api/admin/')) {
    const authCheck = requireAdmin(request);
    if (authCheck instanceof Response) {
      return authCheck;
    }
    const adminUser = authCheck.username;

    // 1. Dashboard Overview Stats
    if (pathname === '/api/admin/stats' && method === 'GET') {
      const stats = getDashboardStats();
      return Response.json({ success: true, stats });
    }

    // 2. Audit Logs
    if (pathname === '/api/admin/audit-logs' && method === 'GET') {
      const logs = getAuditLogs();
      return Response.json({ success: true, logs });
    }

    // 3. Manual Backup
    if (pathname === '/api/admin/backup' && method === 'POST') {
      const backupPath = createCatalogBackup('admin_manual');
      return Response.json({ success: true, backupPath });
    }

    // 4. Products CRUD & Status Toggle
    if (pathname === '/api/admin/products' && method === 'GET') {
      const catalog = getCatalog();
      return Response.json({ success: true, products: catalog.products });
    }

    if (pathname === '/api/admin/products' && (method === 'POST' || method === 'PUT')) {
      try {
        const body = await request.json().catch(() => ({}));
        if (!body.name || !body.categoryId) {
          return Response.json(
            { success: false, error: 'Product name and category are required.' },
            { status: 400 }
          );
        }
        const isCreate = body.isCreate !== undefined ? !!body.isCreate : (method === 'POST' && !body.isUpdate);
        const saved = saveProduct({ ...body, isCreate }, adminUser);
        return Response.json({ success: true, product: saved });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/products\/[^/]+\/toggle-status$/) && method === 'POST') {
      try {
        const id = pathname.replace('/api/admin/products/', '').replace('/toggle-status', '');
        const updated = toggleProductStatus(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, product: updated });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // 5. Sub-Products / Catalog Items CRUD & Status Toggle
    if (pathname === '/api/admin/catalog-items' && method === 'GET') {
      const catalog = getCatalog();
      return Response.json({ success: true, catalogItems: catalog.catalogItems });
    }

    if (pathname === '/api/admin/catalog-items' && (method === 'POST' || method === 'PUT')) {
      try {
        const body = await request.json().catch(() => ({}));
        if (!body.name || !body.subcategoryId) {
          return Response.json(
            { success: false, error: 'Sub-product name and parent product (subcategoryId) are required.' },
            { status: 400 }
          );
        }
        const isCreate = body.isCreate !== undefined ? !!body.isCreate : (method === 'POST' && !body.isUpdate);
        const saved = saveCatalogItem({ ...body, isCreate }, adminUser);
        return Response.json({ success: true, catalogItem: saved });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/catalog-items\/[^/]+\/toggle-status$/) && method === 'POST') {
      try {
        const id = pathname.replace('/api/admin/catalog-items/', '').replace('/toggle-status', '');
        const updated = toggleCatalogItemStatus(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, catalogItem: updated });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // 6. Brands CRUD & Status Toggle
    if (pathname === '/api/admin/brands' && method === 'GET') {
      const catalog = getCatalog();
      return Response.json({ success: true, brands: catalog.brands });
    }

    if (pathname === '/api/admin/brands' && (method === 'POST' || method === 'PUT')) {
      try {
        const body = await request.json().catch(() => ({}));
        if (!body.name) {
          return Response.json(
            { success: false, error: 'Brand name is required.' },
            { status: 400 }
          );
        }
        const isCreate = body.isCreate !== undefined ? !!body.isCreate : (method === 'POST' && !body.isUpdate);
        const saved = saveBrand({ ...body, isCreate }, adminUser);
        return Response.json({ success: true, brand: saved });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }


    if (pathname.match(/^\/api\/admin\/brands\/[^/]+\/toggle-status$/) && method === 'POST') {
      try {
        const id = pathname.replace('/api/admin/brands/', '').replace('/toggle-status', '');
        const updated = toggleBrandStatus(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, brand: updated });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // 7. Customer Complaints / Contact Inquiries
    if (pathname === '/api/admin/complaints' && method === 'GET') {
      const complaints = getComplaints();
      return Response.json({ success: true, complaints });
    }

    if (pathname.match(/^\/api\/admin\/complaints\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
      try {
        const id = pathname.replace('/api/admin/complaints/', '');
        const body = await request.json().catch(() => ({}));
        const updated = updateComplaint(decodeURIComponent(id), body, adminUser);
        return Response.json({ success: true, complaint: updated });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // 8. Quotation Requests (View-Only Inspection)
    if (pathname === '/api/admin/quotes' && method === 'GET') {
      const quotes = getQuotes();
      return Response.json({ success: true, quotes });
    }

    // 9. Existing Images Browser & Validation
    if (pathname === '/api/admin/existing-images' && method === 'GET') {
      const images = listExistingImages();
      return Response.json({ success: true, images });
    }

    if (pathname === '/api/admin/validate-image-path' && method === 'POST') {
      try {
        const body = await request.json().catch(() => ({}));
        const check = validateImagePath(body.imagePath || '');
        return Response.json({ success: true, ...check });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // 10. Image Upload Control (Server-side validation & persistence)
    if (pathname === '/api/admin/upload-image' && method === 'POST') {
      try {
        const body = await request.json().catch(() => ({}));
        if (!body.imageBase64) {
          return Response.json(
            { success: false, error: 'Image base64 data is required.' },
            { status: 400 }
          );
        }

        const uploadResult = await processAndSaveImageUpload(body.imageBase64, body.preferredName);
        if (!uploadResult.success || !uploadResult.url) {
          return Response.json(
            { success: false, error: uploadResult.error || 'Failed to upload image.' },
            { status: 400 }
          );
        }

        return Response.json({
          success: true,
          url: uploadResult.url,
          message: 'Image uploaded and processed successfully.',
        });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 500 });
      }
    }

    // ------------------------------------------------------------------------
    // 11. CMS Global Content & Database Connectivity
    // ------------------------------------------------------------------------
    if (pathname === '/api/admin/cms/content' && method === 'GET') {
      try {
        const data = await getPublicCmsContent();
        return Response.json({ success: true, ...data });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 500 });
      }
    }

    if (pathname === '/api/admin/cms/db-status' && method === 'GET') {
      const conn = await checkMysqlConnection(true);
      const config = getDatabaseConfig();
      return Response.json({
        success: true,
        connected: conn.connected,
        error: conn.error,
        dbName: conn.dbName || config.database,
        host: config.host,
        user: config.user,
      });
    }

    if (pathname === '/api/admin/cms/migrate-seed' && method === 'POST') {
      try {
        const seedResult = await seedMysqlDatabase();
        return Response.json({ ...seedResult });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 500 });
      }
    }

    // Settings
    if (pathname === '/api/admin/cms/settings' && method === 'POST') {
      try {
        const { key, value } = await request.json();
        if (!key) {
          return Response.json({ success: false, error: 'Setting key is required.' }, { status: 400 });
        }
        await updateCmsSetting(key, value, adminUser);
        return Response.json({ success: true, message: `Setting "${key}" updated.` });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // Sections
    if (pathname === '/api/admin/cms/sections' && method === 'POST') {
      try {
        const sectionData = await request.json();
        if (!sectionData.page_slug || !sectionData.section_key) {
          return Response.json({ success: false, error: 'Page slug and section key are required.' }, { status: 400 });
        }
        const updated = await savePageSection(sectionData, adminUser);
        return Response.json({ success: true, section: updated });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // Services CRUD
    if (pathname === '/api/admin/cms/services' && method === 'POST') {
      try {
        const serviceData = await request.json();
        if (!serviceData.title) {
          return Response.json({ success: false, error: 'Service title is required.' }, { status: 400 });
        }
        const saved = await saveCmsService(serviceData, adminUser);
        return Response.json({ success: true, service: saved });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/cms\/services\/[^/]+$/) && method === 'DELETE') {
      try {
        const id = pathname.replace('/api/admin/cms/services/', '');
        await deleteCmsService(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, message: `Service "${id}" deleted.` });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // Projects CRUD
    if (pathname === '/api/admin/cms/projects' && method === 'POST') {
      try {
        const projectData = await request.json();
        if (!projectData.title) {
          return Response.json({ success: false, error: 'Project title is required.' }, { status: 400 });
        }
        const saved = await saveCmsProject(projectData, adminUser);
        return Response.json({ success: true, project: saved });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/cms\/projects\/[^/]+$/) && method === 'DELETE') {
      try {
        const id = pathname.replace('/api/admin/cms/projects/', '');
        await deleteCmsProject(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, message: `Project "${id}" deleted.` });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // Gallery CRUD
    if (pathname === '/api/admin/cms/gallery' && method === 'POST') {
      try {
        const galleryData = await request.json();
        if (!galleryData.title || !galleryData.image) {
          return Response.json({ success: false, error: 'Title and image are required.' }, { status: 400 });
        }
        const saved = await saveCmsGalleryItem(galleryData, adminUser);
        return Response.json({ success: true, item: saved });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/cms\/gallery\/[^/]+$/) && method === 'DELETE') {
      try {
        const id = pathname.replace('/api/admin/cms/gallery/', '');
        await deleteCmsGalleryItem(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, message: `Gallery item "${id}" deleted.` });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // Reviews CRUD
    if (pathname === '/api/admin/cms/reviews' && method === 'POST') {
      try {
        const reviewData = await request.json();
        if (!reviewData.clientName || !reviewData.quote) {
          return Response.json({ success: false, error: 'Client name and review quote are required.' }, { status: 400 });
        }
        const saved = await saveCmsReview(reviewData, adminUser);
        return Response.json({ success: true, review: saved });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/cms\/reviews\/[^/]+$/) && method === 'DELETE') {
      try {
        const id = pathname.replace('/api/admin/cms/reviews/', '');
        await deleteCmsReview(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, message: `Review "${id}" deleted.` });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // FAQs CRUD
    if (pathname === '/api/admin/cms/faqs' && method === 'POST') {
      try {
        const faqData = await request.json();
        if (!faqData.question_en || !faqData.answer_en) {
          return Response.json({ success: false, error: 'Question and answer in English are required.' }, { status: 400 });
        }
        const saved = await saveCmsFaq(faqData, adminUser);
        return Response.json({ success: true, faq: saved });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/cms\/faqs\/[^/]+$/) && method === 'DELETE') {
      try {
        const id = pathname.replace('/api/admin/cms/faqs/', '');
        await deleteCmsFaq(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, message: `FAQ "${id}" deleted.` });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // Careers
    if (pathname === '/api/admin/cms/careers' && method === 'GET') {
      try {
        const applications = await getCareerApplications();
        return Response.json({ success: true, applications });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 500 });
      }
    }

    if (pathname.match(/^\/api\/admin\/cms\/careers\/[^/]+$/) && (method === 'PATCH' || method === 'PUT')) {
      try {
        const id = pathname.replace('/api/admin/cms/careers/', '');
        const { status } = await request.json();
        const updated = await updateCareerApplicationStatus(decodeURIComponent(id), status, adminUser);
        return Response.json({ success: true, application: updated });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }
  }

  return Response.json({ error: 'Endpoint Not Found' }, { status: 404 });
}
