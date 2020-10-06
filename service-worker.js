---
---
const baseToCache = [
    {% for page in site.pages %} {% if page.cache == "always" %}
    '{{ page.url }}',
    {% if page.image %}
    '{{ site.baseurl }}/{{ page.image }}',
    {% endif %}
    {% endif %} {% endfor %}

    '/assets/css/bootstrap.css',
    '/assets/css/fonts.css',
    '/assets/css/main.css',
    '/assets/css/screen.css',
    
    '/assets/js/bootstrap.js',
    '/assets/js/jquery.js',
    '/assets/js/main.js',
    '/assets/js/mediumish.js',

    '/assets/images/jumbotron.webp',
    '/assets/images/logo.webp'
];

const recentPagesToCache = [
    {% for post in site.posts limit:6 %}
    '{{ post.url }}',
    {% endfor %}
];

const recentResourceToCache = [
    {% for post in site.posts limit:6 %}
    {% if post.image %}
    '{{ site.baseurl }}/{{ post.image }}',
    {% endif %}
    {% endfor %}
];

self.addEventListener(
    'install',
    (e) => {
        console.log('Service Worker, installed');
        e.waitUntil(
            caches.open('base-{{ site.pwa.cacheName }}{{ site.pwa.cacheVersion }}')
                .then((cache) => {
                    console.log('Service Worker, base cached');
                    cache.addAll(baseToCache);
                })
        );
        e.waitUntil(
            caches.open('{{ site.pwa.cacheName }}{{ site.pwa.cacheVersion }}')
                .then((cache) => {
                    console.log('Service Worker, recent cached');
                    cache.addAll(recentPagesToCache);
                })
        );
        e.waitUntil(
            caches.open('resource-{{ site.pwa.cacheName }}{{ site.pwa.cacheVersion }}')
                .then((cache) => {
                    console.log('Service Worker, recent resource cached');
                    cache.addAll(recentResourceToCache);
                })
        );
        for (var v = 1; v < {{ site.pwa.cacheVersion }}; v ++) {
            const cacheName = `{{ site.pwa.cacheName }}${v}`;
            e.waitUntil(
                caches.open(`base-${cacheName}`)
                    .then(() => {
                        caches.delete(`base-${cacheName}`).then(() => {
                            console.log(`Service Worker, base-${cacheName} deleted`);
                        })
                    })
            );
            e.waitUntil(
                caches.open(cacheName)
                    .then(() => {
                        caches.delete(cacheName).then(() => {
                            console.log(`Service Worker, ${cacheName} deleted`);
                        })
                    })
            );
            e.waitUntil(
                caches.open(`resource-${cacheName}`)
                    .then(() => {
                        caches.delete(`resource-${cacheName}`).then(() => {
                            console.log(`Service Worker, resource-${cacheName} deleted`);
                        })
                    })
            );
        }
    }
);


self.addEventListener(
    'fetch',
    (e) => {
        //console.log(e.request);
        e.respondWith(
            caches.match(e.request)
                .then(function (response) {
                    if (response) {
                        return response;
                    }
                    return fetch(e.request)
                    // .then((response) => {
                    //     //if in patterns to cache
                    //     return caches.open(`campfire-v${'{{ site.pwa.cacheName }}{{ site.pwa.cacheVersion }}'}`)
                    //         .then((cache) => {
                    //             console.log('Service Worker Caching new resource: ' + e.request.url);
                    //             //cache.put(e.request, response.clone());
                    //         });
                    // })
                    .catch((response) => {
                        return caches.match('/offline');
                    });
                })

        );
    }
);
