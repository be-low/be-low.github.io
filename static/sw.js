const appShellFiles = [
  '/assets/icons/icon-192.webp',
  '/assets/icons/icon-512.webp',
  '/app.js',
  '/index.html',
  '/index.xml',
  '/sitemap.xml',
]

self.addEventListener('install', e => {
  console.log('[Service Worker] Install')
  caches.open('v1').then(cache => {
      return cache.addAll(appShellFiles)
  })
})


self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(resp => {
    // caches.match() always resolves
    // but in case of success response will have value
    if (resp !== undefined) {
      console.log(`Cached ${e.request.url}`)
      return resp;
    } else {
      return fetch(e.request).then(resp_ => {
        console.log(`Fetched ${e.request.url}`)
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        const cached = resp_.clone()
        caches.open('v1').then(cache => {
          cache.put(e.request, cached);
        });
        return resp_;
      }).catch(function () {
        return caches.match('/mock');
      });
    }
  }));
})
