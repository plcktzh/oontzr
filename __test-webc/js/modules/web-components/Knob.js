const ooKnobCss = document.createElement('template');
ooKnobCss.innerHTML = `
<style>
    :host {
        background-color: var(--oo-color-gray-lightest);
        border-radius: var(--oo-border-radius);
        display: inline-block;
        margin: var(--oo-margin-small);
    }

    :host * {
        box-sizing: border-box;
    }
    
    #outputContainer {
        cursor: grab;
        padding: var(--oo-padding-medium);
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
        background-color: var(--oo-color-gray-dark);
        border-bottom-left-radius: var(--oo-border-radius);
        border-bottom-right-radius: var(--oo-border-radius);
        color: var(--oo-color-gray-lightest);
        align-items: center;
        padding: var(--oo-padding-base);
        display: flex;
        font-size: var(--oo-font-size-label);
        justify-content: center;
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

const ooKnobTemplate = document.createElement('template');
ooKnobTemplate.innerHTML = `
<input type="number" id="numberInput" min="1" max="64">
<div id="outputContainer">
<div id="outputLabel"></div>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
<defs>
<clipPath id="donut">
<path clip-rule="evenodd" fill="#00f" d="M 50 0 A 50 50, 0, 0, 1, 100 50 A 50 50, 0, 0, 1, 0 50 A 50 50, 0, 0, 1, 50 0 Z M 50 25 A 25 25, 0, 0, 1, 75 50 A 25 25, 0, 0, 1, 25 50 A 25 25, 0, 0, 1, 50 25 Z" />
</clipPath>
</defs>
<g clip-path="url(#donut)">
<circle id="background" cx="50" cy="50" r="50" />
<path id="outputPath" d="M 50 50 L 50 0 A 50 50, 0, 0, 1, 50 0 Z" />
</g>
</svg>
</div>
<label for="numberInput"><slot name="label"></slot></label>
`;

/**
 * @class Knob
 * @extends HTMLElement
 */
class Knob extends HTMLElement {

    /**
     * @constructor
     */
    constructor() {

        super();

        // Build configuration from attributes attached to <oo-knob>
        this._config = {
            value: this.getAttribute('value') ? parseInt(this.getAttribute('value')) : 1,
            min: this.getAttribute('min') ? parseInt(this.getAttribute('min')) : 1,
            max: this.getAttribute('max') ? parseInt(this.getAttribute('max')) : 64,
            graphMin: this.getAttribute('graphMin') ? parseInt(this.getAttribute('graphMin')) : 0,
            graphMax: this.getAttribute('graphMax') ? parseInt(this.getAttribute('graphMax')) : 64
        };

        // Attach shadow root
        this.attachShadow({
            mode: 'open'
        });

        // Append CSS and template to shadow root
        this.shadowRoot.appendChild(ooKnobCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooKnobTemplate.content.cloneNode(true));

        // Configure number input
        this.num = this.shadowRoot.querySelector('#numberInput');
        this.num.setAttribute('min', this._config.min);
        this.num.setAttribute('max', this._config.max);
        this.num.value = this._config.value;
    }

    /**
     * @callback connectedCallback
     */
    connectedCallback() {

        // Add event listener to number input
        this.num.addEventListener('change', (e) => {

            // Prevent value to get out of bounds
            if (e.target.value < this._config.min) e.target.value = this._config.min;
            if (e.target.value > this._config.max) e.target.value = this._config.max;

            // Trigger re-render of component
            this._render();
        });

        // Add mouse event listeners
        this.addEventListener('mousedown', (e) => this.addEventListener('mousemove', this.updateInput));
        this.addEventListener('mouseup', (e) => this.removeEventListener('mousemove', this.updateInput));
        this.addEventListener('mouseout', (e) => this.removeEventListener('mousemove', this.updateInput));

        this.addEventListener('mouseenter', (e) => this.addEventListener('wheel', this.updateInput));
        this.addEventListener('mouseout', (e) => this.removeEventListener('wheel', this.updateInput));

        // Add touch event listeners
        this.addEventListener('touchstart', (e) => {

            // Since TouchEvent doesn't provide a property akin to movementY, we need to save the initial clientY property
            this._clientY = e.touches[0].clientY;
            this.addEventListener('touchmove', this.updateInput);
        });
        this.addEventListener('touchend', (e) => {

            this.removeEventListener('touchmove', this.updateInput);
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
     * @method updateInput
     * @param {MouseEvent|TouchEvent} e The event object
     * @returns null
     */
    updateInput(e) {

        // Get number input
        const num = (e.target.shadowRoot) ? e.target.shadowRoot.querySelector('#numberInput') : null;

        if (num) {

            if (e.type === 'mousemove') {
                // Handling of mouse events

                if (e.movementY) num.value = parseInt(num.value) + Math.round(-.25 * e.movementY);
            } else if (e.type === 'touchmove') {
                // HAndling of touch events

                const currentClientY = e.changedTouches[0].clientY;

                // deltaY basically is a custom movementY for touch events
                const deltaY = (currentClientY && e.target._clientY) ? currentClientY - e.target._clientY : 0;

                // Update _clientY with the current y position
                e.target._clientY = currentClientY;

                num.value -= Math.round(.25 * deltaY);
            } else if (e.type === 'wheel') {
                // Handling of scroll wheel events

                num.value -= Math.round(.025 * e.deltaY);
            }

            // Trigger a re-render
            num.dispatchEvent(new Event('change'));
        }
    }

    /**
     * @method _render
     * @returns null
     */
    _render() {

        // Get number input
        const num = this.shadowRoot.querySelector('#numberInput');

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
        this.shadowRoot.querySelector('#outputPath').setAttribute('d', d);

        // Set the text of the value label, add leading 0 if val is lower than 10
        this.shadowRoot.querySelector('#outputLabel').innerText = (val < 10) ? `0${val}` : val;
    }
}

window.customElements.define('oo-knob', Knob)

export default Knob;