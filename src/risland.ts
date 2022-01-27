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
        delegations: {}
        , $element: document.body
        , initialState: {} as IState
        , load: () => {}
        , morphdom: {
            // speed up morphdom significantly
            // see https://www.npmjs.com/package/morphdom#can-i-make-morphdom-blaze-through-the-dom-tree-even-faster-yes
            onBeforeElUpdated: ($fromEl: HTMLElement, $toEl: HTMLElement) => !$fromEl.isEqualNode($toEl)
        }
        , shouldUpdate: (state: IState, nextState: IState) => !equal(state, nextState)
        , squirrelly: Sqrl.defaultConfig
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
        this._config = deepmerge(this._initialConfig, config, { isMergeableObject: isPlainObject });
        this._compiledTemplate = Sqrl.compile(this._config.template, this._config.squirrelly);
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
        Object.keys(this._config.delegations).forEach((eventName: string) => {
            this._config.$element.removeEventListener(eventName, this._delegationFuncs[eventName]);
        });
        this._config.unload();
    }

    private _setState(nextState: Partial<IState> | ((state: IState) => Partial<IState>)): void {
        const tmpState: IState = deepmerge(
            this._state
            , typeof nextState === 'function' ? nextState(this._state) : nextState
            , { isMergeableObject: isPlainObject }
        );
        const shouldUpdate = this._config.shouldUpdate(this._state, tmpState);

        this._state = tmpState;

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
}

export interface IRIslandConfig<IState extends Record<string, any> = {}> {
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
