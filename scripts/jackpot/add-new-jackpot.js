const addNewJackpot = (function () {
    let addNewJackpotControlSettings = $$('.add-new-jackpot-control-settings');
    let addNewJackpotControlSettingsInfo = $$('.add-new-jackpot-control-settings-info');
    let removeAllMachines = $$('#add-new-jackpot-choose-machines-buttons').children[1];
    let saveNewJackpot = $$("#add-new-jackpot-content-buttons-wrapper").children[0].children[1];
    let clearAllFields = $$("#add-new-jackpot-content-buttons-wrapper").children[0].children[0];

    checkboxChangeState.radioClick($$('#add-new-jackpot-content-inputs-radio'));

    for (let input of $$('#add-new-jackpot-content-inputs').getElementsByTagName('input')) {
        validation.init(input, {});
        if (input.dataset.type === 'float') {
            currencyInput.generate(input, {});
        }
    }

    saveNewJackpot.addEventListener('click', function (e) {
        if (checkValidationField($$(`#${e.target.dataset.value}`))) {
            if (checkboxChangeState.getSwitchState($$("#jackpot-content-growth-pattern-toggle").parentNode) || checkboxChangeState.getSwitchState($$("#jackpot-control-active-time-toggle").parentNode)) {
                alert("save new jackpot");
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
        let ddCustomJackpot = $$("#custom-dropdown-jackpot")

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