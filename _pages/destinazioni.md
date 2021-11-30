---
layout: page
title: Destinazioni
permalink: /destinazioni
---

<div class="row">
<div class="col-md-12">

<section class="recent-posts">

    <div class="row listrecent">

        {% assign destinazioni = site.posts | where:"type","Destinazione" %}
        {% for post in destinazioni %}
            {% if post.type == "Destinazione" %}
                {% include postbox.html %}
            {% endif %}
        {% endfor %}

    </div>

</section>

</div>
</div>
