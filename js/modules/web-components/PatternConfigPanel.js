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

/**
 * @class PatternConfigPanel
 * @extends HTMLElement
 */
class PatternConfigPanel extends HTMLElement {

    /**
     * @constructor
     * @param {Pattern} parent
     */
    constructor(parent) {
        super();

        this.parent = parent;

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooPatternConfigPanelCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooPatternConfigPanelTemplate.content.cloneNode(true));
    }

    /**
     * @static
     * @returns Array
     */
    static get observedAttributes() {

        return ['data-oo-pattern-length', 'data-oo-num-events', 'data-oo-num-seeds', 'data-oo-do-center-seeds', 'data-oo-pattern-offset', 'data-oo-wrap-around', 'data-oo-do-randomize-velocities', 'data-oo-do-randomize', 'data-oo-volume'];
    }

    /**
     * @method attributeChangedCallback
     * @param {String} name 
     * @param {String} oldValue 
     * @param {String} newValue 
     */
    attributeChangedCallback(name, oldValue, newValue) {

        this.parent.setAttribute(name, newValue);
    }

    /**
     * @callback connectedCallback
     */
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
            input.setAttribute('data-oo-pattern-control-input-value', App.PATTERN_TYPES[this.type].PARAMETERS[parameter].INITIALVALUE);
            if (App.PATTERN_TYPES[this.type].PARAMETERS[parameter].TYPE === 'Number') {
                if (parameter === 'PATTERN_OFFSET') {
                    input.setAttribute('data-oo-pattern-control-input-min-value', -1 * Math.floor(.5 * App.PATTERN_TYPES[this.type].PARAMETERS.PATTERN_LENGTH.INITIALVALUE));
                    input.setAttribute('data-oo-pattern-control-input-max-value', Math.floor(.5 * App.PATTERN_TYPES[this.type].PARAMETERS.PATTERN_LENGTH.INITIALVALUE));
                } else if (['NUM_EVENTS', 'NUM_SEEDS'].indexOf(parameter) > -1) {
                    input.setAttribute('data-oo-pattern-control-input-min-value', App.PATTERN_TYPES[this.type].PARAMETERS[parameter].MINVALUE);
                    input.setAttribute('data-oo-pattern-control-input-max-value', App.PATTERN_TYPES[this.type].PARAMETERS.PATTERN_LENGTH.INITIALVALUE);
                } else {
                    input.setAttribute('data-oo-pattern-control-input-min-value', App.PATTERN_TYPES[this.type].PARAMETERS[parameter].MINVALUE);
                    input.setAttribute('data-oo-pattern-control-input-max-value', App.PATTERN_TYPES[this.type].PARAMETERS[parameter].MAXVALUE);
                }
            }
        }
    }
}

window.customElements.define('oo-pattern-config-panel', PatternConfigPanel);

export
default PatternConfigPanel;