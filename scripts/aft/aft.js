const aft = (function () {
    const cancelTransactionsPopUpId = 'aft-cancel-transaction-popup';
    const aftTableId = 'table-container-aft';
    const aftTableSelector = '#table-container-aft';

    let aftTable = null;
    let endpointId;

    const events = {
        getTransactions: 'aft/transactions/get',
        previewTransactions: 'aft/transactions/preview',
    };

    on('aft/activated', function (params) {

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
        let endpointName = '';
        if ($$('.link-active') !== undefined && $$('.link-active')[0] !== undefined) {
            endpointName = $$('.link-active')[0].dataset.value;
        }
        trigger('form/add/hiddenField', {
            formSettings: addTransactionFormSettings,
            name: 'EndpointName',
            value: endpointName
        });

        trigger('aft/tab/transaction', {endpointId: aftId});
        trigger('aft/tab/notification', {endpointId: aftId});


    });

    /*********************----Dom event handlers------*********************/
    window.addEventListener('click', function (e) {
        let selector = '#' + cancelTransactionsPopUpId;
        let popup = $$(selector);
        if (popup !== null) {
            if (e.target.closest(selector) === null) {
                dismissCancelTransactionPopUp();
                deselectHighlightedTransaction();
            }
        }
    });

    /*********************----Module Events------*********************/
    on(table.events.rowClick(aftTableId), function (params) {
        let event = params.event;
        let target = params.target;
        if (target.additionalData.Properties.IsPayoutPossible) {
            onTableCellClick(event, target);
        }
    });
    on(table.events.pageSize(aftTableId), function (params) {
        trigger('aft/filters/filter-table');

    });
    on(table.events.sort(aftTableId), function (params) {
        trigger('aft/filters/filter-table');

    });
    on(table.events.pagination(aftTableId), function (params) {
        trigger('aft/filters/filter-table');

    });

    on(table.events.export(aftTableId), function (params) {
        console.log(params);

        trigger('preloader/show');

        let aftTable = params.table;

        let filters = null;

        if (aftTable.settings.filters === null) {
            filters = {
                'EndpointId': aftTable.settings.endpointId,
                'DateFrom': null,
                'DateTo': null,
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
        //ToDo: Nikola: ovde možeš da ubaciš onaj bar koji ide ispod filtera, samo treba da se trigeruje nešto ako se ne varam.
    });

    on('aft/addTransaction/error', function (params) {
        trigger('notifications/show', {
            message: localization.translateMessage(params.message.MessageCode),
            type: params.message.MessageType,
        });
        trigger('form/complete', {formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings});
        trigger('aft/filters/filter-table', {showFilters: false});
    });
    on('aft/addTransaction/success', function (params) {
        trigger('form/complete', {formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings});
        trigger('aft/filters/filter-table', {showFilters: false});
        trigger('form/complete', {formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings});
        trigger('aft/filters/filter-table', {showFilters: false});
        trigger('show/app');
        trigger('form/reset', {formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings});
        trigger('form/reset', {formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings});
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
        beforeShowPopUp(params.params.coordinates, params.element, onCancelTransaction, onCancelPopUpAction,
            params.params.containerCell, $$(aftTableSelector));
    });
    //code executed before popup is added to dom and
    on('aft/table/show/cancel-pending-pop-up', function (params) {
        let containerCell = params.params.containerCell;
        if (containerCell.transactionData === undefined) {
            console.error('there`s no transaction data on targeted cell!');
            return false;
        } else {
            containerCell.transactionData.pending = true;
        }
        beforeShowPopUp(params.params.coordinates, params.element, onCancelTransaction, onCancelPopUpAction,
            containerCell, $$(aftTableSelector));
        //remove transaction flag so that user can initiate whole process again - flag is saved in YES button in popup
        if (containerCell.transactionData.pending !== undefined) {
            delete containerCell.transactionData.pending;
        }
    });

    /*********************----Helper functions------*********************/
    function onCancelPopUpAction(e) {
        e.stopPropagation();
        dismissCancelTransactionPopUp();
        deselectHighlightedTransaction();
    }

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
            jidtString: parentElement.additionalData.Properties.JidtString
        };

        noButton.addEventListener('click', cancelCallback);

        parentElement.append(element);
        keepAbsoluteChildInParent(boundsContainer, $$('#' + cancelTransactionsPopUpId));
    }


    function displayTransactionPopUp(title, callbackEvent, coordinates, cell) {
        trigger('table/disable-scroll', {tableSelector: aftTableSelector});
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

    function transactionCanceled(params) {
        let data = params.data;
        let additionalData = data.Data;
        //get popup coordinates if following popup should be displayed
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

        dismissCancelTransactionPopUp();

        if (additionalData !== undefined && additionalData !== null &&
            additionalData.DisplayEscrowedDeleteDialog !== undefined && additionalData.DisplayEscrowedDeleteDialog === 'true') {
            displayTransactionPopUp('AreYouSure', 'aft/table/show/cancel-pending-pop-up', coordinates, parentCell);
        } else {
            deselectHighlightedTransaction();
            trigger('aft/filters/filter-table');
        }
    }

    function onCancelTransaction(e) {
        e.stopPropagation();
        trigger(communication.events.aft.transactions.cancelTransaction, {
            transactionData: {
                gmcid: e.target.transactionData.gmcid,
                jidtString: e.target.transactionData.jidtString,
                endpointId: endpointId,

            },
            status: {
                pending: e.target.transactionData.pending !== undefined
            }
        });
    }

    function onTableCellClick(event, cell) {
        event.stopPropagation();
        dismissCancelTransactionPopUp();
        //remove previous popup
        trigger('table/disable-scroll', {tableSelector: aftTableSelector});
        let popUpCoordinates = {
            x: event.clientX + 5,
            y: event.clientY + 5
        };
        displayTransactionPopUp('CancelTransaction', 'aft/table/show/cancel-pop-up', popUpCoordinates, cell);
    }

    function dismissCancelTransactionPopUp() {
        trigger('table/dismiss-popup', {
            target: $$('#' + cancelTransactionsPopUpId),
            tableSelector: aftTableSelector
        });
    }

    function deselectHighlightedTransaction() {
        let tableSettings = $$(aftTableSelector).tableSettings;
        trigger('table/deselect/active-row', {tableSettings: tableSettings});
        trigger('table/deselect/hover-row', {tableSettings: tableSettings});
    }


    /*-------------------------------------- AFT EVENTS ---------------------------------------*/

    //aft get transactions
    on(communication.events.aft.transactions.getTransactions, function (params) {
        let route = communication.apiRoutes.aft.getTransactions;
        let request = communication.requestTypes.post;
        let data = {
            'EndpointId': params.endpointId
        }
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
            EndpointName: params.transactionData.endpointName,
        };
        let route = params.status.pending === true ? communication.apiRoutes.aft.cancelPendingTransaction : communication.apiRoutes.aft.cancelTransaction;
        communication.sendRequest(route, communication.requestTypes.post, data, 'aft/transactions/canceled', 'aft/transactions/canceled/error');
    });

    //aft add transaction
    on(communication.events.aft.transactions.addTransaction, function (params) {
        let route = communication.apiRoutes.aft.addTransaction;
        let request = communication.requestTypes.post;
        let data = params.data;
        let successEvent = params.formSettings.submitSuccessEvent;
        let errorEvent = params.formSettings.submitErrorEvent;
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
        let formSettings = params.formSettings;
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
        let formSettings = params.formSettings;
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