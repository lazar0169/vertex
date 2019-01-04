let aftTabEnableTransaction = (function () {

    let formSettingsTransaction = {};
    formSettingsTransaction.formContainerSelector = '#aft-tabs-enable-transaction-info';
    formSettingsTransaction.fillEvent = 'communicate/aft/getBasicSettings';
    formSettingsTransaction.submitEvent = 'communicate/aft/saveBasicSettings';
    formSettingsTransaction.fillFormEvent = 'form/fillFormData';

    on('aft/tab/transaction', function (params) {
        formSettingsTransaction.endpointId = params.endpointId;
        trigger('form/init', {formSettings: formSettingsTransaction});
        trigger('form/getData', {formSettings: formSettingsTransaction});
    });

})();