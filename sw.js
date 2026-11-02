/* ============================================================
   sw.js — сервис-воркер приложения Fit-check
   ============================================================
   OFFLINE-РЕЖИМ: при первом открытии сайт целиком сохраняется
   в памяти устройства и работает без интернета.

   АВТООБНОВЛЕНИЕ: при каждом изменении каталога я повышаю
   номер версии в CACHE_NAME (ниже) — у всех пользователей
   приложение обновится автоматически при следующем открытии.
   ============================================================ */

const CACHE_NAME = 'fitcheck-v1';

/* Все файлы приложения — сохраняем заранее */
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/monetize.js',
  '/sw.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/img/tg_1659.jpg',
  '/img/tg_1664.jpg',
  '/img/tg_1690.jpg',
  '/img/tg_1729.jpg',
  '/img/tg_1753.jpg',
  '/img/tg_1793.jpg',
  '/img/tg_2094.jpg',
  '/img/tg_2108.jpg',
  '/img/tg_2125.jpg',
  '/img/tg_2254.jpg',
  '/img/tg_2365.jpg',
  '/img/tg_2448.jpg',
  '/img/yt_breakdown.jpg',
  '/img/yt_koncert_ded.jpg',
  '/img/yt_nanana.jpg',
  '/img/yt_prednovogodny.jpg',
  '/img/yt_slezy_aishi.jpg',
  '/img/yt_thai_full.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // внешние ссылки не трогаем

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached || caches.match('/index.html'));
    })
  );
});
