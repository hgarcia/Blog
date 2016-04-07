"use strict";

var basename = require("path").basename;
var dirname = require("path").dirname;
var extname = require("path").extname;
var textile = require("textile-js");

function isTextile(file) {
  return /\.textile/.test(extname(file));
}

function plugin(options) {
  options = options || {};
  var keys = options.keys || [];

  return function(files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function (file) {
      // console.log("checking file: %s", file);
      if (!isTextile(file)) { return; }
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + ".html";
      if ("." !== dir) { html = dir + "/" + html; }

      // console.log("converting file: %s", file);
      var str = textile(data.contents.toString(), options);
      data.contents = new Buffer(str);
      keys.forEach(function (key) {
        data[key] = textile(data[key], options);
      });

      delete files[file];
      files[html] = data;
    });
  };
}

module.exports = plugin;
