import Helpers from '../Helpers.js';
import App from '../web-components/App.js';
import Pattern from '../web-components/Pattern.js';
import PatternType from '../PatternType.js';
import Step from '../web-components/Step.js';

/**
 * @class Random
 * @extends PatternType
 */
class Random extends PatternType {

    /**
     * @property {String} type The Pattern type
     * @property {Boolean} doRandomize Randomize the Pattern on loop
     * @property {Pattern} parent The parent Pattern
     */
    type = 'random';
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

        for (const parameter in App.PATTERN_TYPES.RANDOM.PARAMETERS) {
            this[App.PATTERN_TYPES.RANDOM.PARAMETERS[parameter]['NAME']] = App.PATTERN_TYPES.RANDOM.PARAMETERS[parameter]['INITIALVALUE'];
        }

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

        let steps_out = [];

        for (let i = 0; i < this.patternLength; i++) {

            // Get a random Boolean value
            const rnd = (Math.round(Math.random())) ? true : false;

            // Push a new Step to the steps_out Array using the random Boolean value created above
            steps_out.push(new Step(this.parent, {
                id: Helpers.getRandomId(App.PREFIXES.STEP),
                isActive: rnd,
                velocity: (rnd) ? 127 : 0
            }));

            // For good measure, shuffle the steps_out Array
            Helpers.shuffleArr(steps_out);
        }

        return steps_out;
    }

    /**
     * randomizePattern
     * @param {Array} steps An Array containing the current Step sequence
     * @returns Array
     */
    randomizePattern(steps) {

        // Return the shuffled Steps Array
        return Helpers.shuffleArr([...steps]);
    }
}

export default Random;