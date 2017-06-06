---
layout: post
title: Converting the Choo app into a PWA
summary: We will run Lighthouse for a report and try to convert our app into a compliant PWA
categories: [Programming, Choo]
collection: Choo
header_img: https://c2.staticflickr.com/6/5791/30586665571_65fead6800_h.jpg
header_img_id: 30586665571
background_position: 0px 55%
draft: true
---

Lighthouse is a Chrome extension that will run on a given domain and generate a report that helps you to see how "complaint" is your application with is considered a PWA.

The report will provide grades and suggestions on how to solve the problems of the app you are testing.

Running [the report](/pdfs/tv-series-failure.pdf) on our current application in localhost generates a less than "optimal" score.

## Accessibility

We will start with the simpler tasks, we are missing some things that will help us to get to 100%.

These are not part of the PWA baseline, but we should try to be a good web citizen, so accessibility is important.

We should add the language to our html tag and some labels to our forms.

For the language we open our main layout and we change `<html>` with `<html lang="en">`

For our forms the problem was that our labels are all pointing to the same input field so let's fix the `for` attribute of the labels for the season and episode fields in the `add-show.js` element.

```
 ...
 <label for="season" class="col-xs-5">Season</label>
 ...
 <label for="episode" class="col-xs-5">Episode</label>
 ...
```

Running the report now we will get a 100 in accessibility.

<img src="/images/posts/pwa-with-choo-accessibility.png" alt="Lighthouse accessibility rate." border="0"/>

## Best practices.

There is one item that relates to the application manifest.

__Manifest's short_name won't be truncated when displayed on homescreen__

We don't have a manifest yet, so let's create one. We will use the [App manifest generatot](https://app-manifest.firebaseapp.com/), you can also use a webpack plugin (if you are using webpack) or just create it manually.

Our manifest.json file will look like this.

```
{
  "name": "Tv-series",
  "short_name": "Tv-series",
  "theme_color": "#5264b4",
  "background_color": "#5264b4",
  "display": "fullscreen",
  "scope": "/",
  "start_url": "/"
}
```

We will have to tell the browser to load it using a meta tag in our layout.

```
<link rel="manifest" href="/manifest.json">
```

## PWA baseline html.

Let's start for the html improvements.

Add the viewport and theme color meta tags.

```
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#5264b4">
```

Make sure we display something is JS is disabled. For now we will just use the `noscript` tag. We should enable server side rendering with Choo at a later date to make for a better experience.

```
<noscript>
  Please make sure JS is enable to load this application.
</noscript>
```

We will also have to generate some icons, but we will leave that for later.

## Service worker and offline.

We create an empty js file under `/assets/js` and we name it sw.js.
In the layout we add the following at the bottom of the page.

```
  <script>
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
            .register("./assets/js/sw.js")
            .then(function() { console.log("Service Worker Registered"); });
  }
  </script>
```

If you do this and you don't see your service worker loading in your machine, make sure you are using "localhost" and not an ip address (ex: the server.js module will run in your 192.x.x.x ip by default but the worker will not load).

You can verify that the worker is installed and running in the Chrome developer tools, under Applications, service workers.

If you run the report right now, you will see that we are half way there, with a rate of 52.

We need to make sure that we cache some assets now.

Let's open the sw.js file and add the following code.

```
"use strict";

var CACHE_KEY = "tv-series-v1";
var resources = [
  "/",
  "/index.html",
  "/assets/styles.css",
  "/dist/bundle.js"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_KEY)
      .then(function (cache) {
        return cache.addAll(resources);
      })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

The first event will cache the resources when requested, the second event will intercept HTTP calls and try to serve those from the cached resources when offline.

## Resources

* [Github code for this article](https://github.com/hgarcia/tv-series/tree/v0.11)
* [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
