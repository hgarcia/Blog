---
layout: post
title: Distro transports plug-ins.
summary: I moved support for Redis into another module to exercise the transport plug-in API.
categories: [JavaScript]
header_img: https://c1.staticflickr.com/9/8323/29240197051_8cc422aaeb_h.jpg
header_img_id: 29240197051
background_position: 0px 10%
---

## distro-redis

I yanked the support for Redis from the Distro module and moved into distro-redis. This makes distro lightweight and remove dependencies on third party modules on the code (for now).

If you want to use redis you will need to add dependencies no only on distro but also on `distro-redis` and when creating the distro factory pass the module to the `create` method.


```

	var distro = require('distro');
	var distroRedis = require('distro-redis')

	var server = distro.create(distroRedis).server(options);

	//Or

	var client = distro.create(distroRedis).client(options);

```
