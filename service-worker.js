// Service worker for "Diário de Formação SIXSIS"
// Caches the app shell for offline use. Never intercepts cross-origin
// requests (the Google Apps Script sync calls), so those always go
// straight to the network.

var CACHE_VERSION = "sixsis-diario-v3";
var APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/sixsis-logo.png",
  "./vendor/jspdf.umd.min.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_VERSION; })
          .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;

  // Only handle same-origin GET requests for the app shell.
  // Everything else (in particular the Apps Script sync POST/GET
  // calls, which are cross-origin) is left completely untouched.
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(function (cached) {
      var network = fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE_VERSION).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      }).catch(function () { return cached; });
      // Cache-first for speed & offline reliability; refresh in background.
      return cached || network;
    })
  );
});
