---
layout: post
title:  "A guide to platform strategy"
author: p6
categories: [ Platform Engineering, Data, Infrastructure, Kafka, Kong, Kubernetes ]
image: assets/blog-images/platform-strategy.svg
featured: true
hidden: true
teaser: A technology leader's guide to operating like a digital native
toc: true
---

# Prelude

Since we started Platormatory in 2021, much of work has been focused on niche themes surrounding "platform play" & engineering in enterprise Digital / IT organizations. We've come across several recurring themes around organizational, cultural and technological challenges that inhibit customers from optimizing their digital operating model, This thesis is a distillation of our consulting experience and specifically, the mental models that will enable technology leaders to adopt & execute to a sound digital platform strategy.


# Why is a Platform Strategy so important?

IT has changed over the years: Well up to the mid 2000s, most IT orgs operated as a services centric organization that administered servers, infrastructure and big ticket enterprise ~~bloatware~~ software; In contrast, modern digital organizations operate a heterogenous, multi-cloud stack comprising a plethora of complex applications -- the space of which has exploded. DevOps is almost ubiquitous.

Or is it really?
 
Let's inspect the problem with a healthy amount of skepticism. Don't get us wrong: Most organizations claim to be Agile enabled (albeit embrace it with a liberal sprinkling of "two-speed IT" amongst other tropes); There have been multi year transformation programs; Org structures have changed and much makeover has happened. However, gaps remain at large: Old wine in new bottle.

Let's begin by calling a few things out:

1. Most teams are barely product oriented: Organizations still tend to look at "software systems" and hyperspecialized teams rather than true product orientation.
2. Business IT barrier: IT still owns governance functions - so DevOps teams are barely empoerwd in practice and anything that hits IT is a case study in the theory of constraints.
3. Dev(Sec)Ops is actually mostly ops -- much less, Dev or Sec.
4. Data is typically a large scale analytics silo


We could go on and on. If you think these are strawmen, look deeply into your organizations and introspect. Even with somewhat mature Agile  enterprises, we see these dysfunctions at some level or the other.

It isn't that hyperspecialized organzations and silos are universally bad in themselves. Infact, every silo is actually a context bound efficiency center. The problem is more that truly DevOps oriented - "you build it, you run it" teams are too risky an operating model in the enterprise at scale. This realization leads to the slipper slope of half measures, resistance, badly designed team topologies and hampered decision making at all levels leading to the dysfunction we described previously.

# How do you build a Platform-Product Strategy fit to purpose?
 
We feel that the most important trend IT / Digital organizations need to subscribe to is to adopt platforms. 

Let's begin by defining Platforms: 

> A platform is a foundation for enterprise applications, that enables diverse product teams to do more while inventing fewer bespoke solutions and enabling at-scale operations and governance. 

> Platform Engineering is the collective set of practices & patterns associated with building and running platforms and opinionated by the lens of software engineering practices applied in the context of operations.

Why platforms? primarily because in the business that you run, your efficiency is best directed at running the business, rather than being in the business of platform software itself. This can’t be stressed enough; We see digital platform teams go down the rabbit hole of attempting to be pure tech, sometimes out of aspiration and other times out of misguided hubris. Operating platforms is a way to increase efficiencies at getting stuff done, and decrease the operational toil. Platforms should be the foundation of the Digital IT operating model.

Platform engineering may itself sound like a recombination of DevOps and SRE (this is true to some extent), but differs in it's coverage that practitioners of Platform engineering must command a deeper grasp of the software stack, including but not restricted to security, integration and data.

So, by those definitions -- you can look at all cloud services (even infrastructure primitives) that are operated by engineering teams as constituting a platform, as long as it serves the needs of one or more product teams. Chances are however that primitive platforms leave a lot to be developed and for an operating model to be efficient, you need to run higher order platforms.


This is all easier said than done. Embracing platforms is not without problems.
 
1. Enterprise software comes with nuances, feature based differentiation, hiring/skilling challenges and lock-in risks
2. Even cloud platforms come with lock-in risks
 
We feel it makes a lot of sense for companies to walk not only the cloud native path – which is that everything in the longer run must be built in the cloud, for the cloud, but also adopt a multi-cloud posture so as to hedge your bets and preserve flexibility towards aligning contracts that meet the bottomline. 
 
We also have one noteworthy addition, and that is to adopt an open-source first policy.
 
This is rooted in solid fundamentals:
 
1. OSS rules the roost today. Server/OS market has been won long ago, and particularly since the advent of the cloud.
2. Cloud providers majorly embrace OSS - providing managed services for popular OSS projects
3. A whole class of PaaS software deploys to any cloud (run it yourself model) - supporting use-cases where conventional SaaS cannot be supported
4. Finally, OSS foundations (CNCF, Apache Foundation, amongst others) are providing ecosystems where software development thrives, and are well funded typically by big tech that are invested in these technologies.
 
As a digital/tech/IT leader, if you've sought active risk management against vendor lock in and navigating the potential consequences of choosing the wrong tech (particularly proprietary), you will find long term risk management success in the principled approach that we propose.
 
We will summarize this as follows:
 
1. Choose the best OSS technology catering to your problems and evaluate for project activity, stability and quality of APIs / abstractions
2. Investigate if a (cloud agnostic) PaaS vendor offers it - and can support multi-cloud deployments
3. As a next resort, does your preferred public cloud vendor provide a managed service?
4. As a final resort, does your second preference public cloud vendor provide a managed service?
5. Can you run it yourself? (but combined with tooling - particularly K8S operators?read further)
 
 In doing so, you will end up choosing best-in-breed (or prospectively best-in-breed) platforms such that even in the worst case scenario, you will have portability and bargaining power with no significant replatforming or migration cost. This is a winning strategy. 

It is important to think deeply through what it means to run platform(s) at central IT scale; There are two main points here:

1. Almost no platforms are turnkey. It is imminent that you need some extendability; The platform should provide the hooks for it.
2. Ideally, the platform should offer a plugin ecosystem that is community supported.
3. Digital platform IT runs for the sake of product teams: Platforms should offer configurable multi tenancy primitives out of the box, so as for platform teams to provide tooling (ex: Infrastructure as Code, CI/CD pipelines for DevOps automation, starter kits), security, governance and other cross cutting concerns, while relinquishing control to enable product teams to craft their own solutions with full flexibility within the bounds of their tenancy.
4. Based on the DevOps/SRE maturity, enable flexible operations with some shared responsibility model (such as delineating operations of the platform and operations in the platform) that gels well with the culture of the organization

Even if we hate central IT structures as being inefficient in the longer run, centralization invariably creates short term efficiency centers for shared services atleast at a BU level.

