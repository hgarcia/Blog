---
layout: post
title: Phoenix models automatically adding tracking fields.
summary: Ecto (or Phoenix) automatically add created and update field to your models.
header_img: https://c1.staticflickr.com/9/8843/28644048342_8a1083d05d_h.jpg
header_img_id: 28644048342
categories: [Programming, Elixir]
background_position: 0px 20%
---

I started building a new API for a side project of mine.
I created my first resource using the `mix phoenix.gen.json` task.
I started to play around with it directly on Postman just to make sure I have everything setup properly and when I looked at the console I got a nice surprise.

<img border="0" alt="Phoenix console post details" src="/images/posts/phoenix-console-post.png">

Notice that is creating both a `inserted_at` and `updated_at` fields into the db.
Those fields are not exposed in the model since I didn't declare them when running my generator, but they are already there ready for me to consume.

Very nice!
