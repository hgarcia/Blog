---
layout: post
title: Adding Firebase database to our choo application
summary: Replacing local storage with Firebase was very easy due to our architecture and the ease of use of Firebase.
categories: [Programming, Choo]
collection: Choo
header_img: https://c2.staticflickr.com/6/5791/30586665571_65fead6800_h.jpg
header_img_id: 30586665571
background_position: 0px 55%
---

If you haven't use Firebase before go to the [Firebase console](https://firebase.google.com/), log in with a Google account and follow the steps to create your first project.

We are naming ours tv-series.

Once we got that out of the way, we need to install the Firebase SDK, since we are using browserify to build our app, we will use the node package.

```
  npm install firebase --save
```

## Caveats (danger)

The structure we are using below is not exactly how you will use it for a multi user application so keep that in mind for now.

## Storing and updating shows in our db in the cloud

Open the storage.js file and initialize and configure firebase.

```
  const firebase = require("firebase");

module.exports = {
  create(store) {
    firebase.initializeApp({
      apiKey: "<API-KEY>",
      authDomain: " <APP-ID>.firebaseapp.com",
      databaseURL: "https://<DB>.firebaseio.com",
      storageBucket: "<BUCKET>.appspot.com"
    });
  ....
```

Let's start saving some data into firebase first.
We will change the code inside our `.save()` method. Instead of calling the `store` we will call firebase directly.

```
  save(data) {
    Reflect.deleteProperty(data, "errors");
    firebase.database().ref("shows/" + data.id).set(data);
  },
```

Notice that we `delete` the `errors` property of the show since Firebase will complain otherwise as is not valid JSON.
We will store our data in a `shows` bucket and we will use the data.id as the keys for the show information.

This call will work to add new shows as well as to update existing shows. If you want to make your updates atomics at the property level you should explore the `.update()` method for firebase, but in our case a complete object update works well.

## Reading the shows.

Firebase have a few ways to read data, in many cases you may want to listen to change events so to keep data synchronized between devices or between users.
In our case we only need to read the shows when the application starts so we read a snapshot of the data using the `.only()` method.

We will also have to change the `.get()` method of our storage to be asynchronous and accept a callback as well as the consumer of the method.

Let's start with the changes on `.get()`

```
  get(cb) {
    const shows = firebase.database().ref("shows/");
    shows.once("value", (data) => {
      const values = data.val(),
        shows = Object.keys(values).map((k) => {
          return values[k];
        });
      cb(shows || []);
    });
  },
```

We are reading all shows under the show buckets and we are mapping all the shows into an array for our application to use.

The consumer of the `.get()` method is the `shows.js` model.

```
  bus.on("shows:load", () => {
    storage.get((shows) => {
      state.shows = shows;
      __render();
    });
  });
```

The change on the get method didn't affect us much thanks to be using an event bus for all life cycle events on choo v5.

## Removing data

The last bit is to change the removeById method of our storage.
Once again a super simple, change.

```
  removeById(id) {
    firebase.database().ref("shows/" + id).remove();
  }
```

This is all we need to get our application storing and retrieving information from a bucket on firebase.

Next time we will show how to unit test these changes.

## Resources

* [Github code for this article](https://github.com/hgarcia/tv-series/tree/v0.9)
* [Firebase](https://firebase.google.com/)
