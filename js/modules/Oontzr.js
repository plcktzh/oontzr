import Helpers from './Helpers.js';
import State from './State.js';

class Oontzr {

    _c;
    _s;

    constructor(containerSelector) {

        this._c = Helpers.dqs(containerSelector);
        this._s = new State(this, {
            language: 'en',
            playback: {
                tempo: {
                    bpm: 120,
                    msPerStep: 125
                },
                swing: {
                    amount: 0,
                    resolution: 16
                },
                isPlaying: false
            },
            patterns: [],
            samples: null
        });
    }
}

export default Oontzr;