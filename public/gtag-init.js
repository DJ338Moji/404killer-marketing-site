// Deferred Google Analytics bootstrap (keeps <head> free of render-blocking inline scripts).
window.dataLayer = window.dataLayer || [];
window.gtag = function gtag() {
  window.dataLayer.push(arguments);
};
window.gtag("js", new Date());
window.gtag("config", "G-1GZME3VSPB");
