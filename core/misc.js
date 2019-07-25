let blackArea = $$('#black-area');
if (typeof blackArea !== 'undefined' && blackArea !== null) {
    $$('#black-area').addEventListener('click', function () {
        trigger('show/app');
    });
}

// tab listener
let tabs = $$('.tabs');
window.addEventListener('load', function () {
    setTabListener();
});

function setTabListener() {
    for (let tab of tabs) {
        tab.onclick = function () {
            selectTab(tab.id);
            selectInfoContent(tab.id);
        }
    }
}

// highlight chosen tab
let previousTabSelected;

function selectTab(name) {
    if (previousTabSelected) {
        previousTabSelected.classList.remove('tab-active');
    }
    let tabSelected = $$(`#${name}`);
    if (tabSelected) {
        tabSelected.classList.add('tab-active');
        previousTabSelected = tabSelected;
        if (tabSelected.dataset && tabSelected.dataset.route) {
            trigger(tabSelected.dataset.route)
        }
    }
}

//shows content for selected tab
let previousInfoContSelected;

function selectInfoContent(name) {
    if (previousInfoContSelected) {
        previousInfoContSelected.classList.remove('active-content');
        previousInfoContSelected.classList.add('hidden');

    }
    let infoContSelected = $$(`#${name}-info`);
    if (infoContSelected) {
        infoContSelected.classList.remove('hidden');
        infoContSelected.classList.add('active-content');
        previousInfoContSelected = infoContSelected;
    }
}

// custom date 
on('apply-custom-date', function (data) {
    let dateFrom = $$(`#datepicker-from-${data.selectId}`).value;
    let timeFromHour = $$(`#time-from-${data.selectId}`).children[1].children[0].children[0].dataset.value.slice(0, 2);
    let timeFromMinutes = $$(`#time-from-${data.selectId}`).children[1].children[1].children[0].dataset.value.slice(0, 2);

    let dateTo = $$(`#datepicker-to-${data.selectId}`).value;
    let timeToHour = $$(`#time-to-${data.selectId}`).children[1].children[0].children[0].dataset.value.slice(0, 2);
    let timeToMinutes = $$(`#time-to-${data.selectId}`).children[1].children[1].children[0].dataset.value.slice(0, 2);

    let tempArray = [dateFrom, `${timeFromHour}:${timeFromMinutes}`, dateTo, `${timeToHour}:${timeToMinutes}`];
    if (timeFromHour === '-' || timeFromMinutes === '-' || timeToHour === '-' || timeToMinutes === '-') {
        alert('Wrong parameters, please check parameters.');
        delete data.target.dataset.value;
    }
    else {
        $$(`#ds-${data.selectId}`).children[0].children[0].innerHTML = 'Custom';
        $$(`#ds-${data.selectId}`).children[0].title = `From: ${tempArray[0]} ${tempArray[1]}:00, To: ${tempArray[2]} ${tempArray[3]}:00`;
        $$(`#ds-${data.selectId}`).children[0].dataset.value = `${tempArray[0]}T${tempArray[1]}:00, ${tempArray[2]}T${tempArray[3]}:00`;
        data.target.dataset.value = 'Apply custom date'
    }
});

on('cancel-custom-date', function (data) {
    $$(`#datepicker-from-${data.selectId}`).setToday();
    let timeFromHour = $$(`#time-from-${data.selectId}`).children[1].children[0];
    timeFromHour.reset();
    let timeFromMinutes = $$(`#time-from-${data.selectId}`).children[1].children[1];
    timeFromMinutes.reset();
    let timeToHour = $$(`#time-to-${data.selectId}`).children[1].children[0];
    timeToHour.reset();
    let timeToMinutes = $$(`#time-to-${data.selectId}`).children[1].children[1];
    timeToMinutes.reset();
    $$(`#datepicker-to-${data.selectId}`).setToday();
});

function openCloseArrow(div) {
    div.children[1].classList.toggle('opened-arrow')
}

on('opened-arrow', function (data) {
    openCloseArrow(data.div)
})

//popups
function dimissPopUp(target) {
    if (target === undefined || target === null) {
        return false;
    }
    let popup = target.closest('.element-pop-up');
    if (popup !== undefined && popup !== null) {
        popup.parentNode.removeChild(popup);
    }
}

function checkValidationField(wrapper) {
    let inputElements = wrapper.getElementsByClassName('element-form-data')
    let valid = true;
    for (let input of inputElements) {
        if (input.vertexValidation !== undefined) {
            valid = input.vertexValidation.validate() && valid;
        }
    }
    return valid;
}

function generateMachinesForChoosing(allM, wrapper) {
    let searchUnselected = $$('#choose-machines-jackpot-content-unselected-machines').getElementsByClassName('choose-machines-jackpot-search')[0].children[0];
    let searchSelected = $$('#choose-machines-jackpot-content-selected-machines').getElementsByClassName('choose-machines-jackpot-search')[0].children[0];

    searchUnselected.addEventListener('keyup', function (event) {
        searchMachine(unselectedMachineItems.Items, searchUnselected.value, unselectedMachineTableSelector)
    });
    // let copyOfAllMachineItems = JSON.parse(JSON.stringify(allM));


    //todo masine koje su izabrane
    let chosenUnselectedMachinesArrayId = []
    let chosenSelectedMachinesArrayId = []

    let unselectedMachineItems = {};
    unselectedMachineItems.ItemValue = {}
    unselectedMachineItems.ItemValue.SortDirection = 2;
    unselectedMachineItems.ItemValue.SortedBy = "CasinoName"

    let selectedMachineItems = {};
    selectedMachineItems.ItemValue = {}
    selectedMachineItems.ItemValue.SortDirection = 2;
    selectedMachineItems.ItemValue.SortedBy = "CasinoName"

    let unselectedMachinesContent = $$('#choose-machines-jackpot-content-unselected-machines-list');
    let selectedMachineContent = $$('#choose-machines-jackpot-content-selected-machines-list');
    // unselectedMachinesContent.settings = unselectedMachineItems;

    const unselectedMachineTableId = 'table-container-unselected-machines';
    const unselectedMachineTableSelector = '#table-container-unselected-machines';
    let unselectedMachineTable;

    const selectedMachineTableId = 'table-container-selected-machines';
    const selectedMachineTableSelector = '#table-container-selected-machines';
    let selectedMachineTable;

    //sortiranje niza 
    function sortArray(array, sortName, order) {
        array.sort(function (a, b) {
            var nameA = a.EntryData[sortName].toUpperCase(); // ignore upper and lowercase
            var nameB = b.EntryData[sortName].toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                if (order === 1) {
                    return -1;
                }
                else {
                    return 1
                }
            }
            if (nameA > nameB) {

                if (order === 1) {
                    return 1;
                }
                else {
                    return -1
                }
            }

            // names must be equal
            return 0;
        });
        return array
    }

    if (wrapper.settings && wrapper.settings.selectedMachinesArrayID && wrapper.settings.selectedMachinesArrayID.length !== 0) {
        unselectedMachineItems.Items = JSON.parse(JSON.stringify(allM.Items));
        selectedMachineItems.Items = []

        for (let machineId of wrapper.settings.selectedMachinesArrayID) {
            for (let numb in unselectedMachineItems.Items) {
                if (machineId === unselectedMachineItems.Items[numb].Properties.Gmcid) {
                    let foundMachine = unselectedMachineItems.Items.splice(parseInt(numb), 1);
                    selectedMachineItems.Items.push(foundMachine[0])
                    break;
                }
            }
        }
        $$(`#${unselectedMachineTableId}`).update(unselectedMachineItems);
        $$(`#${selectedMachineTableId}`).update(selectedMachineItems);

    } else {
        unselectedMachineItems.Items = JSON.parse(JSON.stringify(allM.Items));
        selectedMachineItems.Items = []
    }

    //search casions in cities
    function searchMachine(data, termin, tableId) {
        let i = 0;
        let arrayResult = [];
        for (let machine of data) {
            let machineName = machine.EntryData.MachineName.toLowerCase();
            let casinoName = machine.EntryData.CasinoName.toLowerCase();
            let index = machineName.indexOf(termin);
            let index1 = machineName.indexOf(` ${termin}`);
            let index2 = casinoName.indexOf(termin);
            let index3 = casinoName.indexOf(` ${termin}`)
            if (index === 0 ||
                index1 !== -1 ||
                index2 === 0 ||
                index3 !== -1) {
                arrayResult[i] = machine;
                i++;
            }
        }
        let newObject = {
            'Items': arrayResult
        }
        $$(tableId).update(newObject);

        for (let row of $$(tableId).querySelectorAll('.table-item')) {
            for (let chosenMachineId of chosenUnselectedMachinesArrayId) {
                if (row.additionalData.Properties.Gmcid === chosenMachineId) {
                    row.classList.toggle('machine-is-selected')
                    break;
                }
            }
        }

    }

    // neselektovane masine
    if (unselectedMachinesContent.children.length !== 0) {
        unselectedMachinesContent.innerHTML = ''
        $$('#choose-machines-jackpot-content-unselected-machines').getElementsByClassName('secundarybutton')[0].innerHTML = localization.translateMessage("AddSelected");
    }

    unselectedMachineItems.Items = sortArray(unselectedMachineItems.Items, unselectedMachineItems.ItemValue.SortedBy, unselectedMachineItems.ItemValue.SortDirection);
    unselectedMachineTable = table.init({
        id: unselectedMachineTableId,
    },
        unselectedMachineItems);
    unselectedMachinesContent.appendChild(unselectedMachineTable);

    //selektovane masine
    if (selectedMachineContent.children.length !== 0) {
        selectedMachineContent.innerHTML = ''
    }

    selectedMachineItems.Items = sortArray(selectedMachineItems.Items, selectedMachineItems.ItemValue.SortedBy, selectedMachineItems.ItemValue.SortDirection)
    selectedMachineTable = table.init({
        id: selectedMachineTableId,
    },
        selectedMachineItems);
    selectedMachineContent.appendChild(selectedMachineTable);

    //row click - unselected table
    on(table.events.rowClick(unselectedMachineTableId), function (params) {
        let className = params.row + params.rowId;
        for (let row of unselectedMachineTable.getElementsByClassName(className)) {
            row.classList.toggle('machine-is-selected')
        }

        let machineIsClicked = $$(unselectedMachineTableSelector).getElementsByClassName(className)[0];
        if (chosenUnselectedMachinesArrayId.length === 0) {
            chosenUnselectedMachinesArrayId.push(machineIsClicked.additionalData.Properties.Gmcid)
        } else {
            if (!chosenUnselectedMachinesArrayId.includes(machineIsClicked.additionalData.Properties.Gmcid)) {
                chosenUnselectedMachinesArrayId.push(machineIsClicked.additionalData.Properties.Gmcid)
            } else {
                let index = chosenUnselectedMachinesArrayId.indexOf(machineIsClicked.additionalData.Properties.Gmcid)
                chosenUnselectedMachinesArrayId.splice(index, 1);
            }
        }
        //let numberOfUnselected = unselectedMachineTable.querySelectorAll('.column-casino-name.machine-is-selected').length;
        $$('#choose-machines-jackpot-content-unselected-machines').getElementsByClassName('secundarybutton')[0].innerHTML = `${localization.translateMessage("AddSelected")} ${chosenUnselectedMachinesArrayId.length !== 0 ? `(${chosenUnselectedMachinesArrayId.length})` : ''}`;
    });

    //row click - selected table
    on(table.events.rowClick(selectedMachineTableId), function (params) {
        let className = params.row + params.rowId;
        for (let row of selectedMachineTable.getElementsByClassName(className)) {
            row.classList.toggle('machine-is-selected')
        }

        let machineIsClicked = $$(selectedMachineTableSelector).getElementsByClassName(className)[0];
        if (chosenSelectedMachinesArrayId.length === 0) {
            chosenSelectedMachinesArrayId.push(machineIsClicked.additionalData.Properties.Gmcid)
        } else {
            if (!chosenSelectedMachinesArrayId.includes(machineIsClicked.additionalData.Properties.Gmcid)) {
                chosenSelectedMachinesArrayId.push(machineIsClicked.additionalData.Properties.Gmcid)
            } else {
                let index = chosenSelectedMachinesArrayId.indexOf(machineIsClicked.additionalData.Properties.Gmcid)
                chosenSelectedMachinesArrayId.splice(index, 1);
            }
        }

        //let numberOfSelected = selectedMachineTable.querySelectorAll('.column-casino-name.machine-is-selected').length;
        $$('#choose-machines-jackpot-content-selected-machines').getElementsByClassName('secundarybutton')[0].innerHTML = `${localization.translateMessage("RemoveSelected")} ${chosenSelectedMachinesArrayId.length !== 0 ? `(${chosenSelectedMachinesArrayId.length})` : ''}`;
    });
    // prebacivanje masina iz unselected u selected
    $$('#choose-machines-jackpot-content-unselected-machines').getElementsByClassName('secundarybutton')[0].onclick = function (params) {
        //let chosenMachines = unselectedMachineTable.querySelectorAll('.column-casino-name.machine-is-selected');
        for (let machineId of chosenUnselectedMachinesArrayId) {
            for (let numb in unselectedMachineItems.Items) {
                if (machineId === unselectedMachineItems.Items[numb].Properties.Gmcid) {
                    let foundMachine = unselectedMachineItems.Items.splice(parseInt(numb), 1);
                    selectedMachineItems.Items.push(foundMachine[0])
                    break;
                }
            }
        }
        $$(`#${unselectedMachineTableId}`).update(unselectedMachineItems);

        selectedMachineItems.Items = sortArray(selectedMachineItems.Items, selectedMachineItems.ItemValue.SortedBy, selectedMachineItems.ItemValue.SortDirection);
        $$(`#${selectedMachineTableId}`).update(selectedMachineItems);
        searchUnselected.value = ''
        chosenUnselectedMachinesArrayId = [];
        $$('#choose-machines-jackpot-content-unselected-machines').getElementsByClassName('secundarybutton')[0].innerHTML = localization.translateMessage("AddSelected");
    }
    // prebacivanje masina iz selected u unselected
    $$('#choose-machines-jackpot-content-selected-machines').getElementsByClassName('secundarybutton')[0].onclick = function (params) {
        //let chosenMachines = selectedMachineTable.querySelectorAll('.column-casino-name.machine-is-selected');
        for (let machineId of chosenSelectedMachinesArrayId) {
            for (let numb in selectedMachineItems.Items) {
                if (machineId === selectedMachineItems.Items[numb].Properties.Gmcid) {
                    let foundMachine = selectedMachineItems.Items.splice(parseInt(numb), 1);
                    unselectedMachineItems.Items.push(foundMachine[0])
                    break;
                }
            }
        }
        $$(`#${selectedMachineTableId}`).update(selectedMachineItems);
        unselectedMachineItems.Items = sortArray(unselectedMachineItems.Items, unselectedMachineItems.ItemValue.SortedBy, unselectedMachineItems.ItemValue.SortDirection);
        $$(`#${unselectedMachineTableId}`).update(unselectedMachineItems);
        searchSelected.value = ''
        chosenSelectedMachinesArrayId = []
        $$('#choose-machines-jackpot-content-selected-machines').getElementsByClassName('secundarybutton')[0].innerHTML = localization.translateMessage("RemoveSelected");
    }

    //todo sortiranje tabele neselektovanih
    on(table.events.sort(unselectedMachineTableId), function () {
        let filters = {}
        filters = $$(unselectedMachineTableSelector).getFilters(filters);
        unselectedMachineItems.ItemValue.SortDirection = filters.BasicData.SortOrder;
        unselectedMachineItems.ItemValue.SortedBy = filters.BasicData.SortName;
        let newArray = sortArray(unselectedMachineItems.Items, filters.BasicData.SortName, filters.BasicData.SortOrder)
        unselectedMachineItems.Items = newArray
        $$(`#${unselectedMachineTableId}`).update(unselectedMachineItems);
        // trigger(events.filterTable);
    });

    //todo sortiranje tabele selektovanih
    on(table.events.sort(selectedMachineTableId), function () {
        let filters = {}
        filters = $$(selectedMachineTableSelector).getFilters(filters);
        selectedMachineItems.ItemValue.SortDirection = filters.BasicData.SortOrder;
        selectedMachineItems.ItemValue.SortedBy = filters.BasicData.SortName;
        let newArray = sortArray(selectedMachineItems.Items, filters.BasicData.SortName, filters.BasicData.SortOrder);
        selectedMachineItems.Items = newArray;
        $$(`#${selectedMachineTableId}`).update(selectedMachineItems);
        // trigger(events.filterTable);
    });


    let chooseMachineJackpotSaveButton = $$('#choose-machines-jackpot-buttons').children[0].children[1];
    chooseMachineJackpotSaveButton.onclick = function () {
        let selectedMachinesArrayID = []
        for (let machineId of $$(selectedMachineTableSelector).querySelectorAll('.table-item.column-casino-name')) {
            selectedMachinesArrayID.push(machineId.additionalData.Properties.Gmcid)
        }
        wrapper.settings = {}
        wrapper.settings.selectedMachinesArrayID = selectedMachinesArrayID;
        wrapper.getElementsByClassName('showing-participating-machines')[0].innerHTML = `${selectedMachinesArrayID.length}/${allM.Items.length}`
        jackpotChooseParticipatingMachines.showHideChooseMachine.hide();
    };
}
