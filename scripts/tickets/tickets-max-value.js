let ticketsMaxValue = (function () {

    let formSettingsMaxValue = {};
    formSettingsMaxValue.formContainerSelector = '#tickets-max-value-tab-info';
    formSettingsMaxValue.fillEvent = 'communicate/tickets/showMaxValueSettings';
    formSettingsMaxValue.submitEvent = 'communicate/tickets/saveMaxValuesAction';


    on('tickets/tab/maxValue', function (params) {
        formSettingsMaxValue.endpointId = params.tableSettings.endpointId;
        trigger('form/init', {formSettings: formSettingsMaxValue});
        trigger('form/getData', {formSettings: formSettingsMaxValue});
    });

})();