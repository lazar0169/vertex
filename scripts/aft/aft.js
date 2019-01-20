const aft = (function () {

    const cancelTransactionsPopUpId = 'aft-cancel-transaction-popup';
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
        tableSettings.onDrawRowCell = 'aft/table/drawCell';
        tableSettings.onAfterCellClick = onTableCellClick;

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
        trigger('form/add/hiddenField', { formSettings: addTransactionFormSettings, name: 'EndpointName', value: endpointName });

        trigger('aft/tab/transaction', { tableSettings: tableSettings });
        trigger('aft/tab/notification', { tableSettings: tableSettings });


        let addTransactionButton = $$('#page-aft').getElementsByClassName('aft-add-transaction')[0];

        trigger('aft/tab/transaction', {endpointId: tableSettings.endpointId});
        trigger('aft/tab/notification', {endpointId: tableSettings.endpointId});
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
    on('aft/addTransaction/error', function (params) {
        console.log(params);
        //let messageType = params.message.MessageType;
        trigger('notifications/show', {
            message: params.message.MessageCode,
            type: params.message.MessageType,
        });
        trigger('form/complete', { formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings });

    });
    on('aft/addTransaction/success', function (params) {
        console.log(params);
        trigger('form/complete', { formSettings: $$('#aft-tabs-add-transaction-form-wrapper').formSettings });
        trigger('aft/filters/filter-table',{showFilters:false});
        //ToDo: Neske i Nikola - da li isprazniti formu i sakriti pop up koji izadje sa desne strane?

    });

    on('aft/transactions/canceled/error', function (params) {
        trigger('communication/error/', params);
        dismissCancelTransactionPopUp();
        deselectHighlightedTransaction();
    });
    on('aft/transactions/canceled', transactionCanceled);
    on('aft/table/drawCell', function (params) {
        onDrawTableCell(params.key, params.value, params.element, params.position, params.rowData);
    });
    on('aft/table/show/cancel-pop-up', function (params) {
        beforeShowPopUp(params.params.coordinates, params.element, onCancelTransaction, onCancelPopUpAction,
            params.params.containerCell, $$('#table-container-aft'));
    });

    //code executed before popup is added to dom and
    on('aft/table/show/cancel-pending-pop-up', function (params) {
        console.log(params);
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
        console.log('coordinates ',coordinates);
        element.style.left = coordinates.x  + 'px';
        element.style.top = coordinates.y  + 'px';

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
        yesButton.transactionData = JSON.parse(JSON.stringify(parentElement.transactionData));

        noButton.addEventListener('click', cancelCallback);

        parentElement.append(element);
        keepAbsoluteChildInParent(boundsContainer, $$('#' + cancelTransactionsPopUpId));
    }


    function displayTransactionPopUp(title, callbackEvent,coordinates,cell) {
        trigger('table/disable-scroll', {tableSettings: $$('#table-container-aft').tableSettings});
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
        console.log('params trans canceled',params);
        let data = params.data.Data;
        //get popup coordinates if following popup should be displayed
        let popUp = $$(`#${cancelTransactionsPopUpId}`);
        let parentCell = popUp.closest('.cell');
        let boundingRect = popUp.getBoundingClientRect();
        let coordinates = {
            x:boundingRect.left,
            y:boundingRect.top
        };
        //show notification
        trigger('notifications/show',{
            type:params.data.MessageType,
            message:params.data.MessageCode
        });
        dismissCancelTransactionPopUp();
        if (data!== undefined && data!== null &&
            (data.DisplayEscrowedDeleteDialog === undefined || data.DisplayEscrowedDeleteDialog === false)) {
            deselectHighlightedTransaction();
            trigger('notifications/show', {
                message: localization.translateMessage(data.MessageCode.toString()),
                type: data.MessageType
            });
            trigger('aft/filters/filter-table',{showFilters:true});
        } else if (data.DisplayEscrowedDeleteDialog !== undefined && data.DisplayEscrowedDeleteDialog === 'true') {
            displayTransactionPopUp('AreYouSure', 'aft/table/show/cancel-pending-pop-up',coordinates,parentCell);
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

    function onTableCellClick(event, dataKey, cellContent, cell, col, data, rowId, cellColumnClass, tableSettings) {
        event.stopPropagation();
        dismissCancelTransactionPopUp();
        //remove previous popup
        trigger('table/disable-scroll', {tableSettings: tableSettings});
        let popUpCoordinates = {
            x: event.clientX + 5,
            y: event.clientY + 5
        };
        displayTransactionPopUp('CancelTransaction', 'aft/table/show/cancel-pop-up',popUpCoordinates,cell);
    }

    function dismissCancelTransactionPopUp() {
        trigger('table/dismiss-popup', {target: $$('#' + cancelTransactionsPopUpId), tableSettings: $$('#table-container-aft').tableSettings});
    }

    function deselectHighlightedTransaction() {
        let tableSettings = $$('#table-container-aft').tableSettings;
        trigger('table/deselect/active-row', {tableSettings: tableSettings});
        trigger('table/deselect/hover-row', {tableSettings: tableSettings});
    }

    function onDrawTableCell(column, cellContent, cell, position, rowData) {
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
        }
        if (rowData.data.isPayoutPossible === true) {
            cell.classList.add('clickable');
        }
        let transactionData = {
            gmcid: rowData.data.gmcid,
            jidtString: rowData.data.jidtString
        };
        cell.transactionData = transactionData;
    }

})();