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

    function render(elementName, model) {
        let paramPattern = /{{(.*?)}}/gi,
            placeholders,
            elementString,
            element = $$(elementName);

        if (element.length > 0) {
            element = element[0];
        }

        elementString = element.outerHTML;

        if (elementString.match(paramPattern)) {
            placeholders = elementString.match(paramPattern);
            for (let i = 0; i < placeholders.length; i++) {
                let placeholder = placeholders[i],
                    value;
                let placeholderValue = placeholder.replace('{{', '').replace('}}', '');
                value = getValueFromModel(placeholderValue, model);
                elementString = elementString.replace(placeholder, value);
                element.innerHTML = elementString;
            }
        }
        return element;
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

    function validateValue(value) {
        return !Array.isArray(value);
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

})();