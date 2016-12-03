---
layout: post
title: Choo saving data in localStorage.
summary: We will use localStorage to store and load our data so it persist between sessions.
categories: [Programming, Choo]
collection: Choo
header_img: https://c2.staticflickr.com/6/5791/30586665571_65fead6800_h.jpg
header_img_id: 30586665571
background_position: 0px 55%
---

We have been working in our CRUD application for a while now. It's time to persist that data somehow. We will introduce an storage service that will have the responsibility to save and load data.

We will use localStorage as the store for now. The `storage` service will isolate the application from the actual store. We could later on use something more powerful like PouchDb, Rxdb, Firebase or just consume an API directly.

**For brevity I will not show the tests anymore unless there is something interesting, but you can check the repository below.**

## Storage service

We will start definning the `storage` service api.
We know for certain that we need a way to save new shows and list all shows already saved.
We will use the `store.js` library to make sure our implementation works well across browsers.

```
  npm i store --save
```

```
  "use strict";

  module.exports = {
    create(store) {
      return {
        get() {
          const shows = store.getAll();
           return Object.keys(shows)
            .map((k) => {
              return shows[k];
            });
        },
        save(data) {
          store.set(data.id, data);
        }
      }
    }
  };
```

This is a very, very naive implementation that will only work if you are storing just items of the same type in localStorage. That's why we can get away with calling `store.getAll()`.

## Saving shows in the storage service.

We need to inject the `storage` service in the models, so we will change the models to have a function that will return the model object. (This is not needed but I prefer to do this for testability purposes)

We will also use the `effects` to interact with our localStorage, to avoid needing to change too much of the application we will rename our `add` reducer to `refresh` and we will add a new `add` effect.

The application will still call `shows:add` but instead of calling the reducer will now call the effect that in time will call the renamed reducer.

The end result for the application will be the same, but the data will be preserved in localStorage.
We installed uuid via npm and we are using it to create the `id` attribute for the shows. (We added the attribute to the show model as well).

```
"use strict";

const uuid = require("uuid");

module.exports = {
  create(storage) {
    return {
      namespace: "shows",
      state: {
        list: []
      },
      reducers: {
        refresh: (data, state) => {
          return {list: data};
        }
      },
      effects: {
        add: (data, state, send, done) => {
          data.id = uuid.v4();
          storage.save(data);
          send("shows:refresh", storage.get(), done);
        }
      },
      subscriptions: [
      ]
    };
  }
};
```

The tests for the shows model now are a bit different

```
  "use strict";

  const test = require("tape"),
    storage = require("../../lib/storage").create({set() {}, get() {}}),
    shows = require("../../models/shows").create(storage);

  test("#refresh", (assert) => {
    const data = [{title: "new show", season: 1, episode: 3}],
      results = shows.reducers.refresh(data, shows.state);

    assert.equal(results.list.length, 1, "should return the list");
    assert.equal(results.list[0].title, data[0].title, "should have the shows");
    assert.end();
  });

  test("#add should save the data", (assert) => {
    const
      newShow = {title: "new title"},
      storage = {
        save(data) {
          assert.equal(data.title, newShow.title, "should save the new show");
          assert.end();
        },
        get() {
          return [];
        }
      },
      _shows = require("../../models/shows").create(storage);
    _shows.effects.add(newShow, shows.state, () => {}, ()=> {});
  });

  test("#add should call refresh with the new data", (assert) => {
    const
      newShow = {title: "new title"},
      storage = {
        save(data) { },
        get() {
          return [newShow];
        }
      },
      _shows = require("../../models/shows").create(storage);
    _shows.effects.add(newShow, shows.state, (action, data) => {
      assert.equal(action, "shows:refresh", "should call the right action");
      assert.equal(data[0].id, newShow.id, "should be the data stored in localStorage");
      assert.end();
    }, ()=> {});
  });

```

And we will change the top of our Clients.js file as well.

```
  const choo = require("choo"),
    app = choo(),
    home = require("./pages/home"),
    store = require("store"),
    storage = require("./lib/storage").create(store);

  app.model(require("./models/show"));
  app.model(require("./models/shows").create(storage));
```

## Loading the data from localStorage

We will add another effect in the shows model.

```
  load: (data, state, send, done) => {
    send("shows:refresh", storage.get(), done);
  }
```

We need to call this effect when the `show-list` element start. We can take a few different approaches to do this, but `choo` includes an onload event that's very well suited for this scenario.

So we will add the event for the `show-list` element and a handler for it in the `home` page. A thing to note here is that the onLoad event is not a DOM event but a `choo` event, so you will not receive an event as the first argument, but the `element`.

show-list:
```
  function onLoad(options) {
    return () => {
      options.loadShows();
    };
  }

  ...

  return html`<table class="table" onload=${onLoad(options)}>
```

home:
```
  function _getShowListParams(state, send) {
    return {
      shows: state.shows.list,
      loadList: () => {
        send("shows:load");
      }
    };
  }

  ...

  ${showList(_getShowListParams(state, send))}
```

## Note on mocking and stubbing.

You may have noticed that we are doing lot of manual mocking and stubbing in these tests. This is not a good idea and in real/production grade code you should try to use a mocking library to mock objects.
In the case of the send function in the other hand, there is not a real advantage on using a mocking library or just a manual mock since the contract is just the arity of the function that the mocking library will not be able to enforce (in javascript).

## Resources

* [Github code for this article](https://github.com/hgarcia/tv-series/tree/v0.5)
* [localStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage)
* [store.js](https://github.com/marcuswestin/store.js/)
* [PouchDb](https://pouchdb.com/)
* [RxDb](https://github.com/pubkey/rxdb)
* [Firebase](https://firebase.google.com/)
