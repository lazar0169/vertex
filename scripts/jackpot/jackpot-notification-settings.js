let jackpotNotificationSettings = (function () {
    let enumSort = {
        0: 'None',
        1: 'OrdinalNumber',
        2: 'Value'
    }
    let formSettingsSmsSettings = {};
    formSettingsSmsSettings.formContainerSelector = '#jackpot-notification-settings-tab-info';
    formSettingsSmsSettings.getData = communication.events.jackpots.getJackpotSettings;
    formSettingsSmsSettings.submitEvent = communication.events.jackpots.setJackpotSettings;
    checkboxChangeState.radioClick($$('#jackpot-sort-by'));
    formSettingsSmsSettings.afterDisplayData = function (formSettings, data) {
        let enableSMS = data.Data.EnableSms === true;
        let enableEmail = data.Data.EnableEmail === true;
        if (enableSMS || enableEmail) {
            $$('#jackpot-enable-notification-mode').parentNode.vertexToggle.check();
        } else {
            $$('#jackpot-enable-notification-mode').parentNode.vertexToggle.uncheck();
        }
    };
    formSettingsSmsSettings.beforeSubmit = function (formSettings, data) {
        // console.log('data to be sent', data);
        if ($$('#jackpot-enable-notification-mode').parentNode.vertexToggle.getState()) {
            if (data.Email[data.Email.length - 1] === '') {
                data.Email.pop();
            }
            if (data.PhoneNumber[data.PhoneNumber.length - 1] === '') {
                data.PhoneNumber.pop();
            }
            data.EnableEmail = data.Email.length > 0;
            data.EnableSMS = data.PhoneNumber.length > 0;
        }
        else {
            data.EnableEmail = false;
            data.EnableSMS = false;
        }
        let jackpotId = jackpots.getEndpointId();
        data.EndpointId = jackpotId.EndpointId;
        data.Sort = parseInt(checkboxChangeState.getRadioState($$('#jackpot-sort-by')));
        return data;
    };
    on('jackpot/tab/notification-settings', function (params) {
        formSettingsSmsSettings.endpointId = params.endpointId;
        trigger('form/init', { formSettings: formSettingsSmsSettings });
        trigger('form/getData', { formSettings: formSettingsSmsSettings });
    });
    return {
        enumSort
    }
})();