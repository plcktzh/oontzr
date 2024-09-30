import Helpers from './Helpers.js';
import State from './State.js';

/**
 * @class Oontzr
 */
class Oontzr {

    /**
     * @static 
     * @property {Object} PATTERN_TYPES An object containing strings for different types of pattern
     */
    static PATTERN_TYPES = {
        EUCLIDEAN: 'euclidean',
        RANDOM: 'random',
        TR: 'tr',
        CELLULAR: 'cellular'
    };

    /**
     * @static
     * @property {Object} DATA_ATTRIBUTE_PREFIX An object containing the data attribute prefix for Oontzr as both String and RegExp
     */
    static DATA_ATTRIBUTE_PREFIX = {
        asString: 'data-oontzr-',
        asRegexp: /^data-oontzr-/
    }

    /**
     * @property {Element} parent The parent element of the Oontzr instance
     * @property {Object} _c An object containing configuration options, built from data attributes
     * @property {State} _s The Oontzr instance's State
     */
    parent;
    _c = {};
    _s;

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
}

export default Oontzr;