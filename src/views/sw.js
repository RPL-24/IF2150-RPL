// Service Worker ITBELI: menampilkan notifikasi Web Push dari C44 PushNotifikasiAdapter (KF34).
// Hanya menangani push dan klik notifikasi; tidak ada caching/offline.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// Payload JSON: { judul, isi, tautan }
self.addEventListener('push', (event) => {
  let muatan = {};
  if (event.data) {
    try {
      muatan = event.data.json();
    } catch {
      muatan = { isi: event.data.text() };
    }
  }
  const judul = muatan.judul || 'ITBELI';
  const tautan = muatan.tautan || '/';
  event.waitUntil(self.registration.showNotification(judul, { body: muatan.isi || '', data: { tautan } }));
});

// Klik notifikasi: fokus tab ITBELI yang sudah terbuka, atau buka tab baru ke tautan
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const tautan = (event.notification.data && event.notification.data.tautan) || '/';
  const urlTujuan = new URL(tautan, self.location.origin);

  event.waitUntil((async () => {
    const daftarTab = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const tabItbeli = daftarTab.filter((tab) => new URL(tab.url).origin === self.location.origin);

    // Utamakan tab yang sudah berada di halaman tujuan
    const tabTujuan = tabItbeli.find((tab) => new URL(tab.url).pathname === urlTujuan.pathname);
    if (tabTujuan) return tabTujuan.focus();

    if (tabItbeli.length > 0) {
      const tab = await tabItbeli[0].focus();
      try {
        return await tab.navigate(urlTujuan.href);
      } catch {
        return tab; // tab belum dikendalikan Service Worker: cukup difokuskan
      }
    }
    return self.clients.openWindow(urlTujuan.href);
  })());
});
