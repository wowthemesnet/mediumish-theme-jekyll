---
layout: categories
title: Categories
permalink: /categories
---

<!-- BAD -- calculating "all_keywords" twice on this page...
		- NEED way to compute all_keywords at run time and assign as layout front_matter variable in "default.html"
-->
{% include allkeywords.html %} <!-- defines 'all_keywords' var -->



<!-- Create Table of Contents (toc) -->
<div class="toc mt-4 mb-4 lead">

    <h3 class="font-weight-bold">Categories</h3>

<!--
	- ul ==> NOT AN UNORDERED LIST... 
	- When more categories, may need to change to real table - decrease height of toc...
-->
	    <ul>
		{% for category in all_keywords %}
			<li><a href="#{{ category | replace: " ","-" }}"><span class="text-capitalize">{{ category }}</span></a></li>
		{% endfor %}
		</ul>

</div>
