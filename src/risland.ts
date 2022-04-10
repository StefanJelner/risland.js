import '@webcomponents/custom-elements/src/native-shim';
import debounceAnimationFrame from 'debounce-animation-frame';
import deepmerge from 'deepmerge';
import equal from 'fast-deep-equal';
import { isPlainObject } from 'is-plain-object';
// we do not use klona/lite, because this klona is still the fastest, only 100 Byte bigger in size, but provides many
// more types, which can be cloned.
import { klona } from 'klona';
import morphdom from 'morphdom';
import rafThrottle from 'raf-throttle';
import * as Sqrl from 'squirrelly';
import { TemplateFunction } from 'squirrelly/dist/types/compile';
import { SqrlConfig } from 'squirrelly/dist/types/config';
import { debounce, throttle } from 'throttle-debounce';

/**
 * # RIsland
 * 
 * A simple, lightweight approach for providing reactive islands on websites.
 * 
 * See the README.md file for further documentation.
 */
export default class RIsland<IState extends Record<string, any>> {
    /**
     * Helps to create a web component containing an RIsland instance.
     * 
     * @param tagName the name of the custom tag (separated with at least one dash)
     * @param attributes a list of attribute names which should be type casted and merged into the initial state
     * @param config the configuration (without $element)
     */
    public static createWebComponent<IState>(
        tagName: `${string}-${string}`
        , attributes: Array<keyof IState & string>
        , config: Partial<Omit<IRIslandConfig<IState>, '$element'>>
    ): void {
        window.customElements.define(
            tagName
            , class extends HTMLElement {
                private _$island: HTMLDivElement;
                private _island: RIsland<IState>;

                /**
                 * Constructor
                 */
                constructor() {
                    // super() is mandatory
                    super();

                    // creating shadow DOM and attaching our island to it
                    const shadow = this.attachShadow({ mode: 'open' });
                    this._$island = document.createElement('div');
                    shadow.appendChild(this._$island);
                }

                /**
                 * Becomes called after the element has been connected and instantiates RIsland on the newly created
                 * element.
                 */
                public connectedCallback(): void {
                    // attaching RIsland instance to the island
                    this._island = new RIsland<IState>({
                        ...config
                        , ...{
                            $element: this._$island
                            , initialState: deepmerge<IRIslandConfig<IState>['initialState']>(
                                config.initialState
                                // type casting and merging attribute values
                                , attributes.reduce((result, key) => {
                                    const value = this.getAttribute(key);

                                    if (value !== null && value !== '') {
                                        return { ...result, [key]: this._parse(value) };
                                    }

                                    return result;
                                }, {})
                                , { clone: false, isMergeableObject: isPlainObject }
                            )
                        }
                    });
                }

                /**
                 * Becomes called after the element has been disconnected and unloads RIsland.
                 */
                public disconnectedCallback(): void { this._island.unload(); }

                /**
                 * Takes care of attribute values which might contain an integer or float (as a string) or
                 * stringified JSON.
                 * 
                 * @param value a literal value, an integer or float (as a string) or stringified JSON
                 * @returns the literal value, an integer, a float or parsed JSON
                 */
                private _parse(value: string): unknown {
                    let parsed = value;

                    // if it is an integer
                    if (/^[-+]?\d+(e[-+]?\d+)?$/i.test(parsed)) { return parseInt(parsed, 10); }

                    // if it is a float
                    if (/^[-+]?\d*\.\d+(e[-+]?\d+)?$/i.test(parsed)) { return parseFloat(parsed); }

                    // finally try to parse JSON, if it is stringified JSON
                    try { parsed = JSON.parse(value); } catch(ex) {} // eslint-disable-line no-empty

                    return parsed;
                }
            } as any
        );
    }

    // List of non-bubbling events, which need to have capture set to true.
    // See https://en.wikipedia.org/wiki/DOM_events#Events
    public static NON_BUBBLING_EVENTS: Array<TRIslandEventNames> = [
        'abort'
        , 'blur'
        , 'error'
        , 'focus'
        , 'load'
        , 'loadend'
        , 'loadstart'
        , 'pointerenter'
        , 'pointerleave'
        , 'progress'
        , 'scroll'
        , 'unload'
    ];

    private _empty: string = '<div></div>';
    private _initialConfig: IRIslandConfig<IState> = {
        $element: document.body
        , deepmerge: { isMergeableObject: isPlainObject }
        , delegations: {}
        , error: () => {}
        , filters: {}
        , helpers: {}
        , initialState: {} as IState
        , load: () => {}
        , morphdom: {}
        , nativeHelpers: {}
        , nonBubblingEvents: RIsland.NON_BUBBLING_EVENTS
        , partials: {}
        , shouldUpdate: (
            state: Readonly<IState>
            , nextState: Readonly<IState>
            , deepEqual: typeof equal
        ) => !deepEqual(state, nextState)
        , squirrelly: Sqrl.defaultConfig
        , template: this._empty
        , unload: () => {}
        , update: () => {}
    };

    // IMPORTANT! these are crucial settings which are necessary for RIsland to operate the way it is intended
    // to. These settings cannot be overridden by the user.
    private _enforcedConfig: Partial<IRIslandConfig<IState>> = {
        deepmerge: {
            // we use klona for this task.
            clone: false
        }
        , morphdom: {
            // this setting is crucial, otherwise RIsland won't work as expected.
            childrenOnly: false
        }
        , squirrelly: {
            // for reasons of unambiguity - because in RIsland the term "state" is always used -, the namespace
            // in squirrelly should also be called "state".
            varName: 'state'
        }
    };
    // Suirrelly configuration for internal use
    private _internalSqrlConfig: SqrlConfig = { ...Sqrl.defaultConfig, ...this._enforcedConfig.squirrelly };

    private _config: IRIslandConfig<IState>;
    private _compiledConsole: TemplateFunction = Sqrl.compile(
        '{{state.type}}:\n\n{{@each(state.messages) => message}}- {{message}}\n{{/each}}'
        , this._internalSqrlConfig
    );
    private _compiledError: TemplateFunction = Sqrl.compile(
        '<ul style="color:red;">{{@each(state.errors) => error}}<li>{{error}}</li>{{/each}}</ul>'
        , this._internalSqrlConfig
    );
    private _compiledTemplate: TemplateFunction;
    private _delegationFuncs: Partial<Record<TRIslandDelegationFuncsKey, {
        capture: boolean;
        func: (event: Event) => void;
    }>> = {};
    private _errors: Array<string> = [];
    private _loaded: boolean = false;
    private _state: IState = {} as IState;
    private _throttledLoadOrUpdate: RIsland<IState>['_loadOrUpdate'] = rafThrottle(this._loadOrUpdate);
    private _throttledRender: RIsland<IState>['_render'] = rafThrottle(this._render);
    private _warnings: Array<string> = [];

    /**
     * Constructor
     * 
     * @param config the configuration
     */
    constructor(config: Partial<IRIslandConfig<IState>>) {
        this._config = deepmerge.all<IRIslandConfig<IState>>(
            [
                this._initialConfig
                // clone the config, otherwise it could be mutated later.
                , klona(config)
                // finally add the enforced config values.
                , this._enforcedConfig
            ]
            // for the initial merging we have to use the initial config and the enforced one.
            , {
                ...this._initialConfig.deepmerge
                , ...this._enforcedConfig.deepmerge
            }
        );

        if (
            !isPlainObject(this._config.initialState)
            || this._config.initialState === null
        ) {
            this._errors = this._errors.concat('ERR001: initialState has to be an object (which is not null).');

            this._config.initialState = this._initialConfig.initialState;
        }

        // registering filters, helpers and nativeHelpers in squirrelly
        ['filters', 'helpers', 'nativeHelpers'].forEach((key: string) => {
            Object.keys(this._config[key]).forEach((key2: string) => {
                Sqrl[key].define(key2, this._config[key][key2]);
            });
        });
        // registering partials in squirrelly
        Object.keys(this._config.partials).forEach((partial: string) => {
            Sqrl.templates.define(
                partial
                , Sqrl.compile(
                    this._getTemplate(this._config.partials[partial])
                    , {
                        ...this._config.squirrelly
                        // in partials the namespace is called "partialState"
                        , varName: 'partialState'
                    }
                )
            );
        });
        this._compiledTemplate = Sqrl.compile(this._getTemplate(this._config.template), this._config.squirrelly);

        (Object.keys(this._config.delegations) as Array<TRIslandEventNames>).forEach((
            commaSeparatedEventNames: TRIslandEventNamesThrottled | TRIslandEventNamesCommaSeparated
            , index: number
        ) => {
            commaSeparatedEventNames.trim().split(/\s*,\s*/g).forEach((eventName: TRIslandEventNamesThrottled) => {
                const funcName: TRIslandDelegationFuncsKey = `${eventName}:${index}`;

                if (funcName in this._delegationFuncs) {
                    this._warnings = this._warnings.concat(
                        `WARN001: RIsland: event name "${
                            eventName
                        }" exists more than once in "${
                            commaSeparatedEventNames
                        }". This occurence will simply be ignored.`
                    );

                    return;
                }

                // add throttling, if necessary.
                const throttling = this._getThrottling(eventName);

                this._delegationFuncs[funcName] = {
                    capture: this._config.nonBubblingEvents.indexOf(throttling.eventName) !== -1
                    , func: (event: Event) => {
                        if (event.target instanceof Element) {
                            Object.keys(this._config.delegations[commaSeparatedEventNames]).forEach(
                                (selector: string) => {
                                    const $closest = (event.target as Element).closest(selector);

                                    if ($closest !== null) {
                                        this._config.delegations[commaSeparatedEventNames][selector](
                                            event
                                            , $closest
                                            , klona(this._state)
                                            , this._setState.bind(this)
                                        );
                                    }
                                }
                            );
                        }
                    }
                };

                if (throttling.throttled === true) {
                    if ('ms' in throttling) {
                        // conventional throttling.
                        this._delegationFuncs[funcName].func = throttle(
                            throttling.ms
                            , this._delegationFuncs[funcName].func
                        );
                    } else {
                        // throttling by request animation frame.
                        this._delegationFuncs[funcName].func = rafThrottle(this._delegationFuncs[funcName].func);
                    }
                }

                if (throttling.debounced === true) {
                    if ('ms' in throttling) {
                        // conventional debouncing.
                        this._delegationFuncs[funcName].func = debounce(
                            throttling.ms
                            , this._delegationFuncs[funcName].func
                        );
                    } else {
                        // debouncing by request animation frame.
                        this._delegationFuncs[funcName].func = debounceAnimationFrame(
                            this._delegationFuncs[funcName].func
                        );
                    }
                }

                this._config.$element.addEventListener(
                    throttling.eventName
                    , this._delegationFuncs[funcName].func
                    , { capture: this._delegationFuncs[funcName].capture }
                );
            });
        });

        if (Object.keys(this._config.initialState).length === 0) {
            this._warnings = this._warnings.concat(
                'WARN002: Initialisation with an empty state is considered an anti-pattern. '
                + 'Please try to predefine everything you will later change with setState() with an initial value; '
                + 'even it is null.'
            );

            // because the state is already an empty object, we do not need to use setState() here, but can directly
            // render.
            this._throttledRender();
        } else {
            this._setState(this._config.initialState);
        }
    }

    /**
     * Method that triggers the unloading of the island, which removes all the event handlers from the
     * islands DOM element, removes the HTML and triggers a given unload callback.
     */
    public unload(): void {
        // remove all event listeners on the island container
        Object.keys(this._delegationFuncs).forEach((funcName: TRIslandDelegationFuncsKey) => {
            this._config.$element.removeEventListener(
                funcName.split(/:/g)[0]
                , this._delegationFuncs[funcName].func
                , { capture: this._delegationFuncs[funcName].capture }
            );
        });

        // delete all the content in the island container.
        this._config.$element.innerHTML = '';

        this._config.unload(klona(this._state));
    }

    /**
     * Sets the inner state of the island.
     * 
     * @param nextState the state (an object, function, Array or Promise)
     */
    private _setState(nextState: TRIslandSetState<IState>): void {
        const tmpState = typeof nextState === 'function'
            // we have to work with a clone here, otherwise it would be possible to brutally mutate the state.
            ? nextState(klona(this._state))
            : nextState
        ;

        // the option to return null gives the ability to prevent the diffing, state update and rerendering.
        if (tmpState === null) {
            return;
        }

        // in case of a Promise, the resolved state will be used to invoke this method again.
        if (tmpState instanceof Promise) {
            tmpState.then((thenState: TRIslandSetState<IState>) => this._setState(thenState));

            return;
        }

        // in case of an array all single items will be used to invoke this method again.
        if (Array.isArray(tmpState)) {
            tmpState.forEach((eachState: TRIslandSetState<IState>) => this._setState(eachState));

            return;
        }

        const tmpMergedState: IState = (
            'customMerge' in this._config.deepmerge
                // if a custom merging algorithm is provided, it is possible to manipulate the state directly
                // this is why a clone is used here.
                ? deepmerge(klona(this._state), tmpState as Partial<IState>, this._config.deepmerge)
                : deepmerge(this._state, tmpState as Partial<IState>, this._config.deepmerge)
        );

        const shouldUpdate = (
            this._config.shouldUpdate === this._initialConfig.shouldUpdate
                ? this._config.shouldUpdate(this._state, tmpMergedState, equal)
                // we have to work with two clones here, otherwise it would be possible to brutally mutate the states.
                : this._config.shouldUpdate(
                    klona(this._state)
                    , (
                        'customMerge' in this._config.deepmerge
                            // if a custom merging algorithm is provided, tmpMergedState already contains a clone of
                            // the state we prevent a redundant cloning here.
                            ? tmpMergedState
                            : klona(tmpMergedState)
                    )
                    , equal
                )
        );

        this._state = tmpMergedState;

        if (shouldUpdate === true) {
            this._throttledRender();
        }
    }

    /**
     * Renders the template based on the inner state and then morphs the changes into the DOM.
     */
    private _render(): void {
        const checkedTemplate = this._checkTemplate(
            // trimming is important here, because otherwise the whitespace will later be parsed as text nodes
            this._compiledTemplate(this._state, this._config.squirrelly as SqrlConfig).trim()
        );

        // in case of warnings, they are printed to the console
        if (this._warnings.length > 0) {
            /* eslint-disable no-console */
            console.warn(this._compiledConsole(
                {
                    messages: this._warnings
                    , type: 'Warnings'
                }
                , this._internalSqrlConfig
            ));
            /* eslint-enable no-console */
            this._warnings = [];
        }

        // in case of errors, they are printed to the console and to the frontend, so the users know exactly, what
        // to do.
        if (this._errors.length > 0) {
            this._config.$element.innerHTML = this._compiledError(
                { errors: this._errors }
                , this._internalSqrlConfig
            );
            /* eslint-disable no-console */
            console.error(this._compiledConsole(
                {
                    messages: this._errors
                    , type: 'Errors'
                }
                , this._internalSqrlConfig
            ));
            /* eslint-enable no-console */
            this._errors = [];
            this._config.error();

            return;
        }

        // morphdom replaces the element itself, this is why we have to add a fake element on the first call and
        // then use firstChild.
        if (
            this._loaded === false
            || this._config.$element.children.length !== 1
        ) {
            this._config.$element.innerHTML = this._empty;
        }

        // There is a rare edgecase (tested in the Jest tests): The system is loading the first time and the compiled
        // template result is exactly the same as the default empty content inside of $element. This will lead to the
        // load config callback never being fired, because morphdom is actually doing nothing.
        if (
            this._loaded === false
            && this._config.$element.innerHTML === checkedTemplate
        ) {
            this._throttledLoadOrUpdate();

            return;
        }

        morphdom(
            this._config.$element.firstChild
            , checkedTemplate
            , {
                ...this._config.morphdom
                , onBeforeElUpdated: ($fromEl: HTMLElement, $toEl: HTMLElement) => {
                    if ('onBeforeElUpdated' in this._config.morphdom) {
                        if (this._config.morphdom.onBeforeElUpdated($fromEl, $toEl) === false) {
                            return false;
                        }
                    }

                    // speed up morphdom significantly.
                    // see https://www.npmjs.com/package/morphdom#can-i-make-morphdom-blaze-through-the-dom-tree-even-faster-yes
                    return !$fromEl.isEqualNode($toEl);
                }
                // because morphdom keeps firing the following events for each element, which gets updated, added or
                // discarded, we wait until everything is done or at least limit firing to every request animation
                // frame, by throttling it. Actually it would be nice, if morphdom would offer something like a
                // "finished" event.
                , onElUpdated: ($element: HTMLElement) => {
                    this._throttledLoadOrUpdate();

                    if ('onElUpdated' in this._config.morphdom) {
                        this._config.morphdom.onElUpdated($element);
                    }
                }
                , onNodeAdded: (node: Node) => {
                    this._throttledLoadOrUpdate();

                    if ('onNodeAdded' in this._config.morphdom) {
                        return this._config.morphdom.onNodeAdded(node);
                    }

                    return node;
                }
                , onNodeDiscarded: (node: Node) => {
                    this._throttledLoadOrUpdate();

                    if ('onNodeDiscarded' in this._config.morphdom) {
                        return this._config.morphdom.onNodeDiscarded(node);
                    }

                    return node;
                }
            }
        );
    }

    /**
     * Checks whether the templates root level consists of a single element. Otherwise shows a nice descriptive
     * error message in the frontend.
     * 
     * @param template the parsed template content
     * @returns the original template or the default empty HTML
     */
    private _checkTemplate(template: string): string {
        const $tmp = document.createElement('div');
        $tmp.innerHTML = template;

        // if the root level of the template contains more than one Element/text node 
        if ($tmp.childNodes.length > 1) {
            this._errors = this._errors.concat(
                'ERR002: the root level of your template MUST NOT contain more than one tag. Consider using a single '
                + 'div tag as a wrapper around your template.'
            );

            return this._empty;
        }

        // if the root level of the template contains no Element
        if ($tmp.children.length === 0) {
            // if the root level of the template contains a single text node
            if ($tmp.childNodes.length > 0) {
                this._errors = this._errors.concat(
                    'ERR003: the root level of your template MUST NOT contain a single text node. Consider using a '
                    + 'single div tag as a wrapper around your template.'
                );

                return this._empty;
            } else {
                return this._empty;
            }
        }

        return template;
    }

    /**
     * Tries to determine, whether the template is already a given string or a script tag element.
     * 
     * @param template the template as a string or a script tag element
     * @returns the template
     */
    private _getTemplate(template: string | HTMLScriptElement): string {
        if (typeof template === 'string') {
            return template;
        }

        // script tag
        if (template instanceof HTMLScriptElement) {
            return template.innerHTML;
        }

        this._errors = this._errors.concat('ERR004: template must be a string or a script tag element.');
        return '';
    }

    /**
     * Tries to determine, whether a given eventName contains throttling/debouncing information. The syntax is:
     * 
     * eventName[.throttled[.ms]]
     * eventName[.debounced[.ms]]
     * 
     * The eventName is a valid event name like "click" or "mouseover".
     * "throttled" or "debounced" is the optional literal keyword.
     * ms are the optional milliseconds of throttling/debouncing.
     * 
     * Examples:
     * 
     * mousemove
     * mousemove.throttled
     * mousemove.throttled.250
     * keyup.debounced
     * keyup.debounced.1000
     * 
     * If no ms value is given the throttling/debouncing will be done with the request animation frame.
     * 
     * @param eventName event name with optional throttling/debouncing information
     * @returns parsed throttling/debouncing object
     */
    private _getThrottling(combinedEventName: string): IRIslandThrottling {
        const chunks = combinedEventName.split(/\./g) as (
            [TRIslandEventNames]
            | [TRIslandEventNames, 'throttled' | 'debounced']
            | [TRIslandEventNames, 'throttled' | 'debounced', `${number}`]
        );
        const eventName = chunks[0];
        // default: not throttled/debounced.
        const dflt = { debounced: false, eventName, throttled: false };

        if (chunks.length > 1 && ['throttled', 'debounced'].indexOf(chunks[1]) !== -1) {
            // if it is throttled/debounced with milliseconds.
            if (chunks.length === 3) {
                const ms = parseInt(chunks[2], 10);

                if (!isNaN(ms)) {
                    return { ...dflt, ms, [chunks[1]]: true };
                } else {
                    this._warnings = this._warnings.concat(
                        `WARN003: event name "${
                            combinedEventName
                        }" is malformed. The milliseconds "${
                            chunks[2]
                        }" are not a valid number. falling back to request animation frame.`
                    );
				}
            }

            // if it is only throttled/debounced.
            return { ...dflt, [chunks[1]]: true };
        }

        // return default.
        return dflt;
    }

    /**
     * Invokes the load or update callbacks.
     */
    private _loadOrUpdate(): void {
        const state = klona(this._state);

        if (this._loaded === false) {
            this._loaded = true;
            this._config.load(state, this._setState.bind(this));
        } else {
            this._config.update(state, this._setState.bind(this));
        }
    }
}

export type TRIslandEventNames = keyof GlobalEventHandlersEventMap | 'loadend' | 'unload';

export type TRIslandEventNamesThrottled = (
    TRIslandEventNames
    | `${TRIslandEventNames}.debounced`
    | `${TRIslandEventNames}.debounced.${number}`
    | `${TRIslandEventNames}.throttled`
    | `${TRIslandEventNames}.throttled.${number}`
);

// Typescript is not capable of recursions in template literal types and unions become too complex.
// This is why we unfortunately have to use this loose typing here for comma separated events.
// See https://github.com/microsoft/TypeScript/issues/44792
export type TRIslandEventNamesCommaSeparated = `${string},${string}`;

export interface IRIslandConfig<IState extends Record<string, any>> {
    $element: Element;
    deepmerge: deepmerge.Options;
    delegations: Partial<Record<
        TRIslandEventNamesThrottled | TRIslandEventNamesCommaSeparated
        , Record<string, (
            event: Event
            , $closest: Element
            , state: Readonly<IState>
            , setState: RIsland<IState>['_setState']
        ) => void>
    >>;
    error: () => void;
    filters: Record<string, Parameters<typeof Sqrl['filters']['define']>[1]>;
    helpers: Record<string, Parameters<typeof Sqrl['helpers']['define']>[1]>;
    initialState: IState;
    load: (state: Readonly<IState>, setState: RIsland<IState>['_setState']) => void;
    morphdom: Parameters<typeof morphdom>[2];
    nativeHelpers: Record<string, Parameters<typeof Sqrl['nativeHelpers']['define']>[1]>;
    nonBubblingEvents: Array<TRIslandEventNames>;
    partials: Record<string, string | HTMLScriptElement>;
    shouldUpdate: (state: Readonly<IState>, nextState: Readonly<IState>, deepEqual: typeof equal) => boolean;
    squirrelly: Partial<SqrlConfig>;
    template: string | HTMLScriptElement;
    unload: (state: Readonly<IState>) => void;
    update: (state: Readonly<IState>, setState: RIsland<IState>['_setState']) => void;
}

export type TRIslandSetState<IState extends Record<string, any>> = (
    Partial<IState>
    | null
    | Promise<TRIslandSetState<IState>>
    | ((state: IState) => TRIslandSetState<IState>)
    | Array<TRIslandSetState<IState>>
);

export interface IRIslandThrottling {
    debounced: boolean;
    eventName: TRIslandEventNames;
    ms?: number;
    throttled: boolean;
}

export type TRIslandDelegationFuncsKey = `${TRIslandEventNamesThrottled}:${number}`;
