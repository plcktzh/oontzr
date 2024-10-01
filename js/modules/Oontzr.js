import Helpers from './Helpers.js';
import Loader from './Loader.js';
import Playback from './Playback.js';
import SamplePool from './SamplePool.js';
import State from './State.js';

/**
 * @class Oontzr
 */
class Oontzr {

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
     * @property {Object} EVENT_TYPES An Object containing strings for different types of CustomEvent
     */
    static EVENT_TYPES;

    /**
     * @static 
     * @property {Object} PATTERN_TYPES An Object containing strings for different types of pattern
     */
    static PATTERN_TYPES;

    /**
     * @static
     * @property {Object} PATTERN_PARAMETERS An Object containing some properties for Patterns and Steps
     */
    static PATTERN_PARAMETERS;

    /**
     * @static
     * @property {Object} PREFIXES An Object containing prefixes for various items
     */
    static PREFIXES;

    /**
     * @static
     * @property {Object} CANVAS_ATTRIBUTES An Object containing some properties for Pattern canvas elements
     */
    static CANVAS_ATTRIBUTES;

    /**
     * @static
     * @property {Array} SAMPLES An Array containing all the samples for building the SamplePool
     */
    static SAMPLES;

    /**
     * @property {Element} parent The parent element of the Oontzr instance
     * @property {Element} loader A Loader instance
     * @property {Object} _c An object containing configuration options, built from data attributes
     * @property {State} _s The Oontzr instance's State
     */
    parent = null;
    loader = null;
    _s = null;

    /**
     * @constructor
     * @param {String} containerSelector The CSS selector of the parent container
     */
    constructor(containerSelector) {

        // Set parent property
        this.parent = Helpers.dqs(containerSelector);

        // Build config object
        Helpers.buildConfigFromDataAttribute(this, this.parent, Oontzr.DATA_ATTRIBUTE_PREFIX);

        this.loader = new Loader();
        this.parent.append(this.loader.loader);

        this.initialiseOontzr();
    }

    async initialiseOontzr() {

        // Get config file
        Helpers.getJson(this['configJson']).then(response => response.json()).then(data => {

            let configObject = {};

            // Transform property names from abc-def to ABC_DEF
            Helpers.transformJSONData(configObject, data);

            // Walk the configObject
            for (const configItem in configObject) {

                // Assign configItems to static properties in Oontzr
                Oontzr[configItem] = configObject[configItem];
            }
        }).then(() => {

            // Create new State with some basic properties
            this._s = new State(this, {
                language: 'en',
                playback: {
                    tempo: {
                        bpm: 120,
                        msPerStep: Playback.getMilliseconds(120)
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
        }).then(() => {

            // Initialise and assign SamplePool
            this._s.samples = new SamplePool(Oontzr.SAMPLES);
        }).finally(() => {

            this.loader.detach();
            document.dispatchEvent(new CustomEvent(Oontzr.EVENT_TYPES.APP_LOADED));
        });
    }

    /**
     * @method createPattern
     * @param {Object} args An optional initialisaiton Object
     * @returns Pattern|null
     * @see State.createPattern
     */
    createPattern(args) {
        return this._s.createPattern(args);
    }

    /**
     * readPattern
     * @param {String} id The ID of the Pattern to be retrieved
     * @returns Pattern|null
     * @see State.readPattern
     */
    readPattern(id) {
        return this._s.readPattern(id);
    }

    /**
     * updatePattern
     * @param {String} id The ID of the Pattern to be updated
     * @param {Object} args An optional initialisation Object
     * @returns Pattern
     * @see State.updatePattern
     */
    updatePattern(id, args) {
        return this._s.updatePattern(id, args);
    }

    /**
     * @method deletePattern
     * @param {String} id The ID of the Pattern to be deleted
     * @returns Boolean
     * @see State.deletePattern
     */
    deletePattern(id) {
        return this._s.deletePattern(id);
    }

    /**
     * @method clonePattern
     * @param {String} id The ID of the Pattern to be cloned
     * @returns Pattern|null
     * @see State.clonePattern
     */
    clonePattern(id) {
        return this._s.clonePattern(id);
    }

    /**
     * @method patternExists
     * @param {String} id The ID of the Pattern to be checked
     * @returns Boolean
     * @see State.patternExists
     */
    patternExists(id) {
        return this._s.patternExists(id);
    }

    /**
     * @method play
     * @param {Boolean} doRewind Determines whether or not the playback head should be rewound before playing
     * @returns Boolean
     */
    play(doRewind) {

        if (doRewind) this.rewind();

        // Step through the patterns
        this.playNextStep();

        // Enable playback
        return this._s.isPlaying = true;
    }

    /**
     * @method playNextStep
     * @returns null
     */
    playNextStep() {

        setTimeout(() => {
            // Walk the Pattern Array
            for (const id in this._s.patterns) {
                // Get current Step
                const {
                    currentStep,
                    step
                } = this._s.patterns[id].getStep();

                if (this._s.patterns[id].sample !== null) {

                    const stepAudio = new Audio();
                    stepAudio.src = `${ Oontzr.SAMPLES_DIRECTORY }${ this._s.patterns[id].sample.filename }`;

                    if (step.isActive) {
                        stepAudio.volume = step.velocity / Oontzr.PATTERN_PARAMETERS.VELOCITY_MAX;
                        stepAudio.play();
                    } else stepAudio.volume = 0;
                }

                // Redraw canvas
                this._s.patterns[id].drawPattern();
            }

            // If playback hasn't been stopped, play the next Step
            if (this._s.isPlaying) this.playNextStep();
        }, this._s.playback.tempo.msPerStep);
    }

    /**
     * @method rewind
     * @returns null
     */
    rewind() {

        // Walk through the Pattern Array
        for (const id in this._s.patterns) {
            // Reset the Pattern instance's currentStep
            this._s.patterns[id].currentStep = 0;
        }
    }

    /**
     * @method pause
     * @returns Boolean
     */
    pause() {
        // Disable playback
        return this._s.isPlaying = false;
    }
}

export default Oontzr;