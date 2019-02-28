const malfunctionsFilter = (function () {
    let advanceTableFilter = $$('#malfunctions-advance-table-filter');
    let advanceTableFilterActive = $$('#malfunctions-advance-table-filter-active');
    let clearAdvanceFilter = $$('#malfunctions-advance-table-filter-clear').children[0];
    let malfunctionsAdvanceApplyFilters = $$('#malfunctions-advance-table-filter-apply').children[0];
    let advanceTableFilterInfobar = $$('#malfunctions-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#malfunctions-advance-table-filter-active-infobar-button').children[0];


    let malfunctionsMachinesNumbers = $$('#malfunctions-number');

    dropdown.generate({ values: machinesNumber, parent: malfunctionsMachinesNumbers })

    advanceTableFilter.children[0].addEventListener('click', function () {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        advanceTableFilterActive.classList.toggle('hidden');
    });

    on('malfunctions/filters/display', function (params) {
        let filters = params.data.Data;
        let tableSettings = params.settingsObject;
        displayFilters(filters, tableSettings);
    });

    function displayFilters(filters, tableSettings) {

        let malfunctionsAdvanceTableFilterDate = $$('#malfunctions-advance-table-filter-date-range');
        let malfunctionsAdvanceTableFilterCasino = $$('#malfunctions-advance-table-filter-casino');
        let malfunctionsAdvanceTableFilterPriority = $$('#malfunctions-advance-table-filter-priority');
        let malfunctionsAdvanceTableFilterStatus = $$('#malfunctions-advance-table-filter-status');
        let malfunctionsAdvanceTableFilterType = $$('#malfunctions-advance-table-filter-type');

        dropdownDate.generate({ values: [{ Name: '-', Id: 0 }, { Name: 'Custom', Id: 7 }], parent: malfunctionsAdvanceTableFilterDate })

        dropdown.generate({ values: filters.CasinoList, parent: malfunctionsAdvanceTableFilterCasino, type: 'multi' });
        dropdown.generate({ values: filters.PriorityList, parent: malfunctionsAdvanceTableFilterPriority, type: 'multi' });
        dropdown.generate({ values: filters.StatusList, parent: malfunctionsAdvanceTableFilterStatus, type: 'multi' });
        dropdown.generate({ values: filters.TypeList, parent: malfunctionsAdvanceTableFilterType, type: 'multi' });

    }
    //ToDo: test for malfunction filter infobar
    malfunctionsAdvanceApplyFilters.addEventListener('click', function () {
        trigger('table/show-selected-filters/infobar', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
    });

    clearAdvanceFilterInfobar.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        trigger('table/show-selected-filters/infobar', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });

})();