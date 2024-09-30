import Oontzr from './modules/Oontzr.js';

function _09f() {

    window._09f = _09f;

    const oontzr = new Oontzr('#oontzr');

    console.debug(oontzr._s);

    const ptn0 = oontzr.createPattern();

    console.debug(oontzr.readPattern(ptn0.id));

    const ptn1 = oontzr.clonePattern(ptn0.id);

    console.debug(ptn1);

    console.debug(oontzr.updatePattern(ptn0.id, {
        chokesPattern: 'test'
    }));

    console.debug(oontzr.deletePattern(ptn0.id));
};

_09f();

export default _09f;