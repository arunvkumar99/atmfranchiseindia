// Language Reset Utility
export const resetToEnglish = () => {
  // Clear all language-related localStorage items
  const keysToCheck = ['i18nextLng', 'language', 'lang', 'locale'];
  keysToCheck.forEach(key => {
    const value = localStorage.getItem(key);
    if (value && (value === 'ta' || value === 'ta-IN' || value.includes('tamil'))) {
      localStorage.removeItem(key);
      console.log(`[Language Reset] Removed ${key} with value ${value}`);
    }
  });
  
  // Set English explicitly
  localStorage.setItem('i18nextLng', 'en');
  
  // Force page reload if Tamil was detected
  const currentLang = localStorage.getItem('i18nextLng');
  if (currentLang !== 'en') {
    window.location.reload();
  }
};

// Auto-run on page load
if (typeof window !== 'undefined') {
  resetToEnglish();
}
