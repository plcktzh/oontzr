class Helpers {

    static dqs(cssSelector) {
        return document.querySelector(cssSelector);
    }

    static dqsa(cssSelector) {
        return document.querySelectorAll(cssSelector);
    }

    static dce(htmlTag) {
        return document.createElement(htmlTag);
    }

    static isObj(variable) {
        return typeof variable === 'object';
    }

    static isInObj(target, property) {
        return Object.hasOwn(target, property);
    }

    static isInArr(target, property) {
        return target.indexOf(property) > -1;
    }

    static initProps(target, properties, exceptions = []) {

        if (!Helpers.isObj(properties)) return;

        for (const property in properties) {

            if (property === 'parent' || Helpers.isInArr(exceptions, property)) continue;

            if (Helpers.isInObj(target, property)) {

                if (Helpers.isObj(properties[property])) {

                    Helpers.initProps(target[property], properties[property]);
                } else {

                    target[property] = properties[property];
                }
            }
        }
    }
}

export default Helpers;