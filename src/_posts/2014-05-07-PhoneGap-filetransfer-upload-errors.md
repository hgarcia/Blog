---
layout: post
title: PhoneGap errorCode 1 on FileTransfer upload.
summary: The solution (a solution) for the error code 1 when using the FileTransfer object.
categories: [PhoneGap]
header_img: https://c1.staticflickr.com/9/8166/29138609175_244764418f_h.jpg
header_img_id: 29138609175
background_position: 0px 40%
---

## FileTransferError.code = 1

This seems to be a common error (at least for all the questions about it in the Internet).
I hope this short post will save some time to others.

When you follow the documentation for the `FileTransfer` plug-in you end up with code that looks like this.

```

	var ft =  new FileTransfer();
    ft.upload(fileEntry.fullPath, encodeURI("http://example.com/uploads"), onSuccess, onError, getFileUploadOptions(fileEntry.fullPath));

```

If you do this you will get an error with code 1.

The solution can actually be found in the documentation of the `file` plug-in. They introduced a new method to the `FileEntry` object to help with this problem.

The new revised code looks like this.

```

	var ft =  new FileTransfer();
    ft.upload(fileEntry.toURL(), encodeURI("http://example.com/uploads"), onSuccess, onError, getFileUploadOptions(fileEntry.fullPath));

```

You will notice that for the first argument to the upload method we now use the `toURL()` method of the `FileEntry`, everything else stays the same.
