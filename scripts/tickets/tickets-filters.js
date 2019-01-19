const ticketsFilter = (function () {

    let ticketAdvanceFilter = $$('#tickets-advance-table-filter');
    let advanceTableFilterActive = $$('#tickets-advance-table-filter-active');
    let ticketsMachinesNumbers = $$('#tickets-machines-number');
    let advanceTableFilterInfobar = $$('#ticket-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#ticket-advance-table-filter-active-infobar-button').children[0];
    let ticketsAdvanceFilterApplyButton = $$('#tickets-advance-table-filter-apply').children[0];
    let ticketsAdvanceFilterCancelButton = $$('#tickets-advance-table-filter-clear').children[0];

    dropdown.generate(machinesNumber, ticketsMachinesNumbers);

    let activeHeadElement;


    /*********************----Events Listeners------*********************/

    ticketsAdvanceFilterApplyButton.addEventListener('click', function () {
       filterTicketsTable(true);
    });

    ticketsAdvanceFilterCancelButton.addEventListener('click', removeSelectedFilters);
    clearAdvanceFilterInfobar.addEventListener('click', clearFilters);
    ticketAdvanceFilter.addEventListener('click', function () {
        showAdvanceTableFilter();
    });
    /*********************----Module Events----************************/

    on('tickets/filters/init', function (params) {
        let tableSettings = params.tableSettings;
        getFiltersFromAPI(tableSettings);
    });

    on('tickets/filters/display', function (params) {
        let apiResponseData = params.data;
        let tableSettings = params.settingsObject;
        let filters = apiResponseData.Data;

        console.log(filters);

        filters.PrintedAndRedeemed = formatTicketsApiData(filters.PrintedAndRedeemed);
        filters.TicketStateList = formatTicketsApiData(filters.TicketStateList);
        filters.TypesList = formatTicketsApiData(filters.TypesList);

        tableSettings.filtersInitialized = true;
        displayFilters(filters, tableSettings);
    });
    on('tickets/filters/pagination', function (params) {
       filterTicketsTable();
    });
    on('tickets/filters/sorting', function (params) {
        activeHeadElement = getActiveTableSettings().tableContainerElement.getElementsByClassName('sort-active');
        if (activeHeadElement !== null && activeHeadElement !== undefined) {
            filterTicketsTable();
        }
    });
    on('tickets/filters/pageSize', function (params) {
        let tableSettings = params.tableSettings;
        tableSettings.activePage = 1;
        filterTicketsTable();
    });
    on('tickets/filters/filter-table', function(params){
        filterTicketsTable(params.showFilters);
    });

    /*********************----Helper functions----*********************/
    function getActiveTableSettings() {
        return $$('#table-container-tickets').tableSettings;

    }
    function filterTicketsTable(showFilters) {
        if (showFilters === undefined) {
            showFilters = false;
        }
        let params = {};
        let tableSettings = getActiveTableSettings();
        params.tableSettings = tableSettings;
        params.data = prepareTicketsFiltersForApi(tableSettings);
        if (showFilters) {
            params.activeFiltersElement = advanceTableFilterActive;
            params.infobarElement = advanceTableFilterInfobar;
        }
        trigger('table/filter', params);

    }
    function removeSelectedFilters() {

    }
    function clearFilters() {
        removeSelectedFilters();
        let tableSettings = getActiveTableSettings();
        tableSettings.activePage = 1;
        tableSettings.visibleColumns = [];
        tableSettings.filters = null;
        filterTicketsTable(true);
    }
    function getFiltersFromAPI(tableSettings) {
        let data = {
            'EndpointId': tableSettings.endpointId
        };
        let tableSettingsObject = tableSettings;
        let successEvent = 'tickets/filters/display';
        trigger(communication.events.tickets.getFilters, {
            data: data,
            successEvent: successEvent,
            tableSettings: tableSettingsObject
        });
    }
    function displayFilters(filters, tableSettings) {
        //filter elements
        let ticketsAdvanceTableFiltersStatus = $$('#tickets-advance-table-filter-status');
        let ticketsAdvanceTableFiltersTypes = $$('#tickets-advance-table-filter-types');
        let ticketsAdvanceTableFiltersPrinted = $$('#tickets-advance-table-filter-printed');
        let ticketsAdvanceTableFiltersRedeemed = $$('#tickets-advance-table-filter-redeemed');
        let ticketsAdvanceTableFilterColumn = $$('#tickets-advance-table-filter-column');

        let states = table.parseFilterValues(filters.TicketStateList, 'Name', 'Id', -1);
        multiDropdown.generate(states, ticketsAdvanceTableFiltersStatus);
        let types = table.parseFilterValues(filters.TypesList, 'Name', 'Id', -1);
        multiDropdown.generate(types, ticketsAdvanceTableFiltersTypes);
        console.log(filters.PrintedAndRedeemed);
        multiDropdown.generate(filters.PrintedAndRedeemed, ticketsAdvanceTableFiltersPrinted);
        multiDropdown.generate(filters.PrintedAndRedeemed, ticketsAdvanceTableFiltersRedeemed);

        //hide/show columns picker
        ticketsAdvanceTableFilterColumn.classList.add('table-element-select-columns');
        ticketsAdvanceTableFilterColumn.dataset.target = tableSettings.tableContainerSelector;
        let hideableColumns = table.getHideableColumns(tableSettings);
        hideableColumns.unshift({name: '-', value: null});
        //ToDo Neske: this can be removed when solution for parsed hack is found
        let columns = hideableColumns.map(function (item) {
            item.parsed = true;
            return item;
        });
        multiDropdown.generate(columns, ticketsAdvanceTableFilterColumn);
    }
    function showAdvanceTableFilter() {
        ticketAdvanceFilter.classList.add('advance-filter-active');
        advanceTableFilterActive.classList.remove('hidden');
    }
    function formatTicketsApiData(filterArray) {
        if (filterArray !== undefined && filterArray !== null) {
            filterArray.forEach(function (filter) {
                filter.Name = localization.translateMessage(filter.Name);
                filter.Value = filter.Name;
            });
            return filterArray;
        }
    }
    function prepareTicketsFiltersForApi(activeTableSettings) {
        if (activeTableSettings === undefined) {
            activeTableSettings = getActiveTableSettings();
        }
        let pageFilters = table.collectFiltersFromPage(activeTableSettings);
        let sortDirection = activeTableSettings.sort.sortDirection;
        let sortName = activeTableSettings.sort.sortName;
        let filtersForApi = {
            'EndpointId': activeTableSettings.endpointId,
            'DateFrom': pageFilters.PrintDate !== null ? pageFilters.PrintDate[0] : pageFilters.PrintDate,
            'DateTo': pageFilters.PrintDate !== null ? pageFilters.PrintDate[0] : pageFilters.PrintDate,
            'RedeemDateFrom': pageFilters.RedeemDate !== null ? pageFilters.RedeemDate[0] : pageFilters.RedeemDate,
            'RedeemDateTo': pageFilters.RedeemDate !== null ? pageFilters.RedeemDate[0] : pageFilters.RedeemDate,
            'PrintedList': preparePrintedListData(pageFilters.Printed),
            'RedeemList': prepareRedeemListData(pageFilters.Redeemed),
            'Status': pageFilters.Status,
            'Type': pageFilters.TypesList,
            'BasicData': {
                'Page': activeTableSettings.activePage,
                'PageSize': parseInt(pageFilters.PageSize),
                'SortOrder': sortDirection,
                'SortName': sortName
            },
            'TokenInfo': sessionStorage.token
        };
        table.setFiltersPage(activeTableSettings, filtersForApi);
        //Set visible columns for tableSettings object
        activeTableSettings.visibleColumns = pageFilters.Columns;
        activeTableSettings.filters = filtersForApi;
        return filtersForApi;
    }

    function preparePrintedListData(dataArray) {
        let preparedPrintedListData = [];
        if (dataArray !== null && dataArray !== undefined) {
            dataArray.forEach(function (arrayElement) {
                let object = {
                    Name: arrayElement.toString(),
                    ID: parseInt(arrayElement)
                };
                preparedPrintedListData.push(object);
            });
        }
        if (preparedPrintedListData.length === 0) {
            preparedPrintedListData = null;
        }
        return preparedPrintedListData;
    }
    function prepareRedeemListData(dataArray) {
        let preparedRedeemListData = [];
        if (dataArray !== null && dataArray !== undefined) {
            dataArray.forEach(function (arrayElement) {
                let object = {
                    Name: arrayElement.toString(),
                    ID: parseInt(arrayElement)
                };
                preparedRedeemListData.push(object);
            });
        }
        if (preparedRedeemListData.length === 0) {
            preparedRedeemListData = null;
        }
        return preparedRedeemListData;
    }


})();

