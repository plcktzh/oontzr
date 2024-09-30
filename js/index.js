import Oontzr from './modules/Oontzr.js';

function _09f() {

    window._09f = _09f;

    const oontzr = new Oontzr('#oontzr');

    console.debug(oontzr._s);

    setTimeout(() => {

        const ptn0 = oontzr.createPattern();
        oontzr.parent.append(ptn0.output.canvas);
        console.log(ptn0.getStep(12));
        console.log(ptn0.getStep(18));
        console.log(ptn0.getStep());
        console.log(ptn0.getStep());
        console.log(ptn0.getStep());
        console.log(ptn0.getStep());
        console.log(ptn0.getStep());
        console.log(ptn0.getStep());

        console.debug(oontzr.readPattern(ptn0.id));

        const ptn1 = oontzr.clonePattern(ptn0.id);
        oontzr.parent.append(ptn1.output.canvas);

        console.debug(oontzr.readPattern(ptn1.id));

        console.debug(oontzr.updatePattern(ptn0.id, {
            chokesPattern: 'test'
        }));

        console.debug(oontzr.deletePattern(ptn0.id));

        console.debug(oontzr.patternExists(ptn1.id));

        const ptn2 = oontzr.createPattern({
            patternLength: 12
        });
        oontzr.parent.append(ptn2.output.canvas);

        console.debug(oontzr.readPattern(ptn2.id));
        oontzr._s.readPattern(ptn2.id).setSample('dbi_bd');
        console.debug(oontzr.readPattern(ptn2.id));

        console.debug(oontzr.readPattern(ptn2.id).setChokesPattern(ptn1.id));

        oontzr.readPattern(ptn1.id).randomizeStepVelocities();

        setTimeout(() => oontzr.readPattern(ptn1.id).nudgeRight(), 1000);

        setTimeout(() => oontzr.play(true), 3000);
    }, 2000);
};

_09f();

export default _09f;