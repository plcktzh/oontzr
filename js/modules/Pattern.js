import Helpers from './Helpers.js';

/**
 * @class Pattern
 */
class Pattern {

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

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args);

        return this;
    }
}

export default Pattern;