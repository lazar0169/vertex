const ticketsFilter = (function () {

    let advanceTableFilter = $$('#tickets-advance-table-filter');
    let advanceTableFilterActive = $$('#tickets-advance-table-filter-active');
    let ticketAdvanceFilterButton = $$('#tickets-advance-table-filter').children[0];
    let advanceTableFilterInfobar = $$('#ticket-advance-table-filter-active-infobar');
    let clearAdvanceFilterInfobar = $$('#ticket-advance-table-filter-active-infobar-button').children[0];
    let ticketsAdvanceFilterApplyButton = $$('#tickets-advance-table-filter-apply').children[0];
    let ticketsAdvanceFilterCancelButton = $$('#tickets-advance-table-filter-clear').children[0];

    //let ticketsMachinesNumbers = $$('#tickets-machines-number');
    //dropdown.generate({ optionValue: machinesNumber, parent: ticketsMachinesNumbers });




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
    on('tickets/filters/filter-table', function (params) {
        filterTicketsTable();
    });




    function filterTicketsTable() {
        let filters = prepareTicketFilters();
        trigger('preloader/show');
        trigger(communication.events.tickets.previewTickets,{data:filters});
    }

    function removeSelectedFilters() {
        trigger('clear/dropdown/filter', { data: advanceTableFilterActive });
    }

    function clearTicketsFilters() {
        removeSelectedFilters();
        $$('#table-container-tickets').resetFilters();
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
        dropdown.generate({ optionValue: filters.TicketStateList, parent: ticketsAdvanceTableFiltersStatus, type: 'multi' });
        // let types = table.parseFilterValues(filters.TypesList, 'Name', 'Id', -1);
        dropdown.generate({ optionValue: filters.TypesList, parent: ticketsAdvanceTableFiltersTypes, type: 'multi' });
        dropdown.generate({ optionValue: filters.PrintedAndRedeemed, parent: ticketsAdvanceTableFiltersPrinted, type: 'multi' });
        dropdown.generate({ optionValue: filters.PrintedAndRedeemed, parent: ticketsAdvanceTableFiltersRedeemed, type: 'multi' });
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
        dropdown.generate({ optionValue: hideableColumns, parent: ticketsAdvanceTableFilterColumn, type: 'multi' });
    }

    function prepareTicketFilters() {
        let table = $$('#table-container-aft');
        let date = $$('#aft-advance-table-filter-date-range').children[1].children[0].dataset.value;
        let dateFrom = null;
        let dateTo = null;
        if (date !== 'null') {
            dateFrom = $$('#aft-advance-table-filter-date-range').children[1].children[0].dataset.value.split(',')[0];
            dateTo = $$('#aft-advance-table-filter-date-range').children[1].children[0].dataset.value.split(',')[1];
        }
        let machineList = $$('#aft-advance-table-filter-finished').children[1].get();
        let jackpotList = $$('#aft-advance-table-filter-jackpot').children[1].get();
        let statusesList = $$('#aft-advance-table-filter-status').children[1].get();
        let typesList = $$('#aft-advance-table-filter-type').children[1].get();

        let filters = {
            'EndpointId': table.settings.endpointId,
            'DateFrom': dateFrom,
            'DateTo': dateTo,
            'MachineList': machineList === 'null' ? null : machineList.split(','),
            'JackpotList': jackpotList === 'null' ? null : jackpotList.split(','),
            'Status': statusesList === 'null' ? null : statusesList.split(','),
            'Type': typesList === 'null' ? null : typesList.split(','),
        };
        console.log('filters in prepareAftFilters',filters);
        filters = table.getFilters(filters);
        //mark hidden columns
        let visibleColumns = $$('#ticket-advance-table-filter-column').children[1].get();
        if (visibleColumns === 'null') {
            visibleColumns = [];
        }
        table.setVisibleColumns(visibleColumns);


        return filters;
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

