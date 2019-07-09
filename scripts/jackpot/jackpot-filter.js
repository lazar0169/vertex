const jackpotFilter = (function () {
    let advanceTableFilter = $$('#jackpot-advance-table-filter');
    let advanceTableFilterActive = $$('#jackpot-advance-table-filter-active');
    let addJackpot = $$('#jackpot-add-jackpot').children[0];
    let addNewJackpot = $$('#add-new-jackpot-wrapper');
    let jackpotTab = $$('#jackpot-tab');
    let jackpotFilterDataRange = $$('#jackpot-advance-table-filter-date-range');
    let jackpotFilterCasino = $$('#jackpot-advance-table-filter-casino');
    let jackpotFilterJackpot = $$('#jackpot-advance-table-filter-jackpot');
    let jackpotFilterMachine = $$('#jackpot-advance-table-filter-machine');

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
        addNewJackpot.classList.add('hidden');
    });

    //show add new jackpot form
    addJackpot.onclick = function () {
        let EntryData = jackpots.getEndpointId();
        let data = {};
        data.successAction = 'jackpot/get-add-jackpot';
        trigger(communication.events.jackpots.addJackpot, { data, EntryData });
        addNewJackpot.classList.toggle('hidden');
        //todo jel ovde praznim polja?
        trigger('jackpot/clear-add-jackpot-input');
    }
})();