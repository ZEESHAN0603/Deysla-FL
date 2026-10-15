import React, { useState } from 'react';
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Type,
  Video,
  BarChart3,
  Layers,
} from 'lucide-react';
import { useCmsContent } from '../../context/CmsContentContext';

export function AdminContentTab() {
  const { getSectionContent, refreshCmsContent } = useCmsContent();

  const [selectedPage, setSelectedPage] = useState<'home' | 'about'>('home');
  const [selectedSection, setSelectedSection] = useState<'hero' | 'company_intro' | 'stats'>('hero');

  // Hero section form
  const heroData = getSectionContent('home', 'hero', {
    heading: 'EMPOWERING BUSINESSES THROUGH INNOVATIVE TECHNOLOGY SOLUTIONS',
    tagline: 'Leading enterprise hardware distribution, turnkey deployment, and digital engineering across KSA, Bahrain, and USA.',
    ctaPrimaryText: 'Explore Solutions',
    ctaPrimaryLink: '/services',
    ctaSecondaryText: 'Request Quotation',
    ctaSecondaryLink: '/cart',
    videoSrc: '/assets/video/hero.mp4',
  });

  const [heroForm, setHeroForm] = useState(heroData);

  // Company intro form
  const introData = getSectionContent('home', 'company_intro', {
    description: 'DEYSLA IT Solutions is a premier technology provider operating across Saudi Arabia, the Kingdom of Bahrain, and the United States. We specialize in supply, deployment, and lifecycle maintenance of mission-critical IT infrastructure.',
    badge: 'ISO Compliant Engineering & OEM Alliances',
  });

  const [introForm, setIntroForm] = useState(introData);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/cms/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_slug: 'home',
          section_key: 'hero',
          title: heroForm.heading,
          subtitle: heroForm.tagline,
          content: heroForm,
          sort_order: 1,
          is_visible: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save hero section');
      }

      setSaveSuccess(true);
      await refreshCmsContent();
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err?.message || 'Error saving section');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveIntro = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/cms/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_slug: 'home',
          section_key: 'company_intro',
          title: 'Company Introduction',
          subtitle: introForm.badge,
          content: introForm,
          sort_order: 2,
          is_visible: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save intro section');
      }

      setSaveSuccess(true);
      await refreshCmsContent();
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err?.message || 'Error saving section');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Page Content & Sections Editor
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Edit text copy, hero titles, calls to action, badges, and layout parameters without code modification.
          </p>
        </div>

        {/* Page selector pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setSelectedPage('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedPage === 'home' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Home Page
          </button>
          <button
            onClick={() => setSelectedPage('about')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedPage === 'about' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            About Page
          </button>
        </div>
      </div>

      {selectedPage === 'home' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">Sections</span>
            <button
              onClick={() => setSelectedSection('hero')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-xs font-semibold transition cursor-pointer ${
                selectedSection === 'hero'
                  ? 'bg-gradient-to-r from-orange-500/10 to-blue-500/10 text-orange-600 border border-orange-200/80 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Video className="w-4 h-4 text-orange-600" />
              <span>Hero Video & Headlines</span>
            </button>

            <button
              onClick={() => setSelectedSection('company_intro')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-xs font-semibold transition cursor-pointer ${
                selectedSection === 'company_intro'
                  ? 'bg-gradient-to-r from-orange-500/10 to-blue-500/10 text-orange-600 border border-orange-200/80 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Type className="w-4 h-4 text-blue-600" />
              <span>Company Introduction</span>
            </button>
          </div>

          {/* Section Editor Body */}
          <div className="lg:col-span-3">
            {selectedSection === 'hero' && (
              <form onSubmit={handleSaveHero} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Video className="w-4 h-4 text-orange-600" />
                    Home Hero Banner Settings
                  </h3>
                  <span className="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-mono">
                    page: home / key: hero
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Hero Headline</label>
                  <input
                    type="text"
                    value={heroForm.heading}
                    onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Subtitle / Description</label>
                  <textarea
                    rows={3}
                    value={heroForm.tagline}
                    onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Button Text</label>
                    <input
                      type="text"
                      value={heroForm.ctaPrimaryText}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryText: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Button Link URL</label>
                    <input
                      type="text"
                      value={heroForm.ctaPrimaryLink}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryLink: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Secondary Button Text</label>
                    <input
                      type="text"
                      value={heroForm.ctaSecondaryText}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryText: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Secondary Button Link URL</label>
                    <input
                      type="text"
                      value={heroForm.ctaSecondaryLink}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryLink: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Background Video Path / URL</label>
                  <input
                    type="text"
                    value={heroForm.videoSrc}
                    onChange={(e) => setHeroForm({ ...heroForm, videoSrc: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    {saveSuccess && (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Hero section saved and live!
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
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-blue-600 text-white rounded-xl text-xs font-semibold hover:opacity-95 transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Hero Section'}
                  </button>
                </div>
              </form>
            )}

            {selectedSection === 'company_intro' && (
              <form onSubmit={handleSaveIntro} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-600" />
                    Home Company Introduction Section
                  </h3>
                  <span className="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-mono">
                    page: home / key: company_intro
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Header Badge / Pill Text</label>
                  <input
                    type="text"
                    value={introForm.badge}
                    onChange={(e) => setIntroForm({ ...introForm, badge: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Introduction Copy</label>
                  <textarea
                    rows={5}
                    value={introForm.description}
                    onChange={(e) => setIntroForm({ ...introForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    {saveSuccess && (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Introduction section saved and live!
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
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-blue-600 text-white rounded-xl text-xs font-semibold hover:opacity-95 transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Introduction Section'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {selectedPage === 'about' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-2">About Page Core Narrative</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            The company Vision, Mission, Journey milestones, Pillars, and Industries are synchronized from the Director Profile & Global Settings module. You can customize them directly in the <strong>Global Settings</strong> tab or update the structured values live.
          </p>
        </div>
      )}
    </div>
  );
}
