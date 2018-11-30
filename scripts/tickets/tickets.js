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
        tableSettings.paginationEvent = 'communicate/tickets/PreviewTicketAction';
        tableSettings.endpointId = ticketId;
        tableSettings.id = '';
        tableSettings.forceRemoveHeaders = true;
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = false;
        tableSettings.filtersInitialized = false;

        table.init(tableSettings); //initializing table, filters and page size

        /*        let addTransactionButton = $$('#page-tickets').getElementsByClassName('tickets-add-transaction')[0];
                addTransactionButton.addEventListener('click', function () {
                    trigger('communicate/tickets/getTickets');
                });*/

        trigger('tickets/tab/appearance/init', {tableSettings: tableSettings});
        trigger('tickets/tab/maxValue/init', {tableSettings: tableSettings});
        trigger('tickets/tab/smsSettings/init', {tableSettings: tableSettings});
    });
})();