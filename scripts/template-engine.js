let template = (function () {

    let model = {
        home: {
            Name: 'Home name'
        },
        casinos: {
            Id: 5,
            Name: 'Casino name',
            City: 'Casino city'
        },
        jackpots: {
            Id: 5,
            Name: 'Jackpot name',
            City: 'Jackpot city'
        },
        tickets: {
            Id: 5,
            Name: 'Ticket name',
            City: 'Ticket city'
        },
        aft: {
            Id: 5,
            Name: 'Aft name',
            City: 'Aft city'
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
        newElement.innerHTML = replacedString;
        if (typeof callbackEvent !== 'undefined') {
            trigger(callbackEvent, {model: model, element: newElement});
        }
        console.log('new element', newElement);
        return newElement;
    }

    on('template/render', function (params) {
        let templateElementSelector = params.templateElementSelector;
        let model = params.model;
        let newHtmlElement;
        if (typeof params.callbackEvent !== 'undefined') {
            newHtmlElement = render(templateElementSelector, model, params.callbackEvent);
        }
        else {
            newHtmlElement = render(templateElementSelector, model);
        }
        trigger(params.callbackEvent, {element: newHtmlElement, params: params, model: params.model});
    });

    //For testing:
    // render('#home-template', model);

})();