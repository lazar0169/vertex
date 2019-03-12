const malfunctionsFilter = (function () {
    let advanceTableFilter = $$('#malfunctions-advance-table-filter');
    let advanceTableFilterActive = $$('#malfunctions-advance-table-filter-active');
    let clearAdvanceFilter = $$('#malfunctions-advance-table-filter-clear').children[0];
    let malfunctionsAdvanceApplyFilters = $$('#malfunctions-advance-table-filter-apply').children[0];
    let advanceTableFilterInfobar = $$('#malfunctions-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#malfunctions-advance-table-filter-active-infobar-button').children[0];
    let malfunctionServiceMessage = $$('#malfunctions-add-message').children[0];

    malfunctionServiceMessage.placeholder = localization.translateMessage('SetMessage', malfunctionServiceMessage);

    advanceTableFilter.children[0].addEventListener('click', function () {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        advanceTableFilterActive.classList.toggle('hidden');
    });

    on('malfunctions/filters/display', function (params) {
        let filters = params.data.Data;
        displayFilters(filters);
    });

    on('malfunctions/table/filter', function (params) {
        filterMalfunctionsTable();
    });

    function displayFilters(filters) {

        let malfunctionsAdvanceTableFilterDate = $$('#malfunctions-advance-table-filter-date-range');
        let malfunctionsAdvanceTableFilterCasino = $$('#malfunctions-advance-table-filter-casino');
        let malfunctionsAdvanceTableFilterPriority = $$('#malfunctions-advance-table-filter-priority');
        let malfunctionsAdvanceTableFilterStatus = $$('#malfunctions-advance-table-filter-status');
        let malfunctionsAdvanceTableFilterType = $$('#malfunctions-advance-table-filter-type');


        dropdownDate.generate({ values: filters.PeriodList, parent: malfunctionsAdvanceTableFilterDate })
        dropdown.generate({ values: filters.CasinoList, parent: malfunctionsAdvanceTableFilterCasino, type: 'multi' });
        dropdown.generate({ values: filters.PriorityList, parent: malfunctionsAdvanceTableFilterPriority, type: 'multi' });
        dropdown.generate({ values: filters.StatusList, parent: malfunctionsAdvanceTableFilterStatus, type: 'multi' });
        dropdown.generate({ values: filters.TypeList, parent: malfunctionsAdvanceTableFilterType, type: 'multi' });


    }
    //ToDo: test for malfunction filter infobar
    malfunctionsAdvanceApplyFilters.addEventListener('click', function () {
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
        filterMalfunctionsTable();
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
    });

    clearAdvanceFilterInfobar.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
        $$('#table-container-malfunctions').resetFilters();
        filterMalfunctionsTable();
    });

    function filterMalfunctionsTable() {
        let filters = prepareMalfunctionsFilters();
        trigger('preloader/show');
        trigger(communication.events.malfunctions.previewMalfunctions, { data: filters });
    }


    function prepareMalfunctionsFilters() {
        let table = $$('#table-container-malfunctions');

        let casinoList = $$('#malfunctions-advance-table-filter-casino').children[1].get();
        let priorityList = $$('#malfunctions-advance-table-filter-priority').children[1].get();
        let statusesList = $$('#malfunctions-advance-table-filter-status').children[1].get();
        let typesList = $$('#malfunctions-advance-table-filter-type').children[1].get();

        let filters = {
            'EndpointId': table.settings.endpointId,
            'SelectedPeriod': $$('#malfunctions-advance-table-filter-date-range').children[1].get(),
            'CasinoList': casinoList === 'null' ? null : casinoList.split(','),
            'Prioroty': priorityList === 'null' ? null : priorityList.split(','),
            'Status': statusesList === 'null' ? null : statusesList.split(','),
            'Type': typesList === 'null' ? null : typesList.split(','),
        };
        filters = table.getFilters(filters);
        //mark hidden columns

        return filters;
    }
    return {
        prepareMalfunctionsFilters
    }

})();