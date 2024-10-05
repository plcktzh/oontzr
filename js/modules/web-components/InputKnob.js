import Helpers from '../Helpers.js';

const ooInputKnobCss = document.createElement('template');
ooInputKnobCss.innerHTML = `
<style>
    :host {
        background-color: var(--oo-color-gray-lightest);
        border-radius: var(--oo-border-radius);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    :host * {
        box-sizing: border-box;
    }
    
    #outputContainer {
        align-items: center;
        cursor: grab;
        display: flex;
        flex-direction: column;
        gap: var(--oo-margin-base);
        padding: var(--oo-padding-base);
        position: relative;
    }

    #outputLabel {
        align-items: center;
        display: flex;
        font-size: var(--oo-font-size-label);
        height: 50%;
        justify-content: center;
        left: 25%;
        position: absolute;
        top: 25%;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 50%;
    }

    label {
        align-items: center;
        background-color: var(--oo-color-gray-dark);
        border-bottom-left-radius: var(--oo-border-radius);
        border-bottom-right-radius: var(--oo-border-radius);
        color: var(--oo-color-gray-lightest);
        display: flex;
        font-size: var(--oo-font-size-label);
        justify-content: center;
        padding: var(--oo-padding-base);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 100%;
    }

    #outputLabel::selection,
    label::selection {
        background: none;
    }

    input[type="number"] {
        display: none;
    }

    svg {
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

const ooInputKnobTemplate = document.createElement('template');
ooInputKnobTemplate.innerHTML = `
<input type="number" id="numberInput" min="1" max="64" value="16">
<div id="outputContainer">
<div id="outputLabel"></div>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
<defs>
<clipPath id="donut">
<path clip-rule="evenodd" fill="#00f" d="M 50 0 A 50 50, 0, 0, 1, 100 50 A 50 50, 0, 0, 1, 0 50 A 50 50, 0, 0, 1, 50 0 Z M 50 25 A 25 25, 0, 0, 1, 75 50 A 25 25, 0, 0, 1, 25 50 A 25 25, 0, 0, 1, 50 25 Z" />
</clipPath>
</defs>
<g clip-path="url(#donut)" transform="rotate(90, 50, 50)">
<circle id="background" cx="50" cy="50" r="50" />
<path id="outputPath" d="M 50 50 L 50 0 A 50 50, 0, 0, 1, 50 0 Z" />
</g>
</svg>
</div>
<label for="numberInput"><slot name="label"></slot></label>
`;

/**
 * @class InputKnob
 * @extends HTMLElement
 */
class InputKnob extends HTMLElement {

    /**
     * @constructor
     */
    constructor() {

        super();

        // Build configuration from attributes attached to <oo-input-knob>
        this._config = {};

        // Attach shadow root
        this.attachShadow({
            mode: 'open'
        });

        // Append CSS and template to shadow root
        Helpers.nac(this.shadowRoot, ooInputKnobCss.content.cloneNode(true));
        Helpers.nac(this.shadowRoot, ooInputKnobTemplate.content.cloneNode(true));

        // Get number input
        this.num = Helpers.nqs('#numberInput', this.shadowRoot);

        if (!Helpers.nqs('[slot="label"]', this) || Helpers.nqs('[slot="label"]', this).firstChild === null) Helpers.nqs('label', this.shadowRoot).style.display = 'none';
    }

    /**
     * @static
     */
    static get observedAttributes() {

        return ['value', 'min', 'max', 'graph-min', 'graph-max', 'disabled', 'size'];
    }


    /**
     * @callback attributeChangedCallback
     * @param {String} name 
     * @param {Object} oldValue 
     * @param {String} newValue 
     */
    attributeChangedCallback(name, oldValue, newValue) {

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
            case 'size':
                Helpers.nqs('svg', this.shadowRoot).setAttribute('width', parseInt(newValue));
                Helpers.nqs('svg', this.shadowRoot).setAttribute('height', parseInt(newValue));
                this._config[name] = parseInt(newValue);
                break;
        }

        this.num.dispatchEvent(new Event('change'));
    }

    /**
     * @callback connectedCallback
     */
    connectedCallback() {

        // Get attributes from oo-input-knob and assign to _config properties - includes fallbacks
        this._config['value'] = this.getAttribute('value') ? parseInt(this.getAttribute('value')) : 1;
        this._config['min'] = this.getAttribute('min') ? parseInt(this.getAttribute('min')) : 1;
        this._config['max'] = this.getAttribute('max') ? parseInt(this.getAttribute('max')) : 64;
        this._config['graphMin'] = this.getAttribute('graphMin') ? parseInt(this.getAttribute('graphMin')) : 0;
        this._config['graphMax'] = this.getAttribute('graphMax') ? parseInt(this.getAttribute('graphMax')) : 64;
        this._config['size'] = this.getAttribute('size') ? parseInt(this.getAttribute('size')) : 100;

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

        this.addEventListener('mouseenter', (e) => this.addEventListener('wheel', this._updateInput));
        this.addEventListener('mouseout', (e) => this.removeEventListener('wheel', this._updateInput));

        // Add touch event listeners
        this.addEventListener('touchstart', (e) => {

            // Since TouchEvent doesn't provide a property akin to movementY, we need to save the initial clientY property
            this._clientY = e.touches[0].clientY;
            this.addEventListener('touchmove', this._updateInput);
        });
        this.addEventListener('touchend', (e) => {

            this.removeEventListener('touchmove', this._updateInput);
            // Clear clientY property
            this._clientY = undefined;
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
        this.removeEventListener('touchstart', (e) => {});
        this.removeEventListener('touchend', (e) => {});
        this.removeEventListener('touchmove', (e) => {});
    }

    /**
     * @private
     * @method _updateInput
     * @param {MouseEvent|TouchEvent} e The event object
     * @returns null
     */
    _updateInput(e) {

        // Get number input
        const num = (e.target.shadowRoot) ? Helpers.nqs('#numberInput', e.target.shadowRoot) : null;

        // Declare variable for calculated value
        let newValue;

        if (num) {

            if (e.type === 'mousemove' || e.type === 'touchmove') {
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

            // Trigger a re-render
            num.dispatchEvent(new Event('change'));
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

        // Since the diameter of the SVG circle is 100, set the radius to 50
        const r = 50;

        // Get the angle in degrees (-180° to 180°), based on the number input's value
        let angle = (num.value / (.5 * max) - 1) * 180;

        // Cover edge cases (We don't want the circle segment to completely disappear)
        if (val === min) angle = -179;
        else if (val === max) angle = 179;

        // Get x and y coordinates
        const x = r * Math.cos(angle * Math.PI / 180) + r;
        const y = r * Math.sin(angle * Math.PI / 180) + r;

        // Determine the large-arc-flag for the arc syntax
        // see https://www.nan.fyi/svg-paths/arcs
        const laf = (angle > 0) ? 1 : 0;

        // Build the path definition property
        // see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
        const d = `M ${r} ${r} L 0 ${r} A ${r} ${r}, 0, ${laf}, 1, ${x} ${y} Z`;

        // Set the SVG path's definition property
        Helpers.nqs('#outputPath', this.shadowRoot).setAttribute('d', d);

        Helpers.nqs('svg', this.shadowRoot).setAttribute('width', this._config['size']);
        Helpers.nqs('svg', this.shadowRoot).setAttribute('height', this._config['size']);

        Helpers.nqs('#outputLabel', this.shadowRoot).innerText = val;
    }
}

window.customElements.define('oo-input-knob', InputKnob)

export default InputKnob;