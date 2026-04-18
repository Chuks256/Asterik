const CACHE_NAME = "asterik-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/logo.png",
  "/icons/small.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        }),
      ),
    ),
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  if (!url.startsWith("http")) return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return res;
      })
      .catch(() => caches.match(event.request)),
  );
});
