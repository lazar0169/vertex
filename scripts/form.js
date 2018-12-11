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

    function collectAllFormInputElements(formSettings) {
        let formElement = $$(formSettings.formContainerSelector).getElementsByClassName('element-async-form')[0];
        let formInputElements = formElement.getElementsByClassName('element-form-data');
        let inputElementsArray = Array.prototype.slice.call(formInputElements);
        console.log('input element array', inputElementsArray);
        return inputElementsArray;
    }

    function collectSubmitButtons(formSettings) {
        let submitButtons = $$(formSettings.formContainerSelector).getElementsByClassName('element-form-submit');
        let submitButtonsArray = Array.prototype.slice.call(submitButtons);
        return submitButtonsArray;
    }

    function bindSubmitButtonClickHandlers(formSettings) {
        let submitButtonsArray = collectSubmitButtons(formSettings);
        submitButtonsArray.forEach(function(submitButton){
            submitButton.addEventListener('click', function(){
                submit(formSettings, submitButton);
            });
        });
    }


    let transactionEnableButton = $$('#aft-enable-transaction-check');
    let transactionEnableMode = $$('#aft-enable-transaction-mode');
    let transactionEnableSwitch = transactionEnableButton.getElementsByTagName('input')[0];

    transactionEnableSwitch.addEventListener('click', function () {
        if (transactionEnableSwitch.checked === false) {
            transactionEnableSwitch.checked = false;
            transactionEnableMode.innerHTML = 'No';
        } else {
            transactionEnableSwitch.checked = true;
            transactionEnableMode.innerHTML = 'Yes';
        }
    });

    function collectEnableButtons(formSettings){
        let enableButtons = $$(formSettings.formContainerSelector).getElementsByClassName('element-form-check');
        let enableButtonsArray = Array.prototype.slice.call(enableButtons);
        return enableButtonsArray;
    }

    function bindEnableButtonClickHandlers(formSettings){
        let enableButtonsArray = collectEnableButtons(formSettings);
        enableButtonsArray.forEach(function(enableButton){
            let enableMode = enableButton.getElementsByClassName('element-form-mode')[0];
            let enableSwitch = enableButton.getElementsByTagName('input')[0];
            enableSwitch.addEventListener('click', function () {
                if (enableSwitch.checked === false) {
                    enableSwitch.checked = false;
                    enableMode.innerHTML = 'No';
                } else {
                    enableSwitch.checked = true;
                    enableMode.innerHTML = 'Yes';
                }
            });

        });
    }

    function fillData(formSettings, data) {
        let formInputElementsArray = collectAllFormInputElements(formSettings);
        console.log('Form input elements array', formInputElementsArray);
        let dataToDisplay = data.Data;
        console.log('Data to display array', dataToDisplay);
        formInputElementsArray.forEach(function (inputElement) {
            if (dataToDisplay[inputElement.name]) {
                if (inputElement.type === 'checkbox') {
                    inputElement.checked = dataToDisplay[inputElement.name];
                    let modeDivElement = inputElement.parentNode.previousSibling;
                    if (inputElement.checked === true) {
                        modeDivElement.innerHTML = 'Yes';
                    } else {
                        modeDivElement.innerHTML = 'No';
                    }
                } else {
                    if (inputElement.name !== 'EndpointId') {
                        if (dataToDisplay[inputElement.name].constructor === Array) {
                            dataToDisplay[inputElement.name].forEach(function () {
                                inputElement.value = dataToDisplay[inputElement.name][0]; //todo change to work with multiple emails/phone numbers
                            });
                        } else {
                            inputElement.value = parseFloat(dataToDisplay[inputElement.name]);
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
        initFormHandlers(formSettings);
    }

    function collectAndPrepareFormData(formSettings) {
        let formInputElementsArray = collectAllFormInputElements(formSettings);
        let dataForApi = {};
        formInputElementsArray.forEach(function (formInputElement) {
            if (formInputElement.type === 'checkbox') {
                dataForApi[formInputElement.name] = formInputElement.checked;
            } else {
                if (formInputElement.name === 'EndpointId') {
                    dataForApi[formInputElement.name] = parseInt(formInputElement.dataset.value);
                } else {
                    switch (formInputElement.dataset.type) {
                        case 'multiple-select':/*
                            if (dataForApi[formInputElement.name] === undefined) {
                                dataForApi[formInputElement.name] = [];
                            }
                            dataForApi[formInputElement.name].push(formInputElement.value);*/
                        case 'single-select':
                            //toDo: izvuces vrednost iz data-value
                            dataForApi[formInputElement.name] = parseInt(formInputElement.value);

                        case 'int':
                            dataForApi[formInputElement.name] = parseInt(formInputElement.value);
                        case 'float':
                            dataForApi[formInputElement.name] = parseFloat(formInputElement.value);
                            break;
                        case 'string':
                            dataForApi[formInputElement.name] = formInputElement.value;
                            break;
                        case 'array':
                            if (dataForApi[formInputElement.name] === undefined) {
                                dataForApi[formInputElement.name] = [];
                            }
                            dataForApi[formInputElement.name].push(formInputElement.value);
                            //dataForApi[formInputElement.name] = arrayForApi; //todo finish this when we have multiple emails/phone numbers
                            break;
                    }
                }
            }
        });
        console.log('data for API', dataForApi);
        return dataForApi;
    }

    function submit(formSettings, submitButton) {
        let dataForApi = collectAndPrepareFormData(formSettings);
        submitButton.disabled = true;
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

    function complete(formSettings) {
        //enable submit dugmeta
        let submitButtonsArray = collectSubmitButtons(formSettings);
        submitButtonsArray.forEach(function(submitButton){
            submitButton.disabled = false;
        });
    }

    function handleStandardReponseMessages(apiResponseData) {
        if (apiResponseData.MessageCode === null || apiResponseData.MessageType === null) {
            console.error('API response is not standardized!');
        } else {
            trigger('notifications/show', {
                message: localization.translateMessage(apiResponseData.MessageCode.toString()),
                type: apiResponseData.MessageType
            });
        }        //foreach kroz apiResponse.messages ako bude bilo potrebno
    }

    //dodati listener na dugme koje ima klasu add-another-field
    function addAnotherField(e, formSettings) {
        // let target = null// poslednji element koji hvatas na selector

        if(e.currentTarget.dataset.maxNumber !== undefined) {
            let targetSelector = e.currentTarget.dataset.targetSelector;
            console.log('target', targetSelector);
            let targetElements = $$(formSettings.formContainerSelector).getElementsByClassName(targetSelector);
            console.log('target elements', targetElements);
            if (targetElements.length <= e.currentTarget.dataset.maxNumber) {
                let lastElement = targetElements[targetElements.length-1];
                console.log('last element', lastElement);
                let newField = lastElement.cloneNode(true);
                newField.getElementsByTagName('input')[0].removeAttribute('id');
                newField.getElementsByTagName('button')[0].classList.remove('hidden');
                console.log('new field', newField);
                console.log('last element parent node', lastElement.parentNode);
                lastElement.parentNode.appendChild(newField);
                if(targetElements.length > 1) {
                    targetElements[0].getElementsByTagName('button')[0].classList.remove('hidden');
                }
            }
        }





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

    function collectAddAnotherFieldButtons(formSettings) {
        let addAnotherFieldButtons = $$(formSettings.formContainerSelector).getElementsByClassName('action-add-another-field');
        let addAnotherFieldButtonsArray = Array.prototype.slice.call(addAnotherFieldButtons);
        console.log('add another field buttons array', addAnotherFieldButtonsArray);
        return addAnotherFieldButtonsArray;
    }

    function collectDeleteFieldButtons(formSettings) {
        let deleteFieldButtons = $$(formSettings.formContainerSelector).getElementsByClassName('action-delete-form-element');
        let deleteFieldButtonsArray = Array.prototype.slice.call(deleteFieldButtons);
        console.log('add another field buttons array', deleteFieldButtonsArray);
        return deleteFieldButtonsArray;
    }

    function bindAddAnotherClickHandlers(formSettings) {
        let addAnotherFieldButtonsArray = collectAddAnotherFieldButtons(formSettings);
        addAnotherFieldButtonsArray.forEach(function(addAnotherFieldButton){
            addAnotherFieldButton.addEventListener('click', function(e){
                console.log('form settings in bind add', formSettings);
                addAnotherField(e, formSettings);
            });
        });
        let deleteFieldButtonsArray = collectDeleteFieldButtons(formSettings);
        deleteFieldButtonsArray.forEach(function(deleteFieldButton){
            deleteFieldButton.addEventListener('click', function(e){
                deleteFormElement(e, formSettings);
            });
        });

        //vezi hanlder za addAnotherField
        //vezi hanlder za deleteFormElement

    }



    function initFormHandlers(formSettings) {
        bindSubmitButtonClickHandlers(formSettings);
        bindEnableButtonClickHandlers(formSettings);
        bindAddAnotherClickHandlers(formSettings);
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

/*    on('form/submit', function (params) {

        //disable-ujes dugme
        let formSettings = params.formSettings;
        submit(formSettings);
    });*/

    on('form/complete', function (params) {

    });

    on('form/fillFormData', function (params) {
        console.log('params in form/update', params);
        let formSettings = params.settingsObject;
        let apiResponseData = params.data;
        fillData(formSettings, apiResponseData);
    });

    on('form/submit/success', function (params) {
        alert('Form submit success!');
        let formSettings = params.settingsObject;
        let apiResponseData = params.data;
        console.log('api response', apiResponseData);
        //trigger('notifications/show/success',{message:localization.translateMessage(apiResponse.Message)});
        handleStandardReponseMessages(apiResponseData);
        complete(formSettings);
    });

    on('form/submit/error', function (params) {
        alert('Form submit error!');
        let formSettings = params.settingsObject;
        let apiResponseData = params.data;
        console.log('api response', apiResponseData);
        handleStandardReponseMessages(apiResponseData);
        complete(formSettings);
    });


})();