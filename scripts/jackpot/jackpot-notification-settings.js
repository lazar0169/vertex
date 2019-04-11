let jackpotNotificationSettings = (function () {

    let enumSort = {
        0: 'None',
        1: 'OrdinalNumber',
        2: 'Value'
    }

    let jackpotNotificationSave = $$('#jackpot-notification-save').children[0];
    jackpotNotificationSave.onclick = function () {
        console.log('kliknuto')
    }
    // let jackpotNotificationValue = $$('#jackpot-notification-value');
    // let formSettingsTransaction = {};
    // formSettingsTransaction.formContainerSelector = '#jackpot-notification-settings-tab-info';
    // formSettingsTransaction.getData = communication.events.jackpots.getJackpotSettings;
    // // formSettingsTransaction.submitEvent = communication.events.aft.transactions.saveBasicSettings;
    // formSettingsTransaction.populateData = 'form/fillFormData';


    // // formSettingsTransaction.afterDisplayData = function (formSettings, data) {
    // //     let enableSMS = data.Data.EnableSms === true;
    // //     let enableEmail = data.Data.EnableEmail === true;

    // //     if (enableSMS || enableEmail) {
    // //         $$('#jackpot-enable-notification-checke').parentNode.vertexToggle.check();
    // //     }
    // //     else {
    // //         $$('#jackpot-enable-notification-check').parentNode.vertexToggle.uncheck();
    // //     }
    // // };

    // on('jackpot/get-jackpot-notification-settings', function (params) {
    //     let EntryData = jackpots.getEndpointId()
    //     trigger('form/init', { formSettings: formSettingsTransaction });
    //     let data = {}
    //     data.successAction = 'jackpot/show-jackpot-notification-settings'
    //     trigger(communication.events.jackpots.getJackpotSettings, { data, EntryData });
    // });

    on('jackpot/show-jackpot-notification-settings', function (params) {
        let data = params.data.Data;
        trigger('fill/jackpot-notification', { params });

        // if (data.EnableSMS || data.EnableEmail) {
        //     $$('#jackpot-enable-transaction-mode').parentNode.vertexToggle.check();
        // }
        // else {
        //     $$('#jackpot-enable-transaction-mode').parentNode.vertexToggle.uncheck();
        // }
        // jackpotNotificationValue.value = formatFloatValue(data.DailyLimit / 100);

        console.log(data)
    });
    let formSettingsSmsSettings = {};
    formSettingsSmsSettings.formContainerSelector = '#jackpot-notification-settings-tab-info';
    formSettingsSmsSettings.getData = communication.events.jackpots.getJackpotSettings;
    // formSettingsSmsSettings.submitEvent = communication.events.tickets.saveSmsSettings;
    checkboxChangeState.radioClick($$('#jackpot-sort-by'));

    formSettingsSmsSettings.afterDisplayData = function (formSettings, data) {
        let enableSMS = data.Data.EnableSms === true;
        let enableEmail = data.Data.EnableEmail === true;

        if (enableSMS || enableEmail) {
            $$('#jackpot-enable-transaction-mode').parentNode.vertexToggle.check();
        }
        else {
            $$('#jackpot-enable-transaction-mode').parentNode.vertexToggle.uncheck();
        }
    };


    on('jackpot/tab/notification-settings', function (params) {
        formSettingsSmsSettings.endpointId = params.endpointId;
        trigger('form/init', { formSettings: formSettingsSmsSettings });
        trigger('form/getData', { formSettings: formSettingsSmsSettings });
        // let EntryData = jackpots.getEndpointId()
        // let data = {}
        // data.successAction = 'jackpot/show-jackpot-notification-settings'
        // trigger(communication.events.jackpots.getJackpotSettings, { data, EntryData });
    });
    
    return {
        enumSort
    }
})();