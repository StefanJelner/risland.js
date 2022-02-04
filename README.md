# <img src="assets/risland.png" alt="RIsland logo" width="147" height="90"> RIsland.js

Feel free to pronounce it "Are-Island" or "Reyeland"!

## Table of contents

- [Introduction](#introduction)
- [Pros](#pros)
- [Cons](#cons)
- [Technologies](#technologies)
- [Installation](#installation)

## <a name="introduction"></a> Introduction

The purpose of RIsland is to fill the gap between cumbersome DOM-manipulation (querying, innerHTML, node-creation, classList) and event-handling in a rather procedural and imperative way, like for example in classical [jQuery](https://github.com/jquery/jquery)-applications or - on the other side - having to use huge libraries - which are great, but too huge and sophisticated for the purpose (in the end 5% of the features are used).

The most simple RIsland scenario is to load the IIFE bundle (&lt;30KB) in a script tag into your page, add a DOM ready event and you can start to code. (It is also possible to use RIsland together with ES6, [Babel](https://github.com/babel/babel) and [TypeScript](https://github.com/microsoft/TypeScript) and then use Bundlers, like [webpack](https://github.com/webpack/webpack).)

RIsland is perfect for writing small widgets or configurators in static pages. You can use it for a product configurator in your shop, or for a more sophisticated form with lots of dynamics or for small games to keep users entertained. Feel free to check the examples, which try to exhaust the possibilities, showing simple stuff, but also trying to push it to the limits by providing small browser games.

**IMPORTANT!** It is important to understand, that RIsland is no replacement for fully featured libraries, like [Angular](https://github.com/angular/angular), [React](https://github.com/facebook/react) or [Vue](https://github.com/vuejs). Before using this library check whether its features are sufficient for your needs.

## <a name="pros"></a> Pros

- Small in filesize. (&lt;30KB minified IIFE bundle)
- The IIFE bundle can be used out of the box. No building necessary. Put it in a script-tag and start writing code.
- Simple, yet powerful. (See examples)
- Easy to learn. RIsland is no rocket science!
- No featuritis! It does, what it does! (templating, event handling, state management, rendering and throttling)
- Reactive pattern (with a safely encapsulated, immutable state pattern well known from other libraries).
- Uses event delegation for making event handling much simpler and faster. (It is not necessary to add event listeners again and again.)
- [squirrelly](https://github.com/squirrellyjs/squirrelly) templates can be placed in modern template tags. (Unlike in template strings, HTML syntax highlighting still works in editors.)
- Gives the option to use event throttling (milliseconds or request animation frame) to optimize the application.
- Every aspect is configurable (even the underlying libraries, like [deepmerge](https://github.com/TehShrike/deepmerge), [squirrelly](https://github.com/squirrellyjs/squirrelly) and [morphdom](https://github.com/patrick-steele-idem/morphdom)).
- Can be used in more sophisticated stacks (ES6 or [TypeScript](https://github.com/microsoft/TypeScript)) together with bundlers and the [squirrelly](https://github.com/squirrellyjs/squirrelly) templates can be included with f.ex. webpacks [raw-loader](https://github.com/webpack-contrib/raw-loader).
- Can be combined with other frameworks, like [RxJS](https://github.com/ReactiveX/rxjs) or [Redux](https://github.com/reduxjs/redux) stores, to make more sophisticated scenarios possible. This way several instances of RIsland can also intercommunicate and exchange states.

## <a name="cons"></a> Cons

- It is not a fully featured component library. This means sub components or nested islands are not possible. (Technically speaking it might be possible in some way, but the library is not intended to be used that way.) If you need features like this, you might want to use other libraries, like f.ex. [React](https://github.com/facebook/react).
- Usually everything is written in one [squirrelly](https://github.com/squirrellyjs/squirrelly) template. If you find yourself writing thousands of lines of template code, you might want to use other libraries, like f.ex. [React](https://github.com/facebook/react).
- If you want to do complex and sophisticated stuff and you find yourself writing thousands of lines of code, you might want to use other libraries, like f.ex. [React](https://github.com/facebook/react).
- If you find yourself using several instances of RIsland on one page, which intercommunicate with [RxJS](https://github.com/ReactiveX/rxjs) or [Redux](https://github.com/reduxjs/redux) stores, you might want to use other libraries, like f.ex. [React](https://github.com/facebook/react).
- This library only takes care of templating, event handling, state management, rendering and throttling. If you need something like routing, error and HTTP interceptors, dependency injection, - or to summarize: a fully featured SPA (single page appliaction) - you might want to use other libraries, like f.ex. [Angular](https://github.com/angular/angular), [Vue](https://github.com/vuejs), [React](https://github.com/facebook/react) (with [Inversify](https://github.com/inversify/InversifyJS)).

## <a name="technologies"></a> Technologies

- [morphdom](https://github.com/patrick-steele-idem/morphdom) - is a very nice library which can morph one DOM state into the other.
- [squirrelly](https://github.com/squirrellyjs/squirrelly) - is a tiny and fast templating engine.
- [deepmerge](https://github.com/TehShrike/deepmerge) - a library which can merge two or more objects deeply.
- [clone-deep](https://github.com/jonschlinkert/clone-deep) - a library which clones data (because in JavaScript arrays and objects are passed by reference, which can lead to unpredictable und ugly side effects, especially when a safely encapsulated state management should be provided.)
- [fast-deep-equal](https://github.com/epoberezkin/fast-deep-equal) - claims to be the fastest library for comparing two given sets of data
- [throttle-debounce](https://github.com/niksy/throttle-debounce) - throttles method invocations by a given amount fo milliseconds
- [raf-throttle](https://github.com/wuct/raf-throttle) - throttles method invocations by request animation frame

Feel free to check the package.json, if you want to dive deeper into the used technologies.

## <a name="installation"></a> Installation

After all these warnings, i hope the dear reader of this page is not too scared, it is time to get our hands dirty and dive into the code.
