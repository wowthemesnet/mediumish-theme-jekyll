---
layout: page
title: Destinazioni
permalink: /destinazioni
---

<div class="row">
<div class="col-md-12">

<section class="recent-posts">

    <div class="row listrecent">

        {% for post in site.destinazioni %}
            {% include postbox.html %}
        {% endfor %}

    </div>

</section>

</div>
</div>
