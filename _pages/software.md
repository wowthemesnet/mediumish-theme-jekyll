---
title: Software
layout: page
permalink: /software/
---

{% include collection_include.html collection=site.software %}


<h2>Software</h2>
<ul>
   {% for software in site.software %}
      <li><a href="{{ software.url }}">{{ software.title }}</a></li>
      {{ software.description }}
   {% endfor %}
</ul>


