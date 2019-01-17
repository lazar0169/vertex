const ticketsFilter = (function () {

    let ticketAdvanceFilter = $$('#tickets-advance-table-filter');
    let advanceTableFilterActive = $$('#tickets-advance-table-filter-active');
    let ticketsMachinesNumbers = $$('#tickets-machines-number');
    let advanceTableFilterInfobar = $$('#ticket-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#ticket-advance-table-filter-active-infobar-button').children[0];
    let ticketsAdvanceFilterApllyButton = $$('#tickets-advance-table-filter-apply').children[0];
    let ticketsAdvanceFilterCancelButton = $$('#tickets-advance-table-filter-clear').children[0];

    dropdown.generate(machinesNumber, ticketsMachinesNumbers);

    let activeHeadElement;


    /*********************----Events Listeners------*********************/
    ticketAdvanceFilter.addEventListener('click', function () {
        showAdvanceTableFilter();
    });

    ticketsAdvanceFilterApllyButton.addEventListener('click', function () {
        let filtersForApi = prepareTicketsFiltersForApi(currentTableSettingsObject);
        trigger(communication.events.tickets.previewTickets, {
            data: filtersForApi,
            tableSettings: currentTableSettingsObject
        });

        trigger('filters/show-selected-filters', {
            active: advanceTableFilterActive,
            infobar: advanceTableFilterInfobar
        });
    });

    ticketsAdvanceFilterCancelButton.addEventListener('click', function () {
        trigger('clear/dropdown/filter', {data: advanceTableFilterActive});
        trigger('filters/show-selected-filters', {
            active: advanceTableFilterActive,
            infobar: advanceTableFilterInfobar
        });
    });

    clearAdvanceFilterInfobar.addEventListener('click', function () {
        trigger('clear/dropdown/filter', {data: advanceTableFilterActive});
        trigger('filters/show-selected-filters', {
            active: advanceTableFilterActive,
            infobar: advanceTableFilterInfobar
        });
    });

    /*********************----Module Events----************************/

    on('tickets/filters/init', function (params) {
        let tableSettings = params.tableSettings;
        currentTableSettingsObject = tableSettings;
        getFiltersFromAPI(tableSettings);
    });
    on('tickets/filters/display', function (params) {
        let apiResponseData = params.data;
        let tableSettings = params.settingsObject;
        let filters = apiResponseData.Data;

        filters.PrintedAndRedeemed = formatTicketsApiData(filters.PrintedAndRedeemed);
        filters.TicketStateList = formatTicketsApiData(filters.TicketStateList);
        filters.TypesList = formatTicketsApiData(filters.TypesList);

        tableSettings.filters = filters;
        tableSettings.filtersInitialized = true;
        displayFilters(filters, tableSettings);
    });
    on('tickets/filters/pagination', function (params) {
        let tableSettings = params.tableSettings;
        let filtersForApi = prepareTicketsFiltersForApi(tableSettings);
        trigger(communication.events.tickets.previewTickets, {
            tableSettings: tableSettings,
            data: filtersForApi,
            callbackEvent: 'table/update'
        });
    });
    on('tickets/filters/sorting', function (params) {
        let tableSettings = params.tableSettings;
        activeHeadElement = currentTableSettingsObject.tableContainerElement.getElementsByClassName('sort-active');
        if (activeHeadElement !== null && activeHeadElement !== undefined) {
            let filtersForApi = prepareTicketsFiltersForApi(tableSettings);
            filtersForApi.BasicData.SortOrder = params.sorting.SortDirection;
            filtersForApi.BasicData.SortName = ticketSortName[params.sorting.SortName] !== undefined ? ticketSortName[params.sorting.SortName] : null;
            trigger(communication.events.tickets.previewTickets, {
                tableSettings: tableSettings,
                data: filtersForApi,
                callbackEvent: 'table/update'
            });
        }
    });
    on('tickets/filters/pageSize', function (params) {
        let tableSettings = params.tableSettings;
        let filtersForApi = prepareTicketsFiltersForApi(tableSettings);
        trigger(communication.events.tickets.previewTickets, {
            tableSettings: tableSettings,
            data: filtersForApi,
            callbackEvent: 'table/update'
        });
    })

    /*********************----Helper functions----*********************/

    function showAdvanceTableFilter() {
        ticketAdvanceFilter.classList.add('advance-filter-active');
        advanceTableFilterActive.classList.remove('hidden');
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

    function formatChooseColumnTicketsData(chooseColumnListArray) {
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

    //display initial filters
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

    function formatTicketsApiData(filterArray) {
        if (filterArray !== undefined && filterArray !== null) {
            filterArray.forEach(function (filter) {
                filter.Name = localization.translateMessage(filter.Name);
                filter.Value = filter.Name;
            });
            return filterArray;
        }
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

    function prepareTicketsFiltersForApi(currentTableSettingsObject) {
        let pageFilters = table.collectFiltersFromPage(currentTableSettingsObject);
        let sortDirection = currentTableSettingsObject.sort.sortDirection;
        let sortName = currentTableSettingsObject.sort.sortName;
        let filtersForApi = {
            'EndpointId': currentTableSettingsObject.endpointId,
            'DateFrom': pageFilters.PrintDate !== null ? pageFilters.PrintDate[0] : pageFilters.PrintDate,
            'DateTo': pageFilters.PrintDate !== null ? pageFilters.PrintDate[0] : pageFilters.PrintDate,
            'RedeemDateFrom': pageFilters.RedeemDate !== null ? pageFilters.RedeemDate[0] : pageFilters.RedeemDate,
            'RedeemDateTo': pageFilters.RedeemDate !== null ? pageFilters.RedeemDate[0] : pageFilters.RedeemDate,
            'PrintedList': preparePrintedListData(pageFilters.Printed),
            'RedeemList': prepareRedeemListData(pageFilters.Redeemed),
            'Status': pageFilters.Status,
            'Type': pageFilters.TypesList,
            'BasicData': {
                'Page': currentTableSettingsObject.activePage,
                'PageSize': parseInt(pageFilters.PageSize),
                'SortOrder': sortDirection,
                'SortName': ticketSortName[sortName] !== undefined ? ticketSortName[sortName] : null
            },
            'TokenInfo': sessionStorage.token
        };

        table.setFiltersPage(currentTableSettingsObject, filtersForApi);
        //Set visible columns for tableSettings object
        currentTableSettingsObject.visibleColumns = pageFilters.Columns;

        currentTableSettingsObject.filters = filtersForApi;

        return filtersForApi;
    }

})();

