import Helpers from './Helpers.js';
import Oontzr from './Oontzr.js';

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

    /**
     * @method setVelocity
     * @param {Number} value The (optional) velocity the Step should be set to
     * @returns null
     */
    setVelocity(value) {
        // If Step instance is active, set velocity to either the value parameter or to a random value
        if (this.isActive) this.velocity = (value) ? value : (Math.random() * (Oontzr.PATTERN_PARAMETERS.VELOCITY_MAX - Oontzr.PATTERN_PARAMETERS.VELOCITY_MIN) + Oontzr.PATTERN_PARAMETERS.VELOCITY_MIN);
    }
}

export default Step;