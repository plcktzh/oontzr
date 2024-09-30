/**
 * @class Playback
 */
class Playback {

    /**
     * @static
     * @property {Number} STEP_RESOLUTION The number of steps contained in 1 beat
     */
    static STEP_RESOLUTION = 4; // i.e. 16th note

    /**
     * Get milliseconds per step from a tempo defined in beats per minute. For clarity: 1 minute contains <bpm> beats, 1 second contains <bpm>/60 beats, 1 beat contains <STEP_RESOLUTION> steps
     * @static
     * @method getMilliseconds
     * @param {Number} bpm Tempo in beats per minute
     * @returns Number
     */
    static getMilliseconds(bpm) {

        let output = bpm;

        output /= 60; // --> Beats per second
        output = 1 / output; // --> Duration of 1 beat in seconds
        output = output / Playback.STEP_RESOLUTION; // --> Duration of 1 step in seconds
        output *= 1000; // --> Duration of 1 step in milliseconds

        return output;
    }
}

export default Playback;