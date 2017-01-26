---
layout: post
title: Choo form validation.
summary: We will be adding validation to our form and displaying errors to the user.
categories: [Programming, Choo]
collection: Choo
header_img: https://c2.staticflickr.com/6/5791/30586665571_65fead6800_h.jpg
header_img_id: 30586665571
background_position: 0px 55%
---

We have been working in our incredible useful Tv series tracker that will help us in our mission of watch as much tv as we want for a few days now. (Yes, that was ironic).

If you have been following you may have noticed that is very easy to add an empty Show in the list.

We will add a "very" basic validation rule to the "title" field.

We can use html5 validation, just add the "required" attribute and we are pretty much done, but what's the fun on that.

As a side note I usually do prefer to use html5 validation attributes as much as I can but I have found very inconsistent support in some browsers, especially when we need to provide custom error messages and error displays.

We will look at how to integrate [validate.js](https://validatejs.org/) into our application. We can install it using npm.

```
  npm install --save validate.js
```

We will add the validation into the `show` and `shows` model. We need to validate when the Add button is click and we need to make sure to clear up any error message if the field changes and the value entered is valid.

Since we need to use the validation in 2 different places we will create a module.

```
  "use strict";
  const validate = require("validate.js");

  module.exports = {
    show: (data) => {
      const constraints = {
        title: {
          presence: true
        }
      };
      return validate(data, constraints);
    }
  };
```

In the show model we will validate when the model changes, but only for the property we need to validate.

```
  errors: (data) => {
    return {errors: data}
  },
  update: (payload) => {
    const obj = {};
    obj[payload.prop] = getValue(payload);
    if (payload.prop === "title") {
      obj.errors = validations.show(obj);
    }
    return obj;
  },
```

The shows model will check before adding a show into the list.

```
  add: (data, state, send, done) => {
    const errors = validations.show(data);
    data.id = uuid.v4();
    if (!errors) {
      storage.save(data);
      send("shows:refresh", storage.get(), done);
    } else {
      send("show:errors", errors, done);
    }
  },
```

We will add a span to display the error.

```
  <input type="text" oninput=${onInput("title", options)} class="form-control form-control-sm" name="title" id="title" value="${options.show.title}">
  <span class="error ${options.show.errors && options.show.errors.title ? '' : 'hidden'}">${options.show.errors && options.show.errors.title ? options.show.errors.title : ""}</span>
```

This solution is less than elegant.
I will certainly revisit this and I will like to move all the validations into the `show` model or into the Add-show form in a future refactoring.

## Resources

* [Github code for this article](https://github.com/hgarcia/tv-series/tree/v0.7)
* [validate.js](https://validatejs.org/)
* [HTML5 Form Validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Data_form_validation)
* [HTML5 Validation on Mobile browsers](http://www.telerik.com/blogs/four-options-for-mobile-form-validation#html5)
