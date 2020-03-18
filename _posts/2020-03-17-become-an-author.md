---
layout: post
title:  "Become an author"
author: aidan
categories: [ Tutorial, Blog ]
tags: [ intermediate, contributing ]
image: assets/images/01.jpg
description: "Write your own articles for the Mother Tongues Blog"
featured: false
hidden: false
---

Do you have a tip you'd like to share? Have you pulled your hair out fixing a bug only to find out that the reason the bug exists is because many mainstream platforms don't consider less-resourced languages? The Mother Tongues blog is the place to share your tips, tricks, and tutorials for all things related to technology for less-resourced languages.

To become an author, you'll need a [GitHub](https://github.com) account<sup>[1](#github-footnote)</sup>.

Then, follow these steps:

1. Fork the [Mother Tongues Blog Respository](https://github.com/roedoejet/mothertongues-blog)
2. Checkout to the `dev.author` branch
3. Edit the file labelled `_config.yml`. * denotes a required value.
   ```yaml
   authors:
    aidan:
       name: Aidan
       display_name: Aidan
       gravatar: 7623fd3eeb0acbe1084fecc20c3093ae
       email: hello@aidanpine.ca
       web: https://aidanpine.ca
       twitter: https://twitter.com/aidanpine
       description: "Lead developer of Mother Tongues."
    yourname*:
        name: YourName*
        display_name: YourName*
        email: your@email.com*
        gravatar: YourGravatarID
        web: yoursite.com
        twitter: https://twitter.com/yourhandle
        description: "Guest Author. YourDescriptionHere"
    ```
4. Submit a [pull request](https://github.com/roedoejet/mothertongues-blog/pull/new/dev.author)

That's it! Start [writing your posts]({{ "write-a-post" | absolute_url }}).

<br> 
<br> 
<br>   

## Footnotes

<a name="github-footnote">1</a>: Any suggestions for good GitHub tutorials? Leave them in the comments below!


