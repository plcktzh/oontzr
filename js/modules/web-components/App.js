import Helpers from '../Helpers.js';
import Playback from '../Playback.js';
import SamplePool from '../SamplePool.js';
import State from '../State.js';
import AppFooter from './AppFooter.js';
import AppHeader from './AppHeader.js';
import AppMain from './AppMain.js';

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
            this._createAudioContext();
            this._detachLoader();

            Helpers.nac(this.shadowRoot, new AppHeader(this));
            Helpers.nac(this.shadowRoot, new AppMain(this));
            Helpers.nac(this.shadowRoot, new AppFooter(this));

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

    _createAudioContext() {

        this.audioContext = new(window.AudioContext || window.webkit.AudioContext)();

        for (const index in this._s.samples) {

            fetch(`${App.SAMPLES_DIRECTORY}${this._s.samples[index].filename}`)
                .then(data => data.arrayBuffer())
                .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
                .then(decodedAudio => this._s.samples[index]['audio'] = decodedAudio);
        }
    }

    _detachLoader() {

        Helpers.nqs('oo-loader', this.shadowRoot).detach();
    }

    play(doRewind) {

        if (doRewind) this.rewind();

        // Step through the patterns
        this.playNextStep();

        // Enable playback
        return this._s.isPlaying = true;
    }

    playNextStep() {

        setTimeout(() => {
            // Walk the Pattern Array
            for (const id in this._s.patterns) {
                // Get current Step
                const {
                    index,
                    step
                } = this._s.patterns[id].getStep();

                if (this._s.patterns[id].sample !== null) {

                    if (step.isActive) {
                        const playStep = this.audioContext.createBufferSource();
                        playStep.buffer = this._s.patterns[id].sample.audio;

                        const gainNode = this.audioContext.createGain();
                        gainNode.gain.setValueAtTime((this._s.patterns[id].parameters.volume / App.PATTERN_PARAMETERS.VOLUME_MAX) * (step.velocity / App.PATTERN_PARAMETERS.VELOCITY_MAX), this.audioContext.currentTime);

                        const compNode = this.audioContext.createDynamicsCompressor();
                        compNode.threshold.setValueAtTime(-45, this.audioContext.currentTime);
                        compNode.knee.setValueAtTime(35, this.audioContext.currentTime);
                        compNode.ratio.setValueAtTime(20, this.audioContext.currentTime);
                        compNode.attack.setValueAtTime(0.05, this.audioContext.currentTime);
                        compNode.release.setValueAtTime(.5, this.audioContext.currentTime);

                        playStep.connect(gainNode);
                        gainNode.connect(compNode);
                        compNode.connect(this.audioContext.destination);

                        playStep.start(this.audioContext.currentTime);
                    }
                }

                this._s.patterns[id].setAttribute('data-oo-step-current', index);

                if (index === Object.keys(this._s.patterns[id].steps).length - 1) {
                    // If "playback head" is on the last step in the pattern, check whether the pattern should be randomized on each repeat
                    if (this._s.patterns[id].parameters.doRandomize) {

                        // Randomize pattern steps
                        this._s.patterns[id].steps = this._s.patterns[id].parameters.randomizePattern(this._s.patterns[id].steps);

                        // If velocities should also be randomized on each repeat, call Pattern.randomizeStepVelocities
                        if (this._s.patterns[id].parameters.doRandomizeVelocities) this._s.patterns[id].randomizeStepVelocities();

                        this._s.patterns[id].dispatchEvent(new Event(App.EVENT_TYPES.STEPS_CHANGE));
                    }
                }
            }

            // If playback hasn't been stopped, play the next Step
            if (this._s.isPlaying) this.playNextStep();
        }, this._s.playback.tempo.msPerStep);
    }

    rewind() {

        // Walk through the Pattern Array
        for (const id in this._s.patterns) {
            // Reset the Pattern instance's currentStep
            this._s.patterns[id].currentStep = 0;
        }
    }

    pause() {

        // Disable playback
        return this._s.isPlaying = false;
    }
}

window.customElements.define('oo-app', App);

export default App;