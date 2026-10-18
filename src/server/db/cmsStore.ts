import fs from 'fs';
import path from 'path';
import { checkMysqlConnection, isMysqlConfigured, query, execute } from './mysql.ts';
import { logAudit } from './database.ts';

// Static defaults for read-only bootstrap / offline fallback
import { COMPANY_DATA } from '../../data/company.ts';
import { SERVICES_DATA, Service } from '../../data/services.ts';
import { PROJECTS_DATA, Project } from '../../data/projects.ts';
import { GALLERY_DATA, GalleryItem } from '../../data/gallery.ts';
import { REVIEWS_DATA, Review } from '../../data/reviews.ts';
import { INITIAL_FAQS } from './seedMysql.ts';

export interface CmsPage {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  updated_at?: string;
}

export interface CmsPageSection {
  id: string;
  page_slug: string;
  section_key: string;
  title: string;
  subtitle: string;
  content: any; // parsed object/array
  sort_order: number;
  is_visible: boolean;
  updated_at?: string;
}

export interface CmsFaq {
  id: string;
  category: string;
  question_en: string;
  question_ar?: string;
  answer_en: string;
  answer_ar?: string;
  sort_order: number;
  is_active: boolean;
}

export interface CareerApplicationRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience?: string;
  noticePeriod?: string;
  portfolioUrl?: string;
  coverLetter?: string;
  resumeFilename?: string;
  resumePath?: string;
  status: 'New' | 'Reviewing' | 'Interviewed' | 'Offered' | 'Archived';
  notes?: string;
  submittedAt: string;
  updatedAt?: string;
}

export interface CmsStoreData {
  settings: Record<string, any>;
  pages: CmsPage[];
  sections: CmsPageSection[];
  services: Service[];
  projects: Project[];
  gallery: GalleryItem[];
  reviews: Review[];
  faqs: CmsFaq[];
}

function parseJsonField<T>(value: any, fallback: T): T {
  if (!value) return fallback;
  if (typeof value === 'object') return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function getDefaultStoreData(): CmsStoreData {
  return {
    settings: {
      company_name: COMPANY_DATA.name,
      tagline: COMPANY_DATA.tagline,
      director_name: COMPANY_DATA.director.name,
      director_title: COMPANY_DATA.director.title,
      director_image: COMPANY_DATA.director.image,
      director_message: COMPANY_DATA.director.message,
      contact_phone: COMPANY_DATA.contact.phone,
      contact_phone_formatted: COMPANY_DATA.contact.phoneFormatted,
      contact_email: COMPANY_DATA.contact.email,
      contact_primary_location: COMPANY_DATA.contact.primaryLocation,
      contact_primary_city: COMPANY_DATA.contact.primaryCity,
      contact_primary_country: COMPANY_DATA.contact.primaryCountry,
      offices_data: COMPANY_DATA.offices,
      global_presence_data: COMPANY_DATA.globalPresence,
      company_stats: COMPANY_DATA.stats,
      about_data: COMPANY_DATA.about,
    },
    pages: [
      { id: 'page-home', slug: 'home', title_en: 'Home', title_ar: 'الرئيسية', meta_title: 'DEYSLA IT Solutions | Enterprise Infrastructure & Security', meta_description: 'Empowering businesses across KSA, Bahrain, and USA with turnkey enterprise technology solutions.', is_published: true },
      { id: 'page-about', slug: 'about', title_en: 'About Us', title_ar: 'من نحن', meta_title: 'About DEYSLA IT Solutions | Vision, Leadership & Heritage', meta_description: 'Learn about our journey, leadership, core pillars, and regional footprint.', is_published: true },
      { id: 'page-services', slug: 'services', title_en: 'Services', title_ar: 'خدماتنا', meta_title: 'Enterprise IT Services & Engineering | DEYSLA IT Solutions', meta_description: 'Comprehensive technology solutions from data centers to cybersecurity and industrial automation.', is_published: true },
      { id: 'page-products', slug: 'products', title_en: 'Products & Brands', title_ar: 'المنتجات والعلامات التجارية', meta_title: 'Commercial Hardware Catalogue & OEM Partners | DEYSLA', meta_description: 'Procure certified enterprise IT hardware, networking, cabling, and surveillance systems.', is_published: true },
      { id: 'page-projects', slug: 'projects', title_en: 'Projects', title_ar: 'مشاريعنا', meta_title: 'Enterprise Technology Case Studies & Turnkey Projects | DEYSLA', meta_description: 'Explore completed data center, cabling, security, and automation projects.', is_published: true },
      { id: 'page-gallery', slug: 'gallery', title_en: 'Showcase Gallery', title_ar: 'معرض الأعمال', meta_title: 'Technology Operations & Staging Gallery | DEYSLA', meta_description: 'Field installations, staging benchmarks, and technology deployments.', is_published: true },
      { id: 'page-careers', slug: 'careers', title_en: 'Careers', title_ar: 'الوظائف', meta_title: 'Careers & Engineering Opportunities | DEYSLA IT Solutions', meta_description: 'Join our team of technology professionals in Saudi Arabia and regional hubs.', is_published: true },
      { id: 'page-contact', slug: 'contact', title_en: 'Contact Us', title_ar: 'اتصل بنا', meta_title: 'Contact Regional Engineering Hubs | DEYSLA IT Solutions', meta_description: 'Get in touch with our offices in Dammam, Bahrain, or the USA.', is_published: true },
    ],
    sections: [
      {
        id: 'sec-home-hero',
        page_slug: 'home',
        section_key: 'hero',
        title: 'Empowering Businesses Through Innovative Technology',
        subtitle: 'Enterprise IT Infrastructure, Networking, Security & Automation',
        content: {
          heading: 'EMPOWERING BUSINESSES THROUGH INNOVATIVE TECHNOLOGY SOLUTIONS',
          tagline: 'Leading enterprise hardware distribution, turnkey deployment, and digital engineering across KSA, Bahrain, and USA.',
          ctaPrimaryText: 'Explore Solutions',
          ctaPrimaryLink: '/services',
          ctaSecondaryText: 'Request Quotation',
          ctaSecondaryLink: '/cart',
          videoSrc: '/assets/video/hero.mp4',
        },
        sort_order: 1,
        is_visible: true,
      },
    ],
    services: SERVICES_DATA,
    projects: PROJECTS_DATA,
    gallery: GALLERY_DATA,
    reviews: REVIEWS_DATA,
    faqs: INITIAL_FAQS.map((f) => ({ ...f, is_active: true })),
  };
}

// ============================================================================
// Public CMS Content Fetcher (MySQL primary)
// ============================================================================
export async function getPublicCmsContent(): Promise<{
  source: 'mysql' | 'json';
  settings: Record<string, any>;
  pages: CmsPage[];
  sections: CmsPageSection[];
  services: Service[];
  projects: Project[];
  gallery: GalleryItem[];
  reviews: Review[];
  faqs: CmsFaq[];
}> {
  const connCheck = await checkMysqlConnection();

  if (connCheck.connected) {
    try {
      // 1. Settings
      const settingsRows = await query<{ setting_key: string; setting_value: string }>(
        'SELECT setting_key, setting_value FROM cms_settings'
      );
      const settings: Record<string, any> = {};
      for (const row of settingsRows) {
        try {
          settings[row.setting_key] = JSON.parse(row.setting_value);
        } catch {
          settings[row.setting_key] = row.setting_value;
        }
      }

      // 2. Pages
      const pageRows = await query<any>(
        'SELECT id, slug, title_en, title_ar, meta_title, meta_description, is_published, updated_at FROM cms_pages WHERE is_published = 1'
      );
      const pages: CmsPage[] = pageRows.map((r: any) => ({
        ...r,
        is_published: Boolean(r.is_published),
      }));

      // 3. Sections
      const sectionRows = await query<any>(
        'SELECT id, page_slug, section_key, title, subtitle, content, sort_order, is_visible, updated_at FROM cms_page_sections WHERE is_visible = 1 ORDER BY sort_order ASC'
      );
      const sections: CmsPageSection[] = sectionRows.map((r: any) => ({
        ...r,
        content: parseJsonField<any>(r.content, {}),
        is_visible: Boolean(r.is_visible),
      }));

      // 4. Services
      const serviceRows = await query<any>(
        'SELECT * FROM cms_services WHERE is_active = 1 ORDER BY sort_order ASC'
      );
      const services: Service[] = serviceRows.map((r: any) => ({
        id: r.id,
        number: r.number,
        slug: r.slug,
        title: r.title,
        shortDescription: r.short_description,
        overview: r.overview,
        image: r.image,
        imageAlt: r.image_alt,
        subServices: parseJsonField<string[]>(r.sub_services, []),
        deliverables: parseJsonField<string[]>(r.deliverables, []),
        process: parseJsonField<any[]>(r.process_steps, []),
        relevantCategories: parseJsonField<string[]>(r.relevant_categories, []),
        relevantBrandIds: parseJsonField<string[]>(r.relevant_brand_ids, []),
      }));

      // 5. Projects
      const projectRows = await query<any>(
        'SELECT * FROM cms_projects WHERE is_active = 1 ORDER BY sort_order ASC'
      );
      const projects: Project[] = projectRows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        category: r.category,
        clientSector: r.client_sector,
        location: r.location,
        shortDescription: r.short_description,
        fullOverview: r.full_overview,
        scopeOfWork: parseJsonField<string[]>(r.scope_of_work, []),
        technologiesUsed: parseJsonField<string[]>(r.technologies_used, []),
        image: r.image,
        isPlaceholder: Boolean(r.is_placeholder),
      }));

      // 6. Gallery
      const galleryRows = await query<any>(
        'SELECT * FROM cms_gallery WHERE is_active = 1 ORDER BY sort_order ASC'
      );
      const gallery: GalleryItem[] = galleryRows.map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        image: r.image,
        description: r.description,
      }));

      // 7. Reviews
      const reviewRows = await query<any>(
        'SELECT * FROM cms_reviews WHERE is_approved = 1 AND is_active = 1 ORDER BY created_at DESC'
      );
      const reviews: Review[] = reviewRows.map((r: any) => ({
        id: r.id,
        clientName: r.client_name,
        clientRole: r.client_role,
        companyName: r.company_name,
        industry: r.industry,
        quote: r.quote,
        rating: r.rating,
        projectRef: r.project_ref,
      }));

      // 8. FAQs
      const faqRows = await query<any>(
        'SELECT * FROM cms_faqs WHERE is_active = 1 ORDER BY sort_order ASC'
      );
      const faqs: CmsFaq[] = faqRows.map((r: any) => ({
        id: r.id,
        category: r.category,
        question_en: r.question_en,
        question_ar: r.question_ar,
        answer_en: r.answer_en,
        answer_ar: r.answer_ar,
        sort_order: r.sort_order,
        is_active: Boolean(r.is_active),
      }));

      return {
        source: 'mysql',
        settings,
        pages,
        sections,
        services,
        projects,
        gallery,
        reviews,
        faqs,
      };
    } catch (err: any) {
      console.error('[DEYSLA CMS] MySQL query error in getPublicCmsContent:', err?.message);
      throw new Error(`Failed to retrieve CMS content from MySQL database: ${err?.message}`);
    }
  }
  if (isMysqlConfigured()) {
    throw new Error(`MySQL database connection failed: ${connCheck.error || 'Database unavailable'}. Please verify your Hostinger MySQL connection settings.`);
  }

  // Read-only fallback ONLY for unconfigured offline local development
  const defaults = getDefaultStoreData();
  return {
    source: 'json',
    settings: defaults.settings,
    pages: defaults.pages,
    sections: defaults.sections,
    services: defaults.services,
    projects: defaults.projects,
    gallery: defaults.gallery,
    reviews: defaults.reviews,
    faqs: defaults.faqs,
  };
}

// ============================================================================
// Settings Management (MySQL-First, Throws on Failure)
// ============================================================================
export async function updateCmsSetting(key: string, value: any, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);

  await execute(
    `INSERT INTO cms_settings (setting_key, setting_value, updated_at)
     VALUES (?, ?, NOW())
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
    [key, valueStr]
  );

  await logAudit({
    user,
    action: 'UPDATE',
    entity: 'PRODUCT',
    entityId: `setting-${key}`,
    details: `Updated CMS Setting: ${key}`,
  });
}

// ============================================================================
// Page Sections Management (MySQL-First, Throws on Failure)
// ============================================================================
export async function savePageSection(
  sectionData: Partial<CmsPageSection> & { page_slug: string; section_key: string },
  user = 'admin'
): Promise<CmsPageSection> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const id = sectionData.id || `sec-${sectionData.page_slug}-${sectionData.section_key}`;
  const contentStr = typeof sectionData.content === 'object' ? JSON.stringify(sectionData.content) : String(sectionData.content || '{}');

  await execute(
    `INSERT INTO cms_page_sections (id, page_slug, section_key, title, subtitle, content, sort_order, is_visible, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE
      title = VALUES(title), subtitle = VALUES(subtitle), content = VALUES(content),
      sort_order = VALUES(sort_order), is_visible = VALUES(is_visible), updated_at = NOW()`,
    [
      id,
      sectionData.page_slug,
      sectionData.section_key,
      sectionData.title || '',
      sectionData.subtitle || '',
      contentStr,
      sectionData.sort_order ?? 0,
      sectionData.is_visible !== false ? 1 : 0,
    ]
  );

  await logAudit({
    user,
    action: 'UPDATE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Updated Page Section: [${sectionData.page_slug}] ${sectionData.section_key}`,
  });

  return {
    id,
    page_slug: sectionData.page_slug,
    section_key: sectionData.section_key,
    title: sectionData.title || '',
    subtitle: sectionData.subtitle || '',
    content: sectionData.content,
    sort_order: sectionData.sort_order ?? 0,
    is_visible: sectionData.is_visible !== false,
    updated_at: new Date().toISOString(),
  };
}

// ============================================================================
// Services CRUD (MySQL-First, Throws on Failure)
// ============================================================================
export async function saveCmsService(serviceData: Partial<Service> & { title: string }, user = 'admin'): Promise<Service> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const id = serviceData.id || serviceData.slug || serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const slug = serviceData.slug || id;

  const [existing] = await query<any>('SELECT id FROM cms_services WHERE id = ?', [id]);
  const isCreate = !existing;

  await execute(
    `INSERT INTO cms_services (
      id, number, slug, title, short_description, overview, image, image_alt,
      sub_services, deliverables, process_steps, relevant_categories, relevant_brand_ids, sort_order, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    ON DUPLICATE KEY UPDATE
      number = VALUES(number), slug = VALUES(slug), title = VALUES(title),
      short_description = VALUES(short_description), overview = VALUES(overview),
      image = VALUES(image), image_alt = VALUES(image_alt), sub_services = VALUES(sub_services),
      deliverables = VALUES(deliverables), process_steps = VALUES(process_steps),
      relevant_categories = VALUES(relevant_categories), relevant_brand_ids = VALUES(relevant_brand_ids)`,
    [
      id,
      serviceData.number || '01',
      slug,
      serviceData.title,
      serviceData.shortDescription || '',
      serviceData.overview || '',
      serviceData.image || '/assets/products/cybersecurity-systems.webp',
      serviceData.imageAlt || serviceData.title,
      JSON.stringify(serviceData.subServices || []),
      JSON.stringify(serviceData.deliverables || []),
      JSON.stringify(serviceData.process || []),
      JSON.stringify(serviceData.relevantCategories || []),
      JSON.stringify(serviceData.relevantBrandIds || []),
      1,
    ]
  );

  await logAudit({
    user,
    action: isCreate ? 'CREATE' : 'UPDATE',
    entity: 'PRODUCT',
    entityId: id,
    details: `${isCreate ? 'Created' : 'Updated'} Service: ${serviceData.title}`,
  });

  return {
    id,
    number: serviceData.number || '01',
    slug,
    title: serviceData.title,
    shortDescription: serviceData.shortDescription || '',
    overview: serviceData.overview || '',
    image: serviceData.image || '/assets/products/cybersecurity-systems.webp',
    imageAlt: serviceData.imageAlt || serviceData.title,
    subServices: serviceData.subServices || [],
    deliverables: serviceData.deliverables || [],
    process: serviceData.process || [],
    relevantCategories: serviceData.relevantCategories || [],
    relevantBrandIds: serviceData.relevantBrandIds || [],
  };
}

export async function deleteCmsService(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  await execute('DELETE FROM cms_services WHERE id = ?', [id]);

  await logAudit({
    user,
    action: 'DELETE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Deleted Service: ${id}`,
  });
}

// ============================================================================
// Projects CRUD (MySQL-First, Throws on Failure)
// ============================================================================
export async function saveCmsProject(projectData: Partial<Project> & { title: string }, user = 'admin'): Promise<Project> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const id = projectData.id || projectData.slug || `proj-${projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const slug = projectData.slug || id;

  const [existing] = await query<any>('SELECT id FROM cms_projects WHERE id = ?', [id]);
  const isCreate = !existing;

  await execute(
    `INSERT INTO cms_projects (
      id, slug, title, category, client_sector, location, short_description,
      full_overview, scope_of_work, technologies_used, image, is_placeholder, is_featured, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    ON DUPLICATE KEY UPDATE
      slug = VALUES(slug), title = VALUES(title), category = VALUES(category),
      client_sector = VALUES(client_sector), location = VALUES(location),
      short_description = VALUES(short_description), full_overview = VALUES(full_overview),
      scope_of_work = VALUES(scope_of_work), technologies_used = VALUES(technologies_used),
      image = VALUES(image)`,
    [
      id,
      slug,
      projectData.title,
      projectData.category || '',
      projectData.clientSector || '',
      projectData.location || '',
      projectData.shortDescription || '',
      projectData.fullOverview || '',
      JSON.stringify(projectData.scopeOfWork || []),
      JSON.stringify(projectData.technologiesUsed || []),
      projectData.image || '/assets/Picture21.png',
      projectData.isPlaceholder ? 1 : 0,
      1,
    ]
  );

  await logAudit({
    user,
    action: isCreate ? 'CREATE' : 'UPDATE',
    entity: 'PRODUCT',
    entityId: id,
    details: `${isCreate ? 'Created' : 'Updated'} Project: ${projectData.title}`,
  });

  return {
    id,
    slug,
    title: projectData.title,
    category: projectData.category || '',
    clientSector: projectData.clientSector || '',
    location: projectData.location || '',
    shortDescription: projectData.shortDescription || '',
    fullOverview: projectData.fullOverview || '',
    scopeOfWork: projectData.scopeOfWork || [],
    technologiesUsed: projectData.technologiesUsed || [],
    image: projectData.image || '/assets/Picture21.png',
    isPlaceholder: Boolean(projectData.isPlaceholder),
  };
}

export async function deleteCmsProject(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  await execute('DELETE FROM cms_projects WHERE id = ?', [id]);

  await logAudit({
    user,
    action: 'DELETE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Deleted Project: ${id}`,
  });
}

// ============================================================================
// Gallery CRUD (MySQL-First, Throws on Failure)
// ============================================================================
export async function saveCmsGalleryItem(itemData: Partial<GalleryItem> & { title: string; image: string }, user = 'admin'): Promise<GalleryItem> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const id = itemData.id || `gal-${Date.now()}`;
  const [existing] = await query<any>('SELECT id FROM cms_gallery WHERE id = ?', [id]);
  const isCreate = !existing;

  await execute(
    `INSERT INTO cms_gallery (id, title, category, image, description, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, 0, 1)
     ON DUPLICATE KEY UPDATE
      title = VALUES(title), category = VALUES(category), image = VALUES(image), description = VALUES(description)`,
    [id, itemData.title, itemData.category || '', itemData.image, itemData.description || '']
  );

  await logAudit({
    user,
    action: isCreate ? 'CREATE' : 'UPDATE',
    entity: 'PRODUCT',
    entityId: id,
    details: `${isCreate ? 'Created' : 'Updated'} Gallery item: ${itemData.title}`,
  });

  return {
    id,
    title: itemData.title,
    category: itemData.category || '',
    image: itemData.image,
    description: itemData.description || '',
  };
}

export async function deleteCmsGalleryItem(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  await execute('DELETE FROM cms_gallery WHERE id = ?', [id]);

  await logAudit({
    user,
    action: 'DELETE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Deleted Gallery item: ${id}`,
  });
}

// ============================================================================
// Reviews CRUD (MySQL-First, Throws on Failure)
// ============================================================================
export async function saveCmsReview(reviewData: Partial<Review> & { clientName: string; quote: string }, user = 'admin'): Promise<Review> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const id = reviewData.id || `rev-${Date.now()}`;
  const [existing] = await query<any>('SELECT id FROM cms_reviews WHERE id = ?', [id]);
  const isCreate = !existing;

  await execute(
    `INSERT INTO cms_reviews (
      id, client_name, client_role, company_name, industry, quote, rating, project_ref, is_approved, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
    ON DUPLICATE KEY UPDATE
      client_name = VALUES(client_name), client_role = VALUES(client_role),
      company_name = VALUES(company_name), industry = VALUES(industry),
      quote = VALUES(quote), rating = VALUES(rating), project_ref = VALUES(project_ref)`,
    [
      id,
      reviewData.clientName,
      reviewData.clientRole || '',
      reviewData.companyName || '',
      reviewData.industry || '',
      reviewData.quote,
      reviewData.rating || 5,
      reviewData.projectRef || '',
    ]
  );

  await logAudit({
    user,
    action: isCreate ? 'CREATE' : 'UPDATE',
    entity: 'PRODUCT',
    entityId: id,
    details: `${isCreate ? 'Created' : 'Updated'} Review from: ${reviewData.clientName}`,
  });

  return {
    id,
    clientName: reviewData.clientName,
    clientRole: reviewData.clientRole || '',
    companyName: reviewData.companyName || '',
    industry: reviewData.industry || '',
    quote: reviewData.quote,
    rating: reviewData.rating || 5,
    projectRef: reviewData.projectRef || '',
  };
}

export async function deleteCmsReview(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  await execute('DELETE FROM cms_reviews WHERE id = ?', [id]);

  await logAudit({
    user,
    action: 'DELETE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Deleted Review: ${id}`,
  });
}

// ============================================================================
// FAQs CRUD (MySQL-First, Throws on Failure)
// ============================================================================
export async function saveCmsFaq(faqData: Partial<CmsFaq> & { question_en: string; answer_en: string }, user = 'admin'): Promise<CmsFaq> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const id = faqData.id || `faq-${Date.now()}`;
  const [existing] = await query<any>('SELECT id FROM cms_faqs WHERE id = ?', [id]);
  const isCreate = !existing;

  await execute(
    `INSERT INTO cms_faqs (id, category, question_en, question_ar, answer_en, answer_ar, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      category = VALUES(category), question_en = VALUES(question_en), question_ar = VALUES(question_ar),
      answer_en = VALUES(answer_en), answer_ar = VALUES(answer_ar), sort_order = VALUES(sort_order), is_active = VALUES(is_active)`,
    [
      id,
      faqData.category || 'General',
      faqData.question_en,
      faqData.question_ar || '',
      faqData.answer_en,
      faqData.answer_ar || '',
      faqData.sort_order ?? 0,
      faqData.is_active !== false ? 1 : 0,
    ]
  );

  await logAudit({
    user,
    action: isCreate ? 'CREATE' : 'UPDATE',
    entity: 'PRODUCT',
    entityId: id,
    details: `${isCreate ? 'Created' : 'Updated'} FAQ: ${faqData.question_en.slice(0, 40)}`,
  });

  return {
    id,
    category: faqData.category || 'General',
    question_en: faqData.question_en,
    question_ar: faqData.question_ar || '',
    answer_en: faqData.answer_en,
    answer_ar: faqData.answer_ar || '',
    sort_order: faqData.sort_order ?? 0,
    is_active: faqData.is_active !== false,
  };
}

export async function deleteCmsFaq(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  await execute('DELETE FROM cms_faqs WHERE id = ?', [id]);

  await logAudit({
    user,
    action: 'DELETE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Deleted FAQ: ${id}`,
  });
}

// ============================================================================
// Career Applications Persistence (MySQL-First, Throws on Failure)
// ============================================================================
export async function getCareerApplications(): Promise<CareerApplicationRecord[]> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const rows = await query<any>('SELECT * FROM cms_careers ORDER BY submitted_at DESC');
  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    position: r.position,
    experience: r.experience || '',
    noticePeriod: r.notice_period || '',
    portfolioUrl: r.portfolio_url || '',
    coverLetter: r.cover_letter || '',
    resumeFilename: r.resume_filename || '',
    resumePath: r.resume_path || '',
    status: r.status || 'New',
    notes: r.notes || '',
    submittedAt: r.submitted_at ? new Date(r.submitted_at).toISOString() : new Date().toISOString(),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
  }));
}

export async function recordCareerApplication(data: {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience?: string;
  noticePeriod?: string;
  portfolioUrl?: string;
  coverLetter?: string;
  resumeFilename?: string;
  resumePath?: string;
}): Promise<CareerApplicationRecord> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const now = new Date().toISOString();
  const id = `CAR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  await execute(
    `INSERT INTO cms_careers (
      id, name, email, phone, position, experience, notice_period,
      portfolio_url, cover_letter, resume_filename, resume_path, status, notes, submitted_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', '', NOW(), NOW())`,
    [
      id,
      data.name.trim(),
      data.email.trim(),
      data.phone.trim(),
      data.position.trim(),
      data.experience?.trim() || '',
      data.noticePeriod?.trim() || '',
      data.portfolioUrl?.trim() || '',
      data.coverLetter?.trim() || '',
      data.resumeFilename || '',
      data.resumePath || '',
    ]
  );

  return {
    id,
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    position: data.position.trim(),
    experience: data.experience?.trim(),
    noticePeriod: data.noticePeriod?.trim(),
    portfolioUrl: data.portfolioUrl?.trim(),
    coverLetter: data.coverLetter?.trim(),
    resumeFilename: data.resumeFilename,
    resumePath: data.resumePath,
    status: 'New',
    notes: '',
    submittedAt: now,
    updatedAt: now,
  };
}

export async function updateCareerApplicationStatus(
  id: string,
  status: 'New' | 'Reviewing' | 'Interviewed' | 'Offered' | 'Archived',
  user = 'admin',
  notes?: string
): Promise<CareerApplicationRecord> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const [existing] = await query<any>('SELECT * FROM cms_careers WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Career application "${id}" not found.`);
  }

  const finalNotes = notes !== undefined ? notes : existing.notes;
  await execute('UPDATE cms_careers SET status = ?, notes = ?, updated_at = NOW() WHERE id = ?', [status, finalNotes || '', id]);

  await logAudit({
    user,
    action: 'STATUS_CHANGE',
    entity: 'CAREER',
    entityId: id,
    details: `Updated Career application status to: ${status}${notes ? ` with notes: "${notes}"` : ''}`,
  });

  const [refetched] = await query<any>('SELECT * FROM cms_careers WHERE id = ?', [id]);
  return {
    id: refetched.id,
    name: refetched.name,
    email: refetched.email,
    phone: refetched.phone,
    position: refetched.position,
    experience: refetched.experience,
    noticePeriod: refetched.notice_period,
    portfolioUrl: refetched.portfolio_url,
    coverLetter: refetched.cover_letter,
    resumeFilename: refetched.resume_filename,
    resumePath: refetched.resume_path,
    status: refetched.status,
    notes: refetched.notes,
    submittedAt: refetched.submitted_at ? new Date(refetched.submitted_at).toISOString() : new Date().toISOString(),
    updatedAt: refetched.updated_at ? new Date(refetched.updated_at).toISOString() : new Date().toISOString(),
  };
}

export async function deleteCareerApplication(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const [existing] = await query<any>('SELECT * FROM cms_careers WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Career application "${id}" not found.`);
  }

  await execute('DELETE FROM cms_careers WHERE id = ?', [id]);

  await logAudit({
    user,
    action: 'DELETE',
    entity: 'CAREER',
    entityId: id,
    details: `Deleted career application: "${id}" for candidate "${existing.name}" (Role: ${existing.position})`,
  });
}

