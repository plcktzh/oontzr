import Helpers from './Helpers.js';
import Oontzr from './Oontzr.js';
import Random from './pattern-types/Random.js';

/**
 * @class Pattern
 */
class Pattern {

    /**
     * @property {State} parent The parent State instance
     * @property {String} id The ID of this Pattern instance
     * @property {PatternType} parameters An instance of PatternType posessing the parameters for this Pattern instance
     * @property {Array} steps An Array of Step instances representing this Pattern instance
     * @property {Number} currentStep The current step
     * @property {Sample} sample The chosen Sample for this instance of Pattern
     * @property {Object} output Properties for displaying the pattern, e.g. canvas
     */
    parent = null;
    id = '';
    parameters = null;
    chokesPattern = '';
    steps = [];
    currentStep = -1;
    sample = null;
    output = {
        canvas: null,
        context: null
    }

    /**
     * @constructor
     * @param {State} parent The Pattern's parent State instance
     * @param {Object} args An optional initialisation Object
     * @returns Pattern
     */
    constructor(parent, args) {

        this.parent = parent;

        switch (args.type) {

            case Oontzr.PATTERN_TYPES.CELLULAR:
            case Oontzr.PATTERN_TYPES.TR:
            case Oontzr.PATTERN_TYPES.EUCLIDEAN:
            case Oontzr.PATTERN_TYPES.RANDOM:
            default:
                this.parameters = new Random({
                    patternLength: args.patternLength || 16,
                    patternOffset: args.patternOffset || 0
                });
                this.updateSteps(this.parameters);
                break;
        }

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args, ['parameters']);

        return this;
    }

    updateSteps(args) {

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args);

        this.steps = this.parameters.buildPattern(args);
        this.steps = this.shiftPattern(this.parameters.patternOffset);

        /**
         * @todo Add drawing method
         */

        return this;
    }

    /**
     * @method shiftPattern
     * @param {Number} shiftBy The number of steps to shift the Pattern
     * @returns Array
     */
    shiftPattern(shiftBy = 0) {

        if (shiftBy === 0) return this.steps;
        else {
            let steps_shifted = [];

            if (shiftBy > 0) {
                // Shift to the right

                // Assign shifted part from the end of steps array to a new array
                const steps_part = this.steps.slice(-shiftBy);

                // Assign remaining part of steps array to a new array
                const steps_remainder = this.steps.slice(-this.steps.length, -steps_part.length);

                // Concatenate both arrays and assign to steps_shifted
                steps_shifted = steps_part.concat(steps_remainder);
            } else {
                // Shift to the left

                // Assign shifted part from the beginning of the steps array to a new array
                // Use absolute value of shiftBy to ensure it's > 0
                const steps_part = this.steps.slice(0, Math.abs(shiftBy));

                // Assign remaining part of steps array to a new array
                const steps_remainder = this.steps.slice(steps_part.length - this.steps.length);

                // Concatenate both arrays and assign to steps_shifted
                steps_shifted = steps_remainder.concat(steps_part);
            }

            // Assign shifted array to the Pattern's steps property
            this.steps = steps_shifted;

            // Assign shift amount to patternOffset property of PatternType
            this.parameters.patternOffset = shiftBy;

            return steps_shifted;
        }
    }

    /**
     * Shift steps to the left by 1
     * @method nudgeLeft
     * @returns Pattern
     * @see Pattern.shiftPattern
     */
    nudgeLeft() {
        return this.shiftPattern(-1);
    }

    /**
     * Shift steps to the right by 1
     * @method nudgeRight
     * @returns Pattern
     * @see Pattern.shiftPattern
     */
    nudgeRight() {
        return this.shiftPattern(1);
    }

    /**
     * @async
     * @method setSample
     * @param {String} id The ID of the Sample to be assigned to the pattern
     * @returns null
     */
    async setSample(id) {

        // Wait for Promise from SamplePool.getSample to be resolved or rejected
        this.sample = await this.parent.samples.getSample(id).then(res => {
            // return SamplePool[id]
            res[id];
        }).catch(e => {
            // Output an error message
            console.error(e);
        });
    }
}

export default Pattern;