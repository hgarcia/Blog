---
layout: post
title: Adding a logo to ReactBootstrap NavBar.
summary: Use the brand attribute.
categories: [Programming, React, JavaScript]
header_img: https://c1.staticflickr.com/9/8225/29702123916_1e58024850_h.jpg
header_img_id: 29702123916
background_position: 0px 55%
---

This is very simple, but for whatever reason I struggle for a bit. So I'm posting it here in case somebody else finds it helpful.

I wanted to add an icon as the logo to the navigation bar while using [ReactBootstrap](http://react-bootstrap.github.io/)

The examples on the ReactBootstrap site use a string as the brand attribute.

I took me a bit of trying different things until I decided to take a look at the code of the library.

After a quick look, the solution to this was obvious. The `brand` attribute is of type `React.PropTypes.node`

In other words you can do this.

```
  var icon = (
    <span class="logo">
      <a href="/">
        <img src="/awesome-logo.png" height="33" width="120" alt="text here" /></a>
    </span>
  );

  ...
  <Navbar brand={icon} toggleNavKey={0}>
  ...
```

Et voila! It works!

Not sure if this idiomatic React, so if you know of a better way, please leave a comment below.
