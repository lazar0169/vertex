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
            pdf: {
                value: communication.events.tickets.exportToPDF,
                type: table.exportTypes.event
            },
            xls: {
                value: communication.events.tickets.exportToXLS,
                type: table.exportTypes.event
            }
        };

        table.init(tableSettings); //initializing table, filters and page size

        trigger('tickets/tab/appearance', { tableSettings: tableSettings });
        trigger('tickets/tab/maxValue', { tableSettings: tableSettings });
        trigger('tickets/tab/smsSettings', { tableSettings: tableSettings });
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

    /*------------------------------------- TICKETS EVENTS ------------------------------------*/

    //tickets get tickets
    on(communication.events.tickets.getTickets, function (params) {
        let route = communication.apiRoutes.tickets.getTickets;
        let request = communication.requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.processRemoteData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent,
            settingsObject: tableSettings
        });
    });

    //tickets preview ticket action
    //tickets pagination sorting and filtering
    on(communication.events.tickets.previewTickets, function (params) {
        let route = communication.apiRoutes.tickets.previewTickets;
        let request = communication.requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let successEvent = tableSettings.processRemoteData;
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

    //tickets get filter values
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
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //tickets SaveTitoSmsAction
    on(communication.events.tickets.saveSmsSettings, function (params) {
        let route = communication.apiRoutes.tickets.saveSmsSettings;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //tickets ShowTitoMaxValueSettings
    on(communication.events.tickets.showMaxValueSettings, function (params) {
        let route = communication.apiRoutes.tickets.showMaxValueSettings;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //tickets SaveTitoMaxValuesAction
    on(communication.events.tickets.saveMaxValuesAction, function (params) {
        let route = communication.apiRoutes.tickets.saveMaxValuesAction;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //ShowTicketAppearanceSettings
    on(communication.events.tickets.ticketAppearance, function (params) {
        let route = communication.apiRoutes.tickets.ticketAppearance;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.formSettings;
        let successEvent = formSettings.populateData;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //SaveTicketAppearanceAction
    on(communication.events.tickets.saveAppearance, function (params) {
        let route = communication.apiRoutes.tickets.saveAppearance;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.formSettings;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            settingsObject: formSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    on(communication.events.tickets.exportToPDF, function (params) {
        let data = null;
        if (params.tableSettings.filters !== null) {
            //clone filters
            data = JSON.parse(JSON.stringify(params.tableSettings.filters));
            delete data.BasicData.Page;
            delete data.BasicData.PageSize;
            delete data.TokenInfo;
        } else {
            data = {
                EndpointId: params.tableSettings.endpointId,
                DateFrom: null,
                DateTo: null,
                MachineList: [],
                JackpotList: [],
                Status: [],
                Type: [],
                BasicData: {
                    SortOrder: null,
                    SortName: null
                },
            };
        }

        data.SelectedColumns = params.selectedColumns;
        communication.sendRequest(communication.apiRoutes.tickets.exportToPDF, communication.requestTypes.post, data, table.events.saveExportedFile, communication.handleError, { type: table.exportFileTypes.pdf }, [{
            name: 'responseType',
            value: 'arraybuffer'
        }]);
    });

    on(communication.events.tickets.exportToXLS, function (params) {

    });

    //parseRemoteData data for tickets  page
    on(communication.events.tickets.parseRemoteData, function (params) {
        let tableSettings = params.settingsObject;
        let data = params.data;
        prepareTicketsTableData(tableSettings, data);
        trigger(tableSettings.updateEvent, { data: data, settingsObject: tableSettings });
    });

    /*-----------------------------------------------------------------------------------------*/

    //ToDo: refactor in on rowDisplay
    function prepareTicketsTableData(tableSettings, data) {
        let entry = data.Data.Items;
        let formatedData = [];
        let counter = 0;
        entry.forEach(function (entry) {
            entry.EntryData.Amount = formatFloatValue(entry.EntryData.Amount / 100);

            formatedData[counter] = {
                rowData: {
                    code: entry.EntryData.FullTicketValIdationNumber,
                    issuedBy: entry.EntryData.IssuedBy.Name,
                    redeemedBy: entry.EntryData.RedeemedBy.Name,
                    status: localization.translateMessage(entry.EntryData.Status),
                    type: entry.EntryData.TicketType,
                    amount: entry.EntryData.Amount
                },
                data: {
                    issuedAt: formatTimeData(entry.EntryData.IssuedBy.Time),
                    redeemedAt: formatTimeData(entry.EntryData.RedeemedBy.Time),
                }
            };
            counter++;
        });

        tableSettings.tableData = formatedData;
        trigger('showing-tickets-top-bar-value', { dataItemValue: data.Data.ItemValue });
        return formatedData;
    }


})();