// 適時開示ウォッチは https://saradalog.github.io/kaiji-watch/ へ移った。古い登録を自分で外す
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('kaiji-shell-')).map(k => caches.delete(k)))).then(() => self.registration.unregister())); });
