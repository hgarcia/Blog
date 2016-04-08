'use strict';

var moment = require("moment");
module.exports = plugin;

/**
 * This groups collections into objects based on publishDate, modifiedDate, then date fields in YAML Front Matter (YFM)
 * @param options
 * @param {array|string} options.collections An array of collection types - anything that creates root-relative articles/posts or a single string (gets converted to array)
 * @param {array|string} options.dateFields metadata fields to check for on the file
 * @param {boolean} options.groupByMonth Group the posts by month? Otherwise grouped per year only, defaults to `true`
 * @param {string} options.listSortOrder Sort order for year, `asc` or `desc`, defaults to 'desc' (current year first)
 * @param {string} options.postSortOrder Sort order for individual posts, `asc` or `desc`, defaults to 'desc' (most recent post first)
 * @param {string} options.monthSortOrder Sort order for months, `asc` or `desc`, defaults to 'desc' (current month is first)
 * @param {string} options.locale moment.js locale value
 * @returns {Function}
 */
function plugin(options) {
    options = options || {};

    return function (files, metalsmith, done) {
        Object.keys(files).forEach(function (key) {
            var valueFound = false;
            var file;
            var year, date, month, day;
            file = files[key];
            if (file.date) {
              date = moment.utc(file.date);
              file.year = date.format("YYYY");
              file.month = date.format("MM");
              file.day = date.format("DD");
              file.permaTitle = file.title.toLowerCase()
                .replace(/[^a-z0-9]/g, " ")
                .replace(/^ +| +$/g, "")
                .replace(/ +/g, "-")
              file.permaLinkUrl = "/" + file.year + "/" + file.month + "/" + file.day + "/" + file.permaTitle;
            }
        });

        done();
    }
}