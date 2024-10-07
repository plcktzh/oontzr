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
        grid-template-columns: repeat(64, 1fr);
        grid-template-rows: auto;
        grid-column-gap: var(--oo-padding-base);
        grid-row-gap: var(--oo-padding-base);
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
    }

    _render() {

        const stepsContainer = Helpers.nqs('.steps-container', this.shadowRoot);

        this.parent.steps.forEach((step, index) => {

            step.setAttribute('data-oo-step-is-active', step.isActive);
            step.setAttribute('data-oo-step-velocity', step.velocity);

            Helpers.nac(stepsContainer, step);
        });
    }
}

window.customElements.define('oo-pattern-lane', PatternLane);

export default PatternLane;