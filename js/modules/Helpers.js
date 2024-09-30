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
     * @method isInObj
     * @param {Object} target The Object to be tested for the presence of <property>
     * @param {String} property The property to be looked up in <target>
     * @returns Boolean
     */
    static isInObj(target, property) {
        return Object.hasOwn(target, property);
    }

    /**
     * @static
     * @method isInArr
     * @param {Array} target The Array to be tested for the presence of <value>
     * @param {*} value The value to be looked up in <target>
     * @returns Boolean
     */
    static isInArr(target, value) {
        return target.indexOf(value) > -1;
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

        // If <properties> is not an Object, there's no point continuing.
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
     * @method buildConfigFromData
     * @param {HTMLElement} element The HTMLElement containing the data attributes to be read
     * @param {Object} prefix An Object containing at least 2 properties: asString, asRegexp
     * @returns Object
     */
    static buildConfigFromData(element, prefix) {

        // Create an empty Object
        let output = {};

        // Call an empty Array's forEach method on <element>'s attributes Array
        [].forEach.call(element.attributes, attribute => {

            // Check if <attribute>'s name matches the prefix RegExp
            if (prefix.asRegexp.test(attribute.name)) {

                // Remove the prefix String from the beginning of <attribute>'s name, then replace all hyphens/dashes (-) from the resulting String, and convert that result to camelCase.
                const configItem = attribute.name.substr(-(attribute.name.length - prefix.asString.length)).replace(/-(.)/g, ($0, $1) => {
                    return $1.toUpperCase();
                });

                // Add a new property to <output> and assign <attribute>'s value
                output[configItem] = attribute.value;
            }
        });

        return output;
    }

    /**
     * @static
     * @async
     * @method getJson
     * @param {String} jsonFile The JSON file to be read
     * @returns Object
     */
    static async getJson(jsonFile) {

        return fetch(jsonFile).then(response => response.json());
    }
}

export default Helpers;