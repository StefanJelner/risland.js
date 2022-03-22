import RIsland from './risland';
import * as Sqrl from 'squirrelly';

function setDocument(html: string): void {
    document.getElementsByTagName('html')[0].innerHTML = html;
}

function getDefaultDocument(additional: string = ''): string {
    return `<head><meta charset="utf-8"/></head><body><div id="island"></div>${additional}</body>`;
}

describe('RIsland', () => {
    beforeEach(() => {
        // hide all the errors and warnings and save them for testing
        console.warn = jest.fn();
        console.error = jest.fn();
    });

    it(
        'should show an error in the frontend and in the console if initialized with an initialState which is not '
        + 'an object'
        , done => {
            setDocument(getDefaultDocument());

            new RIsland<{}>({
                $element: document.getElementById('island')
                , initialState: []
                , error: () => {
                    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('ERR001'));

                    done();
                }
                , template: '<div></div>'
            });
        }
    );

    it(
        'should show an error in the frontend and in the console if initialized with an initialState which is null'
        , done => {
            setDocument(getDefaultDocument());

            new RIsland<{}>({
                $element: document.getElementById('island')
                , initialState: null
                , error: () => {
                    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('ERR001'));

                    done();
                }
                , template: '<div></div>'
            });
        }
    );

    it('should show a warning in the console if there is a duplicate event name in a comma spearated list', done => {
        setDocument(getDefaultDocument());

        new RIsland<{}>({
            $element: document.getElementById('island')
            , delegations: {
                'mouseover, mouseout, mouseover': {
                    '.foo': () => {}
                }
            }
            , initialState: {}
            , load: () => {
                expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('WARN001'));

                done();
            }
            , template: '<div></div>'
        });
    });

    it('should show a warning in the console if a throttled event name has malformed milliseconds', done => {
        setDocument(getDefaultDocument());

        new RIsland<{}>({
            $element: document.getElementById('island')
            , delegations: {
                // we have to use any here, because we provoke a warning. in a Typescript context should should
                // not be possible at all.
                ['mousemove.throttled.foo' as any]: {
                    '.foo': () => {}
                }
            }
            , initialState: {}
            , load: () => {
                expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('WARN003'));

                done();
            }
            , template: '<div></div>'
        });
    });

    it('should show a warning in the console if a debounced event name has malformed milliseconds', done => {
        setDocument(getDefaultDocument());

        new RIsland<{}>({
            $element: document.getElementById('island')
            , delegations: {
                // we have to use any here, because we provoke a warning. in a Typescript context should should
                // not be possible at all.
                ['mousemove.debounced.foo' as any]: {
                    '.foo': () => {}
                }
            }
            , initialState: {}
            , load: () => {
                expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('WARN003'));

                done();
            }
            , template: '<div></div>'
        });
    });

    it('should show a warning in the console if initialized with an empty initialState', done => {
        setDocument(getDefaultDocument());

        new RIsland<{}>({
            $element: document.getElementById('island')
            , initialState: {}
            , load: () => {
                expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('WARN002'));

                done();
            }
            , template: '<div></div>'
        });
    });

    it(
        'should show an error in the frontend and the console if initialized with a template containing more than '
        + 'one element on the root level'
        , done => {
            setDocument(getDefaultDocument());
            const $island = document.getElementById('island');

            new RIsland<{}>({
                $element: $island
                , error: () => {
                    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('ERR002'));
                    expect($island.innerHTML).toMatch('ERR002');

                    done();
                }
                // we have to cast to any here, because we intentionally provide the wrong element type
                , template: '<div></div><div></div>'
            });
        }
    );

    it(
        'should show an error in the frontend and the console if initialized with a template only containing a text '
        + 'node on the root level'
        , done => {
            setDocument(getDefaultDocument());
            const $island = document.getElementById('island');

            new RIsland<{}>({
                $element: $island
                , error: () => {
                    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('ERR003'));
                    expect($island.innerHTML).toMatch('ERR003');

                    done();
                }
                // we have to cast to any here, because we intentionally provide the wrong element type
                , template: 'Test'
            });
        }
    );

    it('should show an error in the frontend and the console if initialized with the wrong template type', done => {
        setDocument(getDefaultDocument('<template id="squirrelly"></template>'));
        const $island = document.getElementById('island');

        new RIsland<{}>({
            $element: $island
            , error: () => {
                expect(console.error).toHaveBeenCalledWith(expect.stringContaining('ERR004'));
                expect($island.innerHTML).toMatch('ERR004');

                done();
            }
            // we have to cast to any here, because we intentionally provide the wrong element type
            , template: document.getElementById('squirrelly') as any
        });
    });

    it(
        'should have the right state and show the right content if initialized with a script tag and an initial state'
        , done => {
            setDocument(getDefaultDocument(
                '<script type="text/html" id="squirrelly"><div>{{state.foo}}</div></script>'
            ));
            const $island = document.getElementById('island');

            new RIsland<{ foo: number; }>({
                $element: $island
                , initialState: { foo: 1 }
                , load: state => {
                    expect(state.foo).toBe(1);
                    expect($island.innerHTML).toBe('<div>1</div>');

                    done();
                }
                , template: document.getElementById('squirrelly') as HTMLScriptElement
            });
        }
    );

    it(
        'should have the right state and show the right content if setState() is called with a plain object'
        , done => {
            setDocument(getDefaultDocument(
                '<script type="text/html" id="squirrelly"><div>{{state.foo}}</div></script>'
            ));
            const $island = document.getElementById('island');

            new RIsland<{ foo: number; }>({
                $element: $island
                , initialState: { foo: 1 }
                , load: (_, setState) => {
                    setState({ foo: 2 });
                }
                , template: document.getElementById('squirrelly') as HTMLScriptElement
                , update: (state) => {
                    expect(state.foo).toBe(2);
                    expect($island.innerHTML).toBe('<div>2</div>');

                    done();
                }
            });
        }
    );

    it(
        'should have the right state and show the right content if setState() is called with a function'
        , done => {
            setDocument(getDefaultDocument(
                '<script type="text/html" id="squirrelly"><div>{{state.foo}}</div></script>'
            ));
            const $island = document.getElementById('island');

            new RIsland<{ foo: number; }>({
                $element: $island
                , initialState: { foo: 1 }
                , load: (_, setState) => {
                    setState(state => ({ foo: state.foo + 1 }));
                }
                , template: document.getElementById('squirrelly') as HTMLScriptElement
                , update: (state) => {
                    expect(state.foo).toBe(2);
                    expect($island.innerHTML).toBe('<div>2</div>');

                    done();
                }
            });
        }
    );

    it(
        'should have the right state and show the right content if setState() is called with a Promise'
        , done => {
            setDocument(getDefaultDocument(
                '<script type="text/html" id="squirrelly"><div>{{state.foo}}</div></script>'
            ));
            const $island = document.getElementById('island');

            new RIsland<{ foo: number; }>({
                $element: $island
                , initialState: { foo: 1 }
                , load: (_, setState) => {
                    setState(new Promise(resolve => resolve({ foo: 2 })));
                }
                , template: document.getElementById('squirrelly') as HTMLScriptElement
                , update: (state) => {
                    expect(state.foo).toBe(2);
                    expect($island.innerHTML).toBe('<div>2</div>');

                    done();
                }
            });
        }
    );

    it(
        'should have the right state and show the right content if setState() is called with an Array'
        , done => {
            setDocument(getDefaultDocument(
                '<script type="text/html" id="squirrelly"><div>{{state.foo}}</div></script>'
            ));
            const $island = document.getElementById('island');

            new RIsland<{ foo: number; }>({
                $element: $island
                , initialState: { foo: 1 }
                , load: (_, setState) => {
                    setState([
                        { foo: 2 }
                        , { foo: 3 }
                        , { foo: 4 }
                    ]);
                }
                , template: document.getElementById('squirrelly') as HTMLScriptElement
                , update: (state) => {
                    expect(state.foo).toBe(4);
                    expect($island.innerHTML).toBe('<div>4</div>');

                    done();
                }
            });
        }
    );

    it(
        'should have the right state and show the right content if setState() is called with null'
        , done => {
            setDocument(getDefaultDocument(
                '<script type="text/html" id="squirrelly"><div>{{state.foo}}</div></script>'
            ));
            const $island = document.getElementById('island');
            let updated = false;

            new RIsland<{ foo: number; }>({
                $element: $island
                , initialState: { foo: 1 }
                , load: (_, setState) => {
                    setState(null);

                    window.setTimeout(() => {
                        setState(state => {
                            expect(state.foo).toBe(1);
                            expect($island.innerHTML).toBe('<div>1</div>');
                            expect(updated).toBe(false);

                            done();

                            return null;
                        });
                    }, 1000);
                }
                , template: document.getElementById('squirrelly') as HTMLScriptElement
                , update: () => {
                    updated = true;
                }
            });
        }
    );

    it(
        'should have the right state and show the right content after non-throttled event delegation'
        , done => {
            setDocument(getDefaultDocument(
                `<script type="text/html" id="squirrelly">
                    <button type="button">{{state.foo}}</button>
                </script>`
            ));
            const $island = document.getElementById('island');

            new RIsland<{ foo: number; }>({
                $element: $island
                , delegations: {
                    'click': {
                        'button': (_, __, ___, setState) => {
                            setState({ foo: 2 });
                        }
                    }
                }
                , initialState: { foo: 1 }
                , load: () => {
                    $island.firstChild.dispatchEvent(new Event('click', { bubbles: true }));
                }
                , template: document.getElementById('squirrelly') as HTMLScriptElement
                , update: state => {
                    expect(state.foo).toBe(2);
                    expect($island.innerHTML).toBe('<button type="button">2</button>');

                    done();
                }
            });
        }
    );

    it(
        'should have the right state and show the right content after throttled (RAF) event delegation'
        , done => {
            setDocument(getDefaultDocument(
                `<script type="text/html" id="squirrelly">
                    <button type="button">{{state.foo}}</button>
                </script>`
            ));
            const $island = document.getElementById('island');

            new RIsland<{ foo: number; }>({
                $element: $island
                , delegations: {
                    'click.throttled': {
                        'button': (_, __, ___, setState) => {
                            setState({ foo: 2 });
                        }
                    }
                }
                , initialState: { foo: 1 }
                , load: () => {
                    $island.firstChild.dispatchEvent(new Event('click', { bubbles: true }));
                }
                , template: document.getElementById('squirrelly') as HTMLScriptElement
                , update: state => {
                    expect(state.foo).toBe(2);
                    expect($island.innerHTML).toBe('<button type="button">2</button>');

                    done();
                }
            });
        }
    );

    it(
        'should have the right state and show the right content after throttled (1 sec) event delegation'
        , done => {
            setDocument(getDefaultDocument(
                `<script type="text/html" id="squirrelly">
                    <button type="button">{{state.foo}}</button>
                </script>`
            ));
            const $island = document.getElementById('island');

            new RIsland<{ foo: number; }>({
                $element: $island
                , delegations: {
                    'click.throttled.1000': {
                        'button': (_, __, ___, setState) => {
                            setState({ foo: 2 });
                        }
                    }
                }
                , initialState: { foo: 1 }
                , load: () => {
                    $island.firstChild.dispatchEvent(new Event('click', { bubbles: true }));
                }
                , template: document.getElementById('squirrelly') as HTMLScriptElement
                , update: state => {
                    expect(state.foo).toBe(2);
                    expect($island.innerHTML).toBe('<button type="button">2</button>');

                    done();
                }
            });
        }
    );

    it(
        'should have the right state and show the right content after debounced (RAF) event delegation'
        , done => {
            setDocument(getDefaultDocument(
                `<script type="text/html" id="squirrelly">
                    <button type="button">{{state.foo}}</button>
                </script>`
            ));
            const $island = document.getElementById('island');

            new RIsland<{ foo: number; }>({
                $element: $island
                , delegations: {
                    'click.debounced': {
                        'button': (_, __, ___, setState) => {
                            setState({ foo: 2 });
                        }
                    }
                }
                , initialState: { foo: 1 }
                , load: () => {
                    $island.firstChild.dispatchEvent(new Event('click', { bubbles: true }));
                }
                , template: document.getElementById('squirrelly') as HTMLScriptElement
                , update: state => {
                    expect(state.foo).toBe(2);
                    expect($island.innerHTML).toBe('<button type="button">2</button>');

                    done();
                }
            });
        }
    );

    it(
        'should have the right state and show the right content after debounced (1 sec) event delegation'
        , done => {
            setDocument(getDefaultDocument(
                `<script type="text/html" id="squirrelly">
                    <button type="button">{{state.foo}}</button>
                </script>`
            ));
            const $island = document.getElementById('island');

            new RIsland<{ foo: number; }>({
                $element: $island
                , delegations: {
                    'click.debounced.1000': {
                        'button': (_, __, ___, setState) => {
                            setState({ foo: 2 });
                        }
                    }
                }
                , initialState: { foo: 1 }
                , load: () => {
                    $island.firstChild.dispatchEvent(new Event('click', { bubbles: true }));
                }
                , template: document.getElementById('squirrelly') as HTMLScriptElement
                , update: state => {
                    expect(state.foo).toBe(2);
                    expect($island.innerHTML).toBe('<button type="button">2</button>');

                    done();
                }
            });
        }
    );

    it('should show the right content if partials are used', done => {
        setDocument(getDefaultDocument());
        const $island = document.getElementById('island');

        new RIsland<{ foo: number; }>({
            $element: $island
            , initialState: { foo: 1 }
            , load: () => {
                expect($island.innerHTML).toBe('<div><div>1</div></div>');

                done();
            }
            , partials: { bar: '<div>{{partialState.foo}}</div>' }
            , template: '<div>{{@include(\'bar\', { foo: state.foo })/}}</div>'
        });
    });

    it('should show the right content if filters are used', done => {
        setDocument(getDefaultDocument());
        const $island = document.getElementById('island');

        new RIsland<{ foo: number; }>({
            $element: $island
            , filters: { incr: num => num + 1 }
            , initialState: { foo: 1 }
            , load: () => {
                expect($island.innerHTML).toBe('<div>2</div>');

                done();
            }
            , template: '<div>{{state.foo | incr}}</div>'
        });
    });

    it('should show the right content if helpers are used', done => {
        setDocument(getDefaultDocument());
        const $island = document.getElementById('island');

        new RIsland<{ foo: number; }>({
            $element: $island
            , helpers: {
                repeat: content => Array.from({ length: content.params[0] }).map(() => content.exec()).join('')
            }
            , initialState: { foo: 1 }
            , load: () => {
                expect($island.innerHTML).toBe('<div>111</div>');

                done();
            }
            , template: '<div>{{@repeat(3)}}{{state.foo}}{{/repeat}}</div>'
        });
    });

    it('should show the right content if nativeHelpers are used', done => {
        setDocument(getDefaultDocument());
        const $island = document.getElementById('island');

        new RIsland<{ foo: number; }>({
            $element: $island
            , initialState: { foo: 1 }
            , load: () => {
                expect($island.innerHTML).toBe('<div>111</div>');

                done();
            }
            , nativeHelpers: {
                repeat: (buffer, env) => {
                    // DON'T DO THIS AT HOME!!!
                    return `Array.from({length:${buffer.p}}).forEach(function(){${Sqrl.compileScope(buffer.d, env)}});`;
                }
            }
            , template: '<div>{{@repeat(3)}}{{state.foo}}{{/repeat}}</div>'
        });
    });

    it(
        'should remove all event listeners, empty the island element and provide the final state if unload() '
        + 'becomes invoked'
        , done => {
            setDocument(getDefaultDocument());
            const $island = document.getElementById('island');

            const events = {};
            $island.addEventListener = jest.fn((event, callback) => events[event] = callback);
            $island.removeEventListener = jest.fn(event => delete events[event]);

            const island = new RIsland<{ foo: number; }>({
                $element: $island
                , delegations: {
                    'click': {
                        'div': () => {}
                    }
                }
                , initialState: { foo: 1 }
                , load: (_, setState) => {
                    expect(Object.keys(events)).toStrictEqual(['click']);

                    setState({ foo: 2 });
                }
                , template: '<div>{{state.foo}}</div>'
                , unload: state => {
                    expect(state.foo).toBe(2);
                    expect($island.innerHTML).toBe('');
                    expect(Object.keys(events)).toStrictEqual([]);

                    done();
                }
            });

            setTimeout(() => island.unload(), 1000);
        }
    );

    it('should show the right content if morphdoms onBeforeElUpdated is used and always returns true', done => {
        setDocument(getDefaultDocument());
        const $island = document.getElementById('island');

        new RIsland<{ foo: number; }>({
            $element: $island
            , initialState: { foo: 1 }
            , load: () => {
                expect($island.innerHTML).toBe('<div>1</div>');

                done();
            }
            , morphdom: { onBeforeElUpdated: () => true }
            , template: '<div>{{state.foo}}</div>'
        });
    });

    it('should show the right content if morphdoms onBeforeElUpdated is used and returns false', done => {
        setDocument(getDefaultDocument());
        const $island = document.getElementById('island');

        new RIsland<{ foo: number; }>({
            $element: $island
            , initialState: { foo: 1 }
            , load: (_, setState) => {
                setState({ foo: 2 });
            }
            , morphdom: { onBeforeElUpdated: $el => $el.id !== 'ignore' }
            , template: '<div><div>{{state.foo}}</div><div id="ignore">{{state.foo}}</div></div>'
            , update: () => {
                expect($island.innerHTML).toBe('<div><div>2</div><div id="ignore">1</div></div>');

                done();
            }
        });
    });

    it('should check if morphdoms onElUpdated is invoked with a valid Element', done => {
        setDocument(getDefaultDocument());
        const $island = document.getElementById('island');

        new RIsland<{ foo: number; }>({
            $element: $island
            , initialState: { foo: 1 }
            , morphdom: {
                onElUpdated: $element => {
                    expect($element instanceof Element).toBe(true);

                    done();
                }
            }
            , template: '<div>{{state.foo}}</div>'
        });
    });

    it('should check if morphdoms onNodeAdded is invoked with a valid node', done => {
        setDocument(getDefaultDocument());
        const $island = document.getElementById('island');

        new RIsland<{ foo: number; }>({
            $element: $island
            , initialState: { foo: 1 }
            , morphdom: {
                onNodeAdded: node => {
                    expect(node instanceof Node).toBe(true);

                    done();

                    return node;
                }
            }
            , template: '<div>{{state.foo}}</div>'
        });
    });

    it('should check if morphdoms onNodeDiscarded is invoked with a valid node', done => {
        setDocument(getDefaultDocument());
        const $island = document.getElementById('island');

        new RIsland<{ foo: number; }>({
            $element: $island
            , initialState: { foo: 1 }
            , load: (_, setState) => {
                setState({ foo: 2 });
            }
            , morphdom: {
                onNodeDiscarded: node => {
                    expect(node instanceof Node).toBe(true);

                    return node;
                }
            }
            , template: '<div>{{@if(state.foo === 1}}<div>{{state.foo}}</div>{{/if}}</div>'
            , update: () => done()
        });
    });

    it('should check if deepmerges customMerge is used and leads to the right result', done => {
        setDocument(getDefaultDocument());
        const $island = document.getElementById('island');

        new RIsland<{ foo: Record<string, any>; }>({
            $element: $island
            , deepmerge: {
                customMerge: key => {
                    // we need a custom merge function here to remove keys from the object completely,
                    // because setting an object key to "undefined" in JS does not delete it.
                    if (key === 'foo') {
                        return function(a, b) {
                            return Object.assign(
                                {},
                                Object.keys(a).reduce(function(result, key) {
                                    if (!(key in b) || typeof b[key] !== 'undefined') {
                                        var tmp = {};
                                        tmp[key] = a[key];

                                        return Object.assign({}, result, tmp);
                                    }

                                    return result;
                                }, {}),
                                Object.keys(b).reduce(function(result, key) {
                                    if (typeof b[key] !== 'undefined') {
                                        var tmp = {};
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
            }
            , initialState: { foo: { bar: 1, quux: 2 } }
            , load: (_, setState) => {
                expect($island.innerHTML).toBe('<div><div>1</div><div>2</div></div>');

                setState({ foo: { quux: undefined } });
            }
            , template:
                `<div>
                    <div>{{state.foo.bar}}</div>
                    {{@if(state.foo.quux)}}<div>{{state.foo.quux}}</div>{{/if}}
                </div>`
                // removes all whitespaces from the template, so it is testable in a better way
                .replace(/\s+/g, '')
            , update: state => {
                expect($island.innerHTML).toBe('<div><div>1</div></div>');
                expect(state).toStrictEqual({ foo: { bar: 1 } });

                done();
            }
        });
    });

    it('should check if a custom shouldUpdate function works', done => {
        setDocument(getDefaultDocument());
        const $island = document.getElementById('island');

        new RIsland<{ foo: number; bar: number; }>({
            $element: $island
            , initialState: { foo: 1, bar: 2 }
            , load: (_, setState) => {
                setState([
                    { foo: 2 }
                    , new Promise(resolve => {
                        setTimeout(() => {
                            resolve([
                                state => {
                                    expect($island.innerHTML).toBe('<div><div>2</div><div>2</div></div>');
                                    expect(state).toStrictEqual({ foo: 2, bar: 2 });

                                    return null;
                                }
                                , { bar: 3 }
                                , new Promise(resolve => {
                                    setTimeout(() => {
                                        resolve(state => {
                                            expect($island.innerHTML).toBe('<div><div>2</div><div>2</div></div>');
                                            expect(state).toStrictEqual({ foo: 2, bar: 3 });

                                            done();
        
                                            return null;
                                        });
                                    }, 1000);
                                })
                            ]);
                        }, 1000);
                    })
                ]);
            }
            // only update if bar hasn't changed
            , shouldUpdate: (state, nextState) => state.hasOwnProperty('bar') === false || state.bar === nextState.bar
            , template: '<div><div>{{state.foo}}</div><div>{{state.bar}}</div></div>'
        });
    });

    it(
        'should check if deepmerges customMerge and a custom shouldUpdate function are used and lead to the right '
        + 'result'
        , done => {
            setDocument(getDefaultDocument());
            const $island = document.getElementById('island');

            new RIsland<{ foo: Record<string, any>; }>({
                $element: $island
                , deepmerge: {
                    customMerge: key => {
                        // we need a custom merge function here to remove keys from the object completely,
                        // because setting an object key to "undefined" in JS does not delete it.
                        if (key === 'foo') {
                            return function(a, b) {
                                return Object.assign(
                                    {},
                                    Object.keys(a).reduce(function(result, key) {
                                        if (!(key in b) || typeof b[key] !== 'undefined') {
                                            var tmp = {};
                                            tmp[key] = a[key];

                                            return Object.assign({}, result, tmp);
                                        }

                                        return result;
                                    }, {}),
                                    Object.keys(b).reduce(function(result, key) {
                                        if (typeof b[key] !== 'undefined') {
                                            var tmp = {};
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
                }
                , initialState: { foo: { bar: 1, quux: 2, baz: 3 } }
                , load: (_, setState) => {
                    expect($island.innerHTML).toBe('<div><div>1</div><div>2</div><div>3</div></div>');

                    setState([
                        { foo: { bar: 2, quux: undefined } }
                        , new Promise(resolve => {
                            setTimeout(() => {
                                resolve([
                                    state => {
                                        expect($island.innerHTML).toBe('<div><div>2</div><div>3</div></div>');
                                        expect(state).toStrictEqual({ foo: { bar: 2, baz: 3 } });
    
                                        return null;
                                    }
                                    , { foo: { baz: 4 } }
                                    , new Promise(resolve => {
                                        setTimeout(() => {
                                            resolve(state => {
                                                expect($island.innerHTML).toBe('<div><div>2</div><div>3</div></div>');
                                                expect(state).toStrictEqual({ foo: { bar: 2, baz: 4 } });
    
                                                done();
            
                                                return null;
                                            });
                                        }, 1000);
                                    })
                                ]);
                            }, 1000);
                        })
                    ]);
                }
                // only update if bar hasn't changed
                , shouldUpdate: (state, nextState) => {
                    return state.hasOwnProperty('foo') === false || state.foo.baz === nextState.foo.baz;
                }
                , template:
                    `<div>
                        <div>{{state.foo.bar}}</div>
                        {{@if(state.foo.quux)}}<div>{{state.foo.quux}}</div>{{/if}}
                        <div>{{state.foo.baz}}</div>
                    </div>`
                    // removes all whitespaces from the template, so it is testable in a better way
                    .replace(/\s+/g, '')
            });
        }
    );
});
