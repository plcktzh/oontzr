import Oontzr from './modules/Oontzr.js';

function _09f() {

    window._09f = _09f;

    const oontzr = new Oontzr('#oontzr');

    console.debug(oontzr._s);

    const ptn0 = oontzr.createPattern();

    console.debug(oontzr.readPattern(ptn0.id));

    const ptn1 = oontzr.clonePattern(ptn0.id);

    console.debug(oontzr.readPattern(ptn1.id));

    console.debug(oontzr.updatePattern(ptn0.id, {
        chokesPattern: 'test'
    }));

    console.debug(oontzr.deletePattern(ptn0.id));

    console.debug(oontzr.patternExists(ptn1.id));

    const ptn2 = oontzr.createPattern({
        patternLength: 12
    });

    console.debug(oontzr.readPattern(ptn2.id));
};

_09f();

export default _09f;