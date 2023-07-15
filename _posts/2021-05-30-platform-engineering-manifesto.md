---
layout: post
title:  "A Platform engineering manifesto"
author: p6
categories: [ Platform Engineering, Data, Infrastructure, Kafka, Kong, Kubernetes ]
image: assets/blog-images/platform-strategy.svg
featured: true
hidden: true
teaser: Platform Engineering is dead. Long live platform engineering!
toc: true
---


![50-shades](/blog/assets/blog-images/50-shades.jpg "50 Shades of DevOps")

There are many hot takes on Platform Engineering. There are success stories and there are horror stories. When done well, there is a team topology that enables a "do it like a digital native" operating model. When done not so well,  you end up with a mess of 99 problems cherrypicked straight from the CNCF landscape graveyard of tools.

As a company that has chosen to ride the trend, our belief is that platform engineering should be considered essential for any tech company operating in a complex domain, basically with the objective of providing a Dev X that helps you scale. Platforms don't exist in a vaccum; They are grounded ultimately in the reality of business domains and MUST accelerate product engineering teams in their endeavours. 


To be clear, not everyone needs a platform engineering team in the first place. One is largely justified when the size of the engineering organization exceeds the Dunbar number or atleast a non-trivial problem of scale. 

Nonetheless, if you do choose to build a platform engineering team, there are 3 key performance indicators to consider in order to measure success.

 - NPS, CSAT from product engineering teams, as a measure of developer experience
 - Usage metrics of the platform products in themselves
 - Coverage of platform concerns and time to first production deployment (for Product teams)

#  Own a platform architecture & platform product vision

Everything begins in robust product foundations and an (evolving) architecture vision. Platform teams must own both a product & an architecture charter. The unique requirements of platform products may themselves be driven by unique challenges in the domain (or specifically that of domain centred product engineering teams) and the incumbent IT landscape

> ProTip: A pareto principle compliant north star vision of a robust platform architecture must think through the following concenrs: Smart Infrastructure, Data Integration & APIs.

# Building tooling and plugins: For the sake of developers, operators and everything in between

The platform is a product that is mainly built with engineers in mind. You build it, you run it is ultimately an elusively aspirational operating model. In reality, re-use dictates efficiency and continuous reinvention of the wheel is harmful to productivity, which is almost a side-effect of autonomous but silo'd teams. 

> A platform team topology on the other hand vests a lean, craft-focused engineering team to build specialization across a variety of cross cutting concerns while enabling a well governed tech estate. 

Such "Platform engineering" teams are suited ideally to building re-usable artefacts and easily adapted tooling for most concerns. Notably, this will include for example:

- Infrastructure as code modules
- Golden images (as also other build-time, run-time tooling)
- Common Build / Deploy (CI-CD) Pipelines
- Observability & monitoring toolkits


# Enable shared-services Operations (securely) in a multi-tenant, hybrid cloud enterprise

At the heart of enterprise grade operations is really a tenancy problem; Tenancy is really "who shares what in the house"; A platform-based operating model needs to provide mechanisms for housing tenants in dedicated or shared models, based on resource competition (and thus need for isolation), security, availability, compliance and cost requirements.

Operating model flexibility should also provide for having resources managed directly via embedded DevOps teams that "build and run" things or shared SRE (or IT/Cloud-ops teams) that takeover this function for several applications or teams.

> Protip: There is a need for governance as well as potentially cost attribution or chargeback to teams that foot the bill.

# Specialize in running complex, distributed systems

Fully managed services attempt to dumb down details of large scale distributed system, yet many are actually very leaky abstractions. A trade-off of having cloud vendor neutrality is that one must accept the reality of having fully or partially managed services co-existing with fully self-managed ones, particularly when costs become prohibitive either due to scale (or the lack thereof). This poses a dilemma for technology leaders around the operating model fit. 

 There is a defining line of separation between quality platform engineering teams and vanilla (cloud\|dev)-ops teams. Platform engineers will need to gain specific expertise in running complex, distributed systems that have become de-facto platform primitives, providing lego-blocks that allow you to build higher order platforms. 

> Platform adoption is ultimately constrained by expertise and therefore it is crucial that platform engineering teams build highly artisanal guilds that can respond to architectural problems in distributed systems and provide a POV on performance, security an d a variety of cross cutting concerns.
