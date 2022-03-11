import RIsland from './risland';

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
});
