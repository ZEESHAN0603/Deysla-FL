import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { PRODUCTS_DATA, ProductType } from '../data/products';
import { BRANDS_DATA, Brand } from '../data/brands';
import { CATALOG_ITEMS, CatalogItem } from '../data/productCatalogItems';
import { PRODUCT_CATEGORIES, ProductCategory } from '../data/productCategories';
import { BRAND_EQUIPMENT_ITEMS, BrandProductItem } from '../data/brandProducts';

export interface CatalogContextType {
  products: ProductType[];
  catalogItems: CatalogItem[];
  brands: Brand[];
  categories: ProductCategory[];
  brandEquipmentItems: BrandProductItem[];
  isLoading: boolean;
  error: string | null;
  refreshCatalog: () => Promise<void>;
  // Helpers
  getProduct: (idOrSlug: string) => ProductType | undefined;
  getBrand: (idOrSlug: string) => Brand | undefined;
  getCatalogItemsByCategory: (categoryId: string) => CatalogItem[];
  getCatalogItemsBySubcategory: (subcategoryId: string) => CatalogItem[];
  getBrandsByCategoryId: (categoryId: string) => Brand[];
  getBrandsByProductId: (productId: string) => Brand[];
  getProductsByBrandId: (brandId: string) => ProductType[];
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
      const res = await fetch('/api/catalog');
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

  const getProduct = useCallback(
    (idOrSlug: string) => {
      return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    },
    [products]
  );

  const getBrand = useCallback(
    (idOrSlug: string) => {
      return brands.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
    },
    [brands]
  );

  const getCatalogItemsByCategory = useCallback(
    (categoryId: string) => {
      return catalogItems.filter((i) => i.categoryId === categoryId);
    },
    [catalogItems]
  );

  const getCatalogItemsBySubcategory = useCallback(
    (subcategoryId: string) => {
      return catalogItems.filter((i) => i.subcategoryId === subcategoryId);
    },
    [catalogItems]
  );

  const getBrandsByCategoryId = useCallback(
    (categoryId: string) => {
      return brands.filter((b) => b.categoryIds.includes(categoryId));
    },
    [brands]
  );

  const getBrandsByProductId = useCallback(
    (productId: string) => {
      const prod = products.find((p) => p.id === productId || p.slug === productId);
      if (!prod) return [];
      return brands.filter((b) => prod.brandIds.includes(b.id));
    },
    [products, brands]
  );

  const getProductsByBrandId = useCallback(
    (brandId: string) => {
      const brand = brands.find((b) => b.id === brandId || b.slug === brandId);
      if (!brand) return [];
      return products.filter((p) => brand.productIds.includes(p.id));
    },
    [brands, products]
  );

  const value = useMemo<CatalogContextType>(
    () => ({
      products,
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
