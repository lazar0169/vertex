const ticketsFilter = (function () {

    let ticketSortName = {
        tickettype:  1,
        amount: 2,
        code: 3,
        cashoutedby: 4, //todo check if this is it
        redeemedby: 5, //todo check if this is it
        status: 9
    };

    let ticketAdvanceFilter = $$('#tickets-advance-table-filter');
    let advanceTableFilterActive = $$('#tickets-advance-table-filter-active');
    let ticketsMachinesNumbers = $$('#tickets-machines-number');
    let ticketsAdvanceFilterApllyButton = $$('#tickets-advance-table-filter-apply').getElementsByClassName('btn-success')[0];
    let ticketsAdvanceFilterCancelButton = $$('#tickets-advance-table-filter-clear').getElementsByClassName('btn-cancel')[0];

    dropdown.generate(machinesNumber, ticketsMachinesNumbers);

    let currentTableSettingsObject;
    let activeHeadElement;

    function showAdvanceTableFilter() {
        ticketAdvanceFilter.classList.add('advance-filter-active');
        advanceTableFilterActive.classList.remove('hidden');
    }

    ticketAdvanceFilter.addEventListener('click', function () {
        showAdvanceTableFilter();
    });

    function getFiltersFromAPI(tableSettings) {
        let data = {
            'EndpointId': tableSettings.endpointId
        };
        let tableSettingsObject = tableSettings;
        let successEvent = 'tickets/filters/display';
        trigger('communicate/tickets/getFilters', {
            data: data,
            successEvent: successEvent,
            tableSettings: tableSettingsObject
        });
    }

    on('tickets/filters/init', function (params) {
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
        
        let ticketsAdvanceTableFiltersStatus = $$('#tickets-advance-table-filter-status');
        let ticketsAdvanceTableFiltersTypes = $$('#tickets-advance-table-filter-types');
        let ticketsAdvanceTableFiltersPrinted = $$('#tickets-advance-table-filter-printed');
        let ticketsAdvanceTableFiltersRedeemed = $$('#tickets-advance-table-filter-redeemed');
        let ticketsAdvanceTableFilterColumn = $$('#tickets-advance-table-filter-column');

        let colNames = getColNamesOfTable(tableSettings);

       
        multiDropdown.generate(filters.TicketStateList, ticketsAdvanceTableFiltersStatus);
        multiDropdown.generate(filters.TypesList, ticketsAdvanceTableFiltersTypes);
        multiDropdown.generate(filters.PrintedAndRedeemed, ticketsAdvanceTableFiltersPrinted);
        multiDropdown.generate(filters.PrintedAndRedeemed, ticketsAdvanceTableFiltersRedeemed);
        multiDropdown.generate(colNames, ticketsAdvanceTableFilterColumn);
    }

    on('tickets/filters/display', function (params) {
        let apiResponseData = params.data;
        let tableSettings = params.settingsObject;
        let filters = apiResponseData.Data;
        tableSettings.filters = filters;
        tableSettings.filtersInitialized = true;
        displayFilters(filters, tableSettings);
    });


    function prepareTicketsFiltersForApi(currentTableSettingsObject) {
        let pageFilters = table.collectFiltersFromPage(currentTableSettingsObject);
        let sorting = table.getSorting(currentTableSettingsObject);
        let filtersForApi = {
            "EndpointId": currentTableSettingsObject.endpointId,
            "DateFrom": pageFilters.PrintDate !== null ? pageFilters.PrintDate[0] : pageFilters.PrintDate,
            "DateTo": pageFilters.PrintDate !== null ? pageFilters.PrintDate[0] : pageFilters.PrintDate,
            "RedeemDateFrom": pageFilters.RedeemDate !== null ? pageFilters.RedeemDate[0] : pageFilters.RedeemDate,
            "RedeemDateTo": pageFilters.RedeemDate !== null ? pageFilters.RedeemDate[0] : pageFilters.RedeemDate,
            "PrintedList": pageFilters.Printed,
            "RedeemList": pageFilters.Redeemed,
            "Status": pageFilters.Status,
            "Type": pageFilters.TypesList,
            "BasicData": {
                "Page": 1,
                "PageSize": parseInt(pageFilters.PageSize, 10),
                "SortOrder": sorting.SortOrder,
                "SortName": ticketSortName[sorting.SortName] !== undefined ? ticketSortName[sorting.SortName] : null
            },
            "TokenInfo": sessionStorage.token
        };
        currentTableSettingsObject.ColumnsToShow = pageFilters.Columns;

        currentTableSettingsObject.filters = filtersForApi;

        return filtersForApi;
    }

    ticketsAdvanceFilterApllyButton.addEventListener('click', function () {
        alert('Apply filters tickets');
        let filtersForApi = prepareTicketsFiltersForApi(currentTableSettingsObject);
        trigger('communicate/tickets/previewTickets', {
            data: filtersForApi,
            tableSettings: currentTableSettingsObject
        });

    });

    ticketsAdvanceFilterCancelButton.addEventListener('click', function () {
        trigger('clear/dropdown/filter', {data: advanceTableFilterActive});
    });

    on('tickets/filters/pagination', function (params) {
        let tableSettings = params.tableSettings;
        let filtersForApi = prepareTicketsFiltersForApi(tableSettings);
        trigger('communicate/tickets/previewTickets', {
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
            filtersForApi.BasicData.SortOrder = params.sorting.SortOrder;
            filtersForApi.BasicData.SortName = ticketSortName[params.sorting.SortName] !== undefined ? ticketSortName[params.sorting.SortName] : null;
            trigger('communicate/tickets/previewTickets', {
                tableSettings: tableSettings,
                data: filtersForApi,
                callbackEvent: 'table/update'
            });
        }
    });

    on('tickets/filters/pageSize', function (params) {
        let tableSettings = params.tableSettings;
        let filtersForApi = prepareTicketsFiltersForApi(tableSettings);
        trigger('communicate/tickets/previewTickets', {
            tableSettings: tableSettings,
            data: filtersForApi,
            callbackEvent: 'table/update'
        });
    })

})();

