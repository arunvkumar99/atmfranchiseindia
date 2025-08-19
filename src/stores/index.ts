/**
 * Centralized State Management with Zustand
 * Manages global application state
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { logger } from '@/lib/logger';
import type { FormData } from '@/types';

// ============================================
// UI Store - Manages UI state
// ============================================

interface UIState {
  // Navigation
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  activeModal: string | null;
  
  // Loading states
  isPageLoading: boolean;
  loadingComponents: Set<string>;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  
  // Actions
  toggleMobileMenu: () => void;
  setMobileMenu: (isOpen: boolean) => void;
  toggleSearch: () => void;
  setActiveModal: (modalId: string | null) => void;
  setPageLoading: (isLoading: boolean) => void;
  setComponentLoading: (componentId: string, isLoading: boolean) => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Initial state
      isMobileMenuOpen: false,
      isSearchOpen: false,
      activeModal: null,
      isPageLoading: false,
      loadingComponents: new Set(),
      notifications: [],
      
      // Actions
      toggleMobileMenu: () => set((state) => ({ 
        isMobileMenuOpen: !state.isMobileMenuOpen 
      })),
      
      setMobileMenu: (isOpen) => set({ 
        isMobileMenuOpen: isOpen 
      }),
      
      toggleSearch: () => set((state) => ({ 
        isSearchOpen: !state.isSearchOpen 
      })),
      
      setActiveModal: (modalId) => set({ 
        activeModal: modalId 
      }),
      
      setPageLoading: (isLoading) => set({ 
        isPageLoading: isLoading 
      }),
      
      setComponentLoading: (componentId, isLoading) => set((state) => {
        const newLoadingComponents = new Set(state.loadingComponents);
        if (isLoading) {
          newLoadingComponents.add(componentId);
        } else {
          newLoadingComponents.delete(componentId);
        }
        return { loadingComponents: newLoadingComponents };
      }),
      
      addNotification: (type, message) => set((state) => {
        const notification = {
          id: Date.now().toString(),
          type,
          message,
          timestamp: Date.now(),
        };
        
        logger.info('Notification added', notification, 'UIStore');
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          useUIStore.getState().removeNotification(notification.id);
        }, 5000);
        
        return { 
          notifications: [...state.notifications, notification] 
        };
      }),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      })),
      
      clearNotifications: () => set({ 
        notifications: [] 
      }),
    }),
    {
      name: 'ui-store',
    }
  )
);

// ============================================
// Form Store - Manages form state and drafts
// ============================================

interface FormState {
  // Form drafts (persisted)
  drafts: Record<string, FormData>;
  
  // Form submission history
  submissionHistory: Array<{
    formName: string;
    timestamp: number;
    success: boolean;
  }>;
  
  // Active forms
  activeForms: Set<string>;
  
  // Actions
  saveDraft: (formName: string, data: FormData) => void;
  loadDraft: (formName: string) => FormData | null;
  clearDraft: (formName: string) => void;
  recordSubmission: (formName: string, success: boolean) => void;
  setFormActive: (formName: string, isActive: boolean) => void;
  isFormActive: (formName: string) => boolean;
  getRecentSubmissions: (formName?: string) => typeof FormState.prototype.submissionHistory;
}

export const useFormStore = create<FormState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        drafts: {},
        submissionHistory: [],
        activeForms: new Set(),
        
        // Actions
        saveDraft: (formName, data) => {
          set((state) => ({
            drafts: {
              ...state.drafts,
              [formName]: data,
            },
          }));
          logger.debug('Form draft saved', { formName }, 'FormStore');
        },
        
        loadDraft: (formName) => {
          const draft = get().drafts[formName];
          if (draft) {
            logger.debug('Form draft loaded', { formName }, 'FormStore');
          }
          return draft || null;
        },
        
        clearDraft: (formName) => {
          set((state) => {
            const newDrafts = { ...state.drafts };
            delete newDrafts[formName];
            return { drafts: newDrafts };
          });
          logger.debug('Form draft cleared', { formName }, 'FormStore');
        },
        
        recordSubmission: (formName, success) => {
          set((state) => ({
            submissionHistory: [
              ...state.submissionHistory,
              {
                formName,
                timestamp: Date.now(),
                success,
              },
            ].slice(-50), // Keep last 50 submissions
          }));
          logger.info('Form submission recorded', { formName, success }, 'FormStore');
        },
        
        setFormActive: (formName, isActive) => {
          set((state) => {
            const newActiveForms = new Set(state.activeForms);
            if (isActive) {
              newActiveForms.add(formName);
            } else {
              newActiveForms.delete(formName);
            }
            return { activeForms: newActiveForms };
          });
        },
        
        isFormActive: (formName) => {
          return get().activeForms.has(formName);
        },
        
        getRecentSubmissions: (formName) => {
          const history = get().submissionHistory;
          if (formName) {
            return history.filter((s) => s.formName === formName);
          }
          return history;
        },
      }),
      {
        name: 'form-store',
        partialize: (state) => ({
          drafts: state.drafts,
          submissionHistory: state.submissionHistory,
        }),
      }
    ),
    {
      name: 'form-store',
    }
  )
);

// ============================================
// App Store - Manages application-wide state
// ============================================

interface AppState {
  // App metadata
  version: string;
  lastVisit: number | null;
  visitCount: number;
  
  // User preferences (persisted)
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  
  // Feature flags
  features: {
    enableAnalytics: boolean;
    enableNewsletter: boolean;
    enableChat: boolean;
  };
  
  // Actions
  updatePreference: <K extends keyof AppState['preferences']>(
    key: K,
    value: AppState['preferences'][K]
  ) => void;
  toggleFeature: (feature: keyof AppState['features']) => void;
  recordVisit: () => void;
  resetPreferences: () => void;
}

const defaultPreferences: AppState['preferences'] = {
  language: 'en',
  theme: 'system',
  reducedMotion: false,
  fontSize: 'medium',
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        version: '1.0.0',
        lastVisit: null,
        visitCount: 0,
        preferences: defaultPreferences,
        features: {
          enableAnalytics: true,
          enableNewsletter: true,
          enableChat: false,
        },
        
        // Actions
        updatePreference: (key, value) => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              [key]: value,
            },
          }));
          logger.info('Preference updated', { key, value }, 'AppStore');
        },
        
        toggleFeature: (feature) => {
          set((state) => ({
            features: {
              ...state.features,
              [feature]: !state.features[feature],
            },
          }));
        },
        
        recordVisit: () => {
          set((state) => ({
            lastVisit: Date.now(),
            visitCount: state.visitCount + 1,
          }));
        },
        
        resetPreferences: () => {
          set({ preferences: defaultPreferences });
          logger.info('Preferences reset', undefined, 'AppStore');
        },
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          lastVisit: state.lastVisit,
          visitCount: state.visitCount,
          preferences: state.preferences,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
);

// ============================================
// Performance Store - Tracks performance metrics
// ============================================

interface PerformanceState {
  metrics: {
    pageLoadTime: number | null;
    timeToInteractive: number | null;
    firstContentfulPaint: number | null;
    largestContentfulPaint: number | null;
  };
  
  componentRenderTimes: Map<string, number[]>;
  apiCallDurations: Map<string, number[]>;
  
  // Actions
  recordPageLoadTime: (time: number) => void;
  recordComponentRender: (componentName: string, duration: number) => void;
  recordApiCall: (endpoint: string, duration: number) => void;
  getAverageRenderTime: (componentName: string) => number | null;
  getAverageApiDuration: (endpoint: string) => number | null;
  clearMetrics: () => void;
}

export const usePerformanceStore = create<PerformanceState>()(
  devtools(
    (set, get) => ({
      // Initial state
      metrics: {
        pageLoadTime: null,
        timeToInteractive: null,
        firstContentfulPaint: null,
        largestContentfulPaint: null,
      },
      componentRenderTimes: new Map(),
      apiCallDurations: new Map(),
      
      // Actions
      recordPageLoadTime: (time) => {
        set((state) => ({
          metrics: {
            ...state.metrics,
            pageLoadTime: time,
          },
        }));
        logger.logPerformance('PageLoad', time);
      },
      
      recordComponentRender: (componentName, duration) => {
        set((state) => {
          const times = state.componentRenderTimes.get(componentName) || [];
          const newTimes = [...times, duration].slice(-100); // Keep last 100
          
          const newMap = new Map(state.componentRenderTimes);
          newMap.set(componentName, newTimes);
          
          return { componentRenderTimes: newMap };
        });
      },
      
      recordApiCall: (endpoint, duration) => {
        set((state) => {
          const times = state.apiCallDurations.get(endpoint) || [];
          const newTimes = [...times, duration].slice(-100); // Keep last 100
          
          const newMap = new Map(state.apiCallDurations);
          newMap.set(endpoint, newTimes);
          
          return { apiCallDurations: newMap };
        });
        logger.logPerformance(`API: ${endpoint}`, duration);
      },
      
      getAverageRenderTime: (componentName) => {
        const times = get().componentRenderTimes.get(componentName);
        if (!times || times.length === 0) return null;
        
        const average = times.reduce((a, b) => a + b, 0) / times.length;
        return Math.round(average * 100) / 100;
      },
      
      getAverageApiDuration: (endpoint) => {
        const times = get().apiCallDurations.get(endpoint);
        if (!times || times.length === 0) return null;
        
        const average = times.reduce((a, b) => a + b, 0) / times.length;
        return Math.round(average * 100) / 100;
      },
      
      clearMetrics: () => {
        set({
          metrics: {
            pageLoadTime: null,
            timeToInteractive: null,
            firstContentfulPaint: null,
            largestContentfulPaint: null,
          },
          componentRenderTimes: new Map(),
          apiCallDurations: new Map(),
        });
        logger.info('Performance metrics cleared', undefined, 'PerformanceStore');
      },
    }),
    {
      name: 'performance-store',
    }
  )
);

// ============================================
// Store Hooks for Easy Access
// ============================================

// Selectors for common use cases
export const useIsMobileMenuOpen = () => useUIStore((state) => state.isMobileMenuOpen);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useIsPageLoading = () => useUIStore((state) => state.isPageLoading);
export const useUserPreferences = () => useAppStore((state) => state.preferences);
export const useFormDraft = (formName: string) => useFormStore((state) => state.drafts[formName]);

// Combined selectors
export const useIsAnyLoading = () => {
  const isPageLoading = useUIStore((state) => state.isPageLoading);
  const loadingComponents = useUIStore((state) => state.loadingComponents);
  return isPageLoading || loadingComponents.size > 0;
};

// ============================================
// Store Reset Functions
// ============================================

export const resetAllStores = () => {
  useUIStore.setState({
    isMobileMenuOpen: false,
    isSearchOpen: false,
    activeModal: null,
    isPageLoading: false,
    loadingComponents: new Set(),
    notifications: [],
  });
  
  useFormStore.setState({
    drafts: {},
    submissionHistory: [],
    activeForms: new Set(),
  });
  
  useAppStore.getState().resetPreferences();
  usePerformanceStore.getState().clearMetrics();
  
  logger.info('All stores reset', undefined, 'Store');
};