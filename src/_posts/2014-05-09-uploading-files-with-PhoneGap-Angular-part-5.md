---
layout: post
title: Uploading files with PhoneGap and Angular (Part 5).
summary: We will upload the information we recorded in Part 3 into a service.
categories: [PhoneGap, JavaScript, Mobile, Angular, Ionic]
collection: Ionic
header_img: https://c1.staticflickr.com/9/8055/28697677373_b6666fc694_h.jpg
header_img_id: 28695721284
background_position: 0px 30%
---

*Code for this series is available on [Github](https://github.com/hgarcia/dynamic-sports)*


In the previous to last post we created a series of files, each one with data from a recorded session. We want to upload that data into a server for further processing.

In this post we will add the upload mechanism and we will build a simple web server that will receive the data.

From this post one we will only show the code for the implementation and left the test code out of the posts unless there is something specially interesting on it.
You can always get the code with all the tests in the [github repository](https://github.com/hgarcia/dynamic-sports) for this project.

## Getting the saved files

Before uploading any of the files we need to get a list of files available for upload.
We use the cordova file plugin that we already added previously to the project.
We will add a list method to our `fileService`

We expose a public `list` function and we move the implementation into a private function.

```

    function list(successCb, errorCb) {
      return function (fileSystem) {
        var reader = fileSystem.root.createReader();
        reader.readEntries(successCb, errorCb);
      };
    }

    ...

    list: function (successCb, errorCb) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, list(successCb, errorCb), errorCb);
    },

```


## The server

We need to upload the files to a server, for this exercise we created a simple web server using [Express](http://expressjs.com) and we deploy it to Heroku. I'm not implementing any type of authentication or security at this point. We will do that later.

*The code for the web server can be found on [Github](https://github.com/hgarcia/dynamic-sports-api) You can clone and use it as a starting point if you wish.*

## And the server service

We start by installing the cordova `file-transfer` plug-in.

```

    cordova plugin add org.apache.cordova.file-transfer

```

Once the plug-in is installed we can write our upload method. We want to pass an array of `FileEntry` objects and send each one to the server.

We also want to report back success or error for each entry individually what makes our implementation very simple.

```

    /* globals angular */
    angular.module('dynamic-sports.services')
      .factory('serverService', function () {
        'use strict';

        function getFileUploadOptions(fileURI) {
          var options = new FileUploadOptions();
          options.fileName = fileURI.substr(fileURI.lastIndexOf('/')+1);
          options.mimeType = "text/plain";
          return options;
        }
        return {
          upload: function (files, onSuccess, onError) {
            var ft =  new FileTransfer();
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              ft.upload(file.toURL(), encodeURI("http://app.herokuapp.com/uploads"), onSuccess, onError, getFileUploadOptions(file.fullPath));
            }
          }
        };
      });

```

We hook everything together on the `HomeCtrl` after injecting the new service

```

    .controller('HomeCtrl', ['$scope', 'geoLocationService', 'fileService', 'serverService',
      function ($scope, geoLocationService, fileService, serverService) {

    ....

    function filesSaved() {
      alert("Saved");
    }

    function uploadFiles(files) {
      serverService.upload(files, filesSaved, errHandler);
    }

    $scope.upload = function () {
      fileService.list(uploadFiles, errHandler);
    };

```

And we add a button to the home page that calls the `upload()` function.

```

    <button class="button button-block" ng-click="upload()">Upload</button>

```

## Next Steps

We will add some feedback to the user regarding the upload process and we will improve the UI for the Home page.
