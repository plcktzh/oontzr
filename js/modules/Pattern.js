import Helpers from './Helpers.js';
import Oontzr from './Oontzr.js';
import Cellular from './pattern-types/Cellular.js';
import Euclidean from './pattern-types/Euclidean.js';
import Random from './pattern-types/Random.js';

/**
 * @class Pattern
 */
class Pattern {

    /**
     * @property {State} parent The parent State instance
     * @property {String} id The ID of this Pattern instance
     * @property {PatternType} parameters An instance of PatternType posessing the parameters for this Pattern instance
     * @property {Array} steps An Array of Step instances representing this Pattern instance
     * @property {Number} currentStep The current step
     * @property {Sample} sample The chosen Sample for this instance of Pattern
     * @property {Object} output Properties for displaying the pattern, e.g. canvas
     */
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

        switch (args.type) {

            case Oontzr.PATTERN_TYPES.CELLULAR.TYPE:
                this.parameters = new Cellular(this, args);
                this.updateSteps(this.parameters);
                break;
            case Oontzr.PATTERN_TYPES.TR.TYPE:
            case Oontzr.PATTERN_TYPES.EUCLIDEAN.TYPE:
                this.parameters = new Euclidean(this, args);
                this.updateSteps(this.parameters);
                break;
            case Oontzr.PATTERN_TYPES.RANDOM.TYPE:
            default:
                this.parameters = new Random(this, args);
                this.updateSteps(this.parameters);
                break;
        }

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args, ['parameters']);

        this.initCanvas();

        return this;
    }

    /**
     * @method updateSteps
     * @param {Object} args An optional initialisation Object 
     * @returns Pattern
     */
    updateSteps(args) {

        // Transfer properties from optional arguments
        Helpers.transferProps(this, args);

        // (Re)build steps Array and shift it
        this.steps = this.parameters.buildPattern(args);
        this.steps = this.shiftPattern(this.parameters.patternOffset);

        // Randomize Step velocities if parameter is set
        if (this.parameters.doRandomizeVelocities) this.randomizeStepVelocities();

        // If canvas exists, (re)draw the Pattern
        if (this.output.canvas) this.drawPattern();

        return this;
    }

    /**
     * @method shiftPattern
     * @param {Number} shiftBy The number of steps to shift the Pattern
     * @returns Array
     */
    shiftPattern(shiftBy = 0) {

        if (shiftBy === 0) return this.steps;
        else {
            let steps_shifted = [];

            if (shiftBy > 0) {
                // Shift to the right

                // Assign shifted part from the end of steps array to a new array
                const steps_part = this.steps.slice(-shiftBy);

                // Assign remaining part of steps array to a new array
                const steps_remainder = this.steps.slice(-this.steps.length, -steps_part.length);

                // Concatenate both arrays and assign to steps_shifted
                steps_shifted = steps_part.concat(steps_remainder);
            } else {
                // Shift to the left

                // Assign shifted part from the beginning of the steps array to a new array
                // Use absolute value of shiftBy to ensure it's > 0
                const steps_part = this.steps.slice(0, Math.abs(shiftBy));

                // Assign remaining part of steps array to a new array
                const steps_remainder = this.steps.slice(steps_part.length - this.steps.length);

                // Concatenate both arrays and assign to steps_shifted
                steps_shifted = steps_remainder.concat(steps_part);
            }

            // Assign shifted array to the Pattern's steps property
            this.steps = steps_shifted;

            // Assign shift amount to patternOffset property of PatternType
            this.parameters.patternOffset = shiftBy;

            if (this.output.canvas) this.drawPattern();

            return steps_shifted;
        }
    }

    /**
     * Shift steps to the left by 1
     * @method nudgeLeft
     * @returns Pattern
     * @see Pattern.shiftPattern
     */
    nudgeLeft() {
        return this.shiftPattern(-1);
    }

    /**
     * Shift steps to the right by 1
     * @method nudgeRight
     * @returns Pattern
     * @see Pattern.shiftPattern
     */
    nudgeRight() {
        return this.shiftPattern(1);
    }

    /**
     * @method setSample
     * @param {String} id The ID of the Sample to be assigned to the pattern
     * @returns null
     */
    setSample(id) {

        this.sample = this.parent.samples.getSample(id);
    }

    /**
     * @method setChokesPattern
     * @param {String} id The ID of the Pattern to be choked by this Pattern instance
     * @returns Pattern
     */
    setChokesPattern(id) {

        try {
            if (this.parent.patternExists(id)) this.chokesPattern = id;
            else throw new Error(`Pattern '${id}' could not be found.`);
        } catch (e) {
            console.error(e);
        }

        return this;
    }

    /**
     * @method randomizeStepVelocities
     * @returns null
     */
    randomizeStepVelocities() {

        this.steps.forEach(step => {
            step.setVelocity();
        });

        if (this.output.canvas) this.drawPattern();
    }

    /**
     * @method getStep
     * @param {Number} id The (optional) ID of the Step to be returned
     * @returns Object
     */
    getStep(id) {

        if (id) {
            // The method was called with ID parameter, get this.steps[id]
            try {
                // If id is within bounds, return Object with index and Step
                if (id > 0 && id < this.steps.length) return {
                    index: id,
                    step: this.steps[id]
                };

                // ... or throw an error if the ID is out of bounds
                throw new Error(`Step ${id} could not be found.`);
            } catch (e) {
                // ... and catch it to display an error message
                console.error(e);
            }
        } else {
            // The method was called without ID parameter

            // Increase the currentStep property of Pattern instance
            ++this.currentStep;

            // Prevent currentStep from going out of bounds
            if (this.currentStep >= this.steps.length) this.currentStep = 0;

            // Return Object with index and Step
            return {
                index: this.currentStep,
                step: this.steps[this.currentStep]
            };
        }
    }

    /**
     * @method initCanvas
     * @returns HTMLElement
     */
    initCanvas() {

        // Create a new canvas HTMLElement, add class and data attribute
        this.output.canvas = Helpers.dce('canvas');
        this.output.canvas.classList.add('pattern-lane');
        this.output.canvas.setAttribute('data-oontzr-pattern-id', this.id);
        // Get context for canvas
        this.output.context = this.output.canvas.getContext('2d');

        return this.output.canvas;
    }

    /**
     * @method drawPattern
     * @returns null
     */
    drawPattern() {

        const canvasObj = this.output.canvas;
        const context = this.output.context;
        const stepsPattern = this.steps;

        // Set canvas dimensions in relation to length of Pattern.steps
        canvasObj.setAttribute('width', `${this.steps.length * Oontzr.CANVAS_ATTRIBUTES.STEP_WIDTH + 2 * Oontzr.CANVAS_ATTRIBUTES.CANVAS_PADDING + (this.steps.length - 1) * Oontzr.CANVAS_ATTRIBUTES.STEP_GAP}`);
        canvasObj.setAttribute('height', `${Oontzr.CANVAS_ATTRIBUTES.STEP_HEIGHT + 2 * Oontzr.CANVAS_ATTRIBUTES.CANVAS_PADDING}`);

        // Clear the canvas
        context.clearRect(0, 0, this.output.canvas.width, this.output.canvas.height);

        // Walk Pattern.steps Array
        stepsPattern.forEach((step, index) => {

            let stepBgFillStyle, stepFillStyle;

            // Set fillStyle for background
            stepBgFillStyle = `${Oontzr.CANVAS_ATTRIBUTES.STEP_COLOR.INACTIVE}`;
            if (index === this.currentStep) stepBgFillStyle = `${Oontzr.CANVAS_ATTRIBUTES.STEP_COLOR.INACTIVE_CURRENT}`;

            // Set fillStyle for active/inactive Step
            if (step.isActive) {
                stepFillStyle = `${Oontzr.CANVAS_ATTRIBUTES.STEP_COLOR.ACTIVE}`;
                if (index === this.currentStep) stepFillStyle = `${Oontzr.CANVAS_ATTRIBUTES.STEP_COLOR.ACTIVE_CURRENT}`;
            } else {
                stepFillStyle = `${Oontzr.CANVAS_ATTRIBUTES.STEP_COLOR.INACTIVE}`;
            }

            // Calculate x, y, width, height of Step rectangle
            // Height is dependent on Step.velocity
            const stepHeight = Oontzr.CANVAS_ATTRIBUTES.STEP_HEIGHT * step.velocity / Oontzr.PATTERN_PARAMETERS.VELOCITY_MAX;
            const stepWidth = Oontzr.CANVAS_ATTRIBUTES.STEP_WIDTH;
            // Step rectangles must be vertically aligned to the bottom of the canvas
            const stepY = Oontzr.CANVAS_ATTRIBUTES.CANVAS_PADDING + Oontzr.CANVAS_ATTRIBUTES.STEP_HEIGHT - stepHeight;
            const stepX = Oontzr.CANVAS_ATTRIBUTES.CANVAS_PADDING + index * (Oontzr.CANVAS_ATTRIBUTES.STEP_WIDTH + Oontzr.CANVAS_ATTRIBUTES.STEP_GAP);

            // First, fill the background
            context.fillStyle = stepBgFillStyle;
            context.fillRect(stepX, Oontzr.CANVAS_ATTRIBUTES.CANVAS_PADDING, stepWidth, Oontzr.CANVAS_ATTRIBUTES.STEP_HEIGHT);

            // Second, fill the foreground
            context.fillStyle = stepFillStyle;
            context.fillRect(stepX, stepY, stepWidth, stepHeight);
        });
    }
}

export default Pattern;