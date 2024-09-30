import Helpers from './Helpers.js';

/**
 * @class Sample
 */
class Sample {

    /**
     * @property {String} id A string by which the sample can be referenced
     * @property {String} name The name to be shown to the user
     * @property {String} filename The name of the audio file
     */
    id = '';
    name = '';
    filename = '';

    /**
     * @constructor
     * @param {Object} args An optional initialisation Object
     * @returns Sample
     */
    constructor(args) {

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args);

        return this;
    }
}

export default Sample;