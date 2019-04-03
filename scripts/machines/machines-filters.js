const machinesFilter = (function () {
    let advanceTableFilter = $$('#machines-advance-table-filter');
    let advanceTableFilterActive = $$('#machines-advance-table-filter-active');
    let advanceTableFilterInfobar = $$('#machines-advance-table-filter-active-infobar')
    let machinesTopBar = $$('#top-bar-machines');
    let machinesTopBarActiveMachines = machinesTopBar.getElementsByClassName("element-topbar-active-machines")[0];
    let machinesTopBarAllMachines = machinesTopBar.getElementsByClassName("element-topbar-all-machines")[0];
    let machinesTopBarTotalBet = machinesTopBar.getElementsByClassName("element-topbar-total-bet-machines")[0];
    let machinesTopBarCurrentCredits = machinesTopBar.getElementsByClassName("element-topbar-total-current-credits-machines")[0];
    let machinesAdvanceFilterApplyButton = $$('#machines-advance-table-filter-apply').children[0]
    let machinesAdvanceFilterCancelButton = $$('#machines-advance-table-filter-clear').children[0];
    let clearAdvanceFilterInfobar = $$('#machines-advance-table-filter-active-infobar-button').children[0];
    let machineWithPlayer = $$('#machine-filters-player').children[1];
    let autoSelect = $$('#auto-select-status');
    let autoSelectOn;

    autoSelect.onclick = function () {
        if (autoSelect.dataset.value === 'on') {
            autoSelect.dataset.value = 'off';
            clearInterval(autoSelectOn);
        } else {
            autoSelect.dataset.value = 'on';
            setAutoInterval();
        }
        autoSelect.innerHTML = localization.translateMessage(autoSelect.dataset.value);
    }

    function setAutoInterval() {
        autoSelectOn = setInterval(autoSelectInterval, 3000);
    }
    
    function autoSelectInterval() {
        trigger('machines/table/filter');
        if (JSON.parse(sessionStorage.categoryAndLink).category !== 'Machines') {
            clearInterval(autoSelectOn);
        }
    }

    machineWithPlayer.onclick = function () {
        if (machineWithPlayer.children[0].children[0].checked) {
            machineWithPlayer.children[0].children[0].checked = false;
        }
        else {
            machineWithPlayer.children[0].children[0].checked = true;
        }
    }

    function topBarInfoBoxValue(params) {
        machinesTopBarActiveMachines.innerHTML = params.NumberOfActiveMachines;
        machinesTopBarAllMachines.innerHTML = `/ ${params.NumberOfMachines}`;
        machinesTopBarTotalBet.innerHTML = formatFloatValue(params.TotalBet / 100);
        machinesTopBarCurrentCredits.innerHTML = formatFloatValue(params.TotalCurrentCredits / 100);
    }

    machinesAdvanceFilterApplyButton.addEventListener('click', function () {
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        filterMachinesTable();
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });

    machinesAdvanceFilterCancelButton.addEventListener('click', removeSelectedFilters);
    clearAdvanceFilterInfobar.addEventListener('click', clearMachinesFilters);

    function removeSelectedFilters() {
        machineWithPlayer.children[0].children[0].checked = false;
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    }

    function clearMachinesFilters() {
        removeSelectedFilters();
        $$('#table-container-machines').resetFilters();
        filterMachinesTable();
    }

    on('showing-machines-top-bar-value', function (params) {
        topBarInfoBoxValue(params.data.Data.ItemValue)
    });

    advanceTableFilter.children[0].addEventListener('click', function () {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        advanceTableFilterActive.classList.toggle('hidden');
    });

    function filterMachinesTable() {
        let filters = machines.prepareMachinesFilters();
        trigger(communication.events.machines.previewMachines, { data: filters });
    }
    return {
        setAutoInterval
    }
})();