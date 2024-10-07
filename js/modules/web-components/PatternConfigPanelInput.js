import Helpers from '../Helpers.js';
import App from './App.js';
import InputDropdown from './InputDropdown.js';
import InputKnob from './InputKnob.js';
import InputSlider from './InputSlider.js';
import InputSwitch from './InputSwitch.js';

const ooPatternConfigPanelInputTemplate = document.createElement('template');
ooPatternConfigPanelInputTemplate.innerHTML = `
<div class="container"></div>
<span class="label"></div>
`;

const ooPatternConfigPanelInputCss = document.createElement('template');
ooPatternConfigPanelInputCss.innerHTML = `
<style>
    :host {
        background-color: var(--oo-color-gray-lightest);
        border-radius: var(--oo-border-radius);
        padding: var(-oo-padding-base);
    }

    :host * {
        box-sizing: border-box;
    }
</style>
`;

class PatternConfigPanelInput extends HTMLElement {

    constructor(parent) {
        super();

        this.parent = parent;

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooPatternConfigPanelInputCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooPatternConfigPanelInputTemplate.content.cloneNode(true));
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }

    static get observedAttributes() {

        return ['data-oo-pattern-control-input-type', 'data-oo-pattern-control-input-name', 'data-oo-pattern-control-input-initial-value', 'data-oo-pattern-control-input-min-value', 'data-oo-pattern-control-input-max-value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        const app = Helpers.nqs('oo-app');

        switch (name) {
            case 'data-oo-pattern-control-input-type':
                switch (newValue) {
                    case 'Boolean':
                        this.input = Helpers.nac(this.shadowRoot, new InputSwitch());
                        break;
                    case 'Number':
                        this.input = Helpers.nac(this.shadowRoot, new InputKnob());
                        break;
                }
                break;
            case 'data-oo-pattern-control-input-name':
                this.input.setAttribute('label', `${App.STRINGS[Helpers.getLanguage(app._s.language)].PATTERN_PARAMETERS[newValue]}`);
                break;
            case 'data-oo-pattern-control-input-initial-value':
                this.input.setAttribute('value', newValue);
                break;
            case 'data-oo-pattern-control-input-min-value':
                this.input.setAttribute('min', newValue);
                break;
            case 'data-oo-pattern-control-input-max-value':
                this.input.setAttribute('max', newValue);
                break;
        }
    }
}

window.customElements.define('oo-pattern-config-panel-input', PatternConfigPanelInput);

export default PatternConfigPanelInput;