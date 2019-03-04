---
layout: page
title: Mediumish Template for Jekyll
permalink: /about
comments: true
---

<div class="row justify-content-between">
<div class="col-md-8 pr-5">    

<p>This website is built with Jekyll and Mediumish template for Jekyll. It's for demonstration purposes, no real content can be found. Mediumish template for Jekyll is compatible with Github pages, in fact even this demo is created with Github Pages and hosted with Github.</p>

<p class="mb-5"><img class="shadow-lg" src="{{site.baseurl}}/assets/images/mediumish-jekyll-template.png" alt="jekyll template mediumish" /></p>

<h4 id="features" class="mt-4">Features</h4>

<ul>
<li>Built for Jekyll</li>

<li>Compatible with Github pages</li>

<li>Featured Posts</li>

<li>Index Pagination</li>

<li>SEO</li>

<li>Feed</li>

<li>Sitemap</li>

<li>Post Share</li>

<li>Post Categories</li>

<li>Prev/Next Link</li>

<li>Category Archives (Compatible with Github pages)</li>

<li>Jumbotron Categories</li>

<li>Post Reviews with Stars</li>

<li>Blurred Spoilers</li>

<li>Integrations:


<ul>
<li>Disqus Comments</li>

<li>Google Analaytics</li>

<li>Mailchimp Integration</li></ul>
</li>

<li>Design Features:


<ul>
<li>Bootstrap v4.x</li>

<li>Font Awesome</li>

<li>Masonry</li></ul>
</li>

<li>Layouts:


<ul>
<li>Default</li>

<li>Post</li>

<li>Page</li>

<li>Archive</li>

<li>Categories (for 100% compatibility with Github pages)</li>

</ul>
</li>
</ul>

<h4 id="howtouse">What's Jekyll</h4>

<p>If you aren't familiar with Jekyll yet, you should know that it is a static site generator. It will transform your plain text into static websites and blogs. No more databases, slow loading websites, risk of being hacked...just your content. And not only that, with Jekyll you get free hosting with GitHub Pages! This page itself is free hosted on Github with the help of Jekyll and Mediumish template that you're currently previewing. If you are a beginner we recommend you start with <a target="_blank" href="https://jekyllrb.com/docs/installation/">Jekyll's Docs</a>. Now if you know how to use Jekyll, let's move on to using Mediumish template in Jekyll:</p>

<h4 id="usingmediumish">How to use "Mediumish" theme</h4>

<ol>
<li><a href="https://github.com/wowthemesnet/mediumish-theme-jekyll/archive/master.zip">Download</a> or <code>git clone https://github.com/wowthemesnet/mediumish-theme-jekyll.git</code></li>

<li><code>cd mediumish-theme-jekyll</code></li>

<li><code>bundle</code></li>

<li>Edit <code>_config.yml</code> options. If your site is in root: <code>baseurl: ''</code>. Also, change your Google Analytics code, disqus username, authors, Mailchimp list etc.</li>

<li><code>jekyll serve --watch</code></li>

<li>Start by adding your <code>.md</code> files in <code>_posts</code>. Mediumish already has a few examples. </li>

<li>YAML front matter

<ul>
<li>featured post - <code>featured:true</code></li>

<li>exclude featured post from "All stories" loop to avoid duplicated posts - <code>hidden:true</code></li>

<li>post image - <code>image: assets/images/mypic.jpg</code></li>

<li>external post image - <code>image: "https://externalwebsite.com/image4.jpg"</code></li>

<li>page comments - <code>comments:true</code></li>

<li>meta description (optional) - <code>description: "this is my meta description"</code></li></ul></li>
</ol>

<h5 id="yamlpostexample">YAML Post Example:</h5>

<pre><code>---
layout: post
title:  "We all wait for summer"
author: john
categories: [ Jekyll, tutorial ]
image: assets/images/5.jpg
description: "Something about this post here"
rating: 4.5
---
</code></pre>

<h5 id="yamlpageexample">YAML Page Example</h5>

<pre><code>---
layout: page
title: Mediumish Template for Jekyll
comments: true
---
</code></pre>


<h4>Questions or bug reports?</h4>

Head over to our <a href="https://github.com/wowthemesnet/mediumish-theme-jekyll">Github repository</a>!

</div>

<div class="col-md-4">
    
<div class="sticky-top sticky-top-80">
<h5>Buy me a coffee</h5>

<p>Thank you for your support! Your donation helps me to maintain and improve <a target="_blank" href="https://github.com/wowthemesnet/mediumish-theme-jekyll">Mediumish <i class="fab fa-github"></i></a>.</p>

<a target="_blank" href="https://www.wowthemes.net/donate/" class="btn btn-danger">Buy me a coffee</a>

</div>
</div>
</div>
