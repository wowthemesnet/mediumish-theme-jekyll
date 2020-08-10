---
layout: post
title:  Why I made yet another Cree syllabics converter
author: eddie
categories: [ Blog ]
tags: [ basic ]
image: assets/images/why-cree-syllabics--header.png
description: "How do existing converters fall short, and how have I decided to fix it?"
featured: false
hidden: false
---

The Western Cree languages—**Plains Cree**, **Woods Cree**, and **Swampy Cree**—are written using two systems: one with letters borrowed from the
English alphabet, in a system known as the **standard Roman orthography** (**SRO**), and **ᓀᐦᐃᔭᐏ ᒐᐦᑭᐯᐦᐃᑲᓇ** (Cree syllabics). SRO is relatively easy to type on a modern computer, but syllabics are more difficult, because of the lack of a well-established syllabics input layout. It's easier to just use a **converter** which, given Cree text in SRO, produces Cree text in syllabics. In this post, I describe my criticisms of the converters that existed prior to July 2018, and introduce [syllabics.app][]—a syllabics converter that I developed in reaction to the former converters.

[syllabics.app]: https://syllabics.app/


What you need to know to understand this post
---------------------------------------------

For the latter part of this blog post, where I discuss using the
converter in your own project, I assume you know how to use:

 - [npm][] for installing JavaScript packages; or
 - [pip][] for installing Python packages

If you don't care about embedding my converter in your coding project,
then there's no prior technical knowledge needed!

[npm]: https://docs.npmjs.com/downloading-and-installing-packages-locally
[pip]: https://packaging.python.org/tutorials/installing-packages/#use-pip-for-installing


What are the freely available transliterators?
----------------------------------------------

A quick Google search will net you at least the following SRO to syllabics transliterators.

 - [The Maskwacîs Plains Cree Syllabic Converter][ocd][^1]
 - [The Algonquian Linguistic Atlas Cree Syllabics Converter][ala]
 - [Syllabics.net's Plains Cree Syllabics Converter][syl]

[ocd]: http://www.creedictionary.com/converter/maskwacis.php
[ala]: https://syllabics.atlas-ling.ca/
[syl]: http://www.syllabics.net/convert/plainscree

However, none of these transliterators are perfect.

[^1]: This is the same converter bundled in the [Cree Dictionary app](http://www.creedictionary.com/software/index.php).

The issues
----------

### Word final "hk"

In syllabics, a word that ends with an "hk"---or «ᐠ» in syllabics---are
supposed end with «ᕽ» instead. However, this replacement can never occur in the middle of a word.



For example, the word "ê-wêpâpîhkêwêpinamâhk" (_we (and not you) are setting it swinging_), contains both a final "hk" and a "hk" cluster in the middle of the word. Its syllabic transcription is **ᐁᐍᐹᐲᐦᑫᐍᐱᐊᒫᕽ**.

[The Algonquian Linguistic Atlas's converter][ala] and [syllabics.net's converter][syl] both handle the conversion of "hk" to «ᐠ», without erroneously converting the sequence in the middle of a word. Notably, the community of **Maskwacîs** does not follow this convention. Therefore, the [Maskwacîs Converter][ocd] produces **ᐁ ᐁᐧᐸᐱᐦᑫᐁᐧᐱᓇᒪᐦᐠ**, unlike what is expected in other Cree communities.

### Transliterating non-Cree words

Some transliterators attempt to convert every Latin character, even if it doesn't make sense. Take the case of "Maskêkosihk Trail"---a road that goes from Edmonton to [Enoch Cree Nation][enoch]. The City of Edmonton unveiled the street sign, and, in the process, they unveiled an embarrassment:

<figure>
  <img src="{{ 'assets/images/why-cree-syllabics--mayor-and-okimaw.jpg' | relative_url }}">
  <figcaption>
    “Maskêkosihk trail” erroneously converted as «ᒪᐢᑫᑯᓯᐦᐠ ᐟrᐊᐃl»
    <cite> Image source: <a
    href="https://www.cbc.ca/news/canada/edmonton/renamed-maskekosihk-trail-part-of-city-s-ongoing-reconciliation-commitment-1.3446162">CBC</a>
    </cite>
  </figcaption>
</figure>

Not only does the syllabics transliteration of the sign contain the "hk"
cluster as mentioned above,[^4] but it half-transliterates *the English word* "trail" into syllabics. The result is that "trail" is rendered as «ᐟrᐊᐃl», which *contains Latin characters in the transliteration!*

In my opinion, an SRO to syllabics transliterator should refuse to transliterate words that do not have the structure of a Cree word. However, all three of the mentioned transliterators do attempt to transliterate "trail" with differing results:[^2]

|:----------------------------|----------|
| Maskwacîs Cree Dictionary   | ᐟrᐊᐃl    |
| Algonquian Linguistic Atlas | ᐟᕒᐊᐃᐪ    |
| Syllabics.net               | ᐟᕒᐊᐃᓬ    |


[enoch]: http://enochnation.ca/

[^2]: I strongly suspect the sign designer used the Maskwacîs transliterator to get this result.
[^4]: This may not be a mistake; they _could_ be using Maskwacîs's conventions, but I'm really not sure.

### Long vowels

Long vowels (êîôâ) are distinct from short vowels (ioa) in Cree. Long vowels are written with a dot above in syllabics. The exception is for "ê" because it is always long; as a result, some writers also drop the diacritic when writing "e" in SRO as well. It's important to differentiate between long and short vowels, because it makes distinctions between words. For example, nipiy/ᓂᐱᕀ means "water" while nîpiy/ᓃᐱᕀ means "leaf". However, there is such a thing as "plain" script, where the vowel dots are omitted, and [pointed] script where the vowels have all dots.

Another complication is that the "standard" Roman orthography in practice has multiple conventions for writing long vowels: using a macron (◌̄) and using a circumflex (◌̂).[^3]

How do the various converters handle long vowel diacritics? [The Maskwacîs converter][ocd] does not produce dots for long vowels at all, however it accepts both macrons and circumflexes as input. The [Algonquian Lingustic Atlas's converter][ala] not only produces dots, but supports input in either macrons or circumflexes. The [syllabics.net converter][syl] does worst of all, handling *only* macrons for long vowels. It simply spits out characters written with circumflexes. Additionally, it does not handle "ê" without an diacritics, which all other converters do.


[pointed]: https://en.wikipedia.org/wiki/Canadian_Aboriginal_syllabics#Pointing

[^3]: Anecdotally, I find that most writers near Edmonton and Maskwacîs prefer circumflexes to macrons; however noted Algonquian linguist Arok Wolvengrey prefers macrons. Heck, Jean Okimāsis writes her surname with a macron!

### Other odds and ends

Other issues for syllabics converters include how they deal with dashes, how they deal with combining diacritics, rather than pre-composed characters, and whether they produce the correct Unicode characters for the syllabics rather than very convincing look-alikes. There's also the [sandhi orthographic rule][sandhi], but honestly, I'm not sure I fully comprehend how to apply this rule myself.


[sandhi]: https://crk-orthography.readthedocs.io/en/stable/glossary.html#term-sandhi

### Summary

Here's a breakdown of the previous issues, and whether each transliterator can handle it correctly.

|                             | Word-final "hk"   | Non-Cree words   | Long vowels   |
|:----------------------------|------------------:|-----------------:|--------------:|
| Maskwacîs Cree Dictionary   | *                 | ❌               | ❌            |
| Algonquian Linguistic Atlas | ✅                | ❌               | ✅            |
| Syllabics.net               | ✅                | ❌               | ❌            |


Where's the source code?
------------------------

The most pressing issue to me personally is that I cannot find **source code** for any of these converters! This means that if other people want to incorporate a converter into their own app without an active internet connection, **they can't**. They have to either reverse-engineer the converters online, or write their own code to do the conversion.


`cree-sro-syllabics`: an open-source Python and JavaScript library for syllabics conversion
-------------------------------------------------------------------------------------------

My solution was to create a code library that is **free and open source**. It is available both for [Python][pypi] and [JavaScript][npm], and you can try it out right now!

[pypi]: https://pypi.org/project/cree-sro-syllabics/
[npm]: https://www.npmjs.com/package/cree-sro-syllabics

It handles all the issues previously mentioned. Try it with the following test cases:

 - [Maskekosihk trail](https://syllabics.app/#!sro:Maskekosihk%20trail)
 - [êwêpâpîhkêwêpinamahk](https://syllabics.app/#!sro:êwêpâpîhkêwêpinamahk)
 - [ēwēpâpīhkēwēpinamahk](https://syllabics.app/#!sro:ēwēpâpīhkēwēpinamahk)
 - [ewepapihkewepinamahk](https://syllabics.app/#!sro:ewepapihkewepinamahk)

The source code for `cree-sro-syllabics` can be found on their respective GitHub repositories:

 * [`cree-sro-syllabics` for Python](https://github.com/eddieantonio/cree-sro-syllabics)
 * [`cree-sro-syllabics` for JavaScript](https://github.com/eddieantonio/cree-sro-syllabics.js)

But it can also be seamlessly incorporated into a Python project that uses `pip` by installing it with:

    pip install cree-sro-syllabics

Or, you can use `npm` to install `cree-sro-syllabics` in your JavaScript project:

    npm install cree-sro-syllabics --save

Or you can [copy-paste the `.js` file][js-source] to your project.

[js-source]: https://raw.githubusercontent.com/eddieantonio/cree-sro-syllabics.js/master/cree-sro-syllabics.js

Use cases
---------

Most folks will just use [syllabics.app][] to convert a few words or
sentences of Cree.

However, software developers can embed the converter in clever ways in their application. For example, I've used the converter in [itwêwina — the Plains Cree dictionary](https://itwewina.dev/). Although the underlying dictionary content is written entirely in SRO, we can present all Cree text in syllabics. In addition, we support searches in syllabics by using `cree-sro-syllabics` to convert the search string to SRO first, then search our dictionary content.


**How can _you_ use `cree-sro-syllabics`?**

> **Note**: This blog post has been adapted from a [post on Eddie's blog][original].

[original]: https://eddieantonio.ca/blog/2018/07/30/why-i-made-yet-another-cree-syllabics-converter/

---
