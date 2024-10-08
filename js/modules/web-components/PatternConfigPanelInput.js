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

        return ['data-oo-pattern-control-input-type', 'data-oo-pattern-control-input-name', 'data-oo-pattern-control-input-initial-value', 'data-oo-pattern-control-input-min-value', 'data-oo-pattern-control-input-max-value', 'data-oo-pattern-control-input-value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        const app = Helpers.nqs('oo-app');

        switch (name) {
            case 'data-oo-pattern-control-input-type':
                switch (newValue) {
                    case 'Boolean':
                        this.input = Helpers.nac(this.shadowRoot, new InputSwitch(this));
                        break;
                    case 'Number':
                        this.input = Helpers.nac(this.shadowRoot, new InputKnob(this));
                        break;
                }
                break;
            case 'data-oo-pattern-control-input-name':
                this.input.setAttribute('label', `${App.STRINGS[Helpers.getLanguage(app._s.language)].PATTERN_PARAMETERS[newValue]}`);
                break;
            case 'data-oo-pattern-control-input-value':
                this.input.setAttribute('value', newValue);
                switch (this.getAttribute('data-oo-pattern-control-input-name')) {
                    case 'PATTERN_LENGTH':
                        const inputOffset = Helpers.nqs('[data-oo-pattern-control-input-name="PATTERN_OFFSET"]', this.parent.shadowRoot);
                        if (inputOffset) {
                            inputOffset.setAttribute('data-oo-pattern-control-input-min-value', -1 * Math.floor(.5 * newValue));
                            inputOffset.setAttribute('data-oo-pattern-control-input-max-value', Math.floor(.5 * newValue));

                            if (parseInt(inputOffset.getAttribute('data-oo-pattern-control-input-value')) < parseInt(inputOffset.getAttribute('data-oo-pattern-control-input-min-value'))) inputOffset.setAttribute('data-oo-pattern-control-input-value', inputOffset.getAttribute('data-oo-pattern-control-input-min-value'));
                            if (parseInt(inputOffset.getAttribute('data-oo-pattern-control-input-value')) > parseInt(inputOffset.getAttribute('data-oo-pattern-control-input-max-value'))) inputOffset.setAttribute('data-oo-pattern-control-input-value', inputOffset.getAttribute('data-oo-pattern-control-input-max-value'));
                        }

                        const inputNumEvents = Helpers.nqs('[data-oo-pattern-control-input-name="NUM_EVENTS"]', this.parent.shadowRoot);
                        if (inputNumEvents) {
                            inputNumEvents.setAttribute('data-oo-pattern-control-input-max-value', newValue);

                            if (parseInt(inputNumEvents.getAttribute('data-oo-pattern-control-input-value')) < parseInt(inputNumEvents.getAttribute('data-oo-pattern-control-input-min-value'))) inputNumEvents.setAttribute('data-oo-pattern-control-input-value', inputNumEvents.getAttribute('data-oo-pattern-control-input-min-value'));
                            if (parseInt(inputNumEvents.getAttribute('data-oo-pattern-control-input-value')) > parseInt(inputNumEvents.getAttribute('data-oo-pattern-control-input-max-value'))) inputNumEvents.setAttribute('data-oo-pattern-control-input-value', inputNumEvents.getAttribute('data-oo-pattern-control-input-max-value'));
                        }

                        const inputNumSeeds = Helpers.nqs('[data-oo-pattern-control-input-name="NUM_SEEDS"]', this.parent.shadowRoot);
                        if (inputNumSeeds) {
                            inputNumSeeds.setAttribute('data-oo-pattern-control-input-max-value', newValue);

                            if (parseInt(inputNumSeeds.getAttribute('data-oo-pattern-control-input-value')) < parseInt(inputNumSeeds.getAttribute('data-oo-pattern-control-input-min-value'))) inputNumSeeds.setAttribute('data-oo-pattern-control-input-value', inputNumSeeds.getAttribute('data-oo-pattern-control-input-min-value'));
                            if (parseInt(inputNumSeeds.getAttribute('data-oo-pattern-control-input-value')) > parseInt(inputNumSeeds.getAttribute('data-oo-pattern-control-input-max-value'))) inputNumSeeds.setAttribute('data-oo-pattern-control-input-value', inputNumSeeds.getAttribute('data-oo-pattern-control-input-max-value'));
                        }
                        this.parent.setAttribute('data-oo-pattern-length', newValue);
                        break;
                    case 'NUM_EVENTS':
                        this.parent.setAttribute('data-oo-num-events', newValue);
                        break;
                    case 'NUM_SEEDS':
                        this.parent.setAttribute('data-oo-num-seeds', newValue);
                        break;
                    case 'PATTERN_OFFSET':
                        this.parent.setAttribute('data-oo-pattern-offset', newValue);
                        break;
                    case 'DO_CENTER_SEEDS':
                        this.parent.setAttribute('data-oo-do-center-seeds', newValue);
                        break;
                    case 'DO_RANDOMIZE_VELOCITIES':
                        this.parent.setAttribute('data-oo-do-randomize-velocities', newValue);
                        break;
                    case 'DO_RANDOMIZE':
                        this.parent.setAttribute('data-oo-do-randomize', newValue);
                        break;
                    case 'WRAP_AROUND':
                        this.parent.setAttribute('data-oo-wrap-around', newValue);
                        break;
                    case 'VOLUME':
                        this.parent.setAttribute('data-oo-volume', newValue);
                        break;
                }
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