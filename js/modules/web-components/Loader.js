import Helpers from '../Helpers.js';
import Logo from './Logo.js';

const ooLoaderCss = document.createElement('template');
ooLoaderCss.innerHTML = `
<style>
    :host {
        align-items: center;
        background-color: var(--oo-color-primary);
        bottom: 0;
        display: flex;
        justify-content: center;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: all var(--oo-duration-base) ease-in-out;
        z-index: 9999;
    }

    :host * {
        box-sizing: border-box;
    }
</style>`;

const ooLoaderTemplate = document.createElement('template');
ooLoaderTemplate.innerHTML = `<oo-logo></oo-logo>`;

class Loader extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooLoaderCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooLoaderTemplate.content.cloneNode(true));
    }

    detach() {

        setTimeout(() => this.style.opacity = 0, 1000, this);
        setTimeout(() => this.remove(), 1500, this);
    }
}

window.customElements.define('oo-loader', Loader);

export default Loader;