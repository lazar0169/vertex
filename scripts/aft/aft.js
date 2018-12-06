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

        let addTransactionButton = $$('#page-aft').getElementsByClassName('aft-add-transaction')[0];

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
/*
        trigger('aft/tab/transactions/init', {tableSettings: tableSettings});
        trigger('aft/tab/notifications/init', {tableSettings: tableSettings});*/


        //todo -----------------------------------------------------------------------------------------------

        //todo FILTER module
        //TRANSACTIONS TAB
        let formSettingsTransaction = {};
        formSettingsTransaction.formContainerSelector = '#aft-tabs-enable-transaction';
        formSettingsTransaction.fillEvent = 'communicate/aft/getBasicSettings';
        formSettingsTransaction.submitEvent = 'communicate/aft/saveBasicSettings';
        formSettingsTransaction.validateEvent = '';
        formSettingsTransaction.successEvent = '';
        formSettingsTransaction.errorEvent = '';
        formSettingsTransaction.prepareDataEvent = '';
        formSettingsTransaction.customFillDataEvent = '';
        formSettingsTransaction.endpointId = aftId;


        //todo FILTER MODULE
        trigger('form/init', {formSettings: formSettingsTransaction, tableSettings: tableSettings});
        // trigger('form/update', {formSettings: formSettingsTransaction, tableSettings: tableSettings});


        //todo FILTER module
        //NOTIFICATION TAB
        let formSettingsNotification = {};
        formSettingsNotification.formContainerSelector = '#aft-tabs-enable-transaction-info';
        formSettingsNotification.fillEvent = 'communicate/aft/getNotificationSettings';
        formSettingsNotification.submitEvent = 'communicate/aft/saveNotificationSettings';
        formSettingsNotification.validateEvent = '';
        formSettingsNotification.successEvent = '';
        formSettingsNotification.errorEvent = '';
        formSettingsNotification.prepareDataEvent = '';
        formSettingsNotification.customFillDataEvent = '';
        formSettingsNotification.endpointId = aftId;


        //todo FILTER MODULE
        trigger('form/init', {formSettings: formSettingsNotification, tableSettings: tableSettings});
        // trigger('form/update', {formSettings: formSettingsNotification, tableSettings: tableSettings});

    });
})();