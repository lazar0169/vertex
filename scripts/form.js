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
        let endpointIdInputElements = Array.prototype.slice.call($$(formSettings.formContainerSelector).getElementsByClassName('endpointId'));
        endpointIdInputElements.forEach(function (element) {
            element.dataset.value = currentEndpointId;
        });
    }

    function getFormData(formSettings) {
        let data = {
            EndpointId: parseInt(formSettings.endpointId)
        };
        trigger(formSettings.fillEvent, {data: data, formSettings: formSettings});
    }

    function getAllFormInputElements(formSettings) {
        let formElement = $$(formSettings.formContainerSelector).getElementsByClassName('element-async-form')[0];
        //class name  element-form-data-container
        let formInputElements = formElement.getElementsByTagName('input');
        let inputElementsArray = Array.prototype.slice.call(formInputElements);
        return inputElementsArray;
    }

    function fillData(formSettings, data) {
        let formInputElementsArray = getAllFormInputElements(formSettings);
        console.log('Form input elements array', formInputElementsArray);
        let dataToDisplay = data.Data;
        console.log('Data to display array', dataToDisplay);
        formInputElementsArray.forEach(function (inputElement) {
            if (dataToDisplay[inputElement.dataset.name]) {
                if (inputElement.type === 'checkbox') {
                    inputElement.checked = dataToDisplay[inputElement.dataset.name];
                    let modeDivElement = inputElement.parentNode.previousSibling;
                    if (inputElement.checked === true) {
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
                        }
                    }
                }
            }
        });
    }

    //ToDo: documentovanti form settings
    /*formSettings {
        :formContainerElement: required | element that contains form


    } */

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

        if (formSettings.fillFormEvent === undefined) {
            formSettings.fillFormEvent = 'form/fillFormData';
        }
        if (formSettings.submitSuccessEvent === undefined) {
            formSettings.submitSuccessEvent = 'form/submit/success';
        }
        if (formSettings.submitErrorEvent === undefined) {
            formSettings.submitErrorEvent = 'form/submit/error';
        }
        if (formSettings.validateEvent === undefined) {
            formSettings.validateEvent = 'form/validate';
        }

        if (formSettings.endpointId !== undefined) {
            setEndpointId(formSettings);
        }
        initFormHandlers();
    }

    function collectAndPrepareFormData(formSettings) {
        let formInputElementsArray = getAllFormInputElements(formSettings);
        let dataForApi = {};
        formInputElementsArray.forEach(function (formInputElement) {
            if (formInputElement.type === 'checkbox') {
                dataForApi[formInputElement.dataset.name] = formInputElement.checked;
            } else {
                if (formInputElement.dataset.name === 'EndpointId') {
                    dataForApi[formInputElement.dataset.name] = parseInt(formInputElement.dataset.value);
                } else {
                    switch (formInputElement.dataset.type) {
                        case 'multiple-select':/*
                            if (dataForApi[formInputElement.dataset.name] === undefined) {
                                dataForApi[formInputElement.dataset.name] = [];
                            }
                            dataForApi[formInputElement.dataset.name].push(formInputElement.value);*/
                        case 'single-select':
                            //toDo: izvuces vrednost iz data-value
                            dataForApi[formInputElement.dataset.name] = parseInt(formInputElement.value);

                        case 'int':
                            dataForApi[formInputElement.dataset.name] = parseInt(formInputElement.value);
                        case 'float':
                            dataForApi[formInputElement.dataset.name] = parseFloat(formInputElement.value);
                            break;
                        case 'string':
                            dataForApi[formInputElement.dataset.name] = formInputElement.value;
                            break;
                        case 'array':
                            if (dataForApi[formInputElement.dataset.name] === undefined) {
                                dataForApi[formInputElement.dataset.name] = [];
                            }
                            dataForApi[formInputElement.dataset.name].push(formInputElement.value);
                            //dataForApi[formInputElement.dataset.name] = arrayForApi; //todo finish this when we have multiple emails/phone numbers
                            break;
                    }
                }
            }
        });
        console.log('data for API', dataForApi);
        return dataForApi;
    }

    function submit(formSettings) {
        let dataForApi = collectAndPrepareFormData(formSettings);
        trigger(formSettings.submitEvent, {data: dataForApi, formSettings: formSettings});
    }

    function validate(formSettings) {

    }

    function error(formSettings) {

    }

    function success(formSettings) {

    }

    function serialize(formSettings) {

    }

    function complete(params) {
        //enable submit dugmeta
    }

    function handleStandardReponseMessages(apiResponse) {
        if (apiResponse.MessageCode === null || apiResponse.MessageType === null) {
            console.error('api response is not standardized');
        }
        else {
            trigger('notifications/show/', {
                message: translateMessage(apiResponse.MessageCode),
                type: apiResponse.MessageType
            });
        }        //foreach kroz apiResponse.messages
    }

    //dodati listener na dugme koje ima klasu add-another-field
    function addAnotherField (){
        let target = null// poslednji element koji hvatas na selector
        //proveris da li postoji data-max number
        //proveris da li je broj postojecih <= max number
        //kloniras ga
        //sklonis mu value
        //stavis ga nakon poslednjeg
        //prikazi delete dugme kod svih polja ukoliko je broj elemenata > 1


    }

    function deleteFormElement() {
        //brises parent element dugmeta koji ima klasu form-control
        //ukoliko nakon brisanja ostane samo jedan sakrij delete dugme
    }


    function initFormHandlers() {
        //vezi hanlder za addAnotherField
        //vezi hanlder za deleteFormElement
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
        //disable-ujes dugme
        let formSettings = params.formSettings;
        submit(formSettings);
    });

    on ('form/complete',function(params) {

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
        //trigger('notifications/show/success',{message:localization.translateMessage(apiResponse.Message)});
        handleStandardReponseMessages();
        console.log('api response', apiResponse);
        complete();
    });

    on('form/submit/error', function (params) {
        alert('Form submit error!');
        let apiResponse = params;
        handleStandardReponseMessages();
        console.log('api response', apiResponse);
        complete();
    });


})();