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
            element.dataset.value = currentEndpointId;
        });
    }

    function getFormData(formSettings) {
        console.log('init form');
        let data = {
            EndpointId: parseInt(formSettings.endpointId)
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
                    if (inputElement.dataset.name !== 'EndpointId') {
                        if (dataToDisplay[inputElement.dataset.name].constructor === Array) {
                            dataToDisplay[inputElement.dataset.name].forEach(function () {
                                inputElement.value = dataToDisplay[inputElement.dataset.name][0]; //todo change to work with multiple emails/phone numbers
                            });
                        } else {
                            inputElement.value = parseFloat(dataToDisplay[inputElement.dataset.name]);
                            console.log('value', inputElement.value);
                        }
                    }
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
        let arrayForApi = [];
        let formInputElementsArray = getAllFormInputElements(formSettings);
        let dataForApi = {};
        formInputElementsArray.forEach(function (formInputElement) {
            if (formInputElement.type === 'checkbox') {
                dataForApi[formInputElement.dataset.name] = formInputElement.checked;
            } else {
                if (formInputElement.dataset.name === 'EndpointId') {
                dataForApi[formInputElement.dataset.name] = parseInt(formInputElement.dataset.value);
            } else{
                    let inputType = formInputElement.dataset.type;
                    console.log('inputType', inputType);
                    switch (formInputElement.dataset.type) {
                        case 'float':
                            dataForApi[formInputElement.dataset.name] = parseFloat(formInputElement.value);
                            break;
                        case 'string':
                            dataForApi[formInputElement.dataset.name] = formInputElement.value;
                            break;
                        case 'array':
                            arrayForApi.push(formInputElement.value);
                            dataForApi[formInputElement.dataset.name] = arrayForApi; //todo finish this when we have multiple emails/phone numbers
                            break;
                    }
                }
                /*if (formInputElement.dataset.name === 'EmailList' || formInputElement.dataset.name === 'PhoneNumberList' || formInputElement.dataset.name === 'Emails' || formInputElement.dataset.name === 'PhoneNumbers') {
                    arrayForApi.push(formInputElement.value);
                    dataForApi[formInputElement.dataset.name] = arrayForApi; //todo finish this when we have multiple emails/phone numbers
                } else {
                    if (formInputElement.dataset.name === 'EndpointId') {
                        dataForApi[formInputElement.dataset.name] = parseInt(formInputElement.dataset.value);
                    } else {
                        dataForApi[formInputElement.dataset.name] = parseFloat(formInputElement.value);
                    }
                }*/
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

    on('form/fillFormData', function (params) {
        console.log('params in form/update', params);
        let formSettings = params.settingsObject;
        let data = params.data;
        fillData(formSettings, data);
    });

    on('form/submit/success', function (params) {
        alert('Form submit success!');
        let apiResponse = params;
        console.log('api response', apiResponse);
    });

    on('form/submit/error', function (params) {
        alert('Form submit error!');
        let apiResponse = params;
        console.log('api response', apiResponse);
    });


})();