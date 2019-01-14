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

    let advanceTableFilter = $$('#aft-advance-table-filter');
    let advanceTableFilterActive = $$('#aft-advance-table-filter-active');
    let clearAdvanceFilter = $$('#aft-advance-table-filter-clear');
    let aftAdvanceApplyFilters = $$('#aft-advance-table-filter-apply').children[0];
    let advanceTableFilterInfobar = $$('#aft-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#aft-advance-table-filter-active-infobar-button').children[0];

    let currentTableSettingsObject;
    let activeHeadElement;

    //display initial filters
    /*********************----Events Listeners------*********************/
    aftAdvanceApplyFilters.addEventListener('click', filterAftTable);
    clearAdvanceFilter.addEventListener('click', clearAftFilters);
    clearAdvanceFilterInfobar.addEventListener('click', clearAftFilters);
    advanceTableFilter.addEventListener('click', function () {
        showAdvanceTableFilter();
    });

    /*********************----Module Events----************************/
    on('aft/filters/init', function (params) {
        let tableSettings = params.tableSettings;
        currentTableSettingsObject = tableSettings;
        getFiltersFromAPI(tableSettings);
    });
    on('aft/filters/display', function (params) {
        let apiResponseData = params.data;
        let tableSettings = params.settingsObject;
        let filters = apiResponseData.Data;

        filters.MachineNameList = formatAftApiData(filters.MachineNameList);
        filters.JackpotNameList = formatAftApiData(filters.JackpotNameList);

        tableSettings.filters = filters;
        tableSettings.filtersInitialized = true;
        displayFilters(filters, tableSettings);
    });
    on('aft/filters/pagination', function (params) {
        let tableSettings = params.tableSettings;
        //let filtersForApi = prepareAftFiltersForApi(tableSettings);
        filterAftTable()
    });
    on('aft/filters/sorting', function (params) {
        let tableSettings = params.tableSettings;
        activeHeadElement = currentTableSettingsObject.tableContainerElement.getElementsByClassName('sort-active');
        if (activeHeadElement !== null && activeHeadElement !== undefined) {
            /*let filtersForApi = prepareAftFiltersForApi(tableSettings);
            filtersForApi.BasicData.SortDirection = params.sorting.SortDirection;
            filtersForApi.BasicData.SortName = aftSortName[params.sorting.SortName] !== undefined ? aftSortName[params.sorting.SortName] : null;
            */filterAftTable();
           /* trigger(communication.events.aft.transactions.previewTransactions, {
                tableSettings: tableSettings,
                data: filtersForApi,
                callbackEvent: 'table/update'
            });*/
        }
    });
    on('filters/show-selected-filters', function (data) {
        showSelectedFilters(data.active, data.infobar)
    });
    on('aft/filters/pageSize', function (params) {
        let tableSettings = params.tableSettings;
        tableSettings.activePage = 1;
        console.log('filters for api');
        filterAftTable();
    });
    on('aft/filters/filter-table', function(params){
        filterAftTable(params.showFilters);
    });

    /*********************----Helper functions----*********************/
    function filterAftTable(showFilters) {
        console.log('showFilters');
        console.log(showFilters);
        if (showFilters === undefined) {
            showFilters = false;
        }
        let params = {};
        params.tableSettings = currentTableSettingsObject;
        params.data = prepareAftFiltersForApi(currentTableSettingsObject);
        if (showFilters) {
            params.activeFiltersElement = advanceTableFilterActive;
            params.infobarElement = advanceTableFilterInfobar;
        }
        trigger('table/filter', params);
    }


    function displayFilters(filters, tableSettings) {
        //filter elements
        //let aftAdvanceTableFilterDateRange = $$('#aft-advance-table-filter-date-range');
        let aftAdvanceTableFilterFinished = $$('#aft-advance-table-filter-finished');
        let aftAdvanceTableFilterJackpot = $$('#aft-advance-table-filter-jackpot');
        let aftAdvanceTableFilterType = $$('#aft-advance-table-filter-type');
        let aftAdvanceTableFilterStatus = $$('#aft-advance-table-filter-status');
        let aftAdvanceTableFilterColumn = $$('#aft-advance-table-filter-column');

        multiDropdown.generate(filters.MachineNameList, aftAdvanceTableFilterFinished);
        multiDropdown.generate(filters.JackpotNameList, aftAdvanceTableFilterJackpot);

        let types = table.parseFilterValues(filters.TypeList, 'Name', 'Id', -1);
        multiDropdown.generate(types, aftAdvanceTableFilterType);

        let statuses = table.parseFilterValues(filters.StatusList, 'Name', 'Id', -1);
        multiDropdown.generate(statuses, aftAdvanceTableFilterStatus);
        //set up columns selection dropdown
        aftAdvanceTableFilterColumn.classList.add('table-element-select-columns');
        aftAdvanceTableFilterColumn.dataset.target = tableSettings.tableContainerSelector;
        let hideableColumns = table.getHideableColumns(tableSettings);
        hideableColumns.unshift({name: '-', value: null});
        //ToDo Neske: this can be removed when solution for parsed hack is found
        let columns = hideableColumns.map(function (item) {
            item.parsed = true;
            return item;
        });
        multiDropdown.generate(columns, aftAdvanceTableFilterColumn);
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

    function prepareAftFiltersForApi(currentTableSettingsObject) {
        let pageFilters = table.collectFiltersFromPage(currentTableSettingsObject);
        let sortDirection = currentTableSettingsObject.sort.SortDirection;
        let sortName = currentTableSettingsObject.sort.SortName;

        let filtersForApi = {
            'EndpointId': currentTableSettingsObject.endpointId,
            'DateFrom': pageFilters.DateRange !== null ? pageFilters.DateRange[0] : pageFilters.DateRange,
            'DateTo': pageFilters.DateRange !== null ? pageFilters.DateRange[0] : pageFilters.DateRange,
            'MachineList': pageFilters.MachineList,
            'JackpotList': pageFilters.JackpotList,
            'Status': pageFilters.Status,
            'Type': pageFilters.Type,
            'BasicData': {
                'Page': currentTableSettingsObject.activePage,
                'PageSize': table.getPageSize(currentTableSettingsObject),
                'SortOrder': sortDirection,
                'SortName': aftSortName[sortName] !== undefined ? aftSortName[sortName] : null
            },
            'TokenInfo': sessionStorage.token
        };

        //reset to page 1 if filters are changed
        table.setFiltersPage(currentTableSettingsObject, filtersForApi);
        //Set visible columns for tableSettings object
        currentTableSettingsObject.visibleColumns = pageFilters.Columns;
        currentTableSettingsObject.filters = filtersForApi;

        return filtersForApi;
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

    function showAdvanceTableFilter() {
        advanceTableFilter.classList.add('advance-filter-active');
        advanceTableFilterActive.classList.remove('hidden');
    }

    function clearAftFilters() {
        //reset page to 1
        currentTableSettingsObject.activePage = 1;
        currentTableSettingsObject.visibleColumns = [];
        currentTableSettingsObject.filters = null;
      /*  trigger('clear/dropdown/filter', {data: advanceTableFilterActive});
        trigger('filters/show-selected-filters', {
            active: advanceTableFilterActive,
            infobar: advanceTableFilterInfobar
        });*/
        filterAftTable(true);
    }

    function showSelectedFilters(filterActive, filterInfobar) {
        for (let count = 0; count < filterActive.children.length - 1; count++) {
            if (filterActive.children[count].children[1].children[0].dataset && filterActive.children[count].children[1].children[0].dataset.value !== '-') {
                filterInfobar.children[1].children[count].children[0].innerHTML = filterActive.children[count].children[0].innerHTML;
                filterInfobar.children[1].children[count].children[1].innerHTML = filterActive.children[count].children[1].children[0].title;
                filterInfobar.children[1].children[count].title = filterActive.children[count].children[1].children[0].title;
                filterInfobar.children[1].children[count].classList.remove('hidden');
            } else {
                filterInfobar.children[1].children[count].classList.add('hidden');
            }
        }
        for (let isHidden of filterInfobar.children[1].children) {
            if (isHidden.classList && !isHidden.classList.contains('hidden') && !isHidden.classList.contains('button-wrapper')) {
                filterInfobar.classList.remove('hidden');
                return;
            } else {
                filterInfobar.classList.add('hidden');
            }
        }
    }
})();