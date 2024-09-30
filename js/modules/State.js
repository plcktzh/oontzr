import Helpers from './Helpers.js';
import Oontzr from './Oontzr.js';
import Pattern from './Pattern.js';
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
    parent = null;
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

    /**
     * @method createPattern
     * @param {Object} args An optional initialisation Object
     * @returns Pattern|null
     */
    createPattern(args) {

        try {
            args = {
                ...args,
                id: Helpers.getRandomId(Oontzr.PREFIXES.PATTERN)
            };

            this.patterns[args.id] = new Pattern(this, args);
            this.patterns[args.id].updateSteps();

            return this.patterns[args.id];
        } catch (e) {
            console.error(`Pattern could not be created. ${e}`);
            return null;
        }
    }

    /**
     * @method readPattern
     * @param {String} id The ID of the Pattern to be retrieved
     * @returns Pattern|null
     */
    readPattern(id) {

        try {
            return this.patterns[id];
        } catch (e) {
            console.error(`Pattern could not be found. ${e}`);
            return null;
        }
    }

    /**
     * @method updatePattern
     * @param {String} id The ID of the Pattern to be updated
     * @param {Object} args An optional initialisation Object
     * @returns Pattern
     */
    updatePattern(id, args) {

        try {
            // Transfer properties from optional arguments
            Helpers.transferProps(this.patterns[id], args);

            this.patterns[id].updateSteps();

            return this.patterns[id];
        } catch (e) {
            console.error(`Pattern could not be updated. ${e}`);
            return this.patterns[id];
        }
    }

    /**
     * @method deletePattern
     * @param {String} id The ID of the Pattern to be updated
     * @returns Boolean
     */
    deletePattern(id) {

        try {
            Helpers.dqs(`.pattern-lane[data-oontzr-pattern-id="${id}"]`).remove();
            return (delete this.patterns[id]);
        } catch (e) {
            console.error(`Pattern could not be deleted. ${e}`);
            return false;
        }

    }

    /**
     * @method clonePattern
     * @param {String} id The ID of the Pattern to be cloned
     * @returns Pattern|null
     */
    clonePattern(id) {

        try {
            const source = this.readPattern(id);
            const clone = this.createPattern();

            Helpers.transferProps(clone, source, ['id']);

            return clone;
        } catch (e) {
            console.error(`Pattern could not be cloned. ${e}`);
            return null;
        }
    }

    /**
     * @method patternExists
     * @param {String} id The ID of the Pattern to be checked
     * @returns Boolean
     */
    patternExists(id) {
        return this.patterns[id] instanceof Pattern;
    }
}

export default State;