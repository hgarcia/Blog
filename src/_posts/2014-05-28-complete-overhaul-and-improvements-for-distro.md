---
layout: post
title: A complete overhaul and tones of improvements on Distro.
summary: From added support to Redis as a transport to bug fixes and various improvements in the API and over all usage experience.
categories: [JavaScript]
header_img: https://c1.staticflickr.com/9/8465/28695721284_62b3c65be7_h.jpg
header_img_id: 28695721284
background_position: 0px 65%
---

## What's distro?

The distro module is intended to simplify the way services communicate with each other. It abstracts several different transports while providing a consistent interface. It also specifies a message format and comes with some helper factories to create and parse those messages.

It comes with some prepackaged transports for udp4 and udp6, tcp and redis (using pub-sub).
You can easily create your own transports as plug-ins (more details below).
Note that there is not interoperability between transports. Both clients and servers have to use the same transport to be able to talk to each other.

## Updates on version 0.3.1

<p></p>

## Message goes mainstream.

Before you needed to call the <span class="code">create()</span> method of the distro module before creating a new message.

```

	var distro = require('distro');
	distro.create().message(headers, payload);

```

That makes no sense, specially with the new semantics of the create method (see below). The <span class="code">message</span> method can be called directly from the module now.

```

	var distro = require('distro');
	distro.message(headers, payload);

```

## Added support for Redis (pub-sub) as a transport.

If you don't want to use udp or tcp to pass messages around and you prefer using a queue, distro have you covered now.
Just use the redis transport and use pub-sub underneath.

## Fixed big oversight from previous versions.

Before v 0.3.0 you registered callbacks directly on the verbs and the Uri filtering was done by the sever. This is sub-optimal to say the least.

Now, all the registration methods (except <span class="code">receive</span>) take the Uri as the first parameter.

```

	server.receive(callback);
	server.get("/path/", callbackGet);

```

This keeps the same functionality as before for all the methods, even the receive method. All callbacks registered with <span class="code">receive</span> will be called each time a message is processed by the server regarding verb or Uri.

## New transports and you can implement your own.

Transports are implemented as plug-ins. You can implement your own transport that respond the same API and inject the module as the first argument of the <span class="code">create()</span> method.

```

	var distro = require('distro');
	var myTransport = require('smoke-signals-transport');

	var server = distro.create(myTransport).sever();

```

## Better error messages.

Not just better error messages but a few more error checking in place to try to avoid the most common problems.

## Much better test coverage due to the new design.

Yes.

## Plans for the future.

I'm planning on changing a few more things fairly soon in the way message headers are constructed and how back and forth communication takes place.
