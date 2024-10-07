import Helpers from '../Helpers.js';
import App from './App.js';

const ooInputSwitchTemplate = document.createElement('template');
ooInputSwitchTemplate.innerHTML = `
<label for="toggle">
<div id="outputContainer">
    <div id="switch"></div>
    <div id="outputLabel"></div>
</div>
<input type="checkbox" id="toggle">
<span><slot name="label"></slot></span>
</label>
`;

const ooInputSwitchCss = document.createElement('template');
ooInputSwitchCss.innerHTML = `
<style>
    :host {
        background-color: var(--oo-color-gray-lightest);
        border-radius: var(--oo-border-radius);
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
    }

    :host * {
        box-sizing: border-box;
    }
    
    #outputContainer {
        align-items: center;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        gap: var(--oo-margin-base);
        padding: var(--oo-padding-base);
        position: relative;
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
    }

    #switch {
        background-color: var(--oo-color-gray-light);
        border: .2rem var(--oo-color-gray-light) solid;
        border-radius: 1.2rem;
        display: block;
        height: 2rem;
        padding: var(--oo-padding-medium);
        overflow: hidden;
        position: relative;
        transition: * var(--oo-duration-base) ease-in-out;
        width: 5rem;
    }

    #switch::after {
        background-color: var(--oo-color-gray-medium);
        border-radius: 50%;
        content: '';
        height: 2rem;
        left: 0;
        position: absolute;
        top: 0;
        transition: * var(--oo-duration-base) ease-in-out;
        width: 2rem;
    }

    :host([value="true"]) #switch {
        background-color: var(--oo-color-primary-light);
        border-color: var(--oo-color-primary-light);
    }
    
    :host([value="true"]) #switch::after {
        background-color: var(--oo-color-primary);
        left: unset;
        right: 0;
    }

    label {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
    }

    label span {
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

    label input {
        display: none;
    }

    label span::selection {
        background: none;
    }
</style>
`;

class InputSwitch extends HTMLElement {

    constructor(parent) {
        super();

        this.parent = parent;

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooInputSwitchCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooInputSwitchTemplate.content.cloneNode(true));
    }

    connectedCallback() {

        Helpers.nqs('#toggle', this.shadowRoot).addEventListener('change', (e) => {
            this.setAttribute('value', (e.target.checked) ? 'true' : 'false');
            this.parent.setAttribute('data-oo-pattern-control-input-value', this.getAttribute('value'));
        });
    }

    disconnectedCallback() {

    }

    static get observedAttributes() {
        return ['value', 'label'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        switch (name) {

            case 'label':
                Helpers.nqs('slot[name="label"]', this.shadowRoot).innerHTML = newValue;
                break;
        }

        if (name === 'value') {
            Helpers.nqs('#toggle', this.shadowRoot).checked = (newValue === 'true') ? true : false;
            Helpers.nqs('#outputLabel', this.shadowRoot).innerHTML = (newValue === 'true') ? App.STRINGS[Helpers.getLanguage(Helpers.nqs('oo-app')._s.language)].PATTERN_PARAMETERS.ON : App.STRINGS[Helpers.getLanguage(Helpers.nqs('oo-app')._s.language)].PATTERN_PARAMETERS.OFF;
        }
    }
}

window.customElements.define('oo-input-switch', InputSwitch);

export default InputSwitch;