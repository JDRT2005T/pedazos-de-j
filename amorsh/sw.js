// Service worker de Amorsh: recibe las notificaciones push
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data.json(); } catch (err) { d = { texto: e.data ? e.data.text() : '💗' }; }
  e.waitUntil((async () => {
    const lista = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    lista.forEach(c => c.postMessage({ tipo: 'llego', texto: d.texto }));
    if (self.navigator.setAppBadge) self.navigator.setAppBadge(1).catch(() => {});
    await self.registration.showNotification(d.titulo || 'Amorsh 💗', {
      body: d.texto || '💗',
      icon: 'icon-180.png',
      badge: 'icon-180.png',
      tag: 'amorsh-' + Date.now(),
      data: { url: './' },
    });
  })());
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const lista = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (lista.length) return lista[0].focus();
    return self.clients.openWindow('./');
  })());
});
