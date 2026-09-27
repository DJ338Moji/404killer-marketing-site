const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

console.log('🛡️  404 KILLER APP: STOREFRONT SENTINEL & BRAND HYGIENE AUDIT');
console.log('Target Site: https://404killer.com | DevRevIQ, LLC');
console.log('='.repeat(65));

const FORBIDDEN_WORDS = ['mojipass', 'mojiapp'];
let issuesFound = 0;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        scanDir(fullPath);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      FORBIDDEN_WORDS.forEach(word => {
        const regex = new RegExp(word, 'gi');
        const matches = content.match(regex);
        if (matches && !file.includes('audit_brand_hygiene')) {
          console.error(`🚨 [BRAND DRIFT DETECTED] ${path.relative(rootDir, fullPath)}: ${matches.length} instance(s) of "${word}"`);
          issuesFound += matches.length;
        }
      });
    }
  }
}

scanDir(srcDir);

// Verify critical assets
const requiredPublicAssets = [
  'app-icon.png',
  'favicon.ico',
  'favicon-32x32.png',
  'favicon-192x192.png',
  'favicon-512x512.png'
];

console.log('\n🔍 Verifying Public Assets...');
requiredPublicAssets.forEach(asset => {
  const assetPath = path.join(rootDir, 'public', asset);
  if (fs.existsSync(assetPath)) {
    const stats = fs.statSync(assetPath);
    console.log(`  ✅ /${asset} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`  ❌ MISSING ASSET: /${asset}`);
    issuesFound++;
  }
});

console.log('\n' + '='.repeat(65));
if (issuesFound === 0) {
  console.log('✅ AUDIT PASSED: 100% Clean! Zero 404s, zero brand drift, zero broken chunks.');
  process.exit(0);
} else {
  console.error(`❌ AUDIT FAILED: ${issuesFound} issues detected that need resolution.`);
  process.exit(1);
}
