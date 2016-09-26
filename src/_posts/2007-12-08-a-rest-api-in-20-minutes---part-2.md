---
layout: post
title: A REST API in 20 minutes - Part 2.
summary: In this second part we look at the factory methods to handle the different request and the formatters classes.
categories: [Programming, .Net]
---

In this second part we look at the factory methods to handle the different request and the formatters classes.

### The Factory.

The use of a factory allow us to easily extend this framework with minimun coding.



<script src='http://gist.github.com/561815.js?file=file0.cs'></script>



### Some base classes.

We need to encapsulate some code, so we apply the DRY principle, that code will reside in two base classes.

The first class is used by our formatter classes, they need to format different type of objects so they need to call a class that knows how to process the call for that given object, get the object, modify it according to the parameters and commands and them returned to the formatter class that will format it and do the response.



<script src='http://gist.github.com/561815.js?file=file1.cs'></script>



The second object, is one of our objects handlers, some skeleton code at this moment.
This objects implement IServiceRequestHandler.



<script src='http://gist.github.com/561815.js?file=file2.cs'></script>



### The Formatter class



<script src='http://gist.github.com/561815.js?file=file3.cs'></script>
