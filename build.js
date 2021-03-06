"use strict";

var Metalsmith = require("metalsmith"),
  archive = require("metalsmith-archive"),
  assets = require("metalsmith-assets"),
  browserSync = require("metalsmith-browser-sync"),
  changed = require("metalsmith-changed"),
  collections = require("metalsmith-collections"),
  dateInFilename = require("metalsmith-date-in-filename"),
  drafts = require("metalsmith-drafts"),
  feed = require("metalsmith-feed"),
  markdown = require("metalsmith-markdown"),
  metadata = require("metalsmith-filemetadata"),
  layouts = require("metalsmith-layouts"),
  permalinks = require("metalsmith-permalinks"),
  series = require("./lib/metalsmith-simple-series"),
  textile = require("./lib/metalsmith-textile"),
  home = require("./lib/metalsmith-home"),
  datePermalink = require("./lib/metalsmith-date-permalink");

function buildChain() {

  var chain = Metalsmith(__dirname)
    .clean(false)
    .use(changed())
    .use(dateInFilename(true))
    .use(metadata([
      {
        pattern: "**/*",
        metadata: {
          "site": {
            "url": "https://dynamicprogrammer.com",
            "blog_url": "https://dynamicprogrammer.com",
            "photos_url": "https://www.flickr.com/photos/theprogrammer",
            "twitter_url": "https://twitter.com/theprogrammer",
            "projects_url": "https://github.com/hgarcia",
            "music_url": "http://www.acidplanet.com/artist.asp?songs=292536&amp;t=4858",
            "rss_url": "https://dynamicprogrammer.com/rss.xml",
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
    .use(markdown())
    .use(series())
    .use(permalinks({
      collection: "_posts",
      pattern: ":date/:title",
      relative: false
    }))
    .use(home())
    .use(feed({
      collection: "posts",
      "site_url": "https://dynamicprogrammer.com/",
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
    }));
    if (process.env.WRITTING) {
      chain
      .use(browserSync({
        server: "build",
        files: ["src/**/*.md",
          "src/**/*.textile",
          "src/*.md",
          "src/*.textile",
          "_layouts/**/*.*",
          "_layouts/**/*",
          "assets/**/*.*",
          "_partials/*.*",
          "lib/**/*.js",
          "*.js"]
      }))
    }
  return chain;
}

  buildChain()
  .build(function(err) {
    if (err) {
      throw err;
    }
  });
