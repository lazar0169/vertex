const addNewJackpot = (function () {
    let newAndEditJackpotWrapper = $$('#add-new-jackpot-wrapper');
    let growsPatternTabs = $$('#jackpot-growth-pattern-tabs');
    let addNewJackpotControlSettings = $$('.add-new-jackpot-control-settings');
    let addNewJackpotControlSettingsInfo = $$('.add-new-jackpot-control-settings-info');
    let saveNewJackpot = $$("#add-new-jackpot-content-buttons-wrapper").children[0].children[1];
    let clearAllFields = $$("#add-new-jackpot-content-buttons-wrapper").children[0].children[0];
    checkboxChangeState.radioClick($$('#add-new-jackpot-content-inputs-radio'));

    const inputTypes = {
        singleSelect: 'single-select',
        multiSelect: 'multi-select',
        integer: 'int',
        float: 'float',
        string: 'string',
        array: 'array',
        vertexSlide: 'vertex-slide',
        radio: 'radio'
    }

    function reset() {

        let growthPatternByDayWrapper = $$('#add-new-jackpot-growth-pattern-by-day');
        while (growthPatternByDayWrapper.children.length > 1) {
            growthPatternByDayWrapper.children[0].remove();
        }

        let growthPatternByHoursWrapper = $$('#add-new-jackpot-growth-pattern-by-hours');
        while (growthPatternByHoursWrapper.children.length > 1) {
            growthPatternByHoursWrapper.children[0].remove();
        }

        for (let inputElement of newAndEditJackpotWrapper.getElementsByClassName('element-form-data')) {
            switch (inputElement.dataset.type) {
                case inputTypes.vertexSlide:
                    checkboxChangeState.checkboxIsChecked(inputElement, false)
                    break;

                case inputTypes.singleSelect:
                    inputElement.reset();
                    break;

                case inputTypes.multiSelect:
                    inputElement.reset();
                    break;

                default:

                    inputElement.value = '';
                    inputElement.classList.remove(inputElement.vertexValidation.errorClass)
                    while (inputElement.vertexValidation.errorElements.length > 0) {
                        let element = inputElement.vertexValidation.errorElements.pop();
                        element.parentNode.removeChild(element);
                    }
            }
        }

        checkboxChangeState.checkboxIsChecked($$('#jackpot-growth-pattern-value-limit-checkbox').parentNode.children[0].children[0], false);

        $$('#jackpot-growth-pattern-grows-by-bet-chart').reset();

        for (let settings of newAndEditJackpotWrapper.getElementsByClassName('add-new-jackpot-control-settings')) {
            while (settings.querySelectorAll('.opened-arrow').length > 0) {
                settings.querySelectorAll('.opened-arrow')[0].classList.remove('opened-arrow');
            }

            while (settings.querySelectorAll('.color-white').length > 0) {
                settings.querySelectorAll('.color-white')[0].classList.remove('color-white');
                let onOffText = settings.querySelectorAll('.active-add-new-jackpot-settings')[0]
                if (onOffText) {
                    onOffText.innerHTML = localization.translateMessage('Off');
                    onOffText.classList.remove('active-add-new-jackpot-settings');
                }
            }

            while (settings.querySelectorAll('.color-red').length > 0) {
                settings.querySelectorAll('.color-red')[0].classList.remove('color-red');
            }
            settings.children[1].classList.add('hidden');
        }

        for (let levelWrapper of newAndEditJackpotWrapper.querySelectorAll('.jackpot-level-exist-wrapper')) {
            levelWrapper.innerHTML = ''
        }

        while (growsPatternTabs.querySelectorAll('.pattern-active').length > 0) {
            let tabContentValue = growsPatternTabs.querySelectorAll('.pattern-active')[0].dataset.value
            $$(`#${tabContentValue}`).classList.add('hidden');
            growsPatternTabs.querySelectorAll('.pattern-active')[0].classList.remove('pattern-active');
        }

        while (growsPatternTabs.querySelectorAll('.pattern-not-active').length > 0) {
            growsPatternTabs.querySelectorAll('.pattern-not-active')[0].classList.remove('pattern-not-active');
        }

        growsPatternTabs.classList.remove('border-bottom');

        $$('#jackpot-value-limit-wrapper').classList.add('hidden');

        for (let radio of $$('#jackpot-grows-discreetly-radio-buttons').getElementsByClassName('form-input')) {
            radio.checked = false;
        }
        for (let content of $$('.jackpot-grows-discreetly-type-contents')) {
            content.classList.add('hidden');
        }

        while ($$('#add-new-jackpot-time-interval-added-by-dropdown').children.length > 0) {
            $$('#add-new-jackpot-time-interval-added-by-dropdown').children[0].remove();
        }

        $$('#add-new-jackpot-time-interval-chart').reset();

        for (let radio of $$('#winning-conditions-added-by-custom-radio-buttons').querySelectorAll('.form-input')) {
            radio.checked = false;
        }

        for (let radio of $$('#winning-conditions-only-at-the-end-of-interval').querySelectorAll('.form-input')) {
            radio.checked = false;
        }

        $$('#winning-conditions-only-at-the-end-of-interval-custom').classList.add('hidden');

        for (let radio of $$('#add-new-jackpot-time-interval-winning-conditions').querySelectorAll('.form-input')) {
            radio.checked = false;
        }

        $$('#winning-conditions-only-at-the-end-of-interval').classList.add('hidden');

        checkboxChangeState.checkboxIsChecked($$('#add-new-jackpot-control-active-time-settings-jackpot-active-background-checkbox').children[0].children[0], false);

        checkboxChangeState.checkboxIsChecked($$('#add-new-jackpot-control-active-time-settings-jackpot-active-adding-values-checkbox').children[0].children[0], false);

        $$('#winning-conditions-added-by-custom').innerHTML = '';
        for (let wrapper of newAndEditJackpotWrapper.getElementsByClassName('element-participating-machines')) {
            wrapper.settings = {}
            wrapper.getElementsByClassName('showing-participating-machines')[0].innerHTML = '0/0';
        }
    }

    for (let input of newAndEditJackpotWrapper.getElementsByClassName('element-form-data')) {
        validation.init(input, {});
        if (input.dataset.type === 'float') {
            currencyInput.generate(input, {});
        }
    }

    function getInputValueByType(input) {
        let value
        switch (input.dataset.type) {
            case 'int':
                value = parseInt(input.value);
                break;
            case 'float':
                if (input.classList.contains('element-percent')) {
                    value = parseInt(input.dataset.value) / 100;
                } else {
                    value = parseInt(input.dataset.value);
                }
                break;
            case 'radio':
                value = checkboxChangeState.getRadioState(input);
                break;
            case 'single-select':
                value = input.get();
                break;
            default:
                value = input.value;
        }
        return value
    }

    function findInputElementWithName(wrapper, inputName) {
        for (let input of wrapper.getElementsByClassName('element-form-data')) {
            if (inputName === input.name) {
                return getInputValueByType(input);
            }
        }
    }

    saveNewJackpot.onclick = function (e) {
        for (let errorInput of newAndEditJackpotWrapper.querySelectorAll('.vertex-validation-error')) {
            errorInput.classList.remove(errorInput.vertexValidation.errorClass)
            while (errorInput.vertexValidation.errorElements.length > 0) {
                let element = errorInput.vertexValidation.errorElements.pop();
                element.parentNode.removeChild(element);
            }
        }

        if (checkValidationField($$(`#${e.target.dataset.value}`))) {
            let data = {};
            data.EndpointId = $$('#page-jackpots').settings.EndpointId;

            if (newAndEditJackpotWrapper.settings.editSettings) {
                data.Id = newAndEditJackpotWrapper.settings.editSettings.Id
            }

            for (let input of $$('#add-new-jackpot-content-inputs-wrapper').getElementsByClassName('element-form-data')) {
                data[input.name ? input.name : input.dataset.name] = getInputValueByType(input);
            }

            let patternActive = growsPatternTabs.getElementsByClassName('pattern-active')[0];
            data.GrowthType = patternActive ? patternActive.dataset.loadingtype : 0;
            data.IsLocal = newAndEditJackpotWrapper.settingsTable.IsLocal;

            for (let element of newAndEditJackpotWrapper.getElementsByClassName('add-new-jackpot-control-settings')) {
                data[element.getElementsByClassName('element-settings-slide-checkbox')[0].name] = checkboxChangeState.getSwitchState(element);
                if (checkboxChangeState.getSwitchState(element)) {
                    data[element.dataset.name] = {}
                    switch (element.dataset.name) {
                        case 'GrowthPattern':
                            data[element.dataset.name]['AutomaticValue'] = 0
                            data[element.dataset.name]['TimeInDays'] = 0
                            data[element.dataset.name]['AutomaticHiddenPercent'] = 0
                            data[element.dataset.name]['DayIntervals'] = []
                            data[element.dataset.name]['HourIntervals'] = []
                            data[element.dataset.name]['MinBetForLoading'] = 0
                            data[element.dataset.name]['MaxBetForLoading'] = 0
                            data[element.dataset.name]['Percent'] = 0
                            data[element.dataset.name]['HiddenPercent'] = 0
                            data[element.dataset.name]['SelectedMachineForBetLoadingIDs'] = []
                            data[element.dataset.name]['DiscreeteType'] = 0
                            data[element.dataset.name]['Levels'] = []
                            data[element.dataset.name]['SelectedMachineForDiscreteLoadingIDs'] = []
                            data[element.dataset.name]['HasMinMaxLimit'] = ''
                            data[element.dataset.name]['MinMaxStateId'] = 0
                            data[element.dataset.name]['MinValueLimit'] = 0
                            data[element.dataset.name]['MaxValueLimit'] = 0
                            data[element.dataset.name]['MinMaxFunction'] = []

                            let HasMinMaxLimit = checkboxChangeState.getSwitchState($$('#jackpot-value-limit-wrapper').children[0]);
                            data[element.dataset.name]['HasMinMaxLimit'] = HasMinMaxLimit;
                            if (HasMinMaxLimit) {
                                for (let inputElement2 of $$('#jackpot-grow-pattern-value-limit').getElementsByClassName('element-form-data')) {
                                    if (inputElement2.classList.contains('default-select')) {
                                        data[element.dataset.name][inputElement2.children[0].dataset.name] = getInputValueByType(inputElement2);

                                    } else {
                                        if (checkValidationField(inputElement2.parentNode)) {
                                            data[element.dataset.name][inputElement2.name ? inputElement2.name : inputElement2.dataset.name] = getInputValueByType(inputElement2);
                                        }
                                    }
                                }
                                data[element.dataset.name]['MinMaxFunction'] = $$('#jackpot-growth-pattern-grows-by-bet-chart').get();
                            }
                            switch (data.GrowthType) {
                                case '1':
                                    if (checkValidationField($$(`#jackpot-grows-automatically-content`).children[0])) {
                                        for (let inputElement of $$('#jackpot-grows-automatically-content').children[0].getElementsByClassName('element-form-data')) {
                                            data[element.dataset.name][inputElement.name] = getInputValueByType(inputElement);
                                        }
                                        element.children[0].classList.remove('color-red');
                                    } else {
                                        element.children[0].classList.add('color-red');
                                    }
                                    break;

                                case '2':
                                    if (checkValidationField($$(`#jackpot-grows-by-bet`))) {
                                        for (let inputElement of $$('#jackpot-grows-by-bet').getElementsByClassName('element-form-data')) {
                                            data[element.dataset.name][inputElement.name] = getInputValueByType(inputElement);
                                        }
                                        element.children[0].classList.remove('color-red');
                                    }
                                    else {
                                        element.children[0].classList.add('color-red');
                                    }
                                    data[element.dataset.name]['SelectedMachineForBetLoadingIDs'] = $$('#add-new-jackpot-grows-by-bet-choose-machines-wrapper').settings.selectedMachinesArrayID ? $$('#add-new-jackpot-grows-by-bet-choose-machines-wrapper').settings.selectedMachinesArrayID : [];
                                    let HasMinMaxLimit = checkboxChangeState.getSwitchState($$('#jackpot-value-limit-wrapper').children[0]);
                                    data[element.dataset.name]['HasMinMaxLimit'] = HasMinMaxLimit;
                                    break;

                                case '3':
                                    let radioButtonsWrapper = $$('#jackpot-grows-discreetly-radio-buttons');
                                    data[element.dataset.name]['HasMinMaxLimit'] = false;
                                    let DiscreeteType = checkboxChangeState.getRadioState(radioButtonsWrapper)
                                    data[element.dataset.name]['DiscreeteType'] = DiscreeteType ? DiscreeteType : 0;

                                    if (DiscreeteType) {
                                        let chooseMachineWrapper = $$(`#${radioButtonsWrapper.settings.radioName}-choose-machines-wrapper`);
                                        if (chooseMachineWrapper.settings) {
                                            data[element.dataset.name]['SelectedMachineForDiscreteLoadingIDs'] = chooseMachineWrapper.settings.selectedMachinesArrayID
                                        }
                                        for (let level of $$(`#${radioButtonsWrapper.settings.radioName}-jackpot-exist-wrapper`).children) {
                                            let settings = level.settings;
                                            let object = {};
                                            object.Name = settings.LevelName;
                                            object.Value = settings.LevelValue;
                                            object.Formula = {};
                                            object.Formula._Exspressions = [];

                                            if (settings.CustomLevelConditions && settings.CustomLevelConditions.length !== 0) {
                                                for (let exspression of settings.CustomLevelConditions) {
                                                    let object2 = {}
                                                    object2.Counter = exspression.LevelOutcome ? exspression.LevelOutcome.id : null;
                                                    object2.JPId = exspression.LevelOutcome.id === '2' ? exspression.JackpotList ? exspression.JackpotList.id : null : null;
                                                    object2.Type = exspression.CountTypeList.id;
                                                    object2.Number = exspression.Value;
                                                    object.Formula._Exspressions.push(object2);
                                                }
                                            }
                                            else {
                                                let object2 = {}
                                                object2.Counter = settings.LevelOutcome ? settings.LevelOutcome.id : null;
                                                object2.JPId = settings.JackpotList ? settings.JackpotList.id : null;
                                                object2.Type = settings.CountTypeList;
                                                object2.Number = settings.Value;
                                                object.Formula._Exspressions.push(object2);
                                            }
                                            object.Formula._Condition = DiscreeteType === '3' ? checkboxChangeState.getRadioState($$('#custom-radio-buttons')) : 1;
                                            data[element.dataset.name]['Levels'].push(object);
                                        }
                                    }

                                    break;
                            }
                            break;

                        case 'ControlActiveTime':
                            data[element.dataset.name]["Intervals"] = [];
                            data[element.dataset.name]["ChangeBackground"] = false;
                            data[element.dataset.name]["Background"] = null;
                            data[element.dataset.name]["LogicFunctionSelected"] = 0;
                            data[element.dataset.name]["ControlNumOfActiveMachines"] = null;
                            data[element.dataset.name]["Duration"] = null;
                            data[element.dataset.name]["MaxNumOfActiveJackpots"] = null;
                            data[element.dataset.name]["IntervalStatusOptionId"] = 0;
                            data[element.dataset.name]["TransferToNextInterval"] = false;
                            data[element.dataset.name]["JackpotConditionEnum"] = 0;
                            data[element.dataset.name]["IntervalFormula"] = [];
                            data[element.dataset.name]["IntervalLogicFunction"] = 0;
                            data[element.dataset.name]["LinearFunction"] = null;
                            data[element.dataset.name]["MultiWinningsInInterval"] = false;
                            data[element.dataset.name]["PayoutAtTheEndInterval"] = false;
                            data[element.dataset.name]["MultiWinnersId"] = 0;

                            let LogicFunctionSelected = $$('#add-new-jackpot-time-interval-include-conditions-dropdown').children[1].get();
                            data[element.dataset.name]["LogicFunctionSelected"] = LogicFunctionSelected === 'null' ? 0 : parseInt(LogicFunctionSelected);

                            if (data[element.dataset.name]["LogicFunctionSelected"] === 0 && data.HasControlActiveTime && $$('#add-new-jackpot-time-interval-added-by-dropdown').children.length > 0 && checkValidationField($$(`#add-new-jackpot-time-interval-include-conditions-wrapper`))) {
                                trigger('notifications/show', {
                                    message: localization.translateMessage('Logicka funkcija nije dobra'),
                                    type: notifications.messageTypes.error,
                                });
                                element.children[0].classList.add('color-red');
                                return;

                            }
                            // else if (data[element.dataset.name]["LogicFunctionSelected"] === 0 && checkValidationField($$(`#jackpot-condition-maximum-number-of-jackpot-activations`)) &&  !checkValidationField($$(`#jackpot-condition-number-of-machines`)) ) {

                            //     trigger('notifications/show', {
                            //         message: localization.translateMessage('Logicka funkcija nije dobra 222'),
                            //         type: notifications.messageTypes.error,
                            //     });
                            //     element.children[0].classList.add('color-red');
                            //     return;
                            // }
                            else {
                                if (data[element.dataset.name]["LogicFunctionSelected"] === 0 && data.HasControlActiveTime) {
                                    if ($$('#add-new-jackpot-time-interval-added-by-dropdown').children.length > 0) {
                                        for (let errorInput of $$(`#add-new-jackpot-time-interval-include-conditions-wrapper`).querySelectorAll('.vertex-validation-error')) {
                                            errorInput.classList.remove(errorInput.vertexValidation.errorClass)
                                            while (errorInput.vertexValidation.errorElements.length > 0) {
                                                let element = errorInput.vertexValidation.errorElements.pop();
                                                element.parentNode.removeChild(element);
                                            }
                                        }

                                        if ($$('#jackpot-condition-number-of-machines').value === '' && $$('#jackpot-condition-maximum-number-of-jackpot-activations').value !== '' || $$('#jackpot-condition-number-of-machines').value !== '' && $$('#jackpot-condition-maximum-number-of-jackpot-activations').value === '') {
                                            checkValidationField($$(`#add-new-jackpot-time-interval-include-conditions-wrapper`));
                                            trigger('notifications/show', {
                                                message: localization.translateMessage('Logicka funkcija nije dobra 222'),
                                                type: notifications.messageTypes.error,
                                            });
                                            element.children[0].classList.add('color-red');
                                            return;
                                        }
                                        for (let timeWrapper of $$('#add-new-jackpot-time-interval-added-by-dropdown').children) {
                                            let object = {};
                                            object.DayOfWeek = timeWrapper.settings.DayOfWeek;
                                            object.Start = timeWrapper.settings.Start;
                                            object.End = timeWrapper.settings.End;
                                            data[element.dataset.name]["Intervals"].push(object);
                                        }
                                        data[element.dataset.name]["LinearFunction"] = $$('#add-new-jackpot-time-interval-chart').get()

                                    } else {
                                        if (checkValidationField($$(`#add-new-jackpot-time-interval-include-conditions-wrapper`))) {
                                            //todo antic popuni polja
                                            let DurationHours = $$('#add-new-jackpot-time-interval-include-conditions-wrapper').getElementsByClassName('timepicker')[0].children[0];
                                            let DurationMinutes = $$('#add-new-jackpot-time-interval-include-conditions-wrapper').getElementsByClassName('timepicker')[0].children[1];
                                            data[element.dataset.name]["Duration"] = `${DurationHours.getValue().slice(0, 2)}:${DurationMinutes.getValue().slice(0, 2)}`;
                                            data[element.dataset.name]["ControlNumOfActiveMachines"] = getInputValueByType($$('#jackpot-condition-number-of-machines'))
                                            data[element.dataset.name]["MaxNumOfActiveJackpots"] = getInputValueByType($$('#jackpot-condition-maximum-number-of-jackpot-activations'))
                                        } else {
                                            trigger('notifications/show', {
                                                message: localization.translateMessage('Popuni jedno ili drugo'),
                                                type: notifications.messageTypes.error,
                                            });
                                            element.children[0].classList.add('color-red');
                                            return;
                                        }
                                    }
                                } else {
                                    if (data.HasControlActiveTime && checkValidationField($$(`#add-new-jackpot-time-interval-include-conditions-wrapper`)) && $$('#add-new-jackpot-time-interval-added-by-dropdown').children.length > 0) {
                                        //todo antic popuni polja
                                        let DurationHours = $$('#add-new-jackpot-time-interval-include-conditions-wrapper').getElementsByClassName('timepicker')[0].children[0];
                                        let DurationMinutes = $$('#add-new-jackpot-time-interval-include-conditions-wrapper').getElementsByClassName('timepicker')[0].children[1];
                                        data[element.dataset.name]["Duration"] = `${DurationHours.getValue().slice(0, 2)}:${DurationMinutes.getValue().slice(0, 2)}`;
                                        data[element.dataset.name]["ControlNumOfActiveMachines"] = getInputValueByType($$('#jackpot-condition-number-of-machines'))
                                        data[element.dataset.name]["MaxNumOfActiveJackpots"] = getInputValueByType($$('#jackpot-condition-maximum-number-of-jackpot-activations'))

                                        for (let timeWrapper of $$('#add-new-jackpot-time-interval-added-by-dropdown').children) {
                                            let object = {};
                                            object.DayOfWeek = timeWrapper.settings.DayOfWeek;
                                            object.Start = timeWrapper.settings.Start;
                                            object.End = timeWrapper.settings.End;
                                            data[element.dataset.name]["Intervals"].push(object);
                                        }
                                        data[element.dataset.name]["LinearFunction"] = $$('#add-new-jackpot-time-interval-chart').get()

                                    } else {
                                        trigger('notifications/show', {
                                            message: localization.translateMessage('Moras da popunis obadva'),
                                            type: notifications.messageTypes.error,
                                        });
                                        element.children[0].classList.add('color-red');
                                        return;
                                    }
                                }
                            }
                            data[element.dataset.name]["ChangeBackground"] = checkboxChangeState.getCheckboxState($$('#add-new-jackpot-control-active-time-settings-jackpot-active-background-checkbox'));
                            data[element.dataset.name]["Background"] = $$('#add-new-jackpot-control-active-time-settings-jackpot-active-background-dropdown').children[1].get();
                            data[element.dataset.name]["IntervalStatusOptionId"] = $$('#add-new-jackpot-control-active-time-settings-jackpot-active-after-jackpot-win-dropdown').children[1].get();
                            data[element.dataset.name]["TransferToNextInterval"] = checkboxChangeState.getCheckboxState($$('#add-new-jackpot-control-active-time-settings-jackpot-active-adding-values-checkbox'));

                            let jackpotWinningConditions = checkboxChangeState.getRadioState($$('#add-new-jackpot-time-interval-winning-conditions'));
                            data[element.dataset.name]["MultiWinningsInInterval"] = jackpotWinningConditions === '0' ? true : false;
                            if (jackpotWinningConditions === '1') {
                                let JackpotConditionEnum = checkboxChangeState.getRadioState($$('#winning-conditions-only-at-the-end-of-interval'))
                                data[element.dataset.name]["JackpotConditionEnum"] = JackpotConditionEnum;
                                data[element.dataset.name]["PayoutAtTheEndInterval"] = true;

                                if (JackpotConditionEnum === '2') {
                                    if ($$('#winning-conditions-added-by-custom').children.length !== 0) {
                                        for (let conditionCustom of $$('#winning-conditions-added-by-custom').children) {
                                            let conditionObject = {}
                                            conditionObject.Counter = parseInt(conditionCustom.settings.CounterWinnerConditionList);
                                            conditionObject.JPId = parseInt(conditionCustom.settings.JackpotList);
                                            conditionObject.Type = parseInt(conditionCustom.settings.CountTypeWinnerConditionList);
                                            conditionObject.OperatorType = parseInt(conditionCustom.settings.OperatorWinnerConditionList);
                                            conditionObject.Number = parseInt(conditionCustom.settings.Number);
                                            data[element.dataset.name]["IntervalFormula"].push(conditionObject);
                                        }
                                    } else {
                                        trigger('notifications/show', {
                                            message: localization.translateMessage('Nisi izabrao uslove u JackpotAtTheEndOfInterval -> custom'),
                                            type: notifications.messageTypes.error,
                                        });
                                        element.children[0].classList.add('color-red')
                                        return;
                                    }
                                } else {
                                    let conditionObject = {}
                                    conditionObject.Counter = 3;
                                    conditionObject.JPId = null;
                                    conditionObject.Type = 0;
                                    conditionObject.OperatorType = 7;
                                    conditionObject.Number = null;
                                    data[element.dataset.name]["IntervalFormula"].push(conditionObject);
                                }
                            }
                            let IntervalLogicFunction = checkboxChangeState.getRadioState($$('#winning-conditions-added-by-custom-radio-buttons'));
                            data[element.dataset.name]["IntervalLogicFunction"] = IntervalLogicFunction === undefined ? 0 : IntervalLogicFunction
                            data[element.dataset.name]["MultiWinnersId"] = $$('#add-new-jackpot-control-active-time-settings-jackpot-active-more-jackpot-winners-dropdown').children[1].get();
                            break;

                        case 'DontParticipateAllMachines':
                            let SelectedMachineRestrictionIDs = $$('#add-new-jackpot-choose-machines-buttons').parentNode.settings.selectedMachinesArrayID;
                            data[element.dataset.name]["SelectedMachineRestrictionIDs"] = SelectedMachineRestrictionIDs ? SelectedMachineRestrictionIDs : []
                            let NumOfActiveMachinesRestriction = $$('#jackpot-num-of-active-machines-restriction').children[0].value
                            data[element.dataset.name]["NumOfActiveMachinesRestriction"] = NumOfActiveMachinesRestriction === '' ? null : parseInt(NumOfActiveMachinesRestriction);
                            break;

                        default:
                            for (let input of element.children[1].getElementsByClassName('element-form-data')) {
                                if (input.classList.contains('default-select')) {
                                    if (input.dataset.type === 'single-select') {
                                        data[element.dataset.name][input.children[0].dataset.name] = input.get();
                                    } else {
                                        let selectList = input.get();
                                        data[element.dataset.name][input.children[0].dataset.name] = selectList === 'null' ? null : selectList.split(',')
                                    }
                                } else {
                                    if (checkValidationField(input.parentNode)) {
                                        data[element.dataset.name][input.name ? input.name : input.dataset.name] = getInputValueByType(input);
                                        element.children[0].classList.remove('color-red');
                                    }
                                    else {
                                        element.children[0].classList.add('color-red');
                                    }
                                }
                            }
                    }
                }
            }

            if (newAndEditJackpotWrapper.getElementsByClassName('vertex-error-container').length === 0) {

                if (data.IsGrowing && data.GrowthType === '1') {
                    let validPeriod = isPeriodValid($$('#jackpot-control-growth-period').parentNode);
                    let emptyPeriod = isPeriodEmpty($$('#jackpot-control-growth-period').parentNode);
                    if (validPeriod || emptyPeriod) {
                        if (validPeriod) {
                            if ($$('#jackpot-control-growth-period').getElementsByClassName('tab-active')[0].dataset.name === 'days') {
                                for (let day of $$('#add-new-jackpot-growth-pattern-by-day').getElementsByClassName('grid-3-columns')) {
                                    let object = {}
                                    object[day.children[0].children[0].name] = findInputElementWithName(day, day.children[0].children[0].name);
                                    object[day.children[1].children[0].name] = findInputElementWithName(day, day.children[1].children[0].name);
                                    data.GrowthPattern.DayIntervals.push(object)
                                }
                            } else {
                                for (let hour of $$('#add-new-jackpot-growth-pattern-by-hours').getElementsByClassName('grid-3-columns')) {
                                    let object = {}
                                    object[hour.children[0].children[0].name] = findInputElementWithName(hour, hour.children[0].children[0].name);
                                    object[hour.children[1].children[0].name] = findInputElementWithName(hour, hour.children[1].children[0].name);
                                    data.GrowthPattern.HourIntervals.push(object)
                                }
                            }
                        }
                    }
                    else {
                        trigger('notifications/show', {
                            message: localization.translateMessage('Vremenski period nije validan'),
                            type: notifications.messageTypes.error,
                        });
                        $$('#add-new-jackpot-content-growth-pattern').children[0].classList.add('color-red');
                        return;
                    }
                }
                if (data.IsGrowing && data.GrowthType === '2' && data.GrowthPattern.MaxBetForLoading < data.GrowthPattern.MinBetForLoading) {
                    trigger('notifications/show', {
                        message: localization.translateMessage('Ne može da se doda ukoliko je vrednost Maximum bet for growth manja od vrednosti Minimum bet for growth, i obrnuto.'),
                        type: notifications.messageTypes.error,
                    });
                    $$('#add-new-jackpot-content-growth-pattern').children[0].classList.add('color-red');
                    return;
                }
                if (data.IsGrowing && data.GrowthPattern.HasMinMaxLimit && data.GrowthPattern.MaxValueLimit < data.GrowthPattern.MinValueLimit) {
                    trigger('notifications/show', {
                        message: localization.translateMessage('Vrednost za Minimum value ne može da bude veća od vrednosti za Maximum value'),
                        type: notifications.messageTypes.error,
                    });
                    $$('#add-new-jackpot-content-growth-pattern').children[0].classList.add('color-red');
                    return;
                }
                if (data.IsGrowing && data.GrowthPattern.HasMinMaxLimit && data.GrowthPattern.MinValueLimit < data.StartValue) {
                    trigger('notifications/show', {
                        message: localization.translateMessage('Vrednost za Minimum value ne može da bude manja od početne vrednosti za JP'),
                        type: notifications.messageTypes.error,
                    });
                    $$('#add-new-jackpot-content-growth-pattern').children[0].classList.add('color-red');
                    return;
                }
                if (data.HasBetAndWinLimit && data.BetAndWinLimit.MaxBetForPayoutSlow < data.BetAndWinLimit.MinBetForPayoutSlow || data.HasBetAndWinLimit && data.BetAndWinLimit.MaxBetForPayoutMedium < data.BetAndWinLimit.MinBetForPayoutMedium || data.HasBetAndWinLimit && data.BetAndWinLimit.MaxBetForPayoutFast < data.BetAndWinLimit.MinBetForPayoutFast) {
                    trigger('notifications/show', {
                        message: localization.translateMessage('Vrednost za Minimum value treba da bude manja od vrednosti za Maximum value.'),
                        type: notifications.messageTypes.error,
                    });
                    $$('#add-new-jackpot-content-limit-settings').children[0].classList.add('color-red');
                    return;
                }
                if (data.HasControlActiveTime && data.ControlActiveTime.error) {
                    $$('#add-new-jackpot-content-control-active-time').children[0].classList.add('color-red');
                    return;
                }

                trigger(communication.events.jackpots.saveJackpot, { data });
                $$('#jackpot-add-jackpot').children[0].classList.remove('not-active-button');
            }
        }
    }

    function isPeriodValid(wrapper) {
        let activePeriod = wrapper.getElementsByClassName('tab-active')[0];
        let valid = false;
        let dayCounter = 0;
        let percentCounter = 0;
        let hoursCounter = 0;

        for (let inputElement of $$(`#${activePeriod.dataset.value}`).getElementsByClassName('element-form-data')) {
            if (inputElement.name == 'NumOfDay') {
                dayCounter += getInputValueByType(inputElement);
            }
            else if (inputElement.name == 'Time') {
                hoursCounter += getInputValueByType(inputElement);
            }
            else {
                percentCounter += getInputValueByType(inputElement);
            }
        }

        if (activePeriod.dataset.name === 'days') {
            let growthDays = parseInt($$('#jackpot-grows-automatically-growth-days').getElementsByClassName('element-form-data')[0].value);

            if (dayCounter === growthDays && percentCounter === 100) {
                valid = true
            } else {
                valid = false
            }
        } else {
            if (hoursCounter === 24 && percentCounter === 100) {
                valid = true;
            } else {
                valid = false;
            }
        }
        return valid;
    }

    function isPeriodEmpty(wrapper) {
        let activePeriod = wrapper.getElementsByClassName('tab-active')[0];
        let valid = true;
        for (let inputElement of $$(`#${activePeriod.dataset.value}`).getElementsByClassName('element-form-data')) {
            if (inputElement.value !== '') {
                return valid = false;
            }
        }
        return valid;
    }

    clearAllFields.addEventListener('click', function () {
        alert('Set all fields to initial value');
    });

    window.addEventListener('load', function () {
        for (let control of addNewJackpotControlSettingsInfo) {
            control.onclick = function () {
                for (let element of addNewJackpotControlSettingsInfo) {
                    if (control !== element) {
                        element.parentNode.parentNode.children[1].classList.add('hidden');
                        element.children[1].classList.remove('opened-arrow');
                    }
                    else {
                        element.parentNode.parentNode.children[1].classList.toggle('hidden');
                        trigger('opened-arrow', { div: element });
                    }
                }
            };
        }
        for (let checkSwitch of addNewJackpotControlSettings) {
            checkSwitch.children[0].children[0].onclick = function (e) {
                e.preventDefault();
                if (checkSwitch.getElementsByClassName('form-switch')[0].children[0].checked) {
                    checkSwitch.getElementsByClassName('form-switch')[0].children[0].checked = false;
                    checkSwitch.children[0].children[1].children[0].children[1].innerHTML = localization.translateMessage('Off');
                    checkSwitch.children[1].classList.add('hidden');
                    checkSwitch.children[0].children[1].children[1].classList.remove('opened-arrow');
                }
                else {
                    checkSwitch.getElementsByClassName('form-switch')[0].children[0].checked = true;
                    checkSwitch.children[0].children[1].children[0].children[1].innerHTML = localization.translateMessage('On');
                    checkSwitch.children[1].classList.remove('hidden');
                    checkSwitch.children[0].children[1].children[1].classList.add('opened-arrow');
                }
                for (let currentCheck of addNewJackpotControlSettings) {
                    if (checkSwitch.children[0].getElementsByClassName('form-switch')[0].children[0] !== currentCheck.getElementsByClassName('form-switch')[0].children[0] && checkSwitch.getElementsByClassName('form-switch')[0].children[0].checked) {
                        currentCheck.children[1].classList.add('hidden');
                        currentCheck.children[0].children[1].children[1].classList.remove('opened-arrow');
                    }
                }
                checkSwitch.children[0].classList.toggle('color-white');
                checkSwitch.children[0].children[1].children[0].children[1].classList.toggle('active-add-new-jackpot-settings');
                //todo ovde pobrisati validirana polja kada nema actice-add-new-jackpot-settings
                checkSwitch.children[0].classList.remove('color-red');
                for (let errorInput of checkSwitch.children[1].querySelectorAll('.vertex-validation-error')) {
                    errorInput.classList.remove(errorInput.vertexValidation.errorClass)
                    while (errorInput.vertexValidation.errorElements.length > 0) {
                        let element = errorInput.vertexValidation.errorElements.pop();
                        element.parentNode.removeChild(element);
                    }
                }
            }
        }
    });

    on('jackpot/get-add-jackpot', function (params) {
        $$('#add-new-jackpot-content-header').innerHTML = localization.translateMessage('AddNewJackpot');
        newAndEditJackpotWrapper.settings = params.data.Data;
        fillAdvanceSettings(params.data.Data);
    });

    function fillAdvanceSettings(params) {
        let data = params;
        let [...multiJackpotList] = data.JackpotList;
        multiJackpotList.unshift({ Id: null, Name: '-' })

        let ddDeactivateWithGrow = $$('#advance-settings-deactivate-jackpot-and-grow');
        let ddDeactivateStopGrow = $$('#advance-settings-deactivate-jackpot-and-stop-grow');
        let ddHideWithGrow = $$('#advance-settings-hide-jackpot-and-grow');
        let ddHideStopGrow = $$('#advance-settings-hide-jackpot-and-stop-grow');
        let ddNewJackpots = $$('#advance-settings-next-jackpots');
        let ddAfterReachingMax = $$('#jackpot-growth-pattern-after-reaching-max');
        let ddTournamentLevelOutcome = $$('#tournament-dropdown-level-outcome');
        let ddRainJackpot = $$("#rain-dropdown-jackpot");
        let ddCustomLevelOutcome = $$("#custom-dropdown-level-outcome");
        let ddCustomCountTypeList = $$("#custom-dropdown-level-count-type-list");
        let ddTournamentOperators = $$('#tournament-dropdown-operators');
        let ddRainOperators = $$('#rain-dropdown-operators');
        let ddCustomOperators = $$('#custom-dropdown-operators');
        let ddTournamentJackpot = $$("#tournament-dropdown-jackpot");
        let ddCustomJackpot = $$("#custom-dropdown-jackpot");
        let ddControlActiveTimeIncludeConditions = $$('#add-new-jackpot-time-interval-include-conditions-dropdown');
        let ddControlActiveTimeSettingsBackground = $$('#add-new-jackpot-control-active-time-settings-jackpot-active-background-dropdown')
        let ddControlActiveTimeSettingsAfterJackpotWin = $$('#add-new-jackpot-control-active-time-settings-jackpot-active-after-jackpot-win-dropdown');
        let ddControlActiveTimeSettingsMoreJackpotWinners = $$('#add-new-jackpot-control-active-time-settings-jackpot-active-more-jackpot-winners-dropdown');
        //todo nikola ovo preimenuj
        let ddCounterWinnerConditionList = $$('#proba1');
        let ddCountTypeWinnerConditionList = $$('#proba2');
        let ddOperatorWinnerConditionList = $$('#proba3');
        let ddJackpotWinnerConditionList = $$('#proba4');

        if (data.JackpotList.length > 0) {
            dropdown.generate({ values: data.JackpotList, parent: ddRainJackpot, name: "JackpotList" });
            dropdown.generate({ values: data.JackpotList, parent: ddTournamentJackpot, name: "JackpotList" });
            dropdown.generate({ values: data.JackpotList, parent: ddCustomJackpot, name: "JackpotList" });
            dropdown.generate({ values: data.JackpotList, parent: ddJackpotWinnerConditionList, name: "JackpotList" });
        }

        dropdown.generate({ values: multiJackpotList, parent: ddDeactivateWithGrow, type: 'multi', name: 'SelectedBlockJackpotDisableWithLoadingIds' });
        dropdown.generate({ values: multiJackpotList, parent: ddDeactivateStopGrow, type: 'multi', name: 'SelectedBlockJackpotDisableWithoutLoadingIds' });
        dropdown.generate({ values: multiJackpotList, parent: ddHideWithGrow, type: 'multi', name: 'SelectedBlockJackpotHIdeWithLoadingIds' });
        dropdown.generate({ values: multiJackpotList, parent: ddHideStopGrow, type: 'multi', name: 'SelectedBlockJackpotHIdeWithoutLoadingIds' });
        dropdown.generate({ values: data.NewJackpotStateList, parent: ddNewJackpots, type: 'single', name: 'NewJackpotOptionId' });
        dropdown.generate({ values: data.MinMaxState, parent: ddAfterReachingMax, name: 'MinMaxStateId' });


        dropdown.generate({ values: data.CounterLevelList, parent: ddTournamentLevelOutcome, name: "LevelOutcome" });
        bindOptionsGroup(ddTournamentLevelOutcome);

        dropdown.generate({ values: data.CounterLevelList, parent: ddCustomLevelOutcome, name: "LevelOutcome" });
        bindOptionsGroup(ddCustomLevelOutcome);

        dropdown.generate({ values: data.CountTypeLevelList, parent: ddCustomCountTypeList, name: "CountTypeList" });



        dropdown.generate({ values: data.OperatorLevelList, parent: ddTournamentOperators, name: "Operator" });
        dropdown.generate({ values: data.OperatorLevelList, parent: ddRainOperators, name: "Operator" });
        dropdown.generate({ values: data.OperatorLevelList, parent: ddCustomOperators, name: "Operator" });
        dropdown.generate({ values: data.LogicFunction, parent: ddControlActiveTimeIncludeConditions, name: "LogicFunctionSelected" });
        dropdown.generate({ values: data.JackpotBackgroundList, parent: ddControlActiveTimeSettingsBackground, name: "JackpotBackgroundList" });
        dropdown.generate({ values: data.IntervalStatus, parent: ddControlActiveTimeSettingsAfterJackpotWin, name: "IntervalStatus" });
        dropdown.generate({ values: data.MultiWinners, parent: ddControlActiveTimeSettingsMoreJackpotWinners, name: "MultiWinners" });
        dropdown.generate({ values: data.CounterWinnerConditionList, parent: ddCounterWinnerConditionList, name: "CounterWinnerConditionList" });
        dropdown.generate({ values: data.CountTypeWinnerConditionList, parent: ddCountTypeWinnerConditionList, name: "CountTypeWinnerConditionList" });
        dropdown.generate({ values: data.OperatorWinnerConditionList, parent: ddOperatorWinnerConditionList, name: "OperatorWinnerConditionList" });
        bindOptionsGroup(ddCounterWinnerConditionList);



        for (let wrapper of newAndEditJackpotWrapper.getElementsByClassName('showing-participating-machines')) {
            wrapper.innerHTML = `0/${data.MachineList.Items.length}`;
        }
    }

    function bindOptionsGroup(dropdown) {
        for (let option of dropdown.children[1].children[1].children) {
            option.addEventListener('click', function () {
                if (option.dataset.id === '2') {
                    $$(`#${dropdown.dataset.value}`).classList.remove('hidden');
                } else {
                    $$(`#${dropdown.dataset.value}`).classList.add('hidden');
                }
            });
        }
    }

    return {
        fillAdvanceSettings,
        reset
    }
})();