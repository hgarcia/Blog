---
layout: post
title: Choo cleaning up home page.
summary: We will improve on the previous refactoring where we removed dependencies on the framework.
categories: [Programming, Choo]
collection: Choo
header_img: https://c2.staticflickr.com/6/5791/30586665571_65fead6800_h.jpg
header_img_id: 30586665571
background_position: 0px 55%
---

We refactor the elements in a previous post to externalize the dependencies to the framework. We took the simpler possible approach and in doing so we moved the definition of the hanlders for the events raised by the elements inside the `page` that consumes the element.
In this case is the home page.

I will like to refactor things a bit more and clean up that code.

The first thing I will like to do is to introduce the idea of a contract for each element. This contract will validate that the `parameter object` that we pass when calling and element is valid.

There are many ways to do that but since `choo` already uses internally the [assert](https://www.npmjs.com/package/assert) library we will do the same.

## Writting assertions to validate our parameters.

The assert library will check the given parameters and it will validate that follow a given convention.
If the asserts fails, it will raise an error.
This behaviour could be dangerous in production, so our build script is already configured to remove the assertions from the final code.

```
  # add -d switch for sourcemapping and debugging production.
  NODE_ENV=production browserify -e client.js -o dist/js/main.js \
    -t envify \
    -g yo-yoify \
    -g unassertify \
    -g es2040 \
    -g uglifyify | uglifyjs
```

I will show here the assertions for the `addShow` element. You can check the rest in the repository if you want (see the bottom of the article for a link).

```
  const html = require("bel"),
    assert = require("assert");

  ...

  function addShow (options) {
    assert.equal(typeof options.show.title, "string", "addShow: options.show.title must be a string");
    assert.equal(typeof options.show.season, "number", "addShow: options.show.season must be an int");
    assert.equal(typeof options.show.episode, "number", "addShow: options.show.episode must be an int");
    assert.equal(typeof options.addShow, "function", "addShow: options.addShow must be a function");
    assert.equal(typeof options.updateShow, "function", "addShow: options.updateShow must be a function");
```

## Using a function to generate the addShows parameters.

We were definning the handler and the state for the component inline when calling the methos.
We will move that code into a function that will return the object.
We will also expose the function, so we can easily test it.

```
  function _getAddShowParams(state, send) {
    return {
      show: state.show,
      addShow: (data) => {
        send("shows:add", data);
        send("show:reset");
      },
      updateShow: (data) => {
        send("show:update", data);
      }
    };
  };

  module.exports = {
    getAddShowParams: _getAddShowParams,
    render(state, prev, send) {
      var self = this;
      return html`
        <main>
        ${navBar()}
        <div class="container">
        ${addShow(_getAddShowParams(state, send))}
        ${showList({shows: state.shows.list})}
        </div>
        </main>`;
    }
  };
```

Now that we exposed the `getAddShowParams` function we can easily write some tests for it.

```
  test("getAddShowParams:addShow", (assert) => {
    const send = (eventName, data) => {
      if (eventName === "shows:add") {
        assert.equal(eventName, "shows:add", "It should call shows:add");
        assert.equal(data.some, "data", "It should be called with the data");
        assert.end();
      }
    },
    params = home.getAddShowParams({show: {title: "some thing"}}, send);
    params.addShow({some: "data"});
  });

  test("getAddShowParams:addShow reset", (assert) => {
    const send = (eventName, data) => {
      if (eventName === "show:reset") {
        assert.equal(eventName, "show:reset", "It should call show:reset");
        assert.end();
      }
    },
    params = home.getAddShowParams({show: {title: "some thing"}}, send);
    params.addShow({some: "data"});
  });

  test("getAddShowParams:updateShow", (assert) => {
    const send = (eventName, data) => {
      assert.equal(eventName, "show:update", "It should call show:update");
      assert.equal(data.some, "data", "It should be called with the data");
      assert.end();
    },
    params = home.getAddShowParams({show: {title: "some thing"}}, send);
    params.updateShow({some: "data"});
  });
```

Notice how addShow is raising 2 events for the action, it doesn't really feel right, we will have to come back to it at a later time.

As always the source for the project is in github tagged.

## Resources

* [Github code for this article](https://github.com/hgarcia/tv-series/releases/tag/v0.4)
