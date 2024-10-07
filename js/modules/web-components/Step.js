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
        if (this.getAttribute('data-oo-step-velocity')) this.inputSlider.setAttribute('value', this.getAttribute('data-oo-step-velocity'));
        else this.inputSlider.setAttribute('value', '0');
        this.inputSlider.setAttribute('min', App.PATTERN_PARAMETERS.VELOCITY_MIN);
        this.inputSlider.setAttribute('max', App.PATTERN_PARAMETERS.VELOCITY_MAX);
        this.inputSlider.setAttribute('height', App.CANVAS_ATTRIBUTES.STEP_HEIGHT);
        this.inputSlider.setAttribute('width', '21.38');
        if (this.parent.type !== 'tr' && this.getAttribute('data-oo-step-is-active') === 'false') this.inputSlider.setAttribute('disabled', 'disabled');

        this.inputSlider.addEventListener('input-change', (e) => {
            this.setAttribute('data-oo-step-velocity', e.detail.newValue);
        });
    }

    static get observedAttributes() {
        return ['data-oo-step-velocity', 'data-oo-step-is-active', 'data-oo-step-width'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        switch (name) {

            case 'data-oo-step-velocity':
                if (this.isActive || this.parent.type === 'tr') {
                    this.inputSlider.setAttribute('value', newValue);

                    this.velocity = parseInt(newValue);
                    this.isActive = (parseInt(newValue) !== 0) ? true : false;
                    this.setAttribute('data-oo-step-is-active', this.isActive);
                }
                break;
            case 'data-oo-step-is-active':
                if (parseInt(this.inputSlider.getAttribute('value')) === App.PATTERN_PARAMETERS.VELOCITY_MIN) {
                    if (newValue === 'true') this.inputSlider.setAttribute('value', App.PATTERN_PARAMETERS.VELOCITY_MAX);
                }
                if (this.inputSlider && this.parent.type !== 'tr') {
                    if (newValue === 'false') this.inputSlider.setAttribute('disabled', 'disabled');
                    else this.inputSlider.removeAttribute('disabled');

                    this.isActive = (newValue === 'true') ? true : false;
                }
                break;
            case 'data-oo-step-width':
                this.inputSlider.setAttribute('data-oo-step-width', newValue);
                break;
        }

        // if (name === 'data-oo-step-velocity' && this.inputSlider && (this.parent.type === 'tr' || this.isActive)) {
        // this.inputSlider.setAttribute('value', newValue);
        // this.velocity = parseInt(newValue);
        // 
        // this.isActive = (parseInt(newValue) !== 0) ? true : false;
        // this.setAttribute('data-oo-step-is-active', this.isActive);
        // } else if (name === 'data-oo-step-is-active' && this.inputSlider && parseInt(this.inputSlider.getAttribute('value')) === App.PATTERN_PARAMETERS.VELOCITY_MIN) {
        // if (newValue === 'true') this.inputSlider.setAttribute('value', App.PATTERN_PARAMETERS.VELOCITY_MAX);
        // }
        // if (name === 'data-oo-step-is-active' && this.inputSlider && this.parent.type !== 'tr') {
        //     if (newValue === 'false') this.inputSlider.setAttribute('disabled', 'disabled');
        //     else this.inputSlider.removeAttribute('disabled');

        //     this.isActive = (newValue === 'true') ? true : false;
        // }

        // if (name === 'data-oo-step-width') this.inputSlider.setAttribute('data-oo-step-width', newValue);
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