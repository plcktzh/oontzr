import Helpers from '../Helpers.js';
import App from '../web-components/App.js';
import Pattern from '../web-components/Pattern.js';
import PatternType from '../PatternType.js';
import Step from '../web-components/Step.js';

/**
 * @class Cellular
 * @extends PatternType
 */
class Cellular extends PatternType {

    /**
     * @property {String} type The Pattern type
     * @property {Boolean} doRandomize Randomize the Pattern on loop
     * @property {Pattern} parent The parent Pattern
     */
    type = 'cellular';
    doRandomize = true;
    parent = null;

    /**
     * @constructor
     * @param {Pattern} parent The parent Pattern
     * @param {Object} args An optional initialisation Object
     * @returns PatternType
     */
    constructor(parent, args) {
        super(args);

        this.parent = parent;

        for (const parameter in App.PATTERN_TYPES.CELLULAR.PARAMETERS) {
            this[App.PATTERN_TYPES.CELLULAR.PARAMETERS[parameter]['NAME']] = App.PATTERN_TYPES.CELLULAR.PARAMETERS[parameter]['INITIALVALUE'];
        }

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args);

        return this;
    }

    /**
     * @method buildPattern
     * @param {Object} args An optional initialisation Object
     * @returns Array
     */
    buildPattern(args) {

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args);

        let steps_out = [];
        // Unless a seeds Array has been included in the <args> parameter, initialize seeds with an empty Array
        let seeds = (args && args.seeds) ? args.seeds : [];

        if (this.doCenterSeeds) {
            // Place seeds in the center of the pattern
            for (let i = 0; i < this.numSeeds; i++) {
                if (i === 0) seeds.push(Math.round(this.patternLength / 2)); // Place the first seed exactly in the center
                else if (i % 2) seeds.push(Math.round(this.patternLength / 2 + i)); // Place further odd seeds to the right
                else seeds.push(Math.round(this.patternLength / 2 - i)); // Place further even seeds to the left
            }
        } else {
            // Create a completely random seeds Array
            for (let i = 0; i < this.numSeeds; i++) {
                let rndStep = (Math.round(Math.random() * (this.patternLength - 1)));
                seeds.push(rndStep);
            }
        }

        for (let i = 0; i < this.patternLength; i++) {
            // Push a new Step instance depending on whether or not the current position is a seed
            steps_out.push(new Step(this.parent, {
                id: Helpers.getRandomId(App.PREFIXES.STEP),
                isActive: (Helpers.isInArr(seeds, i)) ? true : false,
                velocity: (Helpers.isInArr(seeds, i)) ? 127 : 0
            }));
        }

        return steps_out;
    }

    /**
     * randomizePattern
     * @param {Array} steps An Array containing the current Step sequence
     * @returns Array
     */
    randomizePattern(steps) {

        const nextGeneration = [];

        // If cellular automaton doesn't wrap around, push a new Step with the properties of the first Step in <steps>
        if (!this.wrapAround) nextGeneration.push(new Step(this.parent, {
            id: steps[0].id,
            isActive: steps[0].isActive,
            velocity: steps[0].velocity
        }));

        // Set initial and final values of iterator for the next for loop, depending on whether the automaton should wrap around
        const i_min = (this.wrapAround) ? 0 : 1;
        const i_max = (this.wrapAround) ? steps.length : steps.length - 1;

        for (let i = i_min; i < i_max; i++) {

            // Get current, previous and next steps
            const step = steps[i];
            let previous = steps[i - 1];
            let next = steps[i + 1];

            // When the automaton wraps around, handle edge cases
            if (this.wrapAround) {
                if (i === 0) previous = steps[steps.length - 1]; // If first step, set the previous step to the last step in the <steps> Array
                else if (i === steps.length - 1) next = steps[0]; // If last step, set the next step to the first step in the <steps> Array
            }

            // Add a new Step to the <nextGeneration> Array and copy the properties of <steps>[i] into it
            nextGeneration[i] = new Step(this.parent, {
                id: step.id,
                isActive: step.isActive,
                velocity: step.velocity
            });

            // Set isActive property depending on the state of the previous and next step
            nextGeneration[i].isActive = (previous.isActive !== next.isActive);
            // Set velocity depending on whether or not the current step is active
            nextGeneration[i].velocity = (nextGeneration[i].isActive) ? (this.doRandomizeVelocities) ? Math.round(Math.random() * App.PATTERN_PARAMETERS.VELOCITY_MAX) : App.PATTERN_PARAMETERS.VELOCITY_MAX : App.PATTERN_PARAMETERS.VELOCITY_MIN;
        }

        // If cellular automaton doesn't wrap around, push a new Step with the properties of the last Step in <steps>
        if (!this.wrapAround) nextGeneration.push(new Step(this.parent, {
            id: steps[steps.length - 1].id,
            isActive: steps[steps.length - 1].isActive,
            velocity: steps[steps.length - 1].velocity
        }));

        return nextGeneration;
    }
}

export default Cellular;