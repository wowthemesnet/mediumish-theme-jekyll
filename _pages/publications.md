---
title: Publications
layout: page
permalink: /publications/
---

{% include collection_include.html collection=site.publications %}


<h2>Publications</h2>
<ul>
   {% for publication in site.publications %}
      <li><a href="{{ publication.url }}">{{ publication.title }}</a></li>
      {{ publication.description }}
   {% endfor %}
</ul>


