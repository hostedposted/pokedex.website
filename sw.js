self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(async function(cachedUrls) {
        const cacheKeys = Array.from(urlsToCacheKeys.values());
        const chunckSize = 20;
        const cacheKeysChunks = new Array(Math.ceil(cacheKeys.length / chunckSize)).fill().map(_ => {
          return cacheKeys.splice(0, chunckSize);
        });
        for (let cacheKeys of cacheKeysChunks) {
          await Promise.all(
            cacheKeys.map(function(cacheKey) {
              // If we don't have a key matching url in the cache already, add it.
              if (!cachedUrls.has(cacheKey)) {
                var request = new Request(cacheKey, {credentials: 'same-origin'});
                return fetch(request).then(function(response) {
                  // Bail out of installation unless we get back a 200 OK for
                  // every request.
                  if (!response.ok) {
                    throw new Error('Request for ' + cacheKey + ' returned a ' +
                      'response with status ' + response.status);
                  }

                  return cleanResponse(response).then(function(responseToCache) {
                    return cache.put(cacheKey, responseToCache);
                  });
                });
              }
            })
          );
        }
      });
    }).then(function() {

      // Force the SW to transition from installing -> active state
      return self.skipWaiting();

    })
  );
});