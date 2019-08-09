const jackpotFilter = (function () {
    let advanceTableFilter = $$('#jackpot-advance-table-filter');
    let advanceTableFilterActive = $$('#jackpot-advance-table-filter-active');
    let addJackpot = $$('#jackpot-add-jackpot').children[0];
    let addNewJackpotWrapper = $$('#add-new-jackpot-wrapper');
    let jackpotTab = $$('#jackpot-tab');
    let jackpotFilterDataRange = $$('#jackpot-advance-table-filter-date-range');
    let jackpotFilterCasino = $$('#jackpot-advance-table-filter-casino');
    let jackpotFilterJackpot = $$('#jackpot-advance-table-filter-jackpot');
    let jackpotFilterMachine = $$('#jackpot-advance-table-filter-machine');
    let jackpotAdvanceFilterApplyButton = $$('#jackpot-advance-table-filter-apply').children[0];
    let jackpotAdvanceFilterClearButton = $$('#jackpot-advance-table-filter-clear').children[0];
    let advanceTableFilterInfobar = $$('#jackpot-advance-table-filter-active-infobar');
    let clearButtonAdvanceFilterInfobar = $$('#jackpot-advance-table-filter-active-infobar-button').children[0];
    //region event listeners
    jackpotAdvanceFilterApplyButton.addEventListener('click', function () {
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        filterJackpotsHistoryTable();
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });
    clearButtonAdvanceFilterInfobar.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
        $$('#table-container-jackpot-history').resetFilters();
        filterJackpotsHistoryTable();
    });
    jackpotAdvanceFilterClearButton.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
    });
    function filterJackpotsHistoryTable() {
        let filters = prepareJackpotHistoryFilters();
        trigger(communication.events.jackpots.previewJackpotHistory, { data: filters });
    }
    function prepareJackpotHistoryFilters() {
        let table = $$('#table-container-jackpot-history');
        let machineList = $$('#jackpot-advance-table-filter-machine').children[1].get();
        let jackpotList = $$('#jackpot-advance-table-filter-jackpot').children[1].getValue();
        let casinoList = $$('#jackpot-advance-table-filter-casino').children[1].getValue();
        let filters = {
            'EndpointId': jackpots.getEndpointId().EndpointId,
            'SelectedPeriod': $$('#jackpot-advance-table-filter-date-range').children[1].get(),
            'MachineIdList': machineList === 'null' ? null : machineList.split(','),
            'JackpotList': jackpotList === '-' ? null : jackpotList.split(','),
            'CasinoList': casinoList === '-' ? null : casinoList.split(','),
        };
        filters = table.getFilters(filters);
        return filters;
    }
    on('jackpot/set-filters', function (params) {
        let filters = params.data.Data.Filter;
        dropdownDate.generate({ values: filters.PeriodList, parent: jackpotFilterDataRange, name: 'PeriodList' });
        dropdown.generate({ values: filters.CasinoNameList, parent: jackpotFilterCasino, type: 'multi' });
        dropdown.generate({ values: filters.JackpotNameList, parent: jackpotFilterJackpot, type: 'multi' });
        dropdown.generate({ values: filters.MachineNameList, parent: jackpotFilterMachine, type: 'multi' });
    });
    advanceTableFilter.children[0].addEventListener('click', function () {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        advanceTableFilterActive.classList.toggle('hidden');
    });
    //close add new jackpot form
    jackpotTab.addEventListener('click', function () {
        addNewJackpotWrapper.classList.add('hidden');
        addJackpot.classList.remove('not-active-button');
    });
    //show add new jackpot form
    addJackpot.onclick = function () {
        addNewJackpot.reset();
        let EntryData = jackpots.getEndpointId();
        let data = {};
        data.successAction = 'jackpot/get-add-jackpot';
        trigger(communication.events.jackpots.addJackpot, { data, EntryData });
        addNewJackpotWrapper.classList.toggle('hidden');
        addJackpot.classList.add('not-active-button')
    }
    return {
        prepareJackpotHistoryFilters
    }
})();