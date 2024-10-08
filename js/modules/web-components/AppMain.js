const ooAppMainTemplate = document.createElement('template');
ooAppMainTemplate.innerHTML = ``;

const ooAppMainCss = document.createElement('template');
ooAppMainCss.innerHTML = `
<style>
    :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: var(--oo-margin-base);
        justify-content: flex-start;
    }

    :host * {
        box-sizing: border-box;
    }
</style>
`;

class AppMain extends HTMLElement {

    constructor(parent) {
        super();

        this.parent = parent;

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooAppMainCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooAppMainTemplate.content.cloneNode(true));
    }
}

window.customElements.define('oo-app-main', AppMain);

export default AppMain;