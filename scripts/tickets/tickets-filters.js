const ticketsFilter = (function () {

    let advanceTableFilter = $$('#tickets-advance-table-filter');
    let advanceTableFilterActive = $$('#tickets-advance-table-filter-active');
    let ticketAdvanceFilterButton = $$('#tickets-advance-table-filter').children[0];
    let ticketsMachinesNumbers = $$('#tickets-machines-number');
    let advanceTableFilterInfobar = $$('#ticket-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#ticket-advance-table-filter-active-infobar-button').children[0];
    let ticketsAdvanceFilterApplyButton = $$('#tickets-advance-table-filter-apply').children[0];
    let ticketsAdvanceFilterCancelButton = $$('#tickets-advance-table-filter-clear').children[0];

    dropdown.generate({ optionValue: machinesNumber, element: ticketsMachinesNumbers })
    // dropdown.generate(machinesNumber, ticketsMachinesNumbers);

    let activeHeadElement;


    /*********************----Events Listeners------*********************/

    ticketsAdvanceFilterApplyButton.addEventListener('click', function () {
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        filterTicketsTable();
    });

    ticketsAdvanceFilterCancelButton.addEventListener('click', removeSelectedFilters);
    clearAdvanceFilterInfobar.addEventListener('click', clearTicketsFilters);
    ticketAdvanceFilterButton.addEventListener('click', function () {
        advanceTableFilter.classList.toggle('advance-filter-active');
        trigger('opened-arrow', { div: advanceTableFilter.children[0] });
        advanceTableFilterActive.classList.toggle('hidden');
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
    on('tickets/filters/filter-table', function (params) {
        filterTicketsTable(params.showFilters);
    });

    /*********************----Helper functions----*********************/
    function getActiveTableSettings() {
        return $$('#table-container-tickets').tableSettings;

    }

    function filterTicketsTable() {

        let params = {};
        let tableSettings = getActiveTableSettings();
        params.tableSettings = tableSettings;
        params.data = prepareTicketsFiltersForApi(tableSettings);
        params.activeFiltersElement = advanceTableFilterActive;
        params.infobarElement = advanceTableFilterInfobar;
        trigger('table/filter', params);
    }

    function removeSelectedFilters() {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
    }

    function clearTicketsFilters() {
        removeSelectedFilters();
        let tableSettings = getActiveTableSettings();
        tableSettings.activePage = 1;
        tableSettings.visibleColumns = [];
        tableSettings.filters = null;
        filterTicketsTable();
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

        // let states = table.parseFilterValues(filters.TicketStateList, 'Name', 'Id', -1);
        dropdown.generate({ optionValue: filters.TicketStateList, element: ticketsAdvanceTableFiltersStatus, type: 'multi' });
        // let types = table.parseFilterValues(filters.TypesList, 'Name', 'Id', -1);
        dropdown.generate({ optionValue: filters.TypesList, element: ticketsAdvanceTableFiltersTypes, type: 'multi' });
        dropdown.generate({ optionValue: filters.PrintedAndRedeemed, element: ticketsAdvanceTableFiltersPrinted, type: 'multi' });
        dropdown.generate({ optionValue: filters.PrintedAndRedeemed, element: ticketsAdvanceTableFiltersRedeemed, type: 'multi' });
        //hide/show columns picker
        ticketsAdvanceTableFilterColumn.classList.add('table-element-select-columns');
        ticketsAdvanceTableFilterColumn.dataset.target = tableSettings.tableContainerSelector;
        let hideableColumns = table.getHideableColumns(tableSettings);
        hideableColumns.unshift({ Name: '-', Id: null });
        //ToDo Neske: this can be removed when solution for parsed hack is found
        // let columns = hideableColumns.map(function (item) {
        //     item.parsed = true;
        //     return item;
        // });
        dropdown.generate({ optionValue: hideableColumns, element: ticketsAdvanceTableFilterColumn, type: 'multi' });
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
            'PrintedList': pageFilters.Printed,
            'RedeemList': pageFilters.Redeemed,
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
})();

