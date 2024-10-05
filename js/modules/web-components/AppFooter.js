import Helpers from '../Helpers.js';

const ooAppFooterTemplate = document.createElement('template');
ooAppFooterTemplate.innerHTML = `
<div class="outer">
    <div class="inner">
        AppFooter
    </div>
</div>
`;

const ooAppFooterCss = document.createElement('template');
ooAppFooterCss.innerHTML = `
<style>
    :host {
        background-color: var(--oo-color-gray-lightest);
        bottom: 0;
        left: 0;
        padding: var(--oo-padding-base);
        position: fixed;
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
</style>
`;

class AppFooter extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooAppFooterCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooAppFooterTemplate.content.cloneNode(true));
    }

    connectedCallback() {

        console.log(Helpers.nqs('oo-app'));

        // Helpers.nqs('body').style.paddingBottom = `${this.getBoundingClientRect().height + 16}px`;
    }
}

window.customElements.define('oo-app-footer', AppFooter);

export default AppFooter;