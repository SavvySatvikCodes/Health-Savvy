const CACHE_NAME = 'health-savvy-v2';

const STATIC_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap',
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // 🚨 THE MAGIC FIX: TELL THE BROWSER TO IGNORE FIREBASE AUTH & DATABASE 🚨
  if (url.includes('firestore.googleapis.com') || 
      url.includes('identitytoolkit.googleapis.com') || 
      url.includes('securetoken.googleapis.com') ||
      url.includes('google.com/recaptcha') ||
      url.startsWith('chrome-extension://')) {
    return; // Let it pass through normally!
  }

  // Never cache your core files so updates happen instantly
  if (url.endsWith('index.html') || url.endsWith('sw.js') || url.endsWith('manifest.json')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Standard caching for everything else
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (event.request.method === 'GET' && response.status === 200 && event.request.url.startsWith('http')) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    })
  );
});
