import React, { useEffect, useState, Suspense, lazy } from "react";
import { useTranslation } from 'react-i18next';
import { useMonitoring } from "@/hooks/useMonitoring";
import { useAccessibility } from "@/hooks/useAccessibility";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import TranslationStatus from "@/components/TranslationStatus";
import Header from "./components/Header";
import { BreadcrumbNavigation } from "./components/BreadcrumbNavigation";
import Footer from "./components/Footer";
import FixedLanguageRouter from "./components/FixedLanguageRouter";
import AccessibilityWrapper from "@/components/AccessibilityWrapper";
import { SecurityHeaders } from "@/components/ui/security-headers";
import { withLazyLoading, PageLoader } from "@/components/LazyLoadingWrapper";

// Lazy load all pages for optimal performance
const Home = lazy(() => import("./pages/Home"));
const SubmitLocation = lazy(() => import("./pages/SubmitLocation"));
const Becomefranchise = lazy(() => import("./pages/BecomefranchisePage"));
const Agent = lazy(() => import("./pages/AgentPage"));
const Influencer = lazy(() => import("./pages/InfluencerPage"));
const JoinUsPage = lazy(() => import("./pages/JoinUsPage"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const OurProducts = lazy(() => import("./pages/OurProducts"));
const StartATMPage = lazy(() => import("./pages/StartATMPage"));
const AdminExport = lazy(() => import("./pages/AdminExport"));
const AdminUserManagement = lazy(() => import("./pages/AdminUserManagement"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const AccessibilityStatement = lazy(() => import("./pages/AccessibilityStatement"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const PixellpayAdvantage = lazy(() => import("./pages/PixellpayAdvantage"));
const JobsPage = lazy(() => import("./pages/JobsPage"));

// Blog pages - separate chunk
const BlogPage = lazy(() => import("./pages/BlogPage"));
const PerfectTimeSideHustle2025 = lazy(() => import("./pages/blog/PerfectTimeSideHustle2025"));
const PassiveIncomeFinancialFreedom = lazy(() => import("./pages/blog/PassiveIncomeFinancialFreedom"));
const TruthAboutPassiveIncomeIdeas = lazy(() => import("./pages/blog/TruthAboutPassiveIncomeIdeas"));
const ATMFranchisePassiveIncome = lazy(() => import("./pages/blog/ATMFranchisePassiveIncome"));
const FiveStepGuideATMBusiness = lazy(() => import("./pages/blog/FiveStepGuideATMBusiness"));

// Wrap components with lazy loading HOC
const LazyHome = withLazyLoading(Home);
const LazySubmitLocation = withLazyLoading(SubmitLocation);
const LazyBecomefranchise = withLazyLoading(Becomefranchise);
const LazyAgent = withLazyLoading(Agent);
const LazyInfluencer = withLazyLoading(Influencer);
const LazyJoinUsPage = withLazyLoading(JoinUsPage);
const LazyContactUs = withLazyLoading(ContactUs);
const LazyAboutUs = withLazyLoading(AboutUs);
const LazyOurProducts = withLazyLoading(OurProducts);
const LazyStartATMPage = withLazyLoading(StartATMPage);
const LazyAdminExport = withLazyLoading(AdminExport);
const LazyAdminUserManagement = withLazyLoading(AdminUserManagement);
const LazyNotFound = withLazyLoading(NotFound);
const LazyPrivacyPolicy = withLazyLoading(PrivacyPolicy);
const LazyTermsConditions = withLazyLoading(TermsConditions);
const LazyAccessibilityStatement = withLazyLoading(AccessibilityStatement);
const LazyRefundPolicy = withLazyLoading(RefundPolicy);
const LazyPixellpayAdvantage = withLazyLoading(PixellpayAdvantage);
const LazyJobsPage = withLazyLoading(JobsPage);
const LazyBlogPage = withLazyLoading(BlogPage);
const LazyPerfectTimeSideHustle2025 = withLazyLoading(PerfectTimeSideHustle2025);
const LazyPassiveIncomeFinancialFreedom = withLazyLoading(PassiveIncomeFinancialFreedom);
const LazyTruthAboutPassiveIncomeIdeas = withLazyLoading(TruthAboutPassiveIncomeIdeas);
const LazyATMFranchisePassiveIncome = withLazyLoading(ATMFranchisePassiveIncome);
const LazyFiveStepGuideATMBusiness = withLazyLoading(FiveStepGuideATMBusiness);

// Simple query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Component to handle language-prefixed routes
const LanguageWrappedRoutes = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    if (lang && lang !== 'en') {
      // Set language in translation system
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  
  // Render the same routes but with language context
  return (
    <Routes>
      <Route path="/" element={<LazyHome />} />
      <Route path="/submit-location" element={<LazySubmitLocation />} />
      <Route path="/become-franchise" element={<LazyBecomefranchise />} />
      <Route path="/agent" element={<LazyAgent />} />
      <Route path="/influencer" element={<LazyInfluencer />} />
      <Route path="/join-us" element={<LazyJoinUsPage />} />
      <Route path="/join-us/:tab" element={<LazyJoinUsPage />} />
      <Route path="/join-us/jobs" element={<LazyJobsPage />} />
      <Route path="/contact-us" element={<LazyContactUs />} />
      <Route path="/about-us" element={<LazyAboutUs />} />
      <Route path="/our-products" element={<LazyOurProducts />} />
      <Route path="/start-atm-business" element={<LazyStartATMPage />} />
      <Route path="/privacy-policy" element={<LazyPrivacyPolicy />} />
      <Route path="/terms-conditions" element={<LazyTermsConditions />} />
      <Route path="/accessibility-statement" element={<LazyAccessibilityStatement />} />
      <Route path="/refund-policy" element={<LazyRefundPolicy />} />
      <Route path="/pixellpay-advantage" element={<LazyPixellpayAdvantage />} />
      <Route path="/jobs" element={<LazyJobsPage />} />
      
      {/* Blog routes */}
      <Route path="/blog" element={<LazyBlogPage />} />
      <Route path="/blog/perfect-time-side-hustle-2025" element={<LazyPerfectTimeSideHustle2025 />} />
      <Route path="/blog/passive-income-financial-freedom" element={<LazyPassiveIncomeFinancialFreedom />} />
      <Route path="/blog/truth-about-passive-income-ideas" element={<LazyTruthAboutPassiveIncomeIdeas />} />
      <Route path="/blog/atm-franchise-passive-income" element={<LazyATMFranchisePassiveIncome />} />
      <Route path="/blog/five-step-guide-atm-business" element={<LazyFiveStepGuideATMBusiness />} />
      
      {/* 404 for language routes */}
      <Route path="*" element={<LazyNotFound />} />
    </Routes>
  );
};

// Development mode translation testing
const isDevelopment = import.meta.env.DEV;

const TranslationDebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { i18n } = useTranslation();
  
  if (!isDevelopment) return null;
  
  const testLanguages = [
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'mr', name: 'Marathi' }
  ];
  
  const runComprehensiveTest = () => {
    console.log('🧪 UNIFIED TEST: Testing unified translation system...');
    i18n.changeLanguage('hi');
  };
  
  const preTranslateAllLanguages = async () => {
    console.log('🚀 UNIFIED REFRESH: Refreshing translations...');
    // No auto-refresh to avoid API calls
  };
  
  const clearAllTranslations = async () => {
    console.log('🗑️ CLEAR: This would clear all translations...');
    // Note: We would need to add this method to the comprehensive system
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium"
      >
        🧪 Translation Debug
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
          <h3 className="font-bold mb-3">Translation Debug Panel</h3>
          
          <div className="space-y-2 mb-4">
            <button
              onClick={runComprehensiveTest}
              className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm"
            >
              🧪 Run Comprehensive Test
            </button>
            
            <button
              onClick={preTranslateAllLanguages}
              className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm"
            >
              🚀 Pre-translate All Languages
            </button>
            
            <button
              onClick={clearAllTranslations}
              className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm"
            >
              🗑️ Clear All Translations
            </button>
          </div>
          
            <div className="space-y-1">
              <p className="text-sm font-medium">Quick Test Languages:</p>
              {testLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                >
                  {lang.name} ({lang.code})
                </button>
              ))}
            </div>
          
            <div className="mt-4 text-xs text-gray-600">
              <p>Status: ✅ Ready</p>
              <p>Current: {i18n.language}</p>
            </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  // Initialize monitoring and accessibility
  useMonitoring();
  useAccessibility();
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SecurityHeaders>
            <span />
          </SecurityHeaders>
          <BrowserRouter>
          <AuthProvider>
            <AccessibilityWrapper>
              <FixedLanguageRouter>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen bg-background">
                  <Header />
                  <main className="flex-1 pt-16" role="main">
                    <BreadcrumbNavigation />
                    <Routes>
                      {/* Language-prefixed routes */}
                      <Route path="/:lang/*" element={<LanguageWrappedRoutes />} />
                      
                      {/* Default English routes */}
                      <Route path="/" element={<LazyHome />} />
                      <Route path="/submit-location" element={<LazySubmitLocation />} />
                      <Route path="/become-franchise" element={<LazyBecomefranchise />} />
                      <Route path="/agent" element={<LazyAgent />} />
                      <Route path="/influencer" element={<LazyInfluencer />} />
                       <Route path="/join-us" element={<LazyJoinUsPage />} />
                       <Route path="/join-us/:tab" element={<LazyJoinUsPage />} />
                       <Route path="/join-us/jobs" element={<LazyJobsPage />} />
                      <Route path="/contact-us" element={<LazyContactUs />} />
                      <Route path="/about-us" element={<LazyAboutUs />} />
                      <Route path="/our-products" element={<LazyOurProducts />} />
                      <Route path="/start-atm-business" element={<LazyStartATMPage />} />
                      <Route path="/privacy-policy" element={<LazyPrivacyPolicy />} />
                      <Route path="/terms-conditions" element={<LazyTermsConditions />} />
                      <Route path="/accessibility-statement" element={<LazyAccessibilityStatement />} />
                      <Route path="/refund-policy" element={<LazyRefundPolicy />} />
                      <Route path="/pixellpay-advantage" element={<LazyPixellpayAdvantage />} />
                      <Route path="/jobs" element={<LazyJobsPage />} />
                      
                      {/* Blog routes */}
                      <Route path="/blog" element={<LazyBlogPage />} />
                      <Route path="/blog/perfect-time-side-hustle-2025" element={<LazyPerfectTimeSideHustle2025 />} />
                      <Route path="/blog/passive-income-financial-freedom" element={<LazyPassiveIncomeFinancialFreedom />} />
                      <Route path="/blog/truth-about-passive-income-ideas" element={<LazyTruthAboutPassiveIncomeIdeas />} />
                      <Route path="/blog/atm-franchise-passive-income" element={<LazyATMFranchisePassiveIncome />} />
                      <Route path="/blog/five-step-guide-atm-business" element={<LazyFiveStepGuideATMBusiness />} />
                      
                      {/* Admin routes */}
                      <Route path="/admin" element={<ProtectedRoute><LazyAdminExport /></ProtectedRoute>} />
                      <Route path="/admin/users" element={<ProtectedRoute><LazyAdminUserManagement /></ProtectedRoute>} />
                      
                      
                      {/* 404 page */}
                      <Route path="*" element={<LazyNotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <TranslationDebugPanel />
                  <TranslationStatus />
                </div>
              </FixedLanguageRouter>
            </AccessibilityWrapper>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;