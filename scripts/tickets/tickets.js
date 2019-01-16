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
        tableSettings.prepareDataEvent = 'communicate/tickets/data/prepare';
        tableSettings.paginationEvent = 'communicate/tickets/PreviewTicketAction';
        tableSettings.endpointId = ticketId;
        tableSettings.sortActiveColumn = 'issuedby';
        tableSettings.id = '';
        tableSettings.forceRemoveHeaders = true;
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = false;
        tableSettings.filtersInitialized = false;

        table.init(tableSettings); //initializing table, filters and page size

        trigger('tickets/tab/appearance', { tableSettings: tableSettings });
        trigger('tickets/tab/maxValue', { tableSettings: tableSettings });
        trigger('tickets/tab/smsSettings', { tableSettings: tableSettings });

        function topBarInfoBoxValue(data) {
            let topBarValueCashable = $$('#top-bar-tickets').getElementsByClassName('element-cashable-active-tickets-value');
            topBarValueCashable[0].innerHTML = data.SumCashable;
            let topBarNumberOfCashableTickets = $$('#top-bar-tickets').getElementsByClassName('element-cashable-active-tickets-number');
            topBarNumberOfCashableTickets[0].innerHTML = `/${data.NumOfCashable}`;

            let topBarInfoPromoValue = $$('#top-bar-tickets').getElementsByClassName('element-promo-active-tickets-value');
            topBarInfoPromoValue[0].innerHTML = data.SumPromo;
            let topBarnumberOfPromoTickets = $$('#top-bar-tickets').getElementsByClassName('element-promo-active-tickets-number');
            topBarnumberOfPromoTickets[0].innerHTML = `/${data.NumOfPromo}`;
        }

        on('showing-tickets-top-bar-value', function (data) {
            topBarInfoBoxValue(data.dataItemValue)
            
        });

    });
})();