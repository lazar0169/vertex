const addNewJackpot = (function () {
    let addNewJackpotControlSettings = $$('.add-new-jackpot-control-settings');
    let addNewJackpotControlSettingsInfo = $$('.add-new-jackpot-control-settings-info');
    let removeAllMachines = $$('#add-new-jackpot-choose-machines-buttons').children[1];
    let saveNewJackpot = $$("#add-new-jackpot-content-buttons-wrapper").children[0].children[1];
    let clearAllFields = $$("#add-new-jackpot-content-buttons-wrapper").children[0].children[0];

    saveNewJackpot.addEventListener('click', function () {
        alert('Save new Jackpot');
    });

    clearAllFields.addEventListener('click', function () {
        alert('Set all fields to initial value');
    });

    window.addEventListener('load', function () {
        for (let control of addNewJackpotControlSettingsInfo) {
            control.addEventListener('click', function () {
                for (let element of addNewJackpotControlSettingsInfo) {
                    if (control !== element) {
                        element.parentNode.parentNode.children[1].classList.add('hidden');
                        element.parentNode.classList.remove('expanded-add-new-jackpot-settings');

                    }
                    else {
                        element.parentNode.parentNode.children[1].classList.toggle('hidden');
                        element.parentNode.classList.toggle('expanded-add-new-jackpot-settings');

                    }
                }
            });
        }
        for (let checkSwitch of addNewJackpotControlSettings) {
            checkSwitch.children[0].children[0].children[0].addEventListener('click', function (e) {
                e.preventDefault();
                if (checkSwitch.children[0].children[0].children[0].children[0].checked) {
                    checkSwitch.children[0].children[0].children[0].children[0].checked = false;
                    checkSwitch.children[0].children[1].children[1].innerHTML = 'Off';
                    checkSwitch.children[1].classList.add('hidden');
                    checkSwitch.children[0].classList.remove('expanded-add-new-jackpot-settings');

                }
                else {
                    checkSwitch.children[0].children[0].children[0].children[0].checked = true;
                    checkSwitch.children[0].children[1].children[1].innerHTML = 'On';
                    checkSwitch.children[1].classList.remove('hidden');
                    checkSwitch.children[0].classList.add('expanded-add-new-jackpot-settings');

                }
                for (let currentCheck of addNewJackpotControlSettings) {
                    if (checkSwitch.children[0].children[0].children[0] !== currentCheck.children[0].children[0].children[0] && checkSwitch.children[0].children[0].children[0].children[0].checked) {
                        currentCheck.children[1].classList.add('hidden');
                        currentCheck.children[0].classList.remove('expanded-add-new-jackpot-settings');
                    }
                }
                checkSwitch.children[0].classList.toggle('checked-add-new-jackpot-settings');
                checkSwitch.children[0].children[1].children[1].classList.toggle('active-add-new-jackpot-settings')
            })
        }
    });

    removeAllMachines.addEventListener('click', function () {
        alert('Remove all machines');
    });


})();