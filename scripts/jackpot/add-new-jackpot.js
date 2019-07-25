const addNewJackpot = (function () {
    let newAndEditJackpotWrapper = $$('#add-new-jackpot-wrapper');
    let growsPatternTabs = $$('#jackpot-growth-pattern-tabs');
    let addNewJackpotControlSettings = $$('.add-new-jackpot-control-settings');
    let addNewJackpotControlSettingsInfo = $$('.add-new-jackpot-control-settings-info');
    let removeAllMachines = $$('#add-new-jackpot-choose-machines-buttons').children[1];
    let saveNewJackpot = $$("#add-new-jackpot-content-buttons-wrapper").children[0].children[1];
    let clearAllFields = $$("#add-new-jackpot-content-buttons-wrapper").children[0].children[0];
    checkboxChangeState.radioClick($$('#add-new-jackpot-content-inputs-radio'));

    const inputTypes = {
        singleSelect: 'single-select',
        integer: 'int',
        float: 'float',
        string: 'string',
        array: 'array',
        vertexSlide: 'vertex-slide',
        radio: 'radio'
    }

    function reset() {
        //todo vrati polja za dani na jedno growth pattern -> grows automatically
        let growthPatternByDayWrapper = $$('#add-new-jackpot-growth-pattern-by-day');
        while (growthPatternByDayWrapper.children.length > 1) {
            growthPatternByDayWrapper.children[0].remove();
        }
        //todo vrati polja za sati na jedno growth pattern -> grows automatically
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

                default:
                    inputElement.value = '';
                    inputElement.classList.remove(inputElement.vertexValidation.errorClass)
                    while (inputElement.vertexValidation.errorElements.length > 0) {
                        let element = inputElement.vertexValidation.errorElements.pop();
                        element.parentNode.removeChild(element);
                    }
            }
        }

        //todo vrati value limit na iskljuceno
        checkboxChangeState.checkboxIsChecked($$('#jackpot-growth-pattern-value-limit-checkbox').parentNode.children[0].children[0], false);
        //todo da se resetuje chart
        $$('#jackpot-growth-pattern-grows-by-bet-chart').reset();

        //todo deo za settings 
        for (let settings of newAndEditJackpotWrapper.getElementsByClassName('add-new-jackpot-control-settings')) {
            //todo sve strelice zatvori obicno je samo jedna otvorena
            while (settings.querySelectorAll('.opened-arrow').length > 0) {
                settings.querySelectorAll('.opened-arrow')[0].classList.remove('opened-arrow');
            }
            //todo da settings vrati na off ukloni belu boju i ukloni klasu active
            while (settings.querySelectorAll('.color-white').length > 0) {
                settings.querySelectorAll('.color-white')[0].classList.remove('color-white');
                let onOffText = settings.querySelectorAll('.active-add-new-jackpot-settings')[0]
                if (onOffText) {
                    onOffText.innerHTML = localization.translateMessage('Off');
                    onOffText.classList.remove('active-add-new-jackpot-settings');
                }
            }
            // todo da sakrije sve sadrzaje za settings-e
            settings.children[1].classList.add('hidden');
        }

        //todo vracanje tabova na pocetne vrednosti u growth patternu
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

        //todo decekiranje diskretnih radio buttona
        for (let radio of $$('#jackpot-grows-discreetly-radio-buttons').getElementsByClassName('form-input')) {
            radio.checked = false;
        }
        for (let content of $$('.jackpot-grows-discreetly-type-contents')) {
            content.classList.add('hidden');
        }

        //todo resetovanje control active time

        while ($$('#add-new-jackpot-time-interval-added-by-dropdown').children.length > 0) {
            $$('#add-new-jackpot-time-interval-added-by-dropdown').children[0].remove();
        }

        $$('#add-new-jackpot-time-interval-chart').reset();

        //todo decekiraj radio elemente iz opcije custom (jackpoy at the end of interval)
        for (let radio of $$('#winning-conditions-added-by-custom-radio-buttons').querySelectorAll('.form-input')) {
            radio.checked = false;
        }

        //todo decekiraj radio elemente iz jackpot at the end of interval i sakrij polja za custom 
        for (let radio of $$('#winning-conditions-only-at-the-end-of-interval').querySelectorAll('.form-input')) {
            radio.checked = false;
        }
        $$('#winning-conditions-only-at-the-end-of-interval-custom').classList.add('hidden');


        //todo decekiraj conditions for winning jackpot radio elemente
        for (let radio of $$('#add-new-jackpot-time-interval-winning-conditions').querySelectorAll('.form-input')) {
            radio.checked = false;
        }
        $$('#winning-conditions-only-at-the-end-of-interval').classList.add('hidden');

        //todo decekiraj change the background
        checkboxChangeState.checkboxIsChecked($$('#add-new-jackpot-control-active-time-settings-jackpot-active-background-checkbox').children[0].children[0], false);

        //todo decekiraj adding values to the next interval
        checkboxChangeState.checkboxIsChecked($$('#add-new-jackpot-control-active-time-settings-jackpot-active-adding-values-checkbox').children[0].children[0], false);

        //todo resetovanje settings-a za selektovane masine
        for (let wrapper of newAndEditJackpotWrapper.getElementsByClassName('element-participating-machines')) {
            wrapper.settings = {}
            console.log(newAndEditJackpotWrapper.settings)
            wrapper.getElementsByClassName('showing-participating-machines')[0].innerHTML = '0/0';
        }
        console.log('vrati sve na pocetne vrednosti')
    }

    //validacija growth pattern polja
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
                value = parseInt(input.dataset.value);
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

    saveNewJackpot.addEventListener('click', function (e) {
        if (checkValidationField($$(`#${e.target.dataset.value}`))) {

            let data = {};
            data.EndpointId = $$('#page-jackpots').settings.EndpointId;
            //podatak: No, Name, Handpay, StartValue, BottomLabelText i ChooseType
            for (let input of $$('#add-new-jackpot-content-inputs-wrapper').getElementsByClassName('element-form-data')) {
                data[input.name ? input.name : input.dataset.name] = getInputValueByType(input);
            }
            //podatak: koji je tab aktivan u growth pattern delu ovo treba da bude prvo da li je growth pattern aktivan?
            let patternActive = growsPatternTabs.getElementsByClassName('pattern-active')[0];
            data.GrowthType = patternActive ? patternActive.dataset.loadingtype : 0;

            //podatak: citanje iz settings-a da li je lokalno
            data.IsLocal = newAndEditJackpotWrapper.settingsTable.IsLocal;

            for (let element of newAndEditJackpotWrapper.getElementsByClassName('add-new-jackpot-control-settings')) {
                data[element.getElementsByClassName('form-switch')[0].children[0].name] = checkboxChangeState.getSwitchState(element);
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
                            }

                            switch (data.GrowthType) {
                                //todo kada je ukljucen automatski rast
                                case '1':
                                    //podatak AutomaticValue, TimeInDays, AutomaticHiddenPercent
                                    if (checkValidationField($$(`#jackpot-grows-automatically-content`).children[0])) {
                                        for (let inputElement of $$('#jackpot-grows-automatically-content').children[0].getElementsByClassName('element-form-data')) {
                                            data[element.dataset.name][inputElement.name] = getInputValueByType(inputElement);
                                        }
                                    }
                                    let validPeriod = isPeriodValid($$('#jackpot-control-growth-period').parentNode);
                                    let emptyPeriod = isPeriodEmpty($$('#jackpot-control-growth-period').parentNode)
                                    if (validPeriod || emptyPeriod) {
                                        if (validPeriod) {
                                            if ($$('#jackpot-control-growth-period').getElementsByClassName('tab-active')[0].dataset.name === 'days') {
                                                for (let day of $$('#add-new-jackpot-growth-pattern-by-day').getElementsByClassName('grid-3-columns')) {
                                                    let object = {}
                                                    object[day.children[0].children[0].name] = findInputElementWithName(day, day.children[0].children[0].name);
                                                    object[day.children[1].children[0].name] = findInputElementWithName(day, day.children[1].children[0].name);
                                                    data[element.dataset.name]['DayIntervals'].push(object)
                                                }
                                            } else {
                                                for (let hour of $$('#add-new-jackpot-growth-pattern-by-hours').getElementsByClassName('grid-3-columns')) {
                                                    let object = {}
                                                    object[hour.children[0].children[0].name] = findInputElementWithName(hour, hour.children[0].children[0].name);
                                                    object[hour.children[1].children[0].name] = findInputElementWithName(hour, hour.children[1].children[0].name);
                                                    data[element.dataset.name]['HourIntervals'].push(object)
                                                }
                                            }
                                        }
                                    } else {

                                        console.log('Nevalidno!!!')
                                        trigger('notifications/show', {
                                            message: localization.translateMessage('Vremenski period nije validan'),
                                            type: notifications.messageTypes.error,
                                        });
                                    }

                                    break;

                                //todo kada je ukljucen rast po betu
                                case '2':
                                    if (checkValidationField($$(`#jackpot-grows-by-bet`))) {
                                        for (let inputElement of $$('#jackpot-grows-by-bet').getElementsByClassName('element-form-data')) {
                                            data[element.dataset.name][inputElement.name] = getInputValueByType(inputElement);
                                        }
                                    }
                                    data[element.dataset.name]['SelectedMachineForBetLoadingIDs'] = [];
                                    let HasMinMaxLimit = checkboxChangeState.getSwitchState($$('#jackpot-value-limit-wrapper').children[0]);
                                    data[element.dataset.name]['HasMinMaxLimit'] = HasMinMaxLimit;
                                    break;
                                //todo kada je ukljucen diskretan rast
                                case '3':
                                    let radioButtonsWrapper = $$('#jackpot-grows-discreetly-radio-buttons');
                                    data[element.dataset.name]['HasMinMaxLimit'] = false;
                                    let DiscreeteType = checkboxChangeState.getRadioState(radioButtonsWrapper)
                                    data[element.dataset.name]['DiscreeteType'] = DiscreeteType ? DiscreeteType : 0;

                                    if (DiscreeteType) {
                                        for (let level of $$(`#${radioButtonsWrapper.settings.radioName}-jackpot-exist-wrapper`).children) {
                                            let settings = level.settings;
                                            let object = {};
                                            object.Name = settings.LevelName;
                                            object.Value = settings.LevelValue;
                                            object.Formula = {};
                                            object.Formula._Exspressions = [];
                                            let object2 = {}
                                            object2.Counter = settings.LevelOutcome ? settings.LevelOutcome.id : null;
                                            object2.JPId = settings.JackpotList ? settings.JackpotList.id : null;
                                            object2.Type = settings.CountTypeList;
                                            object2.Number = settings.Value;
                                            object.Formula._Exspressions.push(object2);
                                            object.Formula._Condition = DiscreeteType === '3' ? checkboxChangeState.getRadioState($$('#custom-radio-buttons')) : 1;
                                            data[element.dataset.name]['Levels'].push(object);
                                        }
                                    }

                                    break;
                                //kada nije ukljucen nijedan tab
                                default:
                                    trigger('notifications/show', {
                                        message: localization.translateMessage('nije odabran nijedan tab iz growth pattern'),
                                        type: notifications.messageTypes.error,
                                    });

                            }

                            break;

                        case 'ControlActiveTime':
                            data[element.dataset.name]["NotAlwaysActive"] = false;
                            data[element.dataset.name]["Intervals"] = null;
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


                            let DurationHours = $$('#add-new-jackpot-time-interval-include-conditions-wrapper').getElementsByClassName('timepicker')[0].children[0];
                            let DurationMinutes = $$('#add-new-jackpot-time-interval-include-conditions-wrapper').getElementsByClassName('timepicker')[0].children[1];
                            data[element.dataset.name]["Duration"] = `${DurationHours.getValue().slice(0, 2)}:${DurationMinutes.getValue().slice(0, 2)}`;

                            data[element.dataset.name]["LinearFunction"] = $$('#add-new-jackpot-time-interval-chart').get()
                            data[element.dataset.name]["ChangeBackground"] = checkboxChangeState.getCheckboxState($$('#add-new-jackpot-control-active-time-settings-jackpot-active-background-checkbox'));
                            data[element.dataset.name]["Background"] = $$('#add-new-jackpot-control-active-time-settings-jackpot-active-background-dropdown').children[1].get();
                            let LogicFunctionSelected = $$('#add-new-jackpot-time-interval-include-conditions-dropdown').children[1].get();
                            data[element.dataset.name]["LogicFunctionSelected"] = LogicFunctionSelected === 'null' ? 0 : LogicFunctionSelected;
                            data[element.dataset.name]["ControlNumOfActiveMachines"] = getInputValueByType($$('#jackpot-condition-number-of-machines'))
                            data[element.dataset.name]["MaxNumOfActiveJackpots"] = getInputValueByType($$('#jackpot-condition-maximum-number-of-jackpot-activations'))
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
                                            message: localization.translateMessage('Nisi izabrao uslove'),
                                            type: notifications.messageTypes.error,
                                        });
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

                            data[element.dataset.name]["IntervalLogicFunction"] = checkboxChangeState.getRadioState($$('#winning-conditions-added-by-custom-radio-buttons'));
                            data[element.dataset.name]["MultiWinnersId"] = $$('#add-new-jackpot-control-active-time-settings-jackpot-active-more-jackpot-winners-dropdown').children[1].get();
                            break;

                        case 'DontParticipateAllMachines':

                            break;

                        default:
                            for (let input of element.children[1].getElementsByClassName('element-form-data')) {
                                if (input.classList.contains('default-select')) {
                                    data[element.dataset.name][input.children[0].dataset.name] = input.get();

                                } else {
                                    if (checkValidationField(input.parentNode)) {
                                        data[element.dataset.name][input.name ? input.name : input.dataset.name] = getInputValueByType(input);
                                    }
                                }
                            }
                    }


                    // if (element.dataset.name === "GrowthPattern") {
                    //     if (patternActive && patternActive.dataset.value !== 'jackpot-grows-discreetly') {
                    //         for (let input of $$(`#${patternActive.dataset.value}`).getElementsByClassName('element-form-data')) {
                    //             if (input.dataset.type !== 'radio') {
                    //                 checkValidationField(input.parentNode);
                    //             }
                    //         }

                    //     }
                    //     data[element.dataset.name]['AutomaticValue'] = $$('#jackpot-growth-pattern-tabs').children[0].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-automatically-content').children[0], 'AutomaticValue') : 0;
                    //     data[element.dataset.name]['TimeInDays'] = $$('#jackpot-growth-pattern-tabs').children[0].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-automatically-content').children[0], 'TimeInDays') : 0;
                    //     data[element.dataset.name]['AutomaticHiddenPercent'] = $$('#jackpot-growth-pattern-tabs').children[0].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-automatically-content').children[0], 'AutomaticHiddenPercent') : 0;
                    //     //todo ovde niz za dayIntervals 
                    //     data[element.dataset.name]['DayIntervals'] = [];
                    //     //todo ovde niz za HourIntervals
                    //     data[element.dataset.name]['HourIntervals'] = [];
                    //     if ($$('#jackpot-control-growth-period').getElementsByClassName('tab-active')[0].dataset.name === 'days') {
                    //         for (let day of $$('#add-new-jackpot-growth-pattern-by-day').getElementsByClassName('grid-3-columns')) {
                    //             let object = {}
                    //             object[day.children[0].children[0].name] = findInputElementWithName(day, day.children[0].children[0].name);
                    //             object[day.children[1].children[0].name] = findInputElementWithName(day, day.children[0].children[0].name);
                    //             data[element.dataset.name]['DayIntervals'].push(object)
                    //         }
                    //     } else {
                    //         for (let hour of $$('#add-new-jackpot-growth-pattern-by-hours').getElementsByClassName('grid-3-columns')) {
                    //             let object = {}
                    //             object[hour.children[0].children[0].name] = findInputElementWithName(hour, hour.children[0].children[0].name);
                    //             object[hour.children[1].children[0].name] = findInputElementWithName(hour, hour.children[0].children[0].name);
                    //             data[element.dataset.name]['HourIntervals'].push(object)
                    //         }
                    //     }
                    //     data[element.dataset.name]['MinBetForLoading'] = $$('#jackpot-growth-pattern-tabs').children[1].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-by-bet'), 'MinBetForLoading') : 0;
                    //     data[element.dataset.name]['MaxBetForLoading'] = $$('#jackpot-growth-pattern-tabs').children[1].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-by-bet'), 'MaxBetForLoading') : 0;
                    //     data[element.dataset.name]['Percent'] = $$('#jackpot-growth-pattern-tabs').children[1].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-by-bet'), 'Percent') : 0;
                    //     data[element.dataset.name]['HiddenPercent'] = $$('#jackpot-growth-pattern-tabs').children[1].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-by-bet'), 'HiddenPercent') : 0;
                    //     data[element.dataset.name]['SelectedMachineForBetLoadingIDs'] = $$('#jackpot-growth-pattern-tabs').children[1].classList.contains('pattern-active') ? [] : [];
                    //     let discreeteType = checkboxChangeState.getRadioState($$('#jackpot-grows-discreetly-radio-buttons'));
                    //     data[element.dataset.name]['DiscreeteType'] = discreeteType ? discreeteType : 0;
                    //     //leveli deca iz rain-jackpot-exist-wrapper svako dete ima settings gde mu se nalaze podaci za kreiranje levela
                    //     data[element.dataset.name]['Levels'] = [];

                    //     if ($$('#tournament-jackpot-exist-wrapper').children.length > 0) {
                    //         for (let level of $$('#tournament-jackpot-exist-wrapper').children) {
                    //             let object = {}
                    //             object.Name = level.settings.LevelName;
                    //             object.Value = level.settings.LevelValue;
                    //             object.Formula = {
                    //                 "_Exspressions": {
                    //                     "Counter": level.settings.LevelOutcome.id,
                    //                     "JPId": level.settings.LevelOutcome.id === '2' ? 1 : null,
                    //                     "Type": level.settings.CountTypeList,
                    //                     "OperatorType": level.settings.Operator.id,
                    //                     "Number": level.settings.Value
                    //                 },
                    //                 "_Condition": 0
                    //             }
                    //             data[element.dataset.name]['Levels'].push(object);
                    //         }
                    //     }

                    //     data[element.dataset.name]['SelectedMachineForDiscreteLoadingIDs'] = $$('#jackpot-growth-pattern-tabs').children[2].classList.contains('pattern-active') ? [] : [];

                    //     let hasValueLimit = checkboxChangeState.getSwitchState($$('#jackpot-growth-pattern-value-limit-checkbox').parentNode);
                    //     data[element.dataset.name]['HasMinMaxLimit'] = hasValueLimit;
                    //     data[element.dataset.name]['MinMaxStateId'] = hasValueLimit ? $$('#jackpot-growth-pattern-after-reaching-max').children[1].get() : "null"
                    //     data[element.dataset.name]['MinValueLimit'] = hasValueLimit ? findInputElementWithName($$('#jackpot-grow-pattern-value-limit').children[0], 'MinValueLimit') : 0;
                    //     data[element.dataset.name]['MaxValueLimit'] = hasValueLimit ? findInputElementWithName($$('#jackpot-grow-pattern-value-limit').children[0], 'MaxValueLimit') : 0;
                    //     data[element.dataset.name]['MinMaxFunction'] = hasValueLimit ? $$('#jackpot-growth-pattern-grows-by-bet-chart').get() : [];
                    // }
                    // else {
                    //     for (let input of element.children[1].getElementsByClassName('element-form-data')) {
                    //         if (input.classList.contains('default-select')) {
                    //             data[element.dataset.name][input.children[0].name ? input.children[0].name : input.children[0].dataset.name] = input.get();

                    //         } else {
                    //             if (input.dataset.type !== 'radio') {
                    //                 checkValidationField(input.parentNode)
                    //             }
                    //             data[element.dataset.name][input.name ? input.name : input.dataset.name] = getInputValueByType(input);
                    //         }

                    //     }
                    // }
                }
            }

            console.log(data)
            // if (data.IsGrowing || data.HasControlActiveTime) {

            //     if (data.HasControlActiveTime) {

            // if ($$('#add-new-jackpot-wrapper').getElementsByClassName('vertex-error-container').length === 0) {

            //trigger(communication.events.jackpots.saveJackpot, { data });
            // } else {
            //     trigger('notifications/show', {
            //         message: localization.translateMessage('imas nepopunjena polja'),
            //         type: notifications.messageTypes.error,
            //     });
            // }
            //     }
            //     else {
            //         if (data.GrowthType) {
            //             trigger(communication.events.jackpots.saveJackpot, { data });
            //         }
            //         else {
            //             trigger(communication.events.jackpots.saveJackpot, { data });
            //             trigger('notifications/show', {
            //                 message: localization.translateMessage('nije odabran nijedan tab iz growth pattern'),
            //                 type: notifications.messageTypes.error,
            //             });
            //         }
            //     }
            // }

            // else {
            //     trigger(communication.events.jackpots.saveJackpot, { data });
            //     trigger('notifications/show', {
            //         message: localization.translateMessage('nisu aktivni ni growth ni active time'),
            //         type: notifications.messageTypes.error,
            //     });
            // }
        }
    });

    function isPeriodValid(wrapper) {

        let activePeriod = wrapper.getElementsByClassName('tab-active')[0];

        let valid = false;

        let dayCounter = 0;
        let percentCounter = 0;
        let hoursCounter = 0;

        for (let inputElement of $$(`#${activePeriod.dataset.value}`).getElementsByClassName('element-form-data')) {
            if (inputElement.name == 'NumOfDays') {
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

            if (dayCounter === 5 && percentCounter === 100) {
                console.log('validno je')
                valid = true
            } else {
                console.log('NEVALIDNO')
                valid = false
            }

            console.log(dayCounter);
            console.log(percentCounter);
        } else {

            if (hoursCounter === 24 && percentCounter === 100) {
                console.log('validno je')
                valid = true;
            } else {
                console.log('NEVALIDNO')
                valid = false;
            }
            console.log(hoursCounter);
            console.log(percentCounter);

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

    removeAllMachines.addEventListener('click', function () {
        alert('Remove all machines');
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

        let ddCounterWinnerConditionList = $$('#proba1');
        let ddCountTypeWinnerConditionList = $$('#proba2');
        let ddOperatorWinnerConditionList = $$('#proba3');
        let ddJackpotWinnerConditionList = $$('#proba4');


        dropdown.generate({ values: data.JackpotList, parent: ddDeactivateWithGrow, type: 'single', name: 'SelectedBlockJackpotDisableWithLoadingIds' });
        dropdown.generate({ values: data.JackpotList, parent: ddDeactivateStopGrow, type: 'single', name: 'SelectedBlockJackpotDisableWithoutLoadingIds' });
        dropdown.generate({ values: data.JackpotList, parent: ddHideWithGrow, type: 'single', name: 'SelectedBlockJackpotHIdeWithLoadingIds' });
        dropdown.generate({ values: data.JackpotList, parent: ddHideStopGrow, type: 'single', name: 'SelectedBlockJackpotHIdeWithoutLoadingIds' });
        dropdown.generate({ values: data.NewJackpotStateList, parent: ddNewJackpots, type: 'single', name: 'NewJackpotOptionId' });
        dropdown.generate({ values: data.MinMaxState, parent: ddAfterReachingMax, name: 'MinMaxStateId' });
        dropdown.generate({ values: data.JackpotList, parent: ddRainJackpot, name: "JackpotList" });

        dropdown.generate({ values: data.CounterLevelList, parent: ddTournamentLevelOutcome, name: "LevelOutcome" });
        bindOptionsGroup(ddTournamentLevelOutcome);

        dropdown.generate({ values: data.CounterLevelList, parent: ddCustomLevelOutcome, name: "LevelOutcome" });
        bindOptionsGroup(ddCustomLevelOutcome);

        dropdown.generate({ values: data.CountTypeLevelList, parent: ddCustomCountTypeList, name: "CountTypeList" });
        dropdown.generate({ values: data.JackpotList, parent: ddTournamentJackpot, name: "JackpotList" });
        dropdown.generate({ values: data.JackpotList, parent: ddCustomJackpot, name: "JackpotList" });
        dropdown.generate({ values: data.OperatorLevelList, parent: ddTournamentOperators, name: "Operator" });
        dropdown.generate({ values: data.OperatorLevelList, parent: ddRainOperators, name: "Operator" });
        dropdown.generate({ values: data.OperatorLevelList, parent: ddCustomOperators, name: "Operator" });

        dropdown.generate({ values: data.LogicFunction, parent: ddControlActiveTimeIncludeConditions, name: "LogicFunction" });

        dropdown.generate({ values: data.JackpotBackgroundList, parent: ddControlActiveTimeSettingsBackground, name: "JackpotBackgroundList" });
        dropdown.generate({ values: data.IntervalStatus, parent: ddControlActiveTimeSettingsAfterJackpotWin, name: "IntervalStatus" });
        dropdown.generate({ values: data.MultiWinners, parent: ddControlActiveTimeSettingsMoreJackpotWinners, name: "MultiWinners" });


        dropdown.generate({ values: data.CounterWinnerConditionList, parent: ddCounterWinnerConditionList, name: "CounterWinnerConditionList" });
        dropdown.generate({ values: data.CountTypeWinnerConditionList, parent: ddCountTypeWinnerConditionList, name: "CountTypeWinnerConditionList" });
        dropdown.generate({ values: data.OperatorWinnerConditionList, parent: ddOperatorWinnerConditionList, name: "OperatorWinnerConditionList" });
        bindOptionsGroup(ddCounterWinnerConditionList);
        dropdown.generate({ values: data.JackpotList, parent: ddJackpotWinnerConditionList, name: "JackpotList" });

        //todo postavljanje realnog broja masina
        for (let wrapper of newAndEditJackpotWrapper.getElementsByClassName('showing-participating-machines')) {
            wrapper.innerHTML = `0/${newAndEditJackpotWrapper.settings.MachineList.Items.length}`;
        }

    }

    function bindOptionsGroup(dropdown) {
        for (let option of dropdown.children[1].children[1].children) {
            option.addEventListener('click', function () {
                if (option.dataset.id === '2') {
                    $$(`#${dropdown.dataset.value}`).classList.remove('not-clickable');
                } else {
                    $$(`#${dropdown.dataset.value}`).classList.add('not-clickable');
                }
            });
        }
    }

    return {
        fillAdvanceSettings,
        reset

    }

})();