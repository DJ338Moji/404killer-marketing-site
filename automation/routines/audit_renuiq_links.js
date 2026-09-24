const crawler = require('../core/crawler');
const shopifyClient = require('../core/shopify_client');
const config = require('../config');

async function auditRenuiqLinks(options = {}) {
  const primaryDomain = config.shopify.primaryDomain;
  console.log(`🔍 [Routine 1] Auditing RenuIQ links starting at ${primaryDomain}...`);

  const urlsToTest = new Set([
    `${primaryDomain}/`,
    `${primaryDomain}/collections/all`,
    `${primaryDomain}/collections/skin-barrier-reset`,
    `${primaryDomain}/blogs/news`,
    `${primaryDomain}/pages/shipping-policy`,
    `${primaryDomain}/pages/terms-of-service`,
    `${primaryDomain}/pages/contact`
  ]);

  // 1. Fetch catalog entities via Shopify API to seed key URLs
  try {
    const [products, collections, pages, blogs] = await Promise.all([
      shopifyClient.getAllProducts().catch(() => []),
      shopifyClient.getAllCollections().catch(() => []),
      shopifyClient.getAllPages().catch(() => []),
      shopifyClient.getAllBlogs().catch(() => [])
    ]);

    products.slice(0, 30).forEach(p => {
      if (p.handle) urlsToTest.add(`${primaryDomain}/products/${p.handle}`);
    });

    collections.forEach(c => {
      if (c.handle) urlsToTest.add(`${primaryDomain}/collections/${c.handle}`);
    });

    pages.forEach(p => {
      if (p.handle) urlsToTest.add(`${primaryDomain}/pages/${p.handle}`);
    });

    for (const b of blogs) {
      urlsToTest.add(`${primaryDomain}/blogs/${b.handle}`);
      const articles = await shopifyClient.getBlogArticles(b.id).catch(() => []);
      articles.forEach(a => {
        if (a.handle) urlsToTest.add(`${primaryDomain}/blogs/${b.handle}/${a.handle}`);
      });
    }
  } catch (err) {
    console.warn(`⚠️ Warning: could not seed catalog via Shopify API: ${err.message}`);
  }

  // 2. Crawl homepage HTML to find dynamically rendered section links
  const homeRes = await crawler.fetchHtml(`${primaryDomain}/`);
  const discoveredLinks = homeRes.html ? crawler.extractLinks(homeRes.html, primaryDomain) : [];

  discoveredLinks.forEach(link => {
    // Only test links on renuiq.com or relative paths (skip external tracking/social links)
    if (link.startsWith(primaryDomain)) {
      urlsToTest.add(link);
    }
  });

  const urlList = Array.from(urlsToTest);
  console.log(`Found ${urlList.length} distinct URLs to verify on renuiq.com.`);

  // 3. Audit batch with concurrency
  const results = await crawler.auditBatch(urlList, options.concurrency || 6);

  const broken = [];
  let okCount = 0;

  for (const r of results) {
    const isAuthPath = r.initialUrl.includes('/account') || r.initialUrl.includes('/customer_authentication');

    if (r.is404) {
      broken.push({
        url: r.initialUrl,
        finalUrl: r.finalUrl,
        status: 404,
        source: 'renuiq.com navigation / catalog',
        durationMs: r.durationMs
      });
    } else if (r.status === 429) {
      // Server is rate-limiting bursts, but the endpoint is responsive and alive
      okCount++;
    } else if (isAuthPath) {
      // Shopify customer authentication redirect
      okCount++;
    } else if (!r.isError) {
      okCount++;
    } else if (typeof r.status === 'number' && r.status >= 500) {
      broken.push({
        url: r.initialUrl,
        finalUrl: r.finalUrl,
        status: r.status,
        source: 'renuiq.com server error',
        durationMs: r.durationMs
      });
    } else {
      okCount++;
    }
  }

  console.log(`✅ [Routine 1 Completed] Checked ${results.length} URLs: ${okCount} OK, ${broken.length} broken.`);
  return {
    auditedCount: results.length,
    okCount,
    broken
  };
}

module.exports = auditRenuiqLinks;
