import Helpers from '../Helpers.js';
import Oontzr from '../Oontzr.js';
import PatternType from '../PatternType.js';
import Step from '../Step.js';

/**
 * @class Euclidean
 * @extends PatternType
 */
class Euclidean extends PatternType {

    /**
     * @property {String} type The Pattern type
     * @property {Number} patternLength The length of the Pattern
     * @property {Number} patternOffset The offset of the Pattern
     */
    type = 'euclidean';

    /**
     * @constructor
     * @param {Object} args An optional initialisation Object
     * @returns PatternType
     */
    constructor(args) {
        super(args);

        Oontzr.PATTERN_TYPES.EUCLIDEAN.PARAMETERS.forEach(parameter => {
            this[parameter.name] = parameter.initialValue;
        });

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args);

        return this;
    }

    /**
     * @method buildPattern
     * @param {Object} args An optional initialisation Object
     * @returns Array
     */
    buildPattern(args) {

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args);

        // There must not be more events in a pattern than there are steps
        if (this.numEvents > this.patternLength) this.numEvents = this.patternLength;

        /**
         * @var {String} stepActive - Character representing active steps
         * @var {String} stepInactive - Character representing inactive steps
         */
        let stepActive = '1',
            stepInactive = '0';

        /**
         * @var {Number} k - Number of events in the pattern
         * @var {Number} m - Number of steps without events
         */
        let k = this.numEvents,
            m = this.patternLength - this.numEvents;

        /**
         * @var {String} stepActive_copy - Temporary copy of stepActive
         * @var {Number} k_copy - Temporary copy of k
         */
        let stepActive_copy, k_copy;

        /**
         * @var {String} steps - A string of active and inactive steps
         * @var {Array} steps_split - An array of strings, created by splitting steps
         * @var {Array} steps_out - An array of Step instances
         */
        let steps = '';
        let steps_split = [];
        let steps_out = [];

        // Evenly distribute active and inactive steps
        while (m > 1 && k > 1) {

            // Create a copy of stepActive --> '1'
            stepActive_copy = stepActive;

            // Add stepInactive character to stepActive --> '10'
            stepActive += stepInactive;

            // If number of active steps is lower than or equal to number of empty steps, 
            // subtract number of active steps from number of empty steps
            if (k <= m) m -= k;
            else {
                // Assign initial value of stepActive to stepInactive --> '1'
                stepInactive = stepActive_copy;
                // Create a copy of k (number of active steps)
                k_copy = k;
                // Assign value of m (number of empty steps) to k
                k = m;
                // Assign difference of k_copy and m to m
                m = k_copy - m;
            }
        };

        // Build steps string
        while (k > 0) {
            steps += stepActive;
            k--;
        }

        while (m > 0) {
            steps += stepInactive;
            m--;
        }

        steps_split = steps.split('');

        steps_split.forEach((step, index) => {
            steps_out[index] = new Step({
                isActive: (step === '1'),
                velocity: (step === '1') ? 127 : 0
            });
        });

        return steps_out;
    }
}

export default Euclidean;