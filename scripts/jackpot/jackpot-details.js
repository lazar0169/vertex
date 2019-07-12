const jackpotDetailsBar = (function () {
    let jackpotDetailsBarWrapper = $$('#jackpot-edit-details-wrapper');
    let jackpotMachinesListWrapper = $$('#jackpot-details-search-machines-content');
    let jackpotDetailsSearchMachine = $$('#jackpot-details-search-machines');
    let closeJackpotDetails = $$('#jackpot-close-details-bar');
    let jackpotDetailsChosenMachine = $$('#jackpot-details-chosen-machine');
    let blackArea = $$('#black-area');

    let jackpotDetailsClose = function () {
        return {
            hide: function () {
                jackpotDetailsBarWrapper.classList.add('collapse');
                blackArea.classList.remove('show');
                jackpotDetailsBarWrapper.getElementsByClassName('jackpot-details-search-machines')[0].classList.add('hidden');
            },
            show: function () {
                jackpotDetailsBarWrapper.classList.add('show');
                detailsBar.classList.remove('collapse');
            }
        };
    }();


    blackArea.addEventListener('click', function () {
        jackpotDetailsClose.hide();

    });

    //select all checkboxes in jackpot details
    $$('#jackpot-edit-details-conditions-header').children[1].onclick = function () {
        for (let checkbox of $$('#jackpot-edit-details-conditions-checkbox').children) {
            if (!checkbox.classList.contains('not-clickable')) {
                checkboxChangeState.checkboxIsChecked(checkbox.getElementsByClassName('form-checkbox')[0].children[0], true);
            }
        }
    }

    //chosen machine click
    jackpotDetailsChosenMachine.onclick = function (e) {
        e.target.parentNode.children[1].classList.toggle("hidden");
    }
    closeJackpotDetails.onclick = function (e) {
        jackpotDetailsClose.hide()
    }

    //delete jackpot
    jackpotDetailsBarWrapper.getElementsByClassName('button-wrapper jackpot-details-buttons-wrapper')[0].children[0].onclick = function () {
        let data = {}
        data.EndpointId = jackpots.getEndpointId().EndpointId;
        data.Id = jackpotDetailsBarWrapper.settings.Id;
        trigger(communication.events.jackpots.removeJackpot, data);
    }

    jackpotDetailsBarWrapper.getElementsByClassName('button-wrapper jackpot-details-buttons-wrapper')[0].children[1].onclick = function () {
        let data = {}
        data.EndpointId = jackpots.getEndpointId().EndpointId;
        data.Id = jackpotDetailsBarWrapper.settings.Id;
        data.IgnoreList = [];
        for (let checkbox of $$('#jackpot-edit-details-conditions-checkbox').children) {
            if (!checkbox.classList.contains('not-clickable') && checkboxChangeState.getCheckboxState(checkbox)) {
                data.IgnoreList.push(parseInt(checkbox.dataset.id));
            }
        }
        //todo procitati izabranu masinu iz chooseMachineForAssingJackpot
        data.SelectedMachineId = jackpotDetailsChosenMachine.settings ? jackpotDetailsChosenMachine.settings.Id : -1;
        trigger(communication.events.jackpots.setIgnoreRestrictions, data);
    }

    function generateMachinesList(data) {
        if (jackpotMachinesListWrapper.children.length !== 0) {
            jackpotMachinesListWrapper.innerHTML = '';
        }

        let fragment = document.createDocumentFragment();

        for (let casino of data) {
            if (casino.MachineList.length !== 0) {
                let casinoWrapper = document.createElement('div');
                casinoWrapper.classList.add('jackpot-details-casino-wrapper');
                let casinoNameWrapper = document.createElement('div');
                casinoNameWrapper.classList.add('jackpot-details-casino-name');
                casinoNameWrapper.innerHTML = casino.CasinoName;
                casinoWrapper.appendChild(casinoNameWrapper);
                for (let machine of casino.MachineList) {
                    let machineWrapper = document.createElement('div');
                    machineWrapper.classList.add("jackpot-details-casino-machine-name");
                    machineWrapper.settings = machine;
                    machineWrapper.innerHTML = machine.MachineName;
                    machineWrapper.onclick = function () {
                        jackpotDetailsChosenMachine.settings = machineWrapper.settings
                        jackpotDetailsChosenMachine.innerHTML = machineWrapper.innerHTML;
                        jackpotDetailsBarWrapper.getElementsByClassName('jackpot-details-search-machines')[0].classList.add('hidden');
                    }
                    casinoWrapper.appendChild(machineWrapper);
                }
                fragment.appendChild(casinoWrapper);
            }
        }
        jackpotMachinesListWrapper.appendChild(fragment);

        if (jackpotMachinesListWrapper.children.length === 0) {
            jackpotMachinesListWrapper.innerHTML = `<div class="jackpot-details-empty-machine-content">${localization.translateMessage("Data not found...")}</div>`
        }
    }

    jackpotDetailsSearchMachine.addEventListener('keyup', function (event) {
        let results;
        results = searchMachine(jackpotDetailsSearchMachine.value.toLowerCase(), jackpotDetailsBarWrapper.settings.MachineRestrictionList);
        generateMachinesList(results);
    });

    function searchMachine(termin, data) {
        let newData = [];
        // if (category) {
        //     newData[category] = searchMachine(termin, category);
        // } else {
        for (let casino in data) {
            newData[casino] = searchMachine(termin, casino);
            // }
        }
        return newData;

        function searchMachine(termin, casino) {
            let i = 0;
            let arrayResult = [];
            for (let value of data[casino].MachineList) {
                let machineName = value.MachineName.toLowerCase();
                let index = machineName.indexOf(termin);
                let index1 = machineName.indexOf(` ${termin}`)
                let casinoName = value.CasinoName.toLowerCase();
                let index2 = casinoName.indexOf(termin);
                let index3 = casinoName.indexOf(` ${termin}`)
                if (index === 0 ||
                    index1 !== -1 ||
                    index2 === 0 ||
                    index3 !== -1) {
                    arrayResult[i] = value;
                    i++;
                }
            }
            let newObject = {
                'CasinoName': data[casino].CasinoName,
                'MachineList': arrayResult
            };
            return newObject;
        }
    }
    return {
        generateMachinesList
    }

})();