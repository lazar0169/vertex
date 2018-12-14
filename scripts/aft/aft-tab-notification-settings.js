let aftTabNotificationSettings = (function(){

    let formSettingsNotification = {};
    formSettingsNotification.formContainerSelector = '#aft-tabs-notification-settings-info';
    formSettingsNotification.fillEvent = 'communicate/aft/getNotificationSettings';
    formSettingsNotification.submitEvent = 'communicate/aft/saveNotificationSettings';

    on('aft/tab/notification', function(params){
        formSettingsNotification.endpointId = params.tableSettings.endpointId;
        trigger('form/init', {formSettings: formSettingsNotification});
        trigger('form/getData', {formSettings: formSettingsNotification});
    });

})();