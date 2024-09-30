import Helpers from './Helpers.js';
import Sample from './Sample.js';

/**
 * @class SamplePool
 */
class SamplePool {

    /**
     * @constructor
     * @param {String} samplesJson The name of the JSON file to be loaded 
     * @returns SamplePool
     */
    constructor(samplesJson) {

        // Call getSamples method
        this.getSamples(samplesJson);

        return this;
    }

    /**
     * @async
     * @method getSamples
     * @param {String} samplesJson The name of the JSON file to be loaded
     */
    async getSamples(samplesJson) {

        // Wait for the JSON file to be loaded
        await Helpers.getJson(samplesJson).then(responseJson => {

            // Walk the <samples> array from the returned JSON Object
            responseJson.samples.forEach((sample) => {

                // Create a new Sample with <sample>'s properties and assign it to a new property on this SamplePool instance
                this[sample.id] = new Sample(sample);
            });
        });
    }
}

export default SamplePool;