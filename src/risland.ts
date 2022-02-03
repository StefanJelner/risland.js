import cloneDeep from 'clone-deep';
import deepmerge from 'deepmerge';
import equal from 'fast-deep-equal';
import { isPlainObject } from 'is-plain-object';
import morphdom from 'morphdom';
import rafThrottle from 'raf-throttle';
import * as Sqrl from 'squirrelly';
import { TemplateFunction } from 'squirrelly/dist/types/compile';
import { SqrlConfig } from 'squirrelly/dist/types/config';
import { throttle } from 'throttle-debounce';

/**
 * # RIsland
 * 
 * A simple, lightweight approach for providing reactive islands on websites.
 * 
 * See the README.md file for further documentation.
 */
export default class RIsland<IState extends Record<string, any>> {
    private _initialConfig: IRIslandConfig<IState> = {
        $element: document.body
        , deepmerge: {
            isMergeableObject: isPlainObject
        }
        , delegations: {}
        , initialState: {} as IState
        , load: () => {}
        , morphdom: {
            // speed up morphdom significantly.
            // see https://www.npmjs.com/package/morphdom#can-i-make-morphdom-blaze-through-the-dom-tree-even-faster-yes
            onBeforeElUpdated: ($fromEl: HTMLElement, $toEl: HTMLElement) => !$fromEl.isEqualNode($toEl)
        }
        , shouldUpdate: (state: IState, nextState: IState) => !equal(state, nextState)
        , squirrelly: Sqrl.defaultConfig
        , template: ''
        , unload: () => {}
        , update: () => {}
    };

    // IMPORTANT! these are crucial settings which are necessary for RIsland to operate the way it is intended
    // to. These settings cannot be overridden by the user.
    private _enforcedConfig: Partial<IRIslandConfig<IState>> = {
        deepmerge: {
            // we use cloneDeep for this task.
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

    private _config: IRIslandConfig<IState>;
    private _compiledTemplate: TemplateFunction;
    private _delegationFuncs: Partial<Record<keyof GlobalEventHandlersEventMap, (event: Event) => void>> = {};
    private _loaded: boolean = false;
    private _state: IState;
    private _throttledRender: RIsland<IState>['_render'] = rafThrottle(this._render);

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
                , cloneDeep(config)
                // finally add the enforced config values.
                , this._enforcedConfig
            ]
            // for the initial merging we have to use the initial config and the enforced one.
            , {
                ...this._initialConfig.deepmerge
                , ...this._enforcedConfig.deepmerge
            }
        );
        this._compiledTemplate = Sqrl.compile(this._getTemplate(this._config.template), this._config.squirrelly);
        this._setState(this._config.initialState);

        (Object.keys(this._config.delegations) as Array<keyof GlobalEventHandlersEventMap>).forEach((
            eventName: keyof GlobalEventHandlersEventMap
        ) => {
            this._delegationFuncs[eventName] = (event: Event) => {
                Object.keys(this._config.delegations[eventName]).forEach((selector: string) => {
                    if (
                        event.target instanceof HTMLElement
                        && event.target.closest(selector) !== null
                    ) {
                        this._config.delegations[eventName][selector](
                            event
                            , cloneDeep(this._state)
                            , this._setState.bind(this)
                        );
                    }
                });
            };

            // add throttling, if necessary.
            const throttling = this._getThrottling(eventName);

            if (throttling.throttled === true) {
                if ('ms' in throttling) {
                    // conventional throttling.
                    this._delegationFuncs[eventName] = throttle(throttling.ms, this._delegationFuncs[eventName]);
                } else {
                    // throttling by request animation frame.
                    this._delegationFuncs[eventName] = rafThrottle(this._delegationFuncs[eventName]);
                }
            }

            this._config.$element.addEventListener(throttling.eventName, this._delegationFuncs[eventName]);
        });
    }

    /**
     * Method that triggers the unloading of the island, which removes all the event handlers from the
     * islands DOM element, removes the HTML and triggers a given unload callback.
     */
    public unload(): void {
        // remove all event listeners on the island container
        Object.keys(this._config.delegations).forEach((eventName: string) => {
            this._config.$element.removeEventListener(eventName, this._delegationFuncs[eventName]);
        });

        // delete all the content in the island container.
        this._config.$element.innerHTML = '';

        this._config.unload(cloneDeep(this._state));
    }

    /**
     * Sets the inner state of the island.
     * 
     * @param nextState the state (an object, function, Array or Promise)
     */
    private _setState(nextState: TRIslandSetState<IState>): void {
        const tmpState = typeof nextState === 'function'
            // we have to work with a clone here, otherwise it would be possible to brutally mutate the state.
            ? nextState(cloneDeep(this._state))
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
                ? deepmerge(cloneDeep(this._state), tmpState as Partial<IState>, this._config.deepmerge)
                : deepmerge(this._state, tmpState as Partial<IState>, this._config.deepmerge)
        );

        const shouldUpdate = (
            this._config.shouldUpdate === this._initialConfig.shouldUpdate
                ? this._config.shouldUpdate(this._state, tmpMergedState)
                // we have to work with two clones here, otherwise it would be possible to brutally mutate the states.
                : this._config.shouldUpdate(
                    cloneDeep(this._state)
                    , (
                        'customMerge' in this._config.deepmerge
                            // if a custom merging algorithm is provided, tmpMergedState already contains a clone of
                            // the state we prevent a redundant cloning here.
                            ? tmpMergedState
                            : cloneDeep(tmpMergedState)
                    )
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
        // morphdom replaces the element itself, this is why we have to add a fake element on the first call and
        // then use firstChild.
        if (this._config.$element.firstChild === null) {
            this._config.$element.appendChild(document.createElement('div'));
        }

        morphdom(
            this._config.$element.firstChild
            , this._compiledTemplate(this._state, this._config.squirrelly as SqrlConfig)
            , {
                ...this._config.morphdom
                , onElUpdated: ($element: HTMLElement) => {
                    const state = cloneDeep(this._state);

                    if (this._loaded === false) {
                        this._loaded = true;
                        this._config.load(state, this._setState.bind(this));
                    } else {
                        this._config.update(state, this._setState.bind(this));
                    }

                    if ('onElUpdated' in this._config.morphdom) {
                        this._config.morphdom.onElUpdated($element);
                    }
                }
            }
        );
    }

    /**
     * Tries to determine, whether the template is already a given string or a DOM element which is a tag element.
     * If it is a tag element, the content will be read, stringified and HTML decoded.
     * 
     * @param template the template as a string or a tag element
     * @returns the template
     */
    private _getTemplate(template: string | HTMLTemplateElement): string {
        if (typeof template === 'string') {
            return template;
        }

        // template tag
        if (
            typeof template === 'object'
            && 'content' in template
            && template.content instanceof DocumentFragment
        ) {
            // putting the content of the template tag into a textarea to do a simple html decode.
            const $textarea = document.createElement('textarea');
            // making a string out of the content of the template tag.
            $textarea.innerHTML = Array.from(
                template.content.childNodes
            ).map((childNode: Element) => childNode.outerHTML).join('');
            return $textarea.value;
        }

        // otherwise show a nice error message.
        /* eslint-disable no-console */
		console.error('RIsland: template must be a string or a template tag element.');
        /* eslint-enable no-console */
        return '<p style="color:red;">RIsland: template must be a string or a template tag element.</p>';
    }

    /**
     * Tries to determine, whether a given eventName contains throttling information. The syntax is:
     * 
     * eventName[.throttled[.ms]]
     * 
     * The eventName is a valid event name like "click" or "mouseover".
     * "throttled" is the optional literal keyword.
     * ms are the optional milliseconds of throttling.
     * 
     * Examples:
     * 
     * mousemove
     * mousemove.throttled
     * mousemove.throttled.250
     * 
     * If no ms value is given the throttling will be done with the request animation frame.
     * 
     * @param eventName event name with optional throttling information
     * @returns parsed throttling object
     */
    private _getThrottling(combinedEventName: string): IRIslandThrottling {
        const chunks = combinedEventName.split(/\./g) as (
            [keyof GlobalEventHandlersEventMap]
            | [keyof GlobalEventHandlersEventMap, 'throttled']
            | [keyof GlobalEventHandlersEventMap, 'throttled', `${number}`]
        );
        const eventName = chunks[0];

        if (chunks.length > 1 && chunks[1] === 'throttled') {
            // if it is throttled with milliseconds.
            if (chunks.length === 3) {
                const ms = parseInt(chunks[2], 10);

                if (!isNaN(ms)) {
                    return { eventName, ms, throttled: true };
                } else {
                    /* eslint-disable no-console */
					console.warn(`RIsland: event name "${
						combinedEventName
					}" is malformed. The milliseconds "${
						chunks[2]
					}" are not a valid number. falling back to request animation frame.`);
                    /* eslint-enable no-console */
				}
            }

            // if it is only throttled.
            return { eventName, throttled: true };
        }

        // if it is not throttled.
        return { eventName, throttled: false };
    }
}

export interface IRIslandConfig<IState extends Record<string, any>> {
    $element: HTMLElement;
    deepmerge: deepmerge.Options;
    delegations: Partial<Record<
        (
            keyof GlobalEventHandlersEventMap
            | `${keyof GlobalEventHandlersEventMap}.throttled`
            | `${keyof GlobalEventHandlersEventMap}.throttled.${number}`
        )
        , Record<string, (event: Event, state: IState, setState: RIsland<IState>['_setState']) => void>
    >>;
    initialState: IState;
    load: (state: IState, setState: RIsland<IState>['_setState']) => void;
    morphdom: Parameters<typeof morphdom>[2];
    shouldUpdate: (state: IState, nextState: IState) => boolean;
    squirrelly: Partial<SqrlConfig>;
    template: string;
    unload: (state: IState) => void;
    update: (state: IState, setState: RIsland<IState>['_setState']) => void;
}

export type TRIslandSetState<IState extends Record<string, any>> = (
    Partial<IState>
    | null
    | Promise<Partial<IState> | null>
    | ((state: IState) => TRIslandSetState<IState>)
    | Array<TRIslandSetState<IState>>
);

export interface IRIslandThrottling {
    eventName: keyof GlobalEventHandlersEventMap;
    ms?: number;
    throttled: boolean;
}
