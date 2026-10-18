import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Save,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useCmsContent } from '../../context/CmsContentContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ImagePickerModal } from './ImagePickerModal';

export function AdminSettingsTab() {
  const { companyInfo, refreshCmsContent } = useCmsContent();
  const { authHeaders } = useAdminAuth();

  const [dbStatus, setDbStatus] = useState<{
    loading: boolean;
    connected: boolean;
    error: string | null;
    dbName: string;
    host: string;
    user: string;
  }>({
    loading: true,
    connected: false,
    error: null,
    dbName: 'u157314465_DEYSLA',
    host: '',
    user: '',
  });

  const [migrationStatus, setMigrationStatus] = useState<{
    running: boolean;
    message: string | null;
    success: boolean | null;
  }>({
    running: false,
    message: null,
    success: null,
  });

  // Form states
  const [formData, setFormData] = useState({
    company_name: companyInfo.name || 'DEYSLA IT Solutions',
    tagline: companyInfo.tagline || '',
    director_name: companyInfo.director.name || '',
    director_title: companyInfo.director.title || '',
    director_image: companyInfo.director.image || '/assets/director.png',
    director_message: companyInfo.director.message || '',
    contact_phone: companyInfo.contact.phone || '',
    contact_phone_formatted: companyInfo.contact.phoneFormatted || '',
    contact_email: companyInfo.contact.email || '',
    contact_primary_location: companyInfo.contact.primaryLocation || '',
    contact_primary_city: companyInfo.contact.primaryCity || '',
    contact_primary_country: companyInfo.contact.primaryCountry || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  const fetchDbStatus = async () => {
    setDbStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/admin/cms/db-status', {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setDbStatus({
          loading: false,
          connected: Boolean(data.connected),
          error: data.error || null,
          dbName: data.dbName || 'u157314465_DEYSLA',
          host: data.host || '',
          user: data.user || '',
        });
      } else {
        setDbStatus((prev) => ({ ...prev, loading: false, connected: false, error: data.error }));
      }
    } catch (err: any) {
      setDbStatus((prev) => ({ ...prev, loading: false, connected: false, error: err?.message }));
    }
  };

  useEffect(() => {
    fetchDbStatus();
  }, []);

  const handleRunMigration = async () => {
    setMigrationStatus({ running: true, message: 'Executing migrations & importing records...', success: null });
    try {
      const res = await fetch('/api/admin/cms/migrate-seed', {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setMigrationStatus({
          running: false,
          message: data.message || 'Migrations & Seed executed successfully!',
          success: true,
        });
        fetchDbStatus();
        refreshCmsContent();
      } else {
        setMigrationStatus({
          running: false,
          message: data.message || data.error || 'Migration failed.',
          success: false,
        });
      }
    } catch (err: any) {
      setMigrationStatus({
        running: false,
        message: err?.message || 'Network error running migrations.',
        success: false,
      });
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      for (const [key, val] of Object.entries(formData)) {
        const res = await fetch('/api/admin/cms/settings', {
          method: 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ key, value: val }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Failed to update ${key}`);
        }
      }

      setSaveSuccess(true);
      await refreshCmsContent();
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err?.message || 'Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-600" />
            Global Site Settings & Database Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure company identity, Director profile, contact channels, and manage Hostinger MySQL connectivity.
          </p>
        </div>

        <button
          onClick={fetchDbStatus}
          disabled={dbStatus.loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${dbStatus.loading ? 'animate-spin' : ''}`} />
          Refresh Database Status
        </button>
      </div>

      {/* Database Connection Status Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${dbStatus.connected ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Hostinger MySQL Database</h3>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    dbStatus.connected
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dbStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  {dbStatus.connected ? 'Connected (Live MySQL)' : 'Local JSON Fallback Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target database: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">u157314465_DEYSLA</code>
                <span className="ml-2 text-slate-400">(WordPress database u157314465_UmYLY is strictly isolated & untouched)</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleRunMigration}
            disabled={migrationStatus.running}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-blue-600 text-white rounded-xl text-xs font-semibold hover:opacity-95 transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            {migrationStatus.running ? 'Running Migration...' : 'Run Migration & Seed'}
          </button>
        </div>

        {migrationStatus.message && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              migrationStatus.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {migrationStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{migrationStatus.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-2">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Host Server</span>
            <span className="text-xs font-semibold text-slate-700 font-mono mt-0.5 block truncate">
              {dbStatus.host || 'localhost / remote'}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Target Database</span>
            <span className="text-xs font-semibold text-slate-700 font-mono mt-0.5 block truncate">
              {dbStatus.dbName}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Active User</span>
            <span className="text-xs font-semibold text-slate-700 font-mono mt-0.5 block truncate">
              {dbStatus.user || 'Configured via .env'}
            </span>
          </div>
        </div>

        {!dbStatus.connected && (
          <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
            <p className="font-semibold flex items-center gap-1.5 text-amber-800">
              <AlertCircle className="w-3.5 h-3.5" />
              Notice: Running in Resilient Fallback Mode
            </p>
            <p className="mt-1 text-amber-800/90">
              Remote MySQL credentials are not yet configured in <code className="bg-white/80 px-1 py-0.5 rounded font-mono">.env</code>.
              The application is safely persisting all data to the verified local store at <code className="bg-white/80 px-1 py-0.5 rounded font-mono">data/db/</code>.
              Once your Hostinger DB user password is provided in <code className="bg-white/80 px-1 py-0.5 rounded font-mono">.env</code>, click <strong>"Run Migration & Seed"</strong> to migrate all records to MySQL in one click.
            </p>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Company Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-orange-600" />
            Company Identity & Branding
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Tagline / Headline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Director Profile & Message */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-orange-600" />
            Director Profile & Welcome Message
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Director Name</label>
              <input
                type="text"
                value={formData.director_name}
                onChange={(e) => setFormData({ ...formData, director_name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Title / Designation</label>
              <input
                type="text"
                value={formData.director_title}
                onChange={(e) => setFormData({ ...formData, director_title: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Director Photograph URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.director_image}
                onChange={(e) => setFormData({ ...formData, director_image: e.target.value })}
                className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setIsImagePickerOpen(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Browse Media
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Director Welcome Message</label>
            <textarea
              rows={4}
              value={formData.director_message}
              onChange={(e) => setFormData({ ...formData, director_message: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Contact Channels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Phone className="w-4 h-4 text-orange-600" />
            Contact Channels & Primary Headquarters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Phone (Raw / International)</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone (Display Formatted)</label>
              <input
                type="text"
                value={formData.contact_phone_formatted}
                onChange={(e) => setFormData({ ...formData, contact_phone_formatted: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Inquiries Email</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary District / Street Location</label>
              <input
                type="text"
                value={formData.contact_primary_location}
                onChange={(e) => setFormData({ ...formData, contact_primary_location: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary City</label>
              <input
                type="text"
                value={formData.contact_primary_city}
                onChange={(e) => setFormData({ ...formData, contact_primary_city: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Country</label>
              <input
                type="text"
                value={formData.contact_primary_country}
                onChange={(e) => setFormData({ ...formData, contact_primary_country: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2">
          <div>
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Settings saved successfully! Changes are live across the website.
              </span>
            )}
            {saveError && (
              <span className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {saveError}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:opacity-95 transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Changes...' : 'Save All Settings'}
          </button>
        </div>
      </form>

      {/* Media Picker Modal */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelectImage={(imgPath) => setFormData({ ...formData, director_image: imgPath })}
        currentImage={formData.director_image}
      />
    </div>
  );
}
