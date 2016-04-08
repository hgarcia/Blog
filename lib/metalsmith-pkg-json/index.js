"use strict";

"use strict";

function plugin(options) {

  return function(files, metalsmith, done) {
    var pkgJson = `
{
  "name": "dynamicprogrammer-blog",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "serve ."
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "serve": "^1.4.0"
  }
}`;
    files["package.json"] = {
      contents: new Buffer(pkgJson, 'utf8')
    };

    return done();
  };
}

module.exports = plugin;