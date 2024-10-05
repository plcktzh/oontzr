import Helpers from '../Helpers.js';
import Playback from '../Playback.js';
import SamplePool from '../SamplePool.js';
import State from '../State.js';

const ooAppCss = document.createElement('template');
ooAppCss.innerHTML = `
<style>
    :host {
        display: flex;
        flex-direction: column;
        gap: var(--oo-margin-base);
        justify-content: space-between;
    }

    :host * {
        box-sizing: border-box;
    }
</style>
`;
const ooAppTemplate = document.createElement('template');
ooAppTemplate.innerHTML = ``;

class App extends HTMLElement {
    /**
     * @static
     * @property {Object} DATA_ATTRIBUTE_PREFIX An Object containing the data attribute prefix for Oontzr as both String and RegExp
     * @property {Object} EVENT_TYPES An Object containing strings for different types of CustomEvent
     * @property {Object} STRINGS An Object containing strings for the UI in different languages
     * @property {Object} PATTERN_TYPES An Object containing strings for different types of pattern
     * @property {Object} PATTERN_PARAMETERS An Object containing some properties for Patterns and Steps
     * @property {Object} PREFIXES An Object containing prefixes for various items
     * @property {Object} CANVAS_ATTRIBUTES An Object containing some properties for Pattern canvas elements
     * @property {Array} SAMPLES An Array containing all the samples for building the SamplePool
     */
    static DATA_ATTRIBUTE_PREFIX = {
        AS_STRING: 'data-oo-',
        AS_REGEXP: /^data-oo-/
    };
    static EVENT_TYPES;
    static STRINGS;
    static PATTERN_TYPES;
    static PATTERN_PARAMETERS;
    static PREFIXES;
    static CANVAS_ATTRIBUTES;
    static SAMPLES;

    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(ooAppCss.content.cloneNode(true));
        this.shadowRoot.appendChild(ooAppTemplate.content.cloneNode(true));
    }

    async connectedCallback() {

        Helpers.nac(this.shadowRoot, Helpers.dce('oo-loader'));

        const {
            _configJson
        } = Helpers.buildConfigFromDataAttribute(this, App.DATA_ATTRIBUTE_PREFIX);

        try {
            // Get config file
            const response = await Helpers.getJson(_configJson);

            let json;

            if (response.status === 200) {

                json = await response.json();

                // Transform property names from abc-def to ABC_DEF and assign properties to App
                Helpers.transformJSONData(App, json);
            } else {

                throw new Error(`${_configJson} could not be fetched. ${response.status} - ${response.statusText}`);
            }

            this._createState();
            this._buildSamplePool();
            this._detachLoader();

            Helpers.nac(this.shadowRoot, Helpers.dce('oo-app-header'));
            Helpers.nac(this.shadowRoot, Helpers.dce('oo-app-main'));
            Helpers.nac(this.shadowRoot, Helpers.dce('oo-app-footer'));

            this.style.marginTop = `${this.shadowRoot.querySelector('oo-app-header').getBoundingClientRect().height}px`
            this.style.marginBottom = `${this.shadowRoot.querySelector('oo-app-footer').getBoundingClientRect().height}px`
        } catch (e) {
            console.error(e);
        }
    }

    _createState() {

        this._s = new State(this, {
            language: Helpers.nqs('html').getAttribute('lang'),
            playback: {
                tempo: {
                    bpm: 120,
                    msPerStep: Playback.getMilliseconds(120)
                },
                swing: {
                    amount: 0,
                    resolution: 16
                },
                isPlaying: false
            },
            patterns: [],
            samples: null
        });


    }

    _buildSamplePool() {

        this._s.samples = new SamplePool(App.SAMPLES);
    }

    _detachLoader() {

        Helpers.nqs('oo-loader', this.shadowRoot).detach();
    }

    play(doRewind) {
        console.log('play', doRewind);

        // if (doRewind) this.rewind();

        // // Step through the patterns
        // this.playNextStep();

        // // Enable playback
        // return this._s.isPlaying = true;
    }

    playNextStep() {
        console.log('playNextStep');

        // setTimeout(() => {
        //     // Walk the Pattern Array
        //     for (const id in this._s.patterns) {
        //         // Get current Step
        //         const {
        //             index,
        //             step
        //         } = this._s.patterns[id].getStep();

        //         if (this._s.patterns[id].sample !== null) {

        //             const stepAudio = new Audio();
        //             stepAudio.src = `${Oontzr.SAMPLES_DIRECTORY}${this._s.patterns[id].sample.filename}`;

        //             if (step.isActive) {
        //                 stepAudio.volume = step.velocity / Oontzr.PATTERN_PARAMETERS.VELOCITY_MAX;
        //                 stepAudio.play();
        //             } else stepAudio.volume = 0;
        //         }

        //         if (index === Object.keys(this._s.patterns[id].steps).length - 1) {
        //             // If "playback head" is on the last step in the pattern, check whether the pattern should be randomized on each repeat
        //             if (this._s.patterns[id].parameters.doRandomize) {
        //                 // Randomize pattern steps
        //                 this._s.patterns[id].steps = this._s.patterns[id].parameters.randomizePattern(this._s.patterns[id].steps);
        //                 // If velocities should also be randomized on each repeat, call Pattern.randomizeStepVelocities
        //                 if (this._s.patterns[id].parameters.doRandomizeVelocities) this._s.patterns[id].randomizeStepVelocities();
        //             }
        //         }

        //         // Redraw canvas
        //         this._s.patterns[id].drawPattern();
        //     }

        //     // If playback hasn't been stopped, play the next Step
        //     if (this._s.isPlaying) this.playNextStep();
        // }, this._s.playback.tempo.msPerStep);
    }

    rewind() {

        console.log('rewind');

        // // Walk through the Pattern Array
        // for (const id in this._s.patterns) {
        //     // Reset the Pattern instance's currentStep
        //     this._s.patterns[id].currentStep = 0;
        // }
    }

    pause() {

        console.log('pause');

        // // Disable playback
        // return this._s.isPlaying = false;
    }
}

window.customElements.define('oo-app', App);

export default App;