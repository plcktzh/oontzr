const ooPatternLaneTemplate = document.createElement('template');
ooPatternLaneTemplate.innerHTML = ``;

const ooPatternLaneCss = document.createElement('template');
ooPatternLaneCss.innerHTML = `
<style>
    :host {
    }

    :host * {
        box-sizing: border-box;
    }
</style>
`;

class PatternLane extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooPatternLaneCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooPatternLaneTemplate.content.cloneNode(true));
    }
}

window.customElements.define('oo-pattern-lane', PatternLane);

export default PatternLane;