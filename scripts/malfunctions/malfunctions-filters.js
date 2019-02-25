const malfunctionsFilter = (function () {
    let advanceTableFilter = $$('#malfunctions-advance-table-filter');
    let advanceTableFilterActive = $$('#malfunctions-advance-table-filter-active');
    let clearAdvanceFilter = $$('#malfunctions-advance-table-filter-clear').children[0];
    let malfunctionsAdvanceApplyFilters = $$('#malfunctions-advance-table-filter-apply').children[0];
    let advanceTableFilterInfobar = $$('#malfunctions-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#malfunctions-advance-table-filter-active-infobar-button').children[0];


    let malfunctionsMachinesNumbers = $$('#malfunctions-number');

    dropdown.generate({ optionValue: machinesNumber, parent: malfunctionsMachinesNumbers })

    advanceTableFilter.addEventListener('click', function () {
        advanceTableFilter.classList.add('advance-filter-active');
        // trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        // advanceTableFilter.children[1].classList.remove('hidden');
    });

    on('malfunctions/filters/display', function (params) {
        let filters = params.data.Data;
        let tableSettings = params.settingsObject;
        displayFilters(filters, tableSettings);
    });

    function displayFilters(filters, tableSettings) {

        let malfunctionsAdvanceTableFilterCasino = $$('#malfunctions-advance-table-filter-casino');
        let malfunctionsAdvanceTableFilterPriority = $$('#malfunctions-advance-table-filter-priority');
        let malfunctionsAdvanceTableFilterStatus = $$('#malfunctions-advance-table-filter-status');
        let malfunctionsAdvanceTableFilterType = $$('#malfunctions-advance-table-filter-type');

        dropdown.generate({ optionValue: filters.CasinoList, parent: malfunctionsAdvanceTableFilterCasino, type: 'multi' });
        dropdown.generate({ optionValue: filters.PriorityList, parent: malfunctionsAdvanceTableFilterPriority, type: 'multi' });
        dropdown.generate({ optionValue: filters.StatusList, parent: malfunctionsAdvanceTableFilterStatus, type: 'multi' });
        dropdown.generate({ optionValue: filters.TypeList, parent: malfunctionsAdvanceTableFilterType, type: 'multi' });

    }
    //ToDo: test for malfunction filter infobar
    malfunctionsAdvanceApplyFilters.addEventListener('click', function () {
        trigger('table/show-selected-filters/infobar', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
    });

    clearAdvanceFilterInfobar.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        trigger('table/show-selected-filters/infobar', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });

})();