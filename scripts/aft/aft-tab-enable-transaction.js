let aftTabEnableTransaction = (function () {

    let formSettingsTransaction = {};
    formSettingsTransaction.formContainerSelector = '#aft-tabs-enable-transaction-info';
    formSettingsTransaction.getData = communication.events.aft.transactions.getBasicSettings;
    formSettingsTransaction.submitEvent = communication.events.aft.transactions.saveBasicSettings;
    formSettingsTransaction.populateData = 'form/fillFormData';

    on('aft/tab/transaction', function (params) {
        formSettingsTransaction.endpointId = params.endpointId;
        trigger('form/init', {formSettings: formSettingsTransaction});
        trigger('form/getData', {formSettings: formSettingsTransaction});
    });

})();