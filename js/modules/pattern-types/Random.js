import Helpers from '../Helpers.js';
import PatternType from '../PatternType.js';
import Step from '../Step.js';

/**
 * @class Random
 * @extends PatternType
 */
class Random extends PatternType {

    /**
     * @property {String} type The Pattern type
     * @property {Number} patternLength The length of the Pattern
     * @property {Number} patternOffset The offset of the Pattern
     */
    type = 'random';
    patternLength = 0;
    patternOffset = 0;

    /**
     * @constructor
     * @param {Object} args An optional initialisation Object
     * @returns PatternType
     */
    constructor(args) {
        super(args);

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

            const rnd = (Math.round(Math.random())) ? true : false;

            steps_out.push(new Step({
                isActive: rnd,
                velocity: (rnd) ? 127 : 0
            }));

            Helpers.shuffleArr(steps_out);
        }

        return steps_out;
    }
}

export default Random;