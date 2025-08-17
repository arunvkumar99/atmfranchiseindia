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
import { ErrorBoundary, AsyncErrorBoundary } from "@/components/ErrorBoundary";
import Header from "./components/Header";
import { BreadcrumbNavigation } from "./components/BreadcrumbNavigation";
import Footer from "./components/Footer";
import FixedLanguageRouter from "./components/FixedLanguageRouter";
import AccessibilityWrapper from "@/components/AccessibilityWrapper";
import { SecurityHeaders } from "@/components/ui/security-headers";
import { withLazyLoading, PageLoader } from "@/components/LazyLoadingWrapper";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { TranslationDebug } from "@/components/TranslationDebug";
import { TranslationValidator } from "@/components/TranslationValidator";

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
const TranslationTest = lazy(() => import("./pages/TranslationTest"));
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
const LazyTranslationTest = withLazyLoading(TranslationTest);
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


const App = () => {
  // Initialize monitoring and accessibility
  useMonitoring();
  useAccessibility();
  return (
    <ErrorBoundary>
      <AsyncErrorBoundary>
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
                        <ErrorBoundary>
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
                      
                      {/* Test route */}
                      {import.meta.env.DEV && <Route path="/test-translations" element={<LazyTranslationTest />} />}
                      
                      {/* Admin routes */}
                      <Route path="/admin" element={<ProtectedRoute><LazyAdminExport /></ProtectedRoute>} />
                      <Route path="/admin/users" element={<ProtectedRoute><LazyAdminUserManagement /></ProtectedRoute>} />
                      
                      
                      {/* 404 page */}
                      <Route path="*" element={<LazyNotFound />} />
                    </Routes>
                        </ErrorBoundary>
                  </main>
                  <Footer />
                  <StickyMobileCTA />
                  {import.meta.env.DEV && <TranslationDebug />}
                  {import.meta.env.DEV && <TranslationValidator />}
                </div>
              </FixedLanguageRouter>
            </AccessibilityWrapper>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </HelmetProvider>
      </AsyncErrorBoundary>
    </ErrorBoundary>
  );
};

export default App;