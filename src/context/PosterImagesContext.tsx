import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loadCachedExtractedImages,
  extractFromBlob,
  ExtractedCatalog,
} from "../utils/canvasExtractor";

interface PosterImagesContextType {
  isPosterImported: boolean;
  masterPoster?: string;
  extractedProducts: Record<string, string>;
  extractedServices: Record<string, string>;
  getProductImage: (productId: string, fallbackUrl?: string) => string;
  getServiceImage: (serviceId: string, fallbackUrl?: string) => string;
  importPoster: (file: File | Blob) => Promise<ExtractedCatalog>;
  isImporting: boolean;
  importError: string | null;
}

const PosterImagesContext = createContext<PosterImagesContextType>({
  isPosterImported: false,
  extractedProducts: {},
  extractedServices: {},
  getProductImage: (_, fallback) => fallback || "",
  getServiceImage: (_, fallback) => fallback || "",
  importPoster: async () => ({ products: {}, services: {}, timestamp: 0 }),
  isImporting: false,
  importError: null,
});

export const PosterImagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [catalog, setCatalog] = useState<ExtractedCatalog | null>(() => loadCachedExtractedImages());
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Check if server already has extracted products on disk
  useEffect(() => {
    fetch("/api/extracted-status")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasMaster && !catalog?.masterPoster) {
          // If server has master, set masterPoster URL
          setCatalog((prev) => ({
            products: prev?.products || {},
            services: prev?.services || {},
            masterPoster: "/assets/deysla-solutions-library.png",
            timestamp: Date.now(),
          }));
        }
      })
      .catch(() => {});
  }, [catalog?.masterPoster]);

  const importPoster = async (file: File | Blob): Promise<ExtractedCatalog> => {
    setIsImporting(true);
    setImportError(null);
    try {
      // 1. Extract immediately in-browser using HTML5 Canvas
      const newCatalog = await extractFromBlob(file);
      setCatalog(newCatalog);

      // 2. Also send to server to write individual PNG files to /assets/products/ using sharp
      if (newCatalog.masterPoster) {
        fetch("/api/extract-poster", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: newCatalog.masterPoster }),
        }).catch((err) => {
          console.warn("Background server write failed (canvas cache is active):", err);
        });
      }

      setIsImporting(false);
      return newCatalog;
    } catch (err: any) {
      console.error("Poster import error:", err);
      setImportError(err.message || "Failed to process image");
      setIsImporting(false);
      throw err;
    }
  };

  const getProductImage = (productId: string, fallbackUrl?: string): string => {
    if (fallbackUrl) {
      return fallbackUrl;
    }
    // Directly use authentic realistic product hardware photo
    return `/assets/products/${productId}.webp`;
  };

  const getServiceImage = (serviceId: string, fallbackUrl?: string): string => {
    if (catalog?.services[serviceId]) {
      return catalog.services[serviceId];
    }
    return fallbackUrl || "/assets/Picture21.png";
  };

  return (
    <PosterImagesContext.Provider
      value={{
        isPosterImported: Boolean(catalog && Object.keys(catalog.products).length > 0),
        masterPoster: catalog?.masterPoster,
        extractedProducts: catalog?.products || {},
        extractedServices: catalog?.services || {},
        getProductImage,
        getServiceImage,
        importPoster,
        isImporting,
        importError,
      }}
    >
      {children}
    </PosterImagesContext.Provider>
  );
};

export const usePosterImages = () => useContext(PosterImagesContext);
