---
layout: post
title:  "Write a post"
author: aidan
categories: [ Tutorial, Blog ]
tags: [ intermediate, contributing ]
image: false
description: "Welcome to the Mother Tongues blog!"
featured: false
hidden: false
---

Here's a short tutorial on how to write your first blog post on the official Mother Tongues Blog. This tutorial assumes you've already signed up to [become an author]({{site.baseurl}}/become-an-author).

Posts on the Mother Tongues Blog are written in [Markdown](https://en.wikipedia.org/wiki/Markdown).

In order to write a new post, follow the following steps.

1. In your fork of the [Mother Tongues Blog Respository](https://github.com/roedoejet/mothertongues-blog), make sure you're in the `dev.author` branch and add a new post to the `_posts` folder. Your post file name must by [slugified](https://blog.tersmitten.nl/slugify/). It must start with the date (yyyy-mm-dd) and then the blog post name, `2020-01-15-this-is-a-sample.md`.
2. Add some meta data about the post at the top:
   ```markdown
   ---
   layout: post
   title:  "Become an author"
   author: aidan
   categories: [ Tutorial, Blog ]
   tags: [ intermediate ]
   image: assets/images/01.jpg
   description: "Write your own articles for the Mother Tongues Blog"
   featured: false
   hidden: false
   ---
```
3. Write the content of your post in Markdown.
4. When you're happy with it, Submit a [pull request](https://github.com/roedoejet/mothertongues-blog/pull/new/dev.author)


Thanks for contributing!