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
