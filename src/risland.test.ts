import RIsland from './risland';

function setDocument(html: string): void {
    document.getElementsByTagName('html')[0].innerHTML = html;
}

function getDefaultDocument(additional: string = ''): string {
    return `<head><meta charset="utf-8"/></head><body><div id="island"></div>${additional}</body>`;
}

describe('Risland', () => {
    beforeEach(() => {
        // hide all the errors and warnings and save them for testing
        console.warn = jest.fn();
        console.error = jest.fn();
    });

    it('should show a warning in the console if initialized with an empty initialState', done => {
        const warning = 'RIsland: Initialisation with an empty state is considered an anti-pattern. '
            + 'Please try to predefine everything you will later change with setState() with an initial value; '
            + 'even it is null.';

        setDocument(getDefaultDocument());

        new RIsland<{}>({
            $element: document.getElementById('island')
            , initialState: {}
            , load: () => {
                expect(console.warn).toHaveBeenCalledWith(warning);

                done();
            }
            , template: '<div></div>'
        });
    });

    it('should show an error in the frontend and the console if initialized with the wrong template type', done => {
        const error = 'RIsland: template must be a string or a script tag element.';

        setDocument(getDefaultDocument('<template id="squirrelly"></template>'));
        const $island = document.getElementById('island');

        new RIsland<{}>({
            $element: $island
            , load: () => {
                expect(console.error).toHaveBeenCalledWith(error);
                expect($island.innerHTML).toBe(`<p style="color:red;">${error}</p>`);

                done();
            }
            // we have to cast to any here, because we intentionally provide the wrong element type
            , template: document.getElementById('squirrelly') as any
        });
    });
});
