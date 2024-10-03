class Oontzr extends HTMLElement {

    clientY;

    constructor() {
        super();

        console.log(this.getAttribute('data-oontzr-config-json'));

        const num = document.querySelector('#numberTest');

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
            window.addEventListener('touchmove', this.handleMouseMove);
        });
        window.addEventListener('touchend', (e) => window.removeEventListener('touchmove', this.handleMouseMove));

        this._render();
    }

    handleMouseMove(e) {

        if (e.type === 'mousemove') {

            if (e.movementY) document.querySelector('#numberTest').value = parseInt(document.querySelector('#numberTest').value) + Math.round(-.25 * e.movementY);
        } else if (e.type === 'touchmove') {

            const deltaY = e.changedTouches[0].clientY - this.clientY;
            if (deltaY !== 0) this.clientY = e.changedTouches[0].clientY;

            document.querySelector('#numberTest').value = Math.round(parseInt(document.querySelector('#numberTest').value) - .25 * deltaY);
        }

        document.querySelector('#numberTest').dispatchEvent(new Event('change'));
    }

    _render() {

        const val = parseInt(document.querySelector('#numberTest').value);
        const min = parseInt(document.querySelector('#numberTest').getAttribute('min'));
        const max = parseInt(document.querySelector('#numberTest').getAttribute('max'));
        const r = parseInt(document.querySelector('#output').getAttribute('width')) / 2;

        let amount;

        switch (val) {
            case min:
                amount = -179;
                break;
            case max:
                amount = 179;
                break;
            default:
                amount = ((document.querySelector('#numberTest').value - 1) / (.5 * parseInt(document.querySelector('#numberTest').getAttribute('max'))) - 1) * 180;
                break;
        }

        const x = r * Math.cos(amount * Math.PI / 180) + r;
        const y = r * Math.sin(amount * Math.PI / 180) + r;
        const laf = (amount > 0) ? 1 : 0;

        const d = `M ${r} ${r} L 0 24 A ${r} ${r}, 0, ${laf}, 1, ${x} ${y} Z`;

        document.querySelector('#outputTest').setAttribute('d', d);
        document.querySelector('#outputTestNum').innerHTML = (val < 10) ? `0${val}` : val;
    }
}

customElements.define('oontzr-app', Oontzr)

export default Oontzr;