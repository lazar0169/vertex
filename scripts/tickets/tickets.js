const tickets = (function () {
    on('tickets/activated', function (params) {

        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);

        let ticketId = params.params[0].value;

        selectTab('tickets-tab');
        selectInfoContent('tickets-tab');

        let tableSettings = {};
        tableSettings.pageSelectorId = '#page-tickets';
        tableSettings.tableContainerSelector = '#table-container-tickets';
        tableSettings.filterContainerSelector = '#tickets-advance-table-filter-active';
        tableSettings.dataEvent = 'communicate/tickets/getTickets';
        tableSettings.updateEvent = 'table/update';
        tableSettings.processRemoteData = 'communicate/tickets/data/prepare';
        tableSettings.paginationEvent = 'communicate/tickets/PreviewTicketAction';
        tableSettings.endpointId = ticketId;
        tableSettings.sortActiveColumn = 'issuedby';
        tableSettings.id = '';
        tableSettings.forceRemoveHeaders = true;
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = false;
        tableSettings.filtersInitialized = false;

        table.init(tableSettings); //initializing table, filters and page size

        trigger('tickets/tab/appearance', {tableSettings: tableSettings});
        trigger('tickets/tab/maxValue', {tableSettings: tableSettings});
        trigger('tickets/tab/smsSettings', {tableSettings: tableSettings});
    });
})();