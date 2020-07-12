---
layout: post
title:  "About this fork of Mediumish"
author: Hariharan Srinath
categories: [ Jekyll ]
featured: true
image: assets/images/18.jpg
---

This site forks the [Mediumish Jekyll theme](https://www.wowthemes.net/mediumish-free-jekyll-template/)
and makes it suitable for a simple static blog by removing some third party dependencies, 
plugins & features.

While the original theme released by released by [Sal](https://www.wowthemes.net/) 
is a fantastic full featured website theme, it has a number of dependencies on 
third party services that could be liabilities in today's legal environment
or are in my opinion not suitable for simple static blogs that can be hosted
on Github pages. In this fork, I have stripped out those components and made
some fixes for better scalability.

Huge props and many thanks to the original author for releasing such a beautiful and
functional theme with a permissive license.

## Key Changes

### Third Party Dependencies removed
- Ad Sense
- Disqus
- Gravataar

### Jekyll Plugins un-supportd by Github Pages removed
- jekyll-toc
- jekyll-archive

### Other Changes
- Loading JQuery from offical CDN vs. serving loacally
- Removed lazy loading of styles & font
- Removed Lunr search - client side search acoss lots of posts inefficient
- Star Rating - not very useful without server backend
- Outdated social sharing URLs fixed, Reddit sharing added
- Added an Email button & added conditional check for Follow
