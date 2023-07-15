---
layout: post
title:  "Architecture primer for upstart SaaS founders"
author: p6
categories: [ Platform Engineering, Data, SaaS, API Metering ]
image: assets/blog-images/mainfesto.jpg
featured: true
hidden: true
teaser: 5 areas to plan upfront & build right
toc: true
---


# Architecture isn't dead

Founders have a lot on their hand. Even seasoned engineering leaders struggle with the dilemma of choices when the primary pressure is the market opportunity and everything is hinged on time to ship. Technical debt is pretty much the state of affairs. Architecture thinking might be frowned upon or looked at as unrealistic. It is true that, "architecture upfront" is a red herring, particularly at early stage, in a volatile setting.

Nonetheless, we can't stress enough about the importance of a north star vision and guard rails even in evolving architectures. Truly emergent architectures don't just emerge organically. Rather the most successful ones are almost always the result of good principles chosen with careful deliberation.

# Everything is a tenancy problem.

The SaaS economy is fueled by multi-tenancy. The more, the merrier. However, this spawns its own set of issues. Even the most mature SaaS companies struggle with these problems:

- Noisy Neighbours: Likely to degrade performance for others
- Freeloaders: doing more than what they should be, at their pricing tier
- Under-utilizers: not getting enough bang for buck. Churn risk

The reality is that "pay for only what you use" is notoriously difficult to implement in practice, as it puts a huge amount of pressure on what to meter, thus spawning notoriously difficult to understand (and unpredictable) billing models. No wonder many SaaS companies end up pricing their solutions with a tenant quota around a facade of some business value, while many still struggle ending up passing infrastructure tiered offerings. 

In our own working experience, we have seen even mature, hyperscale SaaS providers struggle to understand usage patterns and fairness of their billing models. The other side of the same problem is a fin-ops one, of cost attribution of compute and infrastructure resources, relative to pricing subscribed.

The least you must do is to start with the following fin-ops principles:

- Price the solution to the customer around the most self-evident business metric (aka consumption units). This must make sense! Occam's Razor applies. Meter and measure these with the most granular labels possible
- Consider tenancy and clustering assumptions carefully: Be in a position to hold up customer usage (measured in consumption units) against an aggregate metric of your underlying cost (measured in internal cost units)
- The above constitute an exchange rate that must provide a clearer picture of your economics  

# Don't reinvent the wheel - build on great platform primitives

Tech-choices are hard, our biases notwithstanding. Unless you're building specifically for a totally different class of problems, you're likely to be building on the public cloud. While cloud providers seek to provide differentiated offerings, there is a risk of lock-in. Don't get us worng -- there are very many benefits in these offerings and the vertically integrated experience provided by the hyperscaler is very compelling; However, it does decrease your leverage in potentially migrating elsewhere when push comes to shove. This is also materially significant for those building with a multi-cloud, hybrid-cloud offering in the first place.

It makes eminent sense to balance such risks pragmatically.

- Standardize on mature open-source
- Adopt ubiquitous tools, that have become platform interfaces by themselves
- Adopt something conforms to both the above, with a managed service provided by the cloud (as opposed to a completely propreitary offering)

# BYOC is critical in a multi-cloud hybrid-cloud landscape

Based on the nature of your product, markets you want to cater to and your tenancy model, you must consider   

- Whether your solution may ever need to be deployed outside your choice of cloud provider (including on-premise, ex: for regulated domains)
- Data sovereignity and legal considerations for markets you cater to
- If a cloud provider marketplace could itself be a GTM channel

In all these models, it makes sense to think about tenanting the customer around clusters of availability, along with freedom to choose the cloud provider. For sufficiently complex products, a control-plane data-plane separation of concerns clearly emerges; And although a cloud provider choice for a control plane need not be within customer discretion, it would most times make sense for the control plane to be colocated in the same provider.

Finally, hybrid cloud is a reality. If you need to support on-premise, the most unreasonably effective way is to standardize on Kubernetes as the underlying chassis, an architecture choice that would work resonate with all the other points we've made. 

# Think ecosystems

The maker's mind is fundamentally creative. There is always an urge to capture the greatest part of the value chain. However, one must weigh the costs, efforts and the RoI of building (and overreaching in the process); 

The SaaS offering is fundamentally centred around owning the critical path of some user experience around a business problem. A PaaS offering is centred around the developer experience of a specific technology. No matter what the tierage of your offering is, there will alwyas likely be areas which could be catered to by someone else with a (even if marginal) competitive advantage. 

SaaS companies must therefore be brutally honest about areas that are core, adjacennt or peripheral to their business. A partner ecosystem can be a very effective leverage to creating an ecosystem and thus compounding the scale of your own business while improving integration and customer stickiness. It is crucial to think about:

- Your ecosystem proposition: 
- What is in it for your partners (particularly makers or developers) - typically converging to a revenue sharing goal
- API Strategy as part of your product, focused around key integrations
- Extension interfaces through plugins, that run in sandboxed runtimes provided by you (consider Web Assembly)
- Ecosystem fairness: Ensure you don't compete for the market share that the partner network competes for

