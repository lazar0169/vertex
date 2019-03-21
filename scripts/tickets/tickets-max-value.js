let ticketsMaxValue = (function () {
    let formSettingsMaxValue = {};
    formSettingsMaxValue.formContainerSelector = '#tickets-max-value-tab-info';
    formSettingsMaxValue.getData = communication.events.tickets.showMaxValueSettings;
    formSettingsMaxValue.submitEvent = communication.events.tickets.saveMaxValuesAction;

    on('tickets/tab/maxValue', function (params) {
        formSettingsMaxValue.endpointId = params.endpointId;
        trigger('form/init', { formSettings: formSettingsMaxValue });
        trigger('form/getData', { formSettings: formSettingsMaxValue });
        trigger('preloader/hide');
    });
})();