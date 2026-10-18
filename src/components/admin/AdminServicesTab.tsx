import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useCmsContent } from '../../context/CmsContentContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Service } from '../../data/services';
import { ImagePickerModal } from './ImagePickerModal';

export function AdminServicesTab() {
  const { services, refreshCmsContent } = useCmsContent();
  const { authHeaders } = useAdminAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form lists
  const [subServicesText, setSubServicesText] = useState('');
  const [deliverablesText, setDeliverablesText] = useState('');

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEdit = (service: Service) => {
    setIsNew(false);
    setEditingService({ ...service });
    setSubServicesText((service.subServices || []).join('\n'));
    setDeliverablesText((service.deliverables || []).join('\n'));
  };

  const handleOpenCreate = () => {
    setIsNew(true);
    setEditingService({
      id: '',
      number: String(services.length + 1).padStart(2, '0'),
      title: '',
      slug: '',
      shortDescription: '',
      overview: '',
      image: '/assets/products/cybersecurity-systems.webp',
      imageAlt: '',
      subServices: [],
      deliverables: [],
      process: [],
      relevantCategories: [],
      relevantBrandIds: [],
    });
    setSubServicesText('');
    setDeliverablesText('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;

    setIsSaving(true);
    setActionMessage(null);

    const subServices = subServicesText.split('\n').map((s) => s.trim()).filter(Boolean);
    const deliverables = deliverablesText.split('\n').map((s) => s.trim()).filter(Boolean);

    const payload = {
      ...editingService,
      subServices,
      deliverables,
    };

    try {
      const res = await fetch('/api/admin/cms/services', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save service');
      }

      await refreshCmsContent();
      setEditingService(null);
      setActionMessage({ text: `Service "${payload.title}" saved successfully.`, type: 'success' });
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionMessage({ text: err?.message || 'Error saving service', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/cms/services/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete service');
      }

      await refreshCmsContent();
      setDeleteConfirmId(null);
      setActionMessage({ text: `Service removed.`, type: 'success' });
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionMessage({ text: err?.message || 'Error deleting service', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-600" />
            Enterprise Services Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your service portfolio, deliverables, methodology steps, and associated technical categories.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-blue-600 text-white rounded-xl text-xs font-semibold hover:opacity-95 transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search services by title, slug or scope..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs text-slate-700 focus:outline-none bg-transparent"
        />
        <span className="text-[11px] text-slate-400 font-mono pr-2 whitespace-nowrap">
          {filteredServices.length} of {services.length} services
        </span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="h-40 bg-slate-100 relative overflow-hidden">
                <img
                  src={service.image || '/assets/products/cybersecurity-systems.webp'}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                  #{service.number || '01'}
                </span>
              </div>

              <div className="p-5 space-y-2.5">
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{service.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {service.shortDescription}
                </p>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 font-mono border-t border-slate-100">
                  <span>{(service.subServices || []).length} Sub-services</span>
                  <span>•</span>
                  <span>{(service.deliverables || []).length} Deliverables</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`/en/services/${service.slug || service.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
              >
                <span>View Public Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                  title="Edit Service"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(service.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove this service? This action will remove it from the live services catalog.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-xl cursor-pointer shadow-xs"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Drawer Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isNew ? 'Create New Service' : `Edit Service: ${editingService.title}`}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Slug: {editingService.slug || 'auto-generated'}
                </span>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Number (e.g. 01)</label>
                  <input
                    type="text"
                    value={editingService.number || ''}
                    onChange={(e) => setEditingService({ ...editingService, number: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Title</label>
                  <input
                    type="text"
                    value={editingService.title || ''}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingService.shortDescription || ''}
                  onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Comprehensive Overview</label>
                <textarea
                  rows={4}
                  value={editingService.overview || ''}
                  onChange={(e) => setEditingService({ ...editingService, overview: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingService.image || ''}
                    onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                    className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setIsImagePickerOpen(true)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Browse Media
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sub-Services (one per line)
                </label>
                <textarea
                  rows={4}
                  value={subServicesText}
                  onChange={(e) => setSubServicesText(e.target.value)}
                  placeholder="Firewall Policy Setup&#10;Endpoint Security&#10;Vulnerability Testing"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deliverables & Outputs (one per line)
                </label>
                <textarea
                  rows={3}
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  placeholder="Perimeter Next-Gen Firewall Configuration&#10;Executive Risk Assessment Report"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50 -mx-6 -mb-6 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-600 to-blue-600 text-white rounded-xl text-xs font-semibold hover:opacity-95 transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelectImage={(imgPath) => setEditingService((prev) => prev ? { ...prev, image: imgPath } : prev)}
        currentImage={editingService?.image}
      />
    </div>
  );
}
