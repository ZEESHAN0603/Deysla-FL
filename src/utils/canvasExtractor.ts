import { PRODUCT_CROP_REGIONS, SERVICE_CROP_REGIONS, CropRegion } from "./posterGrid";

const STORAGE_KEY = "deysla_extracted_images_v1";

export interface ExtractedCatalog {
  products: Record<string, string>;
  services: Record<string, string>;
  masterPoster?: string;
  timestamp: number;
}

/**
 * Load cached extracted images from localStorage
 */
export function loadCachedExtractedImages(): ExtractedCatalog | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load cached extracted images:", err);
    return null;
  }
}

/**
 * Save extracted images to localStorage
 */
export function saveExtractedImages(catalog: ExtractedCatalog): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
    window.dispatchEvent(new CustomEvent("deysla:images-updated", { detail: catalog }));
  } catch (err) {
    console.warn("Could not save to localStorage (quota exceeded or private mode):", err);
  }
}

/**
 * Crop a single region from an image into a high-res PNG data URL
 */
function cropRegionToDataUrl(
  img: HTMLImageElement,
  region: CropRegion,
  targetWidth = 400
): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const naturalW = img.naturalWidth || img.width;
  const naturalH = img.naturalHeight || img.height;

  const sx = Math.max(0, Math.floor(region.x * naturalW));
  const sy = Math.max(0, Math.floor(region.y * naturalH));
  const sWidth = Math.min(naturalW - sx, Math.floor(region.width * naturalW));
  const sHeight = Math.min(naturalH - sy, Math.floor(region.height * naturalH));

  const aspectRatio = sWidth / Math.max(1, sHeight);
  canvas.width = targetWidth;
  canvas.height = Math.round(targetWidth / aspectRatio);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Draw crisp cropped sub-image
  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/png", 0.92);
}

/**
 * Extract all product and service images from an HTMLImageElement
 */
export async function extractAllFromImageElement(
  img: HTMLImageElement,
  masterDataUrl?: string
): Promise<ExtractedCatalog> {
  const products: Record<string, string> = {};
  const services: Record<string, string> = {};

  // Extract products
  for (const [id, region] of Object.entries(PRODUCT_CROP_REGIONS)) {
    try {
      const dataUrl = cropRegionToDataUrl(img, region, 500);
      if (dataUrl) products[id] = dataUrl;
    } catch (e) {
      console.error(`Failed to crop product ${id}:`, e);
    }
  }

  // Extract services
  for (const [id, region] of Object.entries(SERVICE_CROP_REGIONS)) {
    try {
      const dataUrl = cropRegionToDataUrl(img, region, 600);
      if (dataUrl) services[id] = dataUrl;
    } catch (e) {
      console.error(`Failed to crop service ${id}:`, e);
    }
  }

  const catalog: ExtractedCatalog = {
    products,
    services,
    masterPoster: masterDataUrl,
    timestamp: Date.now(),
  };

  saveExtractedImages(catalog);
  return catalog;
}

/**
 * Load an image from File or Blob or URL and extract all images
 */
export function extractFromBlob(fileOrBlob: Blob | File): Promise<ExtractedCatalog> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = async () => {
        try {
          const catalog = await extractAllFromImageElement(img, dataUrl);
          resolve(catalog);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = reject;
      img.src = dataUrl;
    };
    reader.onerror = reject;
    reader.readAsDataURL(fileOrBlob);
  });
}
