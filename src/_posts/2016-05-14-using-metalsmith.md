---
layout: post
title: Switching from Jekyll to Metalsmith.
summary: After 6 years of Jekyll it was time to switch.
categories: [General]
header_img: https://c2.staticflickr.com/8/7095/26650912200_0ba0664e48_h.jpg
background_position: 0px 53%
---

I have been blogging for close to 13 years now.
During that time I changed urls twices and platform 5 times (including this last change).

I started long time ago under the domain [latrompa.com](http://latrompa.com) that was the name of my first company back when living in Argentina.

At the time I was using a concoction of scripts to run the blogging part of the site.

The first migration was moving the blogging into wordpress in 2007. I run Wordpress for a year until I start running into issues updating to newer versions.

I decided to switch platforms all together and move all the content into dasBlog and asp.net blogging platform.

I run with dasblog for a few years until (once again) I decided to switch, this time I wanted to have more control on the generated HTMl, so [I made the decision to jumpt into the Jekyll bandwagon](https://dynamicprogrammer.com/2010/09/02/migrating-the-blog-from-dasblog-to-jekyll/).

Jekyll worked well and it deliverd on it's promise. I was able to change the design of the blog multiple times with very little overhead.

Building new extensions was easy, moslty a few lines of Ruby and I was done.

### So why to switch again?

When I switched to Jekyll in September 2010 I decided to use Textile as the language to write my posts in. Mostly was due to the ease of migration from dasBlog XML based format into Textile.

It was obvious pretty soon that I should have taken the extra time and switch to Markdown but things where working for me so I neglect this for several years.

But a few months ago I got a new computer and I tried to start blogging again (I have gone dark for long periods in the last 3 years due to work commitments).

I tried to install all the gem and dependencies for my old Jekyll setup only to hit problem after problem. Incompatible versions, missing c bindings, etc, etc.

So what does a programmer do? It write some code!

### Enter Metalsmith

[Metalsmith](http://www.metalsmith.io/) is an npm package and a series of plugins to transform text files.

You could use it to do anything, but one of the main uses is generating static sites.

I didn't find a plugin to work with textile files but [writing one was very easy](https://github.com/hgarcia/Blog/blob/master/lib/metalsmith-textile/index.js).

I did create [a few other plugins](https://github.com/hgarcia/Blog/tree/master/lib) as well, some of those are new for my particular needs, other slight modifications of existing plugins, so to work in my particular scenario.

The whole setup was fairly easy, old posts are not going to be changed and the new textile plugin will take care of that.

The new posts (like this one) are written in markdown and are handle by another plugin.

The build pipeline (script) is [nice and expressive](https://github.com/hgarcia/Blog/blob/master/build.js), you can see what's going on and how the site is put together.

### New deployment

I took the chance to migrate away from Heroku as well into a hosting platform that specialy on static sites.

It was surprisinly easy to switch to Netifly and deploy the site as part of the build process.

```
"use strict";
let netlify = require("netlify"),
  secrets = require("./.netlify_secrets"),
  accessToken = secrets.token,
  siteId = secrets.siteId;

netlify.deploy({
    access_token: accessToken,
    site_id: siteId,
    dir: "./build"})
      .then(function(deploy) {
        console.log("New deploy is live");
      })
      .catch(function (err) {
        console.log(err);
      });
```

I call this script from a `package.json` script.

```
"scripts": {
    "deploy": "node ./build.js && node deploy.js",
    "build": "node ./build.js",
    "start": "WRITTING=writting node ./build.js"
  },
```

### More blogging in 2016

Let's hope this new setup give me energy to blog more this year that my last two and start getting back into a rhythmn.
