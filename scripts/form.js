let form = (function () {

    let currentEndpointId;

    function setEndpointId(formSettings) {
        currentEndpointId = formSettings.endpointId;
        console.log('current endpoint id', currentEndpointId);
        let endpointIdInputElements = Array.prototype.slice.call($$(formSettings.formContainerSelector).getElementsByClassName('endpointId'));
        endpointIdInputElements.forEach(function (element) {
            element.value = currentEndpointId;
        });
    }

    function getEvent(formSettings, eventToCheck) {
        let event;

        if (formSettings[eventToCheck] !== undefined) {
            event = formSettings[eventToCheck];
        } else if (formSettings.formContainerElement.dataset[eventToCheck] !== undefined) {
            event = formSettings.formContainerElement.dataset[eventToCheck];
        } else {
            console.error('Event doesn\'t exist!');
        }
        return event;
    }

    function initForm(formSettings) {
        console.log('init form');
        let data = {
            EndpointId: formSettings.endpointId
        };
        trigger(formSettings.fillEvent, {data: data, formSettings: formSettings});
    }

    function getAllFormInputElements(formSettings) {
        let formElement = formSettings.formContainerElement.getElementsByClassName('element-async-form')[0];
        let inputElements = formElement.getElementsByTagName('input');
        return inputElements;
    }

    function fillData(formSettings, data) {
        let formInputElements = getAllFormInputElements(formSettings);
        let formInputElementsArray = Array.prototype.slice.call(formInputElements);
        console.log('form input elements array', formInputElementsArray);
        let dataToDisplay = data.Data;
        console.log('data to display array', dataToDisplay);
        formInputElementsArray.forEach(function (inputElement) {
            if (dataToDisplay[inputElement.dataset.name]) {
                if (inputElement.type === 'checkbox') {
                    inputElement.checked = dataToDisplay.EnableTransactions;
/*                    if(dataToDisplay.EnableTransactions === true) {
                        transactionEnableMode.innerHTML = 'Yes';
                    } else {
                        transactionEnableMode.innerHTML = 'No';
                    }*/
                } else {
                    inputElement.value = dataToDisplay[inputElement.dataset.name];
                    console.log('value', inputElement.value);
                }
            }
        });
    }

    function init(formSettings) {
        let formContainerElement = $$(formSettings.formContainerSelector);
        formSettings.formContainerElement = formContainerElement;
        formContainerElement.formSettings = formSettings;
        if (formSettings.fillEvent !== null) {
            formSettings.fillEvent = getEvent(formSettings, 'fillEvent');
        }
        if (formSettings.submitEvent !== null) {
            formSettings.submitEvent = getEvent(formSettings, 'submitEvent');
        }
        if (formSettings.formData === null || formSettings.formData === undefined) {
            initForm(formSettings);
        } else {
            // fillData(formSettings);
        }
    }


    function validate(formSettings) {

    }

    function error(formSettings) {

    }

    function success(formSettings) {

    }

    function serialize(formSettings) {

    }

    function submit(formSettings) {

    }

    on('form/init', function (params) {
        let formSettings = params.formSettings;
        setEndpointId(formSettings);
        init(formSettings);
    });

    on('form/update', function (params) {
        console.log('params in form/update', params);
        let formSettings = params.settingsObject;
        let data = params.data;
        fillData(formSettings, data);
    });

})();