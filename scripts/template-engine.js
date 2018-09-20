let template = (function () {

    let model = {
        home: {
            name: 'Home name'
        },
        casino: {
            name: 'Casino name',
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

    function replaceValueInHtml(elementString, placeholderValues) {
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

/*
    function createDomElementFromHtml (elementString, templateElement) {
        if (document.createRange) {     // all browsers, except IE before version 9
            let rangeObj = document.createRange ();
            if (rangeObj.createContextualFragment) {    // all browsers, except IE

                let documentFragment = rangeObj.createContextualFragment(elementString);
                templateElement.parentNode.insertBefore(documentFragment, templateElement);
                templateElement.style.display = 'none';
            }
            else {      // Internet Explorer from version 9
                templateElement.insertAdjacentHTML ("beforeBegin", elementString);
            }
        }
        else {      // Internet Explorer before version 9
            templateElement.insertAdjacentHTML ("beforeBegin", elementString);
        }
    }
    */

    function render(templateElementSelector, model, targetElementSelector, callbackEvent) {
        let templateElement = $$(templateElementSelector);
        let targetElement = $$(targetElementSelector);
        if (templateElement === null || templateElement.length <= 0) {
            console.error('template element does not exists');
        }
        else if (templateElement.length > 0) {
            templateElement = templateElement[0];
        }
        let placeholders = getPlaceholders(templateElement.innerHTML);
        let placeholderValues = getPlaceholderValues(placeholders, model);
        let elementString = templateElement.innerHTML;
        let replacedString = replaceValueInHtml(elementString, placeholderValues);
        targetElement.innerHTML = replacedString;
        // createDomElementFromHtml(replacedString, templateElement);
        if (typeof callbackEvent !== 'undefined') {
            trigger(callbackEvent, {element: templateElement, model: model});
        }
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

    render('#template-page-home', model, '#page-home');
    render('#template-page-casino', model, '#page-casino');
    render('#template-page-casino-edit', model, '#page-casino-edit');
    render('#template-page-jackpot', model, '#page-jackpot');
    render('#template-page-tickets', model, '#page-tickets');
    render('#template-page-machines', model, '#page-machines');
    render('#template-page-reports', model, '#page-reports');

})();

/*trigger('template/render', {
    model : {
        home: {
            name: 'Home name'
        },
        casino: {
            name: 'Casino name',
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
    },
    templateElementSelector: "#user-template",
    callbackEvent: 'replace-tickets'
});*/


