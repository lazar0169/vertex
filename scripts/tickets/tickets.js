const tickets = (function () {

    /*********************----Module Events------*********************/
    on('tickets/activated', function (params) {

        let ticketId = params.params[0].value;

        selectTab('tickets-tab');
        selectInfoContent('tickets-tab');

        let tableSettings = {};
        tableSettings.pageSelectorId = '#page-tickets';
        tableSettings.tableContainerSelector = '#table-container-tickets';
        tableSettings.filtersContainerSelector = '#tickets-filter';
        tableSettings.getDataEvent = communication.events.tickets.getTickets;
        tableSettings.filterDataEvent = communication.events.tickets.previewTickets;
        tableSettings.updateEvent = 'table/update';
        tableSettings.processRemoteData = communication.events.tickets.parseRemoteData;
        tableSettings.endpointId = ticketId;
        tableSettings.id = '';
        tableSettings.stickyRow = true;
        tableSettings.onDrawRowCell = 'tickets/table/drawCell';
        tableSettings.exportTo = {
            pdf:{
                value: communication.events.tickets.exportToPDF,
                type : table.exportTypes.event
            },
            xls: {
                value: communication.events.tickets.exportToXLS,
                type : table.exportTypes.event
            }
        };

        table.init(tableSettings); //initializing table, filters and page size

        trigger('tickets/tab/appearance', {tableSettings: tableSettings});
        trigger('tickets/tab/maxValue', {tableSettings: tableSettings});
        trigger('tickets/tab/smsSettings', {tableSettings: tableSettings});
    });
    on('tickets/table/drawCell', function (params) {
        onDrawTableCell(params.key, params.value, params.element, params.position, params.rowData);
    });
    on('showing-tickets-top-bar-value', function (data) {
        topBarInfoBoxValue(data.dataItemValue)
    });

    /*********************----Helper functions------*********************/
    function topBarInfoBoxValue(data) {
        let topBarValueCashable = $$('#top-bar-tickets').getElementsByClassName('element-cashable-active-tickets-value');
        topBarValueCashable[0].innerHTML = formatFloatValue(data.SumCashable);
        let topBarNumberOfCashableTickets = $$('#top-bar-tickets').getElementsByClassName('element-cashable-active-tickets-number');
        topBarNumberOfCashableTickets[0].innerHTML = `/${data.NumOfCashable}`;

        let topBarInfoPromoValue = $$('#top-bar-tickets').getElementsByClassName('element-promo-active-tickets-value');
        topBarInfoPromoValue[0].innerHTML = formatFloatValue(data.SumPromo);
        let topBarnumberOfPromoTickets = $$('#top-bar-tickets').getElementsByClassName('element-promo-active-tickets-number');
        topBarnumberOfPromoTickets[0].innerHTML = `/${data.NumOfPromo}`;
    }

    function onDrawTableCell(column, cellContent, cell, position, entryData) {
        if (column === 'issuedBy' || column === 'redeemedBy') {
            cell.classList.add('flex-column');
            cell.classList.add('justify-content-start');
            cell.classList.add('align-items-start');
        }
        if (column === 'issuedBy') {
            cell.innerHTML = `<time class='table-time'>${entryData.data.issuedAt}</time><label>${entryData.rowData.issuedBy}</label>`;
        } else if (column === 'redeemedBy') {
            cell.innerHTML = `<time class='table-time'>${entryData.data.redeemedAt}</time><label>${entryData.rowData.redeemedBy}</label>`;
        } else if (column === 'type') {
            if (entryData.type === 'CashableTicket') {
                cell.innerHTML = '<i class="tickets-cashable"></i>' + localization.translateMessage(entry.EntryData.TicketType);
            }
        } else if (column === 'amount') {
            cell.classList.add('text-right');
        }
    }
})();