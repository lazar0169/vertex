const aft = (function () {
    on('aft/activated', function (params) {

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
        tableSettings.prepareDataEvent = 'communicate/aft/data/prepare';
        tableSettings.sortActiveColumn = 'createdby';
        tableSettings.endpointId = aftId;
        tableSettings.id = '';
        tableSettings.forceRemoveHeaders = false;
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = false;
        tableSettings.filtersInitialized = false;


        tableSettings.onDrawRowCell = 'aft/table/drawCell';

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
        on('aft/table/drawCell',function(params) {
            onDrawTableCell(params.key,params.value, params.element, params.position, params.rowData);
        });
         //ToDo: refaktorisi helper funkcije u evente
        /*********************----Helper functions------*********************/
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
        };

    });
})();