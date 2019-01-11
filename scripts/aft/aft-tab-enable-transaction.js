let aftTabEnableTransaction = (function () {

    let formSettingsTransaction = {};
    formSettingsTransaction.formContainerSelector = '#aft-tabs-enable-transaction-info';
    formSettingsTransaction.fillEvent = communication.events.aft.transactions.getBasicSettings;
    formSettingsTransaction.submitEvent = communication.events.aft.transactions.saveBasicSettings;
    formSettingsTransaction.fillFormEvent = 'form/fillFormData';

    on('aft/tab/transaction', function (params) {
        formSettingsTransaction.endpointId = params.endpointId;
        trigger('form/init', {formSettings: formSettingsTransaction});
        trigger('form/getData', {formSettings: formSettingsTransaction});
    });

})();