const tickets = (function () {
    on('tickets/activated', function (params) {

        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);


        let ticketId = params.params[0].value;
        console.log(ticketId);

        let tableSettings = {};
        tableSettings.forceRemoveHeaders = true;
        tableSettings.tableContainerSelector = '#table-container-tickets';
        tableSettings.filterContainerSelector = '#tickets-advance-table-filter-active';
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = false;
        tableSettings.dataEvent = 'communicate/tickets/getTickets';
        tableSettings.id = '';
        tableSettings.endpointId = ticketId;

        table.init(tableSettings);
        // ticketsFilter.initFilters(tableSettings);
    });
})();