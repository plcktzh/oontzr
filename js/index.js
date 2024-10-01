import Helpers from './modules/Helpers.js';
import Oontzr from './modules/Oontzr.js';

async function _09f() {

    window._09f = _09f;

    let oontzr;

    oontzr = new Oontzr('#oontzr');

    document.addEventListener('app-loaded', (e) => {

        const ptn0 = oontzr.createPattern({
            type: 'cellular',
            doCenterSeeds: false,
            numSeeds: 3,
            doRandomize: true,
            doRandomizeVelocities: true
        });

        const ptn1 = oontzr.clonePattern(ptn0.id);
        oontzr.updatePattern(ptn1.id, {
            patternLength: 12
        });

        const ptn2 = oontzr.createPattern({
            type: 'tr',
            doRandomize: true,
            doRandomizeVelocities: true
        });

        const ptn2b = oontzr.clonePattern(ptn2.id, {
            parameters: {
                doRandomize: false
            }
        });

        const ptn2c = oontzr.clonePattern(ptn2b.id);

        const ptn3 = oontzr.createPattern({
            type: 'euclidean'
        });

        // oontzr._s.readPattern(ptn0.id).setSample('dbi_oh');
        // oontzr._s.readPattern(ptn1.id).setSample('dbi_cb');
        // oontzr._s.readPattern(ptn2.id).setSample('dbi_ch');
        // oontzr._s.readPattern(ptn3.id).setSample('dbi_bd');

        // oontzr.readPattern(ptn1.id).randomizeStepVelocities();
        // oontzr.readPattern(ptn2.id).randomizeStepVelocities();

        oontzr.play();

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