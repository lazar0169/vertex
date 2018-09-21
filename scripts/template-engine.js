let template = (function () {

    let model = {
        home: {
            name: 'Home name'
        },
        casino: {
            name: 'Casino name',
            address: 'Casino address',
            edit: 'Casino edit'
        },
        jackpot: {
            number: 123
        },
        tickets: {
            number: 15
        },
        aft: {
            name: 'AFT name'
        },
        machine: {
            number: 24
        },
        user: {
            name: 'Jovana',
            surname: 'Mitic',
            tickets: {
                number: 18
            }
        },
        service: {
            number: 58
        }
    };

    function getPlaceholders(elementString) {
        let paramPattern = /{{(.*?)}}/gi;
        return elementString.match(paramPattern);
    }

    function validateValue(value) {
        let valid = true;
        if (typeof value === 'object' || Array.isArray(value)) {
            valid = false;
        }
        if (!valid) {
            console.error(value + "is not valid");
        }
        return valid;
    }

    function getPlaceholderValues(placeholders, model) {
        let placeholderValues = [];
        if (placeholders !== null && placeholders.length > 0) {
            for (let i = 0; i < placeholders.length; i++) {
                let placeholder = placeholders[i];
                let property = placeholder.replace("{{", "").replace("}}", "").replace("model.", "");
                placeholderValues.push({placeholder: placeholder, value: getValueFromModel(property, model)});
            }
        }
        return placeholderValues;
    }

    function getValueFromModel(placeholderValue, model) {
        let value = placeholderValue.split('.').reduce(function (prev, curr) {
            return prev ? prev[curr] : null
        }, model || self);
        if (validateValue(value)) {
            return value;
        }
        return null;
    }

    function replaceValueInTemplate(elementString, placeholderValues) {
        if (getPlaceholders(elementString)) {
            let value;
            for (let i = 0; i < placeholderValues.length; i++) {
                let placeholder = placeholderValues[i].placeholder;
                value = placeholderValues[i].value;
                elementString = elementString.replace(placeholder, value);
            }
        }
        return elementString;
    }

    function cloneTemplateElement(templateElement) {
        let newElement = templateElement.cloneNode(true);
        newElement.removeAttribute('id');
        newElement.classList.remove('element-template');
        return newElement;
    }

    function render(templateElementSelector, model, callbackEvent) {
        let templateElement = $$(templateElementSelector);
        if (templateElement === null || templateElement.length <= 0) {
            console.error('Template element does not exists!');
        }
        else if (templateElement.length > 0) {
            templateElement = templateElement[0];
        }
        let newElement = cloneTemplateElement(templateElement);
        let newElementString = newElement.innerHTML;
        let placeholders = getPlaceholders(newElementString);
        let placeholderValues = getPlaceholderValues(placeholders, model);
        let replacedString = replaceValueInTemplate(newElementString, placeholderValues);
        newElement.innerHTML  = replacedString;
        if (typeof callbackEvent !== 'undefined') {
            trigger(callbackEvent, {model: model, element: newElement});
        }
        return newElement;
    }

    on('template/render', function (param) {
        let templateElementSelector = param.templateElementSelector;
        let model = param.model;
        if (typeof param.callbackEvent !== 'undefined') {
            render(templateElementSelector, model, param.callbackEvent);
        }
        else {
            render(templateElementSelector, model);
        }
    });

    //For testing:
    render('#casino-template', model);

})();