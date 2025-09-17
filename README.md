## The Maze of the Minotaur

A stupid, simple, "lite" Roguelike (Rogue-lite?) game designed for playing in short sessions on your mobile phone.

Explore the maze and face the Minotaur... <em>IF YOU DARE</em>!

### Purpose

This was built as part of a code challenge (_which it won_, much to my surprise!). Unfortunately, I had a hard time finding an app
that I wanted to build, so I didn't even start on it until there was less than a week to go.

The initial code was kind of a hot mess as a result, but I cleaned up most of it and added some tests, so now I feel pretty good about it.

Thanks to everyone who voted for it. It really means alot!

### Technology

Built using [TypeScript](typescriptlang.org/), powered by [Vite](https://vite.dev/) and [Tauri](https://tauri.app/).

### Play It Online

You can find it at https://www.itsericwoodward.com/webtoys/maze/ or https://itsericwoodward.github.io/maze-of-the-minotaur/.

### Get the Android Version

Thanks to [Tauri](https://tauri.app/), there's now a native Android version!

1. Download the [`motm-universal-release.apk`](https://www.itsericwoodward.com/files/motm-universal-release.apk) to your phone.
2. Click on the downloaded file.
3. Run it (if your device allows it).

It's an unsigned app, and I'm just some guy on the internet, so I won't blame you if you don't want to trust it (or me).

I mostly made the Android version because I could, _for free_ (which is more than I can say for making an iOS version).

### Run It Locally

There's a `build.js` script that builds 3 different web versions (one for github.io, one for my own site, and one for the Android app).

1. Check out this repo.
2. `npm ci`
3. `yarn dev` to test it out, or `yarn build` to build the web version(s).
4. `yarn build:android` to make a new Android version.

### Planned Enhancements

-   Add build version to title screen
-   Improve endgame modals
-   Finish adding tests to game, main, and anything else that needs coverage.
-   Add license to the combined JS file
    -   Target compatibility with LibreJS: https://www.gnu.org/software/librejs/free-your-javascript.html
-   Add CSP (maybe via nonce w/ TSC?)
-   remove extraneous fonts
-   ~~Add title screen / modal with start button~~ DONE
-   ~~spruce up landing page (link to repo, site)~~ DONE
-   ~~make into an app~~ DONE

Thanks for stopping by, and please remember to share and enjoy!
