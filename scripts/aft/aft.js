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
        tableSettings.processRemoteData = communication.events.aft.data.prepare;
        //tableSettings.sortActiveColumn = 'createdby';
        tableSettings.endpointId = aftId;
        tableSettings.id = '';
        tableSettings.stickyRow = true;

        tableSettings.onDrawRowCell = 'aft/table/drawCell';
        tableSettings.onAfterCellClick = onTableCellClick;

        table.init(tableSettings); //initializing table, filters and page size

        let addTransactionButton = $$('#page-aft').getElementsByClassName('aft-add-transaction')[0];

        //ToDo: Nikola - jel možemo ovo da brišemo?
        addTransactionButton.addEventListener('click', function () {
            let data =
                {
                    'EndpointId': aftId,
                    'EndpointName': '',
                    'Gmcid': 1565666846,
                    'MachineName': '',
                    'Type': 0,
                    'CashableAmount': 13800,
                    'PromoAmount': 13800,
                    'ExpirationInDays': 7
                };
            trigger('communicate/aft/addTransaction', {data: data, tableSettings: tableSettings});
        });
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
    on('aft/transactions/add', function () {

    });

    on('aft/transactions/canceled/error', function (params) {
        trigger('communication/error/', params);
        dismissCancelTransactionPopUp();
        deselectHighlightedTransaction();
    });
    on('aft/transactions/canceled', onTransactionCanceled);
    on('aft/table/drawCell', function (params) {
        onDrawTableCell(params.key, params.value, params.element, params.position, params.rowData);
    });
    on('aft/table/show/cancel-pop-up', function (params) {
        beforeShowPopUp(params.params.event, params.element, onCancelTransaction, onCancelPopUpAction,
            params.params.event.target.closest('.cell'), $$('#table-container-aft'));
    });

    //code executed befor popup is added to dom and
    on('aft/table/show/cancel-pending-pop-up', function (params) {
        //bind click handlers here
        let containerCell = params.params.event.target.closest('.cell');
        if (containerCell.transactionData === undefined) {
            console.error('there`s no transaction data on targeted cell!');
        } else {
            containerCell.transactionData.pending = true;
        }
        beforeShowPopUp(params.params.event, params.element, onCancelTransaction, onCancelPopUpAction,
            params.params.event.target.closest('.cell'), $$('#table-container-aft'));
        //remove transaction flag so that user can initiate whole process again
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

    function beforeShowPopUp(event, element, confirmCallback, cancelCallback, parentElement, boundsContainer) {

        let coordinates = {
            x: event.clientX,
            y: event.clientY
        };

        element.setAttribute('id', cancelTransactionsPopUpId);
        element.style.left = coordinates.x + 5 + 'px';
        element.style.top = coordinates.y + 5 + 'px';


        //stop event propagation as new element is part of the cell which has click event handler
        element.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        let yesButton = element.getElementsByClassName('action-cancel-transaction')[0];
        let noButton = element.getElementsByClassName('action-dismiss-pop-up')[0];
        yesButton.addEventListener('click', confirmCallback);
        //pass transaction data from cell to button to avoid dom manipulation in handler
        yesButton.transactionData = parentElement.transactionData;

        noButton.addEventListener('click', cancelCallback);

        parentElement.append(element);
        keepAbsoluteChildInParent(boundsContainer, $$('#' + cancelTransactionsPopUpId));
    }


    function displayTransactionPopUp(title, callbackEvent) {
        trigger('table/disable-scroll', {tableSettings: $$('#table-container-aft').tableSettings});
        trigger('template/render', {
            templateElementSelector: '#cancel-transaction-template',
            callbackEvent: callbackEvent,
            event: event,
            model: {
                title: localization.translateMessage(title)
            }
        });
    }

    function onTransactionCanceled(params) {
        let data = params.Data;

        dismissCancelTransactionPopUp();
        if (data.DisplayEscrowedDeleteDialog === 'undefined' || data.DisplayEscrowedDeleteDialog === false) {
            deselectHighlightedTransaction();
            trigger('notifications/show', {
                message: localization.translateMessage(data.MessageCode.toString()),
                type: data.MessageType
            });
            trigger('aft/filters/filter-table',{showFilters:true});
        } else {
            displayTransactionPopUp('AreYouSure', 'aft/table/show/cancel-pending-pop-up');
        }
    }

    function onCancelTransaction(e) {
        e.stopPropagation();
        //ToDo Lazar&Nevena: To be removed?
        //pričali smo da ćemo da izbacimo duple podatke koji se šalju API-ju (endpointName i endpointId) na primer
        // ali da bi mi trenutno radili pozivi ovo moram da ostavim
        let endpointName = '';
        if ($$('.link-active') !== undefined && $$('.link-active')[0] !== undefined) {
            endpointName = $$('.link-active')[0].dataset.value;
        }
        //trigger('communication/aft/transactions/cancel', {
        trigger(communication.events.aft.transactions.cancelTransaction, {
            transactionData: {
                gmcid: e.target.transactionData.gmcid,
                jidtString: e.target.transactionData.jidtString,
                endpointId: endpointId,
                //ToDo: To be removed?
                endpointName: endpointName
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
        displayTransactionPopUp('CancelTransaction', 'aft/table/show/cancel-pop-up');
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