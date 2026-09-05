const CACHE_NAME = 'poke-tools-cache-v1';
const ASSETS = [
  '/pokemon-tools/',
  '/pokemon-tools/index.html',
  '/pokemon-tools/css/style.css',
  '/pokemon-tools/js/main.js',
  '/pokemon-tools/images/sprite.svg'
];

// 1. インストール時に静的リソースをまとめてキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. アクティベート時に古いキャッシュを自動削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. フェッチ要求（リソース要求）が発生した際、キャッシュ優先で返却
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
