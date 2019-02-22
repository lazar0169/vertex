const aft = (function () {
    const cancelTransactionsPopUpId = 'aft-cancel-transaction-popup';
    const aftTableId = 'table-container-aft';
    const aftTableSelector = `#${aftTableId}`;

    let endpointId;

    on('aft/activated', function (params) {
        let aftId = params.params[0].value;
        endpointId = aftId;

        selectTab('aft-tabs-transaction');
        selectInfoContent('aft-tabs-transaction');

        let tableSettings = {};
        tableSettings.pageSelectorId = '#page-aft';
        tableSettings.tableContainerSelector = '#table-container-aft';
        tableSettings.filtersContainerSelector = '#aft-filter';
        //tableSettings.advancedFilterContainerSelector = '#aft-advance-table-filter-active';
        tableSettings.getDataEvent = communication.events.aft.transactions.getTransactions;
        tableSettings.filterDataEvent = communication.events.aft.transactions.previewTransactions;
        tableSettings.updateTableEvent = 'table/update';
        tableSettings.processRemoteData = communication.events.aft.data.parseRemoteData;
        tableSettings.endpointId = aftId;
        tableSettings.id = '';
        tableSettings.stickyRow = true;

        //ToDo neske: deprecated - remove
        //tableSettings.onDrawRowCell = 'aft/table/drawCell';
        //ToDo neske: deprecated - remove
        tableSettings.onAfterCellClick = onTableCellClick;

        tableSettings.exportTo = {
            pdf: {
                value: communication.events.aft.transactions.exportToPDF,
                type: table.exportTypes.event
            },
            xls: {
                value: communication.events.aft.transactions.exportToXLS,
                type: table.exportTypes.event
            }
        };

        table.init(tableSettings); //initializing table, filters and page size
        //initialize add transaction form
        let addTransactionFormSettings = {};
        addTransactionFormSettings.formContainerSelector = '#aft-tabs-add-transaction-form-wrapper';
        addTransactionFormSettings.submitEvent = communication.events.aft.transactions.addTransaction;
        addTransactionFormSettings.submitErrorEvent = 'aft/addTransaction/error';
        addTransactionFormSettings.submitSuccessEvent = 'aft/addTransaction/success';
        addTransactionFormSettings.endpointId = aftId;

        trigger('form/init', { formSettings: addTransactionFormSettings });
        let endpointName = '';
        if ($$('.link-active') !== undefined && $$('.link-active')[0] !== undefined) {
            endpointName = $$('.link-active')[0].dataset.value;
        }
        trigger('form/add/hiddenField', {
            formSettings: addTransactionFormSettings,
            name: 'EndpointName',
            value: endpointName
        });


        trigger('aft/tab/transaction', {endpointId: tableSettings.endpointId});
        trigger('aft/tab/notification', {endpointId: tableSettings.endpointId});

        let table2 = table.init2({id:aftTableId});
        table2.update();

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
    on('table/#table-container-aft/cell/clicked/', function (params) {
        let event = params.event;
        let target = params.target;
        if (target.additionalData.Properties.IsPayoutPossible) {
            onTableCellClick(event, target);
        }
    });

    on('aft/addTransaction/error', function (params) {

        trigger('notifications/show', {
            message: localization.translateMessage(params.message.MessageCode),
            type: params.message.MessageType,
        });
        trigger('form/complete', { formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings });
        trigger('aft/filters/filter-table', { showFilters: false });
    });
    on('aft/addTransaction/success', function (params) {
        trigger('form/complete', { formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings });
        trigger('aft/filters/filter-table', { showFilters: false });
        console.log('params', params);
        trigger('form/complete', {formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings});
        trigger('aft/filters/filter-table', {showFilters: false});
        trigger('show/app');
        trigger('form/reset', { formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings });
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
            params.params.containerCell, $$('#table-container-aft'));
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
            containerCell, $$('#table-container-aft'));
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
            trigger('aft/filters/filter-table', { showFilters: true });
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
        let tableSettings = $$('#table-container-aft').tableSettings;
        trigger('table/deselect/active-row', { tableSettings: tableSettings });
        trigger('table/deselect/hover-row', { tableSettings: tableSettings });
    }

    function onDrawTableCell(column, cellContent, cell, position, entryData) {

        if (column === 'flag') {
            if (cellContent !== undefined) {
                cell.classList.add('row-flag-' + cellContent.toString().trim());
            }
            cell.classList.add('cell-flag');
            cell.innerHTML = '';
        } else if (column === 'finishedBy' || column === 'createdBy') {
            cell.classList.add('flex-column');
            cell.classList.add('justify-content-start');
            cell.classList.add('align-items-start');
            if (column === 'finishedBy') {
                cell.innerHTML = `<time class='table-time'>${entryData.data.finishedTime}</time><label>${entryData.rowData.finishedBy}</label>`;
            } else if (column === 'createdBy') {
                cell.innerHTML = `<time class='table-time'>${entryData.data.createdTime}</time><label>${entryData.rowData.createdBy}</label>`;
            }
        } else if (column === 'status') {
            cell.innerHTML = '<div title="' + entryData.data.errorCode + '">' + entryData.rowData.status + '</div>';
        } else if (column === 'actions') {
            if (entryData.data.isPayoutPossible) {
                let cancelIndicator = document.createElement('span');
                let icon = document.createElement('i');
                //ToDo: Ubaciti klasu za font
                icon.innerHTML = 'X';
                let text = document.createElement('span');
                text.innerHTML = localization.translateMessage('Cancel', text);
                cancelIndicator.classList.add('cancel-indicator');
                cancelIndicator.appendChild(icon);
                cancelIndicator.appendChild(text);
                cell.innerHTML = '';
                cell.append(cancelIndicator);
            }
        }
        if (entryData.data.isPayoutPossible === true) {
            cell.classList.add('clickable');
        }
        cell.transactionData = {
            gmcid: entryData.data.gmcid,
            jidtString: entryData.data.jidtString
        };
    }

    /*-------------------------------------- AFT EVENTS ---------------------------------------*/

    //aft get transactions
    on(communication.events.aft.transactions.getTransactions, function (params) {
        let route = communication.apiRoutes.aft.getTransactions;
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

    //aft pagination filtering sorting
    //aft preview transactions
    on(communication.events.aft.transactions.previewTransactions, function (params) {
        let route = communication.apiRoutes.aft.previewTransactions;
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
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //aft get basic settings
    on(communication.events.aft.transactions.getBasicSettings, function (params) {
        let route = communication.apiRoutes.aft.getBasicSettings;
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
            settingsObject: formSettings,
            errorEvent: errorEvent
        });
    });

    //aft get notification settings
    on(communication.events.aft.transactions.getNotificationSettings, function (params) {
        let route = communication.apiRoutes.aft.getNotificationSettings;
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
            settingsObject: formSettings,
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
            settingsObject: tableSettings,
            successEvent: successEvent,
            errorEvent: errorEvent
        });
    });

    //ToDo: možda može da se prosledi type i url is table settingsa pa da event bude univerzalan?
    on(communication.events.aft.transactions.exportToPDF, function (params) {

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
        communication.sendRequest(communication.apiRoutes.aft.exportToPDF, communication.requestTypes.post, data, table.events.saveExportedFile, communication.handleError, { type: table.exportFileTypes.pdf }, [{
            name: 'responseType',
            value: 'arraybuffer'
        }]);
    });

    on(communication.events.aft.transactions.exportToXLS, function (params) {

    });

    //parseRemoteData data for aft  page
    on(communication.events.aft.data.parseRemoteData, function (params) {
        let tableSettings = params.settingsObject;
        let data = params.data;
        console.log(data);
        tableSettings.tableData = data.Data.Items;
        trigger(tableSettings.updateTableEvent, { data: data, settingsObject: tableSettings });
    });

    /*---------------------------------------------------------------------------------------*/

    function prepareAftTableData(tableSettings, data) {
        let entries = data.Data.Items;
        let formatedData = [];
        let counter = 0;
        entries.forEach(function (entry) {
            entry.EntryData.AmountCashable = formatFloatValue(entry.EntryData.AmountCashable / 100);
            entry.EntryData.AmountPromo = formatFloatValue(entry.EntryData.AmountPromo / 100);

            entry.EntryData.Status = '<div title="' + localization.translateMessage(entry.Properties.ErrorCode) + '">' + localization.translateMessage(entry.EntryData.Status) + '</div>'

            let cancelIndicator = document.createElement('span');
            let icon = document.createElement('i');
            //ToDo: Ubaciti klasu za font
            icon.innerHTML = 'X';
            let text = document.createElement('span');
            text.innerHTML = localization.translateMessage('Cancel', text);
            cancelIndicator.classList.add('cancel-indicator');
            cancelIndicator.appendChild(icon);
            cancelIndicator.appendChild(text);

            formatedData[counter] = {
                rowData: {
                    flag: entry.Properties.FlagList[0],
                    createdBy: entry.EntryData.CreatedBy.Name,
                    finishedBy: entry.EntryData.FinishedBy.Name,
                    status: localization.translateMessage(entry.EntryData.Status),
                    machineName: entry.EntryData.MachineName,
                    type: localization.translateMessage(entry.EntryData.Type),
                    cashable: entry.EntryData.AmountCashable,
                    promo: entry.EntryData.AmountPromo,
                    actions: ''
                },
                data: {
                    createdTime: formatTimeData(entry.EntryData.CreatedBy.Time),
                    finishedTime: formatTimeData(entry.EntryData.FinishedBy.Time ? entry.EntryData.FinishedBy.Time : ''),
                    errorCode: localization.translateMessage(entry.Properties.ErrorCode),
                    isPayoutPossible: entry.Properties.IsPayoutPossible,
                    gmcid: entry.Properties.Gmcid,
                    jidtString: entry.Properties.JidtString
                }
            };
            counter++;
        }
        );
        return formatedData;
    }

})();