---
layout: post
title: Why you need to use a good architecture when writing JavaScript
summary: I'm working in an application originally programmed in 200 by only one developer. I really clever guy that put in place quiet a bit of base code. The original design of the application is not all that bad, but several waves of developers have done maintenance on it.
categories: [JavaScript, Programming, Architecture]
---

I'm working in an application originally programmed in 200 by only one developer. I really clever guy that put in place quiet a bit of base code. The original design of the application is not all that bad, but several waves of developers have done maintenance on it. The browser landscape have changed and the application, been live and having a lot of success have to be patched on the fly.

This patches have created a lot of crud and the whole base coded it's getting tired. I'm not going to go in details about the server side code, I want to concentrate in the client side part of the app.

We notice the problems mostly in the html generated. It's not standard compliance since was done back them when you needed to support Netscape 4 and IE 4 (that was a real nightmare) and most people was using tables for layout, images as spacers and the style was mostly applied inline (we know today that these are all very bad practices).

The JavaScript code is also old and you find the same method that does almost the same thing in four or five places, sometimes we found exactly the same function copy and paste with comments and all in two scripts files, and them both scripts file were included in the same html page.

So we decided that we had enough and was time to fix the problem. The application syndicate a lot of it's content in the form of widgets and we want to make sure that we are not breaking somebody else code (our bad html has been the source of complains from some bloggers). Also we need to be sure that the css classes and the javascript methods that our widgets use are not going to interfere with other people applications.

This should be a common concern for anybody doing webs sites today. Web 2.0 may have lost it's original meaning and today is mostly a marketing term, but it's quiet possible that you end up doing some type of mash up in the near future.

Some tips that you may found useful:

* Use a global namespace to contain all your global variables and global methods.
* Create other namespaces but try to keep the tree short (I try to keep my hierarchy
under three levels)
* If you work in a shop that have more than one product, separate your common functions
for that application intro specific scripts using a second level NameSpace.
* Do not use eval (just for security).
* Pass data around using JSON instead of a propietary format.
* Sit down and try to map in a text file how your are going to divide your code (general
rules, like naming conventions and directory structure) even if you do Agile a little
bit of architecture never hurt anybody.

I recommend that you take a look at the series of videos by <a href="http://www.crockford.com/" target="_blank">Douglas Crockford</a> in the <a href="http://developer.yahoo.com/yui/theater/" target="_blank">YUI theatre</a>.
