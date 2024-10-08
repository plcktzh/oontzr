import Helpers from '../Helpers.js';
import App from './App.js';

const ooInputSpinnerTemplate = document.createElement('template');
ooInputSpinnerTemplate.innerHTML = `
<label></label>
<div class="container">
<button id="decrease"><span class="material-icons">remove</span></button>
<input type="number" id="inputNumber">
<button id="increase"><span class="material-icons">add</span></button>
</div>
`;

const ooInputSpinnerCss = document.createElement('template');
ooInputSpinnerCss.innerHTML = `
<style>
    :host {
        align-items: center;
        display: flex;
        gap: var(--oo-padding-medium);
    }
    
    :host * {
        box-sizing: border-box;
    }

    label {
        color: var(--oo-color-gray-lightest);
        font-size: var(--oo-font-size-label);
    }

    .container {
        display: flex;
    }

    button {
        align-items: center;
        background-color: var(--oo-color-secondary);
        color: var(--oo-color-white);
        border: none;
        display: flex;
        font-size: var(--oo-font-size-label);
        height: 2.5rem;
        justify-content: center;
        transition: all var(--oo-duration-short) ease-in-out, border-bottom-left-radius 0ms;
        width: 2.5rem;
    }

    button#decrease {
        border-bottom-left-radius: 1.25rem;
        border-top-left-radius: 1.25rem;
    }

    button#increase {
        border-bottom-right-radius: 1.25rem;
        border-top-right-radius: 1.25rem;
    }

    input {
        background-color: var(--oo-color-secondary);
        border: none;
        color: var(--oo-color-white);
        text-align: center;
        width: 5rem;
    }
    
    button:hover {
        cursor: pointer;
        background-color: var(--oo-color-secondary-dark);
    }

    .material-icons {
        font-family: var(--oo-font-family-icon);
    }
</style>
`;

/**
 * @class InputSpinner
 * @extends HTMLElement
 */
class InputSpinner extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooInputSpinnerCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooInputSpinnerTemplate.content.cloneNode(true));
    }

    /**
     * @static
     * @returns Array
     */
    static get observedAttributes() {
        return ['data-type', 'data-label', 'data-value'];
    }

    /**
     * @method attributeChangedCallback
     * @param {String} name 
     * @param {String} oldValue 
     * @param {String} newValue 
     */
    attributeChangedCallback(name, oldValue, newValue) {

        switch (name) {
            case 'data-label':
                Helpers.nqs('label', this.shadowRoot).innerHTML = newValue;
                break;
            case 'data-value':
                Helpers.nqs('#inputNumber', this.shadowRoot).value = newValue;
                break;
        }
    }

    /**
     * @callback connectedCallback
     */
    connectedCallback() {

        Helpers.nqs('#decrease', this.shadowRoot).addEventListener('click', (e) => {

            Helpers.nqs('#inputNumber', this.shadowRoot).value = parseFloat(Helpers.nqs('#inputNumber', this.shadowRoot).value) - 1;

            this.dispatchEvent(new CustomEvent(App.EVENT_TYPES.INPUT_CHANGE, {
                detail: {
                    type: this.getAttribute('data-type'),
                    value: Helpers.nqs('#inputNumber', this.shadowRoot).value
                }
            }));

            this.setAttribute('data-value', parseFloat(Helpers.nqs('#inputNumber', this.shadowRoot).value));
        });

        Helpers.nqs('#increase', this.shadowRoot).addEventListener('click', (e) => {

            Helpers.nqs('#inputNumber', this.shadowRoot).value = parseFloat(Helpers.nqs('#inputNumber', this.shadowRoot).value) + 1;

            this.dispatchEvent(new CustomEvent(App.EVENT_TYPES.INPUT_CHANGE, {
                detail: {
                    type: this.getAttribute('data-type'),
                    value: Helpers.nqs('#inputNumber', this.shadowRoot).value
                }
            }));

            this.setAttribute('data-value', parseFloat(Helpers.nqs('#inputNumber', this.shadowRoot).value));
        });

        Helpers.nqs('#inputNumber', this.shadowRoot).addEventListener('change', (e) => {

            this.dispatchEvent(new CustomEvent(App.EVENT_TYPES.INPUT_CHANGE, {
                detail: {
                    type: this.getAttribute('data-type'),
                    value: e.target.value
                }
            }));

            this.setAttribute('data-value', parseFloat(e.target.value));
        });

    }
}

window.customElements.define('oo-input-spinner', InputSpinner);

export default InputSpinner;