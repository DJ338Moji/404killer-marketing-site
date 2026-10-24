/**
 * 404 Killer — Autonomous Edge 404 Sentinel
 * Automatically detects storefront 404 pages, reconciles 301 redirects via API, and reroutes shoppers while preserving ad UTMs.
 */
(function () {
  try {
    var is404 =
      (window.Shopify && window.Shopify.theme && window.location.pathname.indexOf("/404") === 0) ||
      document.title.toLowerCase().indexOf("404") !== -1 ||
      document.title.toLowerCase().indexOf("not found") !== -1 ||
      (document.body && document.body.className && document.body.className.indexOf("template-404") !== -1);

    if (!is404) return;

    var scriptEl = document.currentScript || document.querySelector('script[src*="sentinel.js"]');
    var shop =
      (scriptEl && scriptEl.getAttribute("data-site")) ||
      (window.Shopify && window.Shopify.shop) ||
      window.location.hostname;
    var brokenPath = window.location.pathname;

    if (!brokenPath || brokenPath === "/") return;

    fetch("https://app.404killer.com/api/heal-404", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shop: shop,
        path: brokenPath,
      }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data && data.ok && data.targetPath && data.targetPath !== brokenPath) {
          var search = window.location.search || "";
          window.location.replace(data.targetPath + search);
        }
      })
      .catch(function () {});
  } catch (_) {}
})();
