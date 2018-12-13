let form = (function () {

    //all float value are divided / multiplied by 100 because they are in cents
    let valueMultiplier = 100;

    let currentEndpointId;

    function prepareFloatValue(value) {
        value = value.replace(',', '');
        return parseFloat(value);
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

    //helper functions

    function collectAllFormElements(formSettings) {
        let formElement = $$(formSettings.formContainerSelector).getElementsByClassName('element-async-form')[0];
        let formInputElements = formElement.getElementsByClassName('element-form-data');
        return Array.prototype.slice.call(formInputElements);
    }

    function collectSubmitButtons(formSettings) {
        let submitButtons = $$(formSettings.formContainerSelector).getElementsByClassName('element-form-submit');
        return Array.prototype.slice.call(submitButtons);
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

    function collectEnableButtons(formSettings) {
        let enableButtons = $$(formSettings.formContainerSelector).getElementsByClassName('element-form-check');
        let enableButtonsArray = Array.prototype.slice.call(enableButtons);
        return enableButtonsArray;
    }


    function fillData(formSettings, data) {
        let dataToDisplay = data.Data;
        //remove elements which were created previously beacuse API value was array

        let multipleValueInputContainers = Array.prototype.slice.call(formSettings.formContainerElement.getElementsByClassName('element-input-additional-array-value'));

        for (let counter = 0; counter < multipleValueInputContainers.length; counter++) {
            multipleValueInputContainers[counter].parentNode.removeChild(multipleValueInputContainers[counter]);
        }
        let formInputElementsArray = collectAllFormElements(formSettings);

        formInputElementsArray.forEach(function (inputElement) {

            let inputName = inputElement.name === undefined ? inputElement.dataset.name : inputElement.name;
            if (inputName !== undefined && dataToDisplay[inputName]) {

                if (inputElement.type === 'checkbox') {
                    inputElement.checked = dataToDisplay[inputName];
                    let modeDivElement = inputElement.parentNode.previousSibling;
                    if (inputElement.checked === true) {
                        modeDivElement.innerHTML = 'Yes';
                    } else {
                        modeDivElement.innerHTML = 'No';
                    }
                } else {
                    if (inputName !== 'EndpointId') {
                        if (dataToDisplay[inputName].constructor === Array) {
                            let values = dataToDisplay[inputName];
                            if (values.length > 0) {
                                inputElement.value = values[0];
                                let inputsContainer = inputElement.parentNode.parentNode;
                                //add fields if there are more then one value
                                for (let i = 1; i < values.length; i++) {
                                    let newField = inputElement.parentNode.cloneNode(true);
                                    let newInputElement = newField.getElementsByTagName('input')[0];
                                    newInputElement.removeAttribute('id');
                                    newInputElement.value = values[i];
                                    newField.classList.add('element-input-additional-array-value');
                                    inputsContainer.appendChild(newField);

                                    let deleteButtonElement = newField.getElementsByTagName('button')[0];
                                    deleteButtonElement.classList.remove('hidden');
                                    deleteButtonElement.addEventListener('click', deleteFormElement);
                                }
                            }
                            //display delete button for first field
                            if (values.length > 1) {
                                let firstDeleteButton = inputElement.parentNode.getElementsByTagName('button')[0];
                                firstDeleteButton.classList.remove('hidden');
                                firstDeleteButton.addEventListener('click', deleteFormElement);
                            }
                        } else {
                            switch (inputElement.dataset.type) {
                                case 'single-select':
                                    dropdown.select(inputElement.parentNode, dataToDisplay[inputName]);
                                    break;
                                case 'int':
                                    inputElement.value = dataToDisplay[inputName];
                                    break;
                                case 'float':
                                    inputElement.value = formatFloatValue(dataToDisplay[inputName] / valueMultiplier);
                                    break;
                                case 'string':
                                    inputElement.value = dataToDisplay[inputName];
                                    break;
                                case 'array':
                                    if (dataToDisplay[inputName].length === 1) {
                                        inputElement.value = dataToDisplay[inputName][0];
                                    }
                                    break;
                                default:
                                    inputElement.value = dataToDisplay[inputName];
                            }
                        }
                    }
                }
            }
        });
    }

    //ToDo: dokumentovati form settings
    /*formSettings {
        :formContainerElement: required | element that contains form


    } */

    function init(formSettings) {
        let formContainerElement = $$(formSettings.formContainerSelector);
        formSettings.formContainerElement = formContainerElement;
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

        setEndpointId(formSettings);
        if (formContainerElement.formSettings === undefined) {
            initFormHandlers(formSettings);
        }
        formContainerElement.formSettings = formSettings;

    }

    function collectAndPrepareFormData(formSettings) {
        let formInputElementsArray = collectAllFormElements(formSettings);
        let dataForApi = {};
        formInputElementsArray.forEach(function (formInputElement) {
            if (formInputElement.type === 'checkbox') {
                dataForApi[formInputElement.name] = formInputElement.checked;
            } else {
                if (formInputElement.name === 'EndpointId') {
                    dataForApi[formInputElement.name] = parseInt(formInputElement.dataset.value);
                } else {
                    switch (formInputElement.dataset.type) {
                        case 'multiple-select':
                            //ToDo: implement when we have real use case
                            break;
                        case 'single-select':
                            dataForApi[formInputElement.dataset.name] = formInputElement.dataset.value.toString();
                            break;
                        case 'int':
                            if (parseInt(formInputElement.value) !== undefined) {
                                dataForApi[formInputElement.name] = parseInt(formInputElement.value);
                            } else {
                                dataForApi[formInputElement.name] = 5; //todo validation
                            }
                            break;
                        case 'float':
                            //dataForApi[formInputElement.name] = parseFloat(formInputElement.value*valueMultiplier);
                            let value = prepareFloatValue(formInputElement.value);
                            dataForApi[formInputElement.name] = value * valueMultiplier;
                            break;
                        case 'string':
                            dataForApi[formInputElement.name] = formInputElement.value;
                            break;
                        case 'array':
                            if (dataForApi[formInputElement.name] === undefined) {
                                dataForApi[formInputElement.name] = [];
                            }
                            dataForApi[formInputElement.name].push(formInputElement.value);
                            break;
                    }
                }
            }
        });
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
        let submitButtonsArray = collectSubmitButtons(formSettings);
        submitButtonsArray.forEach(function (submitButton) {
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
        }
    }

    function deleteFormElement() {
        let deleteButtonParentNode = this.parentNode;
        let parentNode = deleteButtonParentNode.parentNode;
        let childElementCount = parentNode.childElementCount;
        deleteButtonParentNode.remove();
        if (childElementCount <= 3) {
            parentNode.children[1].getElementsByTagName('button')[0].classList.add('hidden');
        }
    }

    function addAnotherField(e, formSettings) {
        if (e.currentTarget.dataset.maxNumber !== undefined) {
            let targetSelector = e.currentTarget.dataset.targetSelector;
            let targetElements = $$(formSettings.formContainerSelector).getElementsByClassName(targetSelector);
            if (targetElements.length < e.currentTarget.dataset.maxNumber) {
                let lastElement = targetElements[targetElements.length - 1];
                let newField = lastElement.cloneNode(true);
                newField.getElementsByTagName('input')[0].removeAttribute('id');
                newField.getElementsByTagName('input')[0].value = '';
                newField.getElementsByTagName('button')[0].classList.remove('hidden');
                newField.classList.add('element-input-additional-array-value');

                lastElement.parentNode.appendChild(newField);
                if (targetElements.length > 1) {
                    //ToDo: getElementsByClass .action-delele
                    targetElements[0].getElementsByTagName('button')[0].classList.remove('hidden');
                }
                let deleteButtonFirstElement = targetElements[0].getElementsByTagName('button')[0];
                deleteButtonFirstElement.removeEventListener('click', deleteFormElement);
                deleteButtonFirstElement.addEventListener('click', deleteFormElement);

                let deleteButton = newField.getElementsByTagName('button')[0];
                deleteButton.addEventListener('click', deleteFormElement);

            }
        }
    }

    function collectAddAnotherFieldButtons(formSettings) {
        let addAnotherFieldButtons = $$(formSettings.formContainerSelector).getElementsByClassName('action-add-another-field');
        return Array.prototype.slice.call(addAnotherFieldButtons);
    }

    //elements event handlers

    function bindSubmitButtonClickHandlers(formSettings) {
        let submitButtonsArray = collectSubmitButtons(formSettings);
        submitButtonsArray.forEach(function (submitButton) {
            submitButton.addEventListener('click', function () {
                submit(formSettings, submitButton);
            });
        });
    }

    function bindAddAnotherClickHandlers(formSettings) {
        let addAnotherFieldButtonsArray = collectAddAnotherFieldButtons(formSettings);
        addAnotherFieldButtonsArray.forEach(function (addAnotherFieldButton) {
            addAnotherFieldButton.addEventListener('click', function (e) {
                addAnotherField(e, formSettings);
            });
        });
    }

    function bindEnableButtonClickHandlers(formSettings) {
        let enableButtonsArray = collectEnableButtons(formSettings);
        enableButtonsArray.forEach(function (enableButton) {
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

    on('form/submit', function (params) {
        //disable-ujes dugme
        let formSettings = params.formSettings;
        submit(formSettings);
    });

    //ToDo: check if this event is necessary
    on('form/complete', function (params) {
        complete(params.formSettings);
    });

    on('form/fillFormData', function (params) {
        let formSettings = params.settingsObject;
        let apiResponseData = params.data;
        fillData(formSettings, apiResponseData);
    });

    on('form/submit/success', function (params) {
        let formSettings = params.settingsObject;
        let apiResponseData = params.data;
        //trigger('notifications/show/success',{message:localization.translateMessage(apiResponse.Message)});
        handleStandardReponseMessages(apiResponseData);
        complete(formSettings);
    });

    on('form/submit/error', function (params) {
        alert('Form submit error!');
        let formSettings = params.settingsObject;
        let apiResponseData = params.data;
        handleStandardReponseMessages(apiResponseData);
        complete(formSettings);
    });

})();