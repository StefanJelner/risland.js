# <img src="assets/risland.png" alt="RIsland logo" width="147" height="90"> RIsland.js

Feel free to pronounce it "Are-Island" or "Reyeland"!

## Table of contents

- [Introduction](#introduction)
- [Pros](#pros)
- [Cons](#cons)
- [Technologies](#technologies)
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [`template` tag](#template-tag)
- [Event delegation](#event-delegation)
- [Event throttling](#event-throttling)
- [State](#state)
- [`setState()`](#setstate)
- [Common state and `setState()` pitfalls](#state-pitfalls)
- [Lifecycles](#lifecycles)
- [Options](#options)
- [Advanced - dangerous - options](#advanced-options)
- [Examples](#examples)
- [Final thoughts](#final-thoughts)

The purpose of RIsland is to fill the gap between cumbersome DOM-manipulation (querying, innerHTML, node-creation, classList) and event-handling in a rather procedural and imperative way, like for example in classical [jQuery](https://github.com/jquery/jquery)-applications or - on the other side - having to use huge libraries - which are great, but too huge and sophisticated for the purpose (in the end 5% of the features are used).

The most simple RIsland scenario is to load the IIFE bundle (&lt;30KB) in a script tag into your page, add a DOM ready event and you can start to code. (It is also possible to use RIsland together with ES6, [Babel](https://github.com/babel/babel) and [TypeScript](https://github.com/microsoft/TypeScript) and then use Bundlers, like [webpack](https://github.com/webpack/webpack).)

RIsland is perfect for writing small widgets or configurators in static pages. You can use it for a product configurator in your shop, for a dynamic form or for small games to keep users entertained. Feel free to check the examples, which try to exhaust the possibilities, showing simple stuff, but also trying to push it to the limits by providing small browser games.

**IMPORTANT!** It is important to understand, that RIsland is no replacement for fully featured libraries, like [Angular](https://github.com/angular/angular), [React](https://github.com/facebook/react) or [Vue](https://github.com/vuejs). Before using this library check whether its features are sufficient for your needs.

## <a name="pros"></a> Pros

- Small in filesize. (&lt;30KB minified IIFE bundle)
- The IIFE bundle can be used out of the box. No building necessary. Put it in a script-tag and start writing code.
- Simple, yet powerful. (See [Examples](#examples))
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
- [throttle-debounce](https://github.com/niksy/throttle-debounce) - throttles method invocations by a given amount of milliseconds
- [raf-throttle](https://github.com/wuct/raf-throttle) - throttles method invocations by request animation frame

Feel free to check the package.json, if you want to take a further look into the used technologies.

## <a name="installation"></a> Installation

After all these warnings, i hope the dear reader of this page is not too scared. It is time to get our hands dirty and dive into the code.

The easiest scenario is to copy the file `dist/risland.iife.min.js` into your static project and add a `script` tag to the `head` or `body` of your HTML:

```HTML
<script src="risland.iife.min.js"></script>
```

If you want to use RIsland in an ES6- or TypeScript-project, then you can install it with the node package manager:

```sh
npm install risland.js --save
```

then import it:

```ts
import RIsland from 'risland.js';
```

## <a name="basic-usage"></a> Basic usage

To work with RIsland, you have to create a new instance of it:

```js
new RIsland(options);
```

Unlike other libraries, RIsland is not meant to be extended from or does not use decorators in ES6 or TypeScript. It works the same way as in plain Vanilla JS. In Typescript the type of the state can be defined and passed to RIsland:

```ts
new RIsland<StateType>(options);
```

A simple example could look like this:

```html
<div id="island"></div>
<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        new RIsland({
            $element: document.getElementById('island'),
            , initialState: { text: 'Hello world!' }
            , template: '<div>{{state.text}}</div>'
        });
    });
</script>
```

Let's add some dynamics:

```html
<div id="island"></div>
<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        new RIsland({
            $element: document.getElementById('island'),
            , delegations: {
                'click': {
                    '.island__checkbox': function(event, _, setState) {
                        setState({ checked: event.target.checked });
                    }
                }
            }
            , initialState: { checked: false }
            , template: '<div class="island">' +
                '<input class="island__checkbox" type="checkbox" />' +
                '{{@if(state.checked)}}is checked{{#else}}is not checked{{/if}}' +
            '</div>'
        });
    });
</script>
```

Just for the sake of completeness, the typescript version would look like this:

```ts
import RIsland from 'risland.js';

document.addEventListener('DOMContentLoaded', () => {
    new RIsland<{ checked: boolean; }>({
        $element: document.getElementById('island'),
        , delegations: {
            'click': {
                '.island__checkbox': (event, _, setState) => {
                    setState({ checked: (event.target as HTMLFormElement).checked });
                }
            }
        }
        , initialState: { checked: false }
        , template: `<div class="island">
            <input class="island__checkbox" type="checkbox" />
            {{@if(state.checked)}}is checked{{#else}}is not checked{{/if}}
        </div>`
    });
});
```

This already looks more like a dynamic application.

There are several things which are quite obvious:

1. To pass the template as a string can be painful. Especially when the template grows. The solution can be template strings (like in the TypeScript example) or even more convenient the HTML `template` tag.
2. Event delegation works in a way, that you have to provide an object with event names. Each event name introduces another inner object which consists of DOM selectors. These DOM selectors mark the potential origin of the event. Each DOM selector then has a callback function which gets invoked in case of an event matching the event name and the selector.

## <a name="template-tag"></a> `template` tag

> The template element is used to declare fragments of HTML that can be cloned and inserted in the document by script.
>
> In a rendering, the template element represents nothing.
>
> -- <cite>[HTML standard - 4.12.3 The template element](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)</cite>

The `template` tag is perfect for placing [squirrelly](https://github.com/squirrellyjs/squirrelly) template code inside. Actually it is meant for things like that. By default it is not represented in any way, so it is neither shown visually nor does it affect the representation of the document in any other way. One nice aspect is, that editors show the code in the `template` tag with HTML syntax highlighting. One drawback is, that it is hard to handle in JavaScript, because it is not easily accessible with `innerHTML` and text content gets HTML encoded (&quot;, &lt;, &gt;, &amp;), which means that some chars in the [squirrelly](https://github.com/squirrellyjs/squirrelly) template code might get HTML encoded. RIsland therefore accepts the `template` tag DOM element and does the extraction and decoding of the code for you. So no worries!

Enough theory, here is an example:

```html
<div id="island"></div>

<template id="squirrelly">
    <div class="island">
        <input class="island__checkbox" type="checkbox" />
        {{@if(state.checked)}}is checked{{#else}}is not checked{{/if}}
    </div>
</template>

<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        new RIsland({
            $element: document.getElementById('island'),
            , delegations: {
                'click': {
                    '.island__checkbox': function(event, _, setState) {
                        setState({ checked: event.target.checked });
                    }
                }
            }
            , initialState: { checked: false }
            , template: document.getElementById('squirrelly')
        });
    });
</script>
```

Even everything is in one code block, the concerns have a much cleaner separation here. Wonderful!

In Typescript it is necessary to declare the type to the template:

```ts
template: document.getElementById('squirrelly') as HTMLTemplateElement
```

Otherwise Typescript cannot determine whether the template is a string or a HTMLTemplateElement.

> **IMPORTANT!** Every template **MUST** be nested in a single tag. If the template starts with several siblings, the template won't work. You should at least use a `div` element as a wrapper. This is due to a limitation in the implementation of RIsland.

## <a name="event-delegation"></a> Event delegation

> Event bubbling is a type of event propagation where the event first triggers on the innermost target element, and then successively triggers on the ancestors (parents) of the target element in the same nesting hierarchy till it reaches the outermost DOM element or document object.
>
> -- <cite>[Wikipedia - Event bubbling](https://en.wikipedia.org/wiki/Event_bubbling)</cite>

In simpler words: If an event happens, all the parent elements get informed about that event. So actually you can also register an event listener on an elements parent and it also gets fired on the parent. There is one final problem: If a parent contains many child elements, how can you distinguish between those elements? The solution is simple: By using the `event.target` and the `closest()`-method, which uses a CSS selector and checks whether the element itself or any parent in the DOM fulfills that CSS selector. All you need to do is to give the elements unique classnames (or use a selector that clearly can distinguish the element from others). This concept is called event delegation.

Event delegation can speed up applications significantly and also can save many `addEventListener()`-calls. Imagine you have a table with thousands of rows. Wouldn't it be much more convenient to check for a `mouseover` and `mouseout` on the `table` element itself - then distinguish the row that caused the event - rather than on each row? And is one event listener handling all by delegation not much faster than thousands of event listeners?

RIsland does not use event delegation to speed things up, that is a nice side effect, but it needs it, so that after every template rerendering and DOM morphing it is unnecessary to remove or add event listeners. The main island element never gets changed. So adding the event listeners to this element and delegating all the events by selectors is a convenient way to add the listeners only once.

> **IMPORTANT!** Some events do not bubble by default. (`abort`, `blur`, `error`, `focus`, `load`, `loadend`, `loadstart`, `pointerenter`, `pointerleave`, `progress`, `scroll`, `unload`) RIsland takes care of this fact and makes those events bubble, because it heavily depends on event delegation. If this is causing trouble, the `nonBubblingEvents`-array in the config can be changed. See [Options](#options) for details.

## <a name="event-throttling"></a> Event throttling

Events, like `resize`, `scroll` or `mousemove` can fire very fast and therefore cause a lot of unnecessary method invocations, because RIsland only renders each animation frame. The solution is to throttle events. This can be done in the `delegations`-object by adding the keyword `throttled` to an event. Additionally the amount of milliseconds can be provided. If no milliseconds are provided, the event gets throttled by request animation frame.

Example:

```html
<div id="island"></div>

<template id="squirrelly">
    <div class="island">
        unthrottled: {{state.unthrottled}}<br />
        raf: {{state.throttledRaf}}<br />
        1 second: {{state.throttled1s}}
    </div>
</template>

<style type="text/css">
    .island {
        border: 1px solid black;
        left: 50%;
        padding: 20px;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>

<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        new RIsland({
            $element: document.getElementById('island')
            , delegations: {
                'mousemove': {
                    '.island': function(_, state, setState) {
                        setState({ unthrottled: state.unthrottled + 1 });
                    }
                }
                , 'mousemove.throttled': {
                    '.island': function(_, state, setState) {
                        setState({ throttledRaf: state.throttledRaf + 1 });
                    }
                }
                , 'mousemove.throttled.1000': {
                    '.island': function(_, state, setState) {
                        setState({ throttled1s: state.throttled1s + 1 });
                    }
                }
            }
            , initialState: {
                throttled1s: 0
                , throttledRaf: 0
                , unthrottled: 0
            }
            , load: function() { console.log('load'); }
            , template: document.getElementById('squirrelly')
            , update: function() { console.log('update'); }
        });
    });
</script>
```

The syntax for the event names is:

```
eventName[.throttled[.ms]]
```

Examples:

```
mousemove
mousemove.throttled
mousemove.throttled.1000
scroll.throttled.250
resize.throttled
focus
```

## <a name="state"></a> State

> In contrast, the by reference strategy receives not a copy, but the implicit reference to an object instead. And this reference is directly mapped (like an alias) to the object from the outside. Any changes to the parameter inside the function — either just the property modifications, or the full rewrite are immediately reflected on the original object.
>
> -- <cite>[ECMA-262-3 in detail. Chapter 8. Evaluation strategy - 4. Call by reference](http://dmitrysoshnikov.com/ecmascript/chapter-8-evaluation-strategy/#call-by-reference)</cite>

In simpler words: arrays and objects are not copied when you assign them to a variable or use them as a function argument, but they are passed by reference.

For a state pattern, this is a very bad situation, because the state - as a total private inner state - of a component is not encapsulated by the component, but changes from the outside on objects or arrays in the state could also change the state in the component and lead to unpredictable side effects.

RIsland takes care of that problem by always creating deep clones of the state. It is not enough to create a shallow clone, because f.ex. in an array of objects, it is not sufficient to only clone the array, because in the cloned array, the objects are still references to the original objects. The only way is to deeply clone **EVERYTHING**. It is clear that this strategy has some performance drawbacks, but on the other hand it leads to a totally encapsulated inner state of the component without any side effects. Most reactive libraries with state management follow this pattern. So even event and lifecycle callbacks get a current snapshot of the state as an argument, it is a clone. The only way to change the state is by using the `setState()` method, which also gets passed as an argument.

> **IMPORTANT** It is important to understand that the states that become passed by argument to the events and lifecycle callbacks are only clones and represent a snapshot at that specific moment in time. That means: it is always best practice to get the freshest and most current state to avoid problems and collisions. Mutating the state directly in any way is useless, because it is only a clone. This is done on purpose and by design, so the only way to change the state is `setState()`. Please read [Common state pitfalls](#state-pitfalls) carefully to save yourself some headaches.

## <a name="setstate"></a> `setState()`

## <a name="state-pitfalls"></a> Common state and `setState()` pitfalls

## <a name="lifecycles"></a> Lifecycles

Every component has different lifecycles.

The following lifecycles are in order of their invocation (`shouldUpdate`, `update` and `render` can run several times during the life of an RIsland instance):

### Constructor

### `load`

### `shouldUpdate`

### `update`

### `render`

### `unload`

## <a name="options"></a> Options

### `$element`

### `delegations`

### `initialState`

### `load`

### `shouldUpdate`

### `template`

### `unload`

### `update`

## <a name="advanced-options"></a> Advanced - dangerous - options

> **IMPORTANT!** the following options should only be used, if you really know what you are doing, because they can change the way, how RIsland works internally and affect the result - in the worst case cause exceptions, errors or unwanted behaviour.

### `deepmerge`

### `morphdom`

### `nonBubblingEvents`

### `squirrelly`

## <a name="examples"></a> Examples

## <a name="final-thoughts"></a> Final thoughts
