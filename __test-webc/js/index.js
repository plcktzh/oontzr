class Oontzr extends HTMLElement {

    clientY;

    constructor() {
        super();

        console.log(this.getAttribute('data-oontzr-config-json'));

        const num = document.querySelector('#numberInput');

        num.value = Math.round((Math.random() * parseInt(num.getAttribute('max')) - 1)) + parseInt(num.getAttribute('min'));
        num.addEventListener('change', (e) => {

            if (e.target.value < parseInt(e.target.getAttribute('min'))) e.target.value = parseInt(e.target.getAttribute('min'));
            if (e.target.value > parseInt(e.target.getAttribute('max'))) e.target.value = parseInt(e.target.getAttribute('max'));

            this._render();
        });

        this.addEventListener('mousedown', (e) => window.addEventListener('mousemove', this.handleMouseMove));
        window.addEventListener('mouseup', (e) => window.removeEventListener('mousemove', this.handleMouseMove));
        this.addEventListener('touchstart', (e) => {
            this.clientY = e.touches[0].clientY;
            window.addEventListener('touchmove', (e) => this.handleMouseMove(e, this));
        });
        window.addEventListener('touchend', (e) => {
            window.removeEventListener('touchmove', this.handleMouseMove);
            this.clientY = undefined;
        });

        this._render();
    }

    handleMouseMove(e, _this) {

        if (e.type === 'mousemove') {

            if (e.movementY) document.querySelector('#numberInput').value = parseInt(document.querySelector('#numberInput').value) + Math.round(-.25 * e.movementY);
        } else if (e.type === 'touchmove') {

            const deltaY = (e.changedTouches[0].clientY && _this.clientY) ? e.changedTouches[0].clientY - _this.clientY : 0;

            _this.clientY = e.changedTouches[0].clientY;
            document.querySelector('#numberInput').value -= Math.round(.25 * deltaY);
        }

        document.querySelector('#numberInput').dispatchEvent(new Event('change'));
    }

    _render() {

        const val = parseInt(document.querySelector('#numberInput').value);
        const min = parseInt(document.querySelector('#numberInput').getAttribute('min'));
        const max = parseInt(document.querySelector('#numberInput').getAttribute('max'));
        const r = 50;

        let amount = ((document.querySelector('#numberInput').value - 1) / (.5 * parseInt(document.querySelector('#numberInput').getAttribute('max'))) - 1) * 180;

        if (val === min) amount = -179;
        else if (val === max) amount = 179;

        const x = r * Math.cos(amount * Math.PI / 180) + r;
        const y = r * Math.sin(amount * Math.PI / 180) + r;
        const laf = (amount > 0) ? 1 : 0;

        const d = `M ${r} ${r} L 0 ${r} A ${r} ${r}, 0, ${laf}, 1, ${x} ${y} Z`;

        document.querySelector('#outputPath').setAttribute('d', d);
        document.querySelector('#outputLabel').innerHTML = (val < 10) ? `0${val}` : val;
    }
}

customElements.define('oontzr-app', Oontzr)

export default Oontzr;