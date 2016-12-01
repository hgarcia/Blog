---
layout: post
title: Choo cleaning up home page.
summary: We will take from the previous refactoring where we remove dependencies on the framework.
categories: [Programming, Choo]
collection: Choo
header_img: https://c2.staticflickr.com/6/5791/30586665571_65fead6800_h.jpg
header_img_id: 30586665571
background_position: 0px 55%
draft: true
---


## Final thoughts

I don't like how the code in our homepage is looking, I think we can do better and further abstract the knowledge we have for addShow and updateShow in there.

We should also validate that the parameter object have the expected properties or do some defensive programming in there.

I will also like to explore some refactorings to be able to test that the event handlers are called with the expected values.

## Resources

* [Github code for this article](https://github.com/hgarcia/tv-series/releases/tag/v0.4)
