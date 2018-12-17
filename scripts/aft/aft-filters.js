const aftFilters = (function () {

    const aftSortName = {
        cashable: 0,
        promo: 1,
        amountnonrestrictive: 2,
        createdby: 3,
        gmcid: 4,
        jidtp: 5,
        status: 6,
        machinename: 7,
        jackpotname: 8,
        type: 9,
        finishedby: 10
    };

    const statusEnum = {
        AFTActive: 0,
        AFTCheck: 1,
        AFTPending: 2,
        AFTPendingForPayed: 3,
        AFTPendingForDeleted: 4,
        AFTDeleted: 5,
        AFTSucceededPayed: 6,
        AFTPayedFromApp: 7,
        AFTPendingPayedFromApp: 8,
        AFTNotExisting: 9,
        AFTCancelled: 10,
        AFTCancelledPending: 11
    };

    const typeEnum = {
        BonusWinHostToMachine: 0,
        InHouseHostToMachine: 1,
        InHouseMachineToHost: 2
    };

    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftAdvanceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];

    let currentTableSettingsObject;
    let activeHeadElement;

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('aft-advance-active');
        advanceTableFilterActive.classList.toggle('hidden');
        $$(currentTableSettingsObject.tableContainerSelector).classList.toggle('smaller-table');
        $$(currentTableSettingsObject.tableContainerSelector).getElementsByClassName('pagination')[0].classList.toggle('smaller-table');
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

    function formatChooseColumnData(chooseColumnListArray) {
        let formattedColumnArray = [];
        let columnObject = {};
        chooseColumnListArray.forEach(function(column){
            columnObject = {
                Name: localization.translateMessage(column.Name),
                Value: column.Name
            };
            formattedColumnArray.push(columnObject);
        });
        return formattedColumnArray;
    }

    function getColNamesOfTable(tableSettings) {
        let colNamesArray = table.getColNamesOfDisplayedTable(tableSettings);
        colNamesArray = formatChooseColumnData(colNamesArray);
        return colNamesArray;
    }

    //display initial filters
    function displayFilters(filters, tableSettings) {
        //filter elements
        let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');
        let aftAdvanceTableFilterFinished = $$('#aft-advance-table-filter-finished');
        let aftAdvanceTableFilterJackpot = $$('#aft-advance-table-filter-jackpot');
        let aftAdvanceTableFilterType = $$('#aft-advance-table-filter-type');
        let aftAdvanceTableFilterStatus = $$('#aft-advance-table-filter-status');
        let aftAdvanceTableFilterColumn = $$('#aft-advance-table-filter-column');

        let colNames = getColNamesOfTable(tableSettings);

        dropdownDate.generate(nekiniz, aftAdvanceTableFilterDateRange);
        multiDropdown.generate(filters.MachineNameList, aftAdvanceTableFilterFinished);
        multiDropdown.generate(filters.JackpotNameList, aftAdvanceTableFilterJackpot);
        multiDropdown.generate(filters.TypeList, aftAdvanceTableFilterType);
        multiDropdown.generate(filters.StatusList, aftAdvanceTableFilterStatus);
        multiDropdown.generate(colNames, aftAdvanceTableFilterColumn);
    }

    function formatApiData(listArray){
        let formattedData = [];
        let statusObject = {};
        listArray.forEach(function(list){
            statusObject = {
                Name: localization.translateMessage(list.Name),
                Value: list.Name,
                Id: list.Id
            };
            formattedData.push(statusObject);
        });
        return formattedData;
    }

    function prepareStatusDataForApi(list){
        let preparedDataForApi = [];
        if(list !== null) {
            list.forEach(function(listItem){
                preparedDataForApi.push(parseInt(statusEnum[listItem]));
            });
        }
        return preparedDataForApi;
    }

    function prepareTypeDataForApi(list){
        let preparedDataForApi = [];
        if(list !== null) {
            list.forEach(function(listItem){
                preparedDataForApi.push(parseInt(typeEnum[listItem]));
            });
        }
        return preparedDataForApi;
    }

    on('aft/filters/display', function (params) {
        let apiResponseData = params.data;
        let tableSettings = params.settingsObject;
        let filters = apiResponseData.Data;

        filters.StatusList = formatApiData(filters.StatusList);
        filters.TypeList = formatApiData(filters.TypeList);
        filters.MachineNameList = formatApiData(filters.MachineNameList);
        filters.JackpotNameList = formatApiData(filters.JackpotNameList);

        console.log('filters to display', filters);

        tableSettings.filters = filters;

        tableSettings.filtersInitialized = true;
        displayFilters(filters, tableSettings);
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', {data: advanceTableFilterActive});
    });

    function prepareAftFiltersForApi(currentTableSettingsObject) {
        let pageFilters = table.collectFiltersFromPage(currentTableSettingsObject);

        console.log('page filters', pageFilters);

        let sorting = table.getSorting(currentTableSettingsObject);
        let sortName = sorting.SortName;
        let filtersForApi = {
            "EndpointId": currentTableSettingsObject.endpointId,
            "DateFrom": pageFilters.DateRange !== null ? pageFilters.DateRange[0] : pageFilters.DateRange,
            "DateTo": pageFilters.DateRange !== null ? pageFilters.DateRange[0] : pageFilters.DateRange,
            "MachineList": pageFilters.MachineList,
            "JackpotList": pageFilters.JackpotList,
            "Status": prepareStatusDataForApi(pageFilters.Status),
            "Type": prepareTypeDataForApi(pageFilters.Type),
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

        console.log('filtersForApi', filtersForApi);

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

})();