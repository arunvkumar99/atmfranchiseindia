const fs = require('fs').promises;
const path = require('path');

const files = [
  'src/components/BecomefranchiseHero.tsx',
  'src/components/Footer.tsx',
  'src/components/Hero.tsx',
  'src/components/Services.tsx',
  'src/components/StrategicCrossPageLinks.tsx',
  'src/components/WhyATMFranchiseIndia.tsx'
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

async function updateBreadcrumb() {
  const filePath = 'src/components/BreadcrumbNavigation.tsx';
  const fullPath = path.join(__dirname, '..', filePath);
  let content = await fs.readFile(fullPath, 'utf8');
  
  if (content.includes('import { useLocation, Link } from "react-router-dom"')) {
    content = content.replace(
      'import { useLocation, Link } from "react-router-dom"',
      'import { useLocation } from "react-router-dom";\nimport { Link } from "@/hooks/useLanguageRouter"'
    );
    console.log(`✅ Updated ${filePath}`);
  }
  
  await fs.writeFile(fullPath, content);
}

async function updateStickyHeader() {
  const filePath = 'src/components/StickyHeader.tsx';
  const fullPath = path.join(__dirname, '..', filePath);
  let content = await fs.readFile(fullPath, 'utf8');
  
  if (content.includes('import { Link, useLocation, useNavigate } from "react-router-dom"')) {
    content = content.replace(
      'import { Link, useLocation, useNavigate } from "react-router-dom"',
      'import { useLocation } from "react-router-dom";\nimport { Link, useNavigate } from "@/hooks/useLanguageRouter"'
    );
    console.log(`✅ Updated ${filePath}`);
  }
  
  await fs.writeFile(fullPath, content);
}

async function main() {
  console.log('🔄 Updating component Link imports to use language-aware routing...\n');
  
  for (const file of files) {
    await updateFile(file);
  }
  
  await updateBreadcrumb();
  await updateStickyHeader();
  
  console.log('\n✨ All components updated successfully!');
}

main().catch(console.error);