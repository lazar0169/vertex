let template = (function () {

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
        let value = getProperty(placeholderValue, model);
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

    function render(templateElementSelector, model, callbackEvent,params) {
        let templateElement = $$(templateElementSelector);

        if (templateElement === null || templateElement.length <= 0) {
            console.error('Template element does not exists!');
        } else if (templateElement.length > 0) {
            templateElement = templateElement[0];
        }
        let newElement = cloneTemplateElement(templateElement);
        if ( model !==  undefined) {
            // trigger(callbackEvent, {element: newElement});
            let newElementString = newElement.innerHTML;
            let placeholders = getPlaceholders(newElementString);
            let placeholderValues = getPlaceholderValues(placeholders, model);
            newElement.innerHTML = replaceValueInTemplate(newElementString, placeholderValues);

        }
        if (callbackEvent !==  undefined) {
            trigger(callbackEvent, {model: model, element: newElement,params:params});
        }

        return newElement;
    }

    function replaceText(templateString, arrayOfTranslationStrings) {
        let regExp = /%s/;
        for (let i = 0; i < arrayOfTranslationStrings.length; i++) {
            templateString = templateString.replace(regExp, arrayOfTranslationStrings[i]);
        }
        return templateString;
    }

    on('template/render', function (params) {
        let templateElementSelector = params.templateElementSelector;
        let model = params.model;
        render(templateElementSelector, model, params.callbackEvent,params);
    });

    return {
        replaceText: replaceText
    };

})();