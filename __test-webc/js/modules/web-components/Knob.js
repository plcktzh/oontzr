const ooKnobCss = document.createElement('template');
ooKnobCss.innerHTML = `
<style>
    :host {
        display: inline-block;
        position: relative;
    }

    #outputLabel {
        align-items: center;
        display: flex;
        font-family: inherit;
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
        align-items: center;
        bottom: -1.5rem;
        display: flex;
        font-family: inherit;
        justify-content: center;
        position: absolute;
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
        fill: #e0e0e0;
    }

    svg #outputPath {
        fill: #0ba5aa;
    }
</style>
`;

const ooKnobTemplate = document.createElement('template');
ooKnobTemplate.innerHTML = `
<label for="numberInput">Pattern length</label>
<input type="number" id="numberInput" min="1" max="64">
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
`;

class Knob extends HTMLElement {

    _clientY;
    _config;

    constructor() {
        super();

        this._config = {};
        this._config['value'] = this.attributes.value ? parseInt(this.attributes.value.nodeValue) : 1;
        this._config['min'] = this.attributes.min ? parseInt(this.attributes.min.nodeValue) : 1;
        this._config['max'] = this.attributes.max ? parseInt(this.attributes.max.nodeValue) : 64;
        this._config['graphMin'] = this.attributes.graphMin ? parseInt(this.attributes.graphMin.nodeValue) : 1;
        this._config['graphMax'] = this.attributes.graphMax ? parseInt(this.attributes.graphMax.nodeValue) : 64;

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooKnobCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooKnobTemplate.content.cloneNode(true));

        const num = this.shadowRoot.querySelector('#numberInput');
        num.setAttribute('min', this._config.min);
        num.setAttribute('max', this._config.max);
        num.value = this._config.value;
        num.addEventListener('change', (e) => {

            if (e.target.value < parseInt(e.target.getAttribute('min'))) e.target.value = parseInt(e.target.getAttribute('min'));
            if (e.target.value > parseInt(e.target.getAttribute('max'))) e.target.value = parseInt(e.target.getAttribute('max'));

            this._render();
        });

        this.addEventListener('mousedown', (e) => window.addEventListener('mousemove', this.handleMouseMove));
        window.addEventListener('mouseup', (e) => window.removeEventListener('mousemove', this.handleMouseMove));
        this.addEventListener('touchstart', (e) => {
            this._clientY = e.touches[0].clientY;
            window.addEventListener('touchmove', this.handleMouseMove);
        }, {
            passive: true
        });
        window.addEventListener('touchend', (e) => {
            window.removeEventListener('touchmove', this.handleMouseMove);
            this._clientY = undefined;
        });

        this._render();
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