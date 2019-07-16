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

function generateMachinesForChoosing(allM, selectedM) {
    // //todo ovde se cuvaju sve masine
    // let allMachines = allM;
    // //todo ovde se cuvaju selektovane masine
    // let selectedMachines = selectedM;
    // for (let machine of allMachines) {
    //     let machineWrapper = document.createElement('div');
    //     machineWrapper.settings = machine;

    //     machineWrapper.innerHTML = `<label class="form-checkbox">
    //     <input type="checkbox">
    //     <icon class="form-icon" data-element-id="0"></icon>
    //     <div>BonusWinHostToMachine</div>
    //     </label>`
    // }

    let unselectedMachinesContent = $$('#choose-machines-jackpot-content-unselected-machines-list');
    let selectedMachineContent = $$('#choose-machines-jackpot-content-selected-machines-list');
    let data = {};
    data.Items = allM;
    

    const unselectedMachineTableId = 'table-container-unselected-machines';
    const unselectedMachineTableSelector = '#table-container-unselected-machines';
    let unselectedMachineTable;

    const selectedMachineTableId = 'table-container-selected-machines';
    const selectedMachineTableSelector = '#table-container-selected-machines';
    let selectedMachineTable;
    // neselektovane masine
    if (unselectedMachinesContent.children.length !== 0) {
        unselectedMachinesContent.innerHTML = ''
    }
    unselectedMachineTable = table.init({
        id: unselectedMachineTableId,
    },
        data);
    unselectedMachinesContent.appendChild(unselectedMachineTable);


    //selektovane masine
    // if (selectedMachineContent.children.length !== 0) {
    //     selectedMachineContent.innerHTML = ''
    // }
    // selectedMachineTable = table.init({
    //     id: selectedMachineTableId,
    // },
    //     data);
    // selectedMachineContent.appendChild(selectedMachineTable);

    
    on(table.events.rowClick(unselectedMachineTableId), function (params) {
        let className = params.row + params.rowId;
        for (let row of unselectedMachineTable.getElementsByClassName(className)) {
            row.classList.toggle('machine-is-selected')
        }

    });
}
