---
---
/* service worker */

async function addToCache(urls) {
  const cache = await window.caches.open('{{ site.pwa.cacheName }}{{ site.pwa.cacheVersion }}');
  await cache.addAll(urls);
  await updateCookbookCount();
}

async function removeFromCache(url) {
  const cache = await window.caches.open('{{ site.pwa.cacheName }}{{ site.pwa.cacheVersion }}');
  await cache.delete(url);
  await updateCookbookCount();
}

async function updateCookbookCount() {
  let cookbookCount = document.querySelector('#cookbookCounter');
  caches.open('{{ site.pwa.cacheName }}{{ site.pwa.cacheVersion }}').then((cache) => {
    cache.keys().then((keys) => {
      cookbookCount.innerHTML = keys.length;
    });
  });
}

window.onload = function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function (registration) {
        console.log('Service Worker, registration successful');
      })
      .catch(function (error) {
        console.log('Service worker, registration failed, error:', error);
      });
  }
  updateCookbookCount();
};

/*!
 * IE10 viewport hack for Surface/desktop Windows 8 bug
 * Copyright 2014-2017 The Bootstrap Authors
 * Copyright 2014-2017 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
 (function () {
  'use strict'
  if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement('style')
    msViewportStyle.appendChild(
      document.createTextNode(
        '@-ms-viewport{width:auto!important}'
      )
    )
    document.head.appendChild(msViewportStyle)
  }
}())