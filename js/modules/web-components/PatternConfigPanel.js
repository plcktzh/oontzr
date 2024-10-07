import Helpers from '../Helpers.js';
import App from './App.js';
import InputKnob from './InputKnob.js';
import InputSwitch from './InputSwitch.js';
import PatternConfigPanelInput from './PatternConfigPanelInput.js';

const ooPatternConfigPanelTemplate = document.createElement('template');
ooPatternConfigPanelTemplate.innerHTML = ``;

const ooPatternConfigPanelCss = document.createElement('template');
ooPatternConfigPanelCss.innerHTML = `
<style>
    :host {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: auto;
        grid-column-gap: var(--oo-padding-base);
        grid-row-gap: var(--oo-padding-base);
        width: 100%;
    }

    :host * {
        box-sizing: border-box;
    }
</style>
`;

class PatternConfigPanel extends HTMLElement {

    constructor(parent) {
        super();

        this.parent = parent;

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooPatternConfigPanelCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooPatternConfigPanelTemplate.content.cloneNode(true));
    }

    connectedCallback() {

        this.setAttribute('data-oo-controls-pattern', this.parent.id);

        switch (this.parent.parameters.type) {
            case App.PATTERN_TYPES.CELLULAR.TYPE:
                this.type = 'CELLULAR';
                break;
            case App.PATTERN_TYPES.EUCLIDEAN.TYPE:
                this.type = 'EUCLIDEAN';
                break;
            case App.PATTERN_TYPES.RANDOM.TYPE:
                this.type = 'RANDOM';
                break;
            case App.PATTERN_TYPES.TR.TYPE:
                this.type = 'TR';
                break;
        }

        for (const parameter in App.PATTERN_TYPES[this.type].PARAMETERS) {

            const input = Helpers.nac(this.shadowRoot, new PatternConfigPanelInput(this));
            input.setAttribute('data-oo-pattern-control-input-type', App.PATTERN_TYPES[this.type].PARAMETERS[parameter].TYPE);
            input.setAttribute('data-oo-pattern-control-input-name', parameter);
            input.setAttribute('data-oo-pattern-control-input-initial-value', App.PATTERN_TYPES[this.type].PARAMETERS[parameter].INITIALVALUE);
        }
    }
}

window.customElements.define('oo-pattern-config-panel', PatternConfigPanel);

export
default PatternConfigPanel;