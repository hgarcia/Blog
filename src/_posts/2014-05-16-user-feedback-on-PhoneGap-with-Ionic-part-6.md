---
layout: post
title: A few different ways to improve user feedback in our Ionic application (Part 6).
summary: Showing upload progress, adding a navigation bar button and improving the user experience.
categories: [PhoneGap, JavaScript, Mobile, Angular, Ionic]
collection: Ionic
header_img: https://c1.staticflickr.com/9/8055/28697677373_b6666fc694_h.jpg
header_img_id: 28695721284
background_position: 0px 30%
---

*Code for this series is available on [Github](https://github.com/hgarcia/dynamic-sports)*


## Showing upload progress.

We want to report the progress of uploaded files with a simple message and a counter indicating how many have been uploaded. In the case there is an error with a file we want to show all errors at the end of the process.

Since the name of the file is not important (the user have no control on the file and there is not much he can do about the files itself), we will just indicate the number of files that erred uploading.

Once the process finishes we want to show a message that slides down from the top that indicates the result.

<iframe width="420" height="315" src="//www.youtube.com/embed/mwn__C6zitM?rel=0" frameborder="0" allowfullscreen></iframe>

## The code

We can start with a very simple UI element in the home page to indicate that the upload process started.

We are also moving the upload button into the navbar and adding a small badge icon to display the number of files.
If we have no files we want to disable the button and hide the badge.

```

	<ion-view title="New session">
	  <ion-nav-buttons side="right">
	      <button class="button button-clear icon ion-ios7-cloud-upload" ng-click="upload()" ng-disabled="uploadDisabled"></button>
	      <span class="count-badge" ng-show="totalFiles">{{totalFiles}}</span>
	  </ion-nav-buttons>
	  <ion-content class="center-child" has-header="true" padding="true">
	    <div class="info-message" ng-show="uploading">Uploading files...</div>
	    <play-stop-button click-handler="recording"></play-stop-button>
	  </ion-content>
	</ion-view>

```

And we need to do a few changes to the `HomeCtrl` as well to keep track of success and failures.

```

	/* globals angular, console */
	angular.module('dynamic-sports.controllers')
	  .controller('HomeCtrl', ['$scope', '$timeout', '$ionicPlatform', 'geoLocationService', 'fileService', 'serverService',
	    function ($scope, $timeout, $ionicPlatform, geoLocationService, fileService, serverService) {
	    'use strict';
	    var fileName;
	    $scope.uploading = false;
	    $scope.uploadDisabled = false;

	    function onChange(newPosition) {
	      var data = newPosition.coords;
	      data.timestamp = newPosition.timestamp;
	      fileService.save(fileName, data, function () {}, function (error) {});
	    }

	    function checkUploadFinished() {
	      $scope.uploading = ($scope.totalFiles > $scope.erroredCount);
	      $scope.uploadDisabled = $scope.totalFiles === 0 || $scope.uploading;
	    }

	    function errHandler(error) {
	      $scope.erroredCount += 1;
	      checkUploadFinished();
	    }

	    function filesSaved() {
	      $timeout(function () {
	        $scope.totalFiles -= 1;
	        checkUploadFinished();
	      }, 100);
	    }

	    function uploadFiles(files) {
	      $scope.uploading = true;
	      $scope.uploadDisabled = true;
	      filesToUpload(files);
	      $scope.erroredCount = 0;
	      checkUploadFinished();
	      $timeout(function () {
	        serverService.upload(files, filesSaved, errHandler);
	      }, 100);
	    }

	    function filesToUpload(files) {
	      $timeout(function () {
	        $scope.totalFiles = files.length;
	        $scope.uploadDisabled = $scope.totalFiles === 0;
	      }, 10);
	    }

	    $scope.upload = function () {
	      fileService.list(uploadFiles, errHandler);
	    };

	    $scope.recording = function (on) {
	      if (on) {
	        fileName = geoLocationService.start(onChange, errHandler);
	      } else {
	        geoLocationService.stop();
	        $scope.totalFiles += 1;
	        $scope.uploadDisabled = false;
	      }
	    };

	    $ionicPlatform.ready(function () {
	      fileService.list(filesToUpload, errHandler);
	    });
	  }]);
```

We check for the number of files once we load the home page and we keep track of the number of created and uploaded files.

## Changes on the file service.

During testing I found that the emulator reads not only the files we created but a few others from the root of the file sytem. We will create an specific folder for the tracking files to avoid problems.

We do that adding a private method on our `fileService` that creates a Directory if it doesn't exist.

```

	function getCreateDir(entry, successCb, errorCb) {
	  entry.getDirectory("dynsports", {create: true, exclusive: false}, successCb, errorCb);
	}

```

We replace all calls to `fileSystem.root.getFile()` with the result of calling this new function. For example our `write` function instead of using the `root` system directly:

```

	function write(fileName, data, successCb, errorCb) {
	  return function (fileSystem) {
	    fileSystem.root.getFile(fileName, {create: true, exclusive: false}, gotFileEntry(data, successCb, errorCb), errorCb);
	  };
	}

```

It now looks like this.

```

	function write(fileName, data, successCb, errorCb) {
	  return function (fileSystem) {
	    getCreateDir(fileSystem.root, function (dir) {
	      dir.getFile(fileName, {create: true, exclusive: false}, gotFileEntry(data, successCb, errorCb), errorCb);
	    }, errorCb);
	  };
	}

```

We also need to add a method to delete the files once upload finishes successfully.

We will call it from the `HomeCtrl` inside the success call back for the upload method.


## Tool-tip

Adding the tool-tip is easy. We only need a few lines of html and this css.
In the `home.html` file we add the div that will be our sliding tool-tip.

```

	<div class="status slide" ng-class='{"status-success-visible": uploadSucceded, "status-error-visible": uploadErrored}'>{{uploadMessage}}</div>

```

We will use CSS transitions to slide it down and up again. We are using two different classes for success and error to show the tool-tip in different colours.

```

	.slide {
	  color: #fff;
	  height: 22px;
	  position: absolute;
	  width: 100%;
	  text-align: center;
	  top: 0;
	  z-index: -1;
	  -webkit-transition: all 1s;
	  -moz-transition: all 1s;
	}
	.status-success-visible {
	  background-color: $balanced;
	  top: 64px;
	}
	.status-error-visible {
	  background-color: $energized;
	  top: 64px;
	}

```

We need to set the message and change those scope variables to true or false in the controller. We add a new private function that we will call when we check for upload completion.

```

	function toolTip() {
	  if (!$scope.uploading) {
	    $scope.uploadErrored = $scope.erroredCount > 0;
	    $scope.uploadSucceded = $scope.erroredCount === 0;
	    $scope.uploadMessage = ($scope.uploadSucceded) ? "Upload completed" : "Failed to upload " + $scope.erroredCount + " files";
	    $timeout(function () {
	      $scope.uploadErrored = false;
	      $scope.uploadSucceded = false;
	    }, 3000);
	  }
	}

```
