---
layout: post
title: Deleting files with PhoneGap (Part 8).
summary: On our application we are uploading files to a server, we need to delete the files from the device once we are done..
categories: [PhoneGap, JavaScript, Mobile, Angular, Ionic]
collection: Ionic
header_img: https://c1.staticflickr.com/9/8055/28697677373_b6666fc694_h.jpg
header_img_id: 28695721284
background_position: 0px 30%
---

*Code for this series is available on [Github](https://github.com/hgarcia/dynamic-sports)*


## Cleaning up

In our application we are uploading the files with the data from a session into our server. The problem is that we are not removing the files from the device.
So the next time that you want to upload files, you will be uploading all the files again.

It's not that much that we forgot about this, but we decided to move on to other things at the time. It's time to come back and clean up this part of the code.

It's surprisingly simple.

Our code is given list of `fileEntry` objects to the upload method. Each `fileEntry` have a `remove` method that will delete the entry from the device.

We need to call this method after the upload succeed. We could add the code into the `serverService.upload` method, but I don't think  it belongs there.

I think the consumer of this method should be responsible from deciding what to do with the file.

We need to modify the `upload` method a bit to return the fileEntry to the consumer on success.

```

	...

	function savedFile(file, cb) {
	  return function () {
	    cb(file);
	  };
	}

	return {
	  upload: function (files, onSuccess, onError) {
	    var ft =  new FileTransfer();
	    for (var i = 0; i < files.length; i++) {
	      var file = files[i];
	      ft.upload(file.toURL(), encodeURI("http://server.com/uploads"), savedFile(file, onSuccess), onError, getFileUploadOptions(file.fullPath));
	    }
	  }
	};

	...

```

Now the consumer can call the remove method directly.

```

	function filesSaved(file) {
	  if (file.remove) {
	    file.remove();
	  }
	  $timeout(function () {
	    $scope.totalFiles -= 1;
	    checkUploadFinished();
	  }, 100);
	}

```

Just in case we do a quick check to verify the argument respond to the `remove` method, before calling it.

You can add some callbacks to the remove method to react on success or error if you want.
