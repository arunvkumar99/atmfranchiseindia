// Initialize Unified Translation System
// This replaces all other translation systems

import { unifiedTranslationSystem } from './unifiedTranslationSystem';

console.log('🔧 Initializing Unified Translation System - Production Ready');

// Disable all other translation systems
if (typeof window !== 'undefined') {
  // Override any existing global translation systems
  (window as any).multiLanguageSystem = null;
  (window as any).instantTranslationSystem = null;
  (window as any).preTranslatedSubsiteSystem = null;
  (window as any).robustTranslationSystem = null;
  
  // Initialize the unified system
  unifiedTranslationSystem.initialize();
}

export { unifiedTranslationSystem };