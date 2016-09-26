---
layout: post
title: Flex versus AJAX
summary: I have been playing with the new version of Flex and I'm very impressed with it's possibilities. I did try Flex when it was first released and even when I like it, the price tag and the needs to install an specific server to use it discourage me.
categories: [General, Programming]
---

I have been playing with the new version of [Flex](http://www.adobe.com/products/flex/) and I'm very impressed with it's possibilities. I did try Flex when it was first released and even when I like it, the price tag and the needs to install an specific server to use it discourage me and I decided to focus on Ajax to create rich UI. There was also the fact that at that point integration was other technologies was only considered for Coldfusion and Java, .net was mentioned as a future release and php was not even in the list.

Since version 2.0 (3.0 is coming) Flex is not tied to the server anymore, you still can use the Flex server to use what they call data services but you can use Flex as a front end technology without having to worry about the back-end.

I have a web based music collection manager where I implemented the interface in Ajax, so I decided to try to create a similar interface using Flex.

I was surprised how easily it was, mind that I never before sit and program anything with Action Scripts or even use Flex at all, previously I only read about the technology. Also I barely used action scripts in the few flash interfaces I worked on.

I was able to reuse the same web services that returned information to my Ajax UI and consume them on my flex app. I did modify one of the methods to return a different structure but that was because the original implementation wasn't any good and not because of Flex.

The end result was a cleaner, nicer and (the most important for me) faster interface. I was also able to use the Flash mp3 player capabilities and integrate the player in the same interface.

I could improve the Ajax UI performance modifying the WS to return JSON instead of XML, but even loading the box covers (100 x 100 pixels thumb) is faster in Flex, I don't have to worry about cross browser javascript, css or even HTML and I'm sure that my app will render consistently across browsers and platforms as far as you have Flash 9.0 installed (Adobe claim that 98% of the computers have it).

I'm not advocating to replace Ajax with Flex, but I think that you should give it a look if you are doing an app with a lot of Ajax calls where you change the presentation dynamically.

A good place to start is the [Flex developer Center](http://www.adobe.com/devnet/flex/), lots of demos and articles that will stir you down the right path.
