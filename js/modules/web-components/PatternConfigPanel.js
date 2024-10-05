const ooPatternConfigPanelTemplate = document.createElement('template');
ooPatternConfigPanelTemplate.innerHTML = ``;

const ooPatternConfigPanelCss = document.createElement('template');
ooPatternConfigPanelCss.innerHTML = `
<style>
    :host {
    }

    :host * {
        box-sizing: border-box;
    }
</style>
`;

class PatternConfigPanel extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooPatternConfigPanelCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooPatternConfigPanelTemplate.content.cloneNode(true));
    }
}

window.customElements.define('oo-pattern-config-panel', PatternConfigPanel);

export default PatternConfigPanel;