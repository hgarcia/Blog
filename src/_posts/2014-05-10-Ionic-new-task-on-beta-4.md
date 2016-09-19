---
layout: post
title: Ionic new serve task.
summary: Improves your development cycle.
categories: [PhoneGap, JavaScript, Mobile, Ionic]
header_img: https://c1.staticflickr.com/9/8800/29285089926_5d48d96481_h.jpg
header_img_id: 29285089926
background_position: 0px 46%
---

I'm not sure when these tasks have been introduced but I just installed Ionic 1.0.0 beta 4 and after running the `ionic` command I saw three new tasks that you can run:

```

    serve - Start a local development server for easy app development and testing
    login - Login to the Ionic Platform
    upload - Upload an Ionic project to the Ionic Platform (requires login)

```

I really appreciate the `serve` task that make running a development server a bit easier than running `python -m SimpleHTTPServer 8000` from inside the `www` folder of the project.

Now you just run `ionic serve` from the root of the project and your default browser will open with the application loaded in it. It will also run a a live reload server, so when you change the files in your project the browser window will reload with the changes.

This should improve your development cycle without having to set up any of this on your own.

The other two task are related to the upcoming Ionic Platform.
