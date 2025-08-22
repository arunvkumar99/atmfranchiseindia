import React, { useLayoutEffect, useMemo, Suspense, lazy } from "react";
import { useTranslation } from 'react-i18next';
import { useMonitoring } from "@/hooks/useMonitoring";
import { useAccessibility } from "@/hooks/useAccessibility";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary, AsyncErrorBoundary } from "@/components/ErrorBoundary";
import Header from "./components/Header";
import { BreadcrumbNavigation } from "./components/BreadcrumbNavigation";
import Footer from "./components/Footer";
import FixedLanguageRouter from "./components/FixedLanguageRouter";
import AccessibilityWrapper from "@/components/AccessibilityWrapper";
import { AccessibilityEnhancements, SkipNavigationLinks, KeyboardNavigationProvider } from "@/components/AccessibilityEnhancements";
import { ResourceHints } from "@/components/PerformanceOptimizations";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { SecurityHeaders } from "@/components/ui/security-headers";
import { withLazyLoading, PageLoader } from "@/components/LazyLoadingWrapper";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { EnsureEnglishDefault } from "@/components/EnsureEnglishDefault";

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
const TranslationVerify = lazy(() => import("./pages/TranslationVerify"));
const TestTranslation = lazy(() => import("./pages/TestTranslation"));
const DesignAudit = lazy(() => import("./pages/DesignAudit"));
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
const LazyNotFound = withLazyLoading(NotFound);
const LazyPrivacyPolicy = withLazyLoading(PrivacyPolicy);
const LazyTermsConditions = withLazyLoading(TermsConditions);
const LazyAccessibilityStatement = withLazyLoading(AccessibilityStatement);
const LazyRefundPolicy = withLazyLoading(RefundPolicy);
const LazyPixellpayAdvantage = withLazyLoading(PixellpayAdvantage);
const LazyJobsPage = withLazyLoading(JobsPage);
const LazyBlogPage = withLazyLoading(BlogPage);
const LazyTranslationTest = withLazyLoading(TranslationTest);
const LazyTranslationVerify = withLazyLoading(TranslationVerify);
const LazyTestTranslation = withLazyLoading(TestTranslation);
const LazyDesignAudit = withLazyLoading(DesignAudit);
const LazyVisualShowcase = withLazyLoading(lazy(() => import('@/pages/VisualShowcase')));
const LazyPerfectTimeSideHustle2025 = withLazyLoading(PerfectTimeSideHustle2025);
const LazyPassiveIncomeFinancialFreedom = withLazyLoading(PassiveIncomeFinancialFreedom);
const LazyTruthAboutPassiveIncomeIdeas = withLazyLoading(TruthAboutPassiveIncomeIdeas);
const LazyATMFranchisePassiveIncome = withLazyLoading(ATMFranchisePassiveIncome);
const LazyFiveStepGuideATMBusiness = withLazyLoading(FiveStepGuideATMBusiness);

// Memoized query client to prevent recreation on every render
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// FIXED: Using useLayoutEffect for DOM manipulation before paint
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Define routes once to prevent duplication
const routeConfig = [
  { path: "/", element: LazyHome },
  { path: "/submit-location", element: LazySubmitLocation },
  { path: "/become-franchise", element: LazyBecomefranchise },
  { path: "/agent", element: LazyAgent },
  { path: "/influencer", element: LazyInfluencer },
  { path: "/join-us", element: LazyJoinUsPage },
  { path: "/join-us/:tab", element: LazyJoinUsPage },
  { path: "/join-us/jobs", element: LazyJobsPage },
  { path: "/contact-us", element: LazyContactUs },
  { path: "/about-us", element: LazyAboutUs },
  { path: "/our-products", element: LazyOurProducts },
  { path: "/start-atm-business", element: LazyStartATMPage },
  { path: "/privacy-policy", element: LazyPrivacyPolicy },
  { path: "/terms-conditions", element: LazyTermsConditions },
  { path: "/accessibility-statement", element: LazyAccessibilityStatement },
  { path: "/refund-policy", element: LazyRefundPolicy },
  { path: "/pixellpay-advantage", element: LazyPixellpayAdvantage },
  { path: "/jobs", element: LazyJobsPage },
  // Blog routes
  { path: "/blog", element: LazyBlogPage },
  { path: "/blog/perfect-time-side-hustle-2025", element: LazyPerfectTimeSideHustle2025 },
  { path: "/blog/passive-income-financial-freedom", element: LazyPassiveIncomeFinancialFreedom },
  { path: "/blog/truth-about-passive-income-ideas", element: LazyTruthAboutPassiveIncomeIdeas },
  { path: "/blog/atm-franchise-passive-income", element: LazyATMFranchisePassiveIncome },
  { path: "/blog/five-step-guide-atm-business", element: LazyFiveStepGuideATMBusiness },
];

// Development-only routes
const devRoutes = import.meta.env.DEV ? [
  { path: "/test-translation", element: LazyTestTranslation },
  { path: "/test-translations", element: LazyTranslationTest },
  { path: "/verify-translations", element: LazyTranslationVerify },
  { path: "/design-audit", element: LazyDesignAudit },
  { path: "/visual-showcase", element: LazyVisualShowcase },
] : [];

// Component to handle language-prefixed routes
const LanguageWrappedRoutes = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  
  useLayoutEffect(() => {
    if (lang && lang !== 'en') {
      // Set language in translation system
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  
  // Render routes using the shared configuration
  return (
    <Routes>
      {routeConfig.map(({ path, element: Element }) => (
        <Route key={path} path={path} element={<Element />} />
      ))}
      {devRoutes.map(({ path, element: Element }) => (
        <Route key={path} path={path} element={<Element />} />
      ))}
      <Route path="*" element={<LazyNotFound />} />
    </Routes>
  );
};

const App = () => {
  // Memoize query client to prevent recreation
  const queryClient = useMemo(() => createQueryClient(), []);
  
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
                <KeyboardNavigationProvider>
                  <AccessibilityWrapper>
                    <EnsureEnglishDefault />
                    <SkipNavigationLinks />
                    <AccessibilityEnhancements />
                    <ResourceHints />
                    {import.meta.env.DEV && <PerformanceMonitor />}
                    <FixedLanguageRouter>
                      <ScrollToTop />
                      <div className="flex flex-col min-h-screen bg-background">
                        <Header />
                        <main id="main-content" className="flex-1 pt-16" role="main" tabIndex={-1}>
                          <BreadcrumbNavigation />
                          <ErrorBoundary>
                            <Routes>
                              {/* Language-prefixed routes */}
                              <Route path="/:lang/*" element={<LanguageWrappedRoutes />} />
                              
                              {/* Default English routes using shared configuration */}
                              {routeConfig.map(({ path, element: Element }) => (
                                <Route key={path} path={path} element={<Element />} />
                              ))}
                              
                              {/* Development routes */}
                              {devRoutes.map(({ path, element: Element }) => (
                                <Route key={path} path={path} element={<Element />} />
                              ))}
                              
                              {/* 404 page */}
                              <Route path="*" element={<LazyNotFound />} />
                            </Routes>
                          </ErrorBoundary>
                        </main>
                        <Footer />
                        <StickyMobileCTA />
                        <PerformanceMonitor />
                      </div>
                    </FixedLanguageRouter>
                  </AccessibilityWrapper>
                </KeyboardNavigationProvider>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </AsyncErrorBoundary>
    </ErrorBoundary>
  );
};

export default App;