import Helpers from './Helpers.js';
import Sample from './Sample.js';

/**
 * @class SamplePool
 */
class SamplePool {

    /**
     * @property {Boolean} samplesJsonLoaded A flag denoting if the samplesJson file has been loaded
     */
    samplesJsonLoaded = false;

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
     * @returns null
     */
    async getSamples(samplesJson) {

        Helpers.getJson(samplesJson).then(data => {
            // Walk the <samples> array from the returned JSON Object
            data.samples.forEach(sample => {
                // Create a new Sample with <sample>'s properties and assign it to a new property on this SamplePool instance
                this[sample.id] = new Sample(sample);
            });

            // Set flag for samplesJson having been loaded
            this.samplesJsonLoaded = true;
        }).catch((e) => {
            // Output an error message if loading samplesJson fails.
            console.error(`${samplesJson} could not be loaded. ${e}`);
        });
    }

    /**
     * @method getSample
     * @param {String} id The ID of the Sample to be returned
     * @returns Promise
     */
    getSample(id) {

        // Return a Promise
        return new Promise((resolve, reject) => {

            if (this.samplesJsonLoaded && this[id] instanceof Sample) {
                // Resolve if samplesJson has been successfully loaded
                resolve(this);
            } else {
                // Reject if sample could not be found
                reject(`Sample ${id} could not be found.`);
            }
        });
    }
}

export default SamplePool;