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
            console.info('Event ' + eventToCheck + ' doesn\'t exist!');
        }
        return event;
    }

    function setEndpointId(formSettings) {
        currentEndpointId = formSettings.endpointId;
        if (formSettings.endpointId !== undefined && formSettings.endpointId !== null) {
            let endpointIdInputElements = Array.prototype.slice.call($$(formSettings.formContainerSelector).getElementsByClassName('endpointId'));
            endpointIdInputElements.forEach(function (element) {
                element.dataset.value = currentEndpointId;
            });
        }
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

    function collectEnableButtons(formSettings) {
        let enableButtons = $$(formSettings.formContainerSelector).getElementsByClassName('element-form-check');
        return Array.prototype.slice.call(enableButtons);
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
            if (inputName !== undefined && dataToDisplay[inputName] !== undefined) {
                if (inputElement.type === 'checkbox') {
                    let checkbox = inputElement.parentNode.parentNode;
                    //only for toggle checkboxes
                    if (checkbox.classList.contains('element-form-check') > 0) {
                        if (dataToDisplay[inputName] === true) {
                            checkbox.vertexToggle.check();
                        } else {
                            checkbox.vertexToggle.uncheck();
                        }
                    }
                } else {
                    if (inputName !== 'EndpointId') {
                        if (dataToDisplay[inputName].constructor === Array) {
                            let values = dataToDisplay[inputName];
                            if (values.length > 0) {
                                inputElement.value = values[0];
                                let inputsContainer = inputElement.parentNode.parentNode;
                                let addAnotherButton = null;
                                if (inputsContainer.getElementsByClassName('action-add-another-field').length > 0) {
                                    addAnotherButton = inputsContainer.getElementsByClassName('action-add-another-field')[0].parentNode;
                                }
                                //add fields if there are more then one value
                                for (let i = 1; i < values.length; i++) {
                                    let newField = inputElement.parentNode.cloneNode(true);
                                    let newInputElement = newField.getElementsByTagName('input')[0];
                                    newInputElement.removeAttribute('id');
                                    newInputElement.value = values[i];
                                    newField.classList.add('element-input-additional-array-value');
                                    if (addAnotherButton !== null) {
                                        inputsContainer.insertBefore(newField, addAnotherButton);
                                    } else {
                                        inputsContainer.appendChild(newField);
                                    }

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
                                    //inputElement.dataset.value = dataToDisplay[inputName];
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
                        /*                        case 'multiple-select':
                                                    if (dataForApi[formInputElement.name] === undefined) {
                                                        dataForApi[formInputElement.name] = [];
                                                    }
                                                    dataForApi[formInputElement.name].push(formInputElement.value);*/
                        case 'single-select':
                            dataForApi[formInputElement.dataset.name] = formInputElement.firstChild.dataset.value.toString();
                            if (formInputElement.dataset.nameId !== undefined && formInputElement.dataset.valueId !== undefined) {
                                dataForApi[formInputElement.dataset.nameId] = formInputElement.firstChild.dataset.valueId.toString();
                            }
                            break;
                        case 'int':
                            if (parseInt(formInputElement.value) !== undefined) {
                                dataForApi[formInputElement.name] = parseInt(formInputElement.value);
                            } else {
                                dataForApi[formInputElement.name] = 5; //todo validation
                            }
                            break;
                        case 'float':
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
                        case'default':
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
        submitButton.disabled = 'disabled';
        submitButton.classList.add('loading');
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
            submitButton.disabled = '';
            submitButton.classList.remove('loading');
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
        }        //foreach through apiResponse.messages if needed
    }

    function deleteFormElement() {
        let deleteButtonParentNode = this.parentNode;
        let parentNode = deleteButtonParentNode.parentNode;
        deleteButtonParentNode.remove();
        let childElementCount = parentNode.childElementCount;
        if (childElementCount <= 3) {
            parentNode.getElementsByClassName('button-link')[0].classList.add('hidden');
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
                newField.getElementsByClassName('button-link')[0].classList.remove('hidden');
                newField.classList.add('element-input-additional-array-value');

                let addAnotherButton = lastElement.parentNode.getElementsByClassName('action-add-another-field')[0].parentNode;

                lastElement.parentNode.insertBefore(newField, addAnotherButton);

                if (targetElements.length > 1) {
                    targetElements[0].getElementsByClassName('button-link')[0].classList.remove('hidden');
                }

                let deleteButtonFirstElement = targetElements[0].getElementsByClassName('button-link')[0];
                deleteButtonFirstElement.removeEventListener('click', deleteFormElement);
                deleteButtonFirstElement.addEventListener('click', deleteFormElement);

                let deleteButton = newField.getElementsByClassName('button-link')[0];
                deleteButton.addEventListener('click', deleteFormElement);
            }
        }
    }

    function collectAddAnotherFieldButtons(formSettings) {
        let addAnotherFieldButtons = $$(formSettings.formContainerSelector).getElementsByClassName('action-add-another-field');
        return Array.prototype.slice.call(addAnotherFieldButtons);
    }

    //elements event handlers
    function formatFloatInputHandler() {
        let value = this.value;
        var position = this.selectionStart;
        value = value.replace(',', '').replace('.', '');
        let number = value.slice(0, value.length - 2);
        let decimal = value.slice(value.length - 2, value.length);
        let float = parseFloat(number + "." + decimal).toFixed(2);
        this.value = formatFloatValue(float);
        this.selectionEnd = position;
    }

    function onSubmit(e) {
        e.preventDefault();
        return false;
    }

    function bindSubmitButtonClickHandlers(formSettings) {
        let submitButtonsArray = collectSubmitButtons(formSettings);
        submitButtonsArray.forEach(function (submitButton) {
            submitButton.addEventListener('click', function () {
                submit(formSettings, submitButton);
            });
        });
    }

    function createToggles(formSettings) {
        form = formSettings.formContainerElement.getElementsByClassName('element-async-form')[0];
        let checkboxes = form.getElementsByClassName('vertex-form-checkbox');
        for (let i = 0; i < checkboxes.length; i++) {
            let cb = checkboxes[i];
            toggle.generate({
                element: cb,
                onUncheck: toggleSection,
                onCheck: toggleSection
            });
        }
    }

    function addHiddenField(formSettings, name, value) {
        let formElement = $$(formSettings.formContainerSelector).getElementsByClassName('element-async-form')[0];
        console.log(formElement);
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        input.classList.add('element-form-data');
        input.dataset.type = 'string';
        console.log(input);
        formElement.appendChild(input);
        console.log(input);
    }

    function toggleSection(e) {
        if (e === undefined) {
            e = this['element'];
        }
        let targetSelector = e.dataset.target;
        let checked = e.vertexToggle.getState(e);
        if (targetSelector !== undefined) {
            let targetElement = $$(targetSelector);
            if (targetElement !== undefined && targetElement !== null) {
                if (checked === false) {
                    collapseElement(targetElement);
                } else {
                    expandElement(targetElement);
                }
            }
        }
    }

    function bindSubmitHandler(formSettings) {
        form = formSettings.formContainerElement.getElementsByClassName('element-async-form')[0];
        form.addEventListener('submit', onSubmit);
    }

    /*    function bindBackButton(formSettings) {
            let buttons = $$(formSettings.formContainerSelector).getElementsByClassName('action-form-back');
            if (buttons.length > 0) {
                let button = buttons[0];
                button.addEventListener('click', function (e) {
                    history.back();
                });
            }
            //there should be only one button
        }*/

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
                    enableMode.innerHTML = localization.translateMessage('switchNoLabel', enableMode);
                } else {
                    enableMode.innerHTML = localization.translateMessage('switchYesLabel', enableMode);
                }
            });

        });
    }

    function initFormHandlers(formSettings) {
        bindSubmitButtonClickHandlers(formSettings);
        bindEnableButtonClickHandlers(formSettings);
        bindAddAnotherClickHandlers(formSettings);
        // bindBackButton(formSettings);
        bindSubmitHandler(formSettings);
        createToggles(formSettings);
    }

    on('form/add/hiddenField', function (params)
    {
        addHiddenField(params.formSettings,params.name, params.value);
    });

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
        handleStandardReponseMessages(apiResponseData);
        complete(formSettings);
    });

    on('form/submit/error', function (params) {
        //ToDo: neske
        let formSettings = params.settingsObject;
        let apiResponseData = params.data;
        handleStandardReponseMessages(apiResponseData);
        complete(formSettings);
    });

})();