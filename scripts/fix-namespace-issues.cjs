const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}     FIXING NAMESPACE ISSUES IN COMPONENTS${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

const fixes = [
  {
    file: 'src/components/EnhancedFormWrapper.tsx',
    from: "const { t } = useTranslation()",
    to: "const { t } = useTranslation('forms')",
    description: 'EnhancedFormWrapper - Use forms namespace'
  },
  {
    file: 'src/components/FormProgress.tsx',
    from: "const { t } = useTranslation()",
    to: "const { t } = useTranslation('forms')",
    description: 'FormProgress - Use forms namespace'
  },
  {
    file: 'src/components/UnifiedForm.tsx',
    from: "const { t } = useTranslation()",
    to: "const { t } = useTranslation('forms')",
    description: 'UnifiedForm - Use forms namespace'
  },
  {
    file: 'src/pages/PixellpayAdvantage.tsx',
    from: "const { t } = useTranslation()",
    to: "const { t } = useTranslation('pixellpay')",
    description: 'PixellpayAdvantage - Use pixellpay namespace'
  },
  {
    file: 'src/pages/PrivacyPolicy.tsx',
    from: "const { t } = useTranslation()",
    to: "const { t } = useTranslation('privacy')",
    description: 'PrivacyPolicy - Use privacy namespace'
  },
  {
    file: 'src/pages/RefundPolicy.tsx',
    from: "const { t } = useTranslation()",
    to: "const { t } = useTranslation('refund')",
    description: 'RefundPolicy - Use refund namespace'
  },
  {
    file: 'src/pages/TermsConditions.tsx',
    from: "const { t } = useTranslation()",
    to: "const { t } = useTranslation('terms')",
    description: 'TermsConditions - Use terms namespace'
  },
  {
    file: 'src/pages/NotFound.tsx',
    from: "const { t } = useTranslation()",
    to: "const { t } = useTranslation('notFound')",
    description: 'NotFound - Use notFound namespace'
  },
  {
    file: 'src/components/Footer.tsx',
    from: "const { t } = useTranslation('footer')",
    to: "const { t } = useTranslation('common')",
    description: 'Footer - Use common namespace'
  }
];

let fixedCount = 0;
let failedCount = 0;

fixes.forEach(fix => {
  const filePath = path.join(__dirname, '..', fix.file);
  
  console.log(`${colors.blue}Processing: ${fix.description}${colors.reset}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ${colors.red}❌ File not found${colors.reset}`);
    failedCount++;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes(fix.from)) {
    // Check if already has the correct namespace
    if (content.includes(fix.to)) {
      console.log(`  ${colors.green}✅ Already using correct namespace${colors.reset}`);
    } else {
      console.log(`  ${colors.yellow}⚠️  Pattern not found, skipping${colors.reset}`);
      failedCount++;
    }
    return;
  }
  
  const newContent = content.replace(fix.from, fix.to);
  fs.writeFileSync(filePath, newContent);
  
  console.log(`  ${colors.green}✅ Fixed: Now using correct namespace${colors.reset}`);
  fixedCount++;
});

console.log(`\n${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                      SUMMARY${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.green}✅ Fixed: ${fixedCount} components${colors.reset}`);
console.log(`${colors.red}❌ Failed/Skipped: ${failedCount} components${colors.reset}`);

if (fixedCount > 0) {
  console.log(`\n${colors.green}Namespace issues resolved!${colors.reset}`);
}

console.log(`\n${colors.blue}Namespace fix complete.${colors.reset}\n`);