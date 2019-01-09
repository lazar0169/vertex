const aft = (function () {

    const cancelableStatuses = ['AFTActive', 'AFTPending','AFTCheck'];

    on('aft/activated', function (params) {

        let cancelTransactionsPopUpId = 'aft-cancel-transaction-popup';

        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);

        let aftId = params.params[0].value;

        selectTab('aft-tabs-transaction');
        selectInfoContent('aft-tabs-transaction');

        let tableSettings = {};
        tableSettings.pageSelectorId = '#page-aft';
        tableSettings.tableContainerSelector = '#table-container-aft';
        tableSettings.filterContainerSelector = '#aft-advance-table-filter-active';
        tableSettings.dataEvent = 'communicate/aft/getTransactions';
        tableSettings.updateTableEvent = 'table/update';
        tableSettings.processRemoteData = 'communicate/aft/data/prepare';
        tableSettings.sortActiveColumn = 'createdby';
        tableSettings.endpointId = aftId;
        tableSettings.id = '';
        tableSettings.forceRemoveHeaders = false;
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = false;
        tableSettings.filtersInitialized = false;

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

        on('aft/addTransaction', function () {

        });

        trigger('aft/tab/transaction', {endpointId: tableSettings.endpointId});
        trigger('aft/tab/notification', {endpointId: tableSettings.endpointId});

        /*********************----Events------*********************/
        on('aft/table/drawCell', function (params) {
            onDrawTableCell(params.key, params.value, params.element, params.position, params.rowData);
        });
        on('aft/table/display/cancel-pop-up', function (params) {
            //bind click handlers here
            let event = params.params.event;
            let coordinates = {
                x:event.clientX,
                y:event.clientY
            };

            let newElement = params.element;

            let targetCell = event.target.closest('.cell');

            newElement.setAttribute('id',cancelTransactionsPopUpId);
            newElement.style.left = coordinates.x+ 5 + 'px';
            newElement.style.top = coordinates.y+5 + 'px';
            targetCell.append(newElement);

            //stop event propagation as new element is part of the cell which has click event handler
            newElement.addEventListener('click',function(e){
                e.stopPropagation();
            });
            let yesButton = newElement.getElementsByClassName('action-cancel-transaction')[0];
            console.log(yesButton);
            let noButton = newElement.getElementsByClassName('action-dismiss-pop-up')[0];
            yesButton.addEventListener('click',onCancelTransaction);
            yesButton.trasactionData = targetCell.trasactionData;
            noButton.addEventListener('click',function(e){
                e.stopPropagation();
                dimissPopUp(e);
                trigger('table/deselect/active-row',{tableSettings:$$('#table-container-aft').tableSettings});
                trigger('table/deselect/hover-row',{tableSettings:$$('#table-container-aft').tableSettings});
            });

            keepAbsoluteChildInParent($$('#table-container-aft'),$$('#'+cancelTransactionsPopUpId));
        });


        /*********************----Helper functions------*********************/
        function onCancelTransaction(e) {
            e.stopPropagation();
            console.log(e.target.trasactionData);
        }
        function onTableCellClick(event, dataKey, cellContent, cell, col, data, rowId, cellColumnClass, tableSettings) {
            let activePopup = $$('#'+cancelTransactionsPopUpId);
            if (activePopup !== undefined && activePopup !== null) {
                activePopup.parentNode.removeChild(activePopup);
            }
            //remove previous popup
            trigger('template/render', {
                templateElementSelector: '#cancel-transaction-template',
                callbackEvent: 'aft/table/display/cancel-pop-up',
                event:event
            });
        }


        function onDrawTableCell(column, cellContent, cell, position, rowData) {
            if (column === 'flag') {
                if (cellContent !== undefined) {
                    cell.classList.add('row-flag-' + cellContent.toString().trim());
                }
                cell.classList.add('cell-flag');
                cell.innerHTML = '';
            } else if (column === 'finishedBy' || column === 'createdBy') {
                cell.classList.add('cell-column');
                cell.classList.add('justify-content-start');
                cell.classList.add('align-items-start');
            }
            if (rowData.data.isPayoutPossible === true) {
                cell.classList.add('clickable');
            }
            let transactionData = {
                gmcid: rowData.data.gmcid,
                jidtString:rowData.data.jidtString
            };
            cell.trasactionData = transactionData;
        }
    });
})();