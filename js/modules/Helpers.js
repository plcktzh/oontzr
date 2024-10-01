import Oontzr from './Oontzr.js';

/**
 * @class Helpers
 */
class Helpers {

    /**
     * dqs = Shorthand for document.querySelector
     * @static
     * @method dqs
     * @param {String} cssSelector The CSS selector of the HTMLElement to be retrieved
     * @returns HTMLElement
     */
    static dqs(cssSelector) {
        return document.querySelector(cssSelector);
    }

    /**
     * dqsa = Shorthand for document.querySelectorAll
     * @static
     * @method dqsa
     * @param {String} cssSelector The CSS selector for the NodeList to be retrieved
     * @returns NodeList
     */
    static dqsa(cssSelector) {
        return document.querySelectorAll(cssSelector);
    }

    /**
     * dce = Shorthand for document.createElement
     * @static
     * @method dce
     * @param {String} htmlTag The HTML tag name for the HTMLElement to be created
     * @returns HTMLElement
     */
    static dce(htmlTag) {
        return document.createElement(htmlTag);
    }

    /**
     * @static
     * @method isObj
     * @param {*} variable The item to be tested
     * @returns Boolean
     */
    static isObj(variable) {
        return typeof variable === 'object';
    }

    /**
     * @static
     * @method isArr
     * @param {*} variable The item to be tested
     * @returns Boolean
     */
    static isArr(variable) {
        return Array.isArray(variable);
    }

    /**
     * @static
     * @method isInObj
     * @param {Object} obj The Object to be tested for the presence of <property>
     * @param {String} property The property to be looked up in <obj>
     * @returns Boolean
     */
    static isInObj(obj, property) {
        return Object.hasOwn(obj, property);
    }

    /**
     * @static
     * @method isInArr
     * @param {Array} arr The Array to be tested for the presence of <value>
     * @param {*} value The value to be looked up in <arr>
     * @returns Boolean
     */
    static isInArr(arr, value) {
        return arr.indexOf(value) > -1;
    }

    /**
     * @method shuffleArr
     * @param {Array} arr The Array to be shuffled
     * @returns Array
     */
    static shuffleArr(arr) {

        return arr.map((a) => ({
                sort: Math.random(),
                value: a
            }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value);
    }

    /**
     * A method for recursively transferring properties from one Object to another, i.e. deep cloning an Object
     * @static
     * @method transferProps
     * @param {Object} target The Object to be populated with <properties>
     * @param {Object} properties The Object containing properties to be transferred onto <target>
     * @param {Array} exceptions An Array of property names to be excluded
     * @returns null
     */
    static transferProps(target, properties, exceptions = []) {

        // Add 'parent' property by default if it's not already contained in <exceptions>
        if (!Helpers.isInArr(exceptions, 'parent')) exceptions = ['parent', ...exceptions];

        // If <properties> is not an Object, there's no point in continuing.
        if (!Helpers.isObj(properties)) return;

        // Walk the <properties> Object
        for (const property in properties) {

            // Ignore properties in <exceptions> Array
            if (Helpers.isInArr(exceptions, property)) continue;

            // Continue if <property> is present in <target>
            if (Helpers.isInObj(target, property)) {

                // If the current <property>'s value is an Object, recursively call this method with the <target>'s property <property> as new <target> and the <property>'s value as the new <properties> Object
                if (Helpers.isObj(properties[property])) Helpers.transferProps(target[property], properties[property]);
                // Assign the current <property>'s value to <target>'s property <property>
                else target[property] = properties[property];
            }
        }
    }

    /**
     * @static
     * @method buildConfigFromDataAttribute
     * @param {Object} target The target Object to assign the new properties to
     * @param {HTMLElement} element The HTMLElement containing the data attributes to be read
     * @param {Object} prefix An Object containing at least 2 properties: AS_STRING, AS_REGEXP
     * @returns null
     */
    static buildConfigFromDataAttribute(target, element, prefix) {

        // Call an empty Array's forEach method on <element>'s attributes Array
        [].forEach.call(element.attributes, attribute => {

            // Check if <attribute>'s name matches the prefix RegExp
            if (prefix.AS_REGEXP.test(attribute.name)) {

                // Remove the prefix String from the beginning of <attribute>'s name, then replace all hyphens/dashes (-) from the resulting String, and convert that result to camelCase.
                const configItem = attribute.name.substr(-(attribute.name.length - prefix.AS_STRING.length)).replace(/-(.)/g, ($0, $1) => {
                    return $1.toUpperCase();
                });

                // Add a new property to <target> and assign <attribute>'s value
                target[configItem] = attribute.value;
            }
        });
    }

    /**
     * @static
     * @method transformJSONData
     * @param {Object} target The Object to be populated with <properties>
     * @param {Object} properties The Object containing properties to be renamed and transferred onto <target>
     * @returns null
     */
    static transformJSONData(target, properties) {

        // If <properties> is not an Object, there's no point in continuing.
        if (!Helpers.isObj(properties)) return;

        // Walk the <properties> Object
        for (const property in properties) {

            // Transfer <properties>[abc-def] to <target>[ABC_DEF]
            target[Helpers.transformStringToConstantName(property)] = properties[property];

            // Check if <properties>[property] is an Object and not an Array
            if (Helpers.isObj(properties[property]) && !Helpers.isArr(properties[property])) {
                // If so, recursively call this method
                Helpers.transformJSONData(target[Helpers.transformStringToConstantName(property)], properties[property]);
            }

            // Delete <target>[abc-def], since its content is now in <target>[ABC_DEF]
            delete target[property];
        }
    }

    /**
     * @static
     * @method transformStringToConstantName
     * @param {String} inputString The String to be transformed from aBc-dEf to ABC_DEF
     * @returns String
     */
    static transformStringToConstantName(inputString) {

        return inputString.replace('-', '_').toUpperCase();
    }

    /**
     * @static
     * @method getJson
     * @param {String} jsonFile The JSON file to be read
     * @returns Promise
     */
    static getJson(jsonFile) {

        return fetch(jsonFile);
    }

    /**
     * @static
     * @method getRandomId
     * @param {String} prefix The prefix for the ID to be created
     * @returns String
     */
    static getRandomId(prefix) {

        return `${prefix}${self.crypto.getRandomValues(new Uint32Array(1))}`;
    }

    /**
     * @static
     * @method checkCollision
     * @param {*} mouseCoordinates
     * @param {*} stepCoordinates
     * @returns Boolean
     */
    static checkCollision(mouseCoordinates, stepCoordinates) {

        return (mouseCoordinates.x <= stepCoordinates.x + stepCoordinates.w && mouseCoordinates.x >= stepCoordinates.x && mouseCoordinates.y <= stepCoordinates.y + stepCoordinates.h && mouseCoordinates.y >= stepCoordinates.y);
    }

    /**
     * @static
     * @method checkClickedStep
     * @param {Object} mouseCoordinates The position of the mouse pointer on click
     * @param {Array} steps The Pattern's steps Array
     */
    static checkClickedStep(mouseCoordinates, steps) {

        let output = {};

        steps.forEach((step, index) => {

            // The number of gaps between steps is 0..index-1
            const numGaps = (index === 0) ? 0 : index - 1;

            // Calculate the current <step>'s coordinates
            const stepCoordinates = {
                x: Oontzr.CANVAS_ATTRIBUTES.CANVAS_PADDING + index * Oontzr.CANVAS_ATTRIBUTES.STEP_WIDTH + numGaps * Oontzr.CANVAS_ATTRIBUTES.STEP_GAP,
                y: Oontzr.CANVAS_ATTRIBUTES.CANVAS_PADDING,
                w: Oontzr.CANVAS_ATTRIBUTES.STEP_WIDTH,
                h: Oontzr.CANVAS_ATTRIBUTES.STEP_HEIGHT
            };

            // On collision between mouse and <step>, return an object containing both the index and step
            if (Helpers.checkCollision(mouseCoordinates, stepCoordinates)) output = {
                index: index,
                step: step
            };
        });

        return output;
    }
}

export default Helpers;