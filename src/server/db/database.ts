import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PRODUCTS_DATA, ProductType } from '../../data/products.ts';
import { BRANDS_DATA, Brand } from '../../data/brands.ts';
import { CATALOG_ITEMS, CatalogItem } from '../../data/productCatalogItems.ts';
import { PRODUCT_CATEGORIES, ProductCategory } from '../../data/productCategories.ts';
import { BRAND_EQUIPMENT_ITEMS, BrandProductItem } from '../../data/brandProducts.ts';

export interface StoredProduct extends ProductType {
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface StoredCatalogItem extends CatalogItem {
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface StoredBrand extends Brand {
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ComplaintRecord {
  id: string;
  name: string;
  email: string;
  contact?: string;
  companyName?: string;
  message: string;
  type?: 'Contact Enquiry' | 'Complaint';
  status: 'New' | 'In Progress' | 'Resolved';
  notes?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface QuoteRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  city: string;
  projectTimeline: string;
  notes?: string;
  items: Array<{
    id?: string;
    title: string;
    category?: string;
    brand?: string;
    sku?: string;
    partNumber?: string;
    quantity: number;
    notes?: string;
  }>;
  status: 'Pending' | 'Under Review' | 'Completed' | 'Archived';
  submittedAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'UPLOAD_IMAGE' | 'RESTORE';
  entity: 'PRODUCT' | 'CATALOG_ITEM' | 'BRAND' | 'COMPLAINT' | 'QUOTE';
  entityId: string;
  details?: string;
}

export interface CatalogStore {
  version: number;
  lastUpdated: string;
  products: StoredProduct[];
  catalogItems: StoredCatalogItem[];
  brands: StoredBrand[];
  categories: ProductCategory[];
  brandEquipmentItems: BrandProductItem[];
}

const DB_DIR = path.resolve(process.cwd(), 'data', 'db');
const BACKUP_DIR = path.resolve(process.cwd(), '.backups', 'db');
const CATALOG_FILE = path.join(DB_DIR, 'catalog.json');
const COMPLAINTS_FILE = path.join(DB_DIR, 'complaints.json');
const QUOTES_FILE = path.join(DB_DIR, 'quotes.json');
const AUDIT_FILE = path.join(DB_DIR, 'audit_logs.json');

function ensureDirectories() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function writeJsonAtomically(filePath: string, data: any) {
  ensureDirectories();
  const tmpPath = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpPath, filePath);
}

function readJsonSafely<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`[DB Error] Failed to read ${filePath}:`, err);
    return fallback;
  }
}

export function createCatalogBackup(reason = 'manual'): string {
  ensureDirectories();
  if (!fs.existsSync(CATALOG_FILE)) return '';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `catalog_${reason}_${timestamp}.json`;
  const backupPath = path.join(BACKUP_DIR, backupName);
  fs.copyFileSync(CATALOG_FILE, backupPath);
  return backupPath;
}

export function logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  try {
    const logs = readJsonSafely<AuditLogEntry[]>(AUDIT_FILE, []);
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    logs.unshift(newEntry);
    // Keep last 1000 entries
    if (logs.length > 1000) logs.length = 1000;
    writeJsonAtomically(AUDIT_FILE, logs);
  } catch (err) {
    console.error('[DB Error] Failed to write audit log:', err);
  }
}

export function getAuditLogs(): AuditLogEntry[] {
  return readJsonSafely<AuditLogEntry[]>(AUDIT_FILE, []);
}

// ----------------------------------------------------------------------------
// Database Initialization & Seeding
// ----------------------------------------------------------------------------
export function initDatabase() {
  ensureDirectories();

  if (!fs.existsSync(CATALOG_FILE)) {
    console.log('[DEYSLA DB] Seeding initial catalogue from TypeScript definitions...');
    const seededCatalog: CatalogStore = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      products: PRODUCTS_DATA.map((p) => ({
        ...p,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      catalogItems: CATALOG_ITEMS.map((item) => ({
        ...item,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      brands: BRANDS_DATA.map((b) => ({
        ...b,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      categories: [...PRODUCT_CATEGORIES],
      brandEquipmentItems: [...BRAND_EQUIPMENT_ITEMS],
    };

    writeJsonAtomically(CATALOG_FILE, seededCatalog);
    createCatalogBackup('initial_seed');
    console.log(
      `[DEYSLA DB] Catalogue seeded: ${seededCatalog.products.length} products, ${seededCatalog.catalogItems.length} SKUs, ${seededCatalog.brands.length} brands.`
    );
  }

  if (!fs.existsSync(COMPLAINTS_FILE)) {
    writeJsonAtomically(COMPLAINTS_FILE, []);
  }

  if (!fs.existsSync(QUOTES_FILE)) {
    writeJsonAtomically(QUOTES_FILE, []);
  }

  if (!fs.existsSync(AUDIT_FILE)) {
    writeJsonAtomically(AUDIT_FILE, []);
  }
}

// ----------------------------------------------------------------------------
// Catalogue Operations
// ----------------------------------------------------------------------------
export function getCatalog(): CatalogStore {
  initDatabase();
  return readJsonSafely<CatalogStore>(CATALOG_FILE, {
    version: 1,
    lastUpdated: new Date().toISOString(),
    products: [],
    catalogItems: [],
    brands: [],
    categories: [],
    brandEquipmentItems: [],
  });
}

export function saveCatalog(catalog: CatalogStore) {
  catalog.lastUpdated = new Date().toISOString();
  writeJsonAtomically(CATALOG_FILE, catalog);
}

// Product Mutations
export function saveProduct(productData: Partial<StoredProduct> & { name: string; categoryId: string; isCreate?: boolean }, user = 'admin'): StoredProduct {
  const catalog = getCatalog();
  createCatalogBackup('pre_save_product');

  const now = new Date().toISOString();
  let productId = productData.id?.trim() || '';

  if (!productId) {
    productId = productData.slug?.trim() || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const existingIndex = catalog.products.findIndex((p) => p.id === productId);

  if (existingIndex >= 0) {
    if (productData.isCreate) {
      throw new Error(`Product with ID "${productId}" already exists.`);
    }
    // Update existing product
    const existing = catalog.products[existingIndex];
    const updated: StoredProduct = {
      ...existing,
      ...productData,
      id: productId,
      slug: productData.slug || existing.slug || productId,
      status: productData.status || existing.status || 'active',
      updatedAt: now,
    };
    catalog.products[existingIndex] = updated;
    saveCatalog(catalog);
    logAudit({
      user,
      action: 'UPDATE',
      entity: 'PRODUCT',
      entityId: productId,
      details: `Updated product: ${updated.name}`,
    });
    return updated;
  } else {
    // Create new product
    // Verify duplicate ID
    if (catalog.products.some((p) => p.id === productId)) {
      throw new Error(`Product with ID "${productId}" already exists.`);
    }

    const newProduct: StoredProduct = {
      id: productId,
      name: productData.name.trim(),
      slug: productData.slug || productId,
      categoryId: productData.categoryId,
      categoryName: productData.categoryName || '',
      description: productData.description || '',
      subcategories: productData.subcategories || [],
      keyApplications: productData.keyApplications || [],
      image: productData.image || '/assets/placeholder-product.svg',
      imageAlt: productData.imageAlt || productData.name,
      brandIds: productData.brandIds || [],
      status: productData.status || 'active',
      createdAt: now,
      updatedAt: now,
    };

    catalog.products.unshift(newProduct);
    saveCatalog(catalog);
    logAudit({
      user,
      action: 'CREATE',
      entity: 'PRODUCT',
      entityId: productId,
      details: `Created new product: ${newProduct.name}`,
    });
    return newProduct;
  }
}

export function toggleProductStatus(id: string, user = 'admin'): StoredProduct {
  const catalog = getCatalog();
  const index = catalog.products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error(`Product with ID "${id}" not found.`);

  const prod = catalog.products[index];
  const newStatus = prod.status === 'inactive' ? 'active' : 'inactive';
  prod.status = newStatus;
  prod.updatedAt = new Date().toISOString();

  catalog.products[index] = prod;
  saveCatalog(catalog);
  logAudit({
    user,
    action: 'STATUS_CHANGE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Toggled product status to ${newStatus}`,
  });
  return prod;
}

export function saveCatalogItem(itemData: Partial<StoredCatalogItem> & { name: string; subcategoryId: string; isCreate?: boolean }, user = 'admin'): StoredCatalogItem {
  const catalog = getCatalog();
  createCatalogBackup('pre_save_catalog_item');

  const now = new Date().toISOString();
  let itemId = itemData.id?.trim() || '';

  if (!itemId) {
    itemId = `${itemData.subcategoryId}-${itemData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`;
  }

  const existingIndex = catalog.catalogItems.findIndex((it) => it.id === itemId);

  if (existingIndex >= 0) {
    if (itemData.isCreate) {
      throw new Error(`Catalog item SKU "${itemId}" already exists.`);
    }
    const existing = catalog.catalogItems[existingIndex];
    const updated: StoredCatalogItem = {
      ...existing,
      ...itemData,
      id: itemId,
      status: itemData.status || existing.status || 'active',
      updatedAt: now,
    };
    catalog.catalogItems[existingIndex] = updated;
    saveCatalog(catalog);
    logAudit({
      user,
      action: 'UPDATE',
      entity: 'CATALOG_ITEM',
      entityId: itemId,
      details: `Updated sub-product SKU: ${updated.name}`,
    });
    return updated;
  } else {
    if (catalog.catalogItems.some((it) => it.id === itemId)) {
      throw new Error(`Catalog item SKU "${itemId}" already exists.`);
    }

    const newItem: StoredCatalogItem = {
      id: itemId,
      categoryId: itemData.categoryId || '',
      categoryName: itemData.categoryName || '',
      subcategoryId: itemData.subcategoryId,
      subcategoryName: itemData.subcategoryName || '',
      name: itemData.name.trim(),
      brand: itemData.brand || 'DEYSLA',
      badge: itemData.badge || '',
      specs: itemData.specs || [],
      image: itemData.image || '/assets/placeholder-product.svg',
      imageWebp: itemData.imageWebp || itemData.image || '/assets/placeholder-product.svg',
      status: itemData.status || 'active',
      createdAt: now,
      updatedAt: now,
    };

    catalog.catalogItems.unshift(newItem);
    saveCatalog(catalog);
    logAudit({
      user,
      action: 'CREATE',
      entity: 'CATALOG_ITEM',
      entityId: itemId,
      details: `Created new sub-product SKU: ${newItem.name}`,
    });
    return newItem;
  }
}

export function toggleCatalogItemStatus(id: string, user = 'admin'): StoredCatalogItem {
  const catalog = getCatalog();
  const index = catalog.catalogItems.findIndex((it) => it.id === id);
  if (index === -1) throw new Error(`Catalog item with ID "${id}" not found.`);

  const item = catalog.catalogItems[index];
  const newStatus = item.status === 'inactive' ? 'active' : 'inactive';
  item.status = newStatus;
  item.updatedAt = new Date().toISOString();

  catalog.catalogItems[index] = item;
  saveCatalog(catalog);
  logAudit({
    user,
    action: 'STATUS_CHANGE',
    entity: 'CATALOG_ITEM',
    entityId: id,
    details: `Toggled sub-product status to ${newStatus}`,
  });
  return item;
}

// Brand Mutations
export function saveBrand(brandData: Partial<StoredBrand> & { name: string; isCreate?: boolean }, user = 'admin'): StoredBrand {
  const catalog = getCatalog();
  createCatalogBackup('pre_save_brand');

  const now = new Date().toISOString();
  let brandId = brandData.id?.trim() || '';

  if (!brandId) {
    brandId = brandData.slug?.trim() || brandData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const existingIndex = catalog.brands.findIndex((b) => b.id === brandId);

  if (existingIndex >= 0) {
    if (brandData.isCreate) {
      throw new Error(`Brand with ID "${brandId}" already exists.`);
    }
    const existing = catalog.brands[existingIndex];

    const updated: StoredBrand = {
      ...existing,
      ...brandData,
      id: brandId,
      slug: brandData.slug || existing.slug || brandId,
      status: brandData.status || existing.status || 'active',
      updatedAt: now,
    };
    catalog.brands[existingIndex] = updated;
    saveCatalog(catalog);
    logAudit({
      user,
      action: 'UPDATE',
      entity: 'BRAND',
      entityId: brandId,
      details: `Updated brand: ${updated.name}`,
    });
    return updated;
  } else {
    if (catalog.brands.some((b) => b.id === brandId)) {
      throw new Error(`Brand with ID "${brandId}" already exists.`);
    }

    const newBrand: StoredBrand = {
      id: brandId,
      name: brandData.name.trim(),
      slug: brandData.slug || brandId,
      logo: brandData.logo || '/assets/brands/cisco-logo-0-2048x2048-1-1536x1536-1.png',
      categoryIds: brandData.categoryIds || [],
      description: brandData.description || '',
      productIds: brandData.productIds || [],
      origin: brandData.origin || 'Global',
      website: brandData.website || '',
      status: brandData.status || 'active',
      createdAt: now,
      updatedAt: now,
    };

    catalog.brands.unshift(newBrand);
    saveCatalog(catalog);
    logAudit({
      user,
      action: 'CREATE',
      entity: 'BRAND',
      entityId: brandId,
      details: `Created new brand: ${newBrand.name}`,
    });
    return newBrand;
  }
}

export function toggleBrandStatus(id: string, user = 'admin'): StoredBrand {
  const catalog = getCatalog();
  const index = catalog.brands.findIndex((b) => b.id === id);
  if (index === -1) throw new Error(`Brand with ID "${id}" not found.`);

  const brand = catalog.brands[index];
  const newStatus = brand.status === 'inactive' ? 'active' : 'inactive';
  brand.status = newStatus;
  brand.updatedAt = new Date().toISOString();

  catalog.brands[index] = brand;
  saveCatalog(catalog);
  logAudit({
    user,
    action: 'STATUS_CHANGE',
    entity: 'BRAND',
    entityId: id,
    details: `Toggled brand status to ${newStatus}`,
  });
  return brand;
}

// ----------------------------------------------------------------------------
// Customer Complaints / Contact Inquiries Operations
// ----------------------------------------------------------------------------
export function getComplaints(): ComplaintRecord[] {
  initDatabase();
  return readJsonSafely<ComplaintRecord[]>(COMPLAINTS_FILE, []);
}

export function recordComplaint(data: {
  name: string;
  email: string;
  contact?: string;
  companyName?: string;
  message: string;
  type?: 'Contact Enquiry' | 'Complaint';
}): ComplaintRecord {
  initDatabase();
  const complaints = getComplaints();
  const now = new Date().toISOString();
  const record: ComplaintRecord = {
    id: `CMP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
    name: data.name.trim(),
    email: data.email.trim(),
    contact: data.contact?.trim(),
    companyName: data.companyName?.trim(),
    message: data.message.trim(),
    type: data.type || 'Contact Enquiry',
    status: 'New',
    submittedAt: now,
    updatedAt: now,
  };

  complaints.unshift(record);
  writeJsonAtomically(COMPLAINTS_FILE, complaints);
  return record;
}

export function updateComplaint(
  id: string,
  updates: { status?: 'New' | 'In Progress' | 'Resolved'; notes?: string },
  user = 'admin'
): ComplaintRecord {
  const complaints = getComplaints();
  const index = complaints.findIndex((c) => c.id === id);
  if (index === -1) throw new Error(`Complaint with ID "${id}" not found.`);

  const updated: ComplaintRecord = {
    ...complaints[index],
    ...(updates.status ? { status: updates.status } : {}),
    ...(updates.notes !== undefined ? { notes: updates.notes } : {}),
    updatedAt: new Date().toISOString(),
  };

  complaints[index] = updated;
  writeJsonAtomically(COMPLAINTS_FILE, complaints);
  logAudit({
    user,
    action: 'UPDATE',
    entity: 'COMPLAINT',
    entityId: id,
    details: `Updated complaint status to "${updated.status}" with notes: "${updated.notes || ''}"`,
  });
  return updated;
}

// ----------------------------------------------------------------------------
// Quotation Requests Operations (View-Only Management)
// ----------------------------------------------------------------------------
export function getQuotes(): QuoteRecord[] {
  initDatabase();
  return readJsonSafely<QuoteRecord[]>(QUOTES_FILE, []);
}

export function recordQuote(data: {
  rfqReference: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  city: string;
  projectTimeline: string;
  notes?: string;
  items: any[];
}): QuoteRecord {
  initDatabase();
  const quotes = getQuotes();
  const now = new Date().toISOString();
  const record: QuoteRecord = {
    id: data.rfqReference,
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    companyName: data.companyName.trim(),
    city: data.city.trim(),
    projectTimeline: data.projectTimeline.trim(),
    notes: data.notes?.trim(),
    items: data.items,
    status: 'Pending',
    submittedAt: now,
    updatedAt: now,
  };

  quotes.unshift(record);
  writeJsonAtomically(QUOTES_FILE, quotes);
  return record;
}

// ----------------------------------------------------------------------------
// Dashboard Stats Computation
// ----------------------------------------------------------------------------
export function getDashboardStats() {
  const catalog = getCatalog();
  const complaints = getComplaints();
  const quotes = getQuotes();

  const totalProducts = catalog.products.length;
  const activeProducts = catalog.products.filter((p) => p.status !== 'inactive').length;
  const totalCatalogItems = catalog.catalogItems.length;
  const totalBrands = catalog.brands.length;

  const newComplaints = complaints.filter((c) => c.status === 'New').length;
  const inProgressComplaints = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;

  const pendingQuotes = quotes.filter((q) => q.status === 'Pending').length;
  const totalQuotes = quotes.length;

  // Recent activity feed combining recent complaints & quotes
  const recentComplaints = complaints.slice(0, 5).map((c) => ({
    type: 'complaint' as const,
    id: c.id,
    title: `Inquiry: ${c.name} (${c.companyName || 'Individual'})`,
    time: c.submittedAt,
    status: c.status,
  }));

  const recentQuotes = quotes.slice(0, 5).map((q) => ({
    type: 'quote' as const,
    id: q.id,
    title: `RFQ: ${q.companyName} (${q.items.length} items)`,
    time: q.submittedAt,
    status: q.status,
  }));

  const recentActivity = [...recentComplaints, ...recentQuotes]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8);

  return {
    totalProducts,
    activeProducts,
    totalCatalogItems,
    totalBrands,
    newComplaints,
    inProgressComplaints,
    resolvedComplaints,
    totalComplaints: complaints.length,
    pendingQuotes,
    totalQuotes,
    recentActivity,
  };
}
