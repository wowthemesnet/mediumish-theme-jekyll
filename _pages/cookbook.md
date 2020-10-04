---
layout: page
title: Your Cookbook
permalink: /cookbook
comments: false
cache: always
---

This is your cookbook, it is all the pages you have "saved"

These pages are available even when you have no data connection, or have no signal on your device

#### Table of Contents

<div>
<ol id="cacheList">
</ol>
</div>

<script>
    const alwaysCachedPages = [ 
        {% for page in site.pages %}{% if page.cache == "always" %}
        '{{ page.url }}',
        {% endif %}{% endfor %}
        ''
     ]

    async function renderCurrentKeys() {
        let list = document.querySelector('#cacheList');

        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }

        const results = [];
        const cache = await caches.open(cacheName);
        for (const request of await cache.keys()) {
            const match = request.url.match(/\/\/(.*?)\/(.*)/);
            if (match) {
                const path = match[2];
                if (!(alwaysCachedPages.includes('/' + path) || path.startsWith('assets/'))) {
                    const response = await cache.match(request);
                    const body = await response.text();
                    const titleMatch = body.match(/<title>(.*)\|(.*?)<\/title>/);
                    const title = (titleMatch != null) ? titleMatch[1] : request.url;
                    const authorMatch = body.match(/<a class="link-dark" href=(.*?)>(.*?)<\/a>/);
                    const author = (authorMatch != null) ? authorMatch[2] : 'none';
                    const publishedMatch = body.match(/<span class="post-date">(.*)<\/span>/);
                    const published = (publishedMatch != null) ? publishedMatch[1] : '';
                    results.push({
                        path,
                        title,
                        url: request.url,
                        author,
                        published,
                        visited: new Date(response.headers.get('date'))
                    });
                }
            }
        }
        if (results.length) {
            list.innerHTML = results
                .sort((a, b) => a.title > b.title ? 1 : -1)
                .map(res => {
                    let html = `<li><a href="${res.url}">${res.title}</a> <span><small> published by ${res.author} on ${res.published}, last visited ${res.visited.toISOString().substring(0, 10)}</small></span> <button class="btn btn-lg trash" onclick="removeFromCache('${res.url}'); renderCurrentKeys();"> </button></li>`;
                    return html;
                })
                .join('\n');
        }
    }

    window.addEventListener('load', () => {
        renderCurrentKeys();
    });
</script>
