let ticketsSmsSettings = (function(){

    let formSettingsSmsSettings = {};
    formSettingsSmsSettings.formContainerSelector = '#tickets-sms-settings-tab-info';
    formSettingsSmsSettings.getData = communication.events.tickets.showSmsSettings;
    formSettingsSmsSettings.submitEvent = communication.events.tickets.saveSmsSettings;
    formSettingsSmsSettings.afterDisplayData = function(formSettings,data) {
        console.log('data',data);
        let enableSMS = data.Data.EnableSMS === true;
        let enableEmail = data.Data.EnableEmail === true;
        if (enableSMS || enableEmail) {
            $$('#tickets-enable-sms-mode').parentNode.vertexToggle.check();
        }
        else {
            $$('#tickets-enable-sms-mode').parentNode.vertexToggle.uncheck();
        }
    };
    formSettingsSmsSettings.beforeSubmit = function(formSettings,data) {
        console.log('data to be sent',data);
        if (data.Emails.length > 0) {
            data.EnableEmail = true;
        }
        if (data.PhoneNumbers.length > 0) {
            data.EnableSMS = true;
        }
        return data;
    };

    on('tickets/tab/smsSettings', function(params){
        formSettingsSmsSettings.endpointId = params.tableSettings.endpointId;
        trigger('form/init', {formSettings: formSettingsSmsSettings});
        trigger('form/getData', {formSettings: formSettingsSmsSettings});
    });

})();