/**
 * @interface PatternType
 */
class PatternType {

    /**
     * @property {String} type The Pattern type
     */
    type = '';

    /**
     * @constructor
     * @param {Object} args An optional initialisation Object
     * @returns PatternType
     */
    constructor(args) {

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
}

export default PatternType;