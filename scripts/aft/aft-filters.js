const aftFilters = (function () {
    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear').children[0];
    let aftAdvanceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];
    let advanceTableFilterInfobar = $$('#aft-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#aft-advance-table-filter-active-infobar-button').children[0];
    let aftAddTransactionButton = $$('#aft-add-transaction').children[0];
    let aftAddTransactionWrapper = $$('#add-transaction-wrapper');
    let transactionTab = $$('#aft-tabs-transaction');
    let closeAddTransaction = $$('#add-transaction-header-element').children[1];
    let dropdownStatus;
    let dropdownColumn;
    let endpointId = null;

    //display initial filters
    //region event listeners
    aftAdvanceApplyFilters.addEventListener('click', function () {
        trigger('opened-arrow', {div: advanceTableFilter.children[0]});
        filterAftTable();
    });

    //close
    transactionTab.addEventListener('click', function () {
        $$('#black-area').classList.remove('show');
        aftAddTransactionWrapper.classList.add('hidden');
    });
    //show
    aftAddTransactionButton.addEventListener('click', function () {
        $$('#black-area').classList.add('show');
        aftAddTransactionWrapper.classList.remove('hidden');
    });
    // ToDO: treba da postoji jedan jedinstven event
    window.addEventListener('keyup', function (event) {
        if (event.keyCode == 27) {
            aftAddTransactionWrapper.classList.add('hidden');
        }
    });

    clearAdvanceFilter.addEventListener('click', removeSelectedFilters);
    clearAdvanceFilterInfobar.addEventListener('click', clearAftFilters);
    advanceTableFilter.children[0].addEventListener('click', function () {
        showAdvanceTableFilter();
    });
    //endregion
    /*********************----Module Events----************************/
    on('aft/filters/init', function (params) {
        endpointId = params.endpointId;
        getFiltersFromAPI(endpointId);
    });

    on('aft/filters/display', function (params) {
        let apiResponseData = params.data;
        let filters = apiResponseData.Data;
        displayFilters(filters);
    });
    on('aft/filters/pagination', function (params) {
        filterAftTable();

    });
    on('aft/filters/sorting', function () {
        filterAftTable();
    });
    on('aft/filters/pageSize', function (params) {
        let tableSettings = params.tableSettings;
        tableSettings.activePage = 1;
        filterAftTable();
    });
    on('aft/filters/filter-table', function (params) {
        filterAftTable();
    });

    //display initial filters
    /*********************----Helper functions----*********************/

    function filterAftTable() {
        let aftTable = $$('#table-container-aft');

        let filters = prepareAftFilters();

    }

    function removeSelectedFilters() {
        trigger('clear/dropdown/filter', {data: advanceTableFilterActive});
    }

    function clearAftFilters() {
        removeSelectedFilters();
        $$('#table-container-aft').resetFilters();
        filterAftTable();
    }

    function getFiltersFromAPI(endpointId) {
        let data = {
            'EndpointId': endpointId
        };
        let successEvent = 'aft/filters/display';
        trigger(communication.events.aft.transactions.getFilters, {
            data: data,
            successEvent: successEvent,
        });
    }

    function displayFilters(filters) {
        //filter elements
        //let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');
        let aftAdvanceTableFilterFinished = $$('#aft-advance-table-filter-finished');
        let aftAdvanceTableFilterJackpot = $$('#aft-advance-table-filter-jackpot');
        let aftAdvanceTableFilterType = $$('#aft-advance-table-filter-type');
        let aftAdvanceTableFilterStatus = $$('#aft-advance-table-filter-status');
        let aftAdvanceTableFilterColumn = $$('#aft-advance-table-filter-column');
        let aftAddTransactionType = $$('#add-transaction-type');
        let aftAddTransactionMachine = $$('#add-transaction-machine');

        dropdown.generate({optionValue: filters.MachineNameList, parent: aftAdvanceTableFilterFinished, type: 'multi'});
        dropdown.generate({optionValue: filters.JackpotNameList, parent: aftAdvanceTableFilterJackpot, type: 'multi'});

        dropdown.generate({optionValue: filters.TypeList, parent: aftAdvanceTableFilterType, type: 'multi'});
        if (dropdownStatus) {
            dropdownStatus.remove();
        }
        dropdownStatus = dropdown.generate({optionValue: filters.StatusList, type: 'multi'});
        aftAdvanceTableFilterStatus.appendChild(dropdownStatus);

        //set up columns selection dropdown
        let aftTable = $$('#table-container-aft');
        console.log($$('#table-container-aft'));
        console.log(aftTable.settings.columns);
        let columns = [];
        for (let columnKey in aftTable.settings.columns) {
            let column = aftTable.settings.columns[columnKey];
            console.log(column);
            if (column.hideable === true) {
                columns.push({
                    Id: column.column,
                    Name: column.column
                })
            }
        }

        dropdownColumn = dropdown.generate({optionValue: columns, type: 'multi'});
        aftAdvanceTableFilterColumn.appendChild(dropdownColumn);

        dropdown.generate({
            optionValue: filters.TypeList.slice(1, filters.TypeList.lenght),
            parent: aftAddTransactionType,
            type: 'single'
        });
        dropdown.generate({
            optionValue: filters.MachineAddTransactionList,
            parent: aftAddTransactionMachine,
            type: 'single'
        })
    }

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', {div: advanceTableFilter.children[0]});
        advanceTableFilterActive.classList.toggle('hidden');
    }


    function prepareAftFilters() {
        let table = $$('#table-container-aft');

        let date = $$('#aft-advance-table-filter-date-range').children[1].children[0].dataset.value;
        let dateFrom = null;
        let dateTo = null;
        if (date !== 'null') {
            dateFrom = $$('#aft-advance-table-filter-date-range').children[1].children[0].dataset.value.split(',')[0];
            dateTo = $$('#aft-advance-table-filter-date-range').children[1].children[0].dataset.value.split(',')[1];
        }

        let filters = {
            'EndpointId': table.settings.endpointId,
            'DateFrom': dateFrom,
            'DateTo': dateTo,
            'MachineList': $$('#aft-advance-table-filter-finished').children[1].get().split(','),
            'JackpotList': $$('#aft-advance-table-filter-jackpot').children[1].get().split(','),
            'Status': $$('#aft-advance-table-filter-status').children[1].get().split(','),
            'Type': $$('#aft-advance-table-filter-type').children[1].get().split(',')
        }
         filters = table.getFilters(filters);

        console.log('filters',filters);
    }

    function prepareAftFiltersForApi(activeTableSettings) {
        if (activeTableSettings === undefined) {
            activeTableSettings = getActiveTableSettings();
        }
        let pageFilters = table.collectFiltersFromPage(activeTableSettings);
        let sortDirection = activeTableSettings.sort.sortDirection;
        let sortName = activeTableSettings.sort.sortName;

        let filtersForApi = {
            'EndpointId': activeTableSettings.endpointId,
            'DateFrom': pageFilters.DateRange !== null ? pageFilters.DateRange[0] : pageFilters.DateRange,
            'DateTo': pageFilters.DateRange !== null ? pageFilters.DateRange[0] : pageFilters.DateRange,
            'MachineList': pageFilters.MachineList,
            'JackpotList': pageFilters.JackpotList,
            'Status': pageFilters.Status,
            'Type': pageFilters.Type,
            'BasicData': {
                'Page': activeTableSettings.activePage,
                'PageSize': table.getPageSize(activeTableSettings),
                'SortOrder': sortDirection,
                'SortName': sortName
            },
            'TokenInfo': sessionStorage.token
        };
        //reset to page 1 if filters are changed
        table.setFiltersPage(activeTableSettings, filtersForApi);
        //Set visible columns for tableSettings object
        activeTableSettings.visibleColumns = pageFilters.Columns;
        activeTableSettings.filters = filtersForApi;
        return filtersForApi;
    }

    on('show/app', function () {
        aftAddTransactionWrapper.classList.add('hidden');
    });

    closeAddTransaction.addEventListener('click', function () {
        trigger('show/app');
    });

})();