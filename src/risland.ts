import cloneDeep from 'clone-deep';
import deepmerge from 'deepmerge';
import equal from 'fast-deep-equal';
import { isPlainObject } from 'is-plain-object';
import morphdom from 'morphdom';
import throttle from 'raf-throttle';
import * as Sqrl from 'squirrelly';
import { SqrlConfig } from 'squirrelly/dist/types/config';
import { TemplateFunction } from 'squirrelly/dist/types/compile';

export default class RIsland<IState extends Record<string, any> = {}> {
    private _initialConfig: IRIslandConfig<IState> = {
        deepmerge: {
            // we use cloneDeep for this task
            clone: false
            , isMergeableObject: isPlainObject
        }
        , delegations: {}
        , $element: document.body
        , initialState: {} as IState
        , load: () => {}
        , morphdom: {
            // speed up morphdom significantly
            // see https://www.npmjs.com/package/morphdom#can-i-make-morphdom-blaze-through-the-dom-tree-even-faster-yes
            onBeforeElUpdated: ($fromEl: HTMLElement, $toEl: HTMLElement) => !$fromEl.isEqualNode($toEl)
        }
        , shouldUpdate: (state: IState, nextState: IState) => !equal(state, nextState)
        , squirrelly: {
            ...Sqrl.defaultConfig
            , varName: 'state'
        }
        , template: ''
        , unload: () => {}
        , update: () => {}
    };

    private _config: IRIslandConfig<IState>;
    private _compiledTemplate: TemplateFunction;
    private _delegationFuncs: Partial<Record<keyof GlobalEventHandlersEventMap, (event: Event) => void>> = {};
    private _loaded: boolean = false;
    private _state: IState;
    private _throttledRender: RIsland<IState>['_render'] = throttle(this._render);

    constructor(config: Partial<IRIslandConfig<IState>>) {
        this._config = deepmerge(
            this._initialConfig
            // clone the config, otherwise it could be mutated later
            , cloneDeep(config)
            // for the initial merging we have to use the initial config
            , this._initialConfig.deepmerge
        );
        this._compiledTemplate = Sqrl.compile(this._getTemplate(this._config.template), this._config.squirrelly);
        this._setState(this._config.initialState);

        (Object.keys(this._config.delegations) as Array<keyof GlobalEventHandlersEventMap>).forEach((
            eventName: keyof GlobalEventHandlersEventMap
        ) => {
            this._delegationFuncs[eventName] = (event: Event) => {
                Object.keys(this._config.delegations[eventName]).forEach((selector) => {
                    if (
                        event.target instanceof HTMLElement
                        && event.target.closest(selector) !== null
                    ) {
                        this._config.delegations[eventName][selector](event, this._setState.bind(this));
                    }
                });
            };

            this._config.$element.addEventListener(eventName, this._delegationFuncs[eventName]);
        });
    }

    public unload(): void {
        // remove all event listeners on the island container
        Object.keys(this._config.delegations).forEach((eventName: string) => {
            this._config.$element.removeEventListener(eventName, this._delegationFuncs[eventName]);
        });

        // delete all the content in the island container
        this._config.$element.innerHTML = '';

        this._config.unload();
    }

    private _setState(nextState: TRIslandSetState<IState>): void {
        const tmpState = typeof nextState === 'function'
            // we have to work with a clone here, otherwise it would be possible to brutally mutate the state
            ? nextState(cloneDeep(this._state))
            : nextState
        ;

        // the option to return null gives the ability to prevent the diffing, state update and rerendering
        if (tmpState === null) {
            return;
        }

        // in case of a Promise, the resolved state will be used to invoke this method again
        if (tmpState instanceof Promise) {
            tmpState.then((thenState: TRIslandSetState<IState>) => this._setState(thenState));

            return;
        }

        // in case of an array all single items will be used to invoke this method again
        if (Array.isArray(tmpState)) {
            tmpState.forEach((eachState: TRIslandSetState<IState>) => this._setState(eachState));

            return;
        }

        const tmpMergedState: IState = (
            'customMerge' in this._config.deepmerge
                // if a custom merging algorithm is provided, it is possible to manipulate the state directly
                // this is why a clone is used here
                ? deepmerge(cloneDeep(this._state), tmpState as Partial<IState>, this._config.deepmerge)
                : deepmerge(this._state, tmpState as Partial<IState>, this._config.deepmerge)
        );

        const shouldUpdate = (
            this._config.shouldUpdate === this._initialConfig.shouldUpdate
                ? this._config.shouldUpdate(this._state, tmpMergedState)
                // we have to work with two clones here, otherwise it would be possible to brutally mutate the states
                : this._config.shouldUpdate(
                    cloneDeep(this._state)
                    , (
                        'customMerge' in this._config.deepmerge
                            // if a custom merging algorithm is provided, tmpMergedState already contains a clone of the state
                            // we prevent a redundant cloning here
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

    private _render(): void {
        // morphdom replaces the element itself, this is why we have to add a fake element on the first call and
        // then use firstChild
        if (this._config.$element.firstChild === null) {
            this._config.$element.appendChild(document.createElement('div'));
        }

        morphdom(
            this._config.$element.firstChild
            , this._compiledTemplate(this._state, this._config.squirrelly)
            , {
                ...this._config.morphdom
                , onElUpdated: ($element: HTMLElement) => {
                    if (this._loaded === false) {
                        this._loaded = true;
                        this._config.load(this._setState.bind(this));
                    } else {
                        this._config.update(this._setState.bind(this));
                    }

                    if ('onElUpdated' in this._config.morphdom) {
                        this._config.morphdom.onElUpdated($element);
                    }
                }
            }
        );
    }

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
            // putting the content of the template tag into a textarea to do a simple html decode
            const $textarea = document.createElement('textarea');
            // making a string out of the content of the template tag
            $textarea.innerHTML = Array.from(template.content.childNodes).map((childNode: Element) => childNode.outerHTML).join('');
            return $textarea.value;
        }

        // otherwise show a nice error message
        return '<p style="color:red;">Error: template must be a string or a template tag element.</p>';
    }
}

export interface IRIslandConfig<IState extends Record<string, any> = {}> {
    deepmerge: deepmerge.Options;
    delegations: Partial<Record<
        keyof GlobalEventHandlersEventMap
        , Record<string, (event: Event, setState: RIsland<IState>['_setState']) => void>
    >>;
    $element: HTMLElement;
    initialState: IState;
    load: (setState: RIsland<IState>['_setState']) => void;
    morphdom: Parameters<typeof morphdom>[2];
    shouldUpdate: (state: IState, nextState: IState) => boolean;
    squirrelly: SqrlConfig;
    template: string;
    unload: () => void;
    update: (setState: RIsland<IState>['_setState']) => void;
}

export type TRIslandSetState<IState> = (
    Partial<IState>
    | null
    | Promise<Partial<IState> | null>
    | ((state: IState) => TRIslandSetState<IState>)
    | Array<TRIslandSetState<IState>>
);
