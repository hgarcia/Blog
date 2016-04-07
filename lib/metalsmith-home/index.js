"use strict";

var _ = require("lodash");

function plugin(options) {

  return function(files, metalsmith, done) {
    var metadata = metalsmith.metadata();
    metadata.posts = _.reverse(_.values(files));
    metadata.collections.posts = _.reverse(_.values(files));
    done()
  };
}

module.exports = plugin;
