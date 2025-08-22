// Production build testing script
const routes = [
  '/',
  '/jobs',
  '/hi/jobs',
  '/franchise',
  '/agent'
];

async function testProduction() {
  const baseUrl = 'http://localhost:4173';
  
  console.log('Testing production build...\n');
  
  for (const route of routes) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      const text = await response.text();
      
      // Check for critical issues
      const hasHookError = text.includes('Invalid hook call');
      const hasDebugComponents = text.includes('translationvalidator.text') || text.includes('translationdebug.text');
      const hasSupabaseError = text.includes('supabase is not defined');
      const hasRuntimeError = text.includes('Uncaught') || text.includes('TypeError');
      
      const issues = [];
      if (hasHookError) issues.push('Hook Error');
      if (hasDebugComponents) issues.push('Debug Components Visible');
      if (hasSupabaseError) issues.push('Supabase Error');
      if (hasRuntimeError) issues.push('Runtime Error');
      
      const status = issues.length === 0 ? '✅ OK' : `❌ Issues: ${issues.join(', ')}`;
      
      console.log(`${route.padEnd(20)} - ${status}`);
      
    } catch (error) {
      console.log(`${route.padEnd(20)} - ❌ Error: ${error.message}`);
    }
  }
}

testProduction().catch(console.error);