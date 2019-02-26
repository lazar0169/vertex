let form = (function () {

    //all float value are divided / multiplied by 100 because they are in cents
    let valueMultiplier = 100;
    let currentEndpointId;

    const nodeTypes = {
        div: 'DIV',
        input: 'INPUT'
    };

    const inputTypes = {
        singleSelect: 'single-select',
        integer: 'int',
        float: 'float',
        string: 'string',
        array: 'array'
    }

    function prepareFloatValue(value) {
        value = value.replace(/,/g, '');
        return parseFloat(value);
    }

    function getEvent(formSettings, eventToCheck) {
        let event;
        if (formSettings[eventToCheck] !== undefined) {
            event = formSettings[eventToCheck];
        } else if (formSettings.formContainerElement.dataset[eventToCheck] !== undefined) {
            event = formSettings.formContainerElement.dataset[eventToCheck];
        } else {
            error(`Event ${eventToCheck} in form ${formSettings.formContainerSelector} doesn\'t exist!`);
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
        //console.log('get data trigered:',formSettings.getData);
        trigger(formSettings.getData, {data: data, additionalData: formSettings});
    }

    //helper functions
    function collectAllFormElements(formSettings) {
        let formElement = formSettings.formContainerElement.getElementsByClassName('element-async-form')[0];
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

    function displayData(formSettings, data) {
        let dataToDisplay = data.Data;
        //remove elements which were created previously beacuse API value was array
        //console.log('formSettings:',formSettings);
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
                                    validation.init(newInputElement, {});
                                    if (addAnotherButton !== null) {
                                        inputsContainer.insertBefore(newField, addAnotherButton);
                                    } else {
                                        inputsContainer.appendChild(newField);
                                    }

                                    let deleteButtonElement = newField.getElementsByClassName('button-link')[0];
                                    deleteButtonElement.classList.remove('visibility-hidden');
                                    deleteButtonElement.addEventListener('click', deleteFormElement);
                                }
                            }
                            //display delete button for first field
                            if (values.length > 1) {
                                let firstDeleteButton = inputElement.parentNode.getElementsByClassName('button-link')[0];
                                firstDeleteButton.classList.remove('visibility-hidden');
                                firstDeleteButton.addEventListener('click', deleteFormElement);
                            }
                        } else {
                            switch (inputElement.dataset.type) {
                                case inputTypes.singleSelect:
                                    dropdown.select(inputElement, dataToDisplay[inputName]);
                                    break;
                                case inputTypes.integer:
                                    inputElement.value = dataToDisplay[inputName];
                                    break;
                                case inputTypes.float:
                                    inputElement.value = formatFloatValue(dataToDisplay[inputName] / valueMultiplier);
                                    break;
                                case inputTypes.string:
                                    inputElement.value = dataToDisplay[inputName];
                                    break;
                                case inputTypes.array:
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
        if (!isEmpty(formSettings.afterDisplayData)) {
            formSettings.afterDisplayData(formSettings, data);
        }
    }

    //ToDo: dokumentovati form settings
    /*formSettings {
        :formContainerElement: required | element that contains form
    } */

    function init(formSettings) {
        let formContainerElement = $$(formSettings.formContainerSelector);
        formSettings.formContainerElement = formContainerElement;
        if (formSettings.getData !== null) {
            formSettings.getData = getEvent(formSettings, 'getData');
        }
        if (formSettings.submitEvent !== null) {
            formSettings.submitEvent = getEvent(formSettings, 'submitEvent');
        }

        if (formSettings.populateData === undefined) {
            formSettings.populateData = 'form/fillFormData';
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
        if (isEmpty(formSettings.beforeSubmit)) {
            formSettings.beforeSubmit = null;
        }
        if (isEmpty(formSettings.afterDisplayData)) {
            formSettings.afterDisplayData = null;
        }
        setEndpointId(formSettings);

        if (formContainerElement.formSettings === undefined) {
            initFormHandlers(formSettings);
        }
        if (formSettings.shouldValidate === undefined) {
            formSettings.shouldValidate = false;
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
                        case inputTypes.singleSelect:
                            let valueElement = formInputElement.firstChild;
                            dataForApi[formInputElement.dataset.name] = valueElement.dataset.value.toString();
                            dataForApi[formInputElement.dataset.name] = dropdown.getValue(formInputElement);

                            if (formInputElement.dataset.nameLongId !== undefined && valueElement.dataset.valueLongId !== undefined) {
                                dataForApi[formInputElement.dataset.nameLongId] = valueElement.dataset.valueLongId.toString();
                            }
                            break;
                        case inputTypes.integer:
                            if (parseInt(formInputElement.value) !== undefined) {
                                dataForApi[formInputElement.name] = parseInt(formInputElement.value);
                            }
                            break;
                        case inputTypes.float:
                            let value = prepareFloatValue(formInputElement.value);
                            dataForApi[formInputElement.name] = value * valueMultiplier;
                            break;
                        case inputTypes.string:
                            dataForApi[formInputElement.name] = formInputElement.value;
                            break;
                        case inputTypes.array:
                            if (dataForApi[formInputElement.name] === undefined) {
                                dataForApi[formInputElement.name] = [];
                            }
                            dataForApi[formInputElement.name].push(formInputElement.value);
                            break;
                        case 'default':
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
        let valid = validate(formSettings);

        if (valid) {
            submitButton.disabled = 'disabled';
            submitButton.classList.add('loading');
            if (!isEmpty(formSettings.beforeSubmit)) {
                dataForApi = formSettings.beforeSubmit(formSettings, dataForApi);
            }

            trigger(formSettings.submitEvent, {data: dataForApi, formSettings: formSettings})
        } else {
            return false;
        }
    }

    function validate(formSettings) {
        //skip validation if not required
        if (formSettings.shouldValidate === false) {
            return true;
        }
        let formInputElements = formSettings.formContainerElement.getElementsByClassName('element-form-data');
        let valid = true;
        for (let i = 0; i < formInputElements.length; i++) {
            let input = formInputElements[i];
            if (input.vertexValidation !== undefined) {
                valid = input.vertexValidation.validate() && valid;
            }
        }
        return valid;
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
            parentNode.getElementsByClassName('button-link')[0].classList.add('visibility-hidden');
        }
    }

    function reset(formSettings) {
        let inputs = collectAllFormElements(formSettings);
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            resetInput(input);
        }
    }

    function resetInput(input) {
        //ToDo: handle all input types as needed
        let htmlType = input.getAttribute('type');
        let nodeName = input.nodeName;
        if (nodeName === nodeTypes.input) {
            if (!isEmpty(htmlType) && htmlType === 'text') {
                input.value = '';
            }
        } else if (nodeName === nodeTypes.div) {
            if (input.dataset.type === inputTypes.singleSelect) {
                dropdown.reset(input);
            }
        }
    }


    function addAnotherField(e, formSettings) {
        if (e.currentTarget.dataset.maxNumber !== undefined) {
            let targetSelector = e.currentTarget.dataset.targetSelector;
            let targetElements = $$(formSettings.formContainerSelector).getElementsByClassName(targetSelector);
            if (targetElements.length < e.currentTarget.dataset.maxNumber) {

                let lastElement = targetElements[targetElements.length - 1];

                let lastInput = lastElement.getElementsByTagName('input')[0];

                //add required rule to check if field is not empty
                let validationConstraint = {
                    name:validation.constraintAttributes.required,
                    operator: validation.constraintsOperators.required,
                    value: true
                };
                lastInput.vertexValidation.addConstraint(validationConstraint);
                let lastInputValid = lastInput.vertexValidation.validate();
                //remove required validation
                lastInput.vertexValidation.removeConstraint(validationConstraint.name);

                if (lastInputValid) {
                    let newField = lastElement.cloneNode(true);

                    let newInput = newField.getElementsByTagName('input')[0];
                    newInput.removeAttribute('id');
                    newInput.value = '';
                    newField.getElementsByClassName('button-link')[0].classList.remove('visibility-hidden');
                    newField.classList.add('element-input-additional-array-value');

                    let addAnotherButton = lastElement.parentNode.getElementsByClassName('action-add-another-field')[0].parentNode;

                    lastElement.parentNode.insertBefore(newField, addAnotherButton);


                    validation.init(newInput, {});

                    if (targetElements.length > 1) {
                        targetElements[0].getElementsByClassName('button-link')[0].classList.remove('visibility-hidden');
                    }

                    let deleteButtonFirstElement = targetElements[0].getElementsByClassName('button-link')[0];
                    deleteButtonFirstElement.removeEventListener('click', deleteFormElement);
                    deleteButtonFirstElement.addEventListener('click', deleteFormElement);

                    let deleteButton = newField.getElementsByClassName('button-link')[0];
                    deleteButton.addEventListener('click', deleteFormElement);
                }
            }
        }
    }

    function collectAddAnotherFieldButtons(formSettings) {
        let addAnotherFieldButtons = $$(formSettings.formContainerSelector).getElementsByClassName('action-add-another-field');
        return Array.prototype.slice.call(addAnotherFieldButtons);
    }

    //elements event handlers
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

    function createCurrencyInputs(formSettings) {
        let formInputElements = formSettings.formContainerElement.getElementsByClassName('element-form-data');
        for (let i = 0; i < formInputElements.length; i++) {
            let input = formInputElements[i];
            if (input.dataset.type === inputTypes.float) {
                currencyInput.generate(input);
            }
        }
    }


    function createCurrencyInputs(formSettings) {
        let formInputElements = formSettings.formContainerElement.getElementsByClassName('element-form-data');
        for (let i = 0; i < formInputElements.length; i++) {
            let input = formInputElements[i];
            if (input.dataset.type === inputTypes.float) {
                currencyInput.generate(input);
            }
        }
    }


    function addHiddenField(formSettings, name, value) {
        let formElement = $$(formSettings.formContainerSelector).getElementsByClassName('element-async-form')[0];
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        input.classList.add('element-form-data');
        input.dataset.type = 'string';
        formElement.appendChild(input);
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

    function initValidation(formSettings) {
        if (formSettings.formContainerElement.getAttribute('novalidate') === undefined ||
            formSettings.formContainerElement.getAttribute('novalidate') === null ||
            formSettings.formContainerElement.getAttribute('novalidate') == false) {
            formSettings.shouldValidate = true;
            let formInputElementsArray = collectAllFormElements(formSettings);
            for (let i = 0; i < formInputElementsArray.length; i++) {
                validation.init(formInputElementsArray[i], {});
            }
        }
    }

    function initFormHandlers(formSettings) {
        bindSubmitButtonClickHandlers(formSettings);
        bindEnableButtonClickHandlers(formSettings);
        bindAddAnotherClickHandlers(formSettings);
        createCurrencyInputs(formSettings);
        bindSubmitHandler(formSettings);
        createToggles(formSettings);
        if (isEmpty(formSettings.initValidation)) {
            formSettings.initValidation = initValidation;
        }
        formSettings.initValidation(formSettings);
    }

    on('form/reset', function (params) {
        reset(params.formSettings);
    });

    on('form/add/hiddenField', function (params) {
        addHiddenField(params.formSettings, params.name, params.value);
    });

    on('form/init', function (params) {
        let formSettings = params.formSettings;
        init(formSettings);
    });

    on('form/getData', function (params) {
        let formSettings = params.formSettings;
        getFormData(formSettings);
    });

    on('form/validate', function (params) {
        let formSettings = params.formSettings;
        validate(formSettings);
    });

    on('form/submit', function (params) {
        //disable-ujes dugme
        let formSettings = params.formSettings;
        submit(formSettings);
    });

    on('form/complete', function (params) {
        complete(params.formSettings);
    });

    on('form/fillFormData', function (params) {
        //console.log('params in fill form data:',params);
        let formSettings = params.additionalData;
        let apiResponseData = params.data;
        displayData(formSettings, apiResponseData);
    });

    on('form/submit/success', function (params) {
        //console.log('params in  form submit success:',params);

        let formSettings = params.additionalData;
        let apiResponseData = params.data;
        handleStandardReponseMessages(apiResponseData);
        complete(formSettings);
    });

    on('form/submit/error', function (params) {
       // console.log('params in form submit error:',params);

        let formSettings = params.additionalData;
        let apiResponseData = params.data;
        handleStandardReponseMessages(apiResponseData);
        complete(formSettings);
    });

})();