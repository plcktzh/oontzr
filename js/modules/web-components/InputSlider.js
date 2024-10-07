import Helpers from '../Helpers.js';
import App from './App.js';

const ooInputSliderCss = document.createElement('template');
ooInputSliderCss.innerHTML = `
<style>
    :host {
        /** background-color: var(--oo-color-gray-lightest); */
        /** border-radius: var(--oo-border-radius); */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    :host * {
        box-sizing: border-box;
    }

    :host([disabled="disabled"]) #outputContainer {
        cursor: not-allowed;
    }
    
    #outputContainer {
        align-items: center;
        cursor: grab;
        display: flex;
        flex-direction: column;
        gap: var(--oo-margin-base);
        /** padding: var(--oo-padding-base); */
        position: relative;
    }

    :host(.no-output-label) #outputLabel {
        display: none;
    }

    #outputLabel {
        align-items: center;
        display: flex;
        font-size: var(--oo-font-size-label);
        justify-content: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 100%;
    }

    #outputLabel::selection {
        background: none;
    }

    label,
    input[type="number"] {
        display: none;
    }

    svg {
        border-radius: var(--oo-border-radius-small);
        display: block;
    }

    svg #background {
        fill: var(--oo-color-gray-light);
    }
    
    svg #outputPath {
        fill: var(--oo-color-primary);
    }
</style>
`;

const ooInputSliderTemplate = document.createElement('template');
ooInputSliderTemplate.innerHTML = `
<input type="number" id="numberInput" min="0" max="127" value="0">
<div id="outputContainer">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 100" width="50" height="100" preserveAspectRatio="none">
<defs>
<clipPath id="candybar">
<rect x="0" y="0" width="50" height="100" />
</clipPath>
</defs>
<g clip-path="url(#candybar)">
<rect id="background" x="0" y="0" width="50" height="100" />
<rect id="outputPath" x="0" y="50" width="50" height="50" />
</g>
</svg>
<div id="outputLabel"></div>
</div>
<label for="numberInput"></label>
`;

/**
 * @class InputSlider
 * @extends HTMLElement
 */
class InputSlider extends HTMLElement {

    /**
     * @constructor
     */
    constructor(parent) {

        super();

        this.parent = parent;

        // Build configuration from attributes attached to <oo-input-slider>
        this._config = {};

        // Attach shadow root
        this.attachShadow({
            mode: 'open'
        });

        // Append CSS and template to shadow root
        Helpers.nac(this.shadowRoot, ooInputSliderCss.content.cloneNode(true));
        Helpers.nac(this.shadowRoot, ooInputSliderTemplate.content.cloneNode(true));

        // Get number input
        this.num = Helpers.nqs('#numberInput', this.shadowRoot);
    }

    /**
     * @static
     */
    static get observedAttributes() {

        return ['value', 'min', 'max', 'graph-min', 'graph-max', 'disabled', 'width', 'height', 'label'];
    }


    /**
     * @callback attributeChangedCallback
     * @param {String} name 
     * @param {Object} oldValue 
     * @param {String} newValue 
     */
    attributeChangedCallback(name, oldValue, newValue) {

        if (newValue !== oldValue) {
            switch (name) {
                case 'value':
                case 'min':
                case 'max':
                    // Set attributes on number input and update _config for attributes value, min, max
                    this.num.setAttribute(name, parseInt(newValue));
                    if (parseInt(this.num.getAttribute('value')) < parseInt(this.num.getAttribute('min'))) this.num.setAttribute(name, parseInt(this.num.getAttribute('min')));
                    if (parseInt(this.num.getAttribute('value')) > parseInt(this.num.getAttribute('max'))) this.num.setAttribute(name, parseInt(this.num.getAttribute('max')));
                    this._config[name] = parseInt(this.num.getAttribute(name));
                    break;
                case 'graph-min':
                    // Update _config for graphMin
                    this._config['graphMin'] = parseInt(newValue);
                    break;
                case 'graph-max':
                    // Update _config for graphMax
                    this._config['graphMax'] = parseInt(newValue);
                    break;
                case 'width':
                case 'height':
                    Helpers.nqs('svg', this.shadowRoot).setAttribute(name, parseInt(newValue));
                    this._config[name] = parseInt(newValue);
                    break;
                case 'disabled':
                    (newValue === 'disabled') ? this.num.setAttribute('disabled', 'disabled'): this.num.removeAttribute('disabled');
                    this._config['disabled'] = (newValue === 'disabled') ? true : false;
                    break;
                case 'label':
                    Helpers.nqs('label', this.shadowRoot).innerHTML = newValue;
                    break;
            }

            this.num.dispatchEvent(new Event('change'));
        }
    }

    /**
     * @callback connectedCallback
     */
    connectedCallback() {

        // Get attributes from oo-input-slider and assign to _config properties - includes fallbacks
        this._config['max'] = this.getAttribute('max') ? parseInt(this.getAttribute('max')) : 127;
        this._config['min'] = this.getAttribute('min') ? parseInt(this.getAttribute('min')) : 0;
        this._config['value'] = this.getAttribute('value') ? parseInt(this.getAttribute('value')) : 0;
        this._config['graphMin'] = this.getAttribute('graphMin') ? parseInt(this.getAttribute('graphMin')) : 0;
        this._config['graphMax'] = this.getAttribute('graphMax') ? parseInt(this.getAttribute('graphMax')) : 100;
        this._config['width'] = this.getAttribute('width') ? parseInt(this.getAttribute('width')) : 50;
        this._config['height'] = this.getAttribute('height') ? parseInt(this.getAttribute('height')) : 100;
        this._config['disabled'] = this.getAttribute('height') === 'disabled' ? true : false;

        // Add event listener to number input
        this.num.addEventListener('change', (e) => {

            // Prevent value to get out of bounds
            if (e.target.value < this._config.min) e.target.value = this._config.min;
            if (e.target.value > this._config.max) e.target.value = this._config.max;

            // Trigger re-render of component
            this._render();
        });

        // Add mouse event listeners
        this.addEventListener('mousedown', (e) => {

            // Since Firefox handles MouseEvent.movementY rather awkwardly, we need to save the initial clientY property
            this._clientY = e.clientY;
            this.addEventListener('mousemove', this._updateInput);
        });
        this.addEventListener('mouseup', (e) => {
            this.removeEventListener('mousemove', this._updateInput);
            // Clear clientY property
            this._clientY = undefined;
        });
        this.addEventListener('mouseout', (e) => this.removeEventListener('mousemove', this._updateInput));

        this.addEventListener('mouseenter', (e) => this.addEventListener('wheel', this._updateInput, {
            passive: true
        }), {
            passive: true
        });
        this.addEventListener('mouseout', (e) => this.removeEventListener('wheel', this._updateInput), {
            passive: true
        });

        this.addEventListener('click', this._updateInput);

        // Add touch event listeners
        this.addEventListener('touchstart', (e) => {

            // Since TouchEvent doesn't provide a property akin to movementY, we need to save the initial clientY property
            this._clientY = e.touches[0].clientY;
            this.addEventListener('touchmove', this._updateInput, {
                passive: true
            });
        }, {
            passive: true
        });
        this.addEventListener('touchend', (e) => {

            this.removeEventListener('touchmove', this._updateInput);
            // Clear clientY property
            this._clientY = undefined;
        }, {
            passive: true
        });

        this._render();
    }

    /**
     * @callback
     */
    disconnectedCallback() {

        // Remove all event listeners
        this.removeEventListener('mousedown', (e) => {});
        this.removeEventListener('mouseup', (e) => {});
        this.removeEventListener('mousemove', (e) => {});
        this.removeEventListener('mouseenter', (e) => {});
        this.removeEventListener('mouseout', (e) => {});
        this.removeEventListener('click', this._updateInput);
        this.removeEventListener('touchstart', (e) => {});
        this.removeEventListener('touchend', (e) => {});
        this.removeEventListener('touchmove', (e) => {});
    }

    /**
     * @private
     * @method _updateInput
     * @param {MouseEvent|TouchEvent|WheelEvent} e The event object
     * @returns null
     */
    _updateInput(e) {

        if (!this._config.disabled) {

            // Get number input
            const num = (e.target.shadowRoot) ? Helpers.nqs('#numberInput', e.target.shadowRoot) : null;

            // Declare variable for calculated value
            let newValue;

            if (num) {

                if (e.type === 'click') {

                    newValue = Math.round((1 - ((e.clientY - Helpers.nqs('svg', e.target.shadowRoot).getBoundingClientRect().y) / Helpers.nqs('svg', e.target.shadowRoot).getBoundingClientRect().height)) * parseInt(num.getAttribute('max')));
                } else if (e.type === 'mousemove' || e.type === 'touchmove') {
                    // Handling of mouse and touch events

                    const currentClientY = (e.type === 'mousemove') ? e.clientY : e.changedTouches[0].clientY;

                    // deltaY basically is a custom movementY for touch events (and Firefox)
                    const deltaY = (currentClientY && e.target._clientY) ? currentClientY - e.target._clientY : 0;

                    // Update _clientY with the current y position
                    e.target._clientY = currentClientY;

                    newValue = num.getAttribute('value') - Math.round(.25 * deltaY);
                } else if (e.type === 'wheel') {
                    // Handling of scroll wheel events

                    newValue = num.getAttribute('value') - Math.round(.025 * e.deltaY);
                }

                // Check if newValue is within bounds and assign to number input's value attribute
                if (newValue < parseInt(num.getAttribute('min'))) newValue = num.getAttribute('min');
                if (newValue > parseInt(num.getAttribute('max'))) newValue = num.getAttribute('max');
                num.setAttribute('value', newValue);

                this.setAttribute('value', newValue);
                this.parent.setAttribute('data-oo-pattern-control-input-value', newValue);

                // Trigger a re-render
                num.dispatchEvent(new Event('change'));
                this.dispatchEvent(new CustomEvent(App.EVENT_TYPES.INPUT_CHANGE, {
                    detail: {
                        newValue: newValue
                    }
                }));
            }
        }
    }

    /**
     * @private
     * @method _render
     * @returns null
     */
    _render() {

        // Get number input
        const num = Helpers.nqs('#numberInput', this.shadowRoot);

        // Get current value of number input
        const val = parseInt(num.value);

        // Some shorthand for graphMin and graphMax attributes
        const min = this._config.graphMin;
        const max = this._config.graphMax;

        // Get the height of the rectangle, based on the number input's value
        let height = parseInt(num.value) / this._config['max'] * max;

        // Cover edge cases
        if (val === min) height = min * max;
        else if (val === max) height = max * max;

        // Set the SVG rect's height and y attributes
        Helpers.nqs('#outputPath', this.shadowRoot).setAttribute('y', `${max - height}`);
        Helpers.nqs('#outputPath', this.shadowRoot).setAttribute('height', `${height}`);

        Helpers.nqs('svg', this.shadowRoot).setAttribute('width', this._config['width']);
        Helpers.nqs('svg', this.shadowRoot).setAttribute('height', this._config['height']);

        Helpers.nqs('#outputLabel', this.shadowRoot).innerText = val;

        this.setAttribute('value', val);
    }
}

window.customElements.define('oo-input-slider', InputSlider)

export default InputSlider;