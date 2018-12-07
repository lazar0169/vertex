let form = (function () {

    let currentEndpointId;

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

    function setEndpointId(formSettings) {
        currentEndpointId = formSettings.endpointId;
        console.log('current endpoint id', currentEndpointId);
        let endpointIdInputElements = Array.prototype.slice.call($$(formSettings.formContainerSelector).getElementsByClassName('endpointId'));
        endpointIdInputElements.forEach(function (element) {
            element.value = currentEndpointId;
        });
        let endpointIdInputs = formSettings.formContainerElement.getElementsByClassName('endpointId');
        Array.prototype.slice.call(endpointIdInputs).forEach(function (endpointIdInput) {
            endpointIdInput.dataset.value = currentEndpointId;
        });
    }

    function getFormData(formSettings) {
        console.log('init form');
        let data = {
            EndpointId: formSettings.endpointId
        };
        trigger(formSettings.fillEvent, {data: data, formSettings: formSettings});
    }

    function getAllFormInputElements(formSettings) {
        let formElement = $$(formSettings.formContainerSelector).getElementsByClassName('element-async-form')[0];
        let formInputElements = formElement.getElementsByTagName('input');
        let inputElementsArray = Array.prototype.slice.call(formInputElements);
        return inputElementsArray;
    }

    function fillData(formSettings, data) {
        let formInputElementsArray = getAllFormInputElements(formSettings);
        console.log('form input elements array', formInputElementsArray);
        let dataToDisplay = data.Data;
        console.log('data to display array', dataToDisplay);
        formInputElementsArray.forEach(function (inputElement) {
            if (dataToDisplay[inputElement.dataset.name]) {
                if (inputElement.type === 'checkbox') {
                    inputElement.checked = dataToDisplay.EnableTransactions;
                    let modeDivElement = inputElement.parentNode.previousSibling;
                    console.log('mode div element', modeDivElement);
                    if (dataToDisplay.EnableTransactions === true) {
                        modeDivElement.innerHTML = 'Yes';
                    } else {
                        modeDivElement.innerHTML = 'No';
                    }
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
        setEndpointId(formSettings);
    }

    function collectAndPrepareFormData(formSettings) {
        let formInputElementsArray = getAllFormInputElements(formSettings);
        let dataForApi = {};
        formInputElementsArray.forEach(function (formInputElement) {
            if (formInputElement.type === 'checkbox') {
                dataForApi[formInputElement.dataset.name] = formInputElement.checked;
            } else {
                dataForApi[formInputElement.dataset.name] = formInputElement.value;
            }
        });
        console.log('data for API', dataForApi);
        return dataForApi;
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
        alert('Data has been saved!');
        let dataForApi = collectAndPrepareFormData(formSettings);
        trigger(formSettings.submitEvent, {data: dataForApi, formSettings: formSettings});
    }

    on('form/init', function (params) {
        let formSettings = params.formSettings;
        init(formSettings);
    });

    on('form/getData', function (params) {
        let formSettings = params.formSettings;
        getFormData(formSettings);
    });

    on('from/validate', function (params) {
        let formSettings = params.formSettings;
        validate(formSettings);
    });

    on('form/submit', function (params) {
        alert('form submit');
        let formSettings = params.formSettings;
        submit(formSettings);
    });

    on('form/update', function (params) {
        console.log('params in form/update', params);
        let formSettings = params.settingsObject;
        let data = params.data;
        fillData(formSettings, data);
    });

    on('form/success', function (params) {
        alert('form success');
        let apiResponse = params;
        console.log('api response', apiResponse);
    });

})();