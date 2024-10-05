import Helpers from '../Helpers.js';
import App from './App.js';
import Cellular from '../pattern-types/Cellular.js';
import Euclidean from '../pattern-types/Euclidean.js';
import Random from '../pattern-types/Random.js';
import TR from '../pattern-types/TR.js';
import Step from '../Step.js';

const ooPatternTemplate = document.createElement('template');
ooPatternTemplate.innerHTML = `
<div class="inner">
</div>
`;

const ooPatternCss = document.createElement('template');
ooPatternCss.innerHTML = `
<style>
    :host {
        background-color: var(--oo-color-gray-lightest);
        border-radius: var(--oo-border-radius);
        display: block;
    }

    .inner {
        gap: var(--oo-margin-base);
        padding: var(--oo-padding-medium);
    }
</style>
`;

class Pattern extends HTMLElement {

    /**
     * @property {State} parent The parent State instance
     * @property {String} id The ID of this Pattern instance
     * @property {String} type The type of this Pattern instance
     * @property {PatternType} parameters An instance of PatternType posessing the parameters for this Pattern instance
     * @property {Array} steps An Array of Step instances representing this Pattern instance
     * @property {Number} currentStep The current step
     * @property {Sample} sample The chosen Sample for this instance of Pattern
     * @property {Object} output Properties for displaying the pattern, e.g. canvas
     */
    parent = null;
    id = '';
    type = '';
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
        super();

        this.parent = parent;

        Helpers.transferProps(this, args);

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooPatternCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooPatternTemplate.content.cloneNode(true));
    }

    static get observedAttributes() {

        return ['id', 'data-expanded', 'data-oo-pattern-type', 'data-oo-pattern-length', 'data-oo-num-events', 'data-oo-pattern-offset', 'data-oo-do-randomize-velocities', 'data-oo-do-randomize', 'data-oo-num-seeds', 'data-oo-do-center-seeds', 'data-oo-wrap-around'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        const args = {};

        switch (name) {
            case 'id':
                this.id = newValue;
                break;
            case 'data-expanded':
                break;
            case 'data-oo-pattern-type':
                this.type = newValue;
                break;
            case 'data-oo-pattern-length':
            case 'data-oo-num-events':
            case 'data-oo-num-seeds':
                this.parameters[Helpers.getVariableName(name, App.DATA_ATTRIBUTE_PREFIX)] = parseInt(newValue) || App.PATTERN_TYPES[this.type.toUpperCase()]['PARAMETERS'][name.replace(App.DATA_ATTRIBUTE_PREFIX.AS_STRING, '').replaceAll('-', '_').toUpperCase()]['INITIALVALUE'];

                args[Helpers.getVariableName(name, App.DATA_ATTRIBUTE_PREFIX)] = parseInt(newValue);
                this.updateSteps(args);
                break;
            case 'data-oo-pattern-offset':
            case 'data-oo-do-randomize-velocities':
            case 'data-oo-do-randomize':
            case 'data-oo-do-center-seeds':
            case 'data-oo-wrap-around':
                this.parameters[Helpers.getVariableName(name, App.DATA_ATTRIBUTE_PREFIX)] = ((newValue === 'true') ? true : false) || App.PATTERN_TYPES[this.type.toUpperCase()]['PARAMETERS'][name.replace(App.DATA_ATTRIBUTE_PREFIX.AS_STRING, '').replaceAll('-', '_').toUpperCase()]['INITIALVALUE'];

                args[Helpers.getVariableName(name, App.DATA_ATTRIBUTE_PREFIX)] = (newValue === 'true') ? true : false;
                this.updateSteps(args);
                break;
        }
    }

    connectedCallback() {

        this._setPatternType();
        this.updateSteps();
    }

    disconnectedCallback() {

        console.log('disconnected');
    }

    _setPatternType() {

        this.setAttribute('data-oo-pattern-type', this.type);

        switch (this.type) {
            case App.PATTERN_TYPES.CELLULAR.TYPE:
                this.parameters = new Cellular(this, {
                    parent: this,
                    patternLength: this.getAttribute('data-oo-pattern-length') ? parseInt(this.getAttribute('data-oo-pattern-length')) : App.PATTERN_TYPES.CELLULAR.PARAMETERS.PATTERN_LENGTH,
                    numSeeds: this.getAttribute('data-oo-num-seeds') ? parseInt(this.getAttribute('data-oo-num-seeds')) : App.PATTERN_TYPES.CELLULAR.PARAMETERS.NUM_SEEDS,
                    doCenterSeeds: this.getAttribute('data-oo-do-center-seeds') ? ((this.getAttribute('data-oo-do-center-seeds') === 'true') ? true : false) : App.PATTERN_TYPES.CELLULAR.PARAMETERS.DO_CENTER_SEEDS,
                    doRandomizeVelocities: this.getAttribute('data-oo-do-randomize-velocities') ? ((this.getAttribute('data-oo-do-randomize-velocities') === 'true') ? true : false) : App.PATTERN_TYPES.CELLULAR.PARAMETERS.DO_RANDOMIZE_VELOCITIES,
                    wrapAround: this.getAttribute('data-oo-wrap-around') ? ((this.getAttribute('data-oo-wrap-around') === 'true') ? true : false) : App.PATTERN_TYPES.CELLULAR.PARAMETERS.WRAP_AROUND,
                    doRandomize: this.getAttribute('data-oo-do-randomize') ? ((this.getAttribute('data-oo-do-randomize') === 'true') ? true : false) : App.PATTERN_TYPES.CELLULAR.PARAMETERS.DO_RANDOMIZE
                });
                this.setAttribute('data-oo-pattern-length', this.parameters.patternLength);
                this.setAttribute('data-oo-num-seeds', this.parameters.numSeeds);
                this.setAttribute('data-oo-do-center-seeds', this.parameters.doCenterSeeds);
                this.setAttribute('data-oo-do-randomize-velocities', this.parameters.doRandomizeVelocities);
                this.setAttribute('data-oo-do-randomize', this.parameters.doRandomize);
                break;
            case App.PATTERN_TYPES.EUCLIDEAN.TYPE:
                this.parameters = new Euclidean(this, {
                    parent: this,
                    patternLength: this.getAttribute('data-oo-pattern-length') ? parseInt(this.getAttribute('data-oo-pattern-length')) : App.PATTERN_TYPES.EUCLIDEAN.PARAMETERS.PATTERN_LENGTH,
                    numEvents: this.getAttribute('data-oo-num-events') ? parseInt(this.getAttribute('data-oo-num-events')) : App.PATTERN_TYPES.EUCLIDEAN.PARAMETERS.NUM_EVENTS,
                    patternOffset: this.getAttribute('data-oo-pattern-offset') ? parseInt(this.getAttribute('data-oo-pattern-offset')) : App.PATTERN_TYPES.EUCLIDEAN.PARAMETERS.PATTERN_OFFSET,
                    doRandomizeVelocities: this.getAttribute('data-oo-do-randomize-velocities') ? ((this.getAttribute('data-oo-do-randomize-velocities') === 'true') ? true : false) : App.PATTERN_TYPES.EUCLIDEAN.PARAMETERS.DO_RANDOMIZE_VELOCITIES,
                    doRandomize: this.getAttribute('data-oo-do-randomize') ? ((this.getAttribute('data-oo-do-randomize') === 'true') ? true : false) : App.PATTERN_TYPES.EUCLIDEAN.PARAMETERS.DO_RANDOMIZE
                });
                this.setAttribute('data-oo-pattern-length', this.parameters.patternLength);
                this.setAttribute('data-oo-num-events', this.parameters.numEvents);
                this.setAttribute('data-oo-pattern-offset', this.parameters.patternOffset);
                this.setAttribute('data-oo-do-randomize-velocities', this.parameters.doRandomizeVelocities);
                this.setAttribute('data-oo-do-randomize', this.parameters.doRandomize);
                break;
            case App.PATTERN_TYPES.RANDOM.TYPE:
                this.parameters = new Random(this, {
                    parent: this,
                    patternLength: this.getAttribute('data-oo-pattern-length') ? parseInt(this.getAttribute('data-oo-pattern-length')) : App.PATTERN_TYPES.RANDOM.PARAMETERS.PATTERN_LENGTH,
                    patternOffset: this.getAttribute('data-oo-pattern-offset') ? parseInt(this.getAttribute('data-oo-pattern-offset')) : App.PATTERN_TYPES.RANDOM.PARAMETERS.PATTERN_OFFSET,
                    doRandomizeVelocities: this.getAttribute('data-oo-do-randomize-velocities') ? ((this.getAttribute('data-oo-do-randomize-velocities') === 'true') ? true : false) : App.PATTERN_TYPES.RANDOM.PARAMETERS.DO_RANDOMIZE_VELOCITIES,
                    doRandomize: this.getAttribute('data-oo-do-randomize') ? ((this.getAttribute('data-oo-do-randomize') === 'true') ? true : false) : App.PATTERN_TYPES.RANDOM.PARAMETERS.DO_RANDOMIZE
                });
                this.setAttribute('data-oo-pattern-length', this.parameters.patternLength);
                this.setAttribute('data-oo-pattern-offset', this.parameters.patternOffset);
                this.setAttribute('data-oo-do-randomize-velocities', this.parameters.doRandomizeVelocities);
                this.setAttribute('data-oo-do-randomize', this.parameters.doRandomize);
                break;
            case App.PATTERN_TYPES.TR.TYPE:
            default:
                this.parameters = new TR(this, {
                    parent: this,
                    patternLength: this.getAttribute('data-oo-pattern-length') ? parseInt(this.getAttribute('data-oo-pattern-length')) : App.PATTERN_TYPES.TR.PARAMETERS.PATTERN_LENGTH,
                    patternOffset: this.getAttribute('data-oo-pattern-offset') ? parseInt(this.getAttribute('data-oo-pattern-offset')) : App.PATTERN_TYPES.TR.PARAMETERS.PATTERN_OFFSET,
                    doRandomizeVelocities: this.getAttribute('data-oo-do-randomize-velocities') ? ((this.getAttribute('data-oo-do-randomize-velocities') === 'true') ? true : false) : App.PATTERN_TYPES.TR.PARAMETERS.DO_RANDOMIZE_VELOCITIES,
                    doRandomize: this.getAttribute('data-oo-do-randomize') ? ((this.getAttribute('data-oo-do-randomize') === 'true') ? true : false) : App.PATTERN_TYPES.TR.PARAMETERS.DO_RANDOMIZE
                });
                this.setAttribute('data-oo-pattern-length', this.parameters.patternLength);
                this.setAttribute('data-oo-pattern-offset', this.parameters.patternOffset);
                this.setAttribute('data-oo-do-randomize-velocities', this.parameters.doRandomizeVelocities);
                this.setAttribute('data-oo-do-randomize', this.parameters.doRandomize);
                break;
        }

        console.log(this.parameters);
    }

    //     // Initialize canvas and append it to App's container
    //     this.initCanvas();
    //     this.parent.parent.parent.append(this.output.canvas);

    //     // For TR style Patterns, add an event listener for mouse clicks
    //     if (this.parameters.type === App.PATTERN_TYPES.TR.TYPE) this.output.canvas.addEventListener('click', (e) => {

    //         // Get mouse's coordinates in relation to the canvas' position in the browser window
    //         const mouseCoordinates = {
    //             x: e.clientX - this.output.canvas.getBoundingClientRect().x,
    //             y: e.clientY - this.output.canvas.getBoundingClientRect().y
    //         };

    //         // Check which Step has been clicked
    //         const {
    //             index,
    //             step
    //         } = Helpers.checkClickedStep(mouseCoordinates, this.steps, App.CANVAS_ATTRIBUTES);

    //         // "Invert" the Step that was clicked
    //         if (step) {

    //             this.steps[index] = new Step({
    //                 isActive: !step.isActive,
    //                 velocity: (step.isActive) ? 0 : 127
    //             });

    //             // Update canvas
    //             this.drawPattern();
    //         }
    //     });

    //     return this;
    // }

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
        // if (this.output.canvas) this.drawPattern();

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

            // if (this.output.canvas) this.drawPattern();

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

    // /**
    //  * @method setSample
    //  * @param {String} id The ID of the Sample to be assigned to the pattern
    //  * @returns null
    //  */
    // setSample(id) {

    //     this.sample = this.parent.samples.getSample(id);
    // }

    // /**
    //  * @method setChokesPattern
    //  * @param {String} id The ID of the Pattern to be choked by this Pattern instance
    //  * @returns Pattern
    //  */
    // setChokesPattern(id) {

    //     try {
    //         if (this.parent.patternExists(id)) this.chokesPattern = id;
    //         else throw new Error(`Pattern '${id}' could not be found.`);
    //     } catch (e) {
    //         console.error(e);
    //     }

    //     return this;
    // }

    /**
     * @method randomizeStepVelocities
     * @returns null
     */
    randomizeStepVelocities() {

        this.steps.forEach(step => {
            step.setVelocity();
        });

        // if (this.output.canvas) this.drawPattern();
    }

    // /**
    //  * @method getStep
    //  * @param {Number} id The (optional) ID of the Step to be returned
    //  * @returns Object
    //  */
    // getStep(id) {

    //     if (id) {
    //         // The method was called with ID parameter, get this.steps[id]
    //         try {
    //             // If id is within bounds, return Object with index and Step
    //             if (id > 0 && id < this.steps.length) return {
    //                 index: id,
    //                 step: this.steps[id]
    //             };

    //             // ... or throw an error if the ID is out of bounds
    //             throw new Error(`Step ${id} could not be found.`);
    //         } catch (e) {
    //             // ... and catch it to display an error message
    //             console.error(e);
    //         }
    //     } else {
    //         // The method was called without ID parameter

    //         // Increase the currentStep property of Pattern instance
    //         ++this.currentStep;

    //         // Prevent currentStep from going out of bounds
    //         if (this.currentStep >= this.steps.length) this.currentStep = 0;

    //         // Return Object with index and Step
    //         return {
    //             index: this.currentStep,
    //             step: this.steps[this.currentStep]
    //         };
    //     }
    // }

    // /**
    //  * @method initCanvas
    //  * @returns HTMLElement
    //  */
    // initCanvas() {

    //     // Create a new canvas HTMLElement, add class and data attribute
    //     this.output.canvas = Helpers.dce('canvas');
    //     this.output.canvas.classList.add('pattern-lane');
    //     this.output.canvas.setAttribute('data-oontzr-pattern-id', this.id);
    //     // Get context for canvas
    //     this.output.context = this.output.canvas.getContext('2d');

    //     return this.output.canvas;
    // }

    // /**
    //  * @method drawPattern
    //  * @returns null
    //  */
    // drawPattern() {

    //     const canvasObj = this.output.canvas;
    //     const context = this.output.context;
    //     const stepsPattern = this.steps;

    //     // Set canvas dimensions in relation to length of Pattern.steps
    //     canvasObj.setAttribute('width', `${this.steps.length * App.CANVAS_ATTRIBUTES.STEP_WIDTH + 2 * App.CANVAS_ATTRIBUTES.CANVAS_PADDING + (this.steps.length - 1) * App.CANVAS_ATTRIBUTES.STEP_GAP}`);
    //     canvasObj.setAttribute('height', `${App.CANVAS_ATTRIBUTES.STEP_HEIGHT + 2 * App.CANVAS_ATTRIBUTES.CANVAS_PADDING}`);

    //     // Clear the canvas
    //     context.clearRect(0, 0, this.output.canvas.width, this.output.canvas.height);

    //     // Walk Pattern.steps Array
    //     stepsPattern.forEach((step, index) => {

    //         let stepBgFillStyle, stepFillStyle;

    //         // Set fillStyle for background
    //         stepBgFillStyle = `${App.CANVAS_ATTRIBUTES.STEP_COLOR.INACTIVE}`;
    //         if (index === this.currentStep) stepBgFillStyle = `${App.CANVAS_ATTRIBUTES.STEP_COLOR.INACTIVE_CURRENT}`;

    //         // Set fillStyle for active/inactive Step
    //         if (step.isActive) {
    //             stepFillStyle = `${App.CANVAS_ATTRIBUTES.STEP_COLOR.ACTIVE}`;
    //             if (index === this.currentStep) stepFillStyle = `${App.CANVAS_ATTRIBUTES.STEP_COLOR.ACTIVE_CURRENT}`;
    //         } else {
    //             stepFillStyle = `${App.CANVAS_ATTRIBUTES.STEP_COLOR.INACTIVE}`;
    //         }

    //         // Calculate x, y, width, height of Step rectangle
    //         // Height is dependent on Step.velocity
    //         const stepHeight = App.CANVAS_ATTRIBUTES.STEP_HEIGHT * step.velocity / App.PATTERN_PARAMETERS.VELOCITY_MAX;
    //         const stepWidth = App.CANVAS_ATTRIBUTES.STEP_WIDTH;
    //         // Step rectangles must be vertically aligned to the bottom of the canvas
    //         const stepY = App.CANVAS_ATTRIBUTES.CANVAS_PADDING + App.CANVAS_ATTRIBUTES.STEP_HEIGHT - stepHeight;
    //         const stepX = App.CANVAS_ATTRIBUTES.CANVAS_PADDING + index * (App.CANVAS_ATTRIBUTES.STEP_WIDTH + App.CANVAS_ATTRIBUTES.STEP_GAP);

    //         // First, fill the background
    //         context.fillStyle = stepBgFillStyle;
    //         context.fillRect(stepX, App.CANVAS_ATTRIBUTES.CANVAS_PADDING, stepWidth, App.CANVAS_ATTRIBUTES.STEP_HEIGHT);

    //         // Second, fill the foreground
    //         context.fillStyle = stepFillStyle;
    //         context.fillRect(stepX, stepY, stepWidth, stepHeight);
    //     });
    // }
}

window.customElements.define('oo-pattern', Pattern);

export default Pattern;