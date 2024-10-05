import App from './App.js';
import Helpers from '../Helpers.js';

const ooAppHeaderTemplate = document.createElement('template');
ooAppHeaderTemplate.innerHTML = `
<div class="outer">
    <div class="inner">
        <oo-logo position="header"></oo-logo>
    </div>
</div>
`;

const ooAppHeaderCss = document.createElement('template');
ooAppHeaderCss.innerHTML = `
<style>
    :host {
        background-color: var(--oo-color-gray-lightest);
        left: 0;
        padding: var(--oo-padding-base);
        position: fixed;
        top: 0;
        width: 100%;
    }

    :host * {
        box-sizing: border-box;
    }

    .outer {
        background-color: var(--oo-color-gray-dark);
        border-radius: var(--oo-border-radius);
        width: 100%;
    }
    
    .inner {
        display: flex;
        gap: var(--oo-margin-base);
        justify-content: space-between;
        margin: 0 auto;
        max-width: 1600px;
        width: 100%;
    }

    oo-input-dropdown {
        position: absolute;
        right: 1.375rem;
        top: 1.375rem;
    }
</style>
`;
class AppHeader extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooAppHeaderCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooAppHeaderTemplate.content.cloneNode(true));
    }

    connectedCallback() {

        this._createAddPatternButton();

        // Helpers.nqs('body').style.paddingTop = `${this.getBoundingClientRect().height + 16}px`;
    }

    _createAddPatternButton() {

        const app = Helpers.nqs('oo-app');

        this.addPatternButton = Helpers.dce('oo-input-dropdown');
        this.addPatternButton.setAttribute('data-type', 'add-pattern');
        this.addPatternButton.setAttribute('data-expanded', 'false');
        this.addPatternButton.setAttribute('data-label-toggle', `${App.STRINGS[Helpers.getLanguage(app._s.language)]['SELECT_PATTERN_TYPE_LABEL']}`);
        this.addPatternButton.setAttribute('data-label-submit', `${App.STRINGS[Helpers.getLanguage(app._s.language)]['BUTTON_ADD_PATTERN_LABEL']}`);

        for (const patternType in App.PATTERN_TYPES) {
            this.addPatternButton.innerHTML += `
            <span class="dropdown-item" data-value="${App.PATTERN_TYPES[patternType].TYPE}">${App.STRINGS[Helpers.getLanguage(app._s.language)]['PATTERN_TYPES'][patternType]}</span>`;
        }

        Helpers.nac(this.shadowRoot, this.addPatternButton);

        this.addPatternButton.addEventListener('dropdown-submit', (e) => {

            if (e.detail.type === 'add-pattern') {
                try {
                    Helpers.nac(Helpers.nqs('oo-app-main', app.shadowRoot).shadowRoot, app._s.createPattern({
                        type: e.detail.selected
                    }));
                } catch (e) {
                    console.error(`Pattern could not be appended. ${e}`);
                }
            }
        });
    }
}

window.customElements.define('oo-app-header', AppHeader);

export default AppHeader;