let aftTabNotificationSettings = (function () {
    let formSettingsNotification = {};
    formSettingsNotification.formContainerSelector = '#aft-tabs-notification-settings-info';
    formSettingsNotification.getData = communication.events.aft.transactions.getNotificationSettings;
    formSettingsNotification.submitEvent = communication.events.aft.transactions.saveNotificationSettings;

    formSettingsNotification.afterDisplayData = function (formSettings, data) {
        let enableNotification = data.Data.EnableNotification === true;
        let enableEmail = data.Data.EnableEmail === true;

        if (enableNotification) {
            $$('#aft-enable-notification-mode').parentNode.vertexToggle.check();
        }
        else {
            $$('#aft-enable-notification-mode').parentNode.vertexToggle.uncheck();
        }
    };
    formSettingsNotification.beforeSubmit = function (formSettings, data) {
        console.log('data to be sent', data);
        //if emails or phone first field is empty arrays has always one element with value of empty string
        if ($$('#aft-enable-notification-mode').parentNode.vertexToggle.getState()) {
            if (data.EmailList[data.EmailList.length - 1] === '') {
                data.EmailList.pop();
            }
            if (data.PhoneNumberList[data.PhoneNumberList.length - 1] === '') {
                data.PhoneNumberList.pop();
            }
            data.EnableEmail = data.EmailList.length > 0;
            data.EnableSMS = data.PhoneNumberList.length > 0;
        }
        else {
            data.EnableNotification = false;
            data.PhoneNumbers = [];
            data.Emails = [];
        }
        return data;
    };


    on('aft/tab/notification', function (params) {
        formSettingsNotification.endpointId = params.endpointId;
        trigger('form/init', { formSettings: formSettingsNotification });
        trigger('form/getData', { formSettings: formSettingsNotification });
    });
})();