import Pattern from './Pattern.js';

/**
 * @interface PatternType
 */
class PatternType {

    /**
     * @property {String} type The Pattern type
     * @property {Boolean} doRandomize Randomize the Pattern on loop
     * @property {Pattern} parent The parent Pattern
     */
    type = '';
    doRandomize = false;
    parent = null;

    /**
     * @constructor
     * @param {Pattern} parent The parent Pattern
     * @param {Object} args An optional initialisation Object
     * @returns PatternType
     */
    constructor(parent, args) {

        return this;
    }

    /**
     * @method buildPattern
     * @param {Object} args An optional initialisation Object
     * @returns Array
     */
    buildPattern(args) {

        return [];
    }

    /**
     * randomizePattern
     * @param {Array} steps An Array containing the current Step sequence
     * @returns Array
     */
    randomizePattern(steps) {

        return steps;
    }
}

export default PatternType;