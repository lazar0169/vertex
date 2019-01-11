let ticketsMaxValue = (function () {

    let formSettingsMaxValue = {};
    formSettingsMaxValue.formContainerSelector = '#tickets-max-value-tab-info';
    formSettingsMaxValue.fillEvent = communication.events.tickets.transactions.showMaxValueSettings;
    formSettingsMaxValue.submitEvent = communication.events.tickets.transactions.saveMaxValuesAction;

    on('tickets/tab/maxValue', function (params) {
        formSettingsMaxValue.endpointId = params.tableSettings.endpointId;
        trigger('form/init', {formSettings: formSettingsMaxValue});
        trigger('form/getData', {formSettings: formSettingsMaxValue});
    });

})();