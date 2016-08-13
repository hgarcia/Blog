---
layout: post
title: On dependency injection, service locator and module loaders.
summary: A quick note about the differences after hearing this terms confused multiple times in the same week.
categories: [Programming]
header_img: https://c2.staticflickr.com/8/7778/26856515591_7c633aa63a_h.jpg
header_img_id: 26856515591
background_position: 0px 80%
---

In the last week I have hear and read people talking about Dependency Injection when they are usually refering to either Service Locator or Module loaders.

There is a lot of documentation that explains this 3 concepts but I decided to put those here in one place just to make (try) the differences clear.

## Dependency injection

The idea is that an object does not call "new" internally. This means that it's not responsible to instansciate his collaborators.

This will force you to program to an interface or protocol instead to a concrete implementation.

The insentives are many, testability, the ability to develop services (classes) in isolation and promoting composability.

```
  class A {
    constructor(db, logger) {
      this.db = db;
      this.logger = logger;
    }
  }
```

There are a few ways to "inject" dependencies into other objects/modules. You can use constructor injection or method injection.

Sometimes you can use an Inversion of Control Container that will resolve the dependencies during runtime.
Good containers are usually (mostly) invisible to the developer and resolve dependencies based on a registry. They are usually instanciated once in the application entry point and are for the most part transparents.

## Service locator

Service locator is a different way to "resolve" dependencies. Your classes will have a dependency on an instance of the service locator, usually a singleton.

When they need a colaborator they will use the service locator to resolve the dependency or the given type.
The type can be class, interface or protocol. Preferable you should use interfaces or protocol to leverage some of the same advantages as DI, like testabilty and isolation.

```
  class A {
    constructor(locator) {
      this.db = locator.get<IDb>();
      this.logger = locator.get<ILogger>();
    }
  }
```

The main difference is that your dependencies are not explicit and the service locator is omnipresent all over the application.

There are some implementations that are better than others, but I would recomment to try to use DI whenever possible.

## Module loaders

The only reason I'm talking about module loaders here is because I recently hear a person refer to module loaders like a way to do Dependency Injection.

This is not the case, you may be able to use Module loaders to load different modules based on different environments having some of the benefits of DI but the main responsability of module loaders is to load modules into a system.

In the context of JavaScript it can mean to load files from the backend just in time and make those files available, polyfill or provide a given Module system (like ES6 modules or AMD) or a combination of those tasks.

In some cases, the module loader can even use plugins to extend those functionalities to apply just in time transcompilation and load more than just modules but images, audio, etc.

An example of a module loader in JavsScript is [System.js](https://github.com/systemjs/systemjs)
