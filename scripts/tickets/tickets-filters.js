const ticketsFilter = (function () {
    let advanceTableFilter = $$('#tickets-advance-table-filter');
    let advanceTableFilterActive = $$('#tickets-advance-table-filter-active');
    let ticketAdvanceFilterButton = $$('#tickets-advance-table-filter').children[0];
    let advanceTableFilterInfobar = $$('#ticket-advance-table-filter-active-infobar');
    //ToDo:Nikola vidi cemu sluzi ovo
    let clearAdvanceFilterInfobar = $$('#ticket-advance-table-filter-active-infobar-button').children[0];
    let ticketsAdvanceFilterApplyButton = $$('#tickets-advance-table-filter-apply').children[0];
    let ticketsAdvanceFilterCancelButton = $$('#tickets-advance-table-filter-clear').children[0];

    //region event listeners
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
    //endregion

    //region module events
    on('tickets/filters/init', function (params) {
        let endpointId = params.endpointId;
        getFiltersFromAPI(endpointId);
    });

    on('tickets/filters/display', function (params) {
        let apiResponseData = params.data;
        let filters = apiResponseData.Data;
        displayFilters(filters);
    });
    on('tickets/table/filter', function (params) {
        filterTicketsTable();
    });
    //endregion

    //region helper functions
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

    function getFiltersFromAPI(endpointId) {
        let data = {
            'EndpointId': endpointId
        };
        let successEvent = 'tickets/filters/display';
        trigger(communication.events.tickets.getFilters, {
            data: data,
            successEvent: successEvent,
        });
    }

    function displayFilters(filters) {
        //filter elements
        let ticketsAdvanceTableFiltersStatus = $$('#tickets-advance-table-filter-status');
        let ticketsAdvanceTableFiltersTypes = $$('#tickets-advance-table-filter-types');
        let ticketsAdvanceTableFiltersPrinted = $$('#tickets-advance-table-filter-printed');
        let ticketsAdvanceTableFiltersRedeemed = $$('#tickets-advance-table-filter-redeemed');
        let ticketsAdvanceTableFilterColumn = $$('#tickets-advance-table-filter-column');
        let ticketsAdvanceTableFiltersPrintDate = $$('#tickets-advance-table-filter-print-date');
        let ticketsAdvanceTableFiltersRedeemDate = $$('#tickets-advance-table-filter-redeem-date');

        dropdownDate.generate({ values: filters.PeriodList, parent: ticketsAdvanceTableFiltersPrintDate, name: 'PeriodList' });
        dropdownDate.generate({ values: filters.PeriodList, parent: ticketsAdvanceTableFiltersRedeemDate, name: 'PeriodList' });

        dropdown.generate({ values: filters.TicketStateList, parent: ticketsAdvanceTableFiltersStatus, type: 'multi' });
        dropdown.generate({ values: filters.TypesList, parent: ticketsAdvanceTableFiltersTypes, type: 'multi' });
        dropdown.generate({ values: filters.PrintedAndRedeemed, parent: ticketsAdvanceTableFiltersPrinted, type: 'multi' });
        dropdown.generate({ values: filters.PrintedAndRedeemed, parent: ticketsAdvanceTableFiltersRedeemed, type: 'multi' });

        //hide/show columns picker
        let ticketsTable = $$('#table-container-tickets');
        let columns = [];
        //add no select element
        columns.push({
            Name:'-',
            Id: -1
        });
        for (let columnKey in ticketsTable.settings.columns) {
            let column = ticketsTable.settings.columns[columnKey];
            if (column.hideable === true) {
                columns.push({
                    Id: column.column,
                    Name: column.column
                })
            }
        }

        dropdown.generate({values: columns,parent:ticketsAdvanceTableFilterColumn, type: 'multi'});
    }

    function prepareTicketFilters() {
        let table = $$('#table-container-tickets');

        let statuses = $$('#tickets-advance-table-filter-status').children[1].get();
        let types = $$('#tickets-advance-table-filter-types').children[1].get();
        let printed = $$('#tickets-advance-table-filter-printed').children[1].get();
        let redeemed = $$('#tickets-advance-table-filter-redeemed').children[1].get();

        let filters = {
            'EndpointId': table.settings.endpointId,
            'SelectedPeriod': $$('#tickets-advance-table-filter-print-date').children[1].get(),
            'SelectedPeriodRedeemed': $$('#tickets-advance-table-filter-redeem-date').children[1].get(),
            'PrintedList': printed,
            'RedeemList': redeemed,
            'Status': statuses,
            'Type': types,
        };

        filters = table.getFilters(filters);
        //mark hidden columns
        let visibleColumns = $$('#tickets-advance-table-filter-column').children[1].get();
        table.setVisibleColumns(visibleColumns);
        return filters;
    }
})();

