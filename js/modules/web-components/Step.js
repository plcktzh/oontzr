import Helpers from '../Helpers.js';
import App from './App.js';
import InputSlider from './InputSlider.js';

const ooStepTemplate = document.createElement('template');
ooStepTemplate.innerHTML = ``;

const ooStepCss = document.createElement('template');
ooStepCss.innerHTML = `
<style>
    :host {
    }

    :host * {
        box-sizing: border-box;
    }

    svg {
        height: 100%;
        width: 100%;
    }
</style>
`;

/**
 * @class Step
 */
class Step extends HTMLElement {

    /**
     * @property {Boolean} isActive
     * @property {Number} velocity
     */
    isActive = false;
    velocity = 0;

    /**
     * @constructor
     * @param {Object} args An optional initialisation Object
     * @returns Step
     */
    constructor(parent, args) {
        super();

        this.parent = parent;
        this.id = args.id;

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooStepCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooStepTemplate.content.cloneNode(true));

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args);

        return this;
    }

    connectedCallback() {

        this.inputSlider = Helpers.nac(this.shadowRoot, new InputSlider())
        this.inputSlider.classList.add('no-output-label');
        this.inputSlider.setAttribute('value', this.getAttribute('data-oo-step-velocity'));
        this.inputSlider.setAttribute('min', App.PATTERN_PARAMETERS.VELOCITY_MIN);
        this.inputSlider.setAttribute('max', App.PATTERN_PARAMETERS.VELOCITY_MAX);
        this.inputSlider.setAttribute('width', this.getAttribute('data-oo-step-width'));
        this.inputSlider.setAttribute('height', App.CANVAS_ATTRIBUTES.STEP_HEIGHT);

        this.inputSlider.addEventListener('input-change', (e) => {
            this.setAttribute('data-oo-step-velocity', e.detail.newValue);
        });
    }

    static get observedAttributes() {
        return ['data-oo-step-velocity'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if (name === 'data-oo-step-velocity' && this.inputSlider) {
            this.inputSlider.setAttribute('value', newValue);
            this.isActive = (parseInt(newValue) !== 0) ? true : false;

            console.log(newValue, this.isActive);
        }
    }

    /**
     * @method setVelocity
     * @param {Number} value The (optional) velocity the Step should be set to
     * @returns null
     */
    setVelocity(value) {
        // If Step instance is active, set velocity to either the value parameter or to a random value
        if (this.isActive) this.velocity = (value) ? value : (Math.random() * (App.PATTERN_PARAMETERS.VELOCITY_MAX - App.PATTERN_PARAMETERS.VELOCITY_MIN) + App.PATTERN_PARAMETERS.VELOCITY_MIN);
    }
}

window.customElements.define('oo-pattern-step', Step);

export default Step;