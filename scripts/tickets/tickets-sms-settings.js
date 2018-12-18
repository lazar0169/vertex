let ticketsSmsSettings = (function(){

    let formSettingsSmsSettings = {};
    formSettingsSmsSettings.formContainerSelector = '#tickets-sms-settings-tab-info';
    formSettingsSmsSettings.fillEvent = 'communicate/tickets/showSmsSettings';
    formSettingsSmsSettings.submitEvent = 'communicate/tickets/saveSmsSettings';

    on('tickets/tab/smsSettings', function(params){
        formSettingsSmsSettings.endpointId = params.tableSettings.endpointId;

        let tab = $$('#tickets-sms-settings-tab-info');
        let checkboxes = tab.getElementsByClassName('vertex-form-checkbox');
        for (let i = 0;i<checkboxes.length;i++) {
            let cb = checkboxes[i];
            toggle.generate({element:cb});
        }

        trigger('form/init', {formSettings: formSettingsSmsSettings});
        trigger('form/getData', {formSettings: formSettingsSmsSettings});
    });

})();