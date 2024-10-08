import Helpers from './Helpers.js';
import App from './web-components/App.js';
import Pattern from './web-components/Pattern.js';
import Playback from './Playback.js';

/**
 * @class State
 */
class State {

    /**
     * @property {App} parent The parent OontzApp instance
     * @property {String} language The current UI language
     * @property {Object} playback A configuration Object for playback options
     * @property {Array} patterns An Array containing all Patterns
     * @property {SamplePool} samples A SamplePool of all available Samples
     */
    parent = null;
    language = 'EN';
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
     * @param {App} parent The parent App instance
     * @param {Object} args An optional initialisation Object
     * @returns State
     */
    constructor(parent, args) {

        this.parent = parent;

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args);

        // Get tempo in milliseconds
        this.playback.tempo.msPerStep = Playback.getMilliseconds(this.playback.tempo.bpm);

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
                id: Helpers.getRandomId(App.PREFIXES.PATTERN)
            };

            this.patterns[args.id] = new Pattern(this, args);

            return this.patterns[args.id];
        } catch (e) {
            console.error(`Pattern could not be created. ${e}`);
            return null;
        }
    }

    /**
     * @method readPattern
     * @param {String} id The ID of the Pattern to be retrieved
     * @returns Pattern
     */
    readPattern(id) {

        try {
            if (this.patterns[id] !== null) return this.patterns[id];
            else throw new Error(`Pattern could not be found.`);
        } catch (e) {
            console.error(e);
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
            Helpers.transferProps(this.patterns[id].parameters, args);

            this.patterns[id].updateSteps();

            return this.patterns[id];
        } catch (e) {
            console.error(`Pattern could not be updated. ${e}`);
            return this.patterns[id];
        }
    }

    /**
     * @method deletePattern
     * @param {Pattern} pattern The Pattern to be deleted
     * @returns Boolean
     */
    deletePattern(pattern) {

        try {
            pattern.remove();
            return (delete this.patterns[pattern.id]);
        } catch (e) {
            console.error(`Pattern could not be deleted. ${e}`);
            return false;
        }

    }

    // /**
    //  * @method clonePattern
    //  * @param {String} id The ID of the Pattern to be cloned
    //  * @param {Object} args An optional initialisation Object
    //  * @returns Pattern|null
    //  */
    // clonePattern(id, args) {

    //     try {
    //         const source = this.readPattern(id);
    //         const clone = this.createPattern({
    //             type: source.parameters.type
    //         });

    //         Helpers.transferProps(clone, source, ['id']);
    //         if (args) Helpers.transferProps(clone, args);

    //         return clone;
    //     } catch (e) {
    //         console.error(`Pattern could not be cloned. ${e}`);
    //         return null;
    //     }
    // }

    //     /**
    //      * @method patternExists
    //      * @param {String} id The ID of the Pattern to be checked
    //      * @returns Boolean
    //      */
    //     patternExists(id) {
    //         return (this.readPattern(id) !== undefined);
    //     }
}

export default State;