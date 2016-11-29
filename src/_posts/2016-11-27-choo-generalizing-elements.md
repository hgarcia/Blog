---
layout: post
title: Choo generalizing your elements.
summary: In this post we will refactor the elements to reduce their dependency on the library.
categories: [Programming, Choo]
collection: Choo
header_img: https://c2.staticflickr.com/6/5791/30586665571_65fead6800_h.jpg
header_img_id: 30586665571
background_position: 0px 55%
---

## Identifying dependencies

We can easily identify the dependencies on the framework by looking at the signature for our elements functions.

If we open the `pages/home.js` file we can see that we are passing the complete state to both our elements and the `send` function.

```
  ${addShow(state, send)}
  ${showList(state)}
```

This means that our elements need to understand the structure of the `state` and they are depending on the `send` function as well to raise their events.

We can 'inverse' the dependencies and let our elements to dictate what their need.

## Removing dependencies

Let's start with the `showList` element.

We want to pass to our elements a [parameter object]](http://refactoring.com/catalog/introduceParameterObject.html).

In the last post we didn't write any test for our elements, let's do that now.

```
  "use strict";

  const test = require("tape"),
    showList = require("../../elements/show-list");

  test("#showList", (assert) => {

    const rendered = showList({shows: [
      {
        title: "A show",
        season: 3,
        episode: 2
      }
    ]}).toString();
    assert.notEqual(rendered.indexOf(`<td>A show</td>`), -1, "It should contain the title");
    assert.notEqual(rendered.indexOf(`<td>3</td>`), -1, "It should contain the episode");
    assert.notEqual(rendered.indexOf(`<td>2</td>`), -1, "It should contain the season");
    assert.end();
  });
```

We will replace this code:

```
  function shows (state) {

  ...

    ${state.shows.list.map((s)=> {
      return show(s);
    })}

  ...

```

With this:

```
  function shows (options) {

    ...

      ${options.shows.map((s)=> {
        return show(s);
      })}

    ...

```

And the tests should all pass, what is wrong because we just broke our site.
Go ahead, open it and look at the browser console.

<img border="0" alt="Choo broken" src="/images/posts/choo/choo-broken-app.png">

We will need to add some test for the main view as well.

```
  "use strict";

  const test = require("tape"),
    choo = require('choo'),
    app = choo();

  app.model(require('../../models/show'))
  app.model(require('../../models/shows'))
  app.router((route) => [
    route('/', require('../../pages/home'))
  ]);

  test.only("#homePage", (assert) => {
    const rendered = app.toString("/");
    assert.notEqual(rendered.indexOf(`<main>`), -1, "It should contain the body");
    assert.end();
  });
```

If you look at the setup section you will noticed that this is almost the same as the code we have in the client.js file.

We will add a TODO to our list and refactor this test in our next post.

Now that the app is fixed and we have a test to demostrate that, we can look to change the `addShow` element.

These changes are going to be more interesting.

Once again let's start with the test.

```
  "use strict";

  const test = require("tape"),
    addShow = require("../../elements/add-show");

  test("#addShow", (assert) => {
    const rendered = addShow({
      show: {
        title: '',
        season: 0,
        episode: 0
      },
      addShow: () => {},
      updateShow: () => {}
    }).toString();
    assert.notEqual(rendered.indexOf(`<button type="submit" class="btn btn-primary btn-sm">Add</button>`), -1, "Should contains the button");
    assert.end();
  });
```

And we modify the code to call the new handles `addShow` and `updateShow` when something changes.

In this test we are not testing that the events are called, that's left for an e2e test.

```
  function onInput(prop, options) {
    return (event) => {
      options.updateShow({prop,
        value: event.target.value
      });
      event.preventDefault();
    }
  }

  function onSubmit(options) {
    return (event) => {
      event.preventDefault();
      options.addShow(options.show);
      return false;
    };
  }
```

And we modify the home page as well:

```
  ${addShow({
        show: state.show,
        addShow: (data) => {
          send('shows:add', data);
          send('show:reset');
        },
        updateShow: (data) => {
          send('show:update', data);
        }
      })}
```

## Final thoughts

I don't like how the code in our homepage is looking, I think we can do better and further abstract the knowledge we have for addShow and updateShow in there.

We should also validate that the parameter object have the expected properties or do some defensive programming in there.

I will also like to explore some refactorings to be able to test that the event handlers are called with the expected values.

## Resources

* [Github code for this article](https://github.com/hgarcia/tv-series/releases/tag/v0.2)
* [Choo designing for reusability](https://yoshuawuyts.gitbooks.io/choo/content/guides/designing-for-reusability.html)
