---
layout: post
title: Calculating distance and speed with the GeoLocation API - PhoneGap (Part 9).
summary: We will be making some changes on the application to calculate traveled distance and speed based on duration and the distance between to sets of coordinates.
categories: [PhoneGap, JavaScript, Mobile, Angular, Ionic]
collection: Ionic
header_img: https://c1.staticflickr.com/9/8055/28697677373_b6666fc694_h.jpg
header_img_id: 28695721284
background_position: 0px 30%
---

*Code for this series is available on [Github](https://github.com/hgarcia/dynamic-sports)*

## Home screen changes.

I decided to change the data displayed on Home screen to provide information regarding distance as well.

I also made a few changes on the way we are using the Geo location plug-in. I decided to stop calling `watchPosition()` and instead use the angular `$interval` service and call `getCurrentPosition()` once every second.

I'm not sure if this will work for sports where speed is hight (ski, biking) and I may have to either short the time or revert this changes.

The changes where fairly easy to do and didn't required many changes on the consumers.

```

	/* globals angular */
	angular.module('dynamic-sports.services')
	  .factory('geoLocationService', ['$interval', function ($interval) {
	    'use strict';
	    var watchId;

	    return {
	      start: function (success, error) {
	        watchId = $interval(function () {
	          navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy: true});
	        }, 1000);
	      },
	      stop: function () {
	        if (watchId) {
	          $interval.cancel(watchId);
	        }
	      }
	    };
	  }]);

```


## Calculating distances between coordinates.

This is a solved problem, so a quick [Google search](https://www.google.com/search?q=distance+between+two+coordinates) and a quick visit to [this website](http://www.movable-type.co.uk/scripts/latlong.html) provides the answer.

It translates to two functions. The meat of the calculation is done inside the `calculateDistance` function. As a convention, I return -1 in case there is an error due to invalid data.

```

	function toRad(value) {
	  var RADIANT_CONSTANT = 0.0174532925199433;
	  return (value * RADIANT_CONSTANT);
	}

	function calculateDistance(starting, ending) {
	  var KM_RATIO = 6371;
	  try {
	    var dLat = toRad(ending.latitude - starting.latitude);
	    var dLon = toRad(ending.longitude - starting.longitude);
	    var lat1Rad = toRad(starting.latitude);
	    var lat2Rad = toRad(ending.latitude);

	    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    var d = KM_RATIO * c;
	    return d;
	  } catch(e) {
	    return -1;
	  }
	}

```

The trick to display distance traveled is to use an accumulator for the distance traveled each time the interval function is called.

```

	function setSpeed(coords) {
	  var KMS_TO_KMH = 3600;
	  if (!prevCoord) {
	    prevCoord = coords;
	  }
	  $scope.session.distance += calculateDistance(prevCoord, coords);
	  if (duration.asSeconds() > 0) {
	    $scope.session.avgSpeed = ($scope.session.distance / duration.asSeconds()) * KMS_TO_KMH;
	  }
	  prevCoord = coords;
	}

```

The `setSpeed` function takes the coordinates received from `getCurrentPosition()`. I think the code is pretty self explanatory.

Some things that may not be obvious are that `prevCoord` is an interval variable of the controller and keeps track of the previous position.

You may be wandering where the `duration` object is coming from. We create it when we click the start button. It's a moment.js duration object, and the `asSeconds` method returns the total number of seconds in the interval.

The distance is calculated in kilometers so we need to convert kilometers per second to kilometer per hour. It's easily done by multiplying by 3600.

We did change the view to reflect this changes as well, and the session object now looks like this.

```

	$scope.session = {avgSpeed: 0, distance: 0, elapsed: "00:00"};

```


## Accuracy.

The Geo location API accuracy is just not there yet. It's understandable and it will depend on many factors, like location, satellite coverage, interference from buildings and more. In any case I did enable high accuracy and so far the results have been mixed.

I need to do some more testing in real conditions to see how things work. May be this week-end.
