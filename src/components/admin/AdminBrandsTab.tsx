import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Power,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  ImageIcon,
  RefreshCw,
  Loader2,
  ExternalLink,
  Award,
} from 'lucide-react';
import { Brand } from '../../data/brands';
import { useCatalog } from '../../context/CatalogContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ImagePickerModal } from './ImagePickerModal';

export function AdminBrandsTab() {
  const { brands, categories, products, refreshCatalog } = useCatalog();
  const { authHeaders } = useAdminAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingBrand, setEditingBrand] = useState<
    Partial<Brand> & { status?: 'active' | 'inactive' }
  >({});
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.origin && b.origin.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'all' || b.categoryIds.includes(selectedCategory);

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && (b as any).status !== 'inactive') ||
        (selectedStatus === 'inactive' && (b as any).status === 'inactive');

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [brands, searchQuery, selectedCategory, selectedStatus]);

  const handleToggleStatus = async (brand: Brand) => {
    try {
      const res = await fetch(
        `/api/admin/brands/${encodeURIComponent(brand.id)}/toggle-status`,
        { method: 'POST', headers: authHeaders() }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshCatalog();
        setSuccessBanner(`Brand "${brand.name}" status updated to ${data.brand.status}.`);
        setTimeout(() => setSuccessBanner(null), 4000);
      } else {
        alert(data.error || 'Failed to toggle brand status.');
      }
    } catch (err: any) {
      alert(err?.message || 'Network error.');
    }
  };

  const startEditBrand = (brand: Brand) => {
    setIsCreatingNew(false);
    setEditingBrand({
      ...brand,
      status: (brand as any).status || 'active',
      categoryIds: [...(brand.categoryIds || [])],
      productIds: [...(brand.productIds || [])],
    });
    setErrorMsg(null);
    setIsEditorOpen(true);
  };

  const startCreateBrand = () => {
    setIsCreatingNew(true);
    setEditingBrand({
      id: '',
      name: '',
      slug: '',
      logo: '/assets/brands/cisco-logo-0-2048x2048-1-1536x1536-1.png',
      origin: 'Global',
      description: '',
      website: '',
      categoryIds: [categories[0]?.id || 'networking'],
      productIds: [],
      status: 'active',
    });
    setErrorMsg(null);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand.name?.trim()) {
      setErrorMsg('Brand Name is required.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);

      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBrand),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await refreshCatalog();
        setIsEditorOpen(false);
        setSuccessBanner(`Brand "${data.brand.name}" successfully persisted.`);
        setTimeout(() => setSuccessBanner(null), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to save brand.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Tier-1 OEM Brand Partners</h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredBrands.length} of {brands.length} Brands
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain official hardware manufacturer alliances, corporate logos, and authorized domain mappings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshCatalog()}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={startCreateBrand}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-orange-500/15 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand Profile</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brand name, ID, or origin..."
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          >
            <option value="all">All Technology Domains ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Brands Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold tracking-wider uppercase text-[10px]">
                <th className="py-3.5 px-4 w-16 text-center">Status</th>
                <th className="py-3.5 px-4 w-20">Logo</th>
                <th className="py-3.5 px-4">Brand Name & ID</th>
                <th className="py-3.5 px-4">Origin</th>
                <th className="py-3.5 px-4">Categories</th>
                <th className="py-3.5 px-4 text-center">Linked Products</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    No brands matching query.
                  </td>
                </tr>
              ) : (
                filteredBrands.map((b) => {
                  const isInactive = (b as any).status === 'inactive';

                  return (
                    <tr
                      key={b.id}
                      className={`hover:bg-orange-50/30 transition group ${
                        isInactive ? 'opacity-60 bg-slate-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(b)}
                          className={`inline-flex items-center justify-center p-1.5 rounded-lg transition cursor-pointer ${
                            isInactive
                              ? 'bg-slate-100 text-slate-400 hover:text-slate-600'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200/60'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <div
                          onClick={() => startEditBrand(b)}
                          className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer p-1 shadow-2xs hover:border-orange-400 transition"
                        >
                          <img
                            src={b.logo}
                            alt={b.name}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-orange-600 transition flex items-center gap-2">
                          <span>{b.name}</span>
                          {b.website && (
                            <a
                              href={b.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-orange-600"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                          ID: {b.id}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-slate-600">{b.origin || 'Global'}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {b.categoryIds.map((cid) => (
                            <span
                              key={cid}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px]"
                            >
                              {cid}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">
                          {b.productIds.length} lines
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => startEditBrand(b)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1 border border-slate-200 ml-auto cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
              <h3 className="font-bold text-slate-900 text-base">
                {isCreatingNew ? 'Register Partner Brand' : `Edit Brand: ${editingBrand.name}`}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    value={editingBrand.name || ''}
                    onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                    required
                    placeholder="e.g. Cisco Systems"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Brand ID / Slug
                  </label>
                  <input
                    type="text"
                    value={editingBrand.id || ''}
                    onChange={(e) => setEditingBrand({ ...editingBrand, id: e.target.value, slug: e.target.value })}
                    disabled={!isCreatingNew}
                    placeholder="e.g. cisco"
                    className="w-full bg-white disabled:bg-slate-100/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Country of Origin / Global
                  </label>
                  <input
                    type="text"
                    value={editingBrand.origin || ''}
                    onChange={(e) => setEditingBrand({ ...editingBrand, origin: e.target.value })}
                    placeholder="e.g. USA, Germany, Japan"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official Website URL
                  </label>
                  <input
                    type="url"
                    value={editingBrand.website || ''}
                    onChange={(e) => setEditingBrand({ ...editingBrand, website: e.target.value })}
                    placeholder="https://www.cisco.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Brand Overview Description
                </label>
                <textarea
                  rows={3}
                  value={editingBrand.description || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
                  placeholder="Global leader in enterprise networking..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 leading-relaxed"
                />
              </div>

              {/* Logo Picker */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 p-1 shadow-2xs">
                  <img
                    src={editingBrand.logo || '/assets/placeholder-product.svg'}
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-mono text-slate-500 block truncate mb-1">
                    {editingBrand.logo}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsImagePickerOpen(true)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
                    <span>Select Brand Logo</span>
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Technology Domain Alliances
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  {categories.map((c) => {
                    const isChecked = editingBrand.categoryIds?.includes(c.id);
                    return (
                      <label key={c.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const cur = editingBrand.categoryIds || [];
                            setEditingBrand({
                              ...editingBrand,
                              categoryIds: e.target.checked ? [...cur, c.id] : cur.filter((id) => id !== c.id),
                            });
                          }}
                          className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="truncate">{c.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Brand</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Picker */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        currentImage={editingBrand.logo}
        onSelectImage={(newPath) => {
          setEditingBrand({ ...editingBrand, logo: newPath });
        }}
        title="Associate Brand Logo"
      />
    </div>
  );
}
