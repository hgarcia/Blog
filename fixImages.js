"use strict";

let Metalsmith = require("metalsmith"),
  layouts = require("metalsmith-layouts"),
  metadata = require("metalsmith-filemetadata"),
  textile = require("./lib/metalsmith-textile"),
  home = require("./lib/metalsmith-home"),
  datePermalink = require("./lib/metalsmith-date-permalink"),
  archive = require("metalsmith-archive"),
  browserSync = require("metalsmith-browser-sync"),
  permalinks = require("metalsmith-permalinks"),
  collections = require("metalsmith-collections"),
  assets = require("metalsmith-assets"),
  feed = require("metalsmith-feed"),
  drafts = require("metalsmith-drafts"),
  dateInFilename = require("metalsmith-date-in-filename");

Metalsmith(__dirname)
  .use(dateInFilename(true))
  .use(metadata([
    {
      pattern: "**/*",
      metadata: {
        "site": {
          "url": "http://dynamicprogrammer.com",
          "blog_url": "http://blog.dynamicprogrammer.com",
          "photos_url": "http://blog.dynamicprogrammer.com/categories/photos.html",
          "twitter_url": "https://twitter.com/theprogrammer",
          "projects_url": "http://github.com/hgarcia",
          "music_url": "http://www.acidplanet.com/artist.asp?songs=292536&amp;t=4858",
          "rss_url": "http://feeds.feedburner.com/TheDynamicProgrammer",
          "author": "Hernan Garcia",
          "name": "The Dynamic Programmer"
        }
      }
    }
  ]))
  .use(datePermalink())
  .use(drafts())
  .use(archive({collections: "_posts"}))
  .use(collections())
  .use(textile())
  .use(permalinks({
    collection: "_posts",
    pattern: ":date/:title",
    relative: false
  }))
  .use(home())
  .use(feed({
    collection: "posts",
    "site_url": "http://blog.dynamicprogrammer.com/",
    "title": "The Dynamic Programmer"
  }))
  .use(layouts({
      "engine": "liquid",
      "directory": "_layouts"
    }))
  .use(assets({
    source: "./assets", // relative to the working directory
    destination: "./assets" // relative to the build directory
  }))
  .use(assets({
    source: "./images", // relative to the working directory
    destination: "./images" // relative to the build directory
  }))
  .use(browserSync({
    server: "build",
    files: ["src/**/*.md", "src/**/*.textile", "src/*.md", "src/*.textile", "_layouts/**/*.*", "_layouts/**/*"]
  }))
  .build(function(err) {
    if (err) {
      throw err;
    }
  });
