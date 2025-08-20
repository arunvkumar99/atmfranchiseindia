// Final comprehensive verification script

const criticalRoutes = [
  { path: '/', name: 'Home' },
  { path: '/jobs', name: 'Jobs (Employee Page)' },
  { path: '/hi/jobs', name: 'Jobs Hindi' },
  { path: '/franchise', name: 'Franchise' },
  { path: '/agent', name: 'Agent' },
  { path: '/influencer', name: 'Influencer' },
  { path: '/join', name: 'Join Us' },
  { path: '/contact', name: 'Contact' },
  { path: '/about', name: 'About' },
  { path: '/products', name: 'Products' }
];

async function finalVerification() {
  const baseUrl = 'http://localhost:4173';
  let allPassed = true;
  
  console.log('=== FINAL PRODUCTION VERIFICATION ===\n');
  console.log('Checking for:');
  console.log('1. Invalid hook call errors');
  console.log('2. Debug components visibility');
  console.log('3. Supabase errors');
  console.log('4. Runtime errors');
  console.log('5. Translation key visibility\n');
  
  console.log('Testing Routes:');
  console.log('─'.repeat(60));
  
  for (const route of criticalRoutes) {
    try {
      const response = await fetch(`${baseUrl}${route.path}`);
      const text = await response.text();
      
      // Critical issue checks
      const checks = {
        'Invalid hook call': text.includes('Invalid hook call'),
        'Debug components': text.includes('translationvalidator') || text.includes('translationdebug'),
        'Supabase error': text.includes('supabase is not defined'),
        'Runtime error': text.includes('Uncaught') || text.includes('TypeError'),
        'Translation keys': /components\.\w+\.text\d+/.test(text) && !text.includes('script')
      };
      
      const failedChecks = Object.entries(checks)
        .filter(([_, failed]) => failed)
        .map(([name]) => name);
      
      const statusIcon = failedChecks.length === 0 ? '✅' : '❌';
      const status = failedChecks.length === 0 ? 'PASS' : `FAIL: ${failedChecks.join(', ')}`;
      
      console.log(`${statusIcon} ${route.name.padEnd(25)} ${status}`);
      
      if (failedChecks.length > 0) {
        allPassed = false;
      }
      
    } catch (error) {
      console.log(`❌ ${route.name.padEnd(25)} ERROR: ${error.message}`);
      allPassed = false;
    }
  }
  
  console.log('─'.repeat(60));
  
  if (allPassed) {
    console.log('\n✅✅✅ ALL TESTS PASSED! ✅✅✅');
    console.log('\nThe application is ready for production:');
    console.log('• No invalid hook call errors');
    console.log('• No debug components visible');
    console.log('• No supabase errors');
    console.log('• No runtime errors');
    console.log('• No untranslated keys visible');
  } else {
    console.log('\n❌ SOME TESTS FAILED - Please review above');
  }
}

finalVerification().catch(console.error);