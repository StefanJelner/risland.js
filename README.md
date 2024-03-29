# ![RIsland logo](assets/risland.png) RIsland.js

Reactive JavaScript for everyone!

Feel free to pronounce it "Are-Island" or "Reyeland"!

[![RIsland.js on npmjs.com](https://img.shields.io/npm/v/risland.js?logo=npm&logoColor=white)](https://www.npmjs.com/package/risland.js)
[![RIsland.js on GitHub](https://img.shields.io/github/package-json/v/StefanJelner/risland.js?logo=github&logoColor=white)](https://github.com/StefanJelner/risland.js)
[![RIsland.js on jsDelivr](https://data.jsdelivr.com/v1/package/npm/risland.js/badge?style=rounded)](https://www.jsdelivr.com/package/npm/risland.js)
[![RIsland.js on Facebook](https://img.shields.io/badge/facebook-RIsland.js-blue?logo=facebook&logoColor=white)](https://www.facebook.com/RIslandjs-101398299167542/)

---

## Table of contents

- [Introduction](#introduction)
- [Pros](#pros)
- [Cons](#cons)
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [`script` tag `type="text/html"`](#script-tag)
- [Bundlers and template files](#bundlers-template)
- [Event delegation](#event-delegation)
- [Event throttling/debouncing](#event-throttling-debouncing)
- [Complex Event Delegation](#complex-event-delegation)
- [State](#state)
- [Why cloning?](#why-cloning)
- [`setState()`](#setstate)
- [Common state and `setState()` pitfalls](#state-pitfalls)
- [Usage as a Web Component](#web-component)
- [Lifecycles](#lifecycles)
- [Options](#options)
- [Advanced - dangerous - options](#advanced-options)
- [Properties](#properties)
- [Methods](#methods)
- [Examples](#examples)
- [Hints](#hints)
- [Technologies](#technologies)
- [Alternatives](#alternatives)
- [Final thoughts](#final-thoughts)
- [License](#license)

---

## <a name="introduction"></a> Introduction

The purpose of RIsland is to fill the gap between cumbersome DOM-manipulation (querying, innerHTML, node-creation, classList) and event-handling in a rather procedural and imperative way, like for example in classical [jQuery](https://github.com/jquery/jquery)-applications or - on the other side - having to use huge libraries - which are great, but too huge and sophisticated for the purpose (in the end 5% of the features are used).

The most simple RIsland scenario is to load the minified IIFE bundle (&lt;30KB) in a script tag into your page, add a DOM ready event and you can start to code. (It is also possible to use RIsland as a [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) and together with ES6, [Babel](https://github.com/babel/babel) and [TypeScript](https://github.com/microsoft/TypeScript) and then use Bundlers, like [webpack](https://github.com/webpack/webpack).)

RIsland is perfect for writing small widgets or configurators in static pages, like shops (f.ex. [Shopify](https://www.shopify.com/)), [Wordpress](https://wordpress.com) sites, blogs and many more. You can use it for a product configurator, a complex form, dynamic tables or small games to keep users entertained. Feel free to check the examples, which try to exhaust the possibilities, showing simple stuff, but also trying to push it to the limits by providing small browser games.

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** It is important to understand, that RIsland is no replacement for fully featured libraries, like [Angular](https://github.com/angular/angular), [React](https://github.com/facebook/react) or [Vue](https://github.com/vuejs). Before using this library check whether its features are sufficient for your needs.

---

## <a name="pros"></a> Pros

- Small in filesize. (&lt;30KB minified IIFE bundle)
- The IIFE bundle can be used out of the box. No building necessary. Put it in a script-tag and start writing code.
- Simple, yet powerful. (See [Examples](#examples))
- Easy to learn. RIsland is no rocket science!
- No featuritis! It does, what it does! (templating, event handling, state management, rendering and throttling/debouncing)
- Reactive pattern (with a safely encapsulated, immutable state pattern well known from other libraries).
- Clearer separation of concerns (logic, data, representation, events, HTML, CSS, JS)
- Uses event delegation for making event handling much simpler and faster. (It is not necessary to add event listeners again and again.)
- [squirrelly](https://github.com/squirrellyjs/squirrelly) templates can be placed in `script` tags with `type="text/html"`. (Unlike in template strings, HTML syntax highlighting still works in editors.) Besides [squirrelly](https://github.com/squirrellyjs/squirrelly) partials can be provided for modularization and reusability.
- Gives the option to use event throttling/debouncing (milliseconds or request animation frame) to optimize the application.
- Every aspect is configurable (even the underlying libraries, like [deepmerge](https://github.com/TehShrike/deepmerge), [squirrelly](https://github.com/squirrellyjs/squirrelly) and [morphdom](https://github.com/patrick-steele-idem/morphdom)).
- Can be used as a [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components).
- Can be used in more sophisticated stacks (ES6 or [TypeScript](https://github.com/microsoft/TypeScript)) together with bundlers and the [squirrelly](https://github.com/squirrellyjs/squirrelly) templates can be included with f.ex. webpacks [raw-loader](https://github.com/webpack-contrib/raw-loader) or - since Webpack 5 - the [Asset Modules](https://webpack.js.org/guides/asset-modules/).
- Can be combined with other frameworks, like [RxJS](https://github.com/ReactiveX/rxjs) or [Redux](https://github.com/reduxjs/redux) stores, to make more sophisticated scenarios possible. This way several instances of RIsland can also intercommunicate and exchange states.
- Completely unit tested with Jest to provide reliable code and future changes without unwanted side effects.
- XSS attacks are prevented by [squirrelly](https://github.com/squirrellyjs/squirrelly). See [The safe flag](https://squirrelly.js.org/docs/syntax/filters/#the-safe-flag).

---

## <a name="cons"></a> Cons

- It is not a fully featured component library. This means sub components or nested islands are not possible. (Technically speaking it might be possible in some way, but the library is not intended to be used that way.) If you need features like this, you might want to use other libraries, like f.ex. [React](https://github.com/facebook/react).
- Usually everything is written in one [squirrelly](https://github.com/squirrellyjs/squirrelly) template (although partials are possible, but excessive use is not recommended). If you find yourself writing thousands of lines of template code, you might want to use other libraries, like f.ex. [React](https://github.com/facebook/react).

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** In case an update should be done, RIsland always renders the complete [squirrelly](https://github.com/squirrellyjs/squirrelly) template and then does the DOM morphing. If you have a big template and need to do something fast, like f.ex. a scroll spy (`scroll`) or dragging (`mousemove`), then RIsland might not be fast enough, but you need a library with sub-components in which you can put parts of the code which need to be fast. Consider using a fully featured component library, like f.ex. [React](https://github.com/facebook/react).
- If you want to do complex and sophisticated stuff and you find yourself writing thousands of lines of code, you might want to use other libraries, like f.ex. [React](https://github.com/facebook/react).
- If you find yourself using several instances of RIsland on one page, which intercommunicate with [RxJS](https://github.com/ReactiveX/rxjs) or [Redux](https://github.com/reduxjs/redux) stores, you might want to use other libraries, like f.ex. [React](https://github.com/facebook/react).
- This library only takes care of templating, event handling, state management, rendering and throttling/debouncing. If you need something like routing, error and HTTP interceptors, dependency injection, - or to summarize: a fully featured SPA (single page appliaction) - you might want to use other libraries, like f.ex. [Angular](https://github.com/angular/angular), [Vue](https://github.com/vuejs), [React](https://github.com/facebook/react) (with [Inversify](https://github.com/inversify/InversifyJS)).
- If you want to do more sophisticated things with the [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components), like f.ex. using the attribute-feature more extensively, you might want to use other libraries, like f.ex. [Lit](https://lit.dev/) or [Stencil](https://stenciljs.com/).

---

## <a name="installation"></a> Installation

It is time to get our hands dirty and dive into the code.

The easiest scenario is to copy the file `dist/risland.iife.min.js` into your static project and add a `script` tag to the `head` or `body` of your HTML:

```html
<script src="risland.iife.min.js"></script>
```

Alternatively you can use a CDN like [UNPKG](https://unpkg.com) or [jsDelivr](https://www.jsdelivr.com/):

```html
<script src="https://unpkg.com/risland.js/dist/risland.iife.min.js"></script>
```

or

```html
<script src="https://cdn.jsdelivr.net/npm/risland.js/dist/risland.iife.min.js"></script>
```

If you want to use RIsland in an ES6- or TypeScript-project, then you can install it with the node package manager:

```sh
npm install risland.js --save
```

then import it:

```ts
import RIsland from 'risland.js';
```

---

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
            initialState: { text: 'Hello world!' },
            template: '<div>{{state.text}}</div>'
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
            delegations: {
                'click': {
                    '.island__checkbox': function(event, $closest, state, setState) {
                        setState({ checked: $closest.checked });
                    }
                }
            },
            initialState: { checked: false },
            template: '<div class="island">' +
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
        delegations: {
            'click': {
                '.island__checkbox': (_, $closest, __, setState) => {
                    setState({ checked: ($closest as HTMLFormElement).checked });
                }
            }
        },
        initialState: { checked: false },
        template: `<div class="island">
            <input class="island__checkbox" type="checkbox" />
            {{@if(state.checked)}}is checked{{#else}}is not checked{{/if}}
        </div>`
    });
});
```

Or as a web component (See [Usage as a Web Component](#web-component) for detailed explanations):

```html
<my-app counter="100"></my-app>
<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        RIsland.createWebComponent('my-app', ['counter'], {
            delegations: {
                'click': {
                    '.island__checkbox': function(event, $closest, state, setState) {
                        setState(function(state2) { return {
                            checked: $closest.checked,
                            counter: state2.counter + 1
                        }; });
                    }
                }
            },
            initialState: {
                checked: false,
                counter: null
            },
            template: '<div class="island">' +
                '<input class="island__checkbox" type="checkbox" />' +
                '{{@if(state.checked)}}is checked{{#else}}is not checked{{/if}}<br />' +
                'counter: {{state.counter}}' +
            '</div>'
        });
    });
</script>
```

These already look more like dynamic applications.

There are several things which are quite obvious:

1. To pass the template as a string can be painful. Especially when the template grows. The solution can be template strings (like in the TypeScript example) or even more convenient a `script` tag with `type="text/html"`.
2. Event delegation works in a way, that you have to provide an object with event names. Each event name introduces another inner object which consists of DOM selectors. These DOM selectors mark the potential origin of the event. Each DOM selector then has a callback function which gets invoked in case of an event matching the event name and the selector.

---

## <a name="script-tag"></a> `script` tag `type="text/html"`

[squirrelly](https://github.com/squirrellyjs/squirrelly) code can be placed in `script` tags with `type="text/html"` to activate syntax highlighting in most modern editors. (Unfortunately the modern `template` tag does not work, because browsers parse it as HTML leading to broken code, because [squirrelly](https://github.com/squirrellyjs/squirrelly) code gets skrewed up, when used to generate attributes or parsed as a text node, which causes trouble with `table` tags and their children.)

```html
<div id="island"></div>

<script type="text/html" id="squirrelly">
    <div class="island">
        <input class="island__checkbox" type="checkbox" />
        {{@if(state.checked)}}is checked{{#else}}is not checked{{/if}}
    </div>
</script>

<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        new RIsland({
            $element: document.getElementById('island'),
            delegations: {
                'click': {
                    '.island__checkbox': function(event, $closest, state, setState) {
                        setState({ checked: $closest.checked });
                    }
                }
            },
            initialState: { checked: false },
            template: document.getElementById('squirrelly')
        });
    });
</script>
```

In Typescript it is necessary to declare the type of the template:

```ts
template: document.getElementById('squirrelly') as HTMLScriptElement
```

Otherwise Typescript cannot determine whether the template is a `string` or a `HTMLScriptElement`.

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** The template **MUST** be nested in a single tag. If the template starts with several siblings, the template won't work. You should at least use a `div` element as a wrapper. This is due to a limitation in the implementation of RIsland. This rule does not apply to partials.

Partials work the same way, the only difference is, that the namespace inside of partials is not `state`, but `partialState`.

---

## <a name="bundlers-template"></a> Bundlers and template files

Some bundlers are capable of injecting required files as strings during the process of bundling. A very well know example is the usage of [webpack](https://github.com/webpack/webpack) with [raw-loader](https://github.com/webpack-contrib/raw-loader) or - since Webpack 5 - the [Asset Modules](https://webpack.js.org/guides/asset-modules/).

`webpack.config.js`:
```js
module.exports = {
    module: {
        rules: [{
            test: /\.squirrelly\.html$/
            , loader: 'raw-loader'
            , exclude: /node_modules/
        }]
    }
};
```

or since Webpack 5

`webpack.config.js`:
```js
module.exports = {
    module: {
        rules: [{
            test: /\.squirrelly\.html$/
            , type: 'asset/source'
            , exclude: /node_modules/
        }]
    }
};
```

Your Typescript file:

```ts
const template: string = require('./template.squirrelly.html').default;
```

or

```ts
import template from './template.squirrelly.html';
```


---

## <a name="event-delegation"></a> Event delegation

> Event bubbling is a type of event propagation where the event first triggers on the innermost target element, and then successively triggers on the ancestors (parents) of the target element in the same nesting hierarchy till it reaches the outermost DOM element or document object.
>
> -- <cite>[Wikipedia - Event bubbling](https://en.wikipedia.org/wiki/Event_bubbling)</cite>

In simpler words: If an event happens, all the parent elements get informed about that event. So actually you can also register an event listener on an elements parent and it also gets fired on the parent. There is one final problem: If a parent contains many child elements, how can you distinguish between those elements? The solution is simple: By using the `event.target` and the [`Element.closest()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest) method, which uses a CSS selector and checks whether the element itself or any parent in the DOM fulfills that CSS selector. All you need to do is to give the elements unique classnames (or use a selector that clearly can distinguish the element from others). This concept is called event delegation.

Event delegation can speed up applications significantly and also can save many `addEventListener()`-calls. Imagine you have a table with thousands of rows. Wouldn't it be much more convenient to check for a `mouseover` and `mouseout` on the `table` element itself - then distinguish the row that caused the event - rather than on each row? And is one event listener handling all by delegation not much faster than thousands of event listeners?

RIsland does not use event delegation to speed things up, that is a nice side effect, but it needs it, so that after every template rerendering and DOM morphing it is unnecessary to remove or add event listeners. The main island element never gets changed. So adding the event listeners to this element and delegating all the events by selectors is a convenient way to add the listeners only once.

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** Some events do not bubble by default (`abort`, `blur`, `error`, `focus`, `load`, `loadend`, `loadstart`, `pointerenter`, `pointerleave`, `progress`, `scroll`, `unload`). RIsland takes care of this fact and makes those events bubble, because it heavily depends on event delegation. If this is causing trouble, the `nonBubblingEvents`-array in the config can be changed. See [Options](#options) for details.

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** Event delegation only handles the events inside the RIsland instance. Any other event outside of the RIsland instance has to be taken care of individually. F.ex: if you want a scroll-spy on the `document`, then this has to be done outside in your own code with `document.addEventListener('scroll', ...)`. If you still need interaction with the RIsland instance and its state, then it can be done in the `load` callback together with the `setState()` method.

It is possible to use combined or complex selectors, like:

```
.foo, .bar, input[type="checkbox"], div.baz > div.quox:first-child
```

In the RIsland config it would look like this:

```html
<div id="island"></div>

<script type="text/html" id="squirrelly">
    <div class="island">
        <p class="foo">Foo</p>
        <p class="bar">Bar</p>
        <input type="checkbox" />
        <div class="baz">
            <div></div>
            <div></div>
            <div></div>
            <div class="quox">
                <div>First</div>
                <div>Second</div>
                <div class="quox">
                    <div>First</div>
                    <div>Second</div>
                    <div>Last</div>
                </div>
            </div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</script>

<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        new RIsland({
            $element: document.getElementById('island'),
            delegations: {
                'click': {
                    '.foo, .bar, input[type="checkbox"], div.baz > div.quox:first-child': function(
                        event,
                        $closest,
                        state,
                        setState
                    ) {
                        console.log($closest);
                    }
                }
            },
            template: document.getElementById('squirrelly')
        });
    });
</script>
```

Problem is, that such selectors are hard to read and can lead to unwanted behaviour. Do not make rocket science when it comes to selectors. Use [BEM](http://getbem.com/introduction/)!

> <img src="assets/info.png" alt="Advice" width="50" height="60" align="left" /> **ADVICE!** When it comes to event delegation then the CSS paradigm [BEM](http://getbem.com/introduction/) shows another advantage: because with the [BEM](http://getbem.com/introduction/) notation every element gets a very precise - often unique - class name, it is much easier to address elements with event delegation. So one advice is, to use [BEM](http://getbem.com/introduction/) in the [squirrelly](https://github.com/squirrellyjs/squirrelly) template (and the partials). All the examples in this readme and all the code examples in the `examples` folder use [BEM](http://getbem.com/introduction/).

---

## <a name="event-throttling-debouncing"></a> Event throttling/debouncing

Events, like `resize`, `scroll` or `mousemove` can fire very fast and therefore cause a lot of unnecessary method invocations, because RIsland only renders each animation frame. The solution is to throttle events. This can be done in the `delegations`-object by adding the keyword `throttled` to an event. Additionally the amount of milliseconds can be provided. If no milliseconds are provided, the event gets throttled by request animation frame.

Some events, like the `keyup` in a form input might need a debouncing, because something should only be done, after the user ended typing for a given amount of time. For such cases the keyword `debounced`can be used. The amount of milliseconds can be provided. If no milliseconds are provided, the event gets debounced by request animation frame.

Example:

```html
<div id="island"></div>

<script type="text/html" id="squirrelly">
    <div class="island">
        normal: {{state.normal}}<br />
        throttledRaf: {{state.throttledRaf}}<br />
        debouncedRaf: {{state.debouncedRaf}}<br />
        throttled 1 second: {{state.throttled1s}}<br />
        debounced 1 second: {{state.debounced1s}}
    </div>
</script>

<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        new RIsland({
            $element: document.getElementById('island'),
            delegations: {
                'mousemove': {
                    '.island': function(event, $closest, state, setState) {
                        setState(function(state2) {
                            return { normal: state2.normal + 1 };
                        });
                    }
                },
                'mousemove.debounced': {
                    '.island': function(event, $closest, state, setState) {
                        setState(function(state2) {
                            return { debouncedRaf: state2.debouncedRaf + 1 };
                        });
                    }
                },
                'mousemove.throttled': {
                    '.island': function(event, $closest, state, setState) {
                        setState(function(state2) {
                            return { throttledRaf: state2.throttledRaf + 1 };
                        });
                    }
                },
                'mousemove.debounced.1000': {
                    '.island': function(event, $closest, state, setState) {
                        setState(function(state2) {
                            return { debounced1s: state2.debounced1s + 1 };
                        });
                    }
                },
                'mousemove.throttled.1000': {
                    '.island': function(event, $closest, state, setState) {
                        setState(function(state2) {
                            return { throttled1s: state2.throttled1s + 1 };
                        });
                    }
                }
            },
            initialState: {
                debounced1s: 0,
                debouncedRaf: 0,
                normal: 0,
                throttled1s: 0,
                throttledRaf: 0
            },
            template: document.getElementById('squirrelly')
        });
    });
</script>
```

The syntax for the event names is:

```
eventName[.debounced[.ms]]
eventName[.throttled[.ms]]
```

Examples:

```
keyup
keyup.debounced
keyup.debounced.1000
mousemove
mousemove.throttled
mousemove.throttled.1000
scroll.throttled.250
resize.throttled
```

---

## <a name="complex-event-delegation"></a> Complex Event Delegation

It is possible to use comma separated event names (also with throttling/debouncing) and combined CSS selectors, like:

```js
{
    delegations: {
        'mouseover, mouseout, mousemove.throttled.1000, keyup.debounced.1000': {
            '.foo, .bar, input[type="checkbox"], div.baz > div.quox:first-child': function(
                event,
                $closest,
                state,
                setState
            ) {
                console.log(event.type, $closest);
            }
        }
    }
}
```

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** RIsland gives a lot of flexibility when it comes to delegating events. But, even if this sounds repetitive: avoid rocket science. As you can already see in the above example, reading such a code is a nightmare. Try to use comma separated event names as rarely as possible and try to use [BEM](http://getbem.com/introduction/) for your CSS selectors.

---

## <a name="state"></a> State

"State" means the current state of data at a specific point in time - leading to a predictable template output and DOM representation. An RIsland instance always has an inner encapsulated state, which can be initialized and then changed with `setState()`. Everytime the state gets changed by `setState()`, the lifecycle `shouldUpdate` gets triggered to decide whether something in the state has changed, which makes a rerendering with `render` necessary. If so, the current state will be handed over to the [squirrelly](https://github.com/squirrellyjs/squirrelly) template and the HTML output will then be morphed into the DOM. No direct DOM manipulations take place this way, but the whole applications representational state (in the DOM) depends on its inner data state. This is why this paradigm is called "reactive", because inspite of changing things directly and in an imperative way in the DOM, you change the state and then the RIsland instance reacts on these changes and rerenders - or not.

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** Never change something in the DOM part which gets managed by RIsland directly, because next time the state changes and things get rerendered, your direct changes might be gone. This leads to an unpredictable and inconsistent application. Always use `setState()` and the [squirrelly](https://github.com/squirrellyjs/squirrelly) template to do what you want. If you find yourself in desperate need for breaking this rule, RIsland might not be the right solution for you.

---

## <a name="why-cloning"></a> Why cloning?

> In contrast, the by reference strategy receives not a copy, but the implicit reference to an object instead. And this reference is directly mapped (like an alias) to the object from the outside. Any changes to the parameter inside the function — either just the property modifications, or the full rewrite are immediately reflected on the original object.
>
> -- <cite>[ECMA-262-3 in detail. Chapter 8. Evaluation strategy - 4. Call by reference](http://dmitrysoshnikov.com/ecmascript/chapter-8-evaluation-strategy/#call-by-reference)</cite>

In simpler words: arrays and objects are not copied when you assign them to a variable or use them as a function argument, but they are passed by reference.

For a state pattern, this is a very bad situation, because the state - as a total private inner state - of a component is not encapsulated by the component, but changes from the outside on objects or arrays in the state could also change the state in the component and lead to unpredictable side effects.

RIsland takes care of that problem by always creating deep clones of the state. It is not enough to create a shallow clone, because f.ex. in an array of objects, it is not sufficient to only clone the array, because in the cloned array, the objects are still references to the original objects. The only way is to deeply clone **EVERYTHING**. It is clear that this strategy has some performance drawbacks, but on the other hand it leads to a totally encapsulated inner state of the component without any side effects. Most reactive libraries with state management follow this pattern. So even event and lifecycle callbacks get a current snapshot of the state as an argument, it is a clone. The only way to change the state is by using the `setState()` method, which also gets passed as an argument.

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT** It is important to understand that the states that become passed by argument to the events and lifecycle callbacks are only clones and represent a snapshot at that specific moment in time. That means: it is always best practice to get the freshest and most current state to avoid problems and collisions. Mutating the state directly in any way is useless, because it is only a clone. This is done on purpose and by design, so the only way to change the state is `setState()`. Please read [Common state pitfalls](#state-pitfalls) carefully to save yourself some headaches.

---

## <a name="setstate"></a> `setState()`

The `setState()` method is the only way to change the inner state of the component. It gets handed over as an argument to all event callbacks and the `load`, `update` and `unload` callbacks. The `setState()` method is very flexible when it comes to scenarios. The most simple scenario is, that you just pass an object with the key-value-pairs which have changed. If you want to set values based on the latest value of a state value, then you can use `setState()` with a callback function which hands over the most current state as the only argument. Another option is to use `setState()` with a `Promise` which can resolve an object with key-value-pairs or a callback function. Finally it is possible to mix all of these options in an `Array` and pass it to `setState()`.

Whenever `setState()` gets a `null` value, whether directly or as the result of a resolved `Promise`, it will not trigger the `shouldUpdate` lifecycle. If this is done in the `Array` context, only this one `Array` item will prevent the `shouldUpdate` lifecycle from happening; all other items will still be iterated.

> <img src="assets/info.png" alt="Advice" width="50" height="60" align="left" /> **ADVICE!** Sometimes you want to run something after all state changes have taken place. To achieve this, you can use the `Array` option and add a last item as a callback function, which does what you want and returns `null`.

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** You only need to return the `Partial` of the state, which you want to change. It is not necessary to always return the whole state-object, with `Object.assign()` or the spread-operator.

Examples:

```js
// simple object
setState({ foo: 'bar' });

// callback function
setState(function(state) { return { foo: state.foo + 1 }; });

// Promise resolving a simple object after 5 seconds
setState(
    new Promise(
        function(resolve) {
            window.setTimeout(
                function() {
                    resolve({ foo: 'bar' });
                },
                5000
            );
        }
    )
);

// Promise resolving a callback function after 5 seconds
setState(
    new Promise(
        function(resolve) {
            window.setTimeout(
                function() {
                    resolve(function(state) { return { foo: state.foo + 1 }; });
                },
                5000
            );
        }
    )
);

// callback function, with a condition which might return null to do nothing
setState(function(state) { return state.baz === true ? { foo: state.foo + 1 } : null; });

// Array with mixed scenarios
setState(
    [
        function(state) { return { foo: state.foo + 1 }; },
        new Promise(
            function(resolve) {
                window.setTimeout(
                    function() {
                        resolve(function(state) {
                            return state.baz === true ? { foo: state.foo + 1 } : null;
                        });
                    },
                    5000
                );
            }
        )
    ]
);

// Array with mixed scenarios and a Promise which returns an Array again
setState(
    [
        function(state) { return { foo: state.foo + 1 }; },
        new Promise(
            function(resolve) {
                window.setTimeout(
                    function() {
                        resolve(
                            [
                                { bar: 'quox' },
                                function(state) {
                                    return state.baz === true ? { foo: state.foo + 1 } : null;
                                })
                            ]
                        );
                    },
                    5000
                );
            }
        )
    ]
);

// Working with an Observable (RxJS) in a Promise
setState(
    new Promise(
        function(resolve) {
            // getBar() returns an Observable
            FooService.getBar().pipe(take(1)).subscribe(function(bar) {
                resolve({ bar: bar });
            });
        }
    )
);

// doing something after the state changes
setState(
    [
        { foo: 'bar' },
        function(state) {
            console.log('state changes finished', state);

            return null;
        }
    ]
);

// doing something after the state changes in a Promise
setState(
    new Promise(
        function(resolve) {
            window.setTimeout(
                function() {
                    resolve(
                        [
                            { foo: 'bar' },
                            function(state) {
                                console.log('state changes finished', state);

                                return null;
                            }
                        ]
                    );
                },
                5000
            );
        }
    )
);
```

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** RIsland gives the ability to handle very complex state scenarios with one single method. You could possibly use an Array of Promises, which return functions, which return null or more Promises, which return Arrays of Promises, which return simple objects. You can do that! But do yourself a favour and avoid rocket science! If the scenarios get too complex, you might want to rethink your applications structure.

---

## <a name="state-pitfalls"></a> Common state and `setState()` pitfalls

The all time evergreen and most common pitfall is to use an obsolete state. This means that a state clone is used which is outdated, because the state has already changed, so an old value is used, which leads to unexpected behaviour. These problems are very hard to debug and find and can drive developers mad. Here is a very simple example:

```js
delegations: {
    'click': {
        '.foo': function(event, $closest, state, setState) {
            setState(
                [
                    { foo: state.foo + 1 }, // Expected: 2, Actual: 2
                    { foo: state.foo + 1 }, // Expected: 3, Actual: 2
                    { foo: state.foo + 1 }, // Expected: 4, Actual: 2
                    { foo: state.foo + 1 }  // Expected: 5, Actual: 2
                ]
            );
        }
    }
},
initialState: {
    foo: 1
}
```

The problem here is, that the local `state` is not changing if a value is changed with `setState()`. It stays untouched. Therefore the RIsland instances state is always set to `2` again and again. To make it work, it has to be done like this:

```js
delegations: {
    'click': {
        '.foo': function(event, $closest, state, setState) {
            setState(
                [
                    function(state2) { return { foo: state2.foo + 1 }; }, // Expected: 2, Actual: 2
                    function(state2) { return { foo: state2.foo + 1 }; }, // Expected: 3, Actual: 3
                    function(state2) { return { foo: state2.foo + 1 }; }, // Expected: 4, Actual: 4
                    function(state2) { return { foo: state2.foo + 1 }; }  // Expected: 5, Actual: 5
                ]
            );
        }
    }
},
initialState: {
    foo: 1
}
```

This works, because in the callback function the `state2` always contains the most current state of the RIsland instance.

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** Always use the freshest and most current state. This can be done easily by using the callback function. In `setState()` the pure object should only be used if the state is not involved at all.

---

## <a name="web-component"></a> Usage as a Web Component

RIsland can also be used to create a simple [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) by using the static method `createWebComponent()`. It is crucial to understand, due to the fact that RIsland is not designed to have something like attributes or properties with a binding, that using an attributes only sets a value of the `initialState`. The attributes cannot be used to change that value later or change the state in any way. RIsland is meant to have this inner state which is usually not accessible to the "outside world". If you need bindings, mutatable attributes, properties, events aso. consider using a fully featured library, like [Angular](https://github.com/angular/angular), [Vue](https://github.com/vuejs), [React](https://github.com/facebook/react) or more sophisticated [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) libraries, like [Lit](https://lit.dev/) or [Stencil](https://stenciljs.com/).

The `createWebComponent()` method accepts the tag name of the new [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) (which MUST contain at least one dash), an array of attributes, which should be merged into the `initialState`, and an RIsland config (without the `$element` config).

Attribute values are usually strings, but RIsland takes care of a correct type casting. So if the attribute contains a **stringified** integer, float or complex JSON, then RIsland does a type casting back to real integer, float or the content of the JSON.

Example:

```html
<foo-bar qux="100" corge='{"grault": ["garply", "waldo"]}' fred="9.5"></foo-bar>
<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        RIsland.createWebComponent('foo-bar', ['qux', 'corge', 'fred'], {
            delegations: {
                'click': {
                    '.island__checkbox': function(event, $closest, state, setState) {
                        setState({ checked: $closest.checked });
                    }
                }
            },
            initialState: {
                checked: false,
                baz: 1,
                qux: null,
                corge: null,
                fred: null
            }
            template: '<div class="island">' +
                '<input class="island__checkbox" type="checkbox" />' +
                '{{@if(state.checked)}}is checked{{#else}}is not checked{{/if}}<br />' +
                '{{state.baz}} {{state.qux}} {{state.corge.grault[0]}} {{state.corge.grault[1]}} {{state.fred}}'
            '</div>'
        });
    });
</script>
```

This gives the ability to make initial state values setable by predefined attributes.

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** Usually an RIsland instance is exclusively added to one DOM element. With a [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) it is possible to add several RIsland instances to several occurences of a custom element. So if you are planning on using a data exchange mechanism in the `load` config callback, the same mechanism has to take care of a way to distinguish between different instances. This can be done by passing a unique id as one of the attributes. RIsland itself does not take care of this.

---

## <a name="lifecycles"></a> Lifecycles

"Lifecycle" means a specific action taking place in the RIsland instance. Like in a natural organism some lifecycles happen only once, like birth (constructor) and death (`unload`) and some happen cyclic, like sleeping, food intake and digestion (`shouldUpdate`, `render` and `update` triggered by a state change).

The following RIsland lifecycles are in logical order of their occurence:

### Constructor

The constructor lifecycle - the "birth" - does the configuration, precompiling of the [squirrelly](https://github.com/squirrellyjs/squirrelly) template, registering of [squirrelly](https://github.com/squirrellyjs/squirrelly) related `partial`s, `filter`s, `helper`s and `nativeHelper`s and adding DOM event listeners for the event delegation.

### Initial `render`

See the `render` lifecycle.

### `load` or `error`

This is the lifecycle which runs when the initial content - based on the initial state - has been rendered and is present in the DOM. It invokes the `load` config callback if present. (In case of an error it invokes the `error` config callback if present.)

### `setState()` and `shouldUpdate`

This lifecyle takes state changes applied by `setState()` and compares them (deeply) with the current state of the RIsland instance. If nothing changed, the process stops here, otherwise, in case of a change, the `render` lifecycle will be triggered. By default RIsland does a deep comparison, but a custom compare function can be provided with the configuration option `shouldUpdate`.

### `render`

This lifecycle uses the current state to render template output and morph the HTML result into the DOM. It is throttled by request animation frame to not run unnecessary rendering cycles even the browser does not show it.

### `update` or `error`

This is the lifecycle which runs when the updated content - based on state changes - has been rendered and is present in the DOM. It invokes the `update` config callback if present. (In case of an error it invokes the `error` config callback if present.)

### `unload`

This lifecycle has to be actively triggered by the `unload`-method. It removes all event listeners from the DOM element which was managed by RIsland and empties it.

---

## <a name="options"></a> Options

### `$element`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    $element: Element;
}
```

The DOM element which should be managed by RIsland. All event listeners will become added to this element and the HTML will be injected into it.

> <img src="assets/info.png" alt="Advice" width="50" height="60" align="left" /> **ADVICE!** You can place a loading notification inside of the DOM element. The moment RIsland is loaded, it will be replaced with the real content.

### `delegations`

```ts
private _setState(nextState: TRIslandSetState<IState>): void;

type TRIslandEventNames = keyof GlobalEventHandlersEventMap | 'loadend' | 'unload';

export type TRIslandEventNamesThrottled = (
    TRIslandEventNames
    | `${TRIslandEventNames}.debounced`
    | `${TRIslandEventNames}.debounced.${number}`
    | `${TRIslandEventNames}.throttled`
    | `${TRIslandEventNames}.throttled.${number}`
);

export type TRIslandEventNamesCommaSeparated = `${string},${string}`;

type TRIslandSetState<IState extends Record<string, any>> = (
    Partial<IState>
    | null
    | Promise<Partial<IState> | null>
    | ((state: IState) => TRIslandSetState<IState>)
    | Array<TRIslandSetState<IState>>
);

interface IRIslandConfig<IState extends Record<string, any>> {
    delegations: Partial<Record<
        TRIslandEventNamesThrottled | TRIslandEventNamesCommaSeparated,
        Record<string, (
            event: Event,
            $closest: Element,
            state: IState,
            setState: RIsland<IState>['_setState']
        ) => void>
    >>;
}
```

The delegations config object consists of (comma separated) event names (plus throttling/debouncing options) and sub objects, which consist of (combined) CSS selectors and a callback function. Whenever an event occurs, which matches one of the configured event names, RIsland checks if the target (or a close ancestor) of that event matches one of the CSS selectors and if so, the callback becomes invoked. See [Event delegation](#event-delegation), [Event throttling/debouncing](#event-throttling-debouncing) and [Complex Event Delegation](#complex-event-delegation).

Here is a list of the arguments of the callback function:

1. `event`

    This is the original event, which was triggered. It is possible to use `preventDefault()` or `stopPropagation()` if necessary.

2. `$closest`

    This is the closest ancestor of the event target. See [`Element.closest()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest). Imagine the following structure:

    ```html
    <a class="foo" href="http://www.foo.com">
        <span class="foo__bar">Baz</span>
    </a>
    ```

    and following RIsland config:

    ```js
    {
        delegations: {
            'click': {
                '.foo': function(event, $closest, state, setState) {
                    event.target.classList.add('quox');
                }
            }
        }
    }
    ```

    The first thought would be, that whenever someone clicks the link the `a` tag will have the class `quox` added, but this assumption is wrong. The `event.target` could be the nested `span` tag and therefore the class could possibly added to the `span` tag. `$closest` contains exactly the DOM element which is addressed by the CSS selector. In the example `.foo` leads to `$closest` always being the link. So the code should be:

    ```js
    {
        delegations: {
            'click': {
                '.foo': function(event, $closest, state, setState) {
                    $closest.classList.add('quox');
                }
            }
        }
    }
    ```

    > <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** If you depend on working exactly with the DOM element which is addressed by the CSS selector use the `$closest` argument.

3. `state`

    This is a current snapshot of the state. As mentioned before, be cautious using it. It is more recommended to use `setState()` with the callback function. Besides trying to mutate it directly does not work, because it is a clone. See [State](#state).

4. `setState`

    This is the `setState()` method as an argument. See [`setState()`](setstate).

### `error`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    error: () => void;
}
```

The `error` config callback is a function, which becomes invoked when the initial state or a state change and template rendering has been done, but an error has occured. The function has no arguments, because an error message is shown in the frontend anyway.

### `filters`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    filters: Record<string, Parameters<typeof Sqrl['filters']['define']>[1]>;
}
```

The `filters` config object consists of keys and callback functions which become registered as filters in [squirrelly](https://github.com/squirrellyjs/squirrelly). See [Filters API](https://squirrelly.js.org/docs/api/filter-api) for more information on how to use filters in [squirrelly](https://github.com/squirrellyjs/squirrelly).

### `helpers`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    helpers: Record<string, Parameters<typeof Sqrl['helpers']['define']>[1]>;
}
```

The `helpers` config object consists of keys and callback functions which become registered as helpers in [squirrelly](https://github.com/squirrellyjs/squirrelly). See [Helpers API](https://squirrelly.js.org/docs/api/helper-api/) for more information on how to use helpers in [squirrelly](https://github.com/squirrellyjs/squirrelly).

### `initialState`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    initialState: IState;
}
```

These are the initial values of the state. Each value which gets used later should at least be initialized here, even with an empty object, empty array or a value of `null`. 

### `load`

```ts
private _setState(nextState: TRIslandSetState<IState>): void;

type TRIslandSetState<IState extends Record<string, any>> = (
    Partial<IState>
    | null
    | Promise<Partial<IState> | null>
    | ((state: IState) => TRIslandSetState<IState>)
    | Array<TRIslandSetState<IState>>
);

interface IRIslandConfig<IState extends Record<string, any>> {
    load: (state: IState, setState: RIsland<IState>['_setState']) => void;
}
```

The `load` config callback is a function, which becomes invoked when the initial state and template rendering has been done and all elements are present in the DOM - the `load` lifecycle is reached, so that the RIsland instance is ready for changes. The function can have two arguments:

1. `state`

    This is a current snapshot of the state. As mentioned before, be cautious using it. It is more recommended to use `setState()` with the callback function. Besides trying to mutate it directly does not work, because it is a clone. See [State](#state).

2. `setState`

    This is the `setState()` method as an argument. See [`setState()`](setstate).

> <img src="assets/info.png" alt="Advice" width="50" height="60" align="left" /> **ADVICE!** The `load` config callback can be used to initialize any mechanism which is not event based (so event delegation is not possible), but might need the possiblity to set the state. F.ex. observables, stores, things which might become invoked asynchronously (timeouts, sockets, broadcast channels aso) or handing over `setState()` to other systems, so they can change the state of the RIsland instance.

### `nativeHelpers`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    nativeHelpers: Record<string, Parameters<typeof Sqrl['nativeHelpers']['define']>[1]>;
}
```

The `nativeHelpers` config object consists of keys and callback functions which become registered as nativeHelpers in [squirrelly](https://github.com/squirrellyjs/squirrelly). See [Native Helpers API](https://squirrelly.js.org/docs/api/native-helper-api) for more information on how to use nativeHelpers in [squirrelly](https://github.com/squirrellyjs/squirrelly).

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** As also stated in the Squirrelly documentation: "Native helpers are complicated and kind of messy. If you can implement something with a regular helper, do that instead."

### `partials`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    partials: Record<string, string | HTMLScriptElement>;
}
```

The `partials` config object consists of keys and - like the `template` config - `string`s or `script` tag DOM elements (use `type="text/html"` to activate syntax highlighting in editors). The data will be registered in [squirrelly](https://github.com/squirrellyjs/squirrelly). See [Partials and Template Inheritance](https://squirrelly.js.org/docs/syntax/partials-layouts/) for more information on how to use partials in [squirrelly](https://github.com/squirrellyjs/squirrelly).

Example:

```html
<div id="island"></div>

<script type="text/html" id="squirrelly">
    <div class="island">
        <input class="island__checkbox" type="checkbox" />
        {{@include('checked', { checked: state.checked })/}}
    </div>
</script>

<script type="text/html" id="squirrelly-checked">
    <p>{{@if(partialState.checked)}}is checked{{#else}}is not checked{{/if}}</p>
</script>

<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        new RIsland({
            $element: document.getElementById('island'),
            delegations: {
                'click': {
                    '.island__checkbox': function(event, $closest, state, setState) {
                        setState({ checked: $closest.checked });
                    }
                }
            },
            initialState: { checked: false },
            partials: { checked: document.getElementById('squirrelly-checked') },
            template: document.getElementById('squirrelly')
        });
    });
</script>
```

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** The namespace inside a partial is not `state`, but `partialState`. The different naming is necessary to avoid the assumption the namespace in the partial provides the full state. Always keep in mind that the `partialState` provided to the partial is only what has been provided to the native `@include` helper.

### `shouldUpdate`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    shouldUpdate: (state: IState, nextState: IState, deepEqual: typeof equal) => boolean;
}
```

The `shouldUpdate` config callback is a function which takes two states as the first two arguments, the current state and the incoming state changes, and compares them, to finally decide, whether an update and rerendering should be done. By default this callback does a deep comparison of all data. If it is necessary to omit some parts of the data from the comparison, you can provide your own custom function.

```js
{
    initialState: {
        foo: 0,
        bar: 1,
        baz: 2
    },
    shouldUpdate: function(state, nextState) {
        return state.foo !== nextState.foo || state.baz !== nextState.baz;
    }
}
```

In the above example only changes to `foo` or `baz` will lead to an update and rerendering, while changes to `bar` will be ignored.

> <img src="assets/info.png" alt="Advice" width="50" height="60" align="left" /> **ADVICE!** The third parameter of the `shouldUpdate` config callback is a deep equal function, which can be used to do a deep comparison of two values. The provided method is from the third party library [fast-deep-equal](https://github.com/epoberezkin/fast-deep-equal). So if f.ex. you want to deeply compare two objects, but want to omit only one key, then omit the one key in both objects and then use this method.

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** If you intentionally ignore data changes, you have to know what you are doing, otherwise it could lead to inconsistencies between the state and the intended representation. Only omit some data, if it is clear, that this data is not necessary for the represenation or the represenation already gets updated by something else.

### `template`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    template: string | HTMLScriptElement;
}
```

The `template` config consists of a `string` (simple string, if necessary with concatenation or a template string) or `script` tag DOM element (use `type="text/html"` to activate syntax highlighting in editors). It contains template information for usage with [squirrelly](https://github.com/squirrellyjs/squirrelly). See [`script` tag `type="text/html"`](#script-tag) and [Bundlers and template files](#bundlers-template).

### `unload`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    unload: (state: IState) => void;
}
```

The `unload` config callback is a function, which becomes invoked when the `unload` method has been called - the `unload` lifecycle is reached, so that the event handlers become removed and the HTML becomes deleted from the element which was managed by RIsland. The function can have one (final) argument:

1. `state`

    This is a final snapshot of the state. See [State](#state).

### `update`

```ts
private _setState(nextState: TRIslandSetState<IState>): void;

type TRIslandSetState<IState extends Record<string, any>> = (
    Partial<IState>
    | null
    | Promise<Partial<IState> | null>
    | ((state: IState) => TRIslandSetState<IState>)
    | Array<TRIslandSetState<IState>>
);

interface IRIslandConfig<IState extends Record<string, any>> {
    update: (state: IState, setState: RIsland<IState>['_setState']) => void;
}
```

The `update` config callback works the same way as the `load` config callback. The difference is, that it becomes invoked after a `setState()`, `shouldUpdate`, `render` loop, after everything is present in the DOM.

---

## <a name="advanced-options"></a> Advanced - dangerous - options

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** the following options should only be used, if you really know what you are doing, because they can change the way, how RIsland works internally and affect the result - in the worst case cause exceptions, errors or unwanted behaviour.

### `deepmerge`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    deepmerge: deepmerge.Options;
}
```

These are additional options which influence the way deepmerge works. See [deepmerge](https://github.com/TehShrike/deepmerge).

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** The `clone` option is forced to be `false`, because RIsland uses its own cloning mechanism and a double cloning would waste performance.

### `morphdom`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    morphdom: Parameters<typeof morphdom>[2];
}
```

These are additional options which influence the way [morphdom](https://github.com/patrick-steele-idem/morphdom) works. See [morphdom](https://github.com/patrick-steele-idem/morphdom).

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** The `childrenOnly` option is forced to be `false`, otherwise it would break RIsland. Any attempt to set this option is just ignored. If you think you need this option, you might do something wrong. Please check your code.

### `nonBubblingEvents`

```ts
type TRIslandEventNames = keyof GlobalEventHandlersEventMap | 'loadend' | 'unload';

interface IRIslandConfig<IState extends Record<string, any>> {
    nonBubblingEvents: Array<TRIslandEventNames>;
}
```

Some events do not bubble by default. (`abort`, `blur`, `error`, `focus`, `load`, `loadend`, `loadstart`, `pointerenter`, `pointerleave`, `progress`, `scroll`, `unload`). RIsland takes care of this fact and makes those events bubble, because it heavily depends on event delegation. It is possible to override the list of events with this config option. If f.ex. the bubbling of the `scroll` event is unwanted or causing any performance issues, then remove it from the list (by filtering it out of the static property `RIsland.NON_BUBBLING_EVENTS`).

```html
<div id="island"></div>

<script type="text/html" id="squirrelly">
    <div class="island">
        <input class="island__checkbox" type="checkbox" />
        {{@if(state.checked)}}is checked{{#else}}is not checked{{/if}}
    </div>
</script>

<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        new RIsland({
            $element: document.getElementById('island'),
            delegations: {
                'click': {
                    '.island__checkbox': function(event, $closest, state, setState) {
                        setState({ checked: $closest.checked });
                    }
                }
            },
            initialState: { checked: false },
            nonBubblingEvents: RIsland.NON_BUBBLING_EVENTS.filter(function(eventName) {
                return eventName !== 'scroll';
            }),
            template: document.getElementById('squirrelly')
        });
    });
</script>
```

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** If you want to change the list of non bubbling events, please filter the static property `RIsland.NON_BUBBLING_EVENTS`. If you accidently add events, which already support bubbling, you change the way, event bubbling works, which might lead to unwanted behaviour.

### `squirrelly`

```ts
interface IRIslandConfig<IState extends Record<string, any>> {
    squirrelly: Partial<SqrlConfig>;
}
```

These are additional options which influence the way squirrelly works. See [squirrelly](https://github.com/squirrellyjs/squirrelly).

> <img src="assets/warning.png" alt="Important" width="50" height="60" align="left" /> **IMPORTANT!** The `varName` option is forced to be `state`
 (and `partialState` in partials) to ensure naming consistency.

---

## <a name="properties"></a> Properties

### `NON_BUBBLING_EVENTS`

```ts
type TRIslandEventNames = keyof GlobalEventHandlersEventMap | 'loadend' | 'unload';

public static NON_BUBBLING_EVENTS: Array<TRIslandEventNames>;
```

The only static property which RIsland offers is `NON_BUBBLING_EVENTS`. It is a list of events which do not bubble by default. See the `nonBubblingEvents` config option.

---

## <a name="methods"></a> Methods

### `unload`

```ts
public unload(): void;
```

One of the two methods which an RIsland instance offers is `unload`. Everything else is done through the configuration object in the constructor. `unload` removes all event listeners from the element which gets managed by RIsland, empties its HTML and calls the configured `unload` callback - if present - with the final state.

```html
<div id="island"></div>

<script type="text/html" id="squirrelly">
    <div class="island">
        <input class="island__checkbox" type="checkbox" />
        {{@if(state.checked)}}is checked{{#else}}is not checked{{/if}}
        <button class="island__close" type="button">Close</button>
    </div>
</script>

<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        var island = new RIsland({
            $element: document.getElementById('island'),
            delegations: {
                'click': {
                    '.island__checkbox': function(event, $closest, state, setState) {
                        setState({ checked: $closest.checked });
                    },
                    '.island__close': function() {
                        island.unload();
                    }
                }
            },
            initialState: { checked: false },
            template: document.getElementById('squirrelly')
        });
    });
</script>
```

### `createWebComponent`

```ts
public static createWebComponent<IState>(
    tagName: `${string}-${string}`,
    attributes: Array<keyof IState & string>,
    config: Partial<Omit<IRIslandConfig<IState>, '$element'>>
): void
```

Static method to create a simple [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

This method has 3 arguments:

1. `tagName`

    The tag name of the [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components). It MUST contain at least one dash.

2. `attributes`

    An array of attribute names. These attributes can be set on the [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components), will be casted to the right type and then merged into the `initialState`.

3. `config`

    The usual RIsland config, but without the `$element` key.

---

## <a name="examples"></a> Examples

If you want to run the examples in your browser - and not just check the code - you have to do the following:

- Clone this repository.
- Install node.js if necessary.
- Run `npm install`.
- Run `npm run examples`.
- Open http://localhost:3000 in your browser or press any key.

The examples are not listed alphabetically, but in order of skill level. The examples which are not mentioned here, are more for testing purposes (like testing error messages).

### `checkbox.html`

This is the most simple checkbox example, which is also shown in this readme.

### `checkbox-loading-notification.html`

This is an example of how to place a loading notification in the DOM element which then gets managed by RIsland. For 10 seconds a notification blinks, until finally RIsland is loaded.

### `checkbox-promise.html`

This is an example of a Promise with a time delay. 5 seconds after the checkbox has being changed a log entry is generated.

### `checkbox-seconds-counter.html`

This is an example of a simple checkbox with an additional seconds counter.

### `checkbox-observable.html`

This is an example of two RIsland instances communicating through a Subject (RxJS). Whenever the checkbox changes, it generates a log entry.

### `checkbox-unload.html`

This is an example of the `unload` method as shown in this readme.

### `checkbox-web-component.html`

This example shows how to use RIsland as a [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) by using the static `createWebComponent()` method as shown in this readme.

### `squirrelly-partials-test.html`

This is an example of how to use partials in RIsland. It shows a checkbox and whenever the checkbox changes, a log entry is generated.

### `comma-separated-events.html`

This is an example which shows the usage of comma separated event names in the delegations. The output is shown in the console, so you need the Developer Tools of the browser to be open.

### `mousemove-throttled.html`

This is an example which shows the event throttling/debouncing options. Constantly move the mouse over the text box to see the throttling/debouncing. Interestingly enough it seems that the `mousemove` event already gets throttled by request animation frame (at least in Chrome and Firefox).

### `table-sort-filter.html`

This is a basic example of a table with information from a CSV file, which can be sorted and filtered. This could be useful for a product comparison or specifications table on a shop page.

### `todo-list.html`

This is an example of a simple todo list, with different priorities, manual sorting, drag&drop, local storage and 5 languages. It uses [i18next](https://github.com/i18next/i18next), `Date.toLocaleString()`, [Fontawesome](https://fontawesome.com/) and [Dragula](https://github.com/bevacqua/dragula). Besides it shows how to work with custom settings in [deepmerge](https://github.com/TehShrike/deepmerge) and [morphdom](https://github.com/patrick-steele-idem/morphdom) and how to use `setState` in the `load` config callback together with other libraries. Settings and data are persisted in the local storage, so if you reload the browser or revisit the list later, it still has your data.

### `tetris.html`

This example is a clone of the famous game [Tetris](https://en.wikipedia.org/wiki/Tetris). The 3 main principles behind this game are an interval, a matrix and distance calculations. This example shows how RIsland can be used for the matrix representation (and things like buttons, score and the upcoming Tetromino). You can play it with the buttons, but it is more convenient to use the keyboard. Keys are "Left" and "Right" for moving the Tetromino, "Down" for dropping it, "Space" for rotating it and "Escape" for quitting the game. **Have fun!**

---

## <a name="hints"></a> Hints

### `safe` flag in [squirrelly](https://github.com/squirrellyjs/squirrelly)

If you want to output HTML in your variables you should use the `safe` flag as the last filter in your filter chain, otherwise the content will be HTML encoded. This is intentionally to prevent XSS attacks. See [The safe flag](https://squirrelly.js.org/docs/syntax/filters/#the-safe-flag).

```html
<script type="text/html" id="squirrelly">
    <div class="island">
        {{'<p>Hello world!</p>' | safe}}
    </div>
</script>
```

### Working with [Fontawesome](https://fontawesome.com/) 5+

Since [Fontawesome](https://fontawesome.com/) 5+ the system does not use an iconfont any more, but replaces occurences of an `i`-tag and icon-classes with SVG-content. This can cause trouble with the way [morphdom](https://github.com/patrick-steele-idem/morphdom) works and besides using the system out of the box with mutation observers is costy. So if you are planning on using [Fontawesome](https://fontawesome.com/) 5+ in your RIsland instance, you have to do some adjustments:

```html
<div id="island"></div>

<script type="text/html" id="squirrelly">
    <div class="island">
        <input class="island__checkbox" type="checkbox" />
        {{@if(state.checked)}}
            <i class="fa-solid fa-thumbs-up"></i>
            is checked
        {{#else}}
            <i class="fa-solid fa-thumbs-down"></i>
            is not checked
        {{/if}}
    </div>
</script>

<script src="risland.iife.min.js"></script>
<script>
    window.FontAwesomeConfig = {
        autoReplaceSvg: 'nest'
        , observeMutations: false
    };
</script>
<script src="fontawesome-free/js/solid.min.js"></script>
<script src="fontawesome-free/js/fontawesome.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        var $island = document.getElementById('island');

        function refreshIcons() {
            // this only refreshes the icons in your RIsland instance
            FontAwesome.dom.i2svg({ node: $island });
        }

        new RIsland({
            $element: $island,
            delegations: {
                'click': {
                    '.island__checkbox': function(event, $closest, state, setState) {
                        setState({ checked: $closest.checked });
                    }
                }
            },
            initialState: { checked: false },
            load: refreshIcons,
            morphdom: {
                onBeforeElUpdated: function($fromEl) {
                    return !(
                        $fromEl.tagName.toLowerCase() === 'i'
                        && $fromEl.hasAttribute('data-fa-i2svg') === true
                    );
                }
            },
            template: document.getElementById('squirrelly'),
            update: refreshIcons
        });
    });
</script>
```

What this does: `autoReplaceSvg` set to `nest` tells [Fontawesome](https://fontawesome.com/) to nest the SVGs into the `i`-tags, which is the only way to work with it in [morphdom](https://github.com/patrick-steele-idem/morphdom). (The usual way is to transform the `i`-tag into an HTML-comment and add the SVG, which triggers `onBeforeNodeAdded` and `onBeforeNodeDiscarded`. In `onBeforeNodeDiscarded` it is possible to prevent the SVG from being discarded, but in `onBeforeNodeAdded` the node has no DOM context yet, so it is not possible to check whether it should be added or an SVG is already present. So `nest` with `onBeforeElUpdated` is the only way to go here.) `observeMutations` set to `false` prevents [Fontawesome](https://fontawesome.com/) from observing the whole DOM for mutations. We know things changed in the `load` and `update` config callbacks, so we can refresh the icons there.

> <img src="assets/info.png" alt="Advice" width="50" height="60" align="left" /> **ADVICE!** The default bundles of [Fontawesome](https://fontawesome.com/) 5+ are usually huge. It is possible to create your own custom [Fontawesome](https://fontawesome.com/) bundles now with a few clicks. They call this a "Kit". Give it a try!

> <img src="assets/info.png" alt="Advice" width="50" height="60" align="left" /> **ADVICE!** Have a look at the `todo-list.html` example, because [Fontawesome](https://fontawesome.com/) is used there and additionally the `title`-attributes and SVG `title` tags become updated manually.

### Deleting an object key with [deepmerge](https://github.com/TehShrike/deepmerge)

In JavaScript an object key cannot be deleted by setting its value to `undefined`. It has to be done with `delete`.

```js
var foo = { bar: 1 };

foo.bar = undefined;

console.log(foo); // output { bar: undefined }

delete foo.bar;

console.log(foo); // output {}
```

This leads to the problem, that [deepmerge](https://github.com/TehShrike/deepmerge) does not offer any way to tell it, that an object key should be deleted inspite of being set to `undefined`. And there is no option to tell it to delete keys. The only way to achieve this is to provide a `customMerge` function in the [deepmerge](https://github.com/TehShrike/deepmerge) config.

```html
<div id="island"></div>

<script type="text/html" id="squirrelly">
    <div class="island">
        {{@if(state.foo.bar)}}<span class="island__foo-bar">{{state.foo.bar}}</span>{{/if}}
        <button class="island__button" type="button">Delete bar</button>
    </div>
</script>

<script src="risland.iife.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        new RIsland({
            $element: document.getElementById('island'),
            deepmerge: {
                customMerge: function(key) {
                    if (key === 'foo') {
                        return function(a, b) {
                            return Object.assign(
                                {},
                                Object.keys(a).reduce(function(result, key) {
                                    if (!(key in b) || typeof b[key] !== 'undefined') {
                                        var tmp = {}
                                        tmp[key] = a[key];

                                        return Object.assign({}, result, tmp);
                                    }

                                    return result;
                                }, {}),
                                Object.keys(b).reduce(function(result, key) {
                                    if (typeof b[key] !== 'undefined') {
                                        var tmp = {}
                                        tmp[key] = b[key];

                                        return Object.assign({}, result, tmp);
                                    }

                                    return result;
                                }, {})
                            );
                        };
                    }

                    return undefined;
                }
            },
            delegations: {
                'click': {
                    '.island__button': function(event, $closest, state, setState) {
                        setState({ foo: { bar: undefined } });
                    }
                }
            },
            initialState: {
                foo: {
                    bar: 'baz'
                }
            },
            template: document.getElementById('squirrelly')
        });
    });
</script>
```

What happens here is that `foo` gets a custom merge function, which omits all keys with a value of `undefined` on both objects.

### Use [`pairwise()`](https://rxjs.dev/api/operators/pairwise), [`distinctUntilChanged()`](https://rxjs.dev/api/operators/distinctUntilChanged) or [`bufferCount()`](https://rxjs.dev/api/operators/bufferCount) in RxJS for Diffing

If working with libraries which follow a state pattern it is very often useful to also compare an Observable with its former value. This can be done very easily with the [`pairwise()`](https://rxjs.dev/api/operators/pairwise) operator. (You can also use the [`distinctUntilChanged()`](https://rxjs.dev/api/operators/distinctUntilChanged) operator, optionally with a `comparator` or the [`bufferCount()`](https://rxjs.dev/api/operators/bufferCount) operator with a `bufferSize` of `2`.)

Example:

```ts
import { BehaviorSubject } from 'rxjs';
import { pairwise } from 'rxjs/operators';

document.addEventListener('DOMContentLoaded', () => {
    const initialState = { foo: 1 };

    const foo$ = new BehaviorSubject<number>(initialState.foo);
    let subscription;

    const interval = window.setInterval(() => {
        // pick a random number between 0 and 100
        foo$.next(Math.floor(Math.random() * 100));
    }, 1000);

    new RIsland<{ foo: number }>({
        $element: document.getElementById('island'),
        initialState,
        load: (_, setState) => {
            subscription = foo$.pipe(pairwise()).subscribe(([formerFoo, foo]: [number, number]) => {
                if (foo !== formerFoo) {
                    setState({ foo });
                }
            });
        },
        template: '<div>{{state.foo}}</div>',
        unload: () => {
            subscription.unsubscribe();
            window.clearInterval(interval);
        }
    });
});
```

---

## <a name="technologies"></a> Technologies

- [morphdom](https://github.com/patrick-steele-idem/morphdom) - is a very nice library which can morph one DOM state into the other.
- [squirrelly](https://github.com/squirrellyjs/squirrelly) - is a tiny and fast templating engine.
- [deepmerge](https://github.com/TehShrike/deepmerge) - a library which can merge two or more objects deeply.
- [klona](https://github.com/lukeed/klona) - a library which clones data (because in JavaScript arrays and objects are passed by reference, which can lead to unpredictable und ugly side effects, especially when a safely encapsulated state management should be provided.)
- [fast-deep-equal](https://github.com/epoberezkin/fast-deep-equal) - claims to be the fastest library for comparing two given sets of data
- [throttle-debounce](https://github.com/niksy/throttle-debounce) - throttles method invocations by a given amount of milliseconds
- [raf-throttle](https://github.com/wuct/raf-throttle) - throttles method invocations by request animation frame
- [debounce-animation-frame](https://github.com/onestopjs/debounce-animation-frame) - debounces method invocations by request animation frame

Feel free to check the `package.json`, if you want to take a further look into the used technologies.

---

## <a name="alternatives"></a> Alternatives

RIsland.js is not a new, groundbreaking, unique invention, but it came out of a daily need. Because others had the same daily needs, there are other libraries out there who have a similar approach. If RIsland.js is not exactly what you need or what you were looking for, check out some of these libraries:

- [Reef](https://github.com/cferdinandi/reef)
- [Sinuous](https://github.com/luwes/sinuous)
- [S.js](https://github.com/adamhaile/S)

---

## <a name="final-thoughts"></a> Final thoughts

First of all a big thanks to the people who have written the fantastic libraries RIsland is heavily relying on. Without their work RIsland wouldn't even exist!

Before starting discussions like *"Can you please implement feature XY?"* or *"Why does RIsland not support plugins/hooks or any other way to extend it?"*: This library is meant to do what it does! The focus is on its rather small size, while still being very versatile, powerful, fast to use and easy to learn. Its code is pleasently short, which makes it stable and bugs unlikely. It is better to focus on something and doing it really good, inspite of trying to look for the "one ring to rule them all" and then unleashing a monster which nobody can maintain (especially in spare time). This does not mean that any kind of discussion should be avoided; this is not meant as a killer phrase. If you find yourself in need of feature XY again and again, then please start a discussion, but do not be disappointed, if others do not agree, because they think it is not the focus of RIsland and would unnecessarily bloat it. Besides there are fantastic libraries out there providing many more features than RIsland in a very good way. So this library is not trying to reinvent the wheel. It does what it does! A simple tautology.

And finally: Thanks to everyone who had the patience to read this document. Hopefully you enjoy working with RIsland.

---

## <a name="license"></a> License

This software is brought to you with :heart: **love** :heart: from Dortmund and offered and distributed under the ISC license. See `LICENSE.txt` and [Wikipedia](https://en.wikipedia.org/wiki/ISC_license) for more information.
