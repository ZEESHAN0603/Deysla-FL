import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { COMPANY_DATA, CompanyInfo } from '../data/company';
import { SERVICES_DATA, Service } from '../data/services';
import { PROJECTS_DATA, Project } from '../data/projects';
import { GALLERY_DATA, GalleryItem } from '../data/gallery';
import { REVIEWS_DATA, Review } from '../data/reviews';

export interface CmsPageSection {
  id: string;
  page_slug: string;
  section_key: string;
  title: string;
  subtitle: string;
  content: any;
  sort_order: number;
  is_visible: boolean;
}

export interface CmsFaq {
  id: string;
  category: string;
  question_en: string;
  question_ar?: string;
  answer_en: string;
  answer_ar?: string;
  sort_order: number;
  is_active: boolean;
}

interface CmsContentContextType {
  settings: Record<string, any>;
  companyInfo: CompanyInfo;
  services: Service[];
  projects: Project[];
  gallery: GalleryItem[];
  reviews: Review[];
  faqs: CmsFaq[];
  getSection: (pageSlug: string, sectionKey: string, fallback?: any) => CmsPageSection | undefined;
  getSectionContent: <T = any>(pageSlug: string, sectionKey: string, fallback?: T) => T;
  isLoading: boolean;
  dataSource: 'mysql' | 'json' | 'static';
  refreshCmsContent: () => Promise<void>;
}

const CmsContentContext = createContext<CmsContentContextType | undefined>(undefined);

export function CmsContentProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(SERVICES_DATA);
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [gallery, setGallery] = useState<GalleryItem[]>(GALLERY_DATA);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS_DATA);
  const [faqs, setFaqs] = useState<CmsFaq[]>([]);
  const [sections, setSections] = useState<CmsPageSection[]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(COMPANY_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'mysql' | 'json' | 'static'>('static');

  const fetchCmsContent = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/content');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.success) {
        if (Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
        }
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
        if (Array.isArray(data.gallery) && data.gallery.length > 0) {
          setGallery(data.gallery);
        }
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
        if (Array.isArray(data.faqs)) {
          setFaqs(data.faqs);
        }
        if (Array.isArray(data.sections)) {
          setSections(data.sections);
        }
        if (data.settings && typeof data.settings === 'object') {
          setSettings(data.settings);

          // Merge custom settings dynamically into CompanyInfo
          setCompanyInfo((prev) => ({
            ...prev,
            name: data.settings.company_name || prev.name,
            tagline: data.settings.tagline || prev.tagline,
            director: {
              ...prev.director,
              name: data.settings.director_name || prev.director.name,
              title: data.settings.director_title || prev.director.title,
              image: data.settings.director_image || prev.director.image,
              message: data.settings.director_message || prev.director.message,
            },
            contact: {
              ...prev.contact,
              phone: data.settings.contact_phone || prev.contact.phone,
              phoneFormatted: data.settings.contact_phone_formatted || prev.contact.phoneFormatted,
              email: data.settings.contact_email || prev.contact.email,
              primaryLocation: data.settings.contact_primary_location || prev.contact.primaryLocation,
              primaryCity: data.settings.contact_primary_city || prev.contact.primaryCity,
              primaryCountry: data.settings.contact_primary_country || prev.contact.primaryCountry,
            },
            offices: data.settings.offices_data || prev.offices,
            globalPresence: data.settings.global_presence_data || prev.globalPresence,
            stats: data.settings.company_stats || prev.stats,
            about: data.settings.about_data || prev.about,
          }));
        }

        setDataSource(data.source || 'json');
      }
    } catch (err) {
      console.warn('[CMS Context] Could not load dynamic CMS content, using static fallback:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCmsContent();
  }, [fetchCmsContent]);

  const getSection = useCallback(
    (pageSlug: string, sectionKey: string): CmsPageSection | undefined => {
      return sections.find(
        (s) => s.page_slug === pageSlug && s.section_key === sectionKey
      );
    },
    [sections]
  );

  const getSectionContent = useCallback(
    <T = any>(pageSlug: string, sectionKey: string, fallback?: T): T => {
      const sec = sections.find(
        (s) => s.page_slug === pageSlug && s.section_key === sectionKey
      );
      if (sec && sec.content !== undefined) {
        return sec.content as T;
      }
      return fallback as T;
    },
    [sections]
  );

  return (
    <CmsContentContext.Provider
      value={{
        settings,
        companyInfo,
        services,
        projects,
        gallery,
        reviews,
        faqs,
        getSection,
        getSectionContent,
        isLoading,
        dataSource,
        refreshCmsContent: fetchCmsContent,
      }}
    >
      {children}
    </CmsContentContext.Provider>
  );
}

export function useCmsContent(): CmsContentContextType {
  const context = useContext(CmsContentContext);
  if (!context) {
    throw new Error('useCmsContent must be used within a CmsContentProvider');
  }
  return context;
}
