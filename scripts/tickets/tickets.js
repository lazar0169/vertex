const tickets = (function () {

    const events = {
        activated: 'tickets/activated',
        getTickets: 'tickets/get',
        previewTickets: 'tickets/preview',
        filterTable: 'tickets/table/filter'
    };
    const ticketTableId = 'table-container-tickets';

    let ticketsTable = null;

    //region module events
    on(events.activated, function (params) {
        let ticketId = params.params[0].value;

        selectTab('tickets-tab');
        selectInfoContent('tickets-tab');

        trigger(communication.events.tickets.getTickets, { endpointId: ticketId });

        trigger('tickets/tab/appearance', { endpointId: ticketId });
        trigger('tickets/tab/maxValue', { endpointId: ticketId });
        trigger('tickets/tab/smsSettings', { endpointId: ticketId });
    });

    on(events.getTickets, function (params) {
        if (ticketsTable !== null) {
            ticketsTable.destroy();
        }
        ticketsTable = table.init({
            endpointId: params.additionalData,
            id: ticketTableId,
            pageSizeContainer: '#tickets-machines-number',
            exportButtonsContainer: '#wrapper-tickets-export-to',
            appearanceButtonsContainer: '#tickets-show-space'
        },
            params.data.Data);
        trigger('tickets/filters/init', { endpointId: params.additionalData });
        $$('#tickets-tab-info').appendChild(ticketsTable);
    });

    on(events.previewTickets, function (params) {
        let data = params.data.Data;
        $$(`#${ticketTableId}`).update(data);
        //ToDo: Nikola: ovde možeš da ubaciš onaj bar koji ide ispod filtera, samo treba da se trigeruje nešto ako se ne varam.
    });

    on(table.events.pageSize(ticketTableId), function () {
        trigger(events.filterTable);

    });
    on(table.events.sort(ticketTableId), function () {
        trigger(events.filterTable);

    });
    on(table.events.pagination(ticketTableId), function () {
        trigger(events.filterTable);

    });

    on(table.events.export(ticketTableId), function (params) {
        trigger('preloader/show');
        let ticketsTable = params.table;
        let filters = null;
        if (ticketsTable.settings.filters === null) {
            filters = {
                'EndpointId': ticketsTable.settings.endpointId,
                'DateFrom': null,
                'DateTo': null,
                'RedeemDateFrom': null,
                'RedeemDateTo': null,
                'PrintedList': [],
                'RedeemList': [],
                'Status': [],
                'Type': [],
                BasicData: {
                    SortOrder: null,
                    SortName: null
                },
            };
        } else {
            //clone table filters;
            filters = ticketsTable.cloneFiltersForExport();
        }

        filters.selectedColumns = ticketsTable.getVisibleColumns();
        let event = null;
        switch (params.type.name) {
            case table.exportFileTypes.pdf.name:
                event = communication.events.tickets.exportToPDF;
                break;
            case table.exportFileTypes.excel.name:
                event = communication.events.aft.tickets.exportToXLS;
                break;
            default:
                console.error('unsuported export type');
                break;
        }
        trigger(event, { data: filters });
    });

    //ToDo:: ubaciti u events enum, nisam siguran cemu sluzi
    on('showing-tickets-top-bar-value', function (data) {
        topBarInfoBoxValue(data.dataItemValue)
    });
    //endregion

    //region helper functions
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
    //endregion

    //region Tickets communication events
    //tickets get tickets
    on(communication.events.tickets.getTickets, function (params) {
        let route = communication.apiRoutes.tickets.getTickets;
        let request = communication.requestTypes.post;
        let data = {
            'EndpointId': params.endpointId
        };
        let successEvent = events.getTickets;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: params.endpointId,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    on(communication.events.tickets.previewTickets, function (params) {
        let route = communication.apiRoutes.tickets.previewTickets;
        let request = communication.requestTypes.post;
        let data = params.data;
        let successEvent = events.previewTickets;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    on(communication.events.tickets.getFilters, function (params) {
        let route = communication.apiRoutes.tickets.getFilters;
        let request = communication.requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });
    //tickets getting values for show sms settings
    on(communication.events.tickets.showSmsSettings, function (params) {
        let route = communication.apiRoutes.tickets.showSmsSettings;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.additionalData;
        let successEvent = formSettings.populateData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });
    //tickets SaveTitoSmsAction
    on(communication.events.tickets.saveSmsSettings, function (params) {
        console.log('params:', params);
        let route = communication.apiRoutes.tickets.saveSmsSettings;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.additionalData;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });
    //tickets ShowTitoMaxValueSettings
    on(communication.events.tickets.showMaxValueSettings, function (params) {
        let route = communication.apiRoutes.tickets.showMaxValueSettings;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.additionalData;
        let successEvent = formSettings.populateData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });
    //tickets SaveTitoMaxValuesAction
    on(communication.events.tickets.saveMaxValuesAction, function (params) {
        let route = communication.apiRoutes.tickets.saveMaxValuesAction;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.additionalData;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });
    //ShowTicketAppearanceSettings
    on(communication.events.tickets.ticketAppearance, function (params) {
        let route = communication.apiRoutes.tickets.ticketAppearance;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.additionalData;
        let successEvent = formSettings.populateData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });
    //SaveTicketAppearanceAction
    on(communication.events.tickets.saveAppearance, function (params) {
        let route = communication.apiRoutes.tickets.saveAppearance;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.additionalData;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    on(communication.events.tickets.exportToPDF, function (params) {
        let data = params.data;
        communication.sendRequest(communication.apiRoutes.tickets.exportToPDF, communication.requestTypes.post, data,
            table.events.saveExportedFile, communication.handleError, { type: table.exportFileTypes.pdf.type }, [{
                name: 'responseType',
                value: 'arraybuffer'
            }]);
    });

    on(communication.events.tickets.exportToXLS, function (params) {
        //ToDo
    });
    //endregion
})();