importScripts("/assets/js/workbox-v3.6.3/workbox-sw.js");

workbox.setConfig({modulePathPrefix: "/assets/js/workbox-v3.6.3"});

//self.__precacheManifest = [{"url":"/index.html","revision":"edb2cce04af2e469b72935ca2960308e"},{"url":"/nachos/","revision":"c5233460aad3bda1854faf91bf92912e"},{"url":"/menu-planning-sheet/","revision":"c3472839111eb15082f357ca162dad5a"},{"url":"/beef-stew-and-cornbread/","revision":"791b1d7eeb801afcd9e47f25e00adf2e"},{"url":"/chickpea-and-coconut-curry/","revision":"d3da722408d5c4b99b6b4a8c81246b45"},{"url":"/pineapple-upside-down-dump-cake/","revision":"f28011cd312832161e36069849f06969"}];


import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';

registerRoute(
  ({url}) => url.origin === self.location.origin && url.pathname.startsWith('/static/'),
  new StaleWhileRevalidate({
    cacheName: 'campfire-precache-v1', // Use the same cache name as before.
  })
);

// service-worker.js

// set names for both precache & runtime cache
workbox.core.setCacheNameDetails({
    prefix: 'campfire',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime-cache'
});

// let Service Worker take control of pages ASAP
workbox.skipWaiting();
workbox.clientsClaim();

// let Workbox handle our precache list
workbox.precaching.precacheAndRoute(self.__precacheManifest);

// use `networkFirst` strategy for `*.html`, like all my posts
workbox.routing.registerRoute(
    /\.html$/,
    workbox.strategies.networkFirst()
);

// use `cacheFirst` strategy for images
workbox.routing.registerRoute(
    /assets\/(img|icons)/,
    workbox.strategies.cacheFirst()
);

// third party files
workbox.routing.registerRoute(
    /^https?:\/\/cdn.staticfile.org/,
    workbox.strategies.staleWhileRevalidate()
);
