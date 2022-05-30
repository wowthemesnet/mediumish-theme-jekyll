---
layout: post
title:  "North star platform architecture"
author: p6
categories: [ Platform Engineering, Data, Infrastructure, Kafka, Kong, Kubernetes ]
image: assets/blog-images/platform-arch-model.svg
featured: true
hidden: true
---

## Strategic Underpinnings

In the last year or so, we've been spending a lot of time thinking about how organizations can run IT/Digital better. Clearly, IT has changed over the years from being a services centric organization that administers servers & infrastructure to modern organizations that operate a heterogenous, multi-cloud stack. In practice, many (including those who claim to be leaders) are actually laggards at running operations and we feel this is a "mission to enable" that is worthy of catering to.
 
Don't get us wrong. In 2022, DevOps is ubiquitous; Most organizations claim to be Agile enabled (albeit embrace it with a liberal sprinkling of "two-speed IT" amongst other tropes); However, gaps remain at large, across the IT –  Digital continuum.
 
We feel that the most important trend IT / Digital organizations need to subscribe to is to adopt platforms. Why platforms? primarily because in the business that you run, your efficiency is best directed at running the business, rather than being in the business of platform software itself. This can’t be stressed enough; We see digital platform teams go down the rabbit hole of attempting to be pure tech, sometimes out of aspiration and other times out of misguided hubris. Operating platforms is a way to increase efficiencies at getting stuff done, and decrease the operational toil. Platforms should be the foundation of the Digital IT operating model. 
 
This is easier said than done. Embracing platforms is not without problems.
 
- Enterprise software comes with nuances, feature based differentiation, hiring/skilling challenges and lock-in risks
- Even cloud platforms come with lock-in risks
 
We feel it makes a lot of sense for companies to walk not only the cloud native path – which is that everything in the longer run must be built in the cloud, for the cloud, but also adopt a multi-cloud posture so as to hedge your bets and preserve flexibility towards aligning contracts that meet the bottomline. 
 
We also have one noteworthy addition, and that is to adopt an open-source first policy.
 
This is rooted in solid fundamentals:
 
- OSS rules the roost today. Server/OS market has been won long ago, and particularly since the advent of the cloud.
- Cloud providers majorly embrace OSS - providing managed services for popular OSS projects
- A whole class of PaaS software deploys to any cloud (run it yourself model) - supporting use-cases where conventional SaaS cannot be supported
- Finally, OSS foundations (CNCF, Apache Foundation, amongst others) are providing ecosystems where software development thrives, and are well funded typically by big tech that are invested in these technologies.
 
As a digital/tech/IT leader, if you've sought active risk management against vendor lock in and navigating the potential consequences of choosing the wrong tech (particularly proprietary), you will find long term risk management success in the principled approach that we propose.
 
We will summarize this as follows:
 
1. Choose the best OSS technology catering to your problems and evaluate for project activity, stability and quality of APIs / abstractions
2. Investigate if a (cloud agnostic) PaaS vendor offers it - and can support multi-cloud deployments
3. As a next resort, does your preferred public cloud vendor provide a managed service?
4. As a final resort, does your second preference public cloud vendor provide a managed service?
5. Can you run it yourself? (but combined with tooling - particularly K8S operators?read further)
 
In doing so, you will end up choosing best-in-breed (or prospectively best-in-breed) platforms such that even in the worst case scenario, you will have portability and bargaining power with no significant replatforming or migration cost. This is a winning strategy.
 
------------------------

## The Key Components
 
It is important to think deeply through what it means to run platform(s) at central IT scale; There are two main points here:
 
Almost no platforms are turnkey. It is imminent that you need some extendability; The platform should provide the hooks for it.
Ideally, the platform should offer a plugin ecosystem that is community supported.
Digital platform IT runs for the sake of product teams: Platforms should offer configurable multi tenancy primitives out of the box, so as for platform teams to provide tooling (ex: Infrastructure as Code, CI/CD pipelines for DevOps automation, starter kits), security, governance and other cross cutting concerns, while relinquishing control to enable product teams to craft their own solutions with full flexibility within the bounds of their tenancy.
Based on the DevOps/SRE maturity, enable flexible operations with some shared responsibility model (such as delineating operations of the platform and operations in the platform) that gels well with the culture of the organization 
 
Even if we hate central IT structures as being inefficient in the longer run, centralization invariably creates short term efficiency centers for shared services atleast at a BU level.
 
------------------------
 
From our experience, as diverse as the platform landscape can get, there are 3 important pillars that stand out. This must be at the very heart of your Digital Platform Strategy
 
1. Hybrid Cloud Infrastructure
2. Real time core for data & service integration
3. APIs and API Management
 
 
## Hybrid Cloud Infrastructure:
 
As detailed previously, in the ever evolving cloud landscape, hardware comes cheap and commoditized. While cloud vendors will still seek to differentiate, it is now amply clear that  containers are pretty much the standard level of atomicity for any workload. Therefore, the underlying IaaS, at least in theory,  is very fungible. 
 
This also signals the rise of Kubernetes as a great leveler and making multi-cloud – hybrid-cloud strategies actually viable without rocket surgery.
 
As Kelsey Hightower puts it "Kubernetes is the interface to the cloud". If there's one thing K8S has cracked, it is the declarative control plane API model, and by that it ensures that even if a competitor were to emerge, it would begin by baselining itself against the same API standard. 
 
We will go out on a limb and make another prediction: in the same spirit of Atwood's law: Any sufficiently complicated distributed system that can be natively run (with the operator pattern or full blown controllers) on Kubernetes will eventually be run as ... exactly that. 
 
That means, for those who may need to steer away from managed services for whatever reason, running an operator is very literally the next best thing. We expect K8S will be the chassis for building literally just about anything cloud native in the next 10 years; PaaS vendors will come up with even better and specialized Developer and operator experiences to run K8S-at-the-core apps with lesser hassle. 
 
There are naysayers who think K8S is just too complex (there maybe a hint of truth in this even in 2022), but the sheer rate of increasing production workloads going into k8s is obviously data based testimony staring at you in the face that this is hardly as complex as they say it is. This is definitely led by the cloud providers themselves, but there is also a long tail of hybrid cloud compatible K8S distributions (such as VMWare Tanzu, RedHat OpenShift, Rancher, Nirmata, amongst others) that are enabling this. There are discretionary choices available for which flavor of Kubernetes suits you best and the vendor posture is towards K8S not as infrastructure modernization but as the foundational need for modernizing apps in itself;  
 
Even capabilities that were seemingly a point of proprietary leverage for public cloud, such as serverless functions have now gained a first class foothold in Kubernetes, allowing product teams to build towards a deployment target that may run on any IaaS, with Kubernetes. 
 
> Our advice - if you are willing to make some investments towards Kubernetes, it is about time. Do it.
 
## Real time core for data & service integration
 
As DB sizes grow, it is inevitable that megaliths and monoliths must die; Shared state and data just has practical limits; Services must own data and therefore, enable themselves towards decomposition into smaller parts and distribution. When that happens, the needs for integrations arise.
 
The platform opportunities in integration are no recent discovery. Messaging middleware in the order of ESB -> iPaaS -> API Management have been around for decades. In the cloud native world, Enterprise integration patterns may still hold (give or take), but the aforementioned integration technologies no longer make sense for microservices communication. The services get smaller, chattier and desire eventual consistency patterns which these systems suck at, not to mention that they barely lend themselves to distributed, hybrid cloud deployments without being bottlenecks in themselves.
 
There's a second, larger problem: Data integration. Analytical problem space increasingly converges into the operational (this is a great thing) and therefore real time data integration is a much bigger problem than ever. Traditional big data approaches fail to fulfill the needs of business expectations where time-to-useful-data (whether be it insight, reporting or other analytics) has to be optimized to its bounds.
 
The best way to solve for both,is through embracing Event Driven, Reactive architecture as the de-facto way to architect applications. In this model:
 
Choreography must be preferred over orchestration.
Applications and services exchange data through streams: Event stream processing becomes the mechanism to synchronize and process data continuously and consistently.
Most integrations can be handled through the same eventing backbone: An event store holds the logstream of events that can be applied (and replayed if necessary) to derive the state of an application
 
Note that this problem has large-scale distributed system underpinnings to it. As it emerges, it is clear that Apache Kafka is the standout winner for event streaming. Its use-cases are myriad: Everything from (S)EDA, event-sourcing, stream processing to data movement. Kafka solves core problems, such as that of exactly once Processing, a brokered, pub-sub API model that offers the highest number of tuning knobs and customizability to fit purpose, first class data persistence for reliable processing and lends itself to global scale, high throughput, ow latency, fault tolerant deployments. 
 
Apart from these, Kafka also offers an ecosystem of connectors, stream processing bolt ons and schema management. 
 
Most of all, similar to K8S, Apache Kafka's data plane protocol has emerged as the defacto API standard for brokered eventing. This is evident in that even with Kafka's emergent competition,  such as Azure event hubs, Apache pulsar or the new kid on the block, RedPanda (formerly vectorized.io) –  that are innovating in the path of Kafka (in arguably superior ways), there is still conformance and compatibility to the same API protocol.
 
>The Kafka based pub-sub streaming model is clearly emerging as the integration & data backbone of the enterprise. Data mesh like architectures will evolve on top of Kafka as the data plane standard and enable Data Productization that will be owned and stewarded by domains. App and services integrations will on the other hand, leverage changelog streams and increasingly lead to event-sourced architectures with newer Kafka centric API standards (such as AsyncAPI, CloudEvents) being the guardrails.
 
## APIs (everything as a service)
 
Many may have heard of Jeff Bezos’s API mandate, towards making service interfaces the only mechanism for integration. The dictum seems obvious in 2022 but at that time goes as testament to the visionary nature of leaders and the importance of APIs as socio-technical contracts that enables teams to have bounded responsibilities and ownership – an important aspect of organizational design that is required in order to scale.
 
The explosion of services in the SOA era has resulted in the emergence of API Management as a formal  discipline, over and above classic integration middleware platforms (such as ESBs); API Platforms focus on API based mediation, composition patterns and policy based controls on security, traffic management and quotas. 
 
While API Management has traditionally applied in SOA context, the microservices landscape brings in a different set of challenges than the Northbound-Southbound communication that API gateways traditionally addressed. This is the challenge of inter-service communication or East-West traffic. This is the emerging solution space of service meshes, where the opportunities include the same as that of API gateways and API management (albeit with more intelligent proxy or agent sidecars), but also extending to routing, load balancing, circuit breaking, traffic shifting, mirroring  and most of all, observability through tracing across a graph of services.
 
Till date, there have been attempts to converge gateways and service meshes, but in our opinion, the most complete vision towards this is by Kong (and to a lesser extent, Solo.io).  Kong offers a service mesh (Kuma - albeit not SMI compatible, uses Envoy as the data plane), an API gateway (nginx in the data plane) and a programmable plugin layer that supports Lua, Golang, Python and JS. 
 
While it is unfair to say Kong is in the de-facto standard of it’s category class as Kafka and K8S, we find it the most plausible candidate worthy of that status eventually; Kong’s core concepts reduce to services and upstreams, routes and consumers, which maybe declaratively targeted by plugins. Kong boasts a large ecosystem of plugins and forks (such as mentionable Apisix), support for HTTP2, gRPC on both VMs, as well as K8S (with K8s ingress); Most of all, Kong provides typically an order of magnitude lift in performance vis-a-vis others and this constitutes a very compelling proposition.
 
The coalescence of API gateways and Service meshes has only begun. We predict Envoy based data-planes will become better and more efficient; We will increasingly look at architectures that not only externalize all network level cross cutting concerns (such as security, traffic management, routing) to the ubiquitous Envoy-at-the-core mesh layer, but also see much “smarter” wire level interception capabilities for different technologies, thus enabling sophisticated capabilities around resilience, load balancing and much more.  This is only the beginning, but there are several interesting possibilities just in the networking world with eBPF at the core.  On the other hand, HTTP/2 is emerging and there is a rebound of RPC protocols (gRPC, Thrift, Dubbo) that provide consistent typing and deep, idiomatic programming language support; Finally, we also recognize heterogeneous API standards emerging (GraphQL, AsyncAPI, CloudEvents to name some) for a variety of use-cases beyond the core request-response oriented REST/SOAP standards that have been prevalent; To address these and other possibilities, if we had to make a choice today - it would almost certainly be Kong. 
 
> Finally, we must stress that APIs are just endpoints unless bundled together or built to suit use-cases of their audiences (ie, developers); For API Management to mature in an organization (regardless of API gateway or service mesh infrastructure), the curation of API products (or in an even more abstract sense, integration products) is the most important goal. This enables a transformation from APIs as integration endpoints towards APIs being literally, your business as a service.
 
------------------
 
## Conclusion
 
In this lengthy exploration, we've attempted to provide you a view of the emergent "k3" platform stack, consisting of Kubernetes, Kafka, Kong. These address respectively, the three most important pillars of an enterprise digital platform strategy - namely, infrastructure, data and APIs. For the discerning CT(I)O or platform engineering leader, the opportunities are vast and the OSS community has a lot to offer. It is important to take note and strategize accordingly.
