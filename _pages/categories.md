---
layout: categories
title: Categories
permalink: /categories
---

<!-- Create Table of Contents (toc) -->
<div class="toc mt-4 mb-4 lead">
    <h3 class="font-weight-bold">Categories</h3>

<!--
	- ul ==> NOT AN UNORDERED LIST... 
	- When more categories, may need to change to real table - decrease height of toc...
-->
	    <ul>
		{% for category in site.categories %}
			<li><a href="#{{ category[0] | replace: " ","-" }}"><span class="text-capitalize">{{ category[0] }}</span></a></li>
		{% endfor %}
		</ul>

</div>
