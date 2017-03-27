---
layout: post
title: Choo version 5
summary: Upgrading our tv series application to version 5
categories: [Programming, Choo]
collection: Choo
header_img: https://c2.staticflickr.com/6/5791/30586665571_65fead6800_h.jpg
header_img_id: 30586665571
background_position: 0px 55%
---

Choo version 5 further simplify the API making it even easier to get up and running with Choo.

The upgrade took less than 3 hours and the result is a much simpler an easier to reason about code.

The main changes are in the removal of the "store" and "models" concept (I left the models folder in her just as a reference) but in a real application I probably rename it as service.

Gone are all the concepts of "reducers", "subscriptions" and "effects" in favour for an event driven approach.

So, you pass the bus or the emit method method around and you are up to the races.

You subscribe to the events in the "model/service" and the only "magic" is that to refresh the UI you need to dispatch the "render" event. (Not 100% sure if this is the case all the time but it looks that way).

The idea of immutability is gone from the framework, you can still obviously go that route but is up to you as the implementer of the application and you will need to decide how you will go about it.

I think that the changes are great. It's even less prescriptive than before having even more of a library feeling than a full fledge framework while still giving you most of the things you need to build a simple page application.

The more I play with it, the more I think on introducing it to our tech stack and start using in a real product in production.


## Resources

* [Github code for this article](https://github.com/hgarcia/tv-series/tree/v0.8)
