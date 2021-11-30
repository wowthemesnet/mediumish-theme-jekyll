---
layout: page
title: Itinerari
permalink: /itinerari
---

<div class="row">
<div class="col-md-12">

<section class="recent-posts">

    <div class="row listrecent">

        {% assign itinerari = site.posts | where:"type","Itinerario" %}
        {% for post in itinerari %}
            {% if post.type == "Itinerario" %}
                {% include postbox.html %}
            {% endif %}
        {% endfor %}

    </div>

</section>

</div>
</div>
