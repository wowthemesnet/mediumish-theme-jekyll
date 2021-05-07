---
layout: post
title:  "Creating an AI WebApp on Kubernetes - Lesson 1"
description:  "Learn how to create a world-scale AI web application on Kubernetetes using Angular, ASP.net, Azure Functions, C#, and Python"
featured: true
author: david
categories: [ Jekyll, tutorial ]
image: assets/images/siteflow.png
---

Developing and deploying applications via Kubernetes can be a massive undertaking. When simply setting up the infrastructure locally to test a POC for an application, engineers may find themselves spending more time setting up hosting infrastructure than actually providing customer content and value. Not to mention the fact that deploying to Azure and scaling that application to the world can very difficult. This tutorial is aimed to help all those of you just getting started in the world of Kubernetes to get a head start in getting your web application out to the world!

This course will be end-to-end! We will focus on all of the practical aspects but I highly encourage you to take your time and research the theoretical aspects i.e. 'why containerize an app', 'async vs synchronous programming', 'resnet50 image recognition'.

This project touches on all aspects of web application development and should serve as an all-in-one course for web app development. If you can make it all the way through this course, Kudos! I would estimate this project to take a full week of programming or more.

[comment]: TODO Add an image or gif of using the website

**Difficulty Level**:
Medium

[comment]: TODO Add table content to different lessons


**Things You will need** Try to download/install these things in parallel
+  **A good attitude**. This may take a while
+  [Visual Studio Code](https://code.visualstudio.com/download) for development
+  Basic programming/website knowledge (not algorithmic)
+  [Some basic C# experience](https://docs.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/tutorials/hello-world?tutorial-step=1) to create the Webapi (backend)
+  [Some basic javascript and typescript experience](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) to create the website (front end)
+  [NodeJS](https://nodejs.org/en/) and npm to run the web app
+  [Angular CLI](https://angular.io/guide/setup-local#install-the-angular-cli) to use Angular
+  [Azure subscription](https://azure.microsoft.com/en-us/pricing/). You may want to wait a bit (2nd or 3rd lesson) before paying for this. We will be using azure functions and an AKS cluster which can get expensive if left running indefinitely.
+  [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
+  [Dotnet core and dotnet CLI](https://dotnet.microsoft.com/download/dotnet/3.1)
+  [Docker](https://docs.docker.com/get-docker/) to [containerize](https://cloud.google.com/containers#:~:text=Containerization%20provides%20a%20clean%20separation,configurations%20specific%20to%20the%20app.) the web application. Just trust me on this one
+  [Postman](https://www.postman.com/downloads/) to test the webapi
+  [Google chrome](https://www.google.com/chrome/) or Microsoft edge chromium
+  [Azure Storage explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)
+  [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-vs-code?tabs=csharp) for developing Azure functions

Get familiar with the items above for an hour or two and this tutorial is going to be a breeze. Try to understand each tool's role is in the blog diagram. I've tried to link all the specific versions that I used throughout this project, but you may find that there may be dependencies missing or you may run into compatibility issues on your own machine. Feel free to reach out to me but you may likely have to wrestle with a few issues on your own.

[comment]: TODO Understand how to use emojis in markdown - jemoji gem is giving me an error 

# Why should you do this course
This course uses Angular, Python, and C#, which are [highly sought after languages](https://www.codeplatoon.org/best-paying-most-in-demand-programming-languages-2020/). I've found that it pays to be well developed in one performant and scalable language (C#) for heavy lifting, one front-end language (typescript) for creating end editing UIs, and one scripting language (python) for quickly getting things done. These 3 languages are far ahead of their counterparts in popularity and flexibility.
Master these 3 and you will also get scale inherently. Angular is used at many established fortune 500 companies because it's rich set of extensions and scalability. Python is extremely easy to learn and is used across many applications like data science and is great for learning to code and interviews. C# is used across all Microsoft applications, including xbox games and provides a rich set of libraries for complicated tasks including authentication and multi-threading.
These languages will stand the test of time. Couple them with the latest infrastructure including Azure, Azure functions, containers, Azure storage, and Kubernetes and your skills will take you to amazing places. 


# Why did I create this course
I originally attempted to create this application in order to do image recognition through a website in order to simplify the process of building AI models and connecting them to real-world input. I sought a no-code solution to creating a model and getting input to my model. Due to competitors, I decided not to continue. While creating the bits and pieces was rather simple, I found stitching them together to be *very complicated*. I think there's immense value in getting other developers to the end goal ASAP and I think you will too! Enjoy and leave feedback!