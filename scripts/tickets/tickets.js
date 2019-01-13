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
        //tableSettings.dataEvent = 'communicate/tickets/getTickets';
        tableSettings.getDataEvent = communication.events.tickets.getTickets;
        tableSettings.updateEvent = 'table/update';
        //tableSettings.processRemoteData = 'communicate/tickets/data/prepare';
        tableSettings.processRemoteData = communication.events.tickets.parseRemoteData;
        //tableSettings.paginationEvent = 'communicate/tickets/PreviewTicketAction';
        tableSettings.endpointId = ticketId;
        tableSettings.sortActiveColumn = 'issuedby';
        tableSettings.id = '';
        tableSettings.forceRemoveHeaders = true;
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = false;
        tableSettings.filtersInitialized = false;

        tableSettings.onDrawRowCell = 'tickets/table/drawCell';

        table.init(tableSettings); //initializing table, filters and page size

        trigger('tickets/tab/appearance', {tableSettings: tableSettings});
        trigger('tickets/tab/maxValue', {tableSettings: tableSettings});
        trigger('tickets/tab/smsSettings', {tableSettings: tableSettings});
    });
    /*********************----Module Events------*********************/
    on('tickets/table/drawCell', function (params) {
        onDrawTableCell(params.key, params.value, params.element, params.position, params.rowData);
    });
    /*********************----Helper functions------*********************/
    function onDrawTableCell(column, cellContent, cell, position, entryData) {
        console.log(entryData);
         if (column === 'issuedBy' || column === 'redeemedBy') {
            cell.classList.add('flex-column');
            cell.classList.add('justify-content-start');
            cell.classList.add('align-items-start');
        }
         if (column === 'issuedBy') {
            cell.innerHTML = `<time class='table-time'>${entryData.data.issuedAt}</time><label>${entryData.rowData.issuedBy}</label>`;
         }
         else if (column === 'redeemedBy') {
             cell.innerHTML = `<time class='table-time'>${entryData.data.redeemedAt}</time><label>${entryData.rowData.redeemedBy}</label>`;
         }
         else if (column === 'type') {
             if (entryData.type === 'CashableTicket') {
                 cell.innerHTML = '<i class="tickets-cashable"></i>' + localization.translateMessage(entry.EntryData.TicketType);
             }
         }
         else if (column === 'amount'){
             cell.classList.add('text-right');
         }

    }
})();