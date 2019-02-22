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
    let activeHeadElement;
    let dropdownStatus;
    let dropdownColumn;



    //display initial filters
    /*********************----Events Listeners------*********************/
    aftAdvanceApplyFilters.addEventListener('click', function () {
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
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


    /*********************----Module Events----************************/
    on('aft/filters/init', function (params) {
        let tableSettings = params.tableSettings;
        getFiltersFromAPI(tableSettings);
    });
    on('aft/filters/display', function (params) {
        let apiResponseData = params.data;
        let tableSettings = params.settingsObject;
        let filters = apiResponseData.Data;

        filters.MachineNameList = formatAftApiData(filters.MachineNameList);
        filters.JackpotNameList = formatAftApiData(filters.JackpotNameList);

        tableSettings.filtersInitialized = true;
        displayFilters(filters, tableSettings);
    });
    on('aft/filters/pagination', function (params) {
        filterAftTable();

    });
    on('aft/filters/sorting', function (params) {
        activeHeadElement = getActiveTableSettings().tableContainerElement.getElementsByClassName('sort-active');
        if (activeHeadElement !== null && activeHeadElement !== undefined) {
            filterAftTable();
        }
    });
    on('aft/filters/pageSize', function (params) {
        let tableSettings = params.tableSettings;
        tableSettings.activePage = 1;
        filterAftTable();
    });
    on('aft/filters/filter-table', function (params) {
        filterAftTable(params.showFilters);
    });
    //display initial filters
    /*********************----Helper functions----*********************/

    function getActiveTableSettings() {
        return $$('#table-container-aft').tableSettings;
    }

    function filterAftTable() {
        let params = {};
        let tableSettings = getActiveTableSettings();
        params.tableSettings = tableSettings;
        params.data = prepareAftFiltersForApi(tableSettings);
        params.activeFiltersElement = advanceTableFilterActive;
        params.infobarElement = advanceTableFilterInfobar;
        trigger('table/filter', params);
    }

    function removeSelectedFilters() {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
    }

    function clearAftFilters() {
        removeSelectedFilters();
        //reset page to 1
        let tableSettings = getActiveTableSettings();
        tableSettings.activePage = 1;
        tableSettings.visibleColumns = [];
        tableSettings.filters = null;
        filterAftTable();
    }

    function getFiltersFromAPI(tableSettings) {
        let data = {
            'EndpointId': tableSettings.endpointId
        };
        let tableSettingsObject = tableSettings;
        let successEvent = 'aft/filters/display';
        trigger(communication.events.aft.transactions.getFilters, {
            data: data,
            successEvent: successEvent,
            tableSettings: tableSettingsObject
        });
    }

    function displayFilters(filters, tableSettings) {
        //filter elements
        //let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');
        let aftAdvanceTableFilterFinished = $$('#aft-advance-table-filter-finished');
        let aftAdvanceTableFilterJackpot = $$('#aft-advance-table-filter-jackpot');
        let aftAdvanceTableFilterType = $$('#aft-advance-table-filter-type');
        let aftAdvanceTableFilterStatus = $$('#aft-advance-table-filter-status');
        let aftAdvanceTableFilterColumn = $$('#aft-advance-table-filter-column');
        let aftAddTransactionType = $$('#add-transaction-type');
        let aftAddTransactionMachine = $$('#add-transaction-machine');




        dropdown.generate({ optionValue: filters.MachineNameList, parent: aftAdvanceTableFilterFinished, type: 'multi' })
        dropdown.generate({ optionValue: filters.JackpotNameList, parent: aftAdvanceTableFilterJackpot, type: 'multi' });


        dropdown.generate({ optionValue: filters.TypeList, parent: aftAdvanceTableFilterType, type: 'multi' });
        // let types = table.parseFilterValues(filters.TypeList, 'Name', 'Id', -1);
        if (dropdownStatus) {
            dropdownStatus.remove();
        }
        dropdownStatus = dropdown.generate({ optionValue: filters.StatusList, type: 'multi' });
        aftAdvanceTableFilterStatus.appendChild(dropdownStatus);
        // let statuses = table.parseFilterValues(filters.StatusList, 'Name', 'Id', -1);

        //set up columns selection dropdown
        aftAdvanceTableFilterColumn.classList.add('table-element-select-columns');
        aftAdvanceTableFilterColumn.dataset.target = tableSettings.tableContainerSelector;
        let hideableColumns = table.getHideableColumns(tableSettings);
        hideableColumns.unshift({ Name: '-', Id: null });
        //ToDo Neske: this can be removed when solution for parsed hack is found
        // let columns = hideableColumns.map(function (item) {
        //     item.parsed = true;
        //     return item;
        // });
        if (dropdownColumn) {
            dropdownColumn.remove();
        }
        dropdownColumn = dropdown.generate({ optionValue: hideableColumns, type: 'multi' });
        aftAdvanceTableFilterColumn.appendChild(dropdownColumn);

        dropdown.generate({ optionValue: filters.TypeList.slice(1, filters.TypeList.lenght), parent: aftAddTransactionType, type: 'single' })
        dropdown.generate({ optionValue: filters.MachineAddTransactionList, parent: aftAddTransactionMachine, type: 'single' })
    }

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        advanceTableFilterActive.classList.toggle('hidden');
    }

    function formatAftApiData(listArray) {
        if (listArray !== null && listArray !== undefined) {
            listArray.forEach(function (list) {
                list.Name = localization.translateMessage(list.Name);
                list.Value = list.Name;
            });
        }
        return listArray;
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

    function hideAndResetAddTransactionUI() {
        trigger('show/app');
        resetAddTransactionUI();
    }

    function resetAddTransactionUI() {
        dropdown.reset($$('#add-transaction-type'));
        dropdown.reset($$('#add-transaction-machine'));


    }


    on('show/app', function () {
        aftAddTransactionWrapper.classList.add('hidden');
    });

    closeAddTransaction.addEventListener('click', function () {
        trigger('show/app');
    });

})();