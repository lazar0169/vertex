const ticketsFilter = (function () {
    let ticketAdvanceFilter = $$('#tickets-advance-table-filter');
    let advanceTableFilterActive = $$('#tickets-advance-table-filter-active');
    let ticketsMachinesNumbers = $$('#tickets-machines-number');
    let ticketsAdvanceFilterApllyButton = $$('#tickets-advance-table-filter-apply').getElementsByClassName('btn-success')[0];
    let ticketsAdvanceFilterCancelButton = $$('#tickets-advance-table-filter-clear').getElementsByClassName('btn-cancel')[0];

    dropdown.generate(machinesNumber, ticketsMachinesNumbers);
    console.log('List of page sizes: ', machinesNumber);

    let currentTableSettingsObject;

    function showAdvanceTableFilter() {
        ticketAdvanceFilter.classList.toggle('tickets-advance-active');
        advanceTableFilterActive.classList.toggle('hidden');
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
        let ticketsAdvanceTableFiltersStates = $$('#tickets-advance-table-filter-states');
        let ticketsAdvanceTableFiltersTypes = $$('#tickets-advance-table-filter-types');
        let ticketsAdvanceTableFiltersPrintedRedeemed = $$('#tickets-advance-table-filter-printed-redeemed');
        let ticketsAdvanceTableFilterColumn = $$('#tickets-advance-table-filter-column');

        let colNames = getColNamesOfTable(tableSettings);

        multiDropdown.generate(filters.TicketStateList, ticketsAdvanceTableFiltersStates);
        multiDropdown.generate(filters.TypesList, ticketsAdvanceTableFiltersTypes);
        dropdownDate.generate(filters.PrintedAndRedeemed, ticketsAdvanceTableFiltersPrintedRedeemed);
        multiDropdown.generate(colNames, ticketsAdvanceTableFilterColumn);
    }

    on('tickets/filters/display', function (params) {
        let apiResponseData = params.data;
        let tableSettings = params.tableSettings;
        let filters = apiResponseData.Data;
        tableSettings.filters = filters;
        tableSettings.filtersInitialized = true;
        displayFilters(filters, tableSettings);
    });

    ticketsAdvanceFilterApllyButton.addEventListener('click', function () {
        alert('Apply filters tickets');
        let pageFilters = table.collectFiltersFromPage(currentTableSettingsObject);
        console.log('page filters in collect filters from page', pageFilters);
        let sorting = table.getSorting(currentTableSettingsObject);
        let filtersForApi = {
            "EndpointId": currentTableSettingsObject.endpointId,
            "DateFrom": pageFilters.DateRange !== null ? pageFilters.DateRange[0] : pageFilters.DateRange,
            "DateTo": pageFilters.DateRange !== null ? pageFilters.DateRange[0] : pageFilters.DateRange,
            "MachineList": pageFilters.MachineList,
            "JackpotList": pageFilters.JackpotList,
            "Status": pageFilters.Status,
            "Type": pageFilters.Type,
            "BasicData": {
                "Page": 1,
                "PageSize": parseInt(pageFilters.PageSize, 10),
                "SortOrder": sorting.SortOrder,
                "SortName": sorting.SortName
            },
            "TokenInfo": sessionStorage.token
        };
        currentTableSettingsObject.ColumnsToShow = pageFilters.Columns;

        currentTableSettingsObject.filters = filtersForApi;

        console.log('Filters for API', filtersForApi);

        trigger('communicate/tickets/previewTransactions', {
            data: filtersForApi,
            tableSettings: currentTableSettingsObject
        });

    });

    ticketsAdvanceFilterCancelButton.addEventListener('click', function () {
        trigger('clear/dropdown/filter', {data: advanceTableFilterActive});
    });

})();

