---
layout: post
title: Choo editing and deleting records.
summary: We are able to add and list records, not we need to be able to edit and delete those records.
categories: [Programming, Choo]
collection: Choo
header_img: https://c2.staticflickr.com/6/5791/30586665571_65fead6800_h.jpg
header_img_id: 30586665571
background_position: 0px 55%
---

## Removing records

We will start with adding an effect in the shows model to remove a given record from the list.
We will remove it from the localStorage first and we will use the "refresh" action to reload the records.

```
  remove: (data, state, send, done) => {
    storage.removeById(data.id);
    send("shows:refresh", storage.get(), done);
  },
```

You may have noticed that we are calling `storage.removeById`, that method doesn't exists yet, so let's create it.

```
  removeById(id) {
    store.remove(id);
  }
```

The last bit is to add an UI element that will fire up the effect and give it a handler.
We add a `[delete]` link in the list.

```
  function onDelete(options) {
    return (e) => {
      e.preventDefault();
      options.removeShow(options.show);
      return false;
    }
  }

  ...

  <td class="narrow"><a href="#" onclick=${onDelete(options)}>[delete]</a>
```

We modify the show-list as well, to pass the handler to it's childs.

```
  ${options.shows.map((s)=> {
    return show({
      show: s,
      removeShow: options.removeShow
    });
  })}
```

And the home page.

```
  function _getShowListParams(state, send) {
    return {
      shows: state.shows.list,
      loadShows: () => {
        send("shows:load");
      },
      removeShow: (show) => {
        send("shows:remove", show);
      }
    };
  }
```

## Modifying season and episodes.

We will create one effect in the shows model that will receive some data, the property and a value to add to that property.

```
  modify: (data, state, send, done) => {
    data.show[data.prop] += data.value;
    storage.save(data.show);
    send("shows:refresh", storage.get(), done);
  },
```

We will add two icons besides the episode and the season values, a minus to the left and a plus sign to the right.
Those icons will raise events when clicked that will call a handler with the values required to call the effect that we just created.

```
  function onDecrement(options, prop) {
    return (e) => {
      e.preventDefault();
      options.change({show: options.show, prop: prop, value: -1});
      return false;
    }
  }

  function onIncrement(options, prop) {
    return (e) => {
      e.preventDefault();
      options.changeShow({show: options.show, prop: prop, value: 1});
      return false;
    }
  }

  ...

  <td class="narrow"><a href="#" class="btn btn-sm" onclick=${onDecrement(options, 'season')}>-</a>${options.show.season}<a href="#" class="btn btn-sm" onclick=${onIncrement(options, 'season')}>+</a></td>
    <td class="narrow"><a href="#" class="btn btn-sm" onclick=${onDecrement(options, 'episode')}>-</a>${options.show.episode}<a href="#" class="btn btn-sm" onclick=${onIncrement(options, 'episode')}>+</a></td>
```

We need to also pass the `change` handler to the show-list via home.

```
  ${options.shows.map((s)=> {
    return show({
      show: s,
      removeShow: options.removeShow,
      changeShow: options.changeShow
    });
  })}
```

And the changes in home
```
  changeShow: (data) => {
    send("shows:modify", data);
  },
```

## Resources

* [Github code for this article](https://github.com/hgarcia/tv-series/tree/v0.6)
