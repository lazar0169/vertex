const aft = (function () {
    const cancelTransactionsPopUpId = 'aft-cancel-transaction-popup';
    const aftTableId = 'table-container-aft';
    const aftTableSelector = '#table-container-aft';

    let aftTable = null;
    let endpointId;

    const events = {
        activated: 'aft/activated',
        getTransactions: 'aft/transactions/get',
        previewTransactions: 'aft/transactions/preview',
        filterTable: 'aft/table/filter'
    };


    //region event handlers
    window.addEventListener('click', function (e) {
        let selector = '#' + cancelTransactionsPopUpId;
        let popup = $$(selector);
        if (popup !== null) {
            if (e.target.closest(selector) === null) {
                removeTransactionPopUp();
            }
        }
    });
    //endregion

    //region module events
    on(events.activated, function (params) {
        let aftId = params.params[0].value;
        selectTab('aft-tabs-transaction');
        selectInfoContent('aft-tabs-transaction');

        trigger('preloader/show');
        trigger(communication.events.aft.transactions.getTransactions, {endpointId: aftId});

        //initialize add transaction form
        let addTransactionFormSettings = {};
        addTransactionFormSettings.formContainerSelector = '#aft-tabs-add-transaction-form-wrapper';
        addTransactionFormSettings.submitEvent = communication.events.aft.transactions.addTransaction;
        addTransactionFormSettings.submitErrorEvent = 'aft/addTransaction/error';
        addTransactionFormSettings.submitSuccessEvent = 'aft/addTransaction/success';
        addTransactionFormSettings.endpointId = aftId;

        trigger('form/init', {formSettings: addTransactionFormSettings});


        trigger('aft/tab/transaction', {endpointId: aftId});
        trigger('aft/tab/notification', {endpointId: aftId});
    });

    on(table.events.rowClick(aftTableId), function (params) {
        let event = params.event;
        let target = params.target;
        if (target.additionalData.Properties.IsPayoutPossible) {
            onTableCellClick(event, target);
        }
    });

    on(table.events.pageSize(aftTableId), function (params) {
        trigger(events.filterTable);

    });

    on(table.events.sort(aftTableId), function (params) {
        trigger(events.filterTable);

    });

    on(table.events.pagination(aftTableId), function (params) {
        trigger(events.filterTable);

    });

    on(table.events.export(aftTableId), function (params) {
        trigger('preloader/show');

        let aftTable = params.table;

        let filters = null;

        if (aftTable.settings.filters === null) {
            filters = {
                'EndpointId': aftTable.settings.endpointId,
                //ToDo: uneti default vrednost za Period paramter - nije dokumentovano
                'Period': null,
                'MachineList': [],
                'JackpotList': [],
                'Status': [],
                'Type': [],
                BasicData: {
                    SortOrder: null,
                    SortName: null
                },
            };
        } else {
            //clone table filters;
           filters = aftTable.cloneFiltersForExport();
        }
        filters.selectedColumns = aftTable.getVisibleColumns();
        let event = null;
        switch (params.type.name) {
            case table.exportFileTypes.pdf.name:
                event = communication.events.aft.transactions.exportToPDF;
                break;
            case table.exportFileTypes.excel.name:
                event = communication.events.aft.transactions.exportToXLS;
                break;
            default:
                console.error('unsuported export type');
                break;
        }
        trigger(event,{data:filters});
    });

    on(events.getTransactions, function (params) {
        if (aftTable !== null) {
            aftTable.destroy();
        }
        aftTable = table.init({
            endpointId: params.additionalData,
            id: aftTableId,
            pageSizeContainer: '#aft-machines-number',
            exportButtonsContainer: '#wrapper-aft-export-to',
            appearanceButtonsContainer: '#aft-show-space'
        }, params.data.Data);
        trigger('aft/filters/init', {endpointId: params.additionalData});
        $$('#aft-tabs-transaction-info').appendChild(aftTable);
    });

    on(events.previewTransactions, function (params) {
        let data = params.data.Data;
        $$(aftTableSelector).update(data);
    });

    //ToDo: prebaciti evente u enum

    on('aft/addTransaction/error', function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.message.MessageCode),
            type: params.message.MessageType,
        });
        trigger('form/complete', {formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings});
    });

    on('aft/addTransaction/success', function (params) {
        trigger('form/complete', {formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings});
        trigger('form/reset', {formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings});
        trigger('show/app');
        //ToDo: da li se ovde resetuju filteri ili ne?
        trigger(events.filterTable);

        trigger('notifications/show', {
            message: localization.translateMessage(params.data.MessageCode.toString()),
            type: params.data.MessageType
        });

    });

    on('aft/transactions/canceled/error', function (params) {
        trigger('communication/error/', params);
        dismissCancelTransactionPopUp();
        deselectHighlightedTransaction();
    });
    on('aft/transactions/canceled', transactionCanceled);
    on('aft/table/show/cancel-pop-up', function (params) {
        delete params.params.containerCell.cancelationPending;
        beforeShowPopUp(params.params.coordinates, params.element, onCancelTransaction, removeTransactionPopUp,
            params.params.containerCell, $$(aftTableSelector));
    });
    //code executed before popup is added to dom and
    on('aft/table/show/cancel-pending-pop-up', function (params) {
        let containerCell = params.params.containerCell;
        containerCell.cancelationPending = true;
        beforeShowPopUp(params.params.coordinates, params.element, onCancelTransaction, removeTransactionPopUp,
            containerCell, $$(aftTableSelector));
        delete containerCell.cancelationPending;

    });

    //endregion



    function beforeShowPopUp(coordinates, element, confirmCallback, cancelCallback, parentElement, boundsContainer) {
        element.setAttribute('id', cancelTransactionsPopUpId);
        element.style.left = coordinates.x + 'px';
        element.style.top = coordinates.y + 'px';

        //stop event propagation as new element is part of the cell which has click event handler
        element.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        let yesButton = element.getElementsByClassName('action-cancel-transaction')[0];
        let noButton = element.getElementsByClassName('action-dismiss-pop-up')[0];
        yesButton.addEventListener('click', confirmCallback);
        //pass transaction data from cell to button to avoid dom manipulation in handler
        //clone object with new reference
        yesButton.transactionData = {
            gmcid: parentElement.additionalData.Properties.Gmcid,
            jidtString: parentElement.additionalData.Properties.JidtString,
        };
        yesButton.cancelationPending =  parentElement.cancelationPending !== undefined;

        noButton.addEventListener('click', cancelCallback);

        parentElement.append(element);
        keepAbsoluteChildInParent(boundsContainer, $$('#' + cancelTransactionsPopUpId));
    }

    function displayTransactionPopUp(title, callbackEvent, coordinates, cell) {
       removeTransactionPopUp();
        $$(aftTableSelector).disableScroll();

        trigger('template/render', {
            templateElementSelector: '#cancel-transaction-template',
            callbackEvent: callbackEvent,
            coordinates: coordinates,
            containerCell: cell,
            model: {
                title: localization.translateMessage(title)
            }
        });
    }

    function removeTransactionPopUp(e) {
        if (e !== undefined) {
            e.stopPropagation();
        }
        let selector = '#' + cancelTransactionsPopUpId;
        let popup = $$(selector);
        if (popup !== null) {
            popup.parentElement.removeChild(popup);
            $$(aftTableSelector).enableScroll();
        }
    }

    function transactionCanceled(params) {
        let data = params.data;
        let additionalData = data.Data;
        //get popup coordinates if the next popup should be displayed
        let popUp = $$(`#${cancelTransactionsPopUpId}`);
        let parentCell = popUp.closest('.cell');
        let boundingRect = popUp.getBoundingClientRect();
        let coordinates = {
            x: boundingRect.left,
            y: boundingRect.top
        };
        //show notification
        trigger('notifications/show', {
            type: params.data.MessageType,
            message: localization.translateMessage(data.MessageCode.toString())
        });

        removeTransactionPopUp();

        if (additionalData !== undefined && additionalData !== null &&
            additionalData.DisplayEscrowedDeleteDialog !== undefined && additionalData.DisplayEscrowedDeleteDialog === 'true') {

            displayTransactionPopUp('AreYouSure', 'aft/table/show/cancel-pending-pop-up', coordinates, parentCell);
        } else {
            trigger(events.filterTable);
        }
    }

    function onCancelTransaction(e) {
        e.stopPropagation();
        trigger(communication.events.aft.transactions.cancelTransaction, {
            transactionData: {
                gmcid: e.target.transactionData.gmcid,
                jidtString: e.target.transactionData.jidtString,
                endpointId: $$(aftTableSelector).settings.endpointId,
            },
            status: {
                pending: e.target.cancelationPending !== undefined && e.target.cancelationPending === true
            }
        });
    }

    function onTableCellClick(event, cell) {
        event.stopPropagation();
        //remove previous popup
        let popUpCoordinates = {
            x: event.clientX + 5,
            y: event.clientY + 5
        };
        displayTransactionPopUp('CancelTransaction', 'aft/table/show/cancel-pop-up', popUpCoordinates, cell);
    }


    function deselectHighlightedTransaction() {
        let tableSettings = $$(aftTableSelector).tableSettings;
        trigger('table/deselect/active-row', {tableSettings: tableSettings});
        trigger('table/deselect/hover-row', {tableSettings: tableSettings});
    }
    //endregion

    //region AFT communication events

    //aft get transactions
    on(communication.events.aft.transactions.getTransactions, function (params) {
        let route = communication.apiRoutes.aft.getTransactions;
        let request = communication.requestTypes.post;
        let data = {
            'EndpointId': params.endpointId
        };
        let successEvent = events.getTransactions;
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

    //aft pagination filtering sorting
    //aft preview transactions
    on(communication.events.aft.transactions.previewTransactions, function (params) {
        let route = communication.apiRoutes.aft.previewTransactions;
        let request = communication.requestTypes.post;
        let data = params.data;
        let successEvent = events.previewTransactions;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //aft cancel transaction
    on(communication.events.aft.transactions.cancelTransaction, function (params) {
        let data = {
            EndpointId: params.transactionData.endpointId,
            Gmcid: params.transactionData.gmcid,
            JidtString: params.transactionData.jidtString,
        };

        let route = params.status.pending === true ? communication.apiRoutes.aft.cancelPendingTransaction : communication.apiRoutes.aft.cancelTransaction;
        communication.sendRequest(route, communication.requestTypes.post, data, 'aft/transactions/canceled', 'aft/transactions/canceled/error');
    });

    //aft add transaction
    on(communication.events.aft.transactions.addTransaction, function (params) {
        let route = communication.apiRoutes.aft.addTransaction;
        let request = communication.requestTypes.post;
        let data = params.data;
        let successEvent = params.additionalData.submitSuccessEvent;
        let errorEvent = params.additionalData.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //aft cancel pending transaction
    on(communication.events.aft.transactions.cancelPendingTransaction, function (params) {
        let route = communication.apiRoutes.aft.cancelPendingTransaction;
        let request = communication.requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let successEvent = ''; //todo see which event goes here
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //aft get basic settings
    on(communication.events.aft.transactions.getBasicSettings, function (params) {
        let route = communication.apiRoutes.aft.getBasicSettings;
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

    //aft save basic settings
    on(communication.events.aft.transactions.saveBasicSettings, function (params) {
        let route = communication.apiRoutes.aft.saveBasicSettings;
        let request = communication.requestTypes.post;
        let data = params.data;
        let formSettings = params.additionalData;
        let successEvent = formSettings.submitSuccessEvent;
        let errorEvent = formSettings.submitErrorEvent;
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            successEvent: successEvent,
            additionalData: formSettings,
            errorEvent: errorEvent
        });
    });

    //aft get notification settings
    on(communication.events.aft.transactions.getNotificationSettings, function (params) {
        let route = communication.apiRoutes.aft.getNotificationSettings;
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

    //aft save notification settings
    on(communication.events.aft.transactions.saveNotificationSettings, function (params) {
        let route = communication.apiRoutes.aft.saveNotificationSettings;
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

    //aft get filters
    on(communication.events.aft.transactions.getFilters, function (params) {
        let route = communication.apiRoutes.aft.getFilters;
        let request = communication.requestTypes.post;
        let data = params.data;
        let tableSettings = params.tableSettings;
        let successEvent = params.successEvent;
        let errorEvent = '';
        trigger('communicate/createAndSendXhr', {
            route: route,
            requestType: request,
            data: data,
            additionalData: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    on(communication.events.aft.transactions.exportToPDF, function (params) {
        let data = params.data;
        communication.sendRequest(communication.apiRoutes.aft.exportToPDF, communication.requestTypes.post, data,
            table.events.saveExportedFile, communication.handleError, {type: table.exportFileTypes.pdf.type}, [{
            name: 'responseType',
            value: 'arraybuffer'
        }]);
    });

    on(communication.events.aft.transactions.exportToXLS, function (params) {
        //ToDo
    });
})();