import Helpers from './modules/Helpers.js';
import Oontzr from './modules/Oontzr.js';

function _09f() {

    window._09f = _09f;

    let oontzr;

    oontzr = new Oontzr('#oontzr');

    document.addEventListener('app-loaded', (e) => {

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

        console.debug(oontzr.readPattern(ptn0.id).setChokesPattern('test'));

        console.debug(oontzr.deletePattern(ptn0.id));

        console.debug(oontzr.patternExists(ptn1.id));

        const ptn2 = oontzr.createPattern({
            patternLength: 24
        });
        oontzr.parent.append(ptn2.output.canvas);

        console.debug(oontzr.readPattern(ptn2.id));
        oontzr._s.readPattern(ptn1.id).setSample('dbi_cb');
        oontzr._s.readPattern(ptn2.id).setSample('dbi_bd');
        console.debug(oontzr.readPattern(ptn2.id));

        console.debug(oontzr.readPattern(ptn2.id).setChokesPattern(ptn1.id));

        oontzr.readPattern(ptn1.id).randomizeStepVelocities();
        oontzr.readPattern(ptn2.id).randomizeStepVelocities();

        // setTimeout(() => oontzr.readPattern(ptn1.id).nudgeRight(), 1000);

        // setTimeout(() => oontzr.play(true), 3000);

        const btn = Helpers.dce('button');
        btn.innerText = 'Play/Pause';
        btn.addEventListener('click', () => {
            if (oontzr._s.isPlaying) oontzr.pause();
            else oontzr.play(true);
        });
        Helpers.dqs('#oontzr').prepend(btn);
    });
};

_09f();

export default _09f;