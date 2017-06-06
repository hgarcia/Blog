---
layout: post
title: Testing the use of the firebase db
summary: We will mock our Firebase database to test our storage service.
categories: [Programming, Choo]
collection: Choo
header_img: https://c2.staticflickr.com/6/5791/30586665571_65fead6800_h.jpg
header_img_id: 30586665571
background_position: 0px 55%
---

We can certainly setup a test db in Firebase and test directly into it. Even if that is not "unit testing" there are many instances where that can be preferred.

Since Firebase is a third party service I prefer to mock it out in this case.

## Creating a service to encapsulate the use of Firebase

We will extract all code related to Firebase and the interaction with the database into it's own service and inject that service into our storage.js module.

```
"use strict";

const firebase = require("firebase");

module.exports = {
  db() {
    firebase.initializeApp({
      apiKey: "[API-KEY]",
      authDomain: "[APP].firebaseapp.com",
      databaseURL: "https://[APP].firebaseio.com",
      storageBucket: "[BUCKET].appspot.com"
    });
    return firebase.database();
  }
};

```

Now we will change the `client.js` file to inject the db into the storage service.

```
  ...
  db = require("./lib/firebase").db(),
  storage = require("./lib/storage").create(db);
  ...
```

And we will change the content of the `storage.js` file to take the dependency.

```
module.exports = {
  create(db) {
    return {
      get(cb) {
        const shows = db.ref("shows/");
        shows.once("value", (data) => {
          const values = data.val(),
            shows = Object.keys(values).map((k) => {
              return values[k];
            });
          cb(shows || []);
        });
      },
      save(data) {
        Reflect.deleteProperty(data, "errors");
        db.ref("shows/" + data.id).set(data);
      },
      removeById(id) {
        db.ref("shows/" + id).remove();
      }
    };
  }
};
```

## Writing our tests

We are going to "fake" our db service.
We will just hand roll it for now, you can use libraries like sinon for a more robust solution, but for now, hand rolling works at the moment.

```
"use strict";

const test = require("tape"),
  storage = require("../../lib/storage");

function fakeDb() {
  return {
    ref() {}
  };
}

test("#get should return an empty array if no results", (assert) => {

  const db = fakeDb(),
    st = storage.create(db);

  db.ref = () => {
    return {
      once(param, cb) {
        cb(null);
      }
    };
  };

  st.get((result) => {
    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 0);
    assert.end();
  });
});

test("#get should return an empty array if no data", (assert) => {

  const db = fakeDb(),
    st = storage.create(db);

  db.ref = () => {
    return {
      once(param, cb) {
        cb({ val() { return null;} });
      }
    };
  };

  st.get((result) => {
    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 0);
    assert.end();
  });
});


test("#get should one result if included", (assert) => {

  const db = fakeDb(),
    st = storage.create(db);

  db.ref = (url) => {
    assert.equal(url, "shows/");
    return {
      once(param, cb) {
        assert.equal(param, "value");
        cb({ val() { return {key: {}};} });
      }
    };
  };

  st.get((result) => {
    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 1);
    assert.end();
  });
});

test("#save", (assert) => {
  const db = fakeDb(),
    st = storage.create(db),
    data = {id: "1234", errors: [], some: "data" };

  db.ref = (url) => {
    assert.equal(url, "shows/1234");
    return {
      set(_data) {
        assert.equal(_data.errors, undefined);
        assert.equal(_data.id, "1234");
        assert.equal(_data.some, "data");
        assert.end();
      }
    };
  };

  st.save(data);
});


test("#removeById", (assert) => {
  const db = fakeDb(),
    st = storage.create(db),
    data = {id: "12345", errors: [], some: "data" };

  db.ref = (url) => {
    assert.equal(url, "shows/12345");
    return {
      remove() {
        assert.end();
      }
    };
  };

  st.removeById(data.id);
});

```

## Conclusions

In general I will always recommend to use a good mocking library for this cases.
But sometimes is easier to just go ahead and roll it like this.
These tests are exposing too much of the implementation but is very difficult to write better tests in this particular case.

## Resources

* [Github code for this article](https://github.com/hgarcia/tv-series/tree/v0.10)
* [Firebase](https://firebase.google.com/)
