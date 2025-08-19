const fs = require('fs').promises;
const path = require('path');

const files = [
  'src/pages/AboutUs.tsx',
  'src/pages/AccessibilityStatement.tsx',
  'src/pages/blog/ATMFranchisePassiveIncome.tsx',
  'src/pages/blog/FiveStepGuideATMBusiness.tsx',
  'src/pages/blog/PassiveIncomeFinancialFreedom.tsx',
  'src/pages/blog/PerfectTimeSideHustle2025.tsx',
  'src/pages/blog/TruthAboutPassiveIncomeIdeas.tsx',
  'src/pages/BlogPage.tsx',
  'src/pages/OurProducts.tsx',
  'src/pages/PrivacyPolicy.tsx',
  'src/pages/RefundPolicy.tsx',
  'src/pages/TermsConditions.tsx'
];

async function updateFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  let content = await fs.readFile(fullPath, 'utf8');
  
  // Replace Link import
  if (content.includes('import { Link } from "react-router-dom"')) {
    content = content.replace(
      'import { Link } from "react-router-dom"',
      'import { Link } from "@/hooks/useLanguageRouter"'
    );
    console.log(`✅ Updated ${filePath}`);
  } else {
    console.log(`⏭️  Skipped ${filePath} (pattern not found)`);
  }
  
  await fs.writeFile(fullPath, content);
}

async function updateJoinUsPage() {
  const filePath = 'src/pages/JoinUsPage.tsx';
  const fullPath = path.join(__dirname, '..', filePath);
  let content = await fs.readFile(fullPath, 'utf8');
  
  // Handle JoinUsPage separately as it has multiple imports
  if (content.includes('import { useNavigate, useParams, Link } from "react-router-dom"')) {
    content = content.replace(
      'import { useNavigate, useParams, Link } from "react-router-dom"',
      'import { useParams } from "react-router-dom";\nimport { useNavigate, Link } from "@/hooks/useLanguageRouter"'
    );
    console.log(`✅ Updated ${filePath}`);
  }
  
  await fs.writeFile(fullPath, content);
}

async function main() {
  console.log('🔄 Updating Link imports to use language-aware routing...\n');
  
  for (const file of files) {
    await updateFile(file);
  }
  
  await updateJoinUsPage();
  
  console.log('\n✨ All files updated successfully!');
}

main().catch(console.error);