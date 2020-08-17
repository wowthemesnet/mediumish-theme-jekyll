---
layout: post
title:  "How to use the new Convertextract application for 'quality control' of ELAN annotations"
author: fineen
categories: [ Tutorial, Blog ]
tags: [ basic ]
image: assets/images/gui.png
description: "How to install and use the new Convertextract app for 'quality control' purposes"
featured: false
hidden: false
---

# TL;DR

Have you ever wanted to *NOT* spend hours tediously checking that **k + '** is written as **k̓** and not **k'**?
If you said **YES!**, *Convertextract* is the app for you. With minimal technical knowledge, you can now systemically make your ELAN annotations consistent.

# What you need to know to understand this post

I assume that you know some background about the [g2p library](https://github.com/roedoejet/g2p), but if your language already has the desired template for conversion (mapping), then you don't need to worry too much about this.

# Who is involved with this project?

- Kwak̓wala Corpus Collection group

	Sara Child [saratlilinukw@gmail.com](mailto:saratlilinukw@gmail.com)
	Daisy Rosenblum [daisy.rosenblum@ubc.ca](mailto:daisy.rosenblum@ubc.ca)
	Caroline Running Wolf [caroline.oldcoyote@gmail.com](mailto:caroline.oldcoyote@gmail.com)

- App developer: [Aidan Pine](aidanpine.ca)

- Support for adding mappings/parsers: [Fineen](fineen.davis@gmail.com)


# What is needed to replicate the content in the post?

- [g2p](https://github.com/roedoejet/g2p) mapping of the desired conversions
- Language text to be converted
- *Convertextract* application (read the post for installation!) 

# What are the motivations behind this technology?

As a Student Intern on the NRC's [Indigenous Language Technology (ILT) project](https://nrc.canada.ca/en/research-development/research-collaboration/programs/canadian-indigenous-languages-technology-project), I was approached by the Kwak̓wala Corpus Collection group to help create a systemic way to streamline the quality control process for their ELAN annotation data. Having many different people with many different orthographic conventions all working on annotating Kwak̓wala language data had resulted in inconsistencies.
So, I added mappings in the [g2p library](https://github.com/roedoejet/g2p) 
and a parser for ELAN in the Convertextract library. Aidan Pine then turned Convertextract into an application!

# How to use the new Convertextract application for 'quality control' of ELAN annotations

[Convertextract](https://github.com/roedoejet/convertextract), created by Aidan Pine, is a `python` library which extracts text data and finds/replaces specific text based on arbitrary correspondences. 
Until now, only basic CLI (Command Line Interface) was supported. Using Convertextract in the CLI allowed the user to convert a file based on pre-existing Mappings in the [g2p library](https://github.com/roedoejet/g2p) or based on a custom mapping. However, the downside is that some programming knowledge is needed to use the CLI.
The latest update now includes a GUI (Graphical User Interface) in the form of an application (for Mac **only**). The app makes Convertextract more accessible for non-programmers.

### 1. G2P mapping
G2P mappings (i.e. arbitrary conversions between an input and an output) can be created manually as a `.csv` or `.json` file, or with the [g2p studio app](g2p-studio.herokuapp.com).
Many languages are already supported. See the [g2p repository](https://github.com/roedoejet/g2p) on Github for detailed documentation on the G2P library.

### 2. Language data

You language data must be in one of the supported file formats. The most recent addition is `.eaf` files, which allows ELAN annotations to be parsed and converted. For a full list of supported file types click [here](https://github.com/roedoejet/convertextract).

### 3. Convertextract application

#### Installation
To download the app: [https://github.com/roedoejet/convertextract/releases](https://github.com/roedoejet/convertextract/releases).

In your downloads folder, find the .zip file and double click on it to unzip.
- Downloads>**convertextract**

Right-click on the application in the dist folder and select *Open*.
- Downloads>convertextract>dist>**Convertextract**

*Note: If you try to double click to open the app, you will get a security message. Right-clicking to open will allow you to override the security message.*

#### Using the app

This is what the app looks like when you open it.

![]([https://raw.githubusercontent.com/roedoejet/mothertongues-blog/assets/images/gui.png])

All you have to do is add your language data, choose the encoding, and pick your g2p mapping!
The output will be exported as a copy of the input file + *_converted.ext* in the filename.

##### Example case

When typing, there is more than one way to write **k̓** in the Kwak̓wala language. Convertextract takes all of these possibilities and generates *one* output for the sake of consistency.

- Performing '*quality control*'

|| Input language |Output language|
|---|--|--|
|Language code|kwk-umista|kwk-umista-con|
|Sample text|*kwak'wala* |*kwak̓wala*|
||*kwak]wala* |*kwak̓wala*|



If you need help setting up the application or have any questions at all, please feel free to comment below or send me an email!

