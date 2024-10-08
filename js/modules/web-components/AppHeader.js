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
        z-index: 9998;
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
        gap: calc(5 * var(--oo-margin-base));
        justify-content: flex-start;
        margin: 0 auto;
        max-width: 1600px;
        width: 100%;
    }

    button {
        align-items: center;
        background-color: var(--oo-color-secondary);
        color: var(--oo-color-white);
        border: none;
        border-radius: 1.25rem;
        display: flex;
        font-size: var(--oo-font-size-label);
        justify-content: space-between;
        font-size: var(--oo-font-size-label);
        height: 2.5rem;
        margin: auto 0;
        padding: var(--oo-padding-medium);
        transition: all var(--oo-duration-short) ease-in-out, border-bottom-left-radius 0ms;
        width: 6rem;
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

    oo-input-dropdown {
        position: absolute;
        right: 1.375rem;
        top: 1.375rem;
        z-index: 9999;
    }
</style>
`;
class AppHeader extends HTMLElement {

    constructor(parent) {
        super();

        this.parent = parent;

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooAppHeaderCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooAppHeaderTemplate.content.cloneNode(true));
    }

    connectedCallback() {

        this._createAddPatternButton();
    }

    static get observedAttributes() {
        return ['data-oo-is-playing'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if (name === 'data-oo-is-playing') {

            if (newValue === 'true') {

                Helpers.nac(Helpers.nqs('.inner', this.shadowRoot), this.pauseButton);
                this.playButton.remove();
            } else {

                Helpers.nac(Helpers.nqs('.inner', this.shadowRoot), this.playButton);
                this.pauseButton.remove();
            }
        }
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
            }
        });

        this.playButton = Helpers.dce('button');
        this.playButton.innerHTML = `<span class="label">${App.STRINGS[Helpers.getLanguage(app._s.language)]['BUTTON_PLAY_LABEL']}</span><span class="material-icons">play_arrow</span>`;
        this.playButton.addEventListener('click', (e) => {

            this.parent.play(true);
        });

        Helpers.nac(Helpers.nqs('.inner', this.shadowRoot), this.playButton);

        this.pauseButton = Helpers.dce('button');
        this.pauseButton.innerHTML = `<span class="label">${App.STRINGS[Helpers.getLanguage(app._s.language)]['BUTTON_PAUSE_LABEL']}</span><span class="material-icons">pause</span>`;
        this.pauseButton.addEventListener('click', (e) => {

            this.parent.pause();
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