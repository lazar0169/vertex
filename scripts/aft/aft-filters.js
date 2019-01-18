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
    let advanceTableFilterButton = $$('#aft-advance-table-filter').children[0];
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftAdvanceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];
    let advanceTableFilterInfobar = $$('#aft-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#aft-advance-table-filter-active-infobar-button').children[0];
    let aftAddTransactionButton = $$('#aft-add-transaction').children[0];
    let aftAddTransactionWrapper = $$('#add-transaction-wrapper');
    let transactionTab = $$('#aft-tabs-transaction');
    let closeAddTransaction = $$('#add-transaction-header-element').children[1];

    let currentTableSettingsObject;
    let activeHeadElement;

    function toggleAdvanceTableFilter() {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        advanceTableFilterActive.classList.toggle('hidden');
    }

    advanceTableFilterButton.addEventListener('click', function () {
        toggleAdvanceTableFilter();
    });

    function getFiltersFromAPI(tableSettings) {
        let data = {
            'EndpointId': tableSettings.endpointId
        };
        console.log('data', data);
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
        chooseColumnListArray.forEach(function (column) {
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

        console.log('filters from API', filters);

        //filter elements
        //let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');
        let aftAdvanceTableFilterFinished = $$('#aft-advance-table-filter-finished');
        let aftAdvanceTableFilterJackpot = $$('#aft-advance-table-filter-jackpot');
        let aftAdvanceTableFilterType = $$('#aft-advance-table-filter-type');
        let aftAdvanceTableFilterStatus = $$('#aft-advance-table-filter-status');
        let aftAdvanceTableFilterColumn = $$('#aft-advance-table-filter-column');
        let aftAddTransactionType = $$('#add-transaction-type');
        let aftAddTransactionMachine = $$('#add-transaction-machine');


        let colNames = getColNamesOfTable(tableSettings);

        multiDropdown.generate(filters.MachineNameList, aftAdvanceTableFilterFinished);
        multiDropdown.generate(filters.JackpotNameList, aftAdvanceTableFilterJackpot);
        multiDropdown.generate(filters.TypeList, aftAdvanceTableFilterType);
        multiDropdown.generate(filters.StatusList, aftAdvanceTableFilterStatus);
        multiDropdown.generate(colNames, aftAdvanceTableFilterColumn);

        dropdown.generate(filters.TypeList.slice(1, filters.TypeList.length), aftAddTransactionType, 'Type');
        dropdown.generate(filters.MachineAddTransactionList, aftAddTransactionMachine, 'MachineName');

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

    function prepareStatusDataForApi(list) {
        let preparedDataForApi = [];
        if (list !== null) {
            list.forEach(function (listItem) {
                preparedDataForApi.push(parseInt(statusEnum[listItem]));
            });
        }
        if (preparedDataForApi.length === 0) {
            preparedDataForApi = null;
        }
        return preparedDataForApi;
    }

    function prepareTypeDataForApi(list) {
        let preparedDataForApi = [];
        if (list !== null) {
            list.forEach(function (listItem) {
                preparedDataForApi.push(parseInt(typeEnum[listItem]));
            });
        }
        if (preparedDataForApi.length === 0) {
            preparedDataForApi = null;
        }
        return preparedDataForApi;
    }

    on('aft/filters/display', function (params) {
        let apiResponseData = params.data;
        let tableSettings = params.settingsObject;
        let filters = apiResponseData.Data;

        filters.StatusList = formatAftApiData(filters.StatusList);
        filters.TypeList = formatAftApiData(filters.TypeList);
        filters.MachineNameList = formatAftApiData(filters.MachineNameList);
        filters.JackpotNameList = formatAftApiData(filters.JackpotNameList);

        tableSettings.filters = filters;
        tableSettings.filtersInitialized = true;
        displayFilters(filters, tableSettings);
    });



    function prepareAftFiltersForApi(currentTableSettingsObject) {
        let pageFilters = table.collectFiltersFromPage(currentTableSettingsObject);
        let sortOrder = currentTableSettingsObject.sort.SortOrder;
        let sortName = currentTableSettingsObject.sort.SortName;
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
                "SortOrder": sortOrder,
                "SortName": aftSortName[sortName] !== undefined ? aftSortName[sortName] : null
            },
            "TokenInfo": sessionStorage.token
        };
        currentTableSettingsObject.ColumnsToShow = pageFilters.Columns;

        currentTableSettingsObject.filters = filtersForApi;

        console.log('filters for API aft', filtersForApi);

        return filtersForApi;
    }

    aftAdvanceApplyFilters.addEventListener('click', function () {

        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        let filtersForApi = prepareAftFiltersForApi(currentTableSettingsObject);

        trigger('communicate/aft/previewTransactions', {
            data: filtersForApi,
            tableSettings: currentTableSettingsObject
        });
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });

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
    });

    clearAdvanceFilter.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });

    clearAdvanceFilterInfobar.addEventListener('click', function () {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
        trigger('filters/show-selected-filters', { active: advanceTableFilterActive, infobar: advanceTableFilterInfobar });
    });

    function showSelectedFilters(filterActive, filterInfobar) {

        for (let count = 0; count < filterActive.children.length - 1; count++) {
            if (filterActive.children[count].children[1].children[0].dataset && filterActive.children[count].children[1].children[0].dataset.value !== '-') {
                filterInfobar.children[1].children[count].children[0].innerHTML = filterActive.children[count].children[0].innerHTML;
                filterInfobar.children[1].children[count].children[1].innerHTML = filterActive.children[count].children[1].children[0].title;
                filterInfobar.children[1].children[count].title = filterActive.children[count].children[1].children[0].title;
                filterInfobar.children[1].children[count].classList.remove('hidden');
            }
            else {
                filterInfobar.children[1].children[count].classList.add('hidden');
            }
        }

        for (let isHidden of filterInfobar.children[1].children) {
            if (isHidden.classList && !isHidden.classList.contains('hidden') && !isHidden.classList.contains('button-wrapper')) {
                filterInfobar.classList.remove('hidden');
                return;
            }
            else {
                filterInfobar.classList.add('hidden');
            }
        }

    }

    on('filters/show-selected-filters', function (data) {
        showSelectedFilters(data.active, data.infobar);
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

    on('show/app', function () {
        aftAddTransactionWrapper.classList.add('hidden');
    });

    closeAddTransaction.addEventListener('click', function () {
        trigger('show/app');
    });

})();