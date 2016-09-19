---
layout: post
title: The road to Web UI components.
summary: A personal interpretation of our need for UI components in web development and the story so far.
categories: [Programming, Vue]
header_img: https://c1.staticflickr.com/9/8249/29737968905_88aaecdb37_h.jpg
header_img_id: 29737968905
background_position: 0px 55%
---

## Why UI components?

Creating a component is a good way to separate concerns. When properly done it also helps with testability and improves the design of an application.

We have been struggling with this problem since the early days of the web.

In the last 2 years or so a number of libraries and standards came out that are addressing this problem in a way that seems to be answering all our concerns.

Let's see how we got here.

## UI components early history (controls).

The earlier approaches that I remember was the use of partials in pages.

We called that (server side include)[https://en.wikipedia.org/wiki/Server_Side_Includes]

Of course, they run on the server, generating a complete page on the browser. In those early days and based in the complexity of those applications, this was usually more than enought.

Some of the first approaches to UI controls (in the web) that I remember came up in the early 2000s.

ASP.NET WebForms and they approach to UI components and some offerts on the Java side as well are just some examples.

All these components did the trick one way or another, but they were propietary and dependend on the back-end technology or framework.

They weren't really UI components but server side rendered components with some enhanced UI capabilities.

*That last statement can be challenged with some of the implementations of those early components, but I will stay with it just for the sake of this post.*

Regardless of your thoughts on those attemps, it was quite obvious that there was something missing on web development.

Things started to change when applications started to made heavy use of Ajax.

We realized that we didn't need to refresh the browser for every single interaction.

Different parts of the UI could change to reflect the application state at any given time.

A series of UI libraries (YUI, jQuery.UI, Mootols, and many others) started to pop up during that time.

These libraries were focused on the __control__ paradign. We had buttons, calendars, grids, drag and drop, tabs, accordions and a series of controls that we were able to use to build our UIs.

## UI components are more than controls.

Controls were a good start. There are still today lots and lots of applications build on top of these libraries and these concepts.

But we needed more.

We needed to be able to "compose" UI from discrete components that are "usually" a group of controls that act together on some data (or) have some small interaction with the user.

These components should encapsulate the layout (html), behaviour (javascript) and in some cases the appearance (css).

*I will touch on css encapsulation later on, let's focus on the first two properties of components for now.*

We started to see some libraries that focused in this paradigm offering templating and data bindings.

One of the very early players was Knockout.js(http://knockoutjs.com/). It was at the time extremelly popular with the .NET community and later on it expanded it's horizon.

*knockout.js is still going strong, already in version 3.4.0*

The reason for Knockout to be popular in the .NET community is the way it thought about components.

It brought the MVVM pattern into web development and MVVM was a _known_ pattern for .net developers, first introduced to the framework by XAML applications.

Today, lot's of libraries implement the same pattern or a slight variation of it.


## The raise of the Single Page Application frameworks

We were all trying to imitate the smooth experiences of Google Mail and Google Maps.

Developers started to complain that building these large applications with JS was not possible.

JS was unsuited for the task.

We needed _frameworks_ to guide our hand and help us to bring some order in the chaos.

And so, the likes of Backbone, Angular, Ember and Durandal among others came to play.

They all propose a variation of the MVC model (MVVM or MV* as we tend to call it today).

They cover multiple areas of the application. Most of them impose some form of code organization.

They also have a way (and sometimes more than one) to organiza and create UI components. (With multiple forms of data bindings, one-way, two-ways, one-time, etc)

On top of all that, they suggest different mechanism to stablish inter component communication and some form of routing for the application.

## Were we there yet?

No, we weren't.

These frameworks work particularly well to build exactly what they are intended for; Single page applications.

This means, more times than not, if you already have something out there and want to introduce some of the benefits of these frameworks, you need to do a rewrite.

We wanted to bring order to our UI.

We wanted to provide a better user experience and build discrete components that could be easily integrated into full applications.

But you don't always want or need a full fledge SPA.

## Components

The W3C started to talk about a (series of proposals)[https://en.wikipedia.org/wiki/Web_Components] that could finally bring the notion of components as a standard.

Among this standards we have the idea of Shadow DOM and scoped CSS. These are important since as we mentioned above, components sometimes need some form of styling that should not interfere with other elements of the page.

We started to see a new tendency on smaller libraries that can be plugged together to build applications. I see this as a normal evolution, branches going of other branches.

We had an explosion on binding libraries, templates, routers and even state management.

## React.js

I think that React deserves it's own section in this saga.

It's not because is the bext (or the worst). It's because suddenly, we have a very popular library, that (again and again) claimed to be just that. A UI library to build self contained components.

Besides the early controversies with JSX, React[https://facebook.github.io/react/] took the word by storm.

React wasn't even the first to the party, Google's (Polymer)[https://www.polymer-project.org/] was earlier and the proposed path was to embrace standards via (polyfills)[http://webcomponents.org/] to build Web Components that should be future proof.

After React.js a series of other libraries came up, to name a few, we have Riot.js, Vue.js, Mithril, Cycle.js and many more.

## Organizing large application with Componets (take 2)

React and the other Component libraries are building their own ecosystems, proposed architectures and best practices to build large applications.

We are even seeing the use of the original SPA frameworks like Angular with some of this components libraries (like React).

But the beauty of all this is, that you don't have to.
You can leverage single file vue.js components inside a legacy application. Start encapsulating those areas of the app that make more sense, test around those and reuse.

## Web Components libraries.

These new libraries are trying to solve the original problems and they are focused on providing the component experience that we have been craving for years now.

We are in the very early days.

I hope to see a greater emphasys on these libraries around testability of discrete components. In some cases is non existent or the proposed paths and tools are less than appealing.

In the meantime, support for the set of Web Components related standard is coming to some browsers but there is stil lot's of uncertainty on what and how the final implementations are going to look.

We still don't know if all of the proposed apis are going to be implemented.

If you want to go this path, you need to relay on some of the webcomponents polyfill and you mileage will vary regarding browser support and performance.


## Personal choice.

I so far found myself liking Vue.js[https://vuejs.org/] the most. It seems to solve all the problems mentioned before.

It's fairly easy to test. It's easy to use components in isolation in a legacy web page or scale up to a full fledge SAP if you need so.

It has good Browser support and is fast.

The killer feature for me is (single file components)[https://vuejs.org/guide/application.html#Single-File-Components].

In a future article I will share some of my experiences working with Vue.js during the last few months.
