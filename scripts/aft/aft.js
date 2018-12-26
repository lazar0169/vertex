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
        let formSettingsNotification = {};
        formSettingsNotification.formContainerSelector = '#aft-tabs-add-transaction-form-wrapper';
        formSettingsNotification.submitEvent = 'communicate/aft/addTransaction';
        formSettingsNotification.submitErrorEvent = 'aft/addTransaction/error';
        formSettingsNotification.submitSuccessEvent = 'aft/addTransaction/success';


        on('aft/addTransaction/error', function (params) {
            console.log(params);
            console.log(JSON.parse(params.message));
            let messageCode = JSON.parse(params.message);
            //let messageType = params.message.MessageType;
            let message = localization.translateMessage(messageCode.Message);
            trigger('notifications/show', { message: message, type: 'string' });
        });
        on('aft/addTransaction/success', function (params) {
            console.log('uspesno');
        });


        trigger('form/init', { formSettings: formSettingsNotification });
        trigger('aft/tab/transaction', { tableSettings: tableSettings });
        trigger('aft/tab/notification', { tableSettings: tableSettings });

    });
})();