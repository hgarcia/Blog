"use strict";

var _ = require("lodash"),
  moment = require("moment");

function plugin(options) {

  return function(files, metalsmith, done) {
    var series = {};

    _.values(files).forEach((f) => {
      if (f.collection) {
        if (!series[f.collection]) {
          series[f.collection] = [];
        }
        series[f.collection].push({
          title: f.title,
          url: f.permaLinkUrl,
          date: moment.utc(f.date).format("YYYY-MM-DD")
        });
      }
    });
    Object.keys(files).forEach((key) => {
      if (files[key].collection) {
        files[key].series = series[files[key].collection];
      }
    });
    done()
  };
}

module.exports = plugin;
