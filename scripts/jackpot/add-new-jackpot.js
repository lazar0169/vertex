const addNewJackpot = (function () {
    let addNewJackpotControlSettings = $$('.add-new-jackpot-control-settings');
    let addNewJackpotControlSettingsInfo = $$('.add-new-jackpot-control-settings-info');
    let removeAllMachines = $$('#add-new-jackpot-choose-machines-buttons').children[1];
    let saveNewJackpot = $$("#add-new-jackpot-content-buttons-wrapper").children[0].children[1];
    let clearAllFields = $$("#add-new-jackpot-content-buttons-wrapper").children[0].children[0];

    checkboxChangeState.radioClick($$('#add-new-jackpot-content-inputs-radio'));

    //validacija growth pattern polja

    for (let input of $$('#add-new-jackpot-wrapper').getElementsByClassName('element-form-data')) {
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

            // if (checkboxChangeState.getSwitchState($$("#jackpot-content-growth-pattern-toggle").parentNode) && $$('#jackpot-growth-pattern-tabs').getElementsByClassName('pattern-active')[0]
            //     || checkboxChangeState.getSwitchState($$("#jackpot-control-active-time-toggle").parentNode) && $$('#add-new-jackpot-time-interval-added-by-dropdown').children.length !== 0) {

            //     alert("save new jackpot");

            // }else{
            //     trigger('notifications/show', {
            //         message: localization.translateMessage('neki je aktivan ali unutar nije nista izabrano'),
            //         type: notifications.messageTypes.error,
            //     });
            // }

            // && $$('#jackpot-growth-pattern-tabs').getElementsByClassName('pattern-active')[0]

            // for (let jackpotContent of $$('#add-new-jackpot-wrapper').getElementsByClassName('checked-add-new-jackpot-settings')) {
            //     if (checkboxChangeState.getSwitchState(jackpotContent))
            //         checkValidationField(jackpotContent.parentNode.children[1])
            // }

            // if (checkboxChangeState.getSwitchState($$("#jackpot-content-growth-pattern-toggle").parentNode) && $$('#jackpot-growth-pattern-tabs').getElementsByClassName('pattern-active')[0]) {
            //     let patternActive = $$('#jackpot-growth-pattern-tabs').getElementsByClassName('pattern-active')[0];
            //     checkValidationField($$(`#${patternActive.dataset.value}`))
            // } else {

            // }

            // if (checkboxChangeState.getSwitchState($$("#jackpot-content-growth-pattern-toggle").parentNode)) {
            //     console.log()
            //     alert("save new jackpot");
            // }
            // else {
            //     alert("izaberi patern");
            // }

            let data = {};
            data.EndpointId = $$('#page-jackpots').settings.EndpointId;
            for (let input of $$('#add-new-jackpot-content-inputs-wrapper').getElementsByClassName('element-form-data')) {
                data[input.name ? input.name : input.dataset.name] = getInputValueByType(input);
            }

            let patternActive = $$('#jackpot-growth-pattern-tabs').getElementsByClassName('pattern-active')[0];
            patternActive ? data.GrowthType = patternActive.dataset.loadingtype : data.GrowthType = 0;
            data.IsLocal = $$('#add-new-jackpot-wrapper').settings.IsLocal;

            for (let element of $$('#add-new-jackpot-wrapper').getElementsByClassName('add-new-jackpot-control-settings')) {

                data[element.getElementsByClassName('form-switch')[0].children[0].name] = checkboxChangeState.getSwitchState(element);
                if (checkboxChangeState.getSwitchState(element)) {
                    data[element.dataset.name] = {}

                    if (element.dataset.name === "GrowthPattern") {

                        if (patternActive.dataset.value !== 'jackpot-grows-discreetly') {
                            for (let input of $$(`#${patternActive.dataset.value}`).getElementsByClassName('element-form-data')) {
                                if (input.dataset.type !== 'radio') {
                                    checkValidationField(input.parentNode);
                                }
                            }
                        }

                        data[element.dataset.name]['AutomaticValue'] = $$('#jackpot-growth-pattern-tabs').children[0].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-automatically-content').children[0], 'AutomaticValue') : 0;
                        data[element.dataset.name]['TimeInDays'] = $$('#jackpot-growth-pattern-tabs').children[0].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-automatically-content').children[0], 'TimeInDays') : 0;
                        data[element.dataset.name]['AutomaticHiddenPercent'] = $$('#jackpot-growth-pattern-tabs').children[0].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-automatically-content').children[0], 'AutomaticHiddenPercent') : 0;
                        //todo ovde niz za dayIntervals 
                        data[element.dataset.name]['DayIntervals'] = [];
                        //todo ovde niz za HourIntervals
                        data[element.dataset.name]['HourIntervals'] = [];
                        if ($$('#jackpot-control-growth-period').getElementsByClassName('tab-active')[0].dataset.name === 'days') {
                            for (let day of $$('#add-new-jackpot-growth-pattern-by-day').getElementsByClassName('grid-3-columns')) {
                                let object = {}
                                object[day.children[0].children[0].name] = findInputElementWithName(day, day.children[0].children[0].name);
                                object[day.children[1].children[0].name] = findInputElementWithName(day, day.children[0].children[0].name);
                                data[element.dataset.name]['DayIntervals'].push(object)
                            }
                        } else {
                            for (let hour of $$('#add-new-jackpot-growth-pattern-by-hours').getElementsByClassName('grid-3-columns')) {
                                let object = {}
                                object[hour.children[0].children[0].name] = findInputElementWithName(hour, hour.children[0].children[0].name);
                                object[hour.children[1].children[0].name] = findInputElementWithName(hour, hour.children[0].children[0].name);
                                data[element.dataset.name]['HourIntervals'].push(object)
                            }
                        }
                        data[element.dataset.name]['MinBetForLoading'] = $$('#jackpot-growth-pattern-tabs').children[1].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-by-bet'), 'MinBetForLoading') : 0;
                        data[element.dataset.name]['MaxBetForLoading'] = $$('#jackpot-growth-pattern-tabs').children[1].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-by-bet'), 'MaxBetForLoading') : 0;
                        data[element.dataset.name]['Percent'] = $$('#jackpot-growth-pattern-tabs').children[1].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-by-bet'), 'Percent') : 0;
                        data[element.dataset.name]['HiddenPercent'] = $$('#jackpot-growth-pattern-tabs').children[1].classList.contains('pattern-active') ? findInputElementWithName($$('#jackpot-grows-by-bet'), 'HiddenPercent') : 0;
                        data[element.dataset.name]['SelectedMachineForBetLoadingIDs'] = $$('#jackpot-growth-pattern-tabs').children[1].classList.contains('pattern-active') ? [] : [];
                        let discreeteType = checkboxChangeState.getRadioState($$('#jackpot-grows-discreetly-radio-buttons'));
                        data[element.dataset.name]['DiscreeteType'] = discreeteType ? discreeteType : 0;
                        //leveli deca iz rain-jackpot-exist-wrapper svako dete ima settings gde mu se nalaze podaci za kreiranje levela
                        data[element.dataset.name]['Levels'] = [];

                        if ($$('#tournament-jackpot-exist-wrapper').children.length > 0) {
                            for (let level of $$('#tournament-jackpot-exist-wrapper').children) {
                                let object = {}
                                object.Name = level.settings.LevelName;
                                object.Value = level.settings.LevelValue;
                                object.Formula = {
                                    "_Exspressions": {
                                        "Counter": level.settings.LevelOutcome.id,
                                        "JPId": level.settings.LevelOutcome.id === '2' ? 1 : null,
                                        "Type": level.settings.CountTypeList,
                                        "OperatorType": level.settings.Operator.id,
                                        "Number": level.settings.Value
                                    },
                                    "_Condition": 0
                                }
                                data[element.dataset.name]['Levels'].push(object);
                            }
                        }

                        data[element.dataset.name]['SelectedMachineForDiscreteLoadingIDs'] = $$('#jackpot-growth-pattern-tabs').children[2].classList.contains('pattern-active') ? [] : [];

                        let hasValueLimit = checkboxChangeState.getSwitchState($$('#jackpot-growth-pattern-value-limit-checkbox').parentNode);
                        data[element.dataset.name]['HasMinMaxLimit'] = hasValueLimit;
                        data[element.dataset.name]['MinMaxStateId'] = hasValueLimit ? $$('#jackpot-growth-pattern-after-reaching-max').children[1].get() : "null"
                        data[element.dataset.name]['MinValueLimit'] = hasValueLimit ? findInputElementWithName($$('#jackpot-grow-pattern-value-limit').children[0], 'MinValueLimit') : 0;
                        data[element.dataset.name]['MaxValueLimit'] = hasValueLimit ? findInputElementWithName($$('#jackpot-grow-pattern-value-limit').children[0], 'MaxValueLimit') : 0;
                        data[element.dataset.name]['MinMaxFunction'] = hasValueLimit ? $$('#jackpot-growth-pattern-grows-by-bet-chart').get() : [];
                    }
                    else {
                        for (let input of element.children[1].getElementsByClassName('element-form-data')) {
                            if (input.classList.contains('default-select')) {
                                data[element.dataset.name][input.children[0].name ? input.children[0].name : input.children[0].dataset.name] = input.get();

                            } else {
                                if (input.dataset.type !== 'radio') {
                                    checkValidationField(input.parentNode)
                                }
                                data[element.dataset.name][input.name ? input.name : input.dataset.name] = getInputValueByType(input);
                            }

                        }
                    }
                }

            }

            //     // for (let inputInPattern of element.getElementsByClassName('element-form-data')) {

            //     //     if (inputInPattern.classList.contains('default-select')) {
            //     //         data[element.dataset.name][inputInPattern.children[0].dataset.name] = inputInPattern.get();
            //     //     } else if (inputInPattern.dataset.type === 'float') {
            //     //         data[element.dataset.name][inputInPattern.name] = inputInPattern.dataset.value ? parseInt(inputInPattern.dataset.value) : 0;
            //     //     }
            //     //     else {
            //     //         data[element.dataset.name][inputInPattern.name] = inputInPattern.value;

            //     //     }

            //     // }
            // }
            // //bet limits settings
            // for (let element of $$('#add-new-jackpot-content-limit-settings').getElementsByClassName('element-form-data')) {
            //     data.BetAndWinLimit[element.name] = element.dataset.value ? parseInt(element.dataset.value) : 0;
            // }
            // //advance settings
            // for (let element of $$('#add-new-jackpot-content-advance-settings').getElementsByClassName('element-form-data')) {
            //     data.AdvancedSettings[element.children[0].dataset.name] = element.get();
            // }
            // //growth pattern
            // // automatically
            // for (let element of $$('#jackpot-grows-automatically-content').children[0].getElementsByClassName('element-form-data')) {
            //     let value = getInputValueByType(element)
            //     data.GrowthPattern[element.name ? element.name : element.dataset.name] = value ? value : 0;
            // }
            // data.GrowthPattern.DayIntervalData = [];
            // for (let element of $$('#jackpot-control-growth-period').parentNode.children) {
            //     if (element.classList.contains('grid-3-columns') && element.children[0].children[0].value && element.children[1].children[0].value) {
            //         let object = {}
            //         object[element.children[0].children[0].name] = element.children[0].children[0].value
            //         object[element.children[1].children[0].name] = element.children[1].children[0].value
            //         data.GrowthPattern.DayIntervalData.push(object)
            //     }
            // }
            // //by bet
            // for (let element of $$('#jackpot-grows-by-bet').getElementsByClassName('element-form-data')) {
            //     let value = getInputValueByType(element)
            //     data.GrowthPattern[element.name ? element.name : element.dataset.name] = value ? value : 0;
            // }

            // //custom
            // let value = checkboxChangeState.getRadioState($$('#jackpot-grows-discreetly-radio-buttons'))
            // data.GrowthPattern.DiscreeteType = value ? value : 0;
            // data.GrowthPattern.Levels = [];
            // let discreetlyRadioWrapper = $$('#jackpot-grows-discreetly-radio-buttons');
            // if (discreetlyRadioWrapper.settings && discreetlyRadioWrapper.settings.radioName && $$(`#${discreetlyRadioWrapper.settings.radioName}-jackpot-exist-wrapper`).children.length !== 0) {
            //     for (let level of $$(`#${discreetlyRadioWrapper.settings.radioName}-jackpot-exist-wrapper`).children) {
            //         console.log(level.settings)
            //     }
            // }

            console.log(data)
            if (data.IsGrowing || data.HasControlActiveTime) {
                trigger(communication.events.jackpots.saveJackpot, { data });

            }
            else {
                trigger('notifications/show', {
                    message: localization.translateMessage('nisu aktivni ni growth ni active time'),
                    type: notifications.messageTypes.error,
                });
            }
        }
    });

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
                        element.parentNode.classList.remove('expanded-add-new-jackpot-settings');
                        element.children[1].classList.remove('opened-arrow');

                    }
                    else {
                        element.parentNode.parentNode.children[1].classList.toggle('hidden');
                        element.parentNode.classList.toggle('expanded-add-new-jackpot-settings');
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
                    checkSwitch.children[0].children[1].children[0].children[1].innerHTML = 'Off';
                    checkSwitch.children[1].classList.add('hidden');
                    checkSwitch.children[0].classList.remove('expanded-add-new-jackpot-settings');
                    checkSwitch.children[0].children[1].children[1].classList.remove('opened-arrow');

                }
                else {
                    checkSwitch.getElementsByClassName('form-switch')[0].children[0].checked = true;
                    checkSwitch.children[0].children[1].children[0].children[1].innerHTML = 'On';
                    checkSwitch.children[1].classList.remove('hidden');
                    checkSwitch.children[0].classList.add('expanded-add-new-jackpot-settings');
                    checkSwitch.children[0].children[1].children[1].classList.add('opened-arrow');
                }
                for (let currentCheck of addNewJackpotControlSettings) {
                    if (checkSwitch.children[0].getElementsByClassName('form-switch')[0].children[0] !== currentCheck.getElementsByClassName('form-switch')[0].children[0] && checkSwitch.getElementsByClassName('form-switch')[0].children[0].checked) {
                        currentCheck.children[1].classList.add('hidden');
                        currentCheck.children[0].classList.remove('expanded-add-new-jackpot-settings');
                        currentCheck.children[0].children[1].children[1].classList.remove('opened-arrow');
                    }
                }
                checkSwitch.children[0].classList.toggle('checked-add-new-jackpot-settings');
                checkSwitch.children[0].children[1].children[0].children[1].classList.toggle('active-add-new-jackpot-settings')
            }
        }
    });

    on('jackpot/get-add-jackpot', function (params) {
        fillAdvanceSettings(params);
    });

    function fillAdvanceSettings(params) {
        let data = params.data.Data;
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

})();