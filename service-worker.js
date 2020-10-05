---
---
var baseCacheName = 'campfire-base-v2';
var cacheName = 'campfire-v2';
var prevBaseCacheName = 'campfire-base-v1';
var prevCacheName = 'campfire-v1';

var baseToCache = [
    {% for page in site.pages %} {% if page.cache == "always" %}
    '{{ page.url }}',
    {% endif %} {% endfor %}

    '/assets/css/bootstrap.css',
    '/assets/css/fonts.css',
    '/assets/css/main.css',
    '/assets/css/screen.css',
    
    '/assets/js/bootstrap.js',
    '/assets/js/jquery.js',
    '/assets/js/main.js',
    '/assets/js/mediumish.js',

    '/assets/images/logo.webp'
];

var recentToCache = [
    {% for post in site.posts limit:6 %}
    '{{ post.url }}',
    {% endfor %}
];

self.addEventListener(
    'install',
    (e) => {
        console.log('Service Worker installed');
        e.waitUntil(
            caches.open(baseCacheName)
                .then((cache) => {
                    console.log('Service Worker, base cached');
                    return cache.addAll(baseToCache);
                })
        );
        e.waitUntil(
            caches.open(cacheName)
                .then((cache) => {
                    console.log('Service Worker, recent cached');
                    return cache.addAll(recentToCache);
                })
        );
        e.waitUntil(
            caches.open(prevBaseCacheName)
                .then(() => {
                    caches.delete(prevBaseCacheName).then(() => {
                        console.log('Service Worker, previous base cache deleted');
                    })
                })
        );
        e.waitUntil(
            caches.open(prevCacheName)
                .then(() => {
                    caches.delete(prevCacheName).then(() => {
                        console.log('Service Worker, previous cache deleted');
                    })
                })
        );
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
                    return fetch(e.request);
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
