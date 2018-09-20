let template = (function(){

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

    let templ = '<h1>Casino {{casino.name}}</h1>';

    function getPlaceholders(elementString) {
        let paramPattern = /{{(.*?)}}/gi;
        return elementString.match(paramPattern);
    }

    function validateValue(value) {
        return !Array.isArray(value);
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

    function replaceValueInHtml(elementString, element, model) {
        let placeholders = getPlaceholders(elementString);
        let placeholderValues = getPlaceholersValues(placeholders);
        if (getPlaceholders(elementString)) {
            let value;
            for (let i = 0; i < placeholderValues; i++) {
                value = getValueFromModel(placeholderValues[i], model);
                elementString = elementString.replace(placeholders[i], value);
                element.innerHTML = elementString;
            }

            let placeholders = getPlaceholders(elementString);
            for (let i = 0; i < placeholders.length; i++) {
                let placeholder = placeholders[i],
                    value;
                let placeholderValue = placeholder.replace('{{', '').replace('}}', '');
                value = getValueFromModel(placeholderValue, model);
                elementString = elementString.replace(placeholder, value);
                element.innerHTML = elementString;
            }
        }
    }

    function getPlaceholersValues(placeholders) {
        let placeholderValues = [];
        for (let i = 0; i < placeholders.length; i++) {
            let placeholder = placeholders[i];
            placeholderValues.push(placeholder.replace('{{', '').replace('}}', ''));
            console.log('placeholder Values: ', placeholderValues);
        }
        return placeholderValues;
    }

    function render(elementName, model) {
        let elementString,
            element = $$(elementName);
        if (element.length > 0) {
            element = element[0];
        }
        elementString = element.outerHTML;
        replaceValueInHtml(elementString, element, model);
        return element;
    }

    console.log(render('#page-home', model));
    console.log(render('#page-casino-edit', model));
    console.log(render('#page-casino', model));
    console.log(render('#page-jackpot', model));
    console.log(render('#page-tickets', model));
    console.log(render('#page-AFT', model));
    console.log(render('#page-machines', model));
    console.log(render('#page-reports', model));
    console.log(render('#page-users', model));

    //trigerujemo callback event, kao u ruteru
    if (typeof param.callbackEvent !== 'undefined') {
        trigger(param.callbackEvent, {model:model, element:element});
    }

})();