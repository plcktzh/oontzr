import Helpers from '../Helpers.js';
import App from './App.js';

const ooInputSwitchTemplate = document.createElement('template');
ooInputSwitchTemplate.innerHTML = `
<label for="toggle">
<span class="material-icons"></span>
<input type="checkbox" id="toggle">
<slot name="label"></slot>
</label>
`;

const ooInputSwitchCss = document.createElement('template');
ooInputSwitchCss.innerHTML = `
<style>
    :host {
        display: flex;
    }

    :host * {
        box-sizing: border-box;
    }

    .material-icons {
        font-family: var(--oo-font-family-icon);
        margin-left: var(--oo-margin-medium);
    }
</style>
`;

class InputSwitch extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooInputSwitchCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooInputSwitchTemplate.content.cloneNode(true));
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }

    static get observedAttributes() {
        return ['data-checked', 'label'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        switch (name) {

            case 'label':
                Helpers.nqs('slot[name="label"]', this.shadowRoot).innerHTML = newValue;
                break;
        }

        if (name === 'data-checked') {
            console.log(newValue);
        }
    }
}

window.customElements.define('oo-input-switch', InputSwitch);

export default InputSwitch;