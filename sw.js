const cacheName = 'pokedex-2.0.1'

// utlity 
const trace = (x, y) => {
  return y;
}

const urlsToCache = new Set([
  "/",
  "/api/",
  "/berry/",
  "/Favicon/",
  "/move/",
  "/pokemon/",
  "/pokemon.js",
  "/pokemon.css",
  "/move.js",
  "/berry.js",
  "/jscolor.js",
  "/index.html",
  self.location.href
].map(u => new URL(u, self.location.href).href))


self.addEventListener('install', event => {
  console.log(cacheName, 'install', urlsToCache)
  caches.open(cacheName).then(cache =>
    cache.addAll(Array.from(urlsToCache))
  )
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  console.log('% activate')

  // delete "old" cacheName s
  event.waitUntil(
    self.clients.claim().then(_ =>
      caches.keys().then(keys => 
        Promise.all(
          keys.filter(key => cacheName != key).map(key =>
            trace(`# deleting ${key}`, caches.delete(key))
          )
        )
      )
    )
  );
});

const cacheAResponse = (cache, request, response, log) => {
  cache.put(request, response.clone());
  return response;
}

const cacheARequest = request => trace(`+ caching ${request.url}`, 
  caches.open(cacheName).then(cache =>
    fetch(request.clone()).then(response => 
      cacheAResponse(cache, request, response, '* cached ')
    )
  )
);

const tryServingFromCache = request =>
  caches.open(cacheName).then(cache =>
    cache.match(request).then(resp => {
      if(!!resp) {
        return resp;
      } else {
        return fetch(request).then(response => 
          cacheAResponse(cache, request, response, '$ cached ')
        )
      }
    })
  );


self.addEventListener('fetch', event => {
  if(event.request.method != 'GET') {
    event.respondWith(fetch(event.request))
  } else {
    const url = new URL(event.request.url, self.location.href);
    if(['.png', '.jpg'].some(x => url.pathname.endsWith(x))) {
      event.respondWith(tryServingFromCache(event.request));
    } else {
      event.respondWith(navigator.onLine
        ? cacheARequest(event.request)
        : tryServingFromCache(event.request)
      )
    }
  }
});