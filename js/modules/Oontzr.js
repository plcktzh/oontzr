import Helpers from './Helpers.js';
import State from './State.js';

/**
 * @class Oontzr
 */
class Oontzr {

    /**
     * @static 
     * @property {Object} PATTERN_TYPES An Object containing strings for different types of pattern
     */
    static PATTERN_TYPES = {
        EUCLIDEAN: 'euclidean',
        RANDOM: 'random',
        TR: 'tr',
        CELLULAR: 'cellular'
    };

    /**
     * @static
     * @property {Object} DATA_ATTRIBUTE_PREFIX An Object containing the data attribute prefix for Oontzr as both String and RegExp
     */
    static DATA_ATTRIBUTE_PREFIX = {
        AS_STRING: 'data-oontzr-',
        AS_REGEXP: /^data-oontzr-/
    };

    /**
     * @static
     * @property {Object} PREFIXES An Object containing prefixes for various items
     */
    static PREFIXES = {
        PATTERN: 'ptn_',
        STEP: 'stp_',
        SAMPLE: 'smp_',
        CANVAS: 'cnv_'
    };

    /**
     * @property {Element} parent The parent element of the Oontzr instance
     * @property {Object} _c An object containing configuration options, built from data attributes
     * @property {State} _s The Oontzr instance's State
     */
    parent = null;
    _c = {};
    _s = null;

    /**
     * @constructor
     * @param {String} containerSelector The CSS selector of the parent container
     */
    constructor(containerSelector) {

        // Set parent property
        this.parent = Helpers.dqs(containerSelector);

        // Build config object
        this._c = Helpers.buildConfigFromData(this.parent, Oontzr.DATA_ATTRIBUTE_PREFIX);

        // Create new State with some basic properties
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

    /**
     * @method createPattern
     * @param {Object} args An optional initialisaiton Object
     * @returns Pattern
     */
    createPattern(args) {
        return this._s.createPattern(args);
    }

    /**
     * readPattern
     * @param {String} id The ID of the Pattern to be retrieved
     * @returns Pattern
     */
    readPattern(id) {
        return this._s.readPattern(id);
    }

    /**
     * updatePattern
     * @param {String} id The ID of the Pattern to be updated
     * @param {Object} args An optional initialisation Object
     * @returns Pattern
     */
    updatePattern(id, args) {
        return this._s.updatePattern(id, args);
    }

    /**
     * @method deletePattern
     * @param {String} id The ID of the Pattern to be deleted
     * @returns Boolean
     */
    deletePattern(id) {
        return this._s.deletePattern(id);
    }
}

export default Oontzr;