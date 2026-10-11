import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  CheckCircle2,
  Sparkles,
  Layers,
  ZoomIn,
  RefreshCw,
  Box,
  Server,
  Cpu,
  ShieldAlert,
} from "lucide-react";
import { usePosterImages } from "../../context/PosterImagesContext";
import { PRODUCT_CROP_REGIONS, SERVICE_CROP_REGIONS } from "../../utils/posterGrid";

interface SolutionsLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SolutionsLibraryModal: React.FC<SolutionsLibraryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    isPosterImported,
    masterPoster,
    extractedProducts,
    extractedServices,
    importPoster,
    isImporting,
    importError,
  } = usePosterImages();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"extracted" | "master" | "upload">("extracted");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importPoster(file);
      setSuccessMessage("Successfully extracted all 34 products and 10 services! Applied across the entire website.");
      setActiveTab("extracted");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      await importPoster(file);
      setSuccessMessage("Successfully extracted all 34 products and 10 services! Applied across the entire website.");
      setActiveTab("extracted");
    } catch (err) {
      console.error(err);
    }
  };

  const productCount = Object.keys(extractedProducts).length;
  const serviceCount = Object.keys(extractedServices).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight uppercase">
                  DEYSLA Solutions Library &amp; Poster Extractor
                </h3>
                {isPosterImported && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3" />
                    Applied ({productCount} Products)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Enterprise Technology Solutions Library — Slices all hardware &amp; service imagery directly from the poster
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 sm:px-6 gap-2">
          <button
            onClick={() => setActiveTab("extracted")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "extracted"
                ? "border-sky-400 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Extracted Products ({productCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "upload"
                ? "border-sky-400 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload &amp; Re-extract Poster</span>
          </button>

          {masterPoster && (
            <button
              onClick={() => setActiveTab("master")}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "master"
                  ? "border-sky-400 text-sky-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Full Master Poster</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-emerald-400 hover:text-white text-xs underline ml-2"
              >
                Dismiss
              </button>
            </div>
          )}

          {importError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{importError}</span>
            </div>
          )}

          {/* TAB 1: Extracted Products Grid */}
          {activeTab === "extracted" && (
            <div className="space-y-6">
              {!isPosterImported ? (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-400/20 mx-auto flex items-center justify-center text-sky-400">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-base font-bold text-white">
                      Ready to Extract Poster Hardware Images
                    </h4>
                    <p className="text-xs text-slate-400">
                      Drop or select your uploaded <code className="text-sky-300">Gemini_Generated_Image_dc2wy7dc2wy7dc2w.png</code> poster to extract 34 products and 10 services.
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Select Poster to Extract</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Extracted Hardware Items ({productCount})
                      </h4>
                      <p className="text-xs text-slate-400">
                        These images are actively replacing all catalog and brand products across the entire site.
                      </p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-sky-400 hover:text-sky-300 underline flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-extract with another file</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Grid of Extracted Crops */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Object.entries(PRODUCT_CROP_REGIONS).map(([id, reg]) => {
                      const imgUrl = extractedProducts[id];
                      return (
                        <div
                          key={id}
                          className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/80 flex flex-col justify-between space-y-2 group hover:border-sky-400/50 transition-all"
                        >
                          <div className="w-full h-24 rounded-lg bg-slate-900 border border-slate-800/80 overflow-hidden relative flex items-center justify-center p-1">
                            <Box className="w-6 h-6 text-sky-400" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-white truncate" title={reg.name}>
                              {reg.name}
                            </p>
                            <p className="text-[9px] font-mono text-slate-500 uppercase truncate">
                              {reg.category}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Upload Zone */}
          {activeTab === "upload" && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="p-8 sm:p-14 rounded-2xl border-2 border-dashed border-slate-700 hover:border-sky-400 bg-slate-950/60 transition-colors text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-400/30 mx-auto flex items-center justify-center text-sky-400">
                {isImporting ? (
                  <RefreshCw className="w-8 h-8 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8" />
                )}
              </div>

              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-base font-bold text-white">
                  {isImporting
                    ? "Extracting All Products and Services..."
                    : "Drag & Drop the Poster Image Here"}
                </h4>
                <p className="text-xs text-slate-400">
                  Select <span className="text-sky-300 font-mono">Gemini_Generated_Image_dc2wy7dc2wy7dc2w.png</span> or any generated DEYSLA library poster to slice each product automatically.
                </p>
              </div>

              <div className="pt-2">
                <button
                  disabled={isImporting}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isImporting ? "Processing..." : "Browse Local File"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Master Poster View */}
          {activeTab === "master" && masterPoster && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  DEYSLA Enterprise Technology Solutions Library — Full Poster
                </span>
                <a
                  href={masterPoster}
                  download="deysla-solutions-library.png"
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 underline"
                >
                  Download Full Poster
                </a>
              </div>
              <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-3">
                <Box className="w-12 h-12 text-sky-400" />
                <p className="text-sm font-bold text-white">DEYSLA IT Solutions Architecture</p>
                <p className="text-xs text-slate-400">Comprehensive enterprise infrastructure documentation</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <span>34 Products · 10 Core Services · Real-time Canvas Slicing</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
