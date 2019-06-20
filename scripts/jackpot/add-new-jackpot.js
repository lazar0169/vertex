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

    saveNewJackpot.addEventListener('click', function (e) {
        if (checkValidationField($$(`#${e.target.dataset.value}`))) {
            if (checkboxChangeState.getSwitchState($$("#jackpot-content-growth-pattern-toggle").parentNode) || checkboxChangeState.getSwitchState($$("#jackpot-control-active-time-toggle").parentNode)) {
                alert("save new jackpot");

                let data = {};
                for (let input of $$('#add-new-jackpot-content-inputs-wrapper').getElementsByClassName('element-form-data')) {
                    data[input.name ? input.name : input.dataset.name] = getInputValueByType(input);
                }

                let patternActive = $$('#jackpot-growth-pattern-tabs').getElementsByClassName('pattern-active')[0];
                patternActive ? data.GrowthType = patternActive.dataset.loadingtype : data.GrowthType = 0;
                data.IsLocal = $$('#add-new-jackpot-wrapper').settings.IsLocal;

                for (let element of $$('#add-new-jackpot-wrapper').getElementsByClassName('add-new-jackpot-control-settings')) {

                    data[element.getElementsByClassName('form-switch')[0].children[0].name] = checkboxChangeState.getSwitchState(element);
                    data[element.dataset.name] = {}

                    // for (let inputInPattern of element.getElementsByClassName('element-form-data')) {

                    //     if (inputInPattern.classList.contains('default-select')) {
                    //         data[element.dataset.name][inputInPattern.children[0].dataset.name] = inputInPattern.get();
                    //     } else if (inputInPattern.dataset.type === 'float') {
                    //         data[element.dataset.name][inputInPattern.name] = inputInPattern.dataset.value ? parseInt(inputInPattern.dataset.value) : 0;
                    //     }
                    //     else {
                    //         data[element.dataset.name][inputInPattern.name] = inputInPattern.value;

                    //     }

                    // }
                }
                //bet limits settings
                for (let element of $$('#add-new-jackpot-content-limit-settings').getElementsByClassName('element-form-data')) {
                    data.BetAndWinLimit[element.name] = element.dataset.value ? parseInt(element.dataset.value) : 0;
                }
                //advance settings
                for (let element of $$('#add-new-jackpot-content-advance-settings').getElementsByClassName('element-form-data')) {
                    data.AdvancedSettings[element.children[0].dataset.name] = element.get();
                }
                //growth pattern
                // automatically
                for (let element of $$('#jackpot-grows-automatically-content').children[0].getElementsByClassName('element-form-data')) {
                    let value = getInputValueByType(element)
                    data.GrowthPattern[element.name ? element.name : element.dataset.name] = value ? value : 0;
                }
                data.GrowthPattern.DayIntervalData = [];
                for (let element of $$('#jackpot-control-growth-period').parentNode.children) {
                    if (element.classList.contains('grid-3-columns') && element.children[0].children[0].value && element.children[1].children[0].value) {
                        let object = {}
                        object[element.children[0].children[0].name] = element.children[0].children[0].value
                        object[element.children[1].children[0].name] = element.children[1].children[0].value
                        data.GrowthPattern.DayIntervalData.push(object)
                    }
                }
                //by bet
                for (let element of $$('#jackpot-grows-by-bet').getElementsByClassName('element-form-data')) {
                    let value = getInputValueByType(element)
                    data.GrowthPattern[element.name ? element.name : element.dataset.name] = value ? value : 0;
                }

                //custom
                let value = checkboxChangeState.getRadioState($$('#jackpot-grows-discreetly-radio-buttons'))
                data.GrowthPattern.DiscreeteType = value ? value : 0;
                data.GrowthPattern.Levels = [];
                let discreetlyRadioWrapper = $$('#jackpot-grows-discreetly-radio-buttons');
                if (discreetlyRadioWrapper.settings && discreetlyRadioWrapper.settings.radioName && $$(`#${discreetlyRadioWrapper.settings.radioName}-jackpot-exist-wrapper`).children.lenght !== 0) {
                    for (let level of $$(`#${discreetlyRadioWrapper.settings.radioName}-jackpot-exist-wrapper`).children) {
                        console.log(level.settings)
                    }
                }

                console.log(data)
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