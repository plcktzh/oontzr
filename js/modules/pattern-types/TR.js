import Helpers from '../Helpers.js';
import Oontzr from '../Oontzr.js';
import Pattern from '../Pattern.js';
import PatternType from '../PatternType.js';
import Step from '../Step.js';

/**
 * @class TR
 * @extends PatternType
 */
class TR extends PatternType {

    /**
     * @property {String} type The Pattern type
     * @property {Boolean} doRandomize Randomize the Pattern on loop
     * @property {Pattern} parent The parent Pattern
     */
    type = 'tr';
    doRandomize = false;
    parent = null;

    /**
     * @constructor
     * @param {Pattern} parent The parent Pattern
     * @param {Object} args An optional initialisation Object
     * @returns PatternType
     */
    constructor(parent, args) {
        super(args);

        this.parent = parent;

        Oontzr.PATTERN_TYPES.RANDOM.PARAMETERS.forEach(parameter => {
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

        if (this.parent.steps.length === this.patternLength) return this.parent.steps;

        let steps_out = [];

        for (let i = 0; i < this.patternLength; i++) {

            // Push a new empty Step to the steps_out Array
            if (this.parent.steps[i]) {
                steps_out.push(new Step({
                    ...this.parent.steps[i]
                }));
            } else {
                steps_out.push(new Step({
                    isActive: false,
                    velocity: 0
                }));
            }
        }

        return steps_out;
    }

    /**
     * randomizePattern
     * @param {Array} steps An Array containing the current Step sequence
     * @returns Array
     */
    randomizePattern(steps) {

        let steps_out = [];
        const steps_active = Helpers.shuffleArr(steps.filter((step) => step.isActive));

        steps.forEach(step => {

            if (step.isActive) steps_out.push(steps_active.shift());
            else steps_out.push(step);
        });


        // Return the shuffled Steps Array
        return steps_out;
    }
}

export default TR;