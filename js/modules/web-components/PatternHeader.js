import Helpers from '../Helpers.js';
import App from './App.js';
import InputDropdown from './InputDropdown.js';

const ooPatternHeaderCss = document.createElement('template');
ooPatternHeaderCss.innerHTML = `
<style>
    :host {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    
    :host * {
        box-sizing: border-box;
    }

    #sampleContainer {
        position: relative;
    }

    oo-input-dropdown {
        position: absolute;
        z-index: 9989;
    }

    button {
        align-items: center;
        background-color: var(--oo-color-secondary);
        color: var(--oo-color-white);
        border: none;
        border-radius: 1.25rem;
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

const ooPatternHeaderTemplate = document.createElement('template');
ooPatternHeaderTemplate.innerHTML = `
<div id="sampleContainer"></div>
<button id="delete">
<span class="label">Delete pattern</span>
<span class="material-icons">delete</span>
</button>
`;

class PatternHeader extends HTMLElement {

    constructor(parent) {
        super();

        this.parent = parent;

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooPatternHeaderCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooPatternHeaderTemplate.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['data-label-delete'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        switch (name) {

            case 'data-label-delete':
                Helpers.nqs('#delete .label', this.shadowRoot).innerText = newValue;
                break;
        }

    }

    connectedCallback() {

        const app = Helpers.nqs('oo-app');

        this.setSampleButton = Helpers.dce('oo-input-dropdown');
        this.setSampleButton.setAttribute('data-type', 'set-sample');
        this.setSampleButton.setAttribute('data-expanded', 'false');
        this.setSampleButton.setAttribute('data-label-toggle', `${App.STRINGS[Helpers.getLanguage(app._s.language)]['SELECT_SAMPLE_LABEL']}`);
        this.setSampleButton.setAttribute('data-label-submit', `${App.STRINGS[Helpers.getLanguage(app._s.language)]['BUTTON_SET_SAMPLE_LABEL']}`);

        for (const sample in app._s.samples) {
            this.setSampleButton.innerHTML += `<span class="dropdown-item" data-value="${app._s.samples[sample].id}">${app._s.samples[sample].name}</span>`;
        }

        Helpers.nac(Helpers.nqs('#sampleContainer', this.shadowRoot), this.setSampleButton);

        this.setSampleButton.addEventListener('dropdown-submit', (e) => {

            if (e.detail.type === 'set-sample') {
                try {
                    this.parent.setSample(e.detail.selected);
                } catch (e) {
                    console.error(`Sample could not be set for pattern #${this.parent.id}. ${e}`);
                }
            }
        });

        this.setAttribute('data-label-delete', App.STRINGS[Helpers.getLanguage(app._s.language)]['BUTTON_DELETE_PATTERN_LABEL']);
        Helpers.nqs('#delete', this.shadowRoot).addEventListener('click', (e) => {

            this.parent.parent.parent._s.deletePattern(this.parent);
        });

    }

    disconnectedCallback() {

    }
}

window.customElements.define('oo-pattern-header', PatternHeader);

export default PatternHeader;