---
layout: post
title:  "Making this blog better, applying a theme- Week # 44"
date:   2019-11-01 07:30:00 +0530
categories: [journey, jekyll]
tags : [journey, jekyll]
image: assets/images/redesignblog.jpg
---

> **Everything's** a **copy** of a **copy** of a **copy**.- Fight Club

* Caution: I am advocating copying not plagiarising content. Here the context is a theme which is provided for free with MIT license.* 

Let's start with where I stand in terms of this blog.  Currently, this blog runs on default theme of Jekyll which is minimalist. Being a visual person I want to change the user experience of this blog.  If I am the consumer of my design than I should see all my posts in order.  This order will help me in visualising my journey.

If you are starting fresh in blogging and have selected Jekyll than my recommendation is to use an existing theme, I didn't spend time thinking about it.  That's the reason why I need to spend time migrating my posts.

How much work has been done?

1. Already a blog in running state: sumgup.github.io/mysecondlife
2. Did a POC and selected this theme  : [Mediumish](https://github.com/wowthemesnet/mediumish-theme-jekyll)
3. Clean up - Delete the POC repository, Delete Old Repository

12:52 PM: The question is how can I migrate my existing posts to the new theme. Here is the approach I think will work:

#1. Start fresh - Rename currently running blog site to mysecondlifeold 

#2. Fork Mediumish and point to Mysecondlife and copy-paste all the posts from old to the new one.

This sounds like a plan if this doesn't work then need to think again. 

**08: 18 AM **: Executed steps above look ok for a moment, styles are not working.  I guess Jekyll takes some time for the first deployment.

**08: 22 AM **: What's next: Let's finish off following :

1. Remove Top Menu
2. Fix all the static content: Title, about the headline or any other static content.
3. Remove Copyright
4. Fix pictures not showing up in the card
5. Fix Categories and Tags

**08: 28 AM **: I was wrong, styles were not getting applied because baseurl in config.yml was incorrect

**08: 35 AM **::bulb: TIL: default.html hosts the link which shows on top of the page.  

**08: 37 AM:**  Removed the links not required and it looks great after publishing.  Time for a break.

**09: 09 AM:**   I am liking the idea of treating my day as a marathon where step by step I can reach my end goal. 

**09: 28 AM:**   While I was happily making changes and pushing those to the repo, I noticed that my local command: "Jekyll serve" was failing.  I followed the documentation of Mediumish and the first step was to use bundle.  When I tried that it resulted in the following error:

```
kernel_require.rb:59:in `require': cannot load such file -- text-table (LoadError) #33
```

I was able to fix the bundler using steps mentioned in this [Stackoverflow](https://stackoverflow.com/questions/47026174/find-spec-for-exe-cant-find-gem-bundler-0-a-gemgemnotfoundexception) post. Please note I am using Ubuntu.

Finally, I was able to run my blog locally instead of going all the way to GitHub.  

**09:58 AM:**  Finished by changes to about.md.  Speed Check: Got blocked due to snag, time to run fast again.  Time to fix images

**10:22 AM:**  Mediumish has made it easy to set the image in the header of blog post set:

> image: assets/images/default.jpg

**10:40 AM** Setting images for the first time is easy but changing for existing is hard. The hard part changes are not applied. The trick I have discovered is changing the post file name makes it work. This workaround doesn't sound cool to me. There should be a way to clear the cache. Just like we clear build outputs, there should be a way to do that. Let's find that.   Searching for clean doesn't lead me anywhere.  Let's try finding posts where anyone would have faced similar issue.default

God damn it: This image not showing up was due to, not saving my changes to file.  Once I saved it started working.  

Alright, Images are fixed, now time to understand how do these categories work in Mediumish.

11: 12 AM: To make a post-show up in the featured section, featured: true in the header.  Also discovered that .md tables are broken in Mediumish.  This is a big deal because I have relied on tables in my markdown files.  Will tackle this issue later. 

Looking at Mediumish, the home page has the following structure:

1. Featured

2. All Stories

   I would like to tweak this structure, my wish would be to:

   1. Featured
   2. Journey - All my posts related to my journey into UX freelancing will go here
   3. Productivity
   4. UX Design.
   5. And more categories in the feature.

So the question is can edit the default page to show categories as per my need?

I played around with default.html tried to introduce a new category but It didn't show up.  Looks like I need to learn Jekyll to tweak this up. For now, I will just live with default design and later tweak it up.  By the way, categories work in this design.

**11:38 AM **: I am going to use emojis so let me try implementing it if I can create a PR for it that would be wonderful. 

It worked, submitted my Pull Request to Mediumish, let's see if it gets accepted.  

**12:19 PM **: Design logo from scratch is time-consuming, sizing it perfectly with your text is hard. Due to lack of time keeping the default logo. It's not that bad.

**12:52 PM:**  Dealing with images is hard I feel, If the post header image is not of right size it distorts the card size. At this time I cant afford to spend time on this. It goes into debt which I am maintaining in Trello.  Not a big fan of debt but I guess its natural if we are moving fast. 

** 13:26:**  All the images are in place, its time to find beta testers for my blog:). Let's start with my wife.

Let's break the news and get feedback.

** 17:17:** Back after a break, forgot to write in between, was able to get Google Analytics and Disqus to work only a config.yml changes are needed.  Need to configure google analytics so that it neglects my home IP address. 

Also, I don't think SEO needs explicit configuration Mediumish utilises Jekyll-SEO-tag which reads posts metadata automatically.

Here is the in-depth documentation of SEO 

https://github.com/jekyll/jekyll-seo-tag/blob/master/docs/usage.md

I guess in a few days need to test SEO.

Summary: Mostly it looks good, I got rid of MailChimp as I don't want to experiment with it as of now.  