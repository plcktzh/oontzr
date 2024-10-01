import Helpers from './Helpers.js';
import Sample from './Sample.js';

/**
 * @class SamplePool
 */
class SamplePool {

    /**
     * @constructor
     * @param {Array} samples An Array of samples
     * @returns SamplePool
     */
    constructor(samples) {

        // Call getSamples method
        this.getSamples(samples);

        return this;
    }

    /**
     * @method getSamples
     * @param {Array} samples An Array of samples
     * @returns SamplePool
     */
    getSamples(samples) {

        samples.forEach(sample => {
            this[sample.id] = new Sample(sample);
        });

        return this;
    }

    /**
     * @method getSample
     * @param {String} id The ID of the Sample to be returned
     * @returns Sample
     */
    getSample(id) {

        try {
            if (Helpers.isInObj(this, id)) return this[id];
            else throw new Error(`Sample ${id} could not be found.`);
        } catch (e) {
            console.error(e);
        }
    }
}

export default SamplePool;