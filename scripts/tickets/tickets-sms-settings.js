let ticketsSmsSettings = (function(){

    let formSettingsSmsSettings = {};
    formSettingsSmsSettings.formContainerSelector = '#tickets-sms-settings-tab-info';
    formSettingsSmsSettings.getData = communication.events.tickets.showSmsSettings;
    formSettingsSmsSettings.submitEvent = communication.events.tickets.saveSmsSettings;

    on('tickets/tab/smsSettings', function(params){
        formSettingsSmsSettings.endpointId = params.tableSettings.endpointId;
        trigger('form/init', {formSettings: formSettingsSmsSettings});
        trigger('form/getData', {formSettings: formSettingsSmsSettings});
    });

})();