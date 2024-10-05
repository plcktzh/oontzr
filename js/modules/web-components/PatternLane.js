import Helpers from '../Helpers.js';
import App from './App.js';
import Step from './Step.js';

const ooPatternLaneTemplate = document.createElement('template');
ooPatternLaneTemplate.innerHTML = `
<div class="steps-container"></div>
`;

const ooPatternLaneCss = document.createElement('template');
ooPatternLaneCss.innerHTML = `
<style>
    :host {
    }

    :host * {
        box-sizing: border-box;
    }

    .steps-container {
        background-color: var(--oo-color-gray-lightest);
        border-radius: var(--oo-border-radius);
        display: grid;
        grid-template-columns: repeat(16, 1fr);
        grid-template-rows: auto;
        grid-column-gap: var(--oo-padding-base);
        grid-row-gap: var(--oo-padding-base);
        max-width: 650px;
        padding: var(--oo-padding-base);
        width: 100%;
    }
</style>
`;

class PatternLane extends HTMLElement {

    constructor(parent) {
        super();

        this.parent = parent;

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooPatternLaneCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooPatternLaneTemplate.content.cloneNode(true));
    }

    connectedCallback() {

        this.setAttribute('data-oo-represents-pattern', this.parent.id);
    }

    static get observedAttributes() {
        return ['data-oo-represents-pattern'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if (name === 'data-oo-represents-pattern') {

            if (this.parent.parameters.type === App.PATTERN_TYPES.TR.TYPE) console.log(App.PATTERN_TYPES.TR.TYPE);
        }

        this._render();

        //     // For TR style Patterns, add an event listener for mouse clicks
        //     if (this.parameters.type === App.PATTERN_TYPES.TR.TYPE) this.output.canvas.addEventListener('click', (e) => {

        //         // Get mouse's coordinates in relation to the canvas' position in the browser window
        //         const mouseCoordinates = {
        //             x: e.clientX - this.output.canvas.getBoundingClientRect().x,
        //             y: e.clientY - this.output.canvas.getBoundingClientRect().y
        //         };

        //         // Check which Step has been clicked
        //         const {
        //             index,
        //             step
        //         } = Helpers.checkClickedStep(mouseCoordinates, this.steps, App.CANVAS_ATTRIBUTES);

        //         // "Invert" the Step that was clicked
        //         if (step) {

        //             this.steps[index] = new Step({
        //                 isActive: !step.isActive,
        //                 velocity: (step.isActive) ? 0 : 127
        //             });

        //             // Update canvas
        //             this.drawPattern();
        //         }
        //     });
    }

    _render() {

        const stepsContainer = Helpers.nqs('.steps-container', this.shadowRoot);

        this.parent.steps.forEach((step, index) => {

            step.setAttribute('data-oo-step-velocity', step.velocity);
            step.setAttribute('data-oo-step-height', App.CANVAS_ATTRIBUTES.STEP_HEIGHT);
            step.setAttribute('data-oo-step-width', App.CANVAS_ATTRIBUTES.STEP_WIDTH);

            Helpers.nac(stepsContainer, step);
        });
    }
}

window.customElements.define('oo-pattern-lane', PatternLane);

export default PatternLane;