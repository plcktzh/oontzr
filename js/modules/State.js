import Helpers from './Helpers.js';
import Playback from './Playback.js';
import SamplePool from './SamplePool.js';

/**
 * @class State
 */
class State {

    /**
     * @property {Oontzr} parent The parent Oontzr instance
     * @todo Implement language selection
     * @property {String} language The current UI language
     * @property {Object} playback A configuration Object for playback options
     * @property {Array} patterns An Array containing all Patterns
     * @property {SamplePool} samples A SamplePool of all available Samples
     */
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

    /**
     * @constructor
     * @param {Oontzr} parent The parent Oontzr instance
     * @param {Object} args An optional initialisation Object
     * @returns State
     */
    constructor(parent, args) {

        this.parent = parent;

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args);

        // Get tempo in milliseconds
        this.playback.tempo.msPerStep = Playback.getMilliseconds(this.playback.tempo.bpm);

        // Initialise and assign SamplePool
        this.samples = new SamplePool(parent._c.samplesJson);

        return this;
    }
}

export default State;