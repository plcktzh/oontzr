import Helpers from './Helpers.js';

class State {

    parent;
    language = '';
    playback = {
        tempo: {
            bpm: 0,
            msPerStep: 0
        },
        swing: {
            amount: 0,
            resolution: 0
        },
        isPlaying: false
    };
    patterns = [];
    samples = null;

    constructor(parent, args) {

        this.parent = parent;

        Helpers.initProps(this, args, ['parent']);

        return this;
    }
}

export default State;