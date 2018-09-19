let template = (function(){

    let model = {
        home: {
            name: 'nesto'
        },
        casino: {
            name: 'First casino',
            edit: 'Nesto edit'
        },
        jackpot: {
            number: 123
        },
        tickets: {
            nubmer: 15
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

    let templ = '<h1>Casino {{model.casino.name}}</h1>';

    function render(elementName, model) {
        console.log('Element name: ', elementName);

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
            console.log('Placeholders: ', placeholders);
            for (let i = 0; i < placeholders.length; i++) {
                let placeholder = placeholders[i],
                    value;
                console.log('Placeholder: ', placeholder);
                let placeholderValue = placeholder.replace('{{', '').replace('}}', '');
                console.log('Placeholder value: ', placeholderValue);
                value = eval(placeholderValue);
                console.log('Value: ', value);
                elementString = elementString.replace(placeholder, value);
                console.log('Element string after the value has been replaced: ', elementString);
                //TODO: Here we take js string and turn it into HTML
                // element.innerHTML = elementString;
            }
        }
        return element;
    }

    console.log(render('#page-casino', model));
    console.log(render('#page-users', model));

})();