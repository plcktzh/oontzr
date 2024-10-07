import App from './App.js';
import Helpers from '../Helpers.js';
import Playback from '../Playback.js';

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
        z-index: 9989;
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
        z-index: 9999;
    }

    oo-input-spinner {
        position: absolute;
        left: 50%;
        top: 1.375rem;
        z-index: 9999;
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
    }

    _createAddPatternButton() {

        const app = Helpers.nqs('oo-app');

        this.tempoInput = Helpers.dce('oo-input-spinner');
        this.tempoInput.setAttribute('data-type', 'set-tempo');
        this.tempoInput.setAttribute('data-label', App.STRINGS[Helpers.getLanguage(app._s.language)]['TEMPO_LABEL']);
        this.tempoInput.setAttribute('data-value', app._s.playback.tempo.bpm);

        Helpers.nac(Helpers.nqs('.inner', this.shadowRoot), this.tempoInput);

        this.tempoInput.addEventListener('input-change', (e) => {

            if (e.detail.type === 'set-tempo') {
                try {
                    app._s.playback.tempo.bpm = parseFloat(e.detail.value);
                    app._s.playback.tempo.msPerStep = Playback.getMilliseconds(parseFloat(e.detail.value));
                } catch (e) {
                    console.error(`Tempo could not be set. ${e}`);
                }

                console.log(app._s.playback.tempo);
            }
        });


        this.addPatternButton = Helpers.dce('oo-input-dropdown');
        this.addPatternButton.setAttribute('data-type', 'add-pattern');
        this.addPatternButton.setAttribute('data-expanded', 'false');
        this.addPatternButton.setAttribute('data-label-toggle', `${App.STRINGS[Helpers.getLanguage(app._s.language)]['SELECT_PATTERN_TYPE_LABEL']}`);
        this.addPatternButton.setAttribute('data-label-submit', `${App.STRINGS[Helpers.getLanguage(app._s.language)]['BUTTON_ADD_PATTERN_LABEL']}`);

        for (const patternType in App.PATTERN_TYPES) {
            this.addPatternButton.innerHTML += `
            <span class="dropdown-item" data-value="${App.PATTERN_TYPES[patternType].TYPE}">${App.STRINGS[Helpers.getLanguage(app._s.language)]['PATTERN_TYPES'][patternType]}</span>`;
        }

        Helpers.nac(Helpers.nqs('.inner', this.shadowRoot), this.addPatternButton);

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