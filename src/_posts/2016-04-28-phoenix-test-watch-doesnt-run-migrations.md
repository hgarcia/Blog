---
layout: post
title: Mix test.watch doesn't run migrations.
summary: The mix task test.watch doesn't run the migration as mix test does.
categories: [Programming, Elixir]
---

I added to my Phoenix project the [test.watch]() task for mix since I love to have the test running all the time while developing new features.

It's specially good for me since I'm going down Phoenix seriously now.

I created some migrations with `mix ecto.gen.migrations` and I had the test running on the background.
I run `mix ecto.migrate` and I started to modify the code to reflect the new structure.

The problem was that the tests (and the code) started to complain that the new columns didn't exists.

<img border="0" alt="Missing columns" src="/images/posts/phoenix-missing-columns.png">

<img border="0" alt="Missing columns 2" src="/images/posts/phoenix-missing-columns2.png">

This confused me for a while, looking at the table in postgres revealed that the columns were indeed missing. I was looking (correctly) at the `_test` database.

### Environments

I them look into the `_dev` database and noticed that the new columns where there. That was the moment I realized my mistake.

I completely forgot that the test run in their own environment and that the migrations for your tests are run just when the test start to run. Since running test sets the environment to `test` the migrations modify the `_test` database just in this moment.

When you run the migrations manually, those migrations run for your dev environment (during dev in your localhost) or the environment you set (ex: production) when deploying.

This is the same behaviour as most new frameworks, and popularized by Rails several years ago.

So I stopped `mix test.watch` and re run it after that the table was migrated and I was able to proceed the rest of the fixes and writing the new test while using `mix test.watch`

### Test helpers

The "magic" happens in the test_helpers.exs file inside the test folder.

```
ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Inline.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Inline.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Inline.Repo)
```

So remember, if using `test.watch` restart your test to run any migration.
