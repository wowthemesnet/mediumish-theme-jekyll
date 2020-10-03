var cacheName = 'campfire-v1';

var contentToCache = [
    '/assets/css/screen.css',
    '/assets/css/main.css',
    '/assets/js/jquery.min.js',
    '/assets/js/mediumish.js',
    '/assets/images/logo.webp',
    '/recipes',
    '/planning',
    '/'
];

self.addEventListener(
    'install',
    (e) => {
        console.log('Service Worker Installed');
        e.waitUntil(
            caches.open(cacheName)
                .then((cache) => {
                    console.log('Service Worker Caching content');
                    return cache.addAll(contentToCache);
                }
            )
        );
    }
);

self.addEventListener(
    'fetch',
    (e) => {
        e.respondWith(
            caches.match(e.request)
                .then(function(response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(e.request)
                    ;
                        // .then((response) => {
                        //     //if in patterns to cache
                        //     return caches.open(cacheName)
                        //         .then((cache) => {
                        //             console.log('Service Worker Caching new resource: ' + e.request.url);
                        //             //cache.put(e.request, response.clone());
                        //         });
                        // })
                        // .catch((response) => {
                        //     return caches.match('/offline.html');
                        // });
                })
            
        );
    }
);
