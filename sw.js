const CACHE_NAME = 'famipay-public-v1';
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const name of await caches.keys()) {
    if ((name.startsWith('fa-minna-express-') || name.startsWith('famipay-public-')) && name !== CACHE_NAME) await caches.delete(name);
  }
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request, {cache: 'no-cache'});
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      return (await cache.match(request)) || Response.error();
    }
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(self.registration.scope));
});
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data?.json() || {}; } catch (_) { data = {body: event.data?.text()}; }
  event.waitUntil(self.registration.showNotification(data.title || 'FAMIPAY', {
    body: data.body || 'You have a new notification.',
    icon: data.icon || new URL('assets/icons/icon-192x192.png', self.registration.scope).href,
    badge: data.badge || new URL('assets/icons/icon-192x192.png', self.registration.scope).href,
    vibrate: [200, 100, 200], data: {dateOfArrival: Date.now(), primaryKey: 1}
  }));
});
