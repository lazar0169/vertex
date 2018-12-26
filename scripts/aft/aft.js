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
        tableSettings.forceRemoveHeaders = true;
        tableSettings.stickyRow = true;
        tableSettings.stickyColumn = false;
        tableSettings.filtersInitialized = false;

        table.init(tableSettings); //initializing table, filters and page size
        //initialize add transaction form
        let addTransactionFormSettings = {};
        addTransactionFormSettings.formContainerSelector = '#aft-tabs-add-transaction-form-wrapper';
        addTransactionFormSettings.submitEvent = 'communicate/aft/addTransaction';
        addTransactionFormSettings.submitErrorEvent = 'aft/addTransaction/error';
        addTransactionFormSettings.submitSuccessEvent = 'aft/addTransaction/success';
        addTransactionFormSettings.endpointId = aftId;


        on('aft/addTransaction/error', function (params) {
            let messageToShow = JSON.parse(params.message)
            //let messageType = params.message.MessageType;
            trigger('notifications/show', {
                message: messageToShow.Message
            });
        });
        on('aft/addTransaction/success', function (params) {
            console.log('uspesno');
        });


        trigger('form/init', { formSettings: addTransactionFormSettings });
        trigger('aft/tab/transaction', { tableSettings: tableSettings });
        trigger('aft/tab/notification', { tableSettings: tableSettings });

    });
})();