import {
  getCatalog,
  saveProduct,
  toggleProductStatus,
  deleteProduct,
  saveCatalogItem,
  toggleCatalogItemStatus,
  deleteCatalogItem,
  saveBrand,
  toggleBrandStatus,
  deleteBrand,
  getComplaints,
  updateComplaint,
  deleteComplaint,
  getQuotes,
  updateQuoteStatus,
  deleteQuote,
  getDashboardStats,
  getAuditLogs,
  createCatalogBackup,
  logAudit,
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
  deleteCareerApplication,
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
import {
  createTransporter,
  getSmtpConfig,
  isSmtpConfigured,
  buildAdminReplyEmail,
} from './mail/mailer.ts';

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
  // Catalog Endpoint (Public & Admin)
  // --------------------------------------------------------------------------
  if (pathname === '/api/catalog' && method === 'GET') {
    const catalog = await getCatalog();
    const token = extractTokenFromRequest(request);
    const auth = verifyAdminToken(token);
    const includeInactive = url.searchParams.get('includeInactive') === 'true' || auth.valid;

    return Response.json({
      success: true,
      lastUpdated: catalog.lastUpdated,
      products: includeInactive ? catalog.products : catalog.products.filter((p) => p.status !== 'inactive'),
      catalogItems: includeInactive ? catalog.catalogItems : catalog.catalogItems.filter((i) => i.status !== 'inactive'),
      brands: includeInactive ? catalog.brands : catalog.brands.filter((b) => b.status !== 'inactive'),
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
      const stats = await getDashboardStats();
      return Response.json({ success: true, stats });
    }

    // 2. Audit Logs
    if (pathname === '/api/admin/audit-logs' && method === 'GET') {
      const logs = await getAuditLogs();
      return Response.json({ success: true, logs });
    }

    // 3. Manual Backup
    if (pathname === '/api/admin/backup' && method === 'POST') {
      const backupPath = await createCatalogBackup('admin_manual');
      return Response.json({ success: true, backupPath });
    }

    // 4. Products CRUD & Status Toggle
    if (pathname === '/api/admin/products' && method === 'GET') {
      const catalog = await getCatalog();
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
        const saved = await saveProduct({ ...body, isCreate }, adminUser);
        return Response.json({ success: true, product: saved });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/products\/[^/]+\/toggle-status$/) && method === 'POST') {
      try {
        const id = pathname.replace('/api/admin/products/', '').replace('/toggle-status', '');
        const updated = await toggleProductStatus(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, product: updated });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/products\/[^/]+$/) && method === 'DELETE') {
      try {
        const id = pathname.replace('/api/admin/products/', '');
        await deleteProduct(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, message: `Product "${id}" deleted.` });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // 5. Sub-Products / Catalog Items CRUD & Status Toggle
    if (pathname === '/api/admin/catalog-items' && method === 'GET') {
      const catalog = await getCatalog();
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
        const saved = await saveCatalogItem({ ...body, isCreate }, adminUser);
        return Response.json({ success: true, catalogItem: saved });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/catalog-items\/[^/]+\/toggle-status$/) && method === 'POST') {
      try {
        const id = pathname.replace('/api/admin/catalog-items/', '').replace('/toggle-status', '');
        const updated = await toggleCatalogItemStatus(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, catalogItem: updated });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/catalog-items\/[^/]+$/) && method === 'DELETE') {
      try {
        const id = pathname.replace('/api/admin/catalog-items/', '');
        await deleteCatalogItem(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, message: `Catalog item SKU "${id}" deleted.` });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // 6. Brands CRUD & Status Toggle
    if (pathname === '/api/admin/brands' && method === 'GET') {
      const catalog = await getCatalog();
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
        const saved = await saveBrand({ ...body, isCreate }, adminUser);
        return Response.json({ success: true, brand: saved });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/brands\/[^/]+\/toggle-status$/) && method === 'POST') {
      try {
        const id = pathname.replace('/api/admin/brands/', '').replace('/toggle-status', '');
        const updated = await toggleBrandStatus(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, brand: updated });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/brands\/[^/]+$/) && method === 'DELETE') {
      try {
        const id = pathname.replace('/api/admin/brands/', '');
        await deleteBrand(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, message: `Brand "${id}" deleted.` });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // 7. Customer Complaints / Contact Inquiries
    if (pathname === '/api/admin/complaints' && method === 'GET') {
      const complaints = await getComplaints();
      return Response.json({ success: true, complaints });
    }

    if (pathname.match(/^\/api\/admin\/complaints\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
      try {
        const id = pathname.replace('/api/admin/complaints/', '');
        const body = await request.json().catch(() => ({}));
        const updated = await updateComplaint(decodeURIComponent(id), body, adminUser);
        return Response.json({ success: true, complaint: updated });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/complaints\/[^/]+$/) && method === 'DELETE') {
      try {
        const id = pathname.replace('/api/admin/complaints/', '');
        await deleteComplaint(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, message: `Complaint "${id}" deleted.` });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }


    // 7.1 Unified Customer Inquiries & Job Applications Inbox
    if (pathname === '/api/admin/inquiries' && method === 'GET') {
      try {
        const complaints = await getComplaints();
        const careers = await getCareerApplications();

        const unifiedList = [
          ...complaints.map((c) => ({
            id: c.id,
            source: 'complaints' as const,
            type: c.type || (c.message?.toLowerCase().includes('complaint') ? 'Complaint' : 'Contact Enquiry'),
            name: c.name,
            email: c.email,
            phone: c.contact,
            companyName: c.companyName,
            subjectOrPosition: c.companyName ? `Inquiry from ${c.companyName}` : 'Customer Contact Enquiry',
            message: c.message,
            status: c.status,
            originalStatus: c.status,
            notes: c.notes,
            submittedAt: c.submittedAt,
            updatedAt: c.updatedAt,
          })),
          ...careers.map((app) => {
            let unifiedStatus: 'New' | 'In Progress' | 'Resolved' = 'New';
            if (app.status === 'Reviewing' || app.status === 'Interviewed') {
              unifiedStatus = 'In Progress';
            } else if (app.status === 'Offered' || app.status === 'Archived') {
              unifiedStatus = 'Resolved';
            }

            return {
              id: app.id,
              source: 'careers' as const,
              type: 'Job Application' as const,
              name: app.name,
              email: app.email,
              phone: app.phone,
              companyName: undefined,
              subjectOrPosition: `Application: ${app.position}`,
              message: app.coverLetter || `Candidate applied for position: ${app.position}`,
              status: unifiedStatus,
              originalStatus: app.status,
              notes: app.notes,
              experience: app.experience,
              noticePeriod: app.noticePeriod,
              portfolioUrl: app.portfolioUrl,
              resumeFilename: app.resumeFilename,
              submittedAt: app.submittedAt,
              updatedAt: app.updatedAt || app.submittedAt,
            };
          }),
        ];

        // Sort descending by submission date
        unifiedList.sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );

        // Pre-filter counts
        const counts = {
          all: unifiedList.length,
          new: unifiedList.filter((i) => i.status === 'New').length,
          inProgress: unifiedList.filter((i) => i.status === 'In Progress').length,
          resolved: unifiedList.filter((i) => i.status === 'Resolved').length,
          contact: unifiedList.filter((i) => i.type === 'Contact Enquiry').length,
          careers: unifiedList.filter((i) => i.type === 'Job Application').length,
          complaints: unifiedList.filter((i) => i.type === 'Complaint').length,
        };

        // Query filters
        const q = (url.searchParams.get('q') || '').toLowerCase().trim();
        const typeFilter = url.searchParams.get('type') || 'all';
        const statusFilter = url.searchParams.get('status') || 'all';
        const dateRange = url.searchParams.get('dateRange') || 'all';
        const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
        const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10));

        const filtered = unifiedList.filter((item) => {
          if (q) {
            const matchesQ =
              item.name.toLowerCase().includes(q) ||
              item.email.toLowerCase().includes(q) ||
              (item.phone && item.phone.toLowerCase().includes(q)) ||
              (item.companyName && item.companyName.toLowerCase().includes(q)) ||
              item.subjectOrPosition.toLowerCase().includes(q) ||
              item.message.toLowerCase().includes(q) ||
              item.id.toLowerCase().includes(q);
            if (!matchesQ) return false;
          }

          if (typeFilter !== 'all' && item.type !== typeFilter) {
            return false;
          }

          if (statusFilter !== 'all' && item.status !== statusFilter) {
            return false;
          }

          if (dateRange !== 'all') {
            const itemTime = new Date(item.submittedAt).getTime();
            const now = Date.now();
            if (dateRange === 'today' && now - itemTime > 24 * 60 * 60 * 1000) {
              return false;
            }
            if (dateRange === '7d' && now - itemTime > 7 * 24 * 60 * 60 * 1000) {
              return false;
            }
            if (dateRange === '30d' && now - itemTime > 30 * 24 * 60 * 60 * 1000) {
              return false;
            }
          }

          return true;
        });

        const total = filtered.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const startIndex = (page - 1) * limit;
        const paginatedInquiries = filtered.slice(startIndex, startIndex + limit);

        return Response.json({
          success: true,
          inquiries: paginatedInquiries,
          total,
          page,
          limit,
          totalPages,
          counts,
        });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 500 });
      }
    }

    // Direct Inquiry Dispatch Reply
    if (pathname === '/api/admin/inquiries/reply' && method === 'POST') {
      try {
        const body = await request.json().catch(() => ({}));
        const { inquiryId, recipientEmail, subject, message, markStatus } = body;

        if (!inquiryId || !recipientEmail || !subject || !message) {
          return Response.json(
            { success: false, error: 'Inquiry ID, recipient email, subject, and message are required.' },
            { status: 400 }
          );
        }

        // Security check: verify inquiry exists and recipient email matches
        const complaints = await getComplaints();
        const careers = await getCareerApplications();
        const compMatch = complaints.find((c) => c.id === inquiryId);
        const carMatch = careers.find((c) => c.id === inquiryId);

        if (!compMatch && !carMatch) {
          return Response.json(
            { success: false, error: `Inquiry with ID "${inquiryId}" not found.` },
            { status: 404 }
          );
        }

        const targetRecord = compMatch || carMatch!;
        if (targetRecord.email.trim().toLowerCase() !== recipientEmail.trim().toLowerCase()) {
          return Response.json(
            {
              success: false,
              error: 'Recipient email does not match the validated inquiry record email address.',
            },
            { status: 400 }
          );
        }

        let messageId: string | undefined = undefined;

        if (isSmtpConfigured()) {
          const transporter = createTransporter();
          const emailContent = buildAdminReplyEmail({
            customerName: targetRecord.name,
            originalSubject: subject,
            inquiryId,
            message: message.trim(),
          });

          const mailResult = await transporter.sendMail({
            from: {
              name: "DEYSLA IT Solutions",
              address: "info@sa.deysla.com",
            },
            to: recipientEmail.trim(),
            replyTo: "info@sa.deysla.com",
            subject: subject.trim(),
            text: emailContent.text,
            html: emailContent.html,
          });

          messageId = mailResult.messageId;
        }

        // Append administrative note
        const timestampStr = new Date().toISOString();
        const replyNote = `[Direct Reply sent by ${adminUser} on ${timestampStr}]: "${message.trim().slice(0, 200)}${message.trim().length > 200 ? '...' : ''}"`;

        if (compMatch) {
          const currentNotes = compMatch.notes ? `${compMatch.notes}\n${replyNote}` : replyNote;
          const newStatus = (markStatus as any) || (compMatch.status === 'New' ? 'In Progress' : compMatch.status);
          await updateComplaint(inquiryId, { status: newStatus, notes: currentNotes }, adminUser);
        } else if (carMatch) {
          const currentNotes = carMatch.notes ? `${carMatch.notes}\n${replyNote}` : replyNote;
          let newStatus = carMatch.status;
          if (markStatus === 'In Progress') newStatus = 'Reviewing';
          else if (markStatus === 'Resolved') newStatus = 'Offered';
          await updateCareerApplicationStatus(inquiryId, newStatus, adminUser, currentNotes);
        }

        return Response.json({
          success: true,
          message: isSmtpConfigured()
            ? `Reply email dispatched successfully to ${recipientEmail.trim()}.`
            : `Reply recorded (SMTP server currently unconfigured in environment).`,
          messageId,
        });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 500 });
      }
    }

    // Single Inquiry Detail & Status Update
    if (pathname.match(/^\/api\/admin\/inquiries\/[^/]+$/) && (method === 'PATCH' || method === 'PUT')) {
      try {
        const id = pathname.replace('/api/admin/inquiries/', '');
        const decodedId = decodeURIComponent(id);
        const body = await request.json().catch(() => ({}));
        const { status, notes } = body;

        const complaints = await getComplaints();
        const compMatch = complaints.find((c) => c.id === decodedId);
        if (compMatch) {
          const updated = await updateComplaint(
            decodedId,
            {
              status: status as 'New' | 'In Progress' | 'Resolved',
              notes,
            },
            adminUser
          );
          return Response.json({ success: true, inquiry: updated });
        }

        const careers = await getCareerApplications();
        const carMatch = careers.find((c) => c.id === decodedId);
        if (carMatch) {
          let targetStatus = carMatch.status;
          if (status === 'New') targetStatus = 'New';
          else if (status === 'In Progress') targetStatus = 'Reviewing';
          else if (status === 'Resolved') targetStatus = 'Offered';
          else if (status) targetStatus = status;

          const updated = await updateCareerApplicationStatus(decodedId, targetStatus, adminUser, notes);
          return Response.json({ success: true, inquiry: updated });
        }

        return Response.json({ success: false, error: `Inquiry "${decodedId}" not found.` }, { status: 404 });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/inquiries\/[^/]+$/) && method === 'DELETE') {
      try {
        const id = pathname.replace('/api/admin/inquiries/', '');
        const decodedId = decodeURIComponent(id);

        const complaints = await getComplaints();
        const compMatch = complaints.find((c) => c.id === decodedId);
        if (compMatch) {
          await deleteComplaint(decodedId, adminUser);
          return Response.json({ success: true, message: `Inquiry "${decodedId}" deleted.` });
        }

        const careers = await getCareerApplications();
        const carMatch = careers.find((c) => c.id === decodedId);
        if (carMatch) {
          await deleteCareerApplication(decodedId, adminUser);
          return Response.json({ success: true, message: `Inquiry application "${decodedId}" deleted.` });
        }

        return Response.json({ success: false, error: `Inquiry "${decodedId}" not found.` }, { status: 404 });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    // 8. Quotation Requests (RFQs)
    if (pathname === '/api/admin/quotes' && method === 'GET') {
      const quotes = await getQuotes();
      return Response.json({ success: true, quotes });
    }

    if (pathname.match(/^\/api\/admin\/quotes\/[^/]+$/) && (method === 'PATCH' || method === 'PUT')) {
      try {
        const id = pathname.replace('/api/admin/quotes/', '');
        const body = await request.json().catch(() => ({}));
        const { status, notes } = body;
        if (!status) {
          return Response.json({ success: false, error: 'Status is required.' }, { status: 400 });
        }
        const updated = await updateQuoteStatus(decodeURIComponent(id), status, notes, adminUser);
        return Response.json({ success: true, quote: updated });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/quotes\/[^/]+$/) && method === 'DELETE') {
      try {
        const id = pathname.replace('/api/admin/quotes/', '');
        await deleteQuote(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, message: `Quotation request "${id}" deleted.` });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
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

        await logAudit({
          user: adminUser,
          action: 'UPLOAD_IMAGE',
          entity: 'PRODUCT',
          entityId: uploadResult.url,
          details: `Uploaded image: ${uploadResult.url}`,
        });

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
        const { status, notes } = await request.json();
        const updated = await updateCareerApplicationStatus(decodeURIComponent(id), status, adminUser, notes);
        return Response.json({ success: true, application: updated });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

    if (pathname.match(/^\/api\/admin\/cms\/careers\/[^/]+$/) && method === 'DELETE') {
      try {
        const id = pathname.replace('/api/admin/cms/careers/', '');
        await deleteCareerApplication(decodeURIComponent(id), adminUser);
        return Response.json({ success: true, message: `Career application "${id}" deleted.` });
      } catch (err: any) {
        return Response.json({ success: false, error: err?.message }, { status: 400 });
      }
    }

  }

  return Response.json({ error: 'Endpoint Not Found' }, { status: 404 });
}
