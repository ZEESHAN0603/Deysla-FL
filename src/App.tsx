import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { PosterImagesProvider } from "./context/PosterImagesContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { WhatsAppButton } from "./components/common/WhatsAppButton";
import { SearchModal } from "./components/common/SearchModal";
import { EnquiryDrawer } from "./components/cart/EnquiryDrawer";

// Pages
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { ProductsCatalogPage } from "./pages/ProductsCatalogPage";
import { ProductCategoryPage } from "./pages/ProductCategoryPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { BrandsCatalogPage } from "./pages/BrandsCatalogPage";
import { BrandDetailPage } from "./pages/BrandDetailPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { GalleryPage } from "./pages/GalleryPage";
import { ContactPage } from "./pages/ContactPage";
import { CareersPage } from "./pages/CareersPage";
import { CartPage } from "./pages/CartPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsConditionsPage } from "./pages/TermsConditionsPage";
import { CookiePolicyPage } from "./pages/CookiePolicyPage";
import { CookieConsentBanner } from "./components/common/CookieConsentBanner";

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

// Redirect root / to /:lang (default en or stored/detected language)
function RootRedirect() {
  const { language } = useLanguage();
  return <Navigate to={`/${language}`} replace />;
}

// Redirect un-prefixed legacy routes (e.g., /contact -> /en/contact)
function UnprefixedRedirect() {
  const location = useLocation();
  const { language } = useLanguage();
  const pathname = location.pathname;

  // Safeguard: If it already starts with a supported locale, don't re-redirect
  if (pathname.startsWith("/en") || pathname.startsWith("/ar")) {
    return <HomePage />;
  }

  const targetPath = `/${language}${pathname}${location.search}${location.hash}`;
  return <Navigate to={targetPath} replace />;
}

function MainLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener("gmp-quota-exceeded", handleQuotaExceeded);
    return () => window.removeEventListener("gmp-quota-exceeded", handleQuotaExceeded);
  }, []);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col theme-mesh-bg text-neutral-900 font-sans selection:bg-black selection:text-white relative">
      {quotaExceeded && (
        <div className="bg-neutral-100 border-b border-neutral-300 text-neutral-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{" "}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-black hover:text-neutral-700"
            >
              maps developer site
            </a>{" "}
            for instructions to update your account.
          </span>
        </div>
      )}
      {/* Main Enterprise Navigation Bar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        isMobileMenuOpen={isMobileNavOpen}
        onMobileMenuChange={setIsMobileNavOpen}
      />

      {/* Page Routing */}
      <main className="flex-1 w-full">
        <Routes>
          {/* Root Redirect to active language */}
          <Route path="/" element={<RootRedirect />} />

          {/* Localized routes (/en and /ar) */}
          <Route path="/:lang" element={<HomePage />} />
          <Route path="/:lang/about" element={<AboutPage />} />
          <Route path="/:lang/services" element={<ServicesPage />} />
          <Route path="/:lang/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/:lang/products" element={<ProductsCatalogPage />} />
          <Route path="/:lang/products/:categorySlug" element={<ProductCategoryPage />} />
          <Route
            path="/:lang/products/:categorySlug/:productSlug"
            element={<ProductDetailPage />}
          />
          <Route path="/:lang/brands" element={<BrandsCatalogPage />} />
          <Route path="/:lang/brands/:brandSlug" element={<BrandDetailPage />} />
          <Route path="/:lang/projects" element={<ProjectsPage />} />
          <Route path="/:lang/gallery" element={<GalleryPage />} />
          <Route path="/:lang/contact" element={<ContactPage />} />
          <Route path="/:lang/careers" element={<CareersPage />} />
          <Route path="/:lang/cart" element={<CartPage />} />
          <Route path="/:lang/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/:lang/terms" element={<TermsConditionsPage />} />
          <Route path="/:lang/cookies" element={<CookiePolicyPage />} />

          {/* Unprefixed legacy route redirects for seamless backwards compatibility */}
          <Route path="/*" element={<UnprefixedRedirect />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Fixed Affordances */}
      <WhatsAppButton isHidden={isMobileNavOpen} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <EnquiryDrawer />
      <CookieConsentBanner />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <PosterImagesProvider>
        <Router>
          <LanguageProvider>
            <ScrollToTop />
            <MainLayout />
          </LanguageProvider>
        </Router>
      </PosterImagesProvider>
    </CartProvider>
  );
}
