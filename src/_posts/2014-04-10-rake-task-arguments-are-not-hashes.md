---
layout: post
title: Rake task arguments are not hashes.
summary: Hope this may save some time to somebody out there.
categories: [Ruby, Programming]
header_img: https://c1.staticflickr.com/9/8208/28851464770_ab4d2036e0_h.jpg
header_img_id: 28851464770
background_position: 0px 30%
---

I was creating a rake task today that take some arguments from the command line and I wanted to use those arguments to create an object.

I needed to merge the given arguments with some generated values inside the task so the code originally looked something like this.

```
    task :create, [:first_name, :last_name, :email] => :environment do |t, args|
        args.merge!({seed: generate_password})
        user = User.create(args)
        p user
    end
```

After running the task the User was created with no information at all!

After verifying that `args` had the proper values I did a quick test and noticed that `merge!` on `args` didn't work, printing `args` it looked like a hash but inspecting the type I noticed that is not a simple hash but a `"Rake::TaskArguments":http://rake.rubyforge.org/classes/Rake/TaskArguments.html` and there is not `merge` method.

I have been using task arguments for some time now but I guess I never had to do this before. I would expect calling merge to raise an exception and not fail silently.

I didn't look into the implementation of the class (the actual code) but in the documentation it looks like `method_missing` will delegate to a protected `look_up` method that will check for the existence of a key in the internal hash, ENV or parent object and silently fail otherwise.

The fix is simple, since `Rake::TaskArguments` has a `to_hash` method.
The revisited code looks like this.

```
    task :create, [:first_name, :last_name, :email] => :environment do |t, args|
        opts = args.to_hash.merge({seed: generate_password})
        user = User.create(opts)
        p user
    end
```

I hope this can save somebody a few minutes of their time.
