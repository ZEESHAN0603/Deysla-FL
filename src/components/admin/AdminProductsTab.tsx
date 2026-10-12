import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Power,
  Layers,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  ImageIcon,
  Save,
  Eye,
  Loader2,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { ProductType } from '../../data/products';
import { useCatalog } from '../../context/CatalogContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ImagePickerModal } from './ImagePickerModal';

interface AdminProductsTabProps {
  onSelectProductForSubproducts?: (productId: string) => void;
}

export function AdminProductsTab({ onSelectProductForSubproducts }: AdminProductsTabProps) {
  const { products, categories, brands, catalogItems, refreshCatalog } = useCatalog();
  const { authHeaders } = useAdminAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  // Edit/Create Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductType> & { status?: 'active' | 'inactive' }>({});
  const [originalProduct, setOriginalProduct] = useState<ProductType | null>(null);

  // Preview Changes state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Image Picker Modal state
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  // Sub-products count lookup
  const subproductCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of catalogItems) {
      map[item.subcategoryId] = (map[item.subcategoryId] || 0) + 1;
    }
    return map;
  }, [catalogItems]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && (p as any).status !== 'inactive') ||
        (selectedStatus === 'inactive' && (p as any).status === 'inactive');

      const matchesBrand = selectedBrand === 'all' || p.brandIds.includes(selectedBrand);

      return matchesSearch && matchesCategory && matchesStatus && matchesBrand;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus, selectedBrand]);

  // Toggle active/inactive
  const handleToggleStatus = async (product: ProductType) => {
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(product.id)}/toggle-status`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshCatalog();
        setSuccessBanner(`Product "${product.name}" status updated to ${data.product.status}.`);
        setTimeout(() => setSuccessBanner(null), 4000);
      } else {
        alert(data.error || 'Failed to toggle status.');
      }
    } catch (err: any) {
      alert(err?.message || 'Network error.');
    }
  };

  const startEditProduct = (prod: ProductType) => {
    setIsCreatingNew(false);
    setOriginalProduct(prod);
    setEditingProduct({
      ...prod,
      status: (prod as any).status || 'active',
      subcategories: [...(prod.subcategories || [])],
      keyApplications: [...(prod.keyApplications || [])],
      brandIds: [...(prod.brandIds || [])],
    });
    setSaveError(null);
    setIsEditorOpen(true);
  };

  const startCreateProduct = () => {
    setIsCreatingNew(true);
    setOriginalProduct(null);
    setEditingProduct({
      id: '',
      name: '',
      slug: '',
      categoryId: categories[0]?.id || 'networking',
      categoryName: categories[0]?.name || 'Networking',
      description: '',
      subcategories: [],
      keyApplications: [],
      image: '/assets/placeholder-product.svg',
      brandIds: [],
      status: 'active',
    });
    setSaveError(null);
    setIsEditorOpen(true);
  };

  const handleOpenPreview = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    if (!editingProduct.name?.trim()) {
      setSaveError('Product Name is required.');
      return;
    }

    if (!editingProduct.categoryId) {
      setSaveError('Category is required.');
      return;
    }

    // If creating, check duplicate ID
    if (isCreatingNew) {
      const targetId = editingProduct.id?.trim() || editingProduct.slug?.trim();
      if (targetId && products.some((p) => p.id === targetId)) {
        setSaveError(`Product with ID "${targetId}" already exists. Please choose a unique ID.`);
        return;
      }
    }

    setIsPreviewModalOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);

      // Match category name
      const foundCat = categories.find((c) => c.id === editingProduct.categoryId);
      const payload = {
        ...editingProduct,
        categoryName: foundCat?.name || editingProduct.categoryName || '',
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await refreshCatalog();
        setIsPreviewModalOpen(false);
        setIsEditorOpen(false);
        setSuccessBanner(`Product "${data.product.name}" saved persistently to database.`);
        setTimeout(() => setSuccessBanner(null), 4000);
      } else {
        setSaveError(data.error || 'Failed to save product.');
      }
    } catch (err: any) {
      setSaveError(err?.message || 'Network error while saving product.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top action bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Inline Product Catalogue Management</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredProducts.length} of {products.length} Products
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Spreadsheet-style administration. Manage product taxonomy, brand links, specifications, and verified image assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshCatalog()}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition shadow-xs cursor-pointer"
            title="Refresh from database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={startCreateProduct}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-orange-500/15 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product Line</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or description..."
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          >
            <option value="all">All Brands ({brands.length})</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
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

      {/* Spreadsheet Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold tracking-wider uppercase text-[10px]">
                <th className="py-3.5 px-4 w-16 text-center">Status</th>
                <th className="py-3.5 px-4 w-20">Asset</th>
                <th className="py-3.5 px-4">Product Name & ID</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Brand Links</th>
                <th className="py-3.5 px-4 text-center">Sub-Products</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    No products matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isInactive = (p as any).status === 'inactive';
                  const subCount = subproductCountMap[p.id] || 0;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-orange-50/30 transition group ${
                        isInactive ? 'opacity-60 bg-slate-50/50' : ''
                      }`}
                    >
                      {/* Status toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p)}
                          title={`Click to ${isInactive ? 'activate' : 'deactivate'}`}
                          className={`inline-flex items-center justify-center p-1.5 rounded-lg transition cursor-pointer ${
                            isInactive
                              ? 'bg-slate-100 text-slate-400 hover:text-slate-600'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200/60'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </td>

                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => startEditProduct(p)}
                          className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-orange-400 transition group-hover:scale-105"
                          title={`Image path: ${p.image}`}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-contain p-1"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </td>

                      {/* Product Name & ID */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-orange-600 transition flex items-center gap-2">
                          <span>{p.name}</span>
                          {isInactive && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 uppercase">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-mono text-slate-400">ID: {p.id}</span>
                          <span className="text-slate-300">·</span>
                          <a
                            href={`/en/products/${p.categoryId}/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-slate-500 hover:text-orange-600 flex items-center gap-0.5"
                          >
                            <span>Live Page</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                          {p.categoryName || p.categoryId}
                        </span>
                      </td>

                      {/* Brands */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.brandIds.slice(0, 3).map((bid) => {
                            const b = brands.find((br) => br.id === bid);
                            return (
                              <span
                                key={bid}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px]"
                              >
                                {b?.name || bid}
                              </span>
                            );
                          })}
                          {p.brandIds.length > 3 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{p.brandIds.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Sub-products */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onSelectProductForSubproducts?.(p.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer text-[11px] font-medium"
                          title="View and manage commercial sub-products"
                        >
                          <Layers className="w-3 h-3 text-blue-600" />
                          <span>{subCount} SKUs</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => startEditProduct(p)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1 border border-slate-200 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT / CREATE PRODUCT DRAWER */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {isCreatingNew ? 'Create New Product Line' : `Edit Product: ${editingProduct.name}`}
                </h3>
                <p className="text-xs text-slate-500">
                  {isCreatingNew
                    ? 'Define taxonomy, description, brand partners, and verified hardware photo.'
                    : `Persistent Product ID: ${editingProduct.id}`}
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleOpenPreview} className="p-6 overflow-y-auto flex-1 space-y-5">
              {saveError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{saveError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Product Line Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Industrial Gigabit Switches"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>

                {/* ID / Slug */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Unique Product ID / Slug
                  </label>
                  <input
                    type="text"
                    value={editingProduct.id || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        id: e.target.value,
                        slug: e.target.value,
                      })
                    }
                    placeholder="e.g. industrial-switches"
                    disabled={!isCreatingNew}
                    className="w-full bg-white disabled:bg-slate-100/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Category <span className="text-orange-500">*</span>
                  </label>
                  <select
                    value={editingProduct.categoryId || ''}
                    onChange={(e) => {
                      const cat = categories.find((c) => c.id === e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        categoryId: e.target.value,
                        categoryName: cat?.name || '',
                      });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Record Status
                  </label>
                  <select
                    value={editingProduct.status || 'active'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  >
                    <option value="active">Active (Visible on public catalogue)</option>
                    <option value="inactive">Inactive (Preserved in history, hidden from public)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Commercial Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Comprehensive description of product family applications, enterprise grade capabilities, and standards..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 leading-relaxed"
                />
              </div>

              {/* Image Association */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Product Image Asset
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    <img
                      src={editingProduct.image || '/assets/placeholder-product.svg'}
                      alt="Product"
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-mono text-slate-600 truncate mb-2">
                      {editingProduct.image || 'None selected'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsImagePickerOpen(true)}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1.5 border border-slate-200 cursor-pointer shadow-xs"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
                      <span>Change Asset / Browse Images / Upload New</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Subcategories */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Subcategories (Comma-separated)
                </label>
                <input
                  type="text"
                  value={(editingProduct.subcategories || []).join(', ')}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      subcategories: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Managed Switches, PoE Switches, 10G SFP+ Aggregation"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                />
              </div>

              {/* Key Applications */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Key Enterprise Applications (Comma-separated)
                </label>
                <input
                  type="text"
                  value={(editingProduct.keyApplications || []).join(', ')}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      keyApplications: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Data Center Top-of-Rack, IP Surveillance Infrastructure, Campus WAN"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                />
              </div>

              {/* Brand Association Multi-Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Associated Brand Partners ({editingProduct.brandIds?.length || 0} selected)
                </label>
                <div className="max-h-40 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {brands.map((b) => {
                    const isChecked = editingProduct.brandIds?.includes(b.id);
                    return (
                      <label
                        key={b.id}
                        className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer select-none transition ${
                          isChecked ? 'bg-orange-50 text-orange-800 font-medium' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = editingProduct.brandIds || [];
                            const next = e.target.checked
                              ? [...current, b.id]
                              : current.filter((id) => id !== b.id);
                            setEditingProduct({ ...editingProduct, brandIds: next });
                          }}
                          className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="truncate">{b.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Footer buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview & Confirm Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW CHANGES MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Confirm Catalogue Changes</h3>
                <p className="text-xs text-slate-500">
                  Inspect modified values before updating persistent database.
                </p>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Operation:</span>
                  <span className="font-semibold text-orange-600 uppercase">
                    {isCreatingNew ? 'Create New Record' : 'Update Record'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Product Name:</span>
                  <span className="font-semibold text-slate-900">{editingProduct.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Product ID / Slug:</span>
                  <span className="font-mono text-slate-700">{editingProduct.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Category:</span>
                  <span className="text-slate-900">{editingProduct.categoryName || editingProduct.categoryId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Record Status:</span>
                  <span
                    className={`font-semibold capitalize ${
                      editingProduct.status === 'inactive' ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {editingProduct.status || 'active'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Image Asset:</span>
                  <span className="font-mono text-slate-700 truncate max-w-xs">{editingProduct.image}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">Brand Links:</span>
                  <span className="text-slate-700">{editingProduct.brandIds?.length || 0} brands</span>
                </div>
              </div>

              {saveError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{saveError}</span>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                disabled={isSaving}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition cursor-pointer"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={isSaving}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Confirm & Persist to Database</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PICKER MODAL */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        currentImage={editingProduct.image}
        onSelectImage={(newPath) => {
          setEditingProduct({ ...editingProduct, image: newPath });
        }}
        title="Associate Product Image"
      />
    </div>
  );
}
