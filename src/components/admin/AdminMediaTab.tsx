import React, { useState, useEffect, useMemo } from 'react';
import {
  Upload,
  Search,
  ImageIcon,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  Folder,
  Loader2,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ImagePickerModal } from './ImagePickerModal';

interface ExistingImage {
  path: string;
  name: string;
  folder: string;
  size: number;
}

export function AdminMediaTab() {
  const { authHeaders } = useAdminAuth();
  const [images, setImages] = useState<ExistingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/existing-images', { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.images)) {
        setImages(data.images);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to scan asset library.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleCopyPath = (p: string) => {
    navigator.clipboard.writeText(p);
    setCopiedPath(p);
    setTimeout(() => setCopiedPath(null), 2500);
  };

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        img.name.toLowerCase().includes(q) || img.path.toLowerCase().includes(q);
      const matchesFolder = selectedFolder === 'all' || img.folder === selectedFolder;
      return matchesSearch && matchesFolder;
    });
  }, [images, searchQuery, selectedFolder]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Media Assets & Image Library</h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredImages.length} of {images.length} Assets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse existing verified hardware photos and brand logos. Upload new high-resolution equipment images stored persistently in /assets/uploads/.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchImages}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-orange-500/15 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Image</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename or asset path..."
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {['all', 'products', 'catalog', 'uploads', 'brands'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1.5 rounded-xl text-xs capitalize transition cursor-pointer font-medium ${
                selectedFolder === f
                  ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-orange-500" />
          <p className="text-xs">Scanning storage for images...</p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="py-20 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-white">
          <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-xs">No media files found matching filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredImages.map((img) => {
            const isCopied = copiedPath === img.path;

            return (
              <div
                key={img.path}
                className="group bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md rounded-2xl p-3 flex flex-col justify-between transition overflow-hidden shadow-xs"
              >
                <div className="w-full aspect-square bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden mb-2 relative">
                  <img
                    src={img.path}
                    alt={img.name}
                    className="max-h-full max-w-full object-contain p-2 group-hover:scale-105 transition"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute top-1.5 left-1.5 text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-900/80 text-white font-mono">
                    {img.folder}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-900 truncate" title={img.name}>
                    {img.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5" title={img.path}>
                    {img.path}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>{Math.round(img.size / 1024)} KB</span>
                    <button
                      type="button"
                      onClick={() => handleCopyPath(img.path)}
                      className="text-slate-500 hover:text-orange-600 flex items-center gap-1 transition cursor-pointer"
                      title="Copy asset path to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* Upload Modal */}
      <ImagePickerModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          fetchImages();
        }}
        onSelectImage={() => {
          setIsUploadModalOpen(false);
          fetchImages();
        }}
        title="Upload Image Asset to Persistent Storage"
      />
    </div>
  );
}
