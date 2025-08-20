// Comprehensive route testing script
const routes = [
  '/',
  '/franchise',
  '/agent',
  '/influencer',
  '/join',
  '/jobs',
  '/contact',
  '/about',
  '/products',
  '/start-atm',
  '/submit-location',
  '/pixellpay-advantage',
  '/blog',
  '/privacy',
  '/terms',
  '/refund',
  '/accessibility',
  // Test with language prefixes
  '/hi',
  '/hi/franchise',
  '/hi/agent',
  '/hi/jobs',
  '/en',
  '/en/franchise',
  '/en/jobs'
];

async function testAllRoutes() {
  const baseUrl = 'http://localhost:8082';
  const results = [];
  
  console.log('Testing all routes...\n');
  
  for (const route of routes) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      const text = await response.text();
      
      // Check for common error patterns
      const hasHookError = text.includes('Invalid hook call');
      const hasDebugComponents = text.includes('translationvalidator') || text.includes('translationdebug');
      const hasSupabaseError = text.includes('supabase is not defined');
      const hasTranslationKeys = text.includes('components.') && text.includes('.text');
      
      const issues = [];
      if (hasHookError) issues.push('Hook Error');
      if (hasDebugComponents) issues.push('Debug Components');
      if (hasSupabaseError) issues.push('Supabase Error');
      if (hasTranslationKeys) issues.push('Missing Translations');
      
      const status = issues.length === 0 ? '✅ OK' : `❌ Issues: ${issues.join(', ')}`;
      
      console.log(`${route.padEnd(25)} - Status: ${response.status} - ${status}`);
      
      results.push({
        route,
        status: response.status,
        issues,
        ok: issues.length === 0
      });
      
    } catch (error) {
      console.log(`${route.padEnd(25)} - ❌ Error: ${error.message}`);
      results.push({
        route,
        error: error.message,
        ok: false
      });
    }
  }
  
  // Summary
  console.log('\n=== TEST SUMMARY ===');
  const failedRoutes = results.filter(r => !r.ok);
  console.log(`Total Routes Tested: ${routes.length}`);
  console.log(`Passed: ${results.filter(r => r.ok).length}`);
  console.log(`Failed: ${failedRoutes.length}`);
  
  if (failedRoutes.length > 0) {
    console.log('\nFailed Routes:');
    failedRoutes.forEach(r => {
      console.log(`  - ${r.route}: ${r.issues ? r.issues.join(', ') : r.error}`);
    });
  }
}

// Run with: node test-all-routes.js
testAllRoutes().catch(console.error);