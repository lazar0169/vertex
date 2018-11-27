const aft = (function () {
    on('aft/activated', function (params) {

        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);

        let aftId = params.params[0].value;
        console.log('Aft page ID (from params): ', aftId);

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

        table.init(tableSettings);

        let addTransactionButton = $$('#page-aft').getElementsByClassName('aft-add-transaction')[0];

        addTransactionButton.addEventListener('click', function () {
            trigger('communicate/aft/addTransaction');
        });
    });
})();