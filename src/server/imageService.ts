import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'assets', 'uploads');

export function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export interface ExistingImageInfo {
  path: string;
  name: string;
  folder: string;
  size: number;
}

export function listExistingImages(): ExistingImageInfo[] {
  const folders = [
    { name: 'uploads', dir: path.join(PUBLIC_DIR, 'assets', 'uploads'), prefix: '/assets/uploads/' },
    { name: 'products', dir: path.join(PUBLIC_DIR, 'assets', 'products'), prefix: '/assets/products/' },
    { name: 'catalog', dir: path.join(PUBLIC_DIR, 'assets', 'catalog'), prefix: '/assets/catalog/' },
    { name: 'brands', dir: path.join(PUBLIC_DIR, 'assets', 'brands'), prefix: '/assets/brands/' },
  ];

  const results: ExistingImageInfo[] = [];

  for (const f of folders) {
    if (!fs.existsSync(f.dir)) continue;
    try {
      const files = fs.readdirSync(f.dir);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.webp', '.jpg', '.jpeg', '.svg'].includes(ext)) {
          const fullPath = path.join(f.dir, file);
          const stat = fs.statSync(fullPath);
          results.push({
            path: `${f.prefix}${file}`,
            name: file,
            folder: f.name,
            size: stat.size,
          });
        }
      }
    } catch (err) {
      console.error(`Failed to scan folder ${f.dir}:`, err);
    }
  }

  return results.sort((a, b) => a.path.localeCompare(b.path));
}

export function validateImagePath(requestedPath: string): { valid: boolean; exists: boolean; message: string } {
  if (!requestedPath || typeof requestedPath !== 'string') {
    return { valid: false, exists: false, message: 'Image path is empty.' };
  }

  const cleanPath = requestedPath.trim().replace(/^\//, '');
  const absolutePath = path.resolve(PUBLIC_DIR, cleanPath);

  // Security check: ensure path is inside PUBLIC_DIR
  if (!absolutePath.startsWith(PUBLIC_DIR)) {
    return { valid: false, exists: false, message: 'Invalid path. Path traversal detected.' };
  }

  const ext = path.extname(absolutePath).toLowerCase();
  if (!['.png', '.webp', '.jpg', '.jpeg', '.svg'].includes(ext)) {
    return { valid: false, exists: false, message: 'Path must point to a valid image file (.png, .webp, .jpg, .jpeg, .svg).' };
  }

  const exists = fs.existsSync(absolutePath);
  if (!exists) {
    return { valid: false, exists: false, message: `File does not exist on server at "${requestedPath}".` };
  }

  return { valid: true, exists: true, message: 'Image file is verified and exists.' };
}

export async function processAndSaveImageUpload(
  imageBase64: string,
  preferredName?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    ensureUploadsDir();

    // 1. Sanitize base64
    const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z+.-]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // 2. Validate max file size (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (buffer.length > MAX_SIZE) {
      return { success: false, error: 'File size exceeds maximum allowed limit of 5MB.' };
    }

    if (buffer.length < 10) {
      return { success: false, error: 'Image buffer too small or corrupted.' };
    }

    // 3. Validate image using sharp
    let metadata: any;
    try {
      metadata = await sharp(buffer).metadata();
      if (!metadata.format) {
        return { success: false, error: 'Invalid image format.' };
      }
    } catch (sharpErr: any) {
      return { success: false, error: `Invalid image content: ${sharpErr?.message || 'Unrecognized format'}` };
    }

    // 4. Generate unique, clean filename
    const cleanPrefix = preferredName
      ? preferredName.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').slice(0, 40)
      : 'prod-upload';

    const timestamp = Date.now();
    const filename = `${cleanPrefix}-${timestamp}.webp`;
    const targetFilePath = path.join(UPLOADS_DIR, filename);

    // 5. Convert to high-quality optimized WebP
    await sharp(buffer)
      .webp({ quality: 90, effort: 4 })
      .toFile(targetFilePath);

    const publicUrl = `/assets/uploads/${filename}`;
    return { success: true, url: publicUrl };
  } catch (err: any) {
    console.error('Error in processAndSaveImageUpload:', err);
    return { success: false, error: err?.message || 'Failed to process and store image upload.' };
  }
}
