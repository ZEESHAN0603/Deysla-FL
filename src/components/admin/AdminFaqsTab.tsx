import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { useCmsContent, CmsFaq } from '../../context/CmsContentContext';

export function AdminFaqsTab() {
  const { faqs, refreshCmsContent } = useCmsContent();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingFaq, setEditingFaq] = useState<Partial<CmsFaq> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredFaqs = faqs.filter((f) =>
    f.question_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEdit = (faq: CmsFaq) => {
    setIsNew(false);
    setEditingFaq({ ...faq });
  };

  const handleOpenCreate = () => {
    setIsNew(true);
    setEditingFaq({
      id: '',
      category: 'General',
      question_en: '',
      question_ar: '',
      answer_en: '',
      answer_ar: '',
      sort_order: faqs.length + 1,
      is_active: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq?.question_en || !editingFaq?.answer_en) return;

    setIsSaving(true);
    setActionMessage(null);

    try {
      const res = await fetch('/api/admin/cms/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save FAQ');
      }

      await refreshCmsContent();
      setEditingFaq(null);
      setActionMessage({ text: 'FAQ saved successfully.', type: 'success' });
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionMessage({ text: err?.message || 'Error saving FAQ', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/cms/faqs/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete FAQ');
      }

      await refreshCmsContent();
      setDeleteConfirmId(null);
      setActionMessage({ text: 'FAQ removed.', type: 'success' });
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionMessage({ text: err?.message || 'Error deleting FAQ', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-orange-600" />
            Frequently Asked Questions (FAQs)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage customer knowledge base questions, procurement clarity, regional hub answers in English and Arabic.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-blue-600 text-white rounded-xl text-xs font-semibold hover:opacity-95 transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Question & Answer
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

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search FAQs by question or answer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs text-slate-700 focus:outline-none bg-transparent"
        />
        <span className="text-[11px] text-slate-400 font-mono pr-2 whitespace-nowrap">
          {filteredFaqs.length} FAQs
        </span>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-orange-100 uppercase tracking-wider">
                    {faq.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Order: #{faq.sort_order}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{faq.question_en}</h3>
                {faq.question_ar && (
                  <p className="text-xs text-slate-500 font-sans" dir="rtl">
                    {faq.question_ar}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleOpenEdit(faq)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(faq.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
              <p>{faq.answer_en}</p>
              {faq.answer_ar && (
                <p className="mt-2 pt-2 border-t border-slate-200 text-slate-500" dir="rtl">
                  {faq.answer_ar}
                </p>
              )}
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
              Are you sure you want to remove this question and answer?
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {isNew ? 'Create FAQ' : `Edit FAQ`}
              </h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingFaq.category || 'General'}
                    onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Services">Services</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sort Order Position</label>
                  <input
                    type="number"
                    value={editingFaq.sort_order || 1}
                    onChange={(e) => setEditingFaq({ ...editingFaq, sort_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question (English)</label>
                <input
                  type="text"
                  value={editingFaq.question_en || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question_en: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question (Arabic - Optional)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={editingFaq.question_ar || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question_ar: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-right font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Answer (English)</label>
                <textarea
                  rows={4}
                  value={editingFaq.answer_en || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer_en: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Answer (Arabic - Optional)</label>
                <textarea
                  rows={3}
                  dir="rtl"
                  value={editingFaq.answer_ar || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer_ar: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none leading-relaxed text-right font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
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
                  {isSaving ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
