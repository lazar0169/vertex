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
        tableSettings.endpointId = aftId;
        tableSettings.id = '';
        tableSettings.forceRemoveHeaders = true;
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = false;

        table.init(tableSettings); //initializing table, filters and page size

        let addTransactionButton = $$('#page-aft').getElementsByClassName('aft-add-transaction')[0];

        addTransactionButton.addEventListener('click', function () {
            trigger('communicate/aft/addTransaction');
        });

        trigger('aft/tab/transactions/init', {tableSettings: tableSettings});
        trigger('aft/tab/notifications/init', {tableSettings: tableSettings});

    });
})();