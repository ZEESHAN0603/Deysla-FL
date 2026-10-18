import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { execute, checkMysqlConnection } from './db/mysql.ts';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

export function getUploadsDir(): string {
  if (process.env.UPLOADS_DIR && process.env.UPLOADS_DIR.trim() !== '') {
    return path.resolve(process.env.UPLOADS_DIR.trim());
  }
  return path.resolve(process.cwd(), 'data', 'uploads');
}

export function getLegacyUploadsDir(): string {
  return path.resolve(PUBLIC_DIR, 'assets', 'uploads');
}

export function ensureUploadsDir(): string {
  const uploadsDir = getUploadsDir();
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Preserve and sync existing legacy uploaded files to persistent storage
  const legacyDir = getLegacyUploadsDir();
  if (!fs.existsSync(legacyDir)) {
    try {
      fs.mkdirSync(legacyDir, { recursive: true });
    } catch {}
  }

  if (legacyDir !== uploadsDir) {
    // 1. Sync legacyDir -> uploadsDir
    if (fs.existsSync(legacyDir)) {
      try {
        const files = fs.readdirSync(legacyDir);
        for (const file of files) {
          const srcPath = path.join(legacyDir, file);
          const destPath = path.join(uploadsDir, file);
          if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile() && !fs.existsSync(destPath)) {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      } catch (syncErr) {
        console.warn('[DEYSLA ImageService] Note syncing legacy upload files:', syncErr);
      }
    }

    // 2. Sync uploadsDir -> legacyDir (ensures dev static servers find images everywhere)
    if (fs.existsSync(uploadsDir) && fs.existsSync(legacyDir)) {
      try {
        const files = fs.readdirSync(uploadsDir);
        for (const file of files) {
          const srcPath = path.join(uploadsDir, file);
          const destPath = path.join(legacyDir, file);
          if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile() && !fs.existsSync(destPath)) {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      } catch (syncErr) {
        console.warn('[DEYSLA ImageService] Note syncing persistent to legacy files:', syncErr);
      }
    }
  }

  return uploadsDir;
}

export interface ExistingImageInfo {
  path: string;
  name: string;
  folder: string;
  size: number;
}

export function listExistingImages(): ExistingImageInfo[] {
  const uploadsDir = ensureUploadsDir();
  const legacyDir = getLegacyUploadsDir();

  const folders = [
    { name: 'uploads', dir: uploadsDir, prefix: '/uploads/' },
    { name: 'legacy-uploads', dir: legacyDir, prefix: '/assets/uploads/' },
    { name: 'products', dir: path.join(PUBLIC_DIR, 'assets', 'products'), prefix: '/assets/products/' },
    { name: 'catalog', dir: path.join(PUBLIC_DIR, 'assets', 'catalog'), prefix: '/assets/catalog/' },
    { name: 'brands', dir: path.join(PUBLIC_DIR, 'assets', 'brands'), prefix: '/assets/brands/' },
  ];

  const results: ExistingImageInfo[] = [];
  const seenPaths = new Set<string>();

  for (const f of folders) {
    if (!fs.existsSync(f.dir)) continue;
    try {
      const files = fs.readdirSync(f.dir);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.webp', '.jpg', '.jpeg', '.svg', '.gif'].includes(ext)) {
          const fullPath = path.join(f.dir, file);
          const stat = fs.statSync(fullPath);
          const webPath = `${f.prefix}${file}`;

          if (!seenPaths.has(webPath)) {
            seenPaths.add(webPath);
            results.push({
              path: webPath,
              name: file,
              folder: f.name === 'legacy-uploads' ? 'uploads' : f.name,
              size: stat.size,
            });
          }
        }
      }
    } catch (err) {
      console.error(`Failed to scan folder ${f.dir}:`, err);
    }
  }

  return results.sort((a, b) => a.path.localeCompare(b.path));
}

export function validateImagePath(requestedPath: string): { valid: boolean; exists: boolean; message: string; resolvedPath?: string } {
  if (!requestedPath || typeof requestedPath !== 'string') {
    return { valid: false, exists: false, message: 'Image path is empty.' };
  }

  const cleanPath = requestedPath.trim();
  const uploadsDir = ensureUploadsDir();
  const legacyDir = getLegacyUploadsDir();

  // Allowed target paths check
  let targetAbsolutePath: string | null = null;

  if (cleanPath.startsWith('/uploads/')) {
    const filename = cleanPath.replace(/^\/uploads\//, '');
    targetAbsolutePath = path.resolve(uploadsDir, filename);
    if (!targetAbsolutePath.startsWith(uploadsDir)) {
      return { valid: false, exists: false, message: 'Path traversal detected in upload path.' };
    }
  } else if (cleanPath.startsWith('/assets/uploads/')) {
    const filename = cleanPath.replace(/^\/assets\/uploads\//, '');
    // Check uploadsDir first, then legacyDir
    const candidateUploads = path.resolve(uploadsDir, filename);
    const candidateLegacy = path.resolve(legacyDir, filename);
    if (fs.existsSync(candidateUploads)) {
      targetAbsolutePath = candidateUploads;
    } else {
      targetAbsolutePath = candidateLegacy;
    }
    if (!targetAbsolutePath.startsWith(uploadsDir) && !targetAbsolutePath.startsWith(legacyDir)) {
      return { valid: false, exists: false, message: 'Path traversal detected.' };
    }
  } else if (cleanPath.startsWith('/assets/')) {
    const relativePart = cleanPath.replace(/^\//, '');
    targetAbsolutePath = path.resolve(PUBLIC_DIR, relativePart);
    if (!targetAbsolutePath.startsWith(PUBLIC_DIR)) {
      return { valid: false, exists: false, message: 'Path traversal detected.' };
    }
  } else {
    // Relative or direct file path inside uploads or public
    const candidateUploads = path.resolve(uploadsDir, cleanPath.replace(/^\//, ''));
    const candidatePublic = path.resolve(PUBLIC_DIR, cleanPath.replace(/^\//, ''));
    if (candidateUploads.startsWith(uploadsDir) && fs.existsSync(candidateUploads)) {
      targetAbsolutePath = candidateUploads;
    } else if (candidatePublic.startsWith(PUBLIC_DIR)) {
      targetAbsolutePath = candidatePublic;
    } else {
      return { valid: false, exists: false, message: 'Path must point to /uploads/ or /assets/.' };
    }
  }

  const ext = path.extname(targetAbsolutePath).toLowerCase();
  if (!['.png', '.webp', '.jpg', '.jpeg', '.svg', '.gif'].includes(ext)) {
    return { valid: false, exists: false, message: 'Path must point to a valid image file (.png, .webp, .jpg, .jpeg, .svg, .gif).' };
  }

  const exists = fs.existsSync(targetAbsolutePath);
  if (!exists) {
    return { valid: false, exists: false, message: `File does not exist on server at "${requestedPath}".` };
  }

  return { valid: true, exists: true, message: 'Image file is verified and exists on storage.', resolvedPath: targetAbsolutePath };
}

export async function processAndSaveImageUpload(
  imageBase64: string,
  preferredName?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  let targetFilePath: string | null = null;
  let filename: string | null = null;
  try {
    const uploadsDir = ensureUploadsDir();

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
        return { success: false, error: 'Invalid or unsupported image format.' };
      }
    } catch (sharpErr: any) {
      return { success: false, error: `Invalid image content: ${sharpErr?.message || 'Unrecognized format'}` };
    }

    // 4. Generate unique, collision-resistant filename
    const cleanPrefix = preferredName
      ? preferredName.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
      : 'upload';

    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(4).toString('hex');
    filename = `${cleanPrefix || 'upload'}-${timestamp}-${randomHex}.webp`;
    targetFilePath = path.join(uploadsDir, filename);

    // 5. Convert to high-quality optimized WebP
    await sharp(buffer)
      .webp({ quality: 90, effort: 4 })
      .toFile(targetFilePath);

    const stat = fs.statSync(targetFilePath);
    const publicUrl = `/uploads/${filename}`;

    // Also mirror to legacy uploads directory if present and different
    const legacyDir = getLegacyUploadsDir();
    if (legacyDir !== uploadsDir && fs.existsSync(legacyDir)) {
      try {
        fs.copyFileSync(targetFilePath, path.join(legacyDir, filename));
      } catch (copyErr) {
        console.warn('[DEYSLA ImageService] Note mirroring to legacy uploads:', copyErr);
      }
    }

    // 6. Record upload in MySQL cms_media table
    const connCheck = await checkMysqlConnection();
    if (connCheck.connected) {
      try {
        const mediaId = `media-${timestamp}-${randomHex}`;
        await execute(
          `INSERT INTO cms_media (id, filename, public_url, folder, size_bytes, mime_type, uploaded_at)
           VALUES (?, ?, ?, 'uploads', ?, 'image/webp', NOW())`,
          [mediaId, filename, publicUrl, stat.size]
        );
      } catch (dbErr: any) {
        // Rollback saved file if database logging fails
        if (targetFilePath && fs.existsSync(targetFilePath)) {
          fs.unlinkSync(targetFilePath);
        }
        if (legacyDir !== uploadsDir) {
          const legacyFile = path.join(legacyDir, filename);
          if (fs.existsSync(legacyFile)) {
            try { fs.unlinkSync(legacyFile); } catch {}
          }
        }
        return {
          success: false,
          error: `Database failure saving upload record: ${dbErr?.message || 'Database insert failed'}`
        };
      }
    }

    return { success: true, url: publicUrl };
  } catch (err: any) {
    if (targetFilePath && fs.existsSync(targetFilePath)) {
      try {
        fs.unlinkSync(targetFilePath);
      } catch {}
    }
    const legacyDir = getLegacyUploadsDir();
    if (legacyDir && filename) {
      const legacyFile = path.join(legacyDir, filename);
      if (fs.existsSync(legacyFile)) {
        try { fs.unlinkSync(legacyFile); } catch {}
      }
    }
    console.error('[DEYSLA ImageService] Error in processAndSaveImageUpload:', err);
    return { success: false, error: err?.message || 'Failed to process and store image upload.' };
  }
}

