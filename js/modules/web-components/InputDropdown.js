import Helpers from '../Helpers.js';
import App from './App.js';

const ooInputDropdownTemplate = document.createElement('template');
ooInputDropdownTemplate.innerHTML = `
<div>
<button id="toggle">
<span class="label">Toggle Dropdown</span>
<span class="material-icons">keyboard_arrow_down</span>
</button>
<nav>
<slot></slot>
</nav>
</div>
<button id="submit">
<span class="label">Submit</span>
<span class="material-icons">add</span>
</button>
`;

const ooInputDropdownCss = document.createElement('template');
ooInputDropdownCss.innerHTML = `
<style>
    :host {
        display: flex;
    }

    :host * {
        box-sizing: border-box;
    }

    :host([data-expanded="false"]) nav {
        display: none;
    }
    
    :host([data-expanded="true"]) nav {
        background-color: var(--oo-color-secondary-light);
        box-shadow: inset 0 .75rem 1rem -1rem rgba(0, 0, 0, .5);
        display: block;
        font-size: var(--oo-font-size-label);
    }
    
    :host([data-expanded="true"]) ::slotted(span) {
        box-shadow: inset -1rem 0 .25rem -1rem rgba(0, 0, 0, .5);
        color: var(--oo-color-black);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        padding: var(--oo-padding-base) var(--oo-padding-medium);
        transition: all var(--oo-duration-short) ease-in-out;
    }
    
    :host([data-expanded="true"]) ::slotted(:hover) {
        background-color: var(--oo-color-secondary-dark);
        color: var(--oo-color-white);
    }
    
    :host([data-expanded="true"]) button#toggle {
        background-color: var(--oo-color-secondary-light);
        color: var(--oo-color-black);
        border-bottom-left-radius: unset;
    }

    button {
        align-items: center;
        background-color: var(--oo-color-secondary);
        color: var(--oo-color-white);
        border: none;
        display: flex;
        justify-content: space-between;
        font-size: var(--oo-font-size-label);
        height: 2.5rem;
        padding: var(--oo-padding-medium);
        transition: all var(--oo-duration-short) ease-in-out, border-bottom-left-radius 0ms;
    }
    
    button:hover {
        cursor: pointer;
        background-color: var(--oo-color-secondary-dark);
    }
    
    button#toggle {
        box-shadow: inset -1rem 0 .25rem -1rem rgba(255, 255, 255, .5);
        border-bottom-left-radius: 1.25rem;
        border-top-left-radius: 1.25rem;
    }

    :host([data-expanded="true"]) button#toggle,
    button#toggle:hover {
        box-shadow: inset -1rem 0 .25rem -1rem rgba(0, 0, 0, .5);
    }
    
    :host([data-expanded="true"]) button#toggle:hover {
        background-color: var(--oo-color-secondary-dark);
        color: var(--oo-color-white);
    }
    
    button#submit {
        box-shadow: inset 1rem 0 .25rem -1rem rgba(13, 13, 13, .5);
        border-bottom-right-radius: 1.25rem;
        border-top-right-radius: 1.25rem;
    }

    button[disabled] {
        background-color: var(--oo-color-secondary-light);
        color: var(--oo-color-secondary-dark);
        cursor: not-allowed;
    }

    .material-icons {
        font-family: var(--oo-font-family-icon);
        margin-left: var(--oo-margin-medium);
    }
</style>
`;

class InputDropdown extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooInputDropdownCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooInputDropdownTemplate.content.cloneNode(true));
    }

    connectedCallback() {

        Helpers.nqs('#toggle', this.shadowRoot).style.width = `${Helpers.nqs('#toggle', this.shadowRoot).getBoundingClientRect().width}px`;

        Helpers.nqs('#toggle', this.shadowRoot).addEventListener('click', (e) => {

            const isExpanded = (this.getAttribute('data-expanded') === 'false') ? false : true;
            this.setAttribute('data-expanded', `${!isExpanded}`);
        });

        Helpers.nqs(':host slot', this.shadowRoot).assignedElements().forEach(item => {

            item.addEventListener('click', (e) => {
                this.setAttribute('data-selected', (e.target.getAttribute('data-value')));
            });
        });

        Helpers.nqs('#submit', this.shadowRoot).setAttribute('disabled', 'disabled');
        Helpers.nqs('#submit', this.shadowRoot).addEventListener('click', (e) => {

            this.dispatchEvent(new CustomEvent(App.EVENT_TYPES.DROPDOWN_SUBMIT, {
                detail: {
                    type: this.getAttribute('data-type'),
                    selected: this.getAttribute('data-selected')
                }
            }));
        });
    }

    disconnectedCallback() {

        Helpers.nqs('#toggle', this.shadowRoot).removeEventListener('click', (e) => {});
        Helpers.nqs(':host slot', this.shadowRoot).assignedElements().forEach(item => {

            item.removeEventListener('click', (e) => {});
        });
        Helpers.nqs('#submit', this.shadowRoot).removeEventListener('click', (e) => {});
    }

    static get observedAttributes() {
        return ['data-expanded', 'data-label-toggle', 'data-label-submit', 'data-selected'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        switch (name) {
            case 'data-expanded':
                Helpers.nqs('.material-icons', this.shadowRoot).innerText = (newValue === 'true') ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
                break;
            case 'data-label-toggle':
                Helpers.nqs('#toggle .label', this.shadowRoot).innerText = newValue;
                break;
            case 'data-label-submit':
                Helpers.nqs('#submit .label', this.shadowRoot).innerText = newValue;
                break;
            case 'data-selected':
                Helpers.nqs('#toggle .label', this.shadowRoot).innerText = App.STRINGS[Helpers.getLanguage(Helpers.nqs('oo-app')._s.language)]['PATTERN_TYPES'][newValue.toUpperCase()];
                Helpers.nqs(':host slot', this.shadowRoot).assignedElements().forEach(item => {

                    if (item.getAttribute('data-value') === newValue) {

                        const spanIcon = Helpers.dce('span');
                        spanIcon.style.fontFamily = 'var(--oo-font-family-icon)';
                        spanIcon.innerText = 'check';

                        Helpers.nac(item, spanIcon);
                    }

                    if (item.getAttribute('data-value') === oldValue) Helpers.nqs('span', item).remove();

                });
                Helpers.nqs('#submit', this.shadowRoot).removeAttribute('disabled');
                setTimeout(() => this.setAttribute('data-expanded', 'false'), 500);
                break;
        }
    }
}

window.customElements.define('oo-input-dropdown', InputDropdown);

export default InputDropdown;