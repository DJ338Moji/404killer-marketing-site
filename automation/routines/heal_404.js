const shopifyClient = require('../core/shopify_client');
const crawler = require('../core/crawler');
const config = require('../config');
const fs = require('fs');
const path = require('path');

async function heal404s(brokenUrls = [], dryRun = false) {
  console.log(`🔧 [Routine 3] Initiating automated 404 self-healing for ${brokenUrls.length} broken links...`);
  const healedActions = [];

  if (!brokenUrls || brokenUrls.length === 0) {
    console.log('No broken 404 URLs to heal.');
    return healedActions;
  }

  // 1. Fetch existing redirects to avoid duplicates
  let existingRedirects = [];
  try {
    existingRedirects = await shopifyClient.listRedirects();
  } catch (err) {
    console.warn(`Could not load redirects: ${err.message}`);
  }

  const existingPaths = new Set(existingRedirects.map(r => r.path.toLowerCase()));

  for (const broken of brokenUrls) {
    // Only heal true 404 errors, not authentication or session redirect flows
    if (broken.status && broken.status !== 404) {
      continue;
    }

    const rawUrl = broken.url || broken;
    let urlObj;
    try {
      urlObj = new URL(rawUrl);
    } catch (e) {
      console.warn(`Invalid URL format: ${rawUrl}`);
      continue;
    }

    // Only auto-heal renuiq.com paths
    if (!urlObj.hostname.includes('renuiq.com') && !urlObj.hostname.includes('myshopify.com')) {
      console.log(`Skipping non-Shopify domain: ${urlObj.hostname}`);
      continue;
    }

    const brokenPath = urlObj.pathname;
    // Skip customer account login paths which redirect by design
    if (brokenPath.startsWith('/customer_authentication') || brokenPath.startsWith('/account')) {
      continue;
    }

    if (existingPaths.has(brokenPath.toLowerCase())) {
      console.log(`Redirect already exists for path: ${brokenPath}`);
      continue;
    }

    // Determine target redirect based on path structure
    let target = '/';
    let remediationType = '301 Redirect to Fallback';

    if (brokenPath.startsWith('/blogs/news')) {
      target = '/blogs/news/barrier-repair-guide';
      remediationType = 'Shopify 301 Redirect to Barrier Repair Guide';
    } else if (brokenPath.startsWith('/products/')) {
      target = '/collections/all';
      remediationType = 'Shopify 301 Redirect to All Products Collection';
    } else if (brokenPath.startsWith('/collections/')) {
      target = '/collections/all';
      remediationType = 'Shopify 301 Redirect to Catalog Root';
    }

    console.log(`Auto-healing 404: "${brokenPath}" -> "${target}" (${remediationType})...`);

    if (!dryRun) {
      try {
        const createRes = await shopifyClient.createRedirect(brokenPath, target);
        if (createRes.status === 201 || createRes.status === 200) {
          // Verify that the link now resolves cleanly
          const verifyResult = await crawler.testUrl(`${config.shopify.primaryDomain}${brokenPath}`);
          healedActions.push({
            type: remediationType,
            source: brokenPath,
            target: target,
            verified: !verifyResult.is404,
            finalStatus: verifyResult.status
          });
          console.log(`✅ Successfully healed "${brokenPath}"! Verified final status: ${verifyResult.status}`);
        } else {
          console.error(`Failed to create redirect for ${brokenPath}:`, createRes.body || createRes.raw);
        }
      } catch (e) {
        console.error(`Error healing ${brokenPath}:`, e.message);
      }
    } else {
      healedActions.push({
        type: `[DRY-RUN] ${remediationType}`,
        source: brokenPath,
        target: target,
        verified: true,
        finalStatus: 'DRY_RUN'
      });
    }
  }

  console.log(`✅ [Routine 3 Completed] Total remediations performed: ${healedActions.length}`);
  return healedActions;
}

module.exports = heal404s;
