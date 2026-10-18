import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { PRODUCTS_DATA, ProductType } from '../data/products';
import { BRANDS_DATA, Brand } from '../data/brands';
import { CATALOG_ITEMS, CatalogItem } from '../data/productCatalogItems';
import { PRODUCT_CATEGORIES, ProductCategory } from '../data/productCategories';
import { BRAND_EQUIPMENT_ITEMS, BrandProductItem } from '../data/brandProducts';

export interface CatalogContextType {
  products: ProductType[];
  activeProducts: ProductType[];
  catalogItems: CatalogItem[];
  brands: Brand[];
  categories: ProductCategory[];
  brandEquipmentItems: BrandProductItem[];
  isLoading: boolean;
  error: string | null;
  refreshCatalog: () => Promise<void>;
  // Helpers
  getProduct: (idOrSlug: string, includeInactive?: boolean) => ProductType | undefined;
  getBrand: (idOrSlug: string, includeInactive?: boolean) => Brand | undefined;
  getCatalogItemsByCategory: (categoryId: string, includeInactive?: boolean) => CatalogItem[];
  getCatalogItemsBySubcategory: (subcategoryId: string, includeInactive?: boolean) => CatalogItem[];
  getBrandsByCategoryId: (categoryId: string, includeInactive?: boolean) => Brand[];
  getBrandsByProductId: (productId: string, includeInactive?: boolean) => Brand[];
  getProductsByBrandId: (brandId: string, includeInactive?: boolean) => ProductType[];
}

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ProductType[]>(PRODUCTS_DATA);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(CATALOG_ITEMS);
  const [brands, setBrands] = useState<Brand[]>(BRANDS_DATA);
  const [categories, setCategories] = useState<ProductCategory[]>(PRODUCT_CATEGORIES);
  const [brandEquipmentItems, setBrandEquipmentItems] = useState<BrandProductItem[]>(BRAND_EQUIPMENT_ITEMS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('deysla_admin_jwt') : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/catalog?includeInactive=true', {
        headers,
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
        if (Array.isArray(data.catalogItems) && data.catalogItems.length > 0) {
          setCatalogItems(data.catalogItems);
        }
        if (Array.isArray(data.brands) && data.brands.length > 0) {
          setBrands(data.brands);
        }
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
        if (Array.isArray(data.brandEquipmentItems) && data.brandEquipmentItems.length > 0) {
          setBrandEquipmentItems(data.brandEquipmentItems);
        }
      }
    } catch (err: any) {
      console.warn('[CatalogContext] Failed to load server catalog, using verified local seed:', err?.message);
      setError(err?.message || 'Failed to fetch catalog');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const activeProducts = useMemo(() => {
    return products.filter((p) => p.status !== 'inactive');
  }, [products]);

  const getProduct = useCallback(
    (idOrSlug: string, includeInactive: boolean = false) => {
      return products.find(
        (p) => (p.id === idOrSlug || p.slug === idOrSlug) && (includeInactive || p.status !== 'inactive')
      );
    },
    [products]
  );

  const getBrand = useCallback(
    (idOrSlug: string, includeInactive: boolean = false) => {
      return brands.find(
        (b) => (b.id === idOrSlug || b.slug === idOrSlug) && (includeInactive || b.status !== 'inactive')
      );
    },
    [brands]
  );

  const getCatalogItemsByCategory = useCallback(
    (categoryId: string, includeInactive: boolean = false) => {
      return catalogItems.filter(
        (i) => i.categoryId === categoryId && (includeInactive || i.status !== 'inactive')
      );
    },
    [catalogItems]
  );

  const getCatalogItemsBySubcategory = useCallback(
    (subcategoryId: string, includeInactive: boolean = false) => {
      return catalogItems.filter(
        (i) => i.subcategoryId === subcategoryId && (includeInactive || i.status !== 'inactive')
      );
    },
    [catalogItems]
  );

  const getBrandsByCategoryId = useCallback(
    (categoryId: string, includeInactive: boolean = false) => {
      return brands.filter(
        (b) => b.categoryIds.includes(categoryId) && (includeInactive || b.status !== 'inactive')
      );
    },
    [brands]
  );

  const getBrandsByProductId = useCallback(
    (productId: string, includeInactive: boolean = false) => {
      const prod = products.find((p) => p.id === productId || p.slug === productId);
      const targetId = prod?.id || productId;
      return brands.filter(
        (b) =>
          ((prod && Array.isArray(prod.brandIds) && prod.brandIds.includes(b.id)) ||
            (Array.isArray(b.productIds) && b.productIds.includes(targetId))) &&
          (includeInactive || b.status !== 'inactive')
      );
    },
    [products, brands]
  );

  const getProductsByBrandId = useCallback(
    (brandId: string, includeInactive: boolean = false) => {
      const brand = brands.find((b) => b.id === brandId || b.slug === brandId);
      const targetId = brand?.id || brandId;
      return products.filter(
        (p) =>
          ((brand && Array.isArray(brand.productIds) && brand.productIds.includes(p.id)) ||
            (Array.isArray(p.brandIds) && p.brandIds.includes(targetId))) &&
          (includeInactive || p.status !== 'inactive')
      );
    },
    [brands, products]
  );

  const value = useMemo<CatalogContextType>(
    () => ({
      products,
      activeProducts,
      catalogItems,
      brands,
      categories,
      brandEquipmentItems,
      isLoading,
      error,
      refreshCatalog: fetchCatalog,
      getProduct,
      getBrand,
      getCatalogItemsByCategory,
      getCatalogItemsBySubcategory,
      getBrandsByCategoryId,
      getBrandsByProductId,
      getProductsByBrandId,
    }),
    [
      products,
      activeProducts,
      catalogItems,
      brands,
      categories,
      brandEquipmentItems,
      isLoading,
      error,
      fetchCatalog,
      getProduct,
      getBrand,
      getCatalogItemsByCategory,
      getCatalogItemsBySubcategory,
      getBrandsByCategoryId,
      getBrandsByProductId,
      getProductsByBrandId,
    ]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextType {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
