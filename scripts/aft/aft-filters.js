const aftFilters = (function () {

    const aftSortName = {
        amountcashable: 0,
        amountpromo: 1,
        amountnonrestrictive: 2,
        eventtime: 3,
        gmcid: 4,
        jidtp: 5,
        status: 6,
        machinename: 7,
        jackpotname: 8,
        type: 9
    };

    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftAdvanceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];

    let advanceTableFilterInfobar = $$('#aft-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#aft-advance-table-filter-active-infobar-button').children[0];





    let currentTableSettingsObject;
    let activeHeadElement;

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.add('advance-filter-active');
        advanceTableFilterActive.classList.remove('hidden');
    }

    advanceTableFilter.addEventListener('click', function () {
        showAdvanceTableFilter();
    });

    function getFiltersFromAPI(tableSettings) {
        let data = {
            'EndpointId': tableSettings.endpointId
        };
        let tableSettingsObject = tableSettings;
        let successEvent = 'aft/filters/display';
        trigger('communicate/aft/getFilters', {
            data: data,
            successEvent: successEvent,
            tableSettings: tableSettingsObject
        });
    }

    on('aft/filters/init', function (params) {
        let tableSettings = params.tableSettings;
        currentTableSettingsObject = tableSettings;
        getFiltersFromAPI(tableSettings);
    });

    function getColNamesOfTable(tableSettings) {
        let colNamesArray = table.getColNamesOfDisplayedTable(tableSettings);
        return colNamesArray;
    }

    //display initial filters
    function displayFilters(filters, tableSettings) {

        //filter elements
        //let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');
        let aftAdvanceTableFilterFinished = $$('#aft-advance-table-filter-finished');
        let aftAdvanceTableFilterJackpot = $$('#aft-advance-table-filter-jackpot');
        let aftAdvanceTableFilterType = $$('#aft-advance-table-filter-type');
        let aftAdvanceTableFilterStatus = $$('#aft-advance-table-filter-status');
        let aftAdvanceTableFilterColumn = $$('#aft-advance-table-filter-column');

        let colNames = getColNamesOfTable(tableSettings);

        
        multiDropdown.generate(filters.MachineNameList, aftAdvanceTableFilterFinished);
        multiDropdown.generate(filters.JackpotNameList, aftAdvanceTableFilterJackpot);
        multiDropdown.generate(filters.TypeList, aftAdvanceTableFilterType);
        multiDropdown.generate(filters.StatusList, aftAdvanceTableFilterStatus);
        multiDropdown.generate(colNames, aftAdvanceTableFilterColumn);
    }

    on('aft/filters/display', function (params) {
        let apiResponseData = params.data;
        let tableSettings = params.settingsObject;
        let filters = apiResponseData.Data;
        tableSettings.filters = filters;

        tableSettings.filtersInitialized = true;
        displayFilters(filters, tableSettings);
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', {data: advanceTableFilterActive});
    });

    function prepareAftFiltersForApi(currentTableSettingsObject) {
        let pageFilters = table.collectFiltersFromPage(currentTableSettingsObject);
        let sorting = table.getSorting(currentTableSettingsObject);
        let sortName = sorting.SortName;
        let filtersForApi = {
            "EndpointId": currentTableSettingsObject.endpointId,
            "DateFrom": pageFilters.DateRange !== null ? pageFilters.DateRange[0] : pageFilters.DateRange,
            "DateTo": pageFilters.DateRange !== null ? pageFilters.DateRange[0] : pageFilters.DateRange,
            "MachineList": pageFilters.MachineList,
            "JackpotList": pageFilters.JackpotList,
            "Status": pageFilters.Status,
            "Type": pageFilters.Type,
            "BasicData": {
                "Page": currentTableSettingsObject.activePage,
                "PageSize": table.getPageSize(currentTableSettingsObject),
                "SortOrder": sorting.SortOrder,
                "SortName": aftSortName[sortName] !== undefined ? aftSortName[sortName] : null
            },
            "TokenInfo": sessionStorage.token
        };
        currentTableSettingsObject.ColumnsToShow = pageFilters.Columns;

        currentTableSettingsObject.filters = filtersForApi;
        return filtersForApi;
    }

    aftAdvanceApplyFilters.addEventListener('click', function () {

        let filtersForApi = prepareAftFiltersForApi(currentTableSettingsObject);

        trigger('communicate/aft/previewTransactions', {
            data: filtersForApi,
            tableSettings: currentTableSettingsObject
        });

    });

    on('aft/filters/pagination', function (params) {
        let tableSettings = params.tableSettings;
        let filtersForApi = prepareAftFiltersForApi(tableSettings);
        trigger('communicate/aft/previewTransactions', {
            tableSettings: tableSettings,
            data: filtersForApi,
            callbackEvent: 'table/update'
        });
    });

    on('aft/filters/sorting', function (params) {
        let tableSettings = params.tableSettings;
        activeHeadElement = currentTableSettingsObject.tableContainerElement.getElementsByClassName('sort-active');
        if (activeHeadElement !== null && activeHeadElement !== undefined) {
            let filtersForApi = prepareAftFiltersForApi(tableSettings);
            filtersForApi.BasicData.SortOrder = params.sorting.SortOrder;
            filtersForApi.BasicData.SortName = aftSortName[params.sorting.SortName] !== undefined ? aftSortName[params.sorting.SortName] : null;
            trigger('communicate/aft/previewTransactions', {
                tableSettings: tableSettings,
                data: filtersForApi,
                callbackEvent: 'table/update'
            });
        }
    });

    on('aft/filters/pageSize', function (params) {
        let tableSettings = params.tableSettings;
        let filtersForApi = prepareAftFiltersForApi(tableSettings);
        trigger('communicate/aft/previewTransactions', {
            tableSettings: tableSettings,
            data: filtersForApi,
            callbackEvent: 'table/update'
        });
    })

    advanceTableFilter.children[0].addEventListener('click', function () {
        showAdvanceTableFilter();
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        advanceTableFilterInfobar.style.visibility = 'hidden';
    });
    clearAdvanceFilterInfobar.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        showSelectedFilters();
        advanceTableFilterInfobar.style.visibility = 'hidden';
    });
    function showSelectedFilters() {

        for (let count = 0; count < advanceTableFilterActive.children.length - 1; count++) {
            if (advanceTableFilterActive.children[count].children[1].children[0].dataset && advanceTableFilterActive.children[count].children[1].children[0].dataset.value !== '-') {
                advanceTableFilterInfobar.children[1].children[count].children[0].innerHTML = advanceTableFilterActive.children[count].children[0].innerHTML;
                advanceTableFilterInfobar.children[1].children[count].children[1].innerHTML = advanceTableFilterActive.children[count].children[1].children[0].title;
                advanceTableFilterInfobar.children[1].children[count].title = advanceTableFilterActive.children[count].children[1].children[0].title;
                advanceTableFilterInfobar.children[1].children[count].classList.remove('hidden');

            }
            else {
                advanceTableFilterInfobar.children[1].children[count].classList.add('hidden');
            }
        }

        for (let isHidden of advanceTableFilterInfobar.children[1].children) {
            if (isHidden.classList && !isHidden.classList.contains('hidden') && !isHidden.classList.contains('button-wrapper')) {
                advanceTableFilterInfobar.style.visibility = 'visible';
                return;
            }
            else {
                advanceTableFilterInfobar.style.visibility = 'hidden';
            }
        }

    }

})();