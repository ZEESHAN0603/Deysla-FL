import React, { useState, useEffect } from 'react';
import { Upload, Search, Check, AlertCircle, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface ExistingImage {
  path: string;
  name: string;
  folder: string;
  size: number;
}

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  onSelectImage: (imagePath: string) => void;
  title?: string;
}

export function ImagePickerModal({
  isOpen,
  onClose,
  currentImage = '',
  onSelectImage,
  title = 'Select or Upload Image',
}: ImagePickerModalProps) {
  const { authHeaders } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'custom' | 'upload'>('browse');
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [loadingImages, setLoadingImages] = useState(false);

  // Custom path state
  const [customPath, setCustomPath] = useState(currentImage);
  const [validationStatus, setValidationStatus] = useState<{
    checked: boolean;
    valid: boolean;
    message: string;
  }>({ checked: false, valid: false, message: '' });
  const [validating, setValidating] = useState(false);

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [preferredName, setPreferredName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCustomPath(currentImage);
      loadExistingImages();
    }
  }, [isOpen, currentImage]);

  const loadExistingImages = async () => {
    try {
      setLoadingImages(true);
      const res = await fetch('/api/admin/existing-images', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.images)) {
          setExistingImages(data.images);
        }
      }
    } catch (err) {
      console.error('Failed to load existing images:', err);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleValidateCustomPath = async (pathToValidate: string) => {
    if (!pathToValidate.trim()) return;
    try {
      setValidating(true);
      const res = await fetch('/api/admin/validate-image-path', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath: pathToValidate.trim() }),
      });
      const data = await res.json();
      setValidationStatus({
        checked: true,
        valid: !!data.valid && !!data.exists,
        message: data.message || '',
      });
    } catch (err: any) {
      setValidationStatus({
        checked: true,
        valid: false,
        message: err?.message || 'Validation request failed',
      });
    } finally {
      setValidating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds the 5MB maximum limit.');
      return;
    }

    setUploadFile(file);
    setUploadError(null);
    if (!preferredName) {
      setPreferredName(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async () => {
    if (!uploadPreview) return;
    try {
      setUploading(true);
      setUploadError(null);

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: uploadPreview,
          preferredName: preferredName.trim() || 'product-asset',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.url) {
        onSelectImage(data.url);
        onClose();
      } else {
        setUploadError(data.error || 'Failed to upload image.');
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Network error during upload.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const filteredImages = existingImages.filter((img) => {
    const matchesSearch =
      img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || img.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
              <p className="text-xs text-slate-500">
                Current image: <span className="font-mono text-slate-700 font-medium">{currentImage || 'None'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'browse'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Browse Verified Assets ({existingImages.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'custom'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Enter / Verify Asset Path
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'upload'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload New Image
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {/* TAB 1: BROWSE EXISTING */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by file name or path (e.g. cisco, switch, pbx)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition"
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {['all', 'products', 'catalog', 'uploads', 'brands'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFolder(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs capitalize whitespace-nowrap transition ${
                        selectedFolder === f
                          ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {loadingImages ? (
                <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                  <span className="text-xs">Scanning verified asset directories...</span>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  <p className="text-xs">No matching images found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredImages.map((img) => {
                    const isSelected = currentImage === img.path;
                    return (
                      <button
                        key={img.path}
                        type="button"
                        onClick={() => {
                          onSelectImage(img.path);
                          onClose();
                        }}
                        className={`group relative text-left border rounded-xl overflow-hidden p-2 transition flex flex-col justify-between ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/30'
                            : 'border-slate-200 bg-white hover:border-orange-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="w-full aspect-square bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center overflow-hidden mb-2 relative">
                          <img
                            src={img.path}
                            alt={img.name}
                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-full p-0.5 shadow-sm">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="w-full">
                          <p className="text-[11px] font-medium text-slate-800 truncate" title={img.name}>
                            {img.name}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                            <span className="capitalize">{img.folder}</span>
                            <span>{Math.round(img.size / 1024)} KB</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CUSTOM PATH */}
          {activeTab === 'custom' && (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Static Asset Web Path
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPath}
                    onChange={(e) => {
                      setCustomPath(e.target.value);
                      setValidationStatus({ checked: false, valid: false, message: '' });
                    }}
                    placeholder="/assets/products/example.webp"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => handleValidateCustomPath(customPath)}
                    disabled={validating || !customPath.trim()}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    {validating && <Loader2 className="w-3 h-3 animate-spin text-orange-500" />}
                    Verify Path
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Paths must resolve inside public/assets directory (e.g., /assets/products/network-switches.webp).
                </p>
              </div>

              {validationStatus.checked && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    validationStatus.valid
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {validationStatus.valid ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">{validationStatus.valid ? 'Verified' : 'Invalid Path'}</p>
                    <p className="text-[11px] opacity-90">{validationStatus.message}</p>
                  </div>
                </div>
              )}

              {/* Preview image */}
              {customPath && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2 font-semibold">
                    Live Path Preview
                  </span>
                  <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                    <img
                      src={customPath}
                      alt="Preview"
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectImage(customPath.trim());
                    onClose();
                  }}
                  disabled={!customPath.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold rounded-xl text-xs transition disabled:opacity-50 shadow-md shadow-orange-500/20"
                >
                  Use This Image Path
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: UPLOAD NEW */}
          {activeTab === 'upload' && (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Select Image File (Max 5MB)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-orange-400 bg-slate-50/60 rounded-2xl p-6 text-center cursor-pointer transition relative">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Click or drag file here to upload</p>
                      <p className="text-[11px] text-slate-500">Supports PNG, JPG, WebP, SVG (Server converts to optimized WebP)</p>
                    </div>
                  </div>
                </div>
              </div>

              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadPreview && (
                <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                      <img src={uploadPreview} alt="Upload preview" className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Asset Name Prefix (Optional)
                      </label>
                      <input
                        type="text"
                        value={preferredName}
                        onChange={(e) => setPreferredName(e.target.value)}
                        placeholder="e.g. cisco-switch-c9300"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        File will be saved to persistent storage at /assets/uploads/{preferredName || 'prod-upload'}-*.webp
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleUploadSubmit}
                    disabled={uploading}
                    className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-orange-500/20"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Validating and Storing Image...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload & Select Image</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
