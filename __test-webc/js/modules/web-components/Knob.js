const ooKnobCss = document.createElement('template');
ooKnobCss.innerHTML = `
<style>
    :host {
        background-color: var(--oo-color-gray-lightest);
        border-radius: var(--oo-border-radius);
        display: inline-block;
        margin: var(--oo-margin-small);
    }

    :host * {
        box-sizing: border-box;
    }
    
    #outputContainer {
        cursor: grab;
        padding: var(--oo-padding-medium);
        position: relative;
    }

    #outputLabel {
        align-items: center;
        display: flex;
        font-size: var(--oo-font-size-label);
        height: 50%;
        justify-content: center;
        left: 25%;
        position: absolute;
        top: 25%;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 50%;
    }

    label {
        background-color: var(--oo-color-gray-dark);
        border-bottom-left-radius: var(--oo-border-radius);
        border-bottom-right-radius: var(--oo-border-radius);
        color: var(--oo-color-gray-lightest);
        align-items: center;
        padding: var(--oo-padding-base);
        display: flex;
        font-size: var(--oo-font-size-label);
        justify-content: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 100%;
    }

    #outputLabel::selection,
    label::selection {
        background: none;
    }

    input[type="number"] {
        display: none;
    }

    svg {
        display: block;
    }

    svg #background {
        fill: var(--oo-color-gray-light);
    }
    
    svg #outputPath {
        fill: var(--oo-color-primary);
    }
</style>
`;

const ooKnobTemplate = document.createElement('template');
ooKnobTemplate.innerHTML = `
<input type="number" id="numberInput" min="1" max="64">
<div id="outputContainer">
<div id="outputLabel"></div>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
<defs>
<clipPath id="donut">
<path clip-rule="evenodd" fill="#00f" d="M 50 0 A 50 50, 0, 0, 1, 100 50 A 50 50, 0, 0, 1, 0 50 A 50 50, 0, 0, 1, 50 0 Z M 50 25 A 25 25, 0, 0, 1, 75 50 A 25 25, 0, 0, 1, 25 50 A 25 25, 0, 0, 1, 50 25 Z" />
</clipPath>
</defs>
<g clip-path="url(#donut)">
<circle id="background" cx="50" cy="50" r="50" />
<path id="outputPath" d="M 50 50 L 50 0 A 50 50, 0, 0, 1, 50 0 Z" />
</g>
</svg>
</div>
<label for="numberInput"><slot name="label"></slot></label>
`;

class Knob extends HTMLElement {

    constructor() {
        super();

        this._config = {};
        this._config['value'] = this.getAttribute('value') ? parseInt(this.getAttribute('value')) : 1;
        this._config['min'] = this.getAttribute('min') ? parseInt(this.getAttribute('min')) : 1;
        this._config['max'] = this.getAttribute('max') ? parseInt(this.getAttribute('max')) : 64;
        this._config['graphMin'] = this.getAttribute('graphMin') ? parseInt(this.getAttribute('graphMin')) : 1;
        this._config['graphMax'] = this.getAttribute('graphMax') ? parseInt(this.getAttribute('graphMax')) : 64;

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooKnobCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooKnobTemplate.content.cloneNode(true));

        this.num = this.shadowRoot.querySelector('#numberInput');
        this.num.setAttribute('min', this._config.min);
        this.num.setAttribute('max', this._config.max);
        this.num.value = this._config.value;
    }

    connectedCallback() {
        this.num.addEventListener('change', (e) => {

            if (e.target.value < parseInt(e.target.getAttribute('min'))) e.target.value = parseInt(e.target.getAttribute('min'));
            if (e.target.value > parseInt(e.target.getAttribute('max'))) e.target.value = parseInt(e.target.getAttribute('max'));

            this._render();
        });

        this.addEventListener('mousedown', (e) => this.addEventListener('mousemove', this.handleMouseMove));
        this.addEventListener('mouseup', (e) => this.removeEventListener('mousemove', this.handleMouseMove));
        this.addEventListener('mouseout', (e) => this.removeEventListener('mousemove', this.handleMouseMove));

        this.addEventListener('touchstart', (e) => {
            this._clientY = e.touches[0].clientY;
            this.addEventListener('touchmove', this.handleMouseMove);
        }, {
            passive: true
        });
        this.addEventListener('touchend', (e) => {
            this.removeEventListener('touchmove', this.handleMouseMove);
            this._clientY = undefined;
        });

        this._render();
    }

    disconnectedCallback() {
        this.removeEventListener('mousedown', (e) => {});
        this.removeEventListener('mouseup', (e) => {});
        this.removeEventListener('mousemove', (e) => {});
        this.removeEventListener('mouseout', (e) => {});
        this.removeEventListener('touchstart', (e) => {});
        this.removeEventListener('touchend', (e) => {});
        this.removeEventListener('touchmove', (e) => {});
    }

    handleMouseMove(e) {

        let _target;

        document.querySelectorAll('oo-knob').forEach(item => {
            if (item === e.target) {
                _target = item;
                return;
            }
        });

        if (_target !== undefined) {

            if (e.type === 'mousemove') {

                if (e.movementY) e.target.shadowRoot.querySelector('#numberInput').value = parseInt(e.target.shadowRoot.querySelector('#numberInput').value) + Math.round(-.25 * e.movementY);
            } else if (e.type === 'touchmove') {

                const deltaY = (e.changedTouches[0].clientY && e.target._clientY) ? e.changedTouches[0].clientY - e.target._clientY : 0;

                e.target._clientY = e.changedTouches[0].clientY;
                e.target.shadowRoot.querySelector('#numberInput').value -= Math.round(.25 * deltaY);
            }

            e.target.shadowRoot.querySelector('#numberInput').dispatchEvent(new Event('change'));
        }
    }

    _render() {

        const val = parseInt(this.shadowRoot.querySelector('#numberInput').value);
        const min = this._config.graphMin;
        const max = this._config.graphMax;
        const r = 50;

        let amount = ((this.shadowRoot.querySelector('#numberInput').value - 1) / (.5 * max) - 1) * 180;

        if (val === min) amount = -179;
        else if (val === max) amount = 179;

        const x = r * Math.cos(amount * Math.PI / 180) + r;
        const y = r * Math.sin(amount * Math.PI / 180) + r;
        const laf = (amount > 0) ? 1 : 0;

        const d = `M ${r} ${r} L 0 ${r} A ${r} ${r}, 0, ${laf}, 1, ${x} ${y} Z`;

        this.shadowRoot.querySelector('#outputPath').setAttribute('d', d);
        this.shadowRoot.querySelector('#outputLabel').innerHTML = (val < 10) ? `0${val}` : val;
    }
}

customElements.define('oo-knob', Knob)

export default Knob;