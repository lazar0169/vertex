let ticketsSmsSettings = (function(){
    let formSettingsSmsSettings = {};
    formSettingsSmsSettings.formContainerSelector = '#tickets-sms-settings-tab-info';
    formSettingsSmsSettings.getData = communication.events.tickets.showSmsSettings;
    formSettingsSmsSettings.submitEvent = communication.events.tickets.saveSmsSettings;
    formSettingsSmsSettings.afterDisplayData = function(formSettings,data) {
        console.log('data',data);
        let enableSMS = data.Data.EnableSms === true;
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
        //if emails or phone first field is empty arrays has always one element with value of empty string
        if ($$('#tickets-enable-sms-mode').parentNode.vertexToggle.getState()) {
            if (data.Emails[data.Emails.length - 1] === '') {
                data.Emails.pop();
            }
            if (data.PhoneNumbers[data.PhoneNumbers.length - 1] === '') {
                data.PhoneNumbers.pop();
            }
            data.EnableEmail = data.Emails.length > 0;
            data.EnableSMS = data.PhoneNumbers.length > 0;
        }
        else {
            data.EnableEmail = false;
            data.EnableSMS = false;
            data.PhoneNumbers = [];
            data.Emails = [];
        }
        return data;
    };

    on('tickets/tab/smsSettings', function(params){
        formSettingsSmsSettings.endpointId = params.tableSettings.endpointId;
        trigger('form/init', {formSettings: formSettingsSmsSettings});
        trigger('form/getData', {formSettings: formSettingsSmsSettings});
    });
})();