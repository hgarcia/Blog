---
layout: post
title: Displaying current and max speed with PhoneGap and Ionic (Part 7).
summary: I want to display the current and maximun speed of the current session on the home page.
categories: [PhoneGap, JavaScript, Mobile, Angular, Ionic]
collection: Ionic
header_img: https://c1.staticflickr.com/9/8055/28697677373_b6666fc694_h.jpg
header_img_id: 28695721284
background_position: 0px 30%
---

*Code for this series is available on [Github](https://github.com/hgarcia/dynamic-sports)*


## Max and current speed.

We want to start displaying the maximum and current speed in the home page. The numbers need to be big enough to read easily. we also want to show the  duration for the active session.

## UI

We will change the home page once more. We will remove the *Uploading files* message since the badge numbers on the upload icon provide enough feedback.

We will accommodate the three boxes for the counters near the top of the application and we will move the start/stop button a tiny bit closer to the bottom.
The HTML for the `home.html` page now look like this.

```

	<ion-view title="New session">
	  <ion-nav-buttons side="right">
	      <button class="button button-clear icon ion-ios7-cloud-upload" ng-click="upload()" ng-disabled="uploadDisabled"></button>
	      <span class="count-badge" ng-show="totalFiles">{{totalFiles}}</span>
	  </ion-nav-buttons>
	  <div class="status slide" ng-class='{"status-success-visible": uploadSucceded, "status-error-visible": uploadErrored}'>{{uploadMessage}}</div>
	  <ion-content class="center-child" has-header="true" padding="true">
	    <div class="speedometer-container">
	        <div class="instrument">
	            <small class="icon-left ion-ios7-speedometer"> max speed</small><br/>
	            <div class="instrument-figure"> <span>{{session.maxSpeed}}</span> <small>km/h</small></div>
	        </div>
	        <div class="instrument">
	            <small class="icon-left ion-ios7-speedometer-outline"> curr. speed</small><br/>
	            <div class="instrument-figure"> <span>{{session.curSpeed}}</span> <small>km/h</small></div>
	        </div>
	        <div class="instrument">
	            <small class="icon-left ion-ios7-stopwatch-outline"> duration</small><br/>
	            <div class="instrument-figure no-units"> <span>{{session.elapsed}}</span> <small></small></div>
	        </div>
	    </div>
	    <div class="duration-container">
	    </div>
	    <play-stop-button class="play-button" click-handler="recording"></play-stop-button>
	  </ion-content>
	</ion-view>

```

We are going to clean up the CSS significantly. Mostly re-structuring the `sass` file and removing the centre button hack. We will be using absolute positioning for now.

```

	.center-child {
	  .scroll {
	    .speedometer-container {
	      margin-bottom: 24px;
	      margin-top: 12px;
	      position: relative;
	      text-align:center;
	      .instrument {
	        border: solid 2px $balanced;
	        display: inline-block;
	        min-width: 90px;
	        padding: 3px 6px;
	        .instrument-figure {
	          font-size: 24px;
	          &.no-units {
	            height: 25px;
	          }
	          small {
	            font-size: 12px;
	          }
	        }
	      }
	    }
	    .play-button {
	      position: relative;
	      top: 70px;
	    }

	....

```

## Controller abuse.

I'm abusing the `HomeCtrl` here and it's pretty obvious that a service wants to spawn out from this code.
we are adding a new object on the `$scope`, the `session` object, that contains three properties; maximum speed, current speed and duration.

We injected the `$interval` service to the controller to calculate duration and display it every second. We are also adding the great [moment.js](http://momentjs.com) library to calculate and display duration easily.

Take a look at the `stopTimer` method. We need to make sure we de-register the interval and we destroy the times to avoid memory leaks.

```

	/* globals angular, console */
	angular.module('dynamic-sports.controllers')
	  .controller('HomeCtrl', ['$scope', '$timeout', '$interval', '$ionicPlatform', 'geoLocationService', 'fileService', 'serverService',
	    function ($scope, $timeout, $interval, $ionicPlatform, geoLocationService, fileService, serverService) {
	    'use strict';
	    var fileName;
	    var elapsedTimer;
	    var duration;
	    $scope.uploading = false;
	    $scope.uploadDisabled = false;
	    $scope.uploadErrored = false;
	    $scope.uploadSucceded = false;
	    $scope.uploadMessage = "";
	    $scope.totalFiles = 0;

	    function resetSession() {
	      $scope.session = {maxSpeed: 0, curSpeed: 0, elapsed: "00:00"};
	    }

	    function toKmPerHour(meterPerSecond) {
	      return String(meterPerSecond * 3.6).substring(0, 3);
	    }

	    function setSpeed(speed) {
	      if (speed > 0) {
	        $scope.session.curSpeed = toKmPerHour(speed);
	      }
	      if (speed > $scope.session.maxSpeed) {
	        $scope.session.maxSpeed = toKmPerHour(speed);
	      }
	    }

	    function onChange(newPosition) {
	      var data = newPosition.coords;
	      data.timestamp = newPosition.timestamp;
	      setSpeed(data.speed);
	      fileService.save(fileName, data, function () {}, function (error) { alert("Error file save");});
	    }

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

	    function checkUploadFinished() {
	      $scope.uploading = ($scope.totalFiles > $scope.erroredCount);
	      $scope.uploadDisabled = $scope.totalFiles === 0 || $scope.uploading;
	      toolTip();
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

	    function checkUploadDisabledStatus() {
	      $scope.uploadDisabled = $scope.totalFiles === 0;
	    }

	    function setTotalFilesTo(qty) {
	      $scope.totalFiles = qty;
	      checkUploadDisabledStatus();
	    }

	    function filesToUpload(files) {
	      $timeout(function () {
	        setTotalFilesTo(files.length);
	      }, 10);
	    }

	    function padTime(val) {
	      if (val < 10) {
	        return "0" + val;
	      }
	      return val;
	    }

	    function displayDuration() {
	      var hours = padTime(duration.get('hours'));
	      var minutes = padTime(duration.get('minutes'));
	      var seconds = padTime(duration.get('seconds'));
	      if (hours === "00") {
	        $scope.session.elapsed = minutes + ":" + seconds;
	      } else {
	        $scope.session.elapsed = hours + ":" + minutes + ":" + seconds;
	      }
	    }

	    function startTimer() {
	      duration = moment.duration(0);
	      elapsedTimer = $interval(function () {
	        duration.add(1, 's');
	        displayDuration();
	      }, 1000);
	    }

	    function stopTimer() {
	      if (angular.isDefined(elapsedTimer)) {
	        $interval.cancel(elapsedTimer);
	        elapsedTimer = undefined;
	      }
	      resetSession();
	    }

	    $scope.upload = function () {
	      fileService.list(uploadFiles, errHandler);
	    };

	    $scope.recording = function (on) {
	      if (on) {
	        fileName = geoLocationService.start(onChange, function (err) { alert("Error geolocation service"); });
	        startTimer();
	      } else {
	        geoLocationService.stop();
	        setTotalFilesTo($scope.totalFiles + 1);
	        stopTimer();
	      }
	    };

	    $ionicPlatform.ready(function () {
	      fileService.list(filesToUpload, errHandler);
	    });

	    resetSession();
	  }]);

```

## Speed conversion.

The Geo-location service reports speed in meters per second and we want to display kilometers per hour. The conversion is easily done multiplying the speed by 3.6
We also make sure that we only display 3 characters for speed, so we use the `substring` method of the `String` object.

We encapsulates all the logic in the `toKmPerHour` function.

## How it looks.

This video was taken directly from my iPhone.

<iframe width="420" height="315" src="//www.youtube.com/embed/QfTCLIe951s?rel=0" frameborder="0" allowfullscreen></iframe>
