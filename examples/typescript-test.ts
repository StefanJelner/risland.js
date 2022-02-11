import RIsland from '../index';

document.addEventListener('DOMContentLoaded', function() {
    new RIsland<{ checked: boolean; }>({
        $element: document.getElementById('island')
        , delegations: {
            'click': {
                '.island__checkbox': function(_, closest, __, setState) {
                    setState({ checked: (closest as HTMLFormElement).checked });
                }
            }
        }
        , initialState: {
            checked: false
        }
        , load: function() { console.log('load'); }
        , template: `<div class="island">
            <input class="island__checkbox" type="checkbox" />
            {{@if(state.checked)}}is checked{{#else}}is not checked{{/if}}
        </div>`
        , update: function() { console.log('update'); }
    });
});
