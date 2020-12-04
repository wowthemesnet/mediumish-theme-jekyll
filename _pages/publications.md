---
title: Publications
layout: page
permalink: /publications/
toc: true
---

{% assign pubs= "" | split: "" %}
{% assign other_pubs= "" | split: "" %}
<!-- IF post is not apart of a project ==> display in seperate group -->
{% for post in site.publications %}
	
	{% if post.project %}
	
		{% assign pubs=pubs | push: post %}

	{% else %}

		{% assign other_pubs=other_pubs | push: post %}

	{% endif %}

{% endfor %}

{% if pubs.size > 0 %}
	{% include collection_include.html collection=pubs title=page.title %}
{% endif %}

{% if other_pubs.size > 0 %}
	{% include collection_include.html collection=other_pubs title="Past Publications" %}
{% endif %}
