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
  Eye,
  Layers,
  Trash2,
} from 'lucide-react';
import { CatalogItem } from '../../data/productCatalogItems';
import { useCatalog } from '../../context/CatalogContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ImagePickerModal } from './ImagePickerModal';

interface AdminCatalogItemsTabProps {
  initialProductIdFilter?: string;
  onClearParentFilter?: () => void;
}

export function AdminCatalogItemsTab({
  initialProductIdFilter,
  onClearParentFilter,
}: AdminCatalogItemsTabProps) {
  const { catalogItems, products, categories, refreshCatalog } = useCatalog();
  const { authHeaders } = useAdminAuth();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [parentProductFilter, setParentProductFilter] = useState<string>(
    initialProductIdFilter || 'all'
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<
    Partial<CatalogItem> & { status?: 'active' | 'inactive' }
  >({});
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Deletion modal state
  const [itemToDelete, setItemToDelete] = useState<CatalogItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCatalogItem = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/catalog-items/${encodeURIComponent(itemToDelete.id)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete SKU.');
      }
      setSuccessBanner(`Commercial SKU "${itemToDelete.name}" (${itemToDelete.id}) was permanently deleted.`);
      setTimeout(() => setSuccessBanner(null), 4000);
      setItemToDelete(null);
      await refreshCatalog();
    } catch (err: any) {
      alert(err.message || 'Error deleting SKU');
    } finally {
      setIsDeleting(false);
    }
  };

  // Update filter if prop changes
  React.useEffect(() => {
    if (initialProductIdFilter) {
      setParentProductFilter(initialProductIdFilter);
    }
  }, [initialProductIdFilter]);

  React.useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return catalogItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesParent =
        parentProductFilter === 'all' || item.subcategoryId === parentProductFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && (item as any).status !== 'inactive') ||
        (statusFilter === 'inactive' && (item as any).status === 'inactive');

      return matchesSearch && matchesParent && matchesStatus;
    });
  }, [catalogItems, searchQuery, parentProductFilter, statusFilter]);

  const handleToggleStatus = async (item: CatalogItem) => {
    try {
      const res = await fetch(
        `/api/admin/catalog-items/${encodeURIComponent(item.id)}/toggle-status`,
        { method: 'POST', headers: authHeaders() }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshCatalog();
        setSuccessBanner(`Sub-product "${item.name}" status updated to ${data.catalogItem.status}.`);
        setTimeout(() => setSuccessBanner(null), 4000);
      } else {
        alert(data.error || 'Failed to toggle status.');
      }
    } catch (err: any) {
      alert(err?.message || 'Network error.');
    }
  };

  const startEditItem = (item: CatalogItem) => {
    setIsCreatingNew(false);
    setEditingItem({
      ...item,
      status: (item as any).status || 'active',
      specs: [...(item.specs || [])],
    });
    setErrorMsg(null);
    setIsEditorOpen(true);
  };

  const startCreateItem = () => {
    setIsCreatingNew(true);
    const defaultParent = products.find((p) => p.id === parentProductFilter) || products[0];
    setEditingItem({
      id: '',
      name: '',
      subcategoryId: defaultParent?.id || 'network-switches',
      subcategoryName: defaultParent?.name || 'Network Switches',
      categoryId: defaultParent?.categoryId || 'networking',
      categoryName: defaultParent?.categoryName || 'Networking',
      brand: 'DEYSLA / OEM',
      badge: 'Commercial Enterprise Model',
      specs: [],
      image: defaultParent?.image || '/assets/placeholder-product.svg',
      imageWebp: defaultParent?.image || '/assets/placeholder-product.svg',
      status: 'active',
    });
    setErrorMsg(null);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.name?.trim()) {
      setErrorMsg('Sub-product Name is required.');
      return;
    }
    if (!editingItem.subcategoryId) {
      setErrorMsg('Parent Product selection is required.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);

      const parent = products.find((p) => p.id === editingItem.subcategoryId);
      const payload = {
        ...editingItem,
        subcategoryName: parent?.name || editingItem.subcategoryName || '',
        categoryId: parent?.categoryId || editingItem.categoryId || '',
        categoryName: parent?.categoryName || editingItem.categoryName || '',
      };

      const res = await fetch('/api/admin/catalog-items', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await refreshCatalog();
        setIsEditorOpen(false);
        setSuccessBanner(`Sub-product "${data.catalogItem.name}" saved persistently.`);
        setTimeout(() => setSuccessBanner(null), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to save sub-product.');
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
            <h2 className="text-xl font-bold text-slate-900">Commercial SKUs & Sub-Products</h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredItems.length} of {catalogItems.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage granular commercial equipment models, technical specifications, and parent-line associations.
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
            onClick={startCreateItem}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-orange-500/15 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Commercial SKU</span>
          </button>
        </div>
      </div>

      {initialProductIdFilter && parentProductFilter !== 'all' && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>
              Filtered to parent product: <strong>{parentProductFilter}</strong>
            </span>
          </div>
          <button
            onClick={() => {
              setParentProductFilter('all');
              onClearParentFilter?.();
            }}
            className="text-xs underline hover:text-blue-900 cursor-pointer font-medium"
          >
            Show All Products
          </button>
        </div>
      )}

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
            placeholder="Search SKU ID, model, or specs..."
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          />
        </div>

        <div>
          <select
            value={parentProductFilter}
            onChange={(e) => setParentProductFilter(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          >
            <option value="all">All Parent Product Lines ({products.length})</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold tracking-wider uppercase text-[10px]">
                <th className="py-3.5 px-4 w-16 text-center">Status</th>
                <th className="py-3.5 px-4 w-20">Asset</th>
                <th className="py-3.5 px-4">SKU / Model</th>
                <th className="py-3.5 px-4">Parent Product Line</th>
                <th className="py-3.5 px-4">Brand / Badge</th>
                <th className="py-3.5 px-4">Specifications</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    No commercial SKUs found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isInactive = (item as any).status === 'inactive';
                  const parentProd = products.find((p) => p.id === item.subcategoryId);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-orange-50/30 transition group ${
                        isInactive ? 'opacity-60 bg-slate-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
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
                          onClick={() => startEditItem(item)}
                          className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-orange-400 transition"
                          title={item.imageWebp || item.image}
                        >
                          <img
                            src={item.imageWebp || item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-orange-600 transition">
                          {item.name}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                          ID: {item.id}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                          {parentProd?.name || item.subcategoryName || item.subcategoryId}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{item.brand}</div>
                        {item.badge && (
                          <span className="text-[10px] text-orange-600 font-medium block mt-0.5">
                            {item.badge}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <ul className="space-y-0.5 text-[11px] text-slate-500">
                          {item.specs?.slice(0, 2).map((s, idx) => (
                            <li key={idx} className="truncate">
                              • {s}
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => startEditItem(item)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1 border border-slate-200 cursor-pointer"
                            title="Edit SKU"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setItemToDelete(item)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-medium transition border border-rose-200 cursor-pointer"
                            title="Delete SKU"
                          >
                            <Trash2 className="w-3 h-3" />
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

      {/* EDIT MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
              <h3 className="font-bold text-slate-900 text-base">
                {isCreatingNew ? 'Add Commercial SKU' : `Edit SKU: ${editingItem.name}`}
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
                    Sub-Product / SKU Name *
                  </label>
                  <input
                    type="text"
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    required
                    placeholder="e.g. Cisco Catalyst 9300 48P"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    SKU ID
                  </label>
                  <input
                    type="text"
                    value={editingItem.id || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, id: e.target.value })}
                    disabled={!isCreatingNew}
                    placeholder="Auto-generated if empty"
                    className="w-full bg-white disabled:bg-slate-100/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Parent Product Family *
                  </label>
                  <select
                    value={editingItem.subcategoryId || ''}
                    onChange={(e) => {
                      const p = products.find((prod) => prod.id === e.target.value);
                      setEditingItem({
                        ...editingItem,
                        subcategoryId: e.target.value,
                        subcategoryName: p?.name || '',
                        categoryId: p?.categoryId || '',
                        categoryName: p?.categoryName || '',
                      });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={editingItem.brand || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, brand: e.target.value })}
                    placeholder="e.g. CISCO / DEYSLA"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Model Badge / Hardware Highlight
                  </label>
                  <input
                    type="text"
                    value={editingItem.badge || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    placeholder="e.g. 48-Port PoE+ 740W"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={editingItem.status || 'active'}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Technical Specifications */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Technical Specifications (Comma or line separated)
                </label>
                <textarea
                  rows={3}
                  value={(editingItem.specs || []).join('\n')}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      specs: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="48x Gigabit PoE+ Ports&#10;4x 10G SFP+ Uplinks&#10;Redundant Dual Power Supplies"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                />
              </div>

              {/* Image Asset */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  <img
                    src={editingItem.imageWebp || editingItem.image || '/assets/placeholder-product.svg'}
                    alt="SKU"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-mono text-slate-500 block truncate mb-1">
                    {editingItem.imageWebp || editingItem.image}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsImagePickerOpen(true)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
                    <span>Choose / Upload Image</span>
                  </button>
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
                  <span>Save SKU</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6 text-slate-800">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="p-3 bg-rose-100 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Commercial SKU</h3>
                <p className="text-xs text-slate-500">Permanent Database Action</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              Are you sure you want to permanently delete SKU{' '}
              <span className="font-bold text-slate-900">"{itemToDelete.name}"</span> (ID:{' '}
              <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">{itemToDelete.id}</code>)?
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 mb-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                This will delete the catalog item from the MySQL database and remove it from public category and equipment listings. This operation cannot be undone.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCatalogItem}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-600/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        currentImage={editingItem.imageWebp || editingItem.image}
        onSelectImage={(newPath) => {
          setEditingItem({ ...editingItem, image: newPath, imageWebp: newPath });
        }}
        title="Associate SKU Image"
      />
    </div>
  );
}
