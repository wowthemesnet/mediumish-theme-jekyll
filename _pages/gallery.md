---
layout: page
title: gallery
permalink: /gallery/
description: "ENTER HERE"
comments: false
---

<div class="gallery">
  {% comment %}
    Get all "photo_set" pages and display a list with links to them.
  {% endcomment %}
  {% assign photo_pages = site.pages | where: "layout", "photo_set" %}
  {% for photo_page in photo_pages %}
    <figure>
      <a href="{{ photo_page.url | prepend: site.baseurl }}">
      <img src="{{ site.baseurl }}/assets/images/photos/{{ photo_page.photos.set }}-{{ 0 }}.jpg" alt="Photo {{ 1 }} from {{ page.photos.set | capitalize }}">
      </a>
      <figcaption><a href="{{ photo_page.url | prepend: site.baseurl }}">{{ photo_page.title }}</a></figcaption>
    </figure>
  {% endfor %}
</div>