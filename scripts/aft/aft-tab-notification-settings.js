let aftTabNotificationSettings = (function(){

    let formSettingsNotification = {};
    formSettingsNotification.formContainerSelector = '#aft-tabs-notification-settings-info';
    formSettingsNotification.fillEvent = communication.events.aft.transactions.getNotificationSettings;
    formSettingsNotification.submitEvent = communication.events.aft.transactions.saveNotificationSettings;

    on('aft/tab/notification', function(params){
        formSettingsNotification.endpointId = params.endpointId;
        trigger('form/init', {formSettings: formSettingsNotification});
        trigger('form/getData', {formSettings: formSettingsNotification});
    });
})();