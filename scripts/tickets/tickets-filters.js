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
        let endpointId = params.endpointId;
        getFiltersFromAPI(endpointId);
    });

    on('tickets/filters/display', function (params) {
        let apiResponseData = params.data;
        let filters = apiResponseData.Data;
        displayFilters(filters);
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

    function displayFilters(filters, tableSettings) {
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

        dropdown.generate({ optionValue: filters.TicketStateList, parent: ticketsAdvanceTableFiltersStatus, type: 'multi' });
        dropdown.generate({ optionValue: filters.TypesList, parent: ticketsAdvanceTableFiltersTypes, type: 'multi' });
        dropdown.generate({ optionValue: filters.PrintedAndRedeemed, parent: ticketsAdvanceTableFiltersPrinted, type: 'multi' });
        dropdown.generate({ optionValue: filters.PrintedAndRedeemed, parent: ticketsAdvanceTableFiltersRedeemed, type: 'multi' });

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

        dropdown.generate({optionValue: columns,parent:ticketsAdvanceTableFilterColumn, type: 'multi'});

    }

    function prepareTicketFilters() {
        let table = $$('#table-container-tickets');
        let printDate = $$('#tickets-advance-table-filter-print-date').children[1].children[0].dataset.value;
        let printDateFrom = null;
        let printDateTo = null;
        if (printDate !== 'null') {
            printDateFrom = $$('#tickets-advance-table-filter-date-range').children[1].children[0].dataset.value.split(',')[0];
            printDateTo = $$('#tickets-advance-table-filter-date-range').children[1].children[0].dataset.value.split(',')[1];
        }

        let redeemedDate = $$('#tickets-advance-table-filter-redeem-date').children[1].children[0].dataset.value;
        let redeemedDateFrom = null;
        let redeemedDateTo = null;
        if (redeemedDate !== 'null') {
            redeemedDateFrom = $$('#tickets-advance-table-filter-redeem-date').children[1].children[0].dataset.value.split(',')[0];
            redeemedDateTo = $$('#tickets-advance-table-filter-redeem-date').children[1].children[0].dataset.value.split(',')[1];
        }


        let statuses = $$('#tickets-advance-table-filter-status').children[1].get();
        let types = $$('#tickets-advance-table-filter-types').children[1].get();
        let printed = $$('#tickets-advance-table-filter-printed').children[1].get();
        let redeemed = $$('#tickets-advance-table-filter-redeemed').children[1].get();

        let filters = {
            'EndpointId': table.settings.endpointId,
            'DateFrom': printDateFrom,
            'DateTo': printDateTo,
            'RedeemDateFrom': redeemedDateFrom,
            'RedeemDateTo': redeemedDateTo,
            'PrintedList': printed,
            'RedeemList': redeemed,
            'Status': statuses,
            'Type': types,
        };

        filters = table.getFilters(filters);
        //mark hidden columns
        let visibleColumns = $$('#tickets-advance-table-filter-column').children[1].get();
        if (visibleColumns === 'null') {
            visibleColumns = [];
        }
        table.setVisibleColumns(visibleColumns);
        return filters;
    }
})();

