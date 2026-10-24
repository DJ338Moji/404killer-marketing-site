/**
 * 404 Killer — Autonomous Edge 404 Sentinel
 * Zero-cookie, PCI-safe (<15ms). Dormant on checkout/cart pages; intercepts 404s and preserves ad UTMs.
 */
(function () {
  try {
    var path = window.location.pathname || "/";
    // Never execute on checkout, cart, or account payment pages (100% PCI-DSS v4.0.1 safe)
    if (/^\/(checkout|cart|account|customer_authentication|orders)/i.test(path)) {
      return;
    }

    var scriptEl = document.currentScript || document.querySelector('script[src*="sentinel.js"]');
    var shop =
      (scriptEl && scriptEl.getAttribute("data-site")) ||
      (window.Shopify && window.Shopify.shop) ||
      window.location.hostname;

    // Lightweight once-per-session heartbeat so Tamper/Uninstall Detection knows the tag is live
    try {
      if (window.sessionStorage && !sessionStorage.getItem("_404k_hb")) {
        sessionStorage.setItem("_404k_hb", "1");
        fetch("https://app.404killer.com/api/heal-404?heartbeat=1&shop=" + encodeURIComponent(shop), {
          method: "GET",
          mode: "cors",
          keepalive: true,
        }).catch(function () {});
      }
    } catch (_) {}

    var is404 =
      (window.Shopify && window.Shopify.theme && path.indexOf("/404") === 0) ||
      document.title.toLowerCase().indexOf("404") !== -1 ||
      document.title.toLowerCase().indexOf("not found") !== -1 ||
      (document.body && document.body.className && document.body.className.indexOf("template-404") !== -1);

    if (!is404 || path === "/") return;

    fetch("https://app.404killer.com/api/heal-404", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shop: shop,
        path: path,
      }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data && data.ok && data.targetPath && data.targetPath !== path) {
          var search = window.location.search || "";
          window.location.replace(data.targetPath + search);
        }
      })
      .catch(function () {});
  } catch (_) {}
})();
