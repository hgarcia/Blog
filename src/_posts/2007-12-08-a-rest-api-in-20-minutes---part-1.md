---
layout: post
title: A REST API in 20 minutes - Part 1.
summary: If you haven't look at it, take a look at the Subsonic project, is really cool and can generate a ORM infrastructure faster than any other framework I tried out there. It also provides a cool HTTPHandler to expose those objects.
categories: [Programming, .Net]
---

If you haven't look at it, take a look at the <a href="http://subsonicproject.com/" target="_blank">Subsonic</a> project, is really cool and can generate a ORM infrastructure faster than any other framework I tried out there.
It also provides a cool HTTPHandler to expose those objects.

The only problem is that your database have to follow some minor conventions and sometimes you need to work with legacy databases where those conventions where not follow.

A solution is to use the <a href="http://www.mygenerationsoftware.com/portal/dOOdads/dOOdadsOverview/tabid/63/Default.aspx" target="_blank">DooDads </a>architecture and <a href="http://www.mygenerationsoftware.com/portal/Home/tabid/36/Default.aspx" target="_blank">My Generation</a> as the code generating tool. Doodads was always open source and now My Generation is open source as well. I even modify the BussinessEntity class on the architecture to fit my needs in some projects and work around some unorthodox database architectural decisions I found.

Once you have your doodads objects for all the tables and views that you want to expose you need to create the HttpHandlers to expose those objects.

This are some of the things I needed:

* Pure REST
* Not so pure REST
* Multiple response formats (ex: Json, Xml, Csv)
* Being able to expose new databases object in the future without coding, just generate
the object and a change in the url should make the object available.
* The API should document itself (ex: the end user should be able to ask for available
properties (columns) on a object)
* Being able to expose not just databases objects but other type of objects in the future.

### URL Format and how to read them.

I wanted very easy to read urls, so I came with this scheme.

http://domain/Web/ObjectType/ObjectName/command.format?params

Where:
* domain: Do I need to explain this? (ex: blog.latrompa.com)
* web: The subfolder where your api will reside (ex: services)
* ObjectType: The type of object to expose (ex: data)
* ObjectName: The name of the object (ex: Article)
* command: The command to execute on the object (this is only for non true REST, true
REST use the HTTP VERB) (ex: list)
* format: The extention inidicates the format of the response (ex: json)
* params: The querystring with parameters to modify the response.

A url to request the Data for all Articles Created after October first 2007 will look
like this.

http://blog.latrompa.com/Services/Data/Article/list.json?created_more=10/01/2007

Notice the parameter created is the name of a field in the Article table and the
_more indicates what operand to use in the where clause.

It took this idea from the HttpHandler implementation on Subsonic.

### Architecture:

### Interfaces.



<script src='http://gist.github.com/561814.js?file=file0.cs'></script>





<script src='http://gist.github.com/561814.js?file=file1.cs'></script>



### Utilities.

I create this class to map a uri into an object for easy manipulation, the uri is
what will tell us wich object to load and how to process it.



<script src='http://gist.github.com/561814.js?file=file2.cs'></script>



### Custom Exceptions

We want to throw custom exceptions, don't we?
This is just in the works, only one class for now.



<script src='http://gist.github.com/561814.js?file=file3.cs'></script>



### The HTTP Handler

We will map the extentions that we won't to handle via the API to this Http Handler.



<script src='http://gist.github.com/561814.js?file=file4.cs'></script>



You may notice that the HttpHandler doesn't handler the call but it use a Factory
to create an object that implements IServiceable that will understand how to handle
the call.
