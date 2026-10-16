import fs from 'fs';
import path from 'path';
import { checkMysqlConnection, query, execute } from './mysql.ts';
import { logAudit } from './database.ts';

// Static defaults for fallback
import { COMPANY_DATA } from '../../data/company.ts';
import { SERVICES_DATA, Service } from '../../data/services.ts';
import { PROJECTS_DATA, Project } from '../../data/projects.ts';
import { GALLERY_DATA, GalleryItem } from '../../data/gallery.ts';
import { REVIEWS_DATA, Review } from '../../data/reviews.ts';
import { INITIAL_FAQS } from './seedMysql.ts';

const DB_DIR = path.resolve(process.cwd(), 'data', 'db');
const CMS_STORE_FILE = path.join(DB_DIR, 'cms_content.json');
const CAREERS_FILE = path.join(DB_DIR, 'careers.json');

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

function ensureDirectory() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function readJsonSafely<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch (err) {
    return fallback;
  }
}

function writeJsonAtomically(filePath: string, data: any) {
  ensureDirectory();
  const tmpPath = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpPath, filePath);
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
      {
        id: 'sec-home-company_intro',
        page_slug: 'home',
        section_key: 'company_intro',
        title: 'End-to-End Enterprise Technology Partner',
        subtitle: 'Engineering Excellence & Certified Distribution',
        content: {
          description: 'DEYSLA IT Solutions is a premier technology provider operating across Saudi Arabia, the Kingdom of Bahrain, and the United States. We specialize in supply, deployment, and lifecycle maintenance of mission-critical IT infrastructure.',
          badge: 'ISO Compliant Engineering & OEM Alliances',
        },
        sort_order: 2,
        is_visible: true,
      },
      {
        id: 'sec-home-stats',
        page_slug: 'home',
        section_key: 'stats',
        title: 'Proven Scale & Regional Impact',
        subtitle: 'Key Milestones',
        content: COMPANY_DATA.stats,
        sort_order: 3,
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

export function getLocalCmsStore(): CmsStoreData {
  ensureDirectory();
  if (!fs.existsSync(CMS_STORE_FILE)) {
    const defaults = getDefaultStoreData();
    writeJsonAtomically(CMS_STORE_FILE, defaults);
    return defaults;
  }
  return readJsonSafely<CmsStoreData>(CMS_STORE_FILE, getDefaultStoreData());
}

export function saveLocalCmsStore(data: CmsStoreData) {
  writeJsonAtomically(CMS_STORE_FILE, data);
}

// ============================================================================
// Public CMS Content Fetcher (Dual Mode: MySQL with JSON Fallback)
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
      const sections: CmsPageSection[] = sectionRows.map((r: any) => {
        let parsedContent = r.content;
        try {
          parsedContent = JSON.parse(r.content);
        } catch {}
        return {
          ...r,
          content: parsedContent,
          is_visible: Boolean(r.is_visible),
        };
      });

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
        subServices: r.sub_services ? JSON.parse(r.sub_services) : [],
        deliverables: r.deliverables ? JSON.parse(r.deliverables) : [],
        process: r.process_steps ? JSON.parse(r.process_steps) : [],
        relevantCategories: r.relevant_categories ? JSON.parse(r.relevant_categories) : [],
        relevantBrandIds: r.relevant_brand_ids ? JSON.parse(r.relevant_brand_ids) : [],
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
        scopeOfWork: r.scope_of_work ? JSON.parse(r.scope_of_work) : [],
        technologiesUsed: r.technologies_used ? JSON.parse(r.technologies_used) : [],
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
      console.warn('[DEYSLA CMS] MySQL query error, falling back to local JSON store:', err?.message);
    }
  }

  // Fallback to local JSON store
  const localStore = getLocalCmsStore();
  return {
    source: 'json',
    settings: localStore.settings,
    pages: localStore.pages.filter((p) => p.is_published),
    sections: localStore.sections.filter((s) => s.is_visible),
    services: localStore.services,
    projects: localStore.projects,
    gallery: localStore.gallery,
    reviews: localStore.reviews,
    faqs: localStore.faqs.filter((f) => f.is_active),
  };
}

// ============================================================================
// Settings Management
// ============================================================================
export async function updateCmsSetting(key: string, value: any, user = 'admin'): Promise<void> {
  const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
  const connCheck = await checkMysqlConnection();

  if (connCheck.connected) {
    try {
      await execute(
        `INSERT INTO cms_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, valueStr]
      );
    } catch (err) {
      console.warn(`[DEYSLA CMS] Error saving setting to MySQL:`, err);
    }
  }

  // Always update local JSON as backup
  const store = getLocalCmsStore();
  store.settings[key] = value;
  saveLocalCmsStore(store);

  logAudit({
    user,
    action: 'UPDATE',
    entity: 'PRODUCT', // using standard audit enum or setting
    entityId: `setting-${key}`,
    details: `Updated CMS Setting: ${key}`,
  });
}

// ============================================================================
// Page Sections Management
// ============================================================================
export async function savePageSection(sectionData: Partial<CmsPageSection> & { page_slug: string; section_key: string }, user = 'admin'): Promise<CmsPageSection> {
  const id = sectionData.id || `sec-${sectionData.page_slug}-${sectionData.section_key}`;
  const contentStr = typeof sectionData.content === 'object' ? JSON.stringify(sectionData.content) : String(sectionData.content || '{}');
  const connCheck = await checkMysqlConnection();

  if (connCheck.connected) {
    try {
      await execute(
        `INSERT INTO cms_page_sections (id, page_slug, section_key, title, subtitle, content, sort_order, is_visible)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          title = VALUES(title), subtitle = VALUES(subtitle), content = VALUES(content),
          sort_order = VALUES(sort_order), is_visible = VALUES(is_visible)`,
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
    } catch (err) {
      console.warn(`[DEYSLA CMS] Error saving page section to MySQL:`, err);
    }
  }

  // Update local JSON store
  const store = getLocalCmsStore();
  const idx = store.sections.findIndex((s) => s.id === id);
  const updated: CmsPageSection = {
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

  if (idx >= 0) {
    store.sections[idx] = updated;
  } else {
    store.sections.push(updated);
  }
  saveLocalCmsStore(store);

  logAudit({
    user,
    action: idx >= 0 ? 'UPDATE' : 'CREATE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Updated Page Section: [${updated.page_slug}] ${updated.section_key}`,
  });

  return updated;
}

// ============================================================================
// Services CRUD
// ============================================================================
export async function saveCmsService(serviceData: Partial<Service> & { title: string }, user = 'admin'): Promise<Service> {
  const store = getLocalCmsStore();
  const id = serviceData.id || serviceData.slug || serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const slug = serviceData.slug || id;
  const isCreate = !store.services.some((s) => s.id === id);

  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
      await execute(
        `INSERT INTO cms_services (
          id, number, slug, title, short_description, overview, image, image_alt,
          sub_services, deliverables, process_steps, relevant_categories, relevant_brand_ids, sort_order, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          1,
        ]
      );
    } catch (err) {
      console.warn(`[DEYSLA CMS] Error saving service to MySQL:`, err);
    }
  }

  const newService: Service = {
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

  const idx = store.services.findIndex((s) => s.id === id);
  if (idx >= 0) {
    store.services[idx] = newService;
  } else {
    store.services.push(newService);
  }
  saveLocalCmsStore(store);

  logAudit({
    user,
    action: isCreate ? 'CREATE' : 'UPDATE',
    entity: 'PRODUCT',
    entityId: id,
    details: `${isCreate ? 'Created' : 'Updated'} Service: ${newService.title}`,
  });

  return newService;
}

export async function deleteCmsService(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
      await execute('DELETE FROM cms_services WHERE id = ?', [id]);
    } catch (err) {
      console.warn(`[DEYSLA CMS] Error deleting service from MySQL:`, err);
    }
  }

  const store = getLocalCmsStore();
  store.services = store.services.filter((s) => s.id !== id);
  saveLocalCmsStore(store);

  logAudit({
    user,
    action: 'DELETE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Deleted Service: ${id}`,
  });
}

// ============================================================================
// Projects CRUD
// ============================================================================
export async function saveCmsProject(projectData: Partial<Project> & { title: string }, user = 'admin'): Promise<Project> {
  const store = getLocalCmsStore();
  const id = projectData.id || projectData.slug || `proj-${projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const slug = projectData.slug || id;
  const isCreate = !store.projects.some((p) => p.id === id);

  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
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
    } catch (err) {
      console.warn(`[DEYSLA CMS] Error saving project to MySQL:`, err);
    }
  }

  const newProject: Project = {
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

  const idx = store.projects.findIndex((p) => p.id === id);
  if (idx >= 0) {
    store.projects[idx] = newProject;
  } else {
    store.projects.push(newProject);
  }
  saveLocalCmsStore(store);

  logAudit({
    user,
    action: isCreate ? 'CREATE' : 'UPDATE',
    entity: 'PRODUCT',
    entityId: id,
    details: `${isCreate ? 'Created' : 'Updated'} Project: ${newProject.title}`,
  });

  return newProject;
}

export async function deleteCmsProject(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
      await execute('DELETE FROM cms_projects WHERE id = ?', [id]);
    } catch (err) {
      console.warn(`[DEYSLA CMS] Error deleting project from MySQL:`, err);
    }
  }

  const store = getLocalCmsStore();
  store.projects = store.projects.filter((p) => p.id !== id);
  saveLocalCmsStore(store);

  logAudit({
    user,
    action: 'DELETE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Deleted Project: ${id}`,
  });
}

// ============================================================================
// Gallery CRUD
// ============================================================================
export async function saveCmsGalleryItem(itemData: Partial<GalleryItem> & { title: string; image: string }, user = 'admin'): Promise<GalleryItem> {
  const store = getLocalCmsStore();
  const id = itemData.id || `gal-${Date.now()}`;
  const isCreate = !store.gallery.some((g) => g.id === id);

  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
      await execute(
        `INSERT INTO cms_gallery (id, title, category, image, description, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, 0, 1)
         ON DUPLICATE KEY UPDATE
          title = VALUES(title), category = VALUES(category), image = VALUES(image), description = VALUES(description)`,
        [id, itemData.title, itemData.category || '', itemData.image, itemData.description || '']
      );
    } catch (err) {
      console.warn(`[DEYSLA CMS] Error saving gallery to MySQL:`, err);
    }
  }

  const newItem: GalleryItem = {
    id,
    title: itemData.title,
    category: itemData.category || '',
    image: itemData.image,
    description: itemData.description || '',
  };

  const idx = store.gallery.findIndex((g) => g.id === id);
  if (idx >= 0) {
    store.gallery[idx] = newItem;
  } else {
    store.gallery.push(newItem);
  }
  saveLocalCmsStore(store);

  logAudit({
    user,
    action: isCreate ? 'CREATE' : 'UPDATE',
    entity: 'PRODUCT',
    entityId: id,
    details: `${isCreate ? 'Created' : 'Updated'} Gallery item: ${newItem.title}`,
  });

  return newItem;
}

export async function deleteCmsGalleryItem(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
      await execute('DELETE FROM cms_gallery WHERE id = ?', [id]);
    } catch (err) {
      console.warn(`[DEYSLA CMS] Error deleting gallery item from MySQL:`, err);
    }
  }

  const store = getLocalCmsStore();
  store.gallery = store.gallery.filter((g) => g.id !== id);
  saveLocalCmsStore(store);

  logAudit({
    user,
    action: 'DELETE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Deleted Gallery item: ${id}`,
  });
}

// ============================================================================
// Reviews CRUD
// ============================================================================
export async function saveCmsReview(reviewData: Partial<Review> & { clientName: string; quote: string }, user = 'admin'): Promise<Review> {
  const store = getLocalCmsStore();
  const id = reviewData.id || `rev-${Date.now()}`;
  const isCreate = !store.reviews.some((r) => r.id === id);

  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
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
    } catch (err) {
      console.warn(`[DEYSLA CMS] Error saving review to MySQL:`, err);
    }
  }

  const newReview: Review = {
    id,
    clientName: reviewData.clientName,
    clientRole: reviewData.clientRole || '',
    companyName: reviewData.companyName || '',
    industry: reviewData.industry || '',
    quote: reviewData.quote,
    rating: reviewData.rating || 5,
    projectRef: reviewData.projectRef || '',
  };

  const idx = store.reviews.findIndex((r) => r.id === id);
  if (idx >= 0) {
    store.reviews[idx] = newReview;
  } else {
    store.reviews.push(newReview);
  }
  saveLocalCmsStore(store);

  logAudit({
    user,
    action: isCreate ? 'CREATE' : 'UPDATE',
    entity: 'PRODUCT',
    entityId: id,
    details: `${isCreate ? 'Created' : 'Updated'} Review from: ${newReview.clientName}`,
  });

  return newReview;
}

export async function deleteCmsReview(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
      await execute('DELETE FROM cms_reviews WHERE id = ?', [id]);
    } catch (err) {
      console.warn(`[DEYSLA CMS] Error deleting review from MySQL:`, err);
    }
  }

  const store = getLocalCmsStore();
  store.reviews = store.reviews.filter((r) => r.id !== id);
  saveLocalCmsStore(store);

  logAudit({
    user,
    action: 'DELETE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Deleted Review: ${id}`,
  });
}

// ============================================================================
// FAQs CRUD
// ============================================================================
export async function saveCmsFaq(faqData: Partial<CmsFaq> & { question_en: string; answer_en: string }, user = 'admin'): Promise<CmsFaq> {
  const store = getLocalCmsStore();
  const id = faqData.id || `faq-${Date.now()}`;
  const isCreate = !store.faqs.some((f) => f.id === id);

  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
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
    } catch (err) {
      console.warn(`[DEYSLA CMS] Error saving FAQ to MySQL:`, err);
    }
  }

  const newFaq: CmsFaq = {
    id,
    category: faqData.category || 'General',
    question_en: faqData.question_en,
    question_ar: faqData.question_ar || '',
    answer_en: faqData.answer_en,
    answer_ar: faqData.answer_ar || '',
    sort_order: faqData.sort_order ?? 0,
    is_active: faqData.is_active !== false,
  };

  const idx = store.faqs.findIndex((f) => f.id === id);
  if (idx >= 0) {
    store.faqs[idx] = newFaq;
  } else {
    store.faqs.push(newFaq);
  }
  saveLocalCmsStore(store);

  logAudit({
    user,
    action: isCreate ? 'CREATE' : 'UPDATE',
    entity: 'PRODUCT',
    entityId: id,
    details: `${isCreate ? 'Created' : 'Updated'} FAQ: ${newFaq.question_en.slice(0, 40)}`,
  });

  return newFaq;
}

export async function deleteCmsFaq(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
      await execute('DELETE FROM cms_faqs WHERE id = ?', [id]);
    } catch (err) {
      console.warn(`[DEYSLA CMS] Error deleting FAQ from MySQL:`, err);
    }
  }

  const store = getLocalCmsStore();
  store.faqs = store.faqs.filter((f) => f.id !== id);
  saveLocalCmsStore(store);

  logAudit({
    user,
    action: 'DELETE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Deleted FAQ: ${id}`,
  });
}

// ============================================================================
// Career Applications Persistence
// ============================================================================
export async function getCareerApplications(): Promise<CareerApplicationRecord[]> {
  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
      const rows = await query<any>('SELECT * FROM cms_careers ORDER BY submitted_at DESC');
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        position: r.position,
        experience: r.experience,
        noticePeriod: r.notice_period,
        portfolioUrl: r.portfolio_url,
        coverLetter: r.cover_letter,
        resumeFilename: r.resume_filename,
        resumePath: r.resume_path,
        status: r.status,
        submittedAt: r.submitted_at,
        updatedAt: r.updated_at,
      }));
    } catch (err) {
      console.warn('[DEYSLA Careers] MySQL fetch failed, reading JSON:', err);
    }
  }

  return readJsonSafely<CareerApplicationRecord[]>(CAREERS_FILE, []);
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
  const now = new Date().toISOString();
  const id = `CAR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const record: CareerApplicationRecord = {
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
    submittedAt: now,
    updatedAt: now,
  };

  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
      await execute(
        `INSERT INTO cms_careers (
          id, name, email, phone, position, experience, notice_period,
          portfolio_url, cover_letter, resume_filename, resume_path, status, submitted_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.name,
          record.email,
          record.phone,
          record.position,
          record.experience || '',
          record.noticePeriod || '',
          record.portfolioUrl || '',
          record.coverLetter || '',
          record.resumeFilename || '',
          record.resumePath || '',
          record.status,
          record.submittedAt,
          record.updatedAt,
        ]
      );
    } catch (err) {
      console.warn('[DEYSLA Careers] Error inserting to MySQL:', err);
    }
  }

  // Always write to JSON fallback
  const existing = readJsonSafely<CareerApplicationRecord[]>(CAREERS_FILE, []);
  existing.unshift(record);
  writeJsonAtomically(CAREERS_FILE, existing);

  return record;
}

export async function updateCareerApplicationStatus(
  id: string,
  status: 'New' | 'Reviewing' | 'Interviewed' | 'Offered' | 'Archived',
  user = 'admin',
  notes?: string
): Promise<CareerApplicationRecord> {
  const connCheck = await checkMysqlConnection();
  if (connCheck.connected) {
    try {
      await execute('UPDATE cms_careers SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    } catch (err) {
      console.warn('[DEYSLA Careers] Error updating in MySQL:', err);
    }
  }

  const existing = readJsonSafely<CareerApplicationRecord[]>(CAREERS_FILE, []);
  const idx = existing.findIndex((c) => c.id === id);
  if (idx === -1) {
    throw new Error(`Career application "${id}" not found.`);
  }

  existing[idx].status = status;
  if (notes !== undefined) {
    existing[idx].notes = notes;
  }
  existing[idx].updatedAt = new Date().toISOString();
  writeJsonAtomically(CAREERS_FILE, existing);

  logAudit({
    user,
    action: 'STATUS_CHANGE',
    entity: 'COMPLAINT',
    entityId: id,
    details: `Updated Career application status to: ${status}${notes ? ` with notes: "${notes}"` : ''}`,
  });

  return existing[idx];
}
