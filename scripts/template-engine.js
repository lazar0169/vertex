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

    //TODO:
    function createDomElementFromHtml(html) {
        return document.createRange().createContextualFragment(html);
    }

    function render(templateElementSelector, model, callbackEvent) {
        let element = $$(templateElementSelector);
        if (element === null || element.length <= 0) {
            console.error('template element does not exists');
        }
        else if (element.length > 0) {
            element = element[0];
        }
        let placeholders = getPlaceholders(element.outerHTML),
            placeholderValues = getPlaceholderValues(placeholders,model),
            elementString = element.outerHTML,
            replacedString = replaceValueInHtml(elementString, placeholderValues);

        //TODO: let newElement =  createDomElementFromHtml(replacedString);
        //newElement type == return type $('')


        let newElement = replacedString;
        //remove element-template class and id
        newElement.classlist.remove('element-template');
        newElement.setAttribute('id','');
        //

        if (typeof callbackEvent !== 'undefined') {
            trigger(callbackEvent, {model: model, element: newElement});
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

})();


on('replace-tickets',function(e) {
    console.log(e);
    $$('#tiketi-za-usera').innerHTML = e.element;
});

trigger('template/render', {
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
    templateElementSelector: "#ticket-template",
    callbackEvent: 'replace-tickets'
});



function createDomElement(html) {
    //nadji prvi element htmla
    let prviElement = "div";
    switch("div") {
        templateElement = "div"

    }
    td
    templateElement = "tr"


    var template = document.createElement(templateElement);
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

$('')