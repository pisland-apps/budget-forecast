const CACHE_NAME = 'budget-forecast-v2';

// 动态计算基础路径，适配 GitHub Pages 子目录部署
const BASE = self.location.pathname.replace(/[^/]+$/, '');

const STATIC_ASSETS = [
  `${BASE}`,
  `${BASE}index.html`,
  `${BASE}manifest.json`,
  `${BASE}icons/icon-72x72.png`,
  `${BASE}icons/icon-96x96.png`,
  `${BASE}icons/icon-128x128.png`,
  `${BASE}icons/icon-144x144.png`,
  `${BASE}icons/icon-152x152.png`,
  `${BASE}icons/icon-192x192.png`,
  `${BASE}icons/icon-384x384.png`,
  `${BASE}icons/icon-512x512.png`
];

const CDN_HOSTS = [
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).catch((err) => {
      console.warn('[SW] Pre-cache failed for some assets:', err);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 同源静态资源 -> CacheFirst
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // CDN 资源 -> StaleWhileRevalidate
  if (CDN_HOSTS.some((host) => url.hostname.includes(host))) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // 其他请求 -> NetworkFirst
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
