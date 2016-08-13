---
layout: post
title: Taking HyperTerm for a ride.
summary: HyperTerm, the hackable terminal, another tool running on top of electron.
categories: [Programming]
header_img: https://c1.staticflickr.com/9/8690/28644074772_f6c54de59e_h.jpg
header_img_id: 28644074772
background_position: 0px 20%
---

If you are like me you spend a lot of time in the terminal.

As a developer my workflow is centered around running commands on it, launching new processes, interacting with text files, remoting to other machines, etc.

As such, we tend to customize our terminal emulator of choice.

For some time I have been running iTerm2 in my Mac and it serves my well. No complains really.

But I always like to try new tools to see if I can improve my setup.

My main reason to do so is to try to be more productive. A tool that better align with your workflow or help you to achieve things in a faster or easier well help you to do that.

I mostly want tools that are lean, get out of my way, but can be customized or modified if I need to.

## HyperTerm seems to be such a tool

[HyperTerm](https://hyperterm.org/) is a new terminal emulator brought to us by [@rauchg](https://twitter.com/rauchg) and the good people at [zeit](https://zeit.co/).

It's build on top of [electron](), that means is build using just the technologies of the web; html, css and JavaScript.

The great thing about it is that it has an extensibility model, so you or anybody can write extensions (plugins actually) and publish does as npm packages.

At the time of this writting the bulk of the plugins seems to be a number of themes, but there are a few packages that I added to my setup that are very interesting.

So, think about it. As a developer your terminal is probably the application wehre you spend a great amount of time. (Maybe your editor or the browser are the other two that are been used more).

As such a terminal that allows you to not such customize it via profile files but actually customize the whole behaviour of the emulator and add tools, commands or just modify the UI to your heart content should be a very interesting proposition.


## Getting hook on it.

I have to admit that I originally installed HyperTerm when it was announced and for whatever reason I didn't pay much attention to it.

Today, I decided to take another crach at it and after going over it with a bit more patience I started to see the appeal.

So, upon installing the bare HyperTerm out of the box is just like any other Terminal emulator that support tabs.

It will launch your default shell, load your profile and it will look pretty much as the one you are using, but with a different theme.

The first I noticed was that it is fast, you will not notice any delay or drop on performance when comparing with iTerm2 (well I did have some issues a few times but nothing serious, I will expand on it below).

In my case, after launching it, after a few seconds, a notification showed up on my notification center indicating that it was going to update and after a few seconds, a ssecond one telling me how to refresh the Terminal to load the new updates.

This surprised me in a very good way. The update experience was smooth as we should see in more and more applications (but we don't, not yet).

I also saw that all my customizations in my bash profile were working and I was able to work as if nothing have changed.

Good enought to keep testing it for the rest of the day, let's see how this baby does on a real day, doing real work.

But before all that...let's do some changes.


## Installing some plugins

I opened the `~/.hyperterm.js` file with my favorite editor at the moment [Atom](https://atom.io/) and started to do some changes to some of the default options.

__Not sure if you notice but now 2 of my most used tools on a daily basis are running on [Electron](http://electron.atom.io/) and build using the same web technologies I use most of my day__

My first change was to pump up the font size; 12px is a bit too small nowadays.

My second task was to dig on npm and search for HyperTerm. You will be presented with several pages of results containing some of the aforedmentioned plugins.

The first thing I wanted to change was the default tabs, sure enought there are a few plugins to do so. After trying a few I settled for `hyperterm-tabby` to add an bottom-border on the active tab and `hyperterm-tab-numbers` to add the shortcut number on the tab on the right corner of it.

<img border="0" alt="Hyperterm Tabs with the plugins installed" src="/images/posts/hyperterm-tabs.png">

Another thing I didn't care much about for was that it always opens in the home directory, but that was easily fix with the `hyperterm-working-directory` plugin.

While at it, I found the `hyperterm-cwd` plugin that copies another handy setting I had on iTerm2, opening the current directory when launching a new tab.

So now, HyperTerm is almost a match to my iTerm2 setup, we are really in business.

## Some more plugins that are starting to make HyperTerm a winner

I use [BetterSnapTool](https://www.boastr.net/bettersnaptool/) to keep my applications on their place, but latelly I run my editor full size and switch to the console using the Command+TAB combination, while keeping my Terminal in the bottom 3rd of the screen.

This works well unless I decide to open a third application, like my browser, now switching windows can be more than one combination of keys and things start to slow down.

HyperTerm have a very nice plugin `hyperterm-overlay` This is fantastic since now I can bring my terminal window on top of any running application at any time with a single hotkey (I use Command+h).

<img border="0" alt="Hyperterm overlay functionality" src="/images/posts/hyperterm-overlay.gif">


I configured the overlay plugin to open at the bottom of the screen to my desired size and to autohide on blur (I'm still thinking about the autohide).

## Finishing things up.

I added a few more plugins.

`hyperline` adds a nice status bar at the bottom of the editor, the most interesting thing for me is CPU usage, handy when I run long db operations.

<img border="0" alt="Hyperline" src="/images/posts/hyperline.gif">

`hyperlink-iterm` open links from the console using the Command+click as it works in iTerm2

`hyperterm-alternatescroll` this is an interesting one, that will openan scrollable area that is not the main window of the terminal but a window of the command run in the console.

## Missing features, issues.

So far the only thing I miss is some search functionality, specially interesting when looking at logs or output from a long process, yes you can always use grep but I tend to rely on the search include in iTerm2, is very handy.

On the issues side of thing, I only noticed that a few times while running git pull or git pull --rebase the operation took a long time (probably connectivity issues on my end unrelated to HyperTerm) but all the tabs in HyperTerm froze for a bit. This only happened twice during the day, most of the time is very fast and the experience have been really good so far.

The `hyperterm-overlay` plugin is very helpful, I'm still getting used to it but looking forward to commit this new workflow to muscle memory.
