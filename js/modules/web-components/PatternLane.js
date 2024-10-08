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

        this.parent.addEventListener('steps-change', (e) => {

            const stepsContainer = Helpers.nqs('.steps-container', this.shadowRoot);

            Helpers.nqsa('oo-pattern-step', stepsContainer).forEach((step, index) => {
                step.setAttribute('data-oo-step-velocity', this.parent.steps[index].velocity);
                step.setAttribute('data-oo-step-is-active', this.parent.steps[index].isActive);
            });
        });
    }

    render() {

        const stepsContainer = Helpers.nqs('.steps-container', this.shadowRoot);

        Helpers.nqsa('oo-pattern-step', stepsContainer).forEach(step => step.remove());

        this.parent.steps.forEach((step, index) => {

            Helpers.nac(stepsContainer, step);

            step.setAttribute('data-oo-step-velocity', step.velocity);
            step.setAttribute('data-oo-step-is-active', step.isActive);
            step.setAttribute('data-oo-step-index', index);
        });
    }

    static get observedAttributes() {

        return ['data-oo-step-current'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if (name === 'data-oo-step-current') {
            if (oldValue && Helpers.nqs(`[data-oo-step-index="${oldValue}"]`, this.shadowRoot)) Helpers.nqs(`[data-oo-step-index="${oldValue}"]`, this.shadowRoot).removeAttribute('style');
            Helpers.nqs(`[data-oo-step-index="${newValue}"]`, this.shadowRoot).setAttribute('style', '--oo-color-primary: var(--oo-color-secondary); --oo-color-gray-light: var(--oo-color-secondary-light)');
        }
    }
}

window.customElements.define('oo-pattern-lane', PatternLane);

export default PatternLane;