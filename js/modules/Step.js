import Helpers from './Helpers.js';

/**
 * @class Step
 */
class Step {

    /**
     * @property {Boolean} isActive
     * @property {Number} velocity
     */
    isActive = false;
    velocity = 0;

    /**
     * @constructor
     * @param {Object} args An optional initialisation Object
     * @returns Step
     */
    constructor(args) {

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args);

        return this;
    }
}

export default Step;