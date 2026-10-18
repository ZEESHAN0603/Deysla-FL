import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { query, execute, checkMysqlConnection, isMysqlConfigured, withTransaction } from './mysql.ts';

// Static seed defaults for read-only bootstrap/fallback
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
  sku?: string;
  partNumber?: string;
  description?: string;
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
  status: 'Pending' | 'Under Review' | 'Quoted' | 'Completed' | 'Declined' | 'Archived';
  submittedAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'UPLOAD_IMAGE' | 'RESTORE';
  entity: 'PRODUCT' | 'CATALOG_ITEM' | 'BRAND' | 'COMPLAINT' | 'QUOTE' | 'CAREER';
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

const BACKUP_DIR = path.resolve(process.cwd(), '.backups', 'db');

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
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

// ----------------------------------------------------------------------------
// Audit Logging (MySQL backed)
// ----------------------------------------------------------------------------
export async function logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    console.warn('[DEYSLA DB] MySQL unavailable for audit log:', entry);
    return;
  }

  const id = `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  try {
    await execute(
      `INSERT INTO cms_audit_logs (id, timestamp, user, action, entity, entity_id, details)
       VALUES (?, NOW(), ?, ?, ?, ?, ?)`,
      [id, entry.user || 'admin', entry.action, entry.entity, entry.entityId, entry.details || '']
    );
  } catch (err: any) {
    console.error('[DEYSLA DB] Failed to record audit log:', err?.message);
  }
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    return [];
  }

  const rows = await query<any>(
    'SELECT id, timestamp, user, action, entity, entity_id, details FROM cms_audit_logs ORDER BY timestamp DESC LIMIT 500'
  );

  return rows.map((r: any) => ({
    id: r.id,
    timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString(),
    user: r.user,
    action: r.action,
    entity: r.entity,
    entityId: r.entity_id,
    details: r.details || '',
  }));
}

// ----------------------------------------------------------------------------
// Catalogue Operations (MySQL backed with read-only bootstrap fallback)
// ----------------------------------------------------------------------------
export async function getCatalog(): Promise<CatalogStore> {
  const connCheck = await checkMysqlConnection();

  if (connCheck.connected) {
    try {
      // 1. Products
      const productRows = await query<any>(
        'SELECT * FROM cms_products ORDER BY created_at DESC'
      );
      const products: StoredProduct[] = productRows.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug || p.id,
        categoryId: p.category_id,
        categoryName: p.category_name || '',
        description: p.description || '',
        subcategories: parseJsonField<string[]>(p.subcategories, []),
        keyApplications: parseJsonField<string[]>(p.key_applications, []),
        image: p.image || '/assets/placeholder-product.svg',
        imageAlt: p.image_alt || p.name,
        brandIds: parseJsonField<string[]>(p.brand_ids, []),
        status: p.status || 'active',
        createdAt: p.created_at ? new Date(p.created_at).toISOString() : new Date().toISOString(),
        updatedAt: p.updated_at ? new Date(p.updated_at).toISOString() : new Date().toISOString(),
      }));

      // 2. Catalog Items (SKUs)
      const itemRows = await query<any>(
        'SELECT * FROM cms_catalog_items ORDER BY created_at DESC'
      );
      const catalogItems: StoredCatalogItem[] = itemRows.map((it: any) => ({
        id: it.id,
        sku: it.sku || it.id,
        name: it.name,
        partNumber: it.part_number || '',
        subcategoryId: it.subcategory_id,
        subcategoryName: it.subcategory_name || '',
        categoryId: it.category_id,
        categoryName: it.category_name || '',
        description: it.description || '',
        badge: it.badge || '',
        specs: parseJsonField<string[]>(it.specifications, []),
        image: it.image || '/assets/placeholder-product.svg',
        imageWebp: it.image_webp || it.image || '/assets/placeholder-product.svg',
        brand: it.brand_name || it.brand_id || 'DEYSLA',
        status: it.status || 'active',
        createdAt: it.created_at ? new Date(it.created_at).toISOString() : new Date().toISOString(),
        updatedAt: it.updated_at ? new Date(it.updated_at).toISOString() : new Date().toISOString(),
      }));

      // 3. Brands
      const brandRows = await query<any>(
        'SELECT * FROM cms_brands ORDER BY name ASC'
      );
      const brands: StoredBrand[] = brandRows.map((b: any) => ({
        id: b.id,
        name: b.name,
        slug: b.slug || b.id,
        logo: b.logo || '/assets/brands/cisco-logo-0-2048x2048-1-1536x1536-1.png',
        categoryIds: parseJsonField<string[]>(b.category_ids, []),
        description: b.description || '',
        productIds: parseJsonField<string[]>(b.product_ids, []),
        origin: b.origin || 'Global',
        website: b.website || '',
        status: b.status || 'active',
        createdAt: b.created_at ? new Date(b.created_at).toISOString() : new Date().toISOString(),
        updatedAt: b.updated_at ? new Date(b.updated_at).toISOString() : new Date().toISOString(),
      }));

      // 4. Product Categories
      const categoryRows = await query<any>(
        'SELECT * FROM cms_product_categories WHERE is_active = 1 ORDER BY sort_order ASC'
      );
      const categories: ProductCategory[] = categoryRows.length > 0
        ? categoryRows.map((c: any) => {
            const staticCat = PRODUCT_CATEGORIES.find((pc) => pc.id === c.id || pc.slug === c.slug);
            return {
              id: c.id,
              name: c.name,
              slug: c.slug,
              icon: c.icon || staticCat?.icon || '',
              headline: c.headline || staticCat?.headline || '',
              description: c.description || staticCat?.description || '',
              featuredImage: c.featured_image || staticCat?.featuredImage,
              productTypeIds: staticCat?.productTypeIds || [],
            };
          })
        : [...PRODUCT_CATEGORIES];

      // 5. Brand Equipment Items
      const equipmentRows = await query<any>('SELECT * FROM cms_brand_equipment');
      const brandEquipmentItems: BrandProductItem[] = equipmentRows.length > 0
        ? equipmentRows.map((eq: any) => {
            const staticEq = BRAND_EQUIPMENT_ITEMS.find(
              (be) => be.id === eq.id || (be.brandId === eq.brand_id && be.model === eq.model)
            );
            return {
              id: eq.id,
              brandId: eq.brand_id,
              model: eq.model,
              name: staticEq?.name || eq.model,
              category: eq.category || staticEq?.category || '',
              image: staticEq?.image || '/assets/placeholder-product.svg',
              specs: Array.isArray(eq.specs) ? eq.specs : (staticEq?.specs || []),
            };
          })
        : [...BRAND_EQUIPMENT_ITEMS];

      // Harmonize bidirectional brand-product links
      const brandMap = new Map<string, StoredBrand>();
      brands.forEach((b) => brandMap.set(b.id, b));

      products.forEach((p) => {
        if (Array.isArray(p.brandIds)) {
          p.brandIds.forEach((bId) => {
            const b = brandMap.get(bId);
            if (b && Array.isArray(b.productIds) && !b.productIds.includes(p.id)) {
              b.productIds.push(p.id);
            }
          });
        }
      });

      brands.forEach((b) => {
        if (Array.isArray(b.productIds)) {
          b.productIds.forEach((pId) => {
            const prod = products.find((p) => p.id === pId || p.slug === pId);
            if (prod && Array.isArray(prod.brandIds) && !prod.brandIds.includes(b.id)) {
              prod.brandIds.push(b.id);
            }
          });
        }
      });

      return {
        version: 2,
        lastUpdated: new Date().toISOString(),
        products,
        catalogItems,
        brands,
        categories,
        brandEquipmentItems,
      };
    } catch (err: any) {
      console.error('[DEYSLA DB] Failed to query catalog from MySQL:', err?.message);
      throw new Error(`Failed to load catalog from MySQL database: ${err?.message}`);
    }
  }

  if (isMysqlConfigured()) {
    throw new Error(`MySQL database connection failed: ${connCheck.error || 'Database unavailable'}. Please check your Hostinger MySQL configuration.`);
  }

  // Fallback for read-only static bootstrap ONLY if MySQL is completely unconfigured in environment
  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    products: PRODUCTS_DATA.map((p) => ({ ...p, status: 'active' })),
    catalogItems: CATALOG_ITEMS.map((item) => ({ ...item, status: 'active' })),
    brands: BRANDS_DATA.map((b) => ({ ...b, status: 'active' })),
    categories: [...PRODUCT_CATEGORIES],
    brandEquipmentItems: [...BRAND_EQUIPMENT_ITEMS],
  };
}

export async function saveCatalog(catalog: CatalogStore, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  if (Array.isArray(catalog.products)) {
    for (const p of catalog.products) {
      if (p && p.name && p.categoryId) {
        await saveProduct(p, user);
      }
    }
  }

  if (Array.isArray(catalog.catalogItems)) {
    for (const it of catalog.catalogItems) {
      if (it && it.name && it.subcategoryId) {
        await saveCatalogItem(it, user);
      }
    }
  }

  if (Array.isArray(catalog.brands)) {
    for (const b of catalog.brands) {
      if (b && b.name) {
        await saveBrand(b, user);
      }
    }
  }
}

async function syncBrandProductLinks(productId: string, newBrandIds: string[], oldBrandIds: string[] = []): Promise<void> {
  const newSet = new Set(newBrandIds || []);
  const oldSet = new Set(oldBrandIds || []);

  for (const brandId of newSet) {
    try {
      const rows = await query<any>('SELECT id, product_ids FROM cms_brands WHERE id = ?', [brandId]);
      if (rows && rows.length > 0) {
        const prodIds = parseJsonField<string[]>(rows[0].product_ids, []);
        if (!prodIds.includes(productId)) {
          prodIds.push(productId);
          await execute('UPDATE cms_brands SET product_ids = ?, updated_at = NOW() WHERE id = ?', [
            JSON.stringify(prodIds),
            brandId,
          ]);
        }
      }
    } catch (err: any) {
      console.warn(`[DEYSLA DB] Note syncing brand ${brandId} for product ${productId}:`, err?.message);
    }
  }

  for (const brandId of oldSet) {
    if (!newSet.has(brandId)) {
      try {
        const rows = await query<any>('SELECT id, product_ids FROM cms_brands WHERE id = ?', [brandId]);
        if (rows && rows.length > 0) {
          const prodIds = parseJsonField<string[]>(rows[0].product_ids, []);
          const filtered = prodIds.filter((id) => id !== productId);
          if (filtered.length !== prodIds.length) {
            await execute('UPDATE cms_brands SET product_ids = ?, updated_at = NOW() WHERE id = ?', [
              JSON.stringify(filtered),
              brandId,
            ]);
          }
        }
      } catch (err: any) {
        console.warn(`[DEYSLA DB] Note unlinking brand ${brandId} for product ${productId}:`, err?.message);
      }
    }
  }
}

async function syncProductBrandLinks(brandId: string, newProductIds: string[], oldProductIds: string[] = []): Promise<void> {
  const newSet = new Set(newProductIds || []);
  const oldSet = new Set(oldProductIds || []);

  for (const prodId of newSet) {
    try {
      const rows = await query<any>('SELECT id, brand_ids FROM cms_products WHERE id = ?', [prodId]);
      if (rows && rows.length > 0) {
        const brandIds = parseJsonField<string[]>(rows[0].brand_ids, []);
        if (!brandIds.includes(brandId)) {
          brandIds.push(brandId);
          await execute('UPDATE cms_products SET brand_ids = ?, updated_at = NOW() WHERE id = ?', [
            JSON.stringify(brandIds),
            prodId,
          ]);
        }
      }
    } catch (err: any) {
      console.warn(`[DEYSLA DB] Note syncing product ${prodId} for brand ${brandId}:`, err?.message);
    }
  }

  for (const prodId of oldSet) {
    if (!newSet.has(prodId)) {
      try {
        const rows = await query<any>('SELECT id, brand_ids FROM cms_products WHERE id = ?', [prodId]);
        if (rows && rows.length > 0) {
          const brandIds = parseJsonField<string[]>(rows[0].brand_ids, []);
          const filtered = brandIds.filter((id) => id !== brandId);
          if (filtered.length !== brandIds.length) {
            await execute('UPDATE cms_products SET brand_ids = ?, updated_at = NOW() WHERE id = ?', [
              JSON.stringify(filtered),
              prodId,
            ]);
          }
        }
      } catch (err: any) {
        console.warn(`[DEYSLA DB] Note unlinking product ${prodId} for brand ${brandId}:`, err?.message);
      }
    }
  }
}

// ----------------------------------------------------------------------------
// Product Mutations (MySQL-First)
// ----------------------------------------------------------------------------
export async function saveProduct(
  productData: Partial<StoredProduct> & { name: string; categoryId: string; isCreate?: boolean },
  user = 'admin'
): Promise<StoredProduct> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const now = new Date().toISOString();
  let productId = productData.id?.trim() || '';

  if (!productId) {
    productId = productData.slug?.trim() || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const existingRows = await query<any>('SELECT id, slug, status, brand_ids FROM cms_products WHERE id = ?', [productId]);
  const existing = existingRows[0];

  if (existing) {
    if (productData.isCreate) {
      throw new Error(`Product with ID "${productId}" already exists.`);
    }

    const updatedSlug = productData.slug || existing.slug || productId;
    const updatedStatus = productData.status || existing.status || 'active';
    const oldBrandIds = parseJsonField<string[]>(existing.brand_ids, []);

    await execute(
      `UPDATE cms_products SET
        name = ?, slug = ?, category_id = ?, category_name = ?, description = ?,
        subcategories = ?, key_applications = ?, image = ?, image_alt = ?, brand_ids = ?,
        status = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        productData.name.trim(),
        updatedSlug,
        productData.categoryId,
        productData.categoryName || '',
        productData.description || '',
        JSON.stringify(productData.subcategories || []),
        JSON.stringify(productData.keyApplications || []),
        productData.image || '/assets/placeholder-product.svg',
        productData.imageAlt || productData.name,
        JSON.stringify(productData.brandIds || []),
        updatedStatus,
        productId,
      ]
    );

    // Synchronize cms_brands.product_ids in MySQL
    await syncBrandProductLinks(productId, productData.brandIds || [], oldBrandIds);

    await logAudit({
      user,
      action: 'UPDATE',
      entity: 'PRODUCT',
      entityId: productId,
      details: `Updated product: ${productData.name.trim()}`,
    });

    const [refetched] = await query<any>('SELECT * FROM cms_products WHERE id = ?', [productId]);
    return {
      id: refetched.id,
      name: refetched.name,
      slug: refetched.slug,
      categoryId: refetched.category_id,
      categoryName: refetched.category_name,
      description: refetched.description,
      subcategories: parseJsonField<string[]>(refetched.subcategories, []),
      keyApplications: parseJsonField<string[]>(refetched.key_applications, []),
      image: refetched.image,
      imageAlt: refetched.image_alt,
      brandIds: parseJsonField<string[]>(refetched.brand_ids, []),
      status: refetched.status,
      createdAt: refetched.created_at ? new Date(refetched.created_at).toISOString() : now,
      updatedAt: refetched.updated_at ? new Date(refetched.updated_at).toISOString() : now,
    };
  } else {
    // Check for duplicate slug
    const slug = productData.slug || productId;
    const duplicateSlug = await query<any>('SELECT id FROM cms_products WHERE slug = ?', [slug]);
    if (duplicateSlug.length > 0) {
      throw new Error(`A product with slug "${slug}" already exists.`);
    }

    await execute(
      `INSERT INTO cms_products (
        id, name, slug, category_id, category_name, description, subcategories,
        key_applications, image, image_alt, brand_ids, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        productId,
        productData.name.trim(),
        slug,
        productData.categoryId,
        productData.categoryName || '',
        productData.description || '',
        JSON.stringify(productData.subcategories || []),
        JSON.stringify(productData.keyApplications || []),
        productData.image || '/assets/placeholder-product.svg',
        productData.imageAlt || productData.name,
        JSON.stringify(productData.brandIds || []),
        productData.status || 'active',
      ]
    );

    // Synchronize cms_brands.product_ids in MySQL
    await syncBrandProductLinks(productId, productData.brandIds || [], []);

    await logAudit({
      user,
      action: 'CREATE',
      entity: 'PRODUCT',
      entityId: productId,
      details: `Created product: ${productData.name.trim()}`,
    });

    const [refetched] = await query<any>('SELECT * FROM cms_products WHERE id = ?', [productId]);
    return {
      id: refetched.id,
      name: refetched.name,
      slug: refetched.slug,
      categoryId: refetched.category_id,
      categoryName: refetched.category_name,
      description: refetched.description,
      subcategories: parseJsonField<string[]>(refetched.subcategories, []),
      keyApplications: parseJsonField<string[]>(refetched.key_applications, []),
      image: refetched.image,
      imageAlt: refetched.image_alt,
      brandIds: parseJsonField<string[]>(refetched.brand_ids, []),
      status: refetched.status,
      createdAt: refetched.created_at ? new Date(refetched.created_at).toISOString() : now,
      updatedAt: refetched.updated_at ? new Date(refetched.updated_at).toISOString() : now,
    };
  }
}

export async function toggleProductStatus(id: string, user = 'admin'): Promise<StoredProduct> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const [existing] = await query<any>('SELECT * FROM cms_products WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Product with ID "${id}" not found.`);
  }

  const newStatus = existing.status === 'inactive' ? 'active' : 'inactive';
  await execute('UPDATE cms_products SET status = ?, updated_at = NOW() WHERE id = ?', [newStatus, id]);

  await logAudit({
    user,
    action: 'STATUS_CHANGE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Toggled product status to ${newStatus}`,
  });

  const [refetched] = await query<any>('SELECT * FROM cms_products WHERE id = ?', [id]);
  return {
    id: refetched.id,
    name: refetched.name,
    slug: refetched.slug,
    categoryId: refetched.category_id,
    categoryName: refetched.category_name,
    description: refetched.description,
    subcategories: parseJsonField<string[]>(refetched.subcategories, []),
    keyApplications: parseJsonField<string[]>(refetched.key_applications, []),
    image: refetched.image,
    imageAlt: refetched.image_alt,
    brandIds: parseJsonField<string[]>(refetched.brand_ids, []),
    status: refetched.status,
    createdAt: refetched.created_at ? new Date(refetched.created_at).toISOString() : new Date().toISOString(),
    updatedAt: refetched.updated_at ? new Date(refetched.updated_at).toISOString() : new Date().toISOString(),
  };
}

export async function deleteProduct(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const [existing] = await query<any>('SELECT * FROM cms_products WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Product with ID "${id}" not found.`);
  }

  // Relationship safety check: Check for dependent commercial SKUs
  const skuRows = await query<any>('SELECT id, name FROM cms_catalog_items WHERE subcategory_id = ?', [id]);
  if (skuRows.length > 0) {
    throw new Error(
      `Cannot delete product "${existing.name}": ${skuRows.length} commercial SKU(s) depend on it (${skuRows.slice(0, 3).map((s: any) => s.name).join(', ')}${skuRows.length > 3 ? '...' : ''}). Please reassign or delete these SKUs first.`
    );
  }

  // Unlink product from associated brands in cms_brands
  const existingBrandIds = parseJsonField<string[]>(existing.brand_ids, []);
  if (existingBrandIds.length > 0) {
    await syncBrandProductLinks(id, [], existingBrandIds);
  }

  // Delete product record
  await execute('DELETE FROM cms_products WHERE id = ?', [id]);

  await logAudit({
    user,
    action: 'DELETE',
    entity: 'PRODUCT',
    entityId: id,
    details: `Deleted product: "${existing.name}" (ID: ${id})`,
  });
}


// ----------------------------------------------------------------------------
// Catalog Items / Commercial SKUs Mutations (MySQL-First)
// ----------------------------------------------------------------------------
export async function saveCatalogItem(
  itemData: Partial<StoredCatalogItem> & { name: string; subcategoryId: string; isCreate?: boolean },
  user = 'admin'
): Promise<StoredCatalogItem> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const now = new Date().toISOString();
  let itemId = itemData.id?.trim() || '';

  if (!itemId) {
    itemId = `${itemData.subcategoryId}-${itemData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`;
  }

  const [existing] = await query<any>('SELECT id, status FROM cms_catalog_items WHERE id = ?', [itemId]);

  if (existing) {
    if (itemData.isCreate) {
      throw new Error(`Catalog item SKU "${itemId}" already exists.`);
    }

    const updatedStatus = itemData.status || existing.status || 'active';

    await execute(
      `UPDATE cms_catalog_items SET
        sku = ?, name = ?, part_number = ?, subcategory_id = ?, subcategory_name = ?,
        category_id = ?, category_name = ?, description = ?, badge = ?, specifications = ?,
        image = ?, image_webp = ?, brand_name = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        itemData.sku || itemId,
        itemData.name.trim(),
        itemData.partNumber || '',
        itemData.subcategoryId,
        itemData.subcategoryName || '',
        itemData.categoryId || '',
        itemData.categoryName || '',
        itemData.description || '',
        itemData.badge || '',
        JSON.stringify(itemData.specs || []),
        itemData.image || '/assets/placeholder-product.svg',
        itemData.imageWebp || itemData.image || '/assets/placeholder-product.svg',
        itemData.brand || 'DEYSLA',
        updatedStatus,
        itemId,
      ]
    );

    await logAudit({
      user,
      action: 'UPDATE',
      entity: 'CATALOG_ITEM',
      entityId: itemId,
      details: `Updated sub-product SKU: ${itemData.name.trim()}`,
    });
  } else {
    await execute(
      `INSERT INTO cms_catalog_items (
        id, sku, name, part_number, subcategory_id, subcategory_name, category_id, category_name,
        description, badge, specifications, image, image_webp, brand_name, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        itemId,
        itemData.sku || itemId,
        itemData.name.trim(),
        itemData.partNumber || '',
        itemData.subcategoryId,
        itemData.subcategoryName || '',
        itemData.categoryId || '',
        itemData.categoryName || '',
        itemData.description || '',
        itemData.badge || '',
        JSON.stringify(itemData.specs || []),
        itemData.image || '/assets/placeholder-product.svg',
        itemData.imageWebp || itemData.image || '/assets/placeholder-product.svg',
        itemData.brand || 'DEYSLA',
        itemData.status || 'active',
      ]
    );

    await logAudit({
      user,
      action: 'CREATE',
      entity: 'CATALOG_ITEM',
      entityId: itemId,
      details: `Created new sub-product SKU: ${itemData.name.trim()}`,
    });
  }

  const [refetched] = await query<any>('SELECT * FROM cms_catalog_items WHERE id = ?', [itemId]);
  return {
    id: refetched.id,
    sku: refetched.sku,
    name: refetched.name,
    partNumber: refetched.part_number,
    subcategoryId: refetched.subcategory_id,
    subcategoryName: refetched.subcategory_name,
    categoryId: refetched.category_id,
    categoryName: refetched.category_name,
    description: refetched.description,
    badge: refetched.badge,
    specs: parseJsonField<string[]>(refetched.specifications, []),
    image: refetched.image,
    imageWebp: refetched.image_webp,
    brand: refetched.brand_name || 'DEYSLA',
    status: refetched.status,
    createdAt: refetched.created_at ? new Date(refetched.created_at).toISOString() : now,
    updatedAt: refetched.updated_at ? new Date(refetched.updated_at).toISOString() : now,
  };
}

export async function toggleCatalogItemStatus(id: string, user = 'admin'): Promise<StoredCatalogItem> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const [existing] = await query<any>('SELECT * FROM cms_catalog_items WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Catalog item with ID "${id}" not found.`);
  }

  const newStatus = existing.status === 'inactive' ? 'active' : 'inactive';
  await execute('UPDATE cms_catalog_items SET status = ?, updated_at = NOW() WHERE id = ?', [newStatus, id]);

  await logAudit({
    user,
    action: 'STATUS_CHANGE',
    entity: 'CATALOG_ITEM',
    entityId: id,
    details: `Toggled sub-product status to ${newStatus}`,
  });

  const [refetched] = await query<any>('SELECT * FROM cms_catalog_items WHERE id = ?', [id]);
  return {
    id: refetched.id,
    sku: refetched.sku,
    name: refetched.name,
    partNumber: refetched.part_number,
    subcategoryId: refetched.subcategory_id,
    subcategoryName: refetched.subcategory_name,
    categoryId: refetched.category_id,
    categoryName: refetched.category_name,
    description: refetched.description,
    badge: refetched.badge,
    specs: parseJsonField<string[]>(refetched.specifications, []),
    image: refetched.image,
    imageWebp: refetched.image_webp,
    brand: refetched.brand_name || 'DEYSLA',
    status: refetched.status,
    createdAt: refetched.created_at ? new Date(refetched.created_at).toISOString() : new Date().toISOString(),
    updatedAt: refetched.updated_at ? new Date(refetched.updated_at).toISOString() : new Date().toISOString(),
  };
}

export async function deleteCatalogItem(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const [existing] = await query<any>('SELECT * FROM cms_catalog_items WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Catalog item SKU with ID "${id}" not found.`);
  }

  await execute('DELETE FROM cms_catalog_items WHERE id = ?', [id]);

  await logAudit({
    user,
    action: 'DELETE',
    entity: 'CATALOG_ITEM',
    entityId: id,
    details: `Deleted commercial SKU: "${existing.name}" (ID: ${id})`,
  });
}


// ----------------------------------------------------------------------------
// Brand Mutations (MySQL-First)
// ----------------------------------------------------------------------------
export async function saveBrand(
  brandData: Partial<StoredBrand> & { name: string; isCreate?: boolean },
  user = 'admin'
): Promise<StoredBrand> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const now = new Date().toISOString();
  let brandId = brandData.id?.trim() || '';

  if (!brandId) {
    brandId = brandData.slug?.trim() || brandData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const [existing] = await query<any>('SELECT id, slug, status, product_ids FROM cms_brands WHERE id = ?', [brandId]);

  if (existing) {
    if (brandData.isCreate) {
      throw new Error(`Brand with ID "${brandId}" already exists.`);
    }

    const updatedSlug = brandData.slug || existing.slug || brandId;
    const updatedStatus = brandData.status || existing.status || 'active';
    const oldProductIds = parseJsonField<string[]>(existing.product_ids, []);

    await execute(
      `UPDATE cms_brands SET
        name = ?, slug = ?, logo = ?, category_ids = ?, product_ids = ?,
        origin = ?, website = ?, description = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        brandData.name.trim(),
        updatedSlug,
        brandData.logo || '/assets/brands/cisco-logo-0-2048x2048-1-1536x1536-1.png',
        JSON.stringify(brandData.categoryIds || []),
        JSON.stringify(brandData.productIds || []),
        brandData.origin || 'Global',
        brandData.website || '',
        brandData.description || '',
        updatedStatus,
        brandId,
      ]
    );

    // Synchronize cms_products.brand_ids in MySQL
    await syncProductBrandLinks(brandId, brandData.productIds || [], oldProductIds);

    await logAudit({
      user,
      action: 'UPDATE',
      entity: 'BRAND',
      entityId: brandId,
      details: `Updated brand: ${brandData.name.trim()}`,
    });
  } else {
    const slug = brandData.slug || brandId;
    await execute(
      `INSERT INTO cms_brands (
        id, name, slug, logo, category_ids, product_ids, origin, website, description, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        brandId,
        brandData.name.trim(),
        slug,
        brandData.logo || '/assets/brands/cisco-logo-0-2048x2048-1-1536x1536-1.png',
        JSON.stringify(brandData.categoryIds || []),
        JSON.stringify(brandData.productIds || []),
        brandData.origin || 'Global',
        brandData.website || '',
        brandData.description || '',
        brandData.status || 'active',
      ]
    );

    // Synchronize cms_products.brand_ids in MySQL
    await syncProductBrandLinks(brandId, brandData.productIds || [], []);

    await logAudit({
      user,
      action: 'CREATE',
      entity: 'BRAND',
      entityId: brandId,
      details: `Created new brand: ${brandData.name.trim()}`,
    });
  }

  const [refetched] = await query<any>('SELECT * FROM cms_brands WHERE id = ?', [brandId]);
  return {
    id: refetched.id,
    name: refetched.name,
    slug: refetched.slug,
    logo: refetched.logo,
    categoryIds: parseJsonField<string[]>(refetched.category_ids, []),
    productIds: parseJsonField<string[]>(refetched.product_ids, []),
    origin: refetched.origin,
    website: refetched.website,
    description: refetched.description,
    status: refetched.status,
    createdAt: refetched.created_at ? new Date(refetched.created_at).toISOString() : now,
    updatedAt: refetched.updated_at ? new Date(refetched.updated_at).toISOString() : now,
  };
}

export async function toggleBrandStatus(id: string, user = 'admin'): Promise<StoredBrand> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const [existing] = await query<any>('SELECT * FROM cms_brands WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Brand with ID "${id}" not found.`);
  }

  const newStatus = existing.status === 'inactive' ? 'active' : 'inactive';
  await execute('UPDATE cms_brands SET status = ?, updated_at = NOW() WHERE id = ?', [newStatus, id]);

  await logAudit({
    user,
    action: 'STATUS_CHANGE',
    entity: 'BRAND',
    entityId: id,
    details: `Toggled brand status to ${newStatus}`,
  });

  const [refetched] = await query<any>('SELECT * FROM cms_brands WHERE id = ?', [id]);
  return {
    id: refetched.id,
    name: refetched.name,
    slug: refetched.slug,
    logo: refetched.logo,
    categoryIds: parseJsonField<string[]>(refetched.category_ids, []),
    productIds: parseJsonField<string[]>(refetched.product_ids, []),
    origin: refetched.origin,
    website: refetched.website,
    description: refetched.description,
    status: refetched.status,
    createdAt: refetched.created_at ? new Date(refetched.created_at).toISOString() : new Date().toISOString(),
    updatedAt: refetched.updated_at ? new Date(refetched.updated_at).toISOString() : new Date().toISOString(),
  };
}

export async function deleteBrand(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const [existing] = await query<any>('SELECT * FROM cms_brands WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Brand with ID "${id}" not found.`);
  }

  // Safety check: Check if any products reference this brand in brand_ids
  const allProducts = await query<any>('SELECT id, name, brand_ids FROM cms_products');
  const referencingProducts = allProducts.filter((p: any) => {
    const bIds = parseJsonField<string[]>(p.brand_ids, []);
    return bIds.includes(id) || bIds.includes(existing.slug);
  });

  if (referencingProducts.length > 0) {
    throw new Error(
      `Cannot delete brand "${existing.name}": It is linked to ${referencingProducts.length} product(s) (${referencingProducts.slice(0, 3).map((p: any) => p.name).join(', ')}${referencingProducts.length > 3 ? '...' : ''}). Please remove brand associations from those products before deleting.`
    );
  }

  // Safety check: Check if any commercial SKUs reference this brand name
  const [skuCheck] = await query<any>(
    'SELECT count(*) as count FROM cms_catalog_items WHERE brand_name = ?',
    [existing.name]
  );
  if (skuCheck && skuCheck.count > 0) {
    throw new Error(
      `Cannot delete brand "${existing.name}": ${skuCheck.count} commercial SKU(s) are associated with this brand. Please reassign or delete those SKUs first.`
    );
  }

  // Clean up any equipment mapping for this brand
  await execute('DELETE FROM cms_brand_equipment WHERE brand_id = ?', [id]);

  // Delete brand record
  await execute('DELETE FROM cms_brands WHERE id = ?', [id]);

  await logAudit({
    user,
    action: 'DELETE',
    entity: 'BRAND',
    entityId: id,
    details: `Deleted brand: "${existing.name}" (ID: ${id})`,
  });
}


// ----------------------------------------------------------------------------
// Customer Complaints / Contact Inquiries (MySQL-First)
// ----------------------------------------------------------------------------
export async function getComplaints(): Promise<ComplaintRecord[]> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database unavailable: ${connCheck.error}`);
  }

  const rows = await query<any>(
    'SELECT * FROM cms_complaints ORDER BY submitted_at DESC'
  );

  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    contact: r.contact || '',
    companyName: r.company_name || '',
    message: r.message,
    type: r.type || 'Contact Enquiry',
    status: r.status || 'New',
    notes: r.notes || '',
    submittedAt: r.submitted_at ? new Date(r.submitted_at).toISOString() : new Date().toISOString(),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
  }));
}

export async function recordComplaint(data: {
  name: string;
  email: string;
  contact?: string;
  companyName?: string;
  message: string;
  type?: 'Contact Enquiry' | 'Complaint';
}): Promise<ComplaintRecord> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const id = `CMP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();
  const inquiryType = data.type || 'Contact Enquiry';

  await execute(
    `INSERT INTO cms_complaints (id, name, email, contact, company_name, message, type, status, submitted_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'New', NOW(), NOW())`,
    [
      id,
      data.name.trim(),
      data.email.trim(),
      data.contact?.trim() || '',
      data.companyName?.trim() || '',
      data.message.trim(),
      inquiryType,
    ]
  );

  return {
    id,
    name: data.name.trim(),
    email: data.email.trim(),
    contact: data.contact?.trim(),
    companyName: data.companyName?.trim(),
    message: data.message.trim(),
    type: inquiryType,
    status: 'New',
    submittedAt: now,
    updatedAt: now,
  };
}

export async function updateComplaint(
  id: string,
  updates: { status?: 'New' | 'In Progress' | 'Resolved'; notes?: string },
  user = 'admin'
): Promise<ComplaintRecord> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const [existing] = await query<any>('SELECT * FROM cms_complaints WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Complaint with ID "${id}" not found.`);
  }

  const newStatus = updates.status || existing.status || 'New';
  const newNotes = updates.notes !== undefined ? updates.notes : existing.notes;

  await execute(
    'UPDATE cms_complaints SET status = ?, notes = ?, updated_at = NOW() WHERE id = ?',
    [newStatus, newNotes || '', id]
  );

  await logAudit({
    user,
    action: 'UPDATE',
    entity: 'COMPLAINT',
    entityId: id,
    details: `Updated complaint status to "${newStatus}"`,
  });

  const [refetched] = await query<any>('SELECT * FROM cms_complaints WHERE id = ?', [id]);
  return {
    id: refetched.id,
    name: refetched.name,
    email: refetched.email,
    contact: refetched.contact,
    companyName: refetched.company_name,
    message: refetched.message,
    type: refetched.type || 'Contact Enquiry',
    status: refetched.status,
    notes: refetched.notes,
    submittedAt: refetched.submitted_at ? new Date(refetched.submitted_at).toISOString() : new Date().toISOString(),
    updatedAt: refetched.updated_at ? new Date(refetched.updated_at).toISOString() : new Date().toISOString(),
  };
}

export async function deleteComplaint(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const [existing] = await query<any>('SELECT * FROM cms_complaints WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Complaint / inquiry ticket "${id}" not found.`);
  }

  await execute('DELETE FROM cms_complaints WHERE id = ?', [id]);

  await logAudit({
    user,
    action: 'DELETE',
    entity: 'COMPLAINT',
    entityId: id,
    details: `Deleted complaint/inquiry ticket: "${id}" from ${existing.name} (${existing.company_name || 'Individual'})`,
  });
}


// ----------------------------------------------------------------------------
// Quotation Requests Operations (MySQL-First)
// ----------------------------------------------------------------------------
export async function getQuotes(): Promise<QuoteRecord[]> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database unavailable: ${connCheck.error}`);
  }

  const rows = await query<any>(
    'SELECT * FROM cms_quotes ORDER BY submitted_at DESC'
  );

  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    companyName: r.company_name,
    city: r.city,
    projectTimeline: r.project_timeline,
    notes: r.notes || '',
    items: parseJsonField<any[]>(r.items, []),
    status: r.status || 'Pending',
    submittedAt: r.submitted_at ? new Date(r.submitted_at).toISOString() : new Date().toISOString(),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
  }));
}

export async function recordQuote(data: {
  rfqReference: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  city: string;
  projectTimeline: string;
  notes?: string;
  items: any[];
}): Promise<QuoteRecord> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const now = new Date().toISOString();

  await execute(
    `INSERT INTO cms_quotes (id, name, email, phone, company_name, city, project_timeline, notes, items, status, submitted_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW(), NOW())`,
    [
      data.rfqReference,
      data.name.trim(),
      data.email.trim(),
      data.phone.trim(),
      data.companyName.trim(),
      data.city.trim(),
      data.projectTimeline.trim(),
      data.notes?.trim() || '',
      JSON.stringify(data.items || []),
    ]
  );

  return {
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
}

export async function updateQuoteStatus(
  id: string,
  status: string,
  notes?: string,
  user = 'admin'
): Promise<QuoteRecord> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const [existing] = await query<any>('SELECT * FROM cms_quotes WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Quotation request "${id}" not found.`);
  }

  const finalNotes = notes !== undefined ? notes : existing.notes;
  await execute(
    'UPDATE cms_quotes SET status = ?, notes = ?, updated_at = NOW() WHERE id = ?',
    [status, finalNotes || '', id]
  );

  await logAudit({
    user,
    action: 'STATUS_CHANGE',
    entity: 'QUOTE',
    entityId: id,
    details: `Updated RFQ status to: "${status}"${notes ? ` with notes: "${notes}"` : ''}`,
  });

  const [refetched] = await query<any>('SELECT * FROM cms_quotes WHERE id = ?', [id]);
  return {
    id: refetched.id,
    name: refetched.name,
    email: refetched.email,
    phone: refetched.phone,
    companyName: refetched.company_name,
    city: refetched.city,
    projectTimeline: refetched.project_timeline,
    notes: refetched.notes || '',
    items: parseJsonField<any[]>(refetched.items, []),
    status: refetched.status || 'Pending',
    submittedAt: refetched.submitted_at ? new Date(refetched.submitted_at).toISOString() : new Date().toISOString(),
    updatedAt: refetched.updated_at ? new Date(refetched.updated_at).toISOString() : new Date().toISOString(),
  };
}

export async function deleteQuote(id: string, user = 'admin'): Promise<void> {
  const connCheck = await checkMysqlConnection();
  if (!connCheck.connected) {
    throw new Error(`MySQL database is unavailable: ${connCheck.error || 'Connection failed'}`);
  }

  const [existing] = await query<any>('SELECT * FROM cms_quotes WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Quotation request "${id}" not found.`);
  }

  await execute('DELETE FROM cms_quotes WHERE id = ?', [id]);

  await logAudit({
    user,
    action: 'DELETE',
    entity: 'QUOTE',
    entityId: id,
    details: `Deleted quotation request: "${id}" for company "${existing.company_name}"`,
  });
}


// ----------------------------------------------------------------------------
// Dashboard Stats Computation (MySQL-First)
// ----------------------------------------------------------------------------
export async function getDashboardStats() {
  const catalog = await getCatalog();
  const complaints = await getComplaints();
  const quotes = await getQuotes();
  let careers: any[] = [];
  try {
    const { getCareerApplications } = await import('./cmsStore.ts');
    careers = await getCareerApplications();
  } catch {
    careers = [];
  }
  const auditLogs = await getAuditLogs();

  const totalProducts = catalog.products.length;
  const activeProducts = catalog.products.filter((p) => p.status !== 'inactive').length;
  const inactiveProducts = catalog.products.filter((p) => p.status === 'inactive').length;
  const totalCatalogItems = catalog.catalogItems.length;
  const totalBrands = catalog.brands.length;

  const inquiriesList = complaints.filter(
    (c) => c.type === 'Contact Enquiry' || (!c.type && !c.message?.toLowerCase().includes('complaint'))
  );
  const actualComplaintsList = complaints.filter(
    (c) => c.type === 'Complaint' || (c.type !== 'Contact Enquiry' && c.message?.toLowerCase().includes('complaint'))
  );

  const totalInquiries = inquiriesList.length;
  const newInquiries = inquiriesList.filter((c) => c.status === 'New').length;

  const totalComplaints = actualComplaintsList.length;
  const openComplaints = actualComplaintsList.filter((c) => c.status !== 'Resolved').length;

  const pendingQuotes = quotes.filter((q) => q.status === 'Pending').length;
  const totalQuotes = quotes.length;

  const totalCareers = careers.length;
  const newCareers = careers.filter((c) => c.status === 'New' || !c.status).length;

  const recentAudit = auditLogs.slice(0, 6);

  const recentComplaints = complaints.slice(0, 5).map((c) => ({
    type: 'complaint' as const,
    id: c.id,
    title: `${c.type || 'Inquiry'}: ${c.name} (${c.companyName || 'Individual'})`,
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
    inactiveProducts,
    totalCatalogItems,
    totalBrands,
    totalInquiries,
    newInquiries,
    totalComplaints,
    openComplaints,
    newComplaints: complaints.filter((c) => c.status === 'New').length,
    inProgressComplaints: complaints.filter((c) => c.status === 'In Progress').length,
    resolvedComplaints: complaints.filter((c) => c.status === 'Resolved').length,
    pendingQuotes,
    totalQuotes,
    totalCareers,
    newCareers,
    recentActivity,
    recentAudit,
  };
}

// ----------------------------------------------------------------------------
// Manual Backup Utility
// ----------------------------------------------------------------------------
export async function createCatalogBackup(reason = 'manual'): Promise<string> {
  ensureBackupDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `mysql_catalog_${reason}_${timestamp}.json`;
  const backupPath = path.join(BACKUP_DIR, backupName);

  const catalog = await getCatalog();
  fs.writeFileSync(backupPath, JSON.stringify(catalog, null, 2), 'utf-8');
  return backupPath;
}
